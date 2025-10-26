-- ============================================
-- HEALTHY CORNER DATABASE SCHEMA
-- Complete setup for Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL CHECK (guests >= 1 AND guests <= 20),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to insert bookings
CREATE POLICY "Allow public insert bookings" 
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (true);

-- RLS Policy: Allow authenticated users to view bookings
CREATE POLICY "Allow authenticated view bookings" 
ON public.bookings
FOR SELECT
TO authenticated
USING (true);

-- RLS Policy: Allow authenticated users to update bookings
CREATE POLICY "Allow authenticated update bookings" 
ON public.bookings
FOR UPDATE
TO authenticated
USING (true);

-- ============================================
-- TABLE 2: CONTACT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_email ON public.contact_messages(email);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to insert messages
CREATE POLICY "Allow public insert messages" 
ON public.contact_messages
FOR INSERT
TO anon
WITH CHECK (true);

-- RLS Policy: Allow authenticated users to view messages
CREATE POLICY "Allow authenticated view messages" 
ON public.contact_messages
FOR SELECT
TO authenticated
USING (true);

-- RLS Policy: Allow authenticated users to update messages
CREATE POLICY "Allow authenticated update messages" 
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (true);

-- ============================================
-- TABLE 3: SERVICES (Optional - for dynamic management)
-- ============================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  duration_minutes INTEGER,
  price_eur DECIMAL(10, 2),
  max_guests INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default services
INSERT INTO public.services (name, description, duration_minutes, max_guests, active) VALUES
  ('Yoga Class', 'Group yoga session for all levels', 60, 15, true),
  ('Wim Hof Workshop', 'Breathing techniques and cold exposure training', 120, 20, true),
  ('Ice Bath Session', 'Guided cold water immersion experience', 30, 8, true),
  ('Wellness Retreat (3 days)', 'Complete 3-day wellness program', 4320, 12, true),
  ('Wellness Retreat (7 days)', 'Intensive 7-day wellness program', 10080, 12, true),
  ('Private Session', 'One-on-one personalized wellness session', 90, 1, true),
  ('Group Event', 'Custom group wellness event', 180, 30, true)
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to read active services
CREATE POLICY "Allow public read active services" 
ON public.services
FOR SELECT
TO anon
USING (active = true);

-- RLS Policy: Allow authenticated users to manage services
CREATE POLICY "Allow authenticated manage services" 
ON public.services
FOR ALL
TO authenticated
USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for bookings
CREATE TRIGGER update_bookings_updated_at 
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for contact_messages
CREATE TRIGGER update_contact_messages_updated_at 
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for services
CREATE TRIGGER update_services_updated_at 
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Add admin email and password
-- 4. Use these credentials to login at /login
-- ============================================
