# ⚡ QUICK START GUIDE - Healthy Corner

## 🎯 Everything is Ready! Follow These Steps:

---

## 1️⃣ CREATE SUPABASE PROJECT (5 minutes)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Name: `healthycorner`
4. Password: Generate strong password (SAVE IT!)
5. Region: `eu-central-1`
6. Click **"Create new project"**

---

## 2️⃣ RUN SQL SETUP (2 minutes)

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Open file: `supabase-setup.sql`
4. Copy ALL SQL code
5. Paste and click **"Run"**
6. Verify tables created: **Table Editor** → see `bookings`, `contact_messages`, `services`

---

## 3️⃣ CREATE ADMIN USER (1 minute)

1. Supabase → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Email: `admin@healthycorner.si`
4. Password: (create strong password - SAVE IT!)
5. ✅ Check **"Auto Confirm User"**
6. Click **"Create user"**

---

## 4️⃣ GET CREDENTIALS (1 minute)

1. Supabase → **Project Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`

---

## 5️⃣ CREATE .ENV.LOCAL (1 minute)

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 6️⃣ TEST LOCALLY (5 minutes)

```bash
npm run dev
```

Open http://localhost:3000

**Test:**
- ✅ Submit booking form → Check Supabase `bookings` table
- ✅ Submit contact form → Check Supabase `contact_messages` table
- ✅ Go to http://localhost:3000/login → Login with admin credentials
- ✅ View dashboard at http://localhost:3000/admin

---

## 7️⃣ BUILD & DEPLOY (5 minutes)

```bash
# Build
npm run build

# Login to Netlify
netlify login

# Initialize site
netlify init
# → Create new site
# → Name: healthycorner
# → Build: npm run build
# → Deploy: .next

# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://xxxxx.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGc..."

# Deploy!
netlify deploy --prod
```

---

## 8️⃣ TEST LIVE SITE (3 minutes)

Visit: https://healthycorner.netlify.app

**Test:**
- ✅ Booking form works
- ✅ Contact form works
- ✅ Login at /login works
- ✅ Admin dashboard at /admin works

---

## ✅ DONE!

Your site is live with:
- 🌐 Public website
- 📝 Working forms
- 🔐 Admin login
- 📊 Admin dashboard
- 💾 Supabase backend

---

## 🔑 ADMIN ACCESS

**URL**: https://healthycorner.netlify.app/login
**Email**: admin@healthycorner.si
**Password**: (the one you created)

---

## 📞 NEED HELP?

See detailed guides:
- `DEPLOYMENT_INSTRUCTIONS.md` - Step-by-step guide
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `COMPLETE_SETUP_AND_DEPLOYMENT.md` - Full documentation

---

**Total Time**: ~20 minutes
**Status**: ✅ Ready to Deploy
