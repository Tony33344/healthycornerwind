# 🚀 DEPLOY DATABASE NOW - Step by Step

**Project:** healthy corner  
**Supabase Project:** jwxenutezijwyrguqicv  
**Status:** ✅ Connected and Ready

---

## ⚡ QUICK DEPLOY (5 Minutes)

### Step 1: Open Supabase Dashboard

Click this link:
👉 **https://supabase.com/dashboard/project/jwxenutezijwyrguqicv/editor**

### Step 2: Deploy Schema

1. Click **"SQL Editor"** in left sidebar
2. Click **"+ New query"** button
3. Copy **ALL** of this file: `supabase/migrations/001_create_schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. Wait for **"Success"** message (should take ~2 seconds)

### Step 3: Load Sample Data

1. Click **"+ New query"** again
2. Copy **ALL** of this file: `supabase/seed.sql`
3. Paste into the SQL editor
4. Click **"Run"**
5. Wait for **"Success"** message

### Step 4: Verify Tables

1. Click **"Table Editor"** in left sidebar
2. You should see **10 tables**:
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

### Step 5: Test It!

Run the test script:
```bash
bash TEST_API_ENDPOINTS.sh
```

You should see **DATA** in the responses now! 🎉

---

## 🎯 What This Deploys

### 10 Database Tables

**1. services** (5 sample items)
- Yoga sessions
- Ice bathing
- Workshops
- Wellness packages

**2. menu_items** (6 sample items)
- Protein bowls
- Smoothies
- Snacks
- All with allergen info

**3. schedules** (~20 weekly slots)
- Activities throughout the week
- Different instructors
- Capacity set

**4. bookings** (empty, ready for use)
- With capacity check trigger!
- Prevents overbooking

**5. orders** (empty, ready for use)
- E-commerce orders

**6. carts** (empty, ready for use)
- Shopping cart storage

**7. testimonials** (3 sample reviews)
- Guest feedback

**8. gallery_images** (8 sample images)
- Photo references

**9. pages** (empty, ready for CMS)
- Content management

**10. newsletter_subscribers** (empty)
- Email list

---

## 🔐 Security Features Deployed

### Row Level Security (RLS)
✅ **Enabled on ALL 10 tables**

### Policies Created:
- **Public read** for published content
- **Admin write** for all tables
- **User-scoped** for bookings/orders
- **Protected** newsletter list

### Triggers Created:
- **updated_at** - Auto-updates timestamp
- **capacity_check** - Prevents overbooking

---

## 🧪 After Deployment Testing

### Test 1: Check Tables
```bash
# In Supabase dashboard, go to Table Editor
# Count should be:
services: 5 rows
menu_items: 6 rows
schedules: ~20 rows
testimonials: 3 rows
gallery_images: 8 rows
```

### Test 2: Test APIs
```bash
bash TEST_API_ENDPOINTS.sh
```

All should return **DATA** now!

### Test 3: Test Admin
Visit: http://localhost:3000/admin/dashboard

Should show:
- ✅ 5 services
- ✅ 6 menu items
- ✅ Statistics updated

---

## ✅ SUCCESS CHECKLIST

After deployment, verify:

- [ ] All 10 tables created
- [ ] RLS enabled on all tables
- [ ] Triggers created (updated_at, capacity_check)
- [ ] Sample data loaded
- [ ] API test script returns data
- [ ] Admin dashboard shows counts
- [ ] Services page displays items
- [ ] Menu page shows food items

---

## 🆘 Troubleshooting

### Issue: "Success" but no tables?
**Fix:** Make sure you copied the ENTIRE SQL file. It's 450+ lines.

### Issue: "Permission denied" errors?
**Fix:** Check you're logged into the correct Supabase project.

### Issue: API still returns empty?
**Fix:** 
1. Verify tables have data in Table Editor
2. Check RLS policies are created
3. Restart local server: `npm start`

### Issue: Capacity check not working?
**Fix:** Verify the trigger was created:
```sql
-- Run in SQL Editor
SELECT * FROM pg_trigger WHERE tgname = 'check_booking_capacity';
```

---

## 📊 What Happens After

### APIs Will Return Real Data
```bash
GET /api/services
# Returns 5 services from database

GET /api/menu
# Returns 6 menu items from database

GET /api/schedules
# Returns ~20 schedule slots grouped by day
```

### Admin Will Manage Real Data
- Create new services
- Update menu items
- View bookings
- Manage schedule
- Everything saves to database!

### Booking System Goes Live
- Users can book activities
- Capacity checks prevent overbooking
- Real-time availability

---

## 🎯 READY?

**Just follow Steps 1-4 above!**

It takes **5 minutes** and then your entire platform is **100% operational**! 🚀

---

**Dashboard Link:**
https://supabase.com/dashboard/project/jwxenutezijwyrguqicv/editor

**GO! 🎉**
