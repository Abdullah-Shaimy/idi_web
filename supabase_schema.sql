-- ==============================================================================
-- INSTITUTE OF DA'WA ISLAMIYYA (IDI) - SUPABASE DATABASE & STORAGE SCHEMA
-- ==============================================================================
-- Run this complete script in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- to initialize or update database tables, RLS policies, and storage setup.
-- ==============================================================================

-- 1. Enable UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CREATE DATABASE TABLES
-- ==============================================================================

-- Table: gallery_folders
CREATE TABLE IF NOT EXISTS public.gallery_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: gallery_photos
CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id UUID NOT NULL REFERENCES public.gallery_folders(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: admin_users (for secure role-based admin authorization)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    full_name TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure columns exist if table was already created in prior versions
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin';
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Table: contact_inquiries (for managing public contact submissions)
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    city TEXT,
    subject TEXT DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. SCHEMA & TABLE PERMISSIONS (Required for PostgREST / Supabase Client API)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.gallery_folders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.gallery_photos TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.admin_users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.contact_inquiries TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- ==============================================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_gallery_photos_folder_id ON public.gallery_photos(folder_id);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON public.gallery_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_folders_created_at ON public.gallery_folders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON public.contact_inquiries(status);

-- ==============================================================================
-- 5. AUTO-UPDATE TIMESTAMP TRIGGERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_gallery_folders_updated_at ON public.gallery_folders;
CREATE TRIGGER set_gallery_folders_updated_at
    BEFORE UPDATE ON public.gallery_folders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER set_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_contact_inquiries_updated_at ON public.contact_inquiries;
CREATE TRIGGER set_contact_inquiries_updated_at
    BEFORE UPDATE ON public.contact_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 6. SECURITY FUNCTIONS
-- ==============================================================================

-- Check if current user is an active admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if current user is strictly an active super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
          AND role = 'super_admin'
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Get the role of the currently authenticated admin
CREATE OR REPLACE FUNCTION public.get_current_admin_role()
RETURNS TEXT AS $$
DECLARE
    current_role TEXT;
BEGIN
    SELECT role INTO current_role
    FROM public.admin_users
    WHERE user_id = auth.uid()
      AND status = 'active'
    LIMIT 1;

    RETURN current_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.gallery_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- --- Policies for `gallery_folders` ---
DROP POLICY IF EXISTS "Public can view gallery folders" ON public.gallery_folders;
CREATE POLICY "Public can view gallery folders"
    ON public.gallery_folders
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can insert gallery folders" ON public.gallery_folders;
CREATE POLICY "Admins can insert gallery folders"
    ON public.gallery_folders
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update gallery folders" ON public.gallery_folders;
CREATE POLICY "Admins can update gallery folders"
    ON public.gallery_folders
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete gallery folders" ON public.gallery_folders;
CREATE POLICY "Admins can delete gallery folders"
    ON public.gallery_folders
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- --- Policies for `gallery_photos` ---
DROP POLICY IF EXISTS "Public can view gallery photos" ON public.gallery_photos;
CREATE POLICY "Public can view gallery photos"
    ON public.gallery_photos
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can insert gallery photos" ON public.gallery_photos;
CREATE POLICY "Admins can insert gallery photos"
    ON public.gallery_photos
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update gallery photos" ON public.gallery_photos;
CREATE POLICY "Admins can update gallery photos"
    ON public.gallery_photos
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete gallery photos" ON public.gallery_photos;
CREATE POLICY "Admins can delete gallery photos"
    ON public.gallery_photos
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- --- Policies for `admin_users` ---
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;
CREATE POLICY "Admins can view admin list"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (public.is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Super Admins can insert admin users" ON public.admin_users;
CREATE POLICY "Super Admins can insert admin users"
    ON public.admin_users
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super Admins can update admin users" ON public.admin_users;
CREATE POLICY "Super Admins can update admin users"
    ON public.admin_users
    FOR UPDATE
    TO authenticated
    USING (public.is_super_admin() OR auth.uid() = user_id)
    WITH CHECK (public.is_super_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Super Admins can delete admin users" ON public.admin_users;
CREATE POLICY "Super Admins can delete admin users"
    ON public.admin_users
    FOR DELETE
    TO authenticated
    USING (public.is_super_admin());

-- --- Policies for `contact_inquiries` ---
-- Anyone (public / anon) can submit inquiries
DROP POLICY IF EXISTS "Public can insert contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Public can insert contact inquiries"
    ON public.contact_inquiries
    FOR INSERT
    WITH CHECK (true);

-- Both Super Admins and regular Admins can view contact inquiries
DROP POLICY IF EXISTS "Admins can view contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admins can view contact inquiries"
    ON public.contact_inquiries
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Both Super Admins and regular Admins can update contact inquiry status and notes
DROP POLICY IF EXISTS "Admins can update contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admins can update contact inquiries"
    ON public.contact_inquiries
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only Super Admins can delete contact inquiries
DROP POLICY IF EXISTS "Super Admins can delete contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Super Admins can delete contact inquiries"
    ON public.contact_inquiries
    FOR DELETE
    TO authenticated
    USING (public.is_super_admin());

-- ==============================================================================
-- 8. SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================

-- Create the public 'gallery' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Access to Gallery Bucket" ON storage.objects;
CREATE POLICY "Public Access to Gallery Bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admins can upload to Gallery Bucket" ON storage.objects;
CREATE POLICY "Admins can upload to Gallery Bucket"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update Gallery Bucket objects" ON storage.objects;
CREATE POLICY "Admins can update Gallery Bucket objects"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'gallery' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete from Gallery Bucket" ON storage.objects;
CREATE POLICY "Admins can delete from Gallery Bucket"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'gallery' AND public.is_admin());

-- ==============================================================================
-- 9. AUTO-CONFIRM ALL USERS & INITIAL SUPER ADMIN SETUP
-- ==============================================================================

-- 1. Auto-confirm ALL existing users in auth.users (removes "Email not confirmed" error)
UPDATE auth.users
SET email_confirmed_at = timezone('utc'::text, now())
WHERE email_confirmed_at IS NULL;

-- 2. Trigger to automatically confirm any new user immediately on creation
CREATE OR REPLACE FUNCTION public.auto_confirm_new_user()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email_confirmed_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_auto_confirm_new_user ON auth.users;
CREATE TRIGGER tr_auto_confirm_new_user
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_confirm_new_user();

-- 3. Automatically authorize dev@idi.lk as Super Admin
INSERT INTO public.admin_users (user_id, email, role, full_name, status)
SELECT id, email, 'super_admin', 'System Developer & Super Admin', 'active'
FROM auth.users
WHERE email = 'dev@idi.lk'
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin',
    status = 'active';

-- 4. Authorize admin@idi.lk if present as an admin
INSERT INTO public.admin_users (user_id, email, role, full_name, status)
SELECT id, email, 'admin', 'Staff Administrator', 'active'
FROM auth.users
WHERE email = 'admin@idi.lk'
ON CONFLICT (user_id) DO UPDATE
SET status = 'active';
-- ==============================================================================

