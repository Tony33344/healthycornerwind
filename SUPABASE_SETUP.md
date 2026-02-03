# Supabase Setup Guide for Healthy Corner Wellness Platform

This guide will help you set up Supabase as the backend for your wellness booking platform with admin management capabilities.

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization or use existing
4. Create a new project
5. Choose a database password (save this!)
6. Wait for project to be ready (~2 minutes)

### 2. Get Your Credentials

From your Supabase dashboard:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and run the SQL script
4. This creates all necessary tables, indexes, and sample data

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Test the Connection

```bash
npm run dev
```

Visit `http://localhost:3000/sl/schedule` - you should see live data from Supabase!

## 📊 Database Tables Overview

### Core Tables

- **`services`** - Wellness services (yoga, ice bathing, etc.)
- **`schedules`** - Weekly recurring time slots for services
- **`bookings`** - Customer bookings for specific dates/times
- **`admin_users`** - Admin platform users
- **`settings`** - Business configuration

### Key Features

- ✅ **Multi-language support** (EN, SL, NL, DE)
- ✅ **Real-time updates** via Supabase subscriptions
- ✅ **Row Level Security** for data protection
- ✅ **Automatic timestamps** with triggers
- ✅ **Data validation** with constraints

## 🔧 Admin Platform Management

### Managing Services

```sql
-- Add new service
INSERT INTO services (name_en, name_sl, name_nl, name_de, category, duration, price)
VALUES ('Hot Yoga', 'Vroča joga', 'Hete Yoga', 'Heißes Yoga', 'Yoga', 75, 30.00);

-- Update service pricing
UPDATE services SET price = 28.00 WHERE name_en = 'Morning Yoga';

-- Deactivate service
UPDATE services SET is_active = false WHERE id = 'service-uuid';
```

### Managing Schedules

```sql
-- Add weekly schedule (every Monday at 10:00)
INSERT INTO schedules (service_id, day_of_week, time, capacity)
VALUES ('service-uuid', 1, '10:00', 12);

-- Update capacity
UPDATE schedules SET capacity = 15 WHERE id = 'schedule-uuid';
```

### Managing Bookings

```sql
-- View all bookings for today
SELECT b.*, s.time, srv.name_en 
FROM bookings b
JOIN schedules s ON b.schedule_id = s.id
JOIN services srv ON s.service_id = srv.id
WHERE b.booking_date = CURRENT_DATE;

-- Confirm booking
UPDATE bookings SET status = 'confirmed' WHERE id = 'booking-uuid';

-- Cancel booking
UPDATE bookings SET status = 'cancelled' WHERE id = 'booking-uuid';
```

## 🔐 Security Configuration

### Row Level Security Policies

The schema includes RLS policies that:

- Allow **public read** access to active services and schedules
- Allow **public creation** of bookings
- Require **authentication** for admin operations
- Protect sensitive admin data

### API Security

- **Service role key** is used for admin operations
- **Anon key** is used for public website access
- All sensitive operations require authentication

## 📱 Real-time Features

The platform includes real-time subscriptions for:

- **Live booking updates** - see bookings as they happen
- **Capacity changes** - real-time availability updates
- **Schedule modifications** - instant schedule updates

## 🎯 Production Deployment

### Before Going Live

1. **Remove sample data** from schema.sql
2. **Set up proper authentication** for admin users
3. **Configure email notifications** for bookings
4. **Set up backup strategy** for database
5. **Configure monitoring** and alerts

### Environment Variables for Production

```bash
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key

# Production settings
NEXTAUTH_URL=https://yourdomain.com
BUSINESS_EMAIL=info@yourdomain.com
```

## 🛠 Admin Dashboard Features

With this setup, you can build an admin dashboard that:

- ✅ **Manages services** - add, edit, deactivate services
- ✅ **Schedules time slots** - create recurring weekly schedules
- ✅ **Views bookings** - real-time booking management
- ✅ **Handles payments** - track payment status
- ✅ **Sends notifications** - email confirmations
- ✅ **Analytics** - booking reports and statistics

## 📞 Support

If you need help with:
- Supabase configuration
- Database schema modifications
- Admin platform development
- Real-time features setup

The platform is now fully configured for live data management through Supabase! 🎉
