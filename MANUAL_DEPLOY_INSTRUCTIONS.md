# Manual Deploy Instructions for Supabase

Since the CLI pooler (eu-north-1) is unreachable, please run these steps manually in the Supabase Dashboard:

## 1. Access SQL Editor
Go to: https://supabase.com/dashboard/project/jwxenutezijwyrguqicv/sql

## 2. Run Schema Creation
Copy and paste the contents of this file:
`/home/jack/CascadeProjects/healthycornerspec/supabase/migrations/20251112214800_initial_schema_via_rest.sql`

Click **Run** to create all tables, indexes, RLS policies, and triggers.

## 3. Run Seed Data
After schema is created, run this file:
`/home/jack/CascadeProjects/healthycornerspec/supabase/migrations/20251112215000_seed_data.sql`

This will populate:
- 5 services (Yoga, Ice Bath, Workshop, Package)
- 5 menu items (drinks, smoothies, snacks, salads)
- 9 schedules across the week
- 3 gallery images
- 3 testimonials
- 2 newsletter subscribers

## 4. Verify Tables
After running both scripts, verify data exists by running:
```sql
SELECT 'services' as table_name, COUNT(*) as count FROM services
UNION ALL
SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL
SELECT 'schedules', COUNT(*) FROM schedules
UNION ALL
SELECT 'gallery_images', COUNT(*) FROM gallery_images
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers;
```

## 5. Test API Endpoints Locally
Once data is loaded, run the test script:
```bash
bash TEST_API_ENDPOINTS.sh
```

## 6. Start Development Server
```bash
npm run dev
```
Visit http://localhost:3000 to see the functional wellness platform.

## Notes
- RLS policies are enabled but permissive for development
- All tables have proper indexes for performance
- Updated_at triggers are configured
- Multilingual content (EN, DE, SL, NL) is included
