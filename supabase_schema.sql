-- ==============================================================================
-- INSTITUTE OF DA'WA ISLAMIYYA (IDI) - SUPABASE DATABASE & STORAGE SCHEMA
-- ==============================================================================
-- Run this complete script in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- to initialize the database tables, RLS policies, and storage setup.
-- ==============================================================================

-- 1. Enable UUID Extension (if not already enabled)
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

-- Table: admin_users (for secure admin authorization)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. SCHEMA & TABLE PERMISSIONS (Required for PostgREST / Supabase Client API)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.gallery_folders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.gallery_photos TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.admin_users TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- ==============================================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_gallery_photos_folder_id ON public.gallery_photos(folder_id);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON public.gallery_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_folders_created_at ON public.gallery_folders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- ==============================================================================
-- 5. AUTO-UPDATE TIMESTAMP TRIGGER
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

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.gallery_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- --- Policies for `gallery_folders` ---
-- Public: Anyone can read gallery folders
DROP POLICY IF EXISTS "Public can view gallery folders" ON public.gallery_folders;
CREATE POLICY "Public can view gallery folders"
    ON public.gallery_folders
    FOR SELECT
    USING (true);

-- Admin: Only authorized admins can insert, update, or delete folders
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
-- Public: Anyone can view gallery photos
DROP POLICY IF EXISTS "Public can view gallery photos" ON public.gallery_photos;
CREATE POLICY "Public can view gallery photos"
    ON public.gallery_photos
    FOR SELECT
    USING (true);

-- Admin: Only authorized admins can insert, update, or delete photos
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
-- Authenticated users can check if their own user_id exists in admin_users
DROP POLICY IF EXISTS "Users can read own admin status" ON public.admin_users;
CREATE POLICY "Users can read own admin status"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- ==============================================================================
-- 6. SUPABASE STORAGE BUCKET CONFIGURATION
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
-- 7. INITIAL ADMIN USER HELPER
-- ==============================================================================
-- Auto-confirm the registered dev@idi.lk user account
UPDATE auth.users
SET email_confirmed_at = timezone('utc'::text, now())
WHERE email = 'dev@idi.lk';

-- Automatically authorize dev@idi.lk in the admin_users table
INSERT INTO public.admin_users (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'dev@idi.lk'
ON CONFLICT (user_id) DO NOTHING;
-- ==============================================================================

