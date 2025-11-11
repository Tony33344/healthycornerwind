-- Healthy Corner Platform - Initial Database Schema
-- Feature: 001-wellness-platform
-- Created: 2025-01-12
-- Refs: specs/001-wellness-platform/plan/data-model.md

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: services
-- Purpose: Wellness packages and activities offered at the retreat
-- ============================================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_sl TEXT NOT NULL,
  name_nl TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_de TEXT NOT NULL,
  description_sl TEXT,
  description_nl TEXT,
  description_en TEXT,
  description_de TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  duration INTEGER CHECK (duration > 0),
  capacity INTEGER CHECK (capacity > 0),
  category TEXT NOT NULL CHECK (category IN ('Yoga', 'Ice Bathing', 'Workshops', 'Packages')),
  image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_services_status ON services(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_services_category ON services(category) WHERE deleted_at IS NULL;

COMMENT ON TABLE services IS 'Wellness packages and activities';
COMMENT ON COLUMN services.category IS 'Yoga, Ice Bathing, Workshops, or Packages';

-- ============================================================================
-- TABLE: menu_items
-- Purpose: Healthy food products available for purchase
-- ============================================================================
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_sl TEXT NOT NULL,
  name_nl TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_de TEXT NOT NULL,
  description_sl TEXT,
  description_nl TEXT,
  description_en TEXT,
  description_de TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  ingredients_sl TEXT,
  ingredients_nl TEXT,
  ingredients_en TEXT,
  ingredients_de TEXT,
  allergens TEXT[] DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('Snacks', 'Meals', 'Beverages', 'Supplements')),
  image_url TEXT,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_menu_items_status ON menu_items(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_menu_items_category ON menu_items(category) WHERE deleted_at IS NULL;

COMMENT ON TABLE menu_items IS 'Healthy food products for sale';
COMMENT ON COLUMN menu_items.allergens IS 'Array of allergen names';

-- ============================================================================
-- TABLE: schedules
-- Purpose: Weekly recurring time slots for activities
-- ============================================================================
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  time TIME NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  instructor TEXT,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schedules_day_time ON schedules(day_of_week, time);
CREATE INDEX idx_schedules_service ON schedules(service_id);

COMMENT ON TABLE schedules IS 'Weekly recurring activity time slots';
COMMENT ON COLUMN schedules.day_of_week IS '0=Sunday, 1=Monday, ..., 6=Saturday';

-- ============================================================================
-- TABLE: bookings
-- Purpose: User reservations for scheduled activities
-- ============================================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent double-booking: same user, same slot, same date
CREATE UNIQUE INDEX unique_user_booking 
  ON bookings(user_id, schedule_id, booking_date) 
  WHERE status != 'cancelled';

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_schedule ON bookings(schedule_id);

COMMENT ON TABLE bookings IS 'User reservations for activities';

-- ============================================================================
-- TABLE: orders
-- Purpose: Shop orders for menu items and products
-- ============================================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  order_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);

COMMENT ON TABLE orders IS 'Shop orders';
COMMENT ON COLUMN orders.order_number IS 'Format: HC-YYYYMMDD-XXXX';
COMMENT ON COLUMN orders.items IS 'Array of {menu_item_id, quantity, price, name}';

-- ============================================================================
-- TABLE: carts
-- Purpose: Persistent shopping cart for authenticated users
-- ============================================================================
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carts_user ON carts(user_id);

COMMENT ON TABLE carts IS 'Persistent shopping carts';
COMMENT ON COLUMN carts.items IS 'Array of {menu_item_id, quantity}';

-- ============================================================================
-- TABLE: testimonials
-- Purpose: Guest reviews and ratings
-- ============================================================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name TEXT NOT NULL,
  quote_sl TEXT NOT NULL,
  quote_nl TEXT NOT NULL,
  quote_en TEXT NOT NULL,
  quote_de TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_testimonials_rating ON testimonials(rating);

COMMENT ON TABLE testimonials IS 'Guest reviews and ratings';

-- ============================================================================
-- TABLE: gallery_images
-- Purpose: Photo gallery images
-- ============================================================================
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  caption_sl TEXT,
  caption_nl TEXT,
  caption_en TEXT,
  caption_de TEXT,
  alt_text_sl TEXT NOT NULL,
  alt_text_nl TEXT NOT NULL,
  alt_text_en TEXT NOT NULL,
  alt_text_de TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gallery_order ON gallery_images(display_order);

COMMENT ON TABLE gallery_images IS 'Photo gallery';

-- ============================================================================
-- TABLE: pages
-- Purpose: CMS-managed content pages
-- ============================================================================
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_sl TEXT NOT NULL,
  title_nl TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_de TEXT NOT NULL,
  content_sl TEXT,
  content_nl TEXT,
  content_en TEXT,
  content_de TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);

COMMENT ON TABLE pages IS 'CMS content pages';

-- ============================================================================
-- TABLE: newsletter_subscribers
-- Purpose: Email newsletter subscriptions
-- ============================================================================
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(subscribed_at) 
  WHERE unsubscribed_at IS NULL;

COMMENT ON TABLE newsletter_subscribers IS 'Newsletter email list';

-- ============================================================================
-- TRIGGERS: Auto-update timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TRIGGER: Booking capacity check
-- ============================================================================
CREATE OR REPLACE FUNCTION check_booking_capacity()
RETURNS TRIGGER AS $$
DECLARE
  schedule_capacity INTEGER;
  current_bookings INTEGER;
BEGIN
  -- Get schedule capacity
  SELECT capacity INTO schedule_capacity
  FROM schedules
  WHERE id = NEW.schedule_id;

  -- Count existing bookings for this slot and date
  SELECT COUNT(*) INTO current_bookings
  FROM bookings
  WHERE schedule_id = NEW.schedule_id
    AND booking_date = NEW.booking_date
    AND status IN ('pending', 'confirmed');

  -- Check if capacity exceeded
  IF current_bookings >= schedule_capacity THEN
    RAISE EXCEPTION 'Booking capacity exceeded for this time slot';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_booking_capacity_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION check_booking_capacity();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Services: Public can view published, admin can manage all
CREATE POLICY "Public can view published services"
  ON services FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Admin can manage services"
  ON services FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Menu Items: Public can view published, admin can manage all
CREATE POLICY "Public can view published menu items"
  ON menu_items FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Admin can manage menu items"
  ON menu_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Schedules: Public can view, admin can manage
CREATE POLICY "Public can view schedules"
  ON schedules FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage schedules"
  ON schedules FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Bookings: Users can view/create own, admin can manage all
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can manage all bookings"
  ON bookings FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Orders: Users can view own, admin can manage all
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admin can manage all orders"
  ON orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Carts: Users can manage own cart
CREATE POLICY "Users can view own cart"
  ON carts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart"
  ON carts FOR ALL
  USING (auth.uid() = user_id);

-- Testimonials: Public can view, admin can manage
CREATE POLICY "Public can view testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage testimonials"
  ON testimonials FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Gallery: Public can view, admin can manage
CREATE POLICY "Public can view gallery"
  ON gallery_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage gallery"
  ON gallery_images FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Pages: Public can view published, admin can manage all
CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admin can manage pages"
  ON pages FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Newsletter: Anyone can subscribe, admin can manage
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admin can manage newsletter"
  ON newsletter_subscribers FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- COMPLETED: Initial Schema Migration
-- Tasks: T016-T027 (Database Schema & Triggers)
-- ============================================================================
