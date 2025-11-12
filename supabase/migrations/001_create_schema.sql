-- Healthy Corner Database Schema
-- Migration: 001_create_schema
-- Created: 2025-01-12

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- SERVICES TABLE (T016)
-- ================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_sl TEXT NOT NULL,
  name_nl TEXT NOT NULL,
  name_de TEXT NOT NULL,
  description_en TEXT,
  description_sl TEXT,
  description_nl TEXT,
  description_de TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  duration INTEGER CHECK (duration > 0), -- minutes
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

-- RLS Policies for services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone" 
  ON services FOR SELECT 
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Admins can insert services" 
  ON services FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update services" 
  ON services FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete services" 
  ON services FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================
-- MENU ITEMS TABLE (T017)
-- ================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_sl TEXT NOT NULL,
  name_nl TEXT NOT NULL,
  name_de TEXT NOT NULL,
  description_en TEXT,
  description_sl TEXT,
  description_nl TEXT,
  description_de TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  ingredients_en TEXT,
  ingredients_sl TEXT,
  ingredients_nl TEXT,
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

-- RLS Policies for menu_items
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu items are viewable by everyone" 
  ON menu_items FOR SELECT 
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Admins can insert menu items" 
  ON menu_items FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update menu items" 
  ON menu_items FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete menu items" 
  ON menu_items FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================
-- SCHEDULES TABLE (T018)
-- ================================================
CREATE TABLE IF NOT EXISTS schedules (
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

-- RLS Policies for schedules
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schedules are viewable by everyone" 
  ON schedules FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage schedules" 
  ON schedules FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================
-- BOOKINGS TABLE (T019)
-- ================================================
CREATE TABLE IF NOT EXISTS bookings (
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

CREATE UNIQUE INDEX unique_user_booking ON bookings(user_id, schedule_id, booking_date) WHERE status != 'cancelled';
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_schedule ON bookings(schedule_id);

-- RLS Policies for bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" 
  ON bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
  ON bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
  ON bookings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" 
  ON bookings FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage all bookings" 
  ON bookings FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================
-- ORDERS TABLE (T020)
-- ================================================
CREATE TABLE IF NOT EXISTS orders (
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
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- RLS Policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
  ON orders FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage all orders" 
  ON orders FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================
-- CARTS TABLE (T021)
-- ================================================
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carts_user ON carts(user_id);

-- RLS Policies for carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cart" 
  ON carts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart" 
  ON carts FOR ALL 
  USING (auth.uid() = user_id);

-- ================================================
-- TESTIMONIALS TABLE (T022)
-- ================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment_en TEXT,
  comment_sl TEXT,
  comment_nl TEXT,
  comment_de TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_testimonials_rating ON testimonials(rating);

-- RLS Policies for testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved testimonials are viewable by everyone" 
  ON testimonials FOR SELECT 
  USING (status = 'approved');

CREATE POLICY "Users can create testimonials" 
  ON testimonials FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage testimonials" 
  ON testimonials FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================
-- GALLERY IMAGES TABLE (T023)
-- ================================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT,
  title_sl TEXT,
  title_nl TEXT,
  title_de TEXT,
  image_url TEXT NOT NULL,
  category TEXT CHECK (category IN ('gallery', 'icebath', 'food')),
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gallery_status ON gallery_images(status);
CREATE INDEX idx_gallery_category ON gallery_images(category);
CREATE INDEX idx_gallery_order ON gallery_images(order_index);

-- RLS Policies for gallery_images
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published gallery images are viewable by everyone" 
  ON gallery_images FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admins can manage gallery images" 
  ON gallery_images FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================
-- PAGES TABLE FOR CMS (T024)
-- ================================================
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_sl TEXT NOT NULL,
  title_nl TEXT NOT NULL,
  title_de TEXT NOT NULL,
  content_en TEXT,
  content_sl TEXT,
  content_nl TEXT,
  content_de TEXT,
  meta_description_en TEXT,
  meta_description_sl TEXT,
  meta_description_nl TEXT,
  meta_description_de TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);

-- RLS Policies for pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published pages are viewable by everyone" 
  ON pages FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admins can manage pages" 
  ON pages FOR ALL 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================
-- NEWSLETTER SUBSCRIBERS TABLE (T025)
-- ================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);

-- RLS Policies for newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" 
  ON newsletter_subscribers FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own subscription" 
  ON newsletter_subscribers FOR UPDATE 
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can view all subscribers" 
  ON newsletter_subscribers FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ================================================
-- TRIGGERS FOR UPDATED_AT (T026)
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- BOOKING CAPACITY CHECK TRIGGER (T027)
-- ================================================
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

  -- Count current bookings for this schedule on this date
  SELECT COUNT(*) INTO current_bookings
  FROM bookings
  WHERE schedule_id = NEW.schedule_id
    AND booking_date = NEW.booking_date
    AND status NOT IN ('cancelled')
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);

  -- Check if capacity exceeded
  IF current_bookings >= schedule_capacity THEN
    RAISE EXCEPTION 'Booking capacity exceeded for this schedule slot';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_booking_capacity_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  WHEN (NEW.status != 'cancelled')
  EXECUTE FUNCTION check_booking_capacity();

-- ================================================
-- INITIAL SEED DATA
-- ================================================
COMMENT ON SCHEMA public IS 'Healthy Corner Wellness Platform Database';
