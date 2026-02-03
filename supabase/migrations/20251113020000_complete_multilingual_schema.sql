-- Complete multilingual schema for all content tables
-- Ensures all user-facing content has _sl, _nl, _en, _de fields

BEGIN;

-- Services table: ensure all multilingual fields exist
ALTER TABLE IF EXISTS public.services
  ADD COLUMN IF NOT EXISTS name_sl TEXT,
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS name_nl TEXT,
  ADD COLUMN IF NOT EXISTS name_de TEXT,
  ADD COLUMN IF NOT EXISTS description_sl TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS description_nl TEXT,
  ADD COLUMN IF NOT EXISTS description_de TEXT;

-- Menu items table: ensure all multilingual fields exist
ALTER TABLE IF EXISTS public.menu_items
  ADD COLUMN IF NOT EXISTS name_sl TEXT,
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS name_nl TEXT,
  ADD COLUMN IF NOT EXISTS name_de TEXT,
  ADD COLUMN IF NOT EXISTS description_sl TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS description_nl TEXT,
  ADD COLUMN IF NOT EXISTS description_de TEXT,
  ADD COLUMN IF NOT EXISTS ingredients_sl TEXT,
  ADD COLUMN IF NOT EXISTS ingredients_en TEXT,
  ADD COLUMN IF NOT EXISTS ingredients_nl TEXT,
  ADD COLUMN IF NOT EXISTS ingredients_de TEXT;

-- Gallery images: ensure multilingual titles exist (already added in previous migration)
-- This is idempotent so safe to run again
ALTER TABLE IF EXISTS public.gallery_images
  ADD COLUMN IF NOT EXISTS title_sl TEXT,
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_nl TEXT,
  ADD COLUMN IF NOT EXISTS title_de TEXT,
  ADD COLUMN IF NOT EXISTS alt_text_sl TEXT,
  ADD COLUMN IF NOT EXISTS alt_text_en TEXT,
  ADD COLUMN IF NOT EXISTS alt_text_nl TEXT,
  ADD COLUMN IF NOT EXISTS alt_text_de TEXT;

-- Testimonials: ensure multilingual comments exist (already added in previous migration)
ALTER TABLE IF EXISTS public.testimonials
  ADD COLUMN IF NOT EXISTS comment_sl TEXT,
  ADD COLUMN IF NOT EXISTS comment_en TEXT,
  ADD COLUMN IF NOT EXISTS comment_nl TEXT,
  ADD COLUMN IF NOT EXISTS comment_de TEXT;

-- Blog posts (if exists): add multilingual support
ALTER TABLE IF EXISTS public.blog_posts
  ADD COLUMN IF NOT EXISTS title_sl TEXT,
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_nl TEXT,
  ADD COLUMN IF NOT EXISTS title_de TEXT,
  ADD COLUMN IF NOT EXISTS content_sl TEXT,
  ADD COLUMN IF NOT EXISTS content_en TEXT,
  ADD COLUMN IF NOT EXISTS content_nl TEXT,
  ADD COLUMN IF NOT EXISTS content_de TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_sl TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_en TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_nl TEXT,
  ADD COLUMN IF NOT EXISTS excerpt_de TEXT;

-- FAQ (if exists): add multilingual support
ALTER TABLE IF EXISTS public.faqs
  ADD COLUMN IF NOT EXISTS question_sl TEXT,
  ADD COLUMN IF NOT EXISTS question_en TEXT,
  ADD COLUMN IF NOT EXISTS question_nl TEXT,
  ADD COLUMN IF NOT EXISTS question_de TEXT,
  ADD COLUMN IF NOT EXISTS answer_sl TEXT,
  ADD COLUMN IF NOT EXISTS answer_en TEXT,
  ADD COLUMN IF NOT EXISTS answer_nl TEXT,
  ADD COLUMN IF NOT EXISTS answer_de TEXT;

-- Create indexes for better query performance on multilingual content
CREATE INDEX IF NOT EXISTS idx_services_name_en ON public.services(name_en);
CREATE INDEX IF NOT EXISTS idx_services_name_sl ON public.services(name_sl);
CREATE INDEX IF NOT EXISTS idx_services_name_nl ON public.services(name_nl);
CREATE INDEX IF NOT EXISTS idx_services_name_de ON public.services(name_de);

CREATE INDEX IF NOT EXISTS idx_menu_items_name_en ON public.menu_items(name_en);
CREATE INDEX IF NOT EXISTS idx_menu_items_name_sl ON public.menu_items(name_sl);
CREATE INDEX IF NOT EXISTS idx_menu_items_name_nl ON public.menu_items(name_nl);
CREATE INDEX IF NOT EXISTS idx_menu_items_name_de ON public.menu_items(name_de);

-- Add helpful comments
COMMENT ON COLUMN public.services.name_sl IS 'Service name in Slovenian';
COMMENT ON COLUMN public.services.name_en IS 'Service name in English';
COMMENT ON COLUMN public.services.name_nl IS 'Service name in Dutch';
COMMENT ON COLUMN public.services.name_de IS 'Service name in German';

COMMENT ON COLUMN public.menu_items.name_sl IS 'Menu item name in Slovenian';
COMMENT ON COLUMN public.menu_items.name_en IS 'Menu item name in English';
COMMENT ON COLUMN public.menu_items.name_nl IS 'Menu item name in Dutch';
COMMENT ON COLUMN public.menu_items.name_de IS 'Menu item name in German';

COMMIT;
