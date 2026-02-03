-- Fix RLS policies for admin access
-- Allow full access to all tables for authenticated users

BEGIN;

-- Enable RLS on all tables
ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (only for tables that exist)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services') THEN
    DROP POLICY IF EXISTS "services_policy" ON public.services;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'menu_items') THEN
    DROP POLICY IF EXISTS "menu_items_policy" ON public.menu_items;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'schedules') THEN
    DROP POLICY IF EXISTS "schedules_policy" ON public.schedules;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
    DROP POLICY IF EXISTS "bookings_policy" ON public.bookings;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
    DROP POLICY IF EXISTS "orders_policy" ON public.orders;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gallery_images') THEN
    DROP POLICY IF EXISTS "gallery_images_policy" ON public.gallery_images;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'testimonials') THEN
    DROP POLICY IF EXISTS "testimonials_policy" ON public.testimonials;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_subscribers') THEN
    DROP POLICY IF EXISTS "newsletter_policy" ON public.newsletter_subscribers;
  END IF;
END $$;

-- Create permissive policies for all operations
-- Services
CREATE POLICY "services_policy" ON public.services
  FOR ALL USING (true) WITH CHECK (true);

-- Menu Items  
CREATE POLICY "menu_items_policy" ON public.menu_items
  FOR ALL USING (true) WITH CHECK (true);

-- Schedules
CREATE POLICY "schedules_policy" ON public.schedules
  FOR ALL USING (true) WITH CHECK (true);

-- Bookings
CREATE POLICY "bookings_policy" ON public.bookings
  FOR ALL USING (true) WITH CHECK (true);

-- Orders
CREATE POLICY "orders_policy" ON public.orders
  FOR ALL USING (true) WITH CHECK (true);

-- Gallery Images
CREATE POLICY "gallery_images_policy" ON public.gallery_images
  FOR ALL USING (true) WITH CHECK (true);

-- Testimonials
CREATE POLICY "testimonials_policy" ON public.testimonials
  FOR ALL USING (true) WITH CHECK (true);

-- Newsletter Subscribers (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_subscribers') THEN
    EXECUTE 'CREATE POLICY "newsletter_policy" ON public.newsletter_subscribers FOR ALL USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policy
DROP POLICY IF EXISTS "profiles_policy" ON public.profiles;
CREATE POLICY "profiles_policy" ON public.profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Insert admin profile if it doesn't exist
INSERT INTO public.profiles (id, role, first_name, last_name, last_active_at)
SELECT 
  u.id,
  'admin',
  'Admin',
  'User',
  NOW()
FROM auth.users u
WHERE u.email = 'admin@healthycorner.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  last_active_at = NOW();

COMMIT;
