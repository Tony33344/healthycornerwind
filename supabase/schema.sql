-- Healthy Corner Wellness Platform Database Schema
-- This schema defines all tables needed for the admin platform to manage schedules and bookings

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Services table - managed by admin
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(255) NOT NULL,
    name_sl VARCHAR(255) NOT NULL,
    name_nl VARCHAR(255) NOT NULL,
    name_de VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    price DECIMAL(10,2) NOT NULL,
    description_en TEXT,
    description_sl TEXT,
    description_nl TEXT,
    description_de TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedules table - managed by admin
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7), -- 1=Monday, 7=Sunday
    time TIME NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_id, day_of_week, time)
);

-- Bookings table - created by users, managed by admin
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    user_id UUID, -- Optional: for registered users
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    booking_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table - for admin platform access
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table - for admin configuration
CREATE TABLE settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_schedules_day_time ON schedules(day_of_week, time);
CREATE INDEX idx_schedules_service ON schedules(service_id);
CREATE INDEX idx_bookings_schedule ON bookings(schedule_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_user_email ON bookings(user_email);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for services and schedules (for website)
CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active schedules" ON schedules FOR SELECT USING (is_active = true);

-- Public can create bookings
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Admin full access (requires authentication)
CREATE POLICY "Admin full access to services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to schedules" ON schedules FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('business_name', 'Healthy Corner', 'Business name displayed on website'),
('business_email', 'info@healthycorner.com', 'Contact email for bookings'),
('business_phone', '+386 XX XXX XXX', 'Contact phone number'),
('timezone', 'Europe/Ljubljana', 'Business timezone'),
('booking_advance_days', '30', 'How many days in advance bookings can be made'),
('cancellation_hours', '24', 'Hours before session when free cancellation is allowed'),
('currency', 'EUR', 'Currency for pricing'),
('payment_required', 'false', 'Whether payment is required at booking time');

-- Sample data for development (remove in production)
INSERT INTO services (name_en, name_sl, name_nl, name_de, category, duration, price, image_url) VALUES
('Morning Yoga', 'Jutranja joga', 'Ochtend Yoga', 'Morgen Yoga', 'Yoga', 60, 25.00, '/images/yoga.jpg'),
('Ice Bathing', 'Ledene kopeli', 'IJsbaden', 'Eisbaden', 'Ice Bathing', 45, 35.00, '/images/ice-bath.jpg'),
('Wellness Workshop', 'Wellness delavnica', 'Wellness Workshop', 'Wellness Workshop', 'Workshops', 90, 45.00, '/images/workshop.jpg'),
('Evening Meditation', 'Večerna meditacija', 'Avondmeditatie', 'Abendmeditation', 'Meditation', 60, 20.00, '/images/meditation.jpg');

-- Sample schedules (remove in production)
INSERT INTO schedules (service_id, day_of_week, time, capacity) 
SELECT 
    s.id,
    d.day_of_week,
    t.time,
    CASE 
        WHEN s.category = 'Yoga' THEN 10
        WHEN s.category = 'Ice Bathing' THEN 6
        WHEN s.category = 'Workshops' THEN 12
        ELSE 8
    END as capacity
FROM services s
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS d(day_of_week)
CROSS JOIN (VALUES ('09:00'::time), ('11:00'::time), ('14:00'::time), ('16:00'::time)) AS t(time)
WHERE s.name_en IN ('Morning Yoga', 'Ice Bathing', 'Wellness Workshop')
LIMIT 20;
