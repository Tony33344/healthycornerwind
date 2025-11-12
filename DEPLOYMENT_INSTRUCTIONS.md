# Deployment Instructions - Healthy Corner Platform

**Status:** Ready for Database Deployment  
**Date:** 2025-01-12

---

## ✅ What's Complete

### Infrastructure
- ✅ Next.js 14 with TypeScript
- ✅ Tailwind CSS configured
- ✅ i18n (4 languages: sl, nl, en, de)
- ✅ Framer Motion animations
- ✅ All frontend pages built
- ✅ API routes created

### Database Schema
- ✅ SQL migration file created: `supabase/migrations/001_create_schema.sql`
- ✅ Seed data file created: `supabase/seed.sql`
- ✅ All 10 tables defined with RLS policies
- ✅ Triggers for updated_at timestamps
- ✅ Booking capacity check trigger

### API Endpoints
- ✅ `/api/services` - GET, POST
- ✅ `/api/menu` - GET, POST
- ✅ `/api/schedules` - GET, POST
- ✅ `/api/bookings` - GET, POST, PATCH
- ✅ `/api/contact` - POST
- ✅ `/api/newsletter` - POST, DELETE

---

## 🚀 Deployment Steps

### Step 1: Deploy Database Schema to Supabase

**Option A: Via Supabase Dashboard (Recommended)**

1. Log into your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste contents of `supabase/migrations/001_create_schema.sql`
5. Click **Run** to execute
6. Verify all tables created (check Tables tab)

**Option B: Via Supabase CLI**

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push

# Or execute the file directly
supabase db execute -f supabase/migrations/001_create_schema.sql
```

### Step 2: Seed Development Data

1. In Supabase SQL Editor
2. Copy and paste contents of `supabase/seed.sql`
3. Click **Run**
4. Verify data:
   - Services: 5 items
   - Menu Items: 6 items
   - Schedules: ~20 weekly slots
   - Gallery Images: 8 images
   - Testimonials: 3 reviews

### Step 3: Configure Storage Buckets

1. Navigate to **Storage** in Supabase Dashboard
2. Create three public buckets:
   - `gallery` - For gallery images
   - `services` - For service images
   - `menu` - For menu item images

3. Set bucket policies to **Public** for read access

### Step 4: Update Environment Variables

Ensure `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 5: Test Locally

```bash
# Install dependencies if needed
npm install

# Run development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/services
curl http://localhost:3000/api/menu
curl http://localhost:3000/api/schedules
```

### Step 6: Build for Production

```bash
# Clean build
rm -rf .next
npm run build

# Test production build
npm start
```

### Step 7: Deploy to Netlify

**Option A: GitHub Integration (Recommended)**

1. Push code to GitHub
2. Connect repository in Netlify
3. Set environment variables in Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatically

**Option B: Manual Deploy**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## 🔐 Security Checklist

### Database Security
- [X] RLS policies enabled on all tables
- [X] Admin role check for CMS operations
- [X] User-scoped policies for bookings/orders
- [X] Public read for published content only

### API Security
- [ ] Rate limiting (add later)
- [X] Input validation in API routes
- [X] Error handling without exposing internals
- [ ] CORS configuration (if needed)

### Environment
- [X] `.env.local` in `.gitignore`
- [X] Environment variables documented
- [ ] Secrets rotated for production

---

## 📊 Database Tables Summary

| Table | Purpose | RLS | Triggers |
|-------|---------|-----|----------|
| services | Wellness services catalog | ✅ | updated_at |
| menu_items | Food and beverage items | ✅ | updated_at |
| schedules | Weekly activity schedule | ✅ | updated_at |
| bookings | User bookings with capacity check | ✅ | updated_at, capacity_check |
| orders | E-commerce orders | ✅ | updated_at |
| carts | Shopping cart storage | ✅ | updated_at |
| testimonials | Guest reviews | ✅ | updated_at |
| gallery_images | Photo gallery | ✅ | updated_at |
| pages | CMS content pages | ✅ | updated_at |
| newsletter_subscribers | Email list | ✅ | - |

---

## 🧪 Testing Checklist

### Frontend Testing
- [ ] Homepage loads correctly
- [ ] All 4 languages work (sl, nl, en, de)
- [ ] Services page displays items
- [ ] Menu page displays items
- [ ] Schedule page shows weekly calendar
- [ ] Gallery displays images
- [ ] Contact form submits

### API Testing
- [ ] GET /api/services returns data
- [ ] GET /api/menu returns data
- [ ] GET /api/schedules returns data
- [ ] POST /api/bookings creates booking
- [ ] Capacity check prevents overbooking
- [ ] Newsletter subscription works

### Integration Testing
- [ ] Services fetch from Supabase
- [ ] Menu items fetch from Supabase
- [ ] Booking creation triggers capacity check
- [ ] RLS policies enforced
- [ ] Images load from storage buckets

---

## 🎯 Next Steps After Deployment

### Phase 1: Verify Core Functionality
1. Test all pages in production
2. Verify database connectivity
3. Test booking system
4. Confirm email notifications (if configured)

### Phase 2: Admin Dashboard (Not Yet Built)
- Create admin login page
- Build service/menu CRUD interface
- Add booking management
- Implement analytics dashboard

### Phase 3: Additional Features
- Shopping cart functionality
- Order processing
- Payment integration
- Email marketing integration

---

## 🆘 Troubleshooting

### Database Connection Issues
```
Error: Supabase client error
```
**Fix:** Verify environment variables are set correctly

### RLS Policy Errors
```
Error: permission denied for table X
```
**Fix:** Check RLS policies in Supabase dashboard, ensure policies allow the operation

### Build Errors
```
Error: Module not found
```
**Fix:** Run `npm install` to ensure all dependencies installed

### API 500 Errors
```
Error: Failed to fetch X
```
**Fix:** Check Supabase dashboard for table existence, verify SQL migration ran successfully

---

## 📞 Support

**Documentation:** See README.md, PROJECT_STATUS.md, IMPLEMENTATION_STATUS.md  
**Database Schema:** `supabase/migrations/001_create_schema.sql`  
**Seed Data:** `supabase/seed.sql`  
**API Docs:** Each route file has inline documentation

---

**Ready to deploy! 🚀**
