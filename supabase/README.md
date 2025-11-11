# Supabase Database Setup

## Quick Start

### 1. Run Migration in Supabase SQL Editor

1. Go to: https://app.supabase.com/project/jwxenutezijwyrguqicv/sql
2. Copy the contents of `migrations/001_initial_schema.sql`
3. Paste into SQL Editor
4. Click "Run" to execute

### 2. Verify Tables Created

Check that all 10 tables exist:
- ✅ services
- ✅ menu_items
- ✅ schedules
- ✅ bookings
- ✅ orders
- ✅ carts
- ✅ testimonials
- ✅ gallery_images
- ✅ pages
- ✅ newsletter_subscribers

### 3. Create Admin User

1. Go to: https://app.supabase.com/project/jwxenutezijwyrguqicv/auth/users
2. Click "Add user" → Create with email/password
3. Run SQL to set admin role:

```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-admin@example.com';
```

### 4. Set Up Storage Buckets

1. Go to: https://app.supabase.com/project/jwxenutezijwyrguqicv/storage/buckets
2. Create buckets:
   - `gallery` (public)
   - `services` (public)
   - `menu` (public)

## Database Schema Overview

### Multilingual Support
All content tables support 4 languages:
- `_sl` - Slovenian
- `_nl` - Dutch
- `_en` - English
- `_de` - German

### Row Level Security (RLS)
All tables have RLS enabled with policies:
- Public: Can view published content
- Users: Can manage own bookings/orders/cart
- Admin: Can manage everything

### Triggers
- Auto-update `updated_at` on all tables
- Booking capacity check before insert

## Next Steps

After running migration:
1. Create admin user
2. Set up storage buckets
3. Seed initial data (optional)
4. Test RLS policies
