-- Align remote schema with application expectations (non-destructive)
-- Adds missing columns used by API routes and seed.sql

BEGIN;

-- Newsletter subscribers: add status and unsubscribed_at if missing
ALTER TABLE IF EXISTS public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active','unsubscribed'));

ALTER TABLE IF EXISTS public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_newsletter_status ON public.newsletter_subscribers(status);

-- Gallery images: add multilingual titles and fields used by seed
ALTER TABLE IF EXISTS public.gallery_images
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_sl TEXT,
  ADD COLUMN IF NOT EXISTS title_nl TEXT,
  ADD COLUMN IF NOT EXISTS title_de TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('gallery','icebath','food')),
  ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft','published'));

CREATE INDEX IF NOT EXISTS idx_gallery_status ON public.gallery_images(status);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON public.gallery_images(order_index);

-- Testimonials: add fields used by app/seed while preserving existing columns
ALTER TABLE IF EXISTS public.testimonials
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS comment_en TEXT,
  ADD COLUMN IF NOT EXISTS comment_sl TEXT,
  ADD COLUMN IF NOT EXISTS comment_nl TEXT,
  ADD COLUMN IF NOT EXISTS comment_de TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending','approved','rejected'));

CREATE INDEX IF NOT EXISTS idx_testimonials_status ON public.testimonials(status);

-- Ensure soft-delete columns exist where app filters on deleted_at
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS public.menu_items ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Ensure order number index exists (no-op if already present)
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);

COMMIT;

