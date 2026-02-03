# 🚀 Supabase Setup Guide - healthy corner

**Project Ref:** jwxenutezijwyrguqicv  
**URL:** https://jwxenutezijwyrguqicv.supabase.co

---

## ✅ QUICK SETUP (5 Minutes)

### Step 1: Deploy Database Schema

1. **Go to Supabase Dashboard:**
   https://supabase.com/dashboard/project/jwxenutezijwyrguqicv

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "+ New query"

3. **Run the Schema Migration**
   - Copy contents from: `supabase/migrations/001_create_schema.sql`
   - Paste into SQL Editor
   - Click "Run" (or Ctrl+Enter)
   - Wait for "Success" message

### Step 2: Load Sample Data (Optional)

1. **In SQL Editor, create new query**

2. **Run the Seed Data**
   - Copy contents from: `supabase/seed.sql`
   - Paste into SQL Editor  
   - Click "Run"
   - Wait for "Success"

### Step 3: Verify Tables

Go to "Table Editor" and verify these tables exist:
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

### Step 4: Test API Connection

The site is already configured with:
```
NEXT_PUBLIC_SUPABASE_URL=https://jwxenutezijwyrguqicv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Just rebuild and test!

---

## 🧪 TESTING THE CONNECTION

### Test 1: Services API
```bash
curl http://localhost:3000/api/services
```

Expected: JSON array of services

### Test 2: Menu API
```bash
curl http://localhost:3000/api/menu
```

Expected: JSON array of menu items

### Test 3: Admin Dashboard
Visit: http://localhost:3000/admin/dashboard

Should show:
- Statistics
- Quick action cards
- All management sections

---

## 🗄️ DATABASE SCHEMA OVERVIEW

### Tables Created (10 total)

**1. services**
- Wellness services catalog
- RLS: Public read, admin write
- Triggers: updated_at

**2. menu_items**
- Food & beverage items
- RLS: Public read for published, admin write
- Triggers: updated_at

**3. schedules**
- Weekly activity calendar
- RLS: Public read, admin write
- Triggers: updated_at

**4. bookings**
- User reservations
- RLS: User can read own, admin can read all
- Triggers: updated_at, capacity_check
- **Capacity enforcement!**

**5. orders**
- E-commerce orders
- RLS: User can read own, admin can read all
- Triggers: updated_at

**6. carts**
- Shopping cart storage
- RLS: User can manage own
- Triggers: updated_at

**7. testimonials**
- Guest reviews
- RLS: Public read published, admin write
- Triggers: updated_at

**8. gallery_images**
- Photo library
- RLS: Public read published, admin write
- Triggers: updated_at

**9. pages**
- CMS content pages
- RLS: Public read published, admin write
- Triggers: updated_at

**10. newsletter_subscribers**
- Email list
- RLS: Admin only
- No public access

---

## 🔐 SECURITY FEATURES

### Row Level Security (RLS)

**All tables have RLS enabled!**

**Public Read Policies:**
```sql
-- Example: services table
CREATE POLICY "Anyone can view published services"
ON services FOR SELECT
USING (status = 'published' AND deleted_at IS NULL);
```

**Admin Write Policies:**
```sql
-- Example: services table
CREATE POLICY "Admins can manage services"
ON services FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');
```

**User-Scoped Policies:**
```sql
-- Example: bookings table
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);
```

### Triggers

**1. Updated At Trigger**
Automatically updates `updated_at` on any row change

**2. Capacity Check Trigger**
Prevents overbooking:
```sql
-- On bookings insert/update
-- Counts existing bookings for slot
-- Compares to schedule.capacity
-- Raises exception if full
```

---

## 📊 SAMPLE DATA PROVIDED

### Services (5 items)
1. Morning Yoga Session
2. Ice Bathing Experience
3. Wellness Workshop
4. Weekend Wellness Package
5. Meditation & Breathwork

### Menu Items (6 items)
1. Protein Bowl
2. Energy Smoothie
3. Nut Mix Snack
4. Vegan Wrap
5. Green Juice
6. Chia Pudding

### Schedules (~20 slots)
- Activities throughout the week
- Various times and instructors
- Proper capacity set

### Gallery Images (8 images)
- Categorized photos
- Published status
- Display order

### Testimonials (3 reviews)
- Sample guest reviews
- Published status
- Ratings

---

## 🧪 MANUAL TESTING CHECKLIST

### Database Tests

- [ ] Run schema migration successfully
- [ ] Run seed data successfully
- [ ] Verify all 10 tables created
- [ ] Check RLS policies active
- [ ] Test triggers working

### API Tests

- [ ] GET /api/services returns data
- [ ] GET /api/menu returns data
- [ ] GET /api/schedules returns grouped data
- [ ] POST /api/bookings creates booking
- [ ] Capacity check prevents overbooking
- [ ] POST /api/contact validates email
- [ ] POST /api/newsletter prevents duplicates

### Admin Tests

- [ ] Dashboard shows statistics
- [ ] Services page lists items
- [ ] Can filter services by category
- [ ] Menu page shows items with allergens
- [ ] Can filter menu by category
- [ ] Bookings page shows reservations
- [ ] Can update booking status
- [ ] Schedule shows weekly calendar
- [ ] Gallery shows images

### Frontend Tests

- [ ] Homepage loads
- [ ] Services page displays catalog
- [ ] Menu page shows food items
- [ ] Schedule displays calendar
- [ ] Gallery shows photos
- [ ] Contact form submits
- [ ] Language switcher works
- [ ] All 4 languages display correctly

---

## 🚀 DEPLOY TO NETLIFY

### Set Environment Variables

Go to: https://app.netlify.com/sites/healthycornerspec1/settings/deploys

Add under "Environment variables":
```
NEXT_PUBLIC_SUPABASE_URL=https://jwxenutezijwyrguqicv.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eGVudXRlemlqd3lyZ3VxaWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Nzk5MjgsImV4cCI6MjA3ODQ1NTkyOH0.cZovlDHBr4zXwIlhMnAq4VqTziJf-tcaySBJIk4fS9Y
```

Then click "Trigger deploy"

---

## 🎯 VERIFICATION STEPS

### After Database Setup:

**Test API:**
```bash
# Should return services from database
curl http://localhost:3000/api/services

# Should return menu items from database
curl http://localhost:3000/api/menu
```

**Test Admin:**
1. Go to http://localhost:3000/admin/dashboard
2. Check statistics update
3. Go to Services management
4. Verify services load from database

**Test Booking:**
1. Try to create a booking
2. Fill slot to capacity
3. Try to overbook
4. Should see "slot is full" error

---

## 📞 QUICK REFERENCE

**Supabase Dashboard:**
https://supabase.com/dashboard/project/jwxenutezijwyrguqicv

**Database URL:**
https://jwxenutezijwyrguqicv.supabase.co

**API URL:**
https://jwxenutezijwyrguqicv.supabase.co/rest/v1/

**Tables:**
- 10 total
- All with RLS enabled
- All with triggers

**Files:**
- Schema: `supabase/migrations/001_create_schema.sql`
- Seed: `supabase/seed.sql`

---

## 🆘 TROUBLESHOOTING

### Issue: Tables not appearing
**Solution:** Re-run migration SQL in SQL Editor

### Issue: RLS blocking queries
**Solution:** Check if user is authenticated or use service role key for admin

### Issue: Capacity check not working
**Solution:** Verify trigger was created in migration

### Issue: API returning empty arrays
**Solution:** Run seed data SQL to populate tables

---

**Ready to deploy! Follow Step 1-3 above!** 🚀
