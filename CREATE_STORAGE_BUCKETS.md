# Create Supabase Storage Buckets

Since API access requires service role permissions, please create these buckets manually in the Supabase Dashboard:

## Steps:
1. Go to: https://supabase.com/dashboard/project/jwxenutezijwyrguqicv/storage
2. Click "Create bucket" for each:

### Bucket 1: gallery
- **Name:** gallery
- **Public:** Yes
- **File Size Limit:** 5MB
- **Allowed MIME Types:** image/*
- **Purpose:** Photo gallery images for wellness activities

### Bucket 2: services
- **Name:** services
- **Public:** Yes
- **File Size Limit:** 2MB
- **Allowed MIME Types:** image/*
- **Purpose:** Service category images and icons

### Bucket 3: menu
- **Name:** menu
- **Public:** Yes
- **File Size Limit:** 2MB
- **Allowed MIME Types:** image/*
- **Purpose:** Menu item photos and food images

## After Creating Buckets:
- Set up CORS policies to allow uploads from your domain
- Configure folder structure if needed
- Test upload functionality via the website

## Alternative: SQL Creation
You can also create buckets via SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('gallery', 'gallery', true, 5242880, ARRAY['image/*']),
  ('services', 'services', true, 2097152, ARRAY['image/*']),
  ('menu', 'menu', true, 2097152, ARRAY['image/*']);
```
