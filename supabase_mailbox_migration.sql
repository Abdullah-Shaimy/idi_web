-- ==============================================================================
-- INSTITUTE OF DA'WA ISLAMIYYA (IDI) - MAILBOX SYSTEM DATABASE MIGRATION
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- to create all Mailbox tables, storage bucket, triggers, indexes, and RLS policies.
-- ==============================================================================

-- ==============================================================================
-- 0. CORE SECURITY HELPER FUNCTIONS & ADMIN SETUP
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function for auto-updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Table: admin_users (for role-based admin authorization)
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

-- Granular permissions columns
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin';
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS allowed_tabs JSONB DEFAULT '["overview", "gallery", "inquiries", "mailbox"]'::jsonb;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS allowed_emails JSONB DEFAULT '["info@idi.lk"]'::jsonb;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

-- Security helper: Check if active admin
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

-- Security helper: Check if active super_admin
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

UPDATE public.admin_users
SET allowed_tabs = '["overview", "gallery", "inquiries", "mailbox", "admins"]'::jsonb,
    allowed_emails = '["*"]'::jsonb
WHERE role = 'super_admin';

-- 1. Table: mailbox_identities (Domain Sender Identities)
CREATE TABLE IF NOT EXISTS public.mailbox_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    reply_to TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    signature_id UUID,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: mailbox_signatures (Rich Email Signatures)
CREATE TABLE IF NOT EXISTS public.mailbox_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    identity_id UUID REFERENCES public.mailbox_identities(id) ON DELETE SET NULL,
    full_name TEXT,
    title TEXT,
    company TEXT DEFAULT 'Institute of Da''wa Islamiyya',
    phone TEXT,
    website TEXT DEFAULT 'https://idi.lk',
    logo_url TEXT DEFAULT '/assets/images/idi_logo.webp',
    html_content TEXT NOT NULL DEFAULT '',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Link signature back to identity
ALTER TABLE public.mailbox_identities 
    DROP CONSTRAINT IF EXISTS fk_mailbox_identities_signature;
ALTER TABLE public.mailbox_identities 
    ADD CONSTRAINT fk_mailbox_identities_signature 
    FOREIGN KEY (signature_id) REFERENCES public.mailbox_signatures(id) ON DELETE SET NULL;

-- 3. Table: mailbox_threads (Conversations / Threads)
CREATE TABLE IF NOT EXISTS public.mailbox_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL DEFAULT '(No Subject)',
    snippet TEXT,
    last_message_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    message_count INT NOT NULL DEFAULT 1,
    has_attachments BOOLEAN NOT NULL DEFAULT false,
    is_starred BOOLEAN NOT NULL DEFAULT false,
    is_unread BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table: mailbox_emails (Individual Email Messages)
CREATE TABLE IF NOT EXISTS public.mailbox_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES public.mailbox_threads(id) ON DELETE SET NULL,
    identity_id UUID REFERENCES public.mailbox_identities(id) ON DELETE SET NULL,
    direction TEXT NOT NULL DEFAULT 'inbound' CHECK (direction IN ('inbound', 'outbound')),
    folder TEXT NOT NULL DEFAULT 'inbox' CHECK (folder IN ('inbox', 'sent', 'drafts', 'starred', 'archived', 'spam', 'trash')),
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'queued', 'sent', 'delivered', 'bounced', 'failed', 'complained')),
    from_address TEXT NOT NULL,
    from_name TEXT,
    to_recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
    cc_recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
    bcc_recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
    reply_to TEXT,
    subject TEXT NOT NULL DEFAULT '(No Subject)',
    snippet TEXT,
    body_text TEXT,
    body_html TEXT,
    message_id TEXT,
    in_reply_to TEXT,
    references_header TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    is_starred BOOLEAN NOT NULL DEFAULT false,
    has_attachments BOOLEAN NOT NULL DEFAULT false,
    provider_message_id TEXT,
    provider_status TEXT,
    error_message TEXT,
    deleted_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Table: mailbox_attachments (Email File Attachments)
CREATE TABLE IF NOT EXISTS public.mailbox_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id UUID NOT NULL REFERENCES public.mailbox_emails(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_size INT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'application/octet-stream',
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Table: mailbox_templates (Reusable Email Templates)
CREATE TABLE IF NOT EXISTS public.mailbox_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT,
    body_html TEXT NOT NULL DEFAULT '',
    body_text TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Table: mailbox_audit_logs (Security & Audit Trail)
CREATE TABLE IF NOT EXISTS public.mailbox_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 8. INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_mailbox_emails_folder ON public.mailbox_emails(folder);
CREATE INDEX IF NOT EXISTS idx_mailbox_emails_thread_id ON public.mailbox_emails(thread_id);
CREATE INDEX IF NOT EXISTS idx_mailbox_emails_created_at ON public.mailbox_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mailbox_emails_is_read ON public.mailbox_emails(is_read);
CREATE INDEX IF NOT EXISTS idx_mailbox_emails_is_starred ON public.mailbox_emails(is_starred);
CREATE INDEX IF NOT EXISTS idx_mailbox_emails_provider_id ON public.mailbox_emails(provider_message_id);
CREATE INDEX IF NOT EXISTS idx_mailbox_emails_from_address ON public.mailbox_emails(from_address);
CREATE INDEX IF NOT EXISTS idx_mailbox_emails_message_id ON public.mailbox_emails(message_id);
CREATE INDEX IF NOT EXISTS idx_mailbox_attachments_email_id ON public.mailbox_attachments(email_id);
CREATE INDEX IF NOT EXISTS idx_mailbox_threads_updated_at ON public.mailbox_threads(updated_at DESC);

-- ==============================================================================
-- 9. TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- ==============================================================================
DROP TRIGGER IF EXISTS set_mailbox_identities_updated_at ON public.mailbox_identities;
CREATE TRIGGER set_mailbox_identities_updated_at
    BEFORE UPDATE ON public.mailbox_identities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_mailbox_signatures_updated_at ON public.mailbox_signatures;
CREATE TRIGGER set_mailbox_signatures_updated_at
    BEFORE UPDATE ON public.mailbox_signatures
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_mailbox_threads_updated_at ON public.mailbox_threads;
CREATE TRIGGER set_mailbox_threads_updated_at
    BEFORE UPDATE ON public.mailbox_threads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_mailbox_emails_updated_at ON public.mailbox_emails;
CREATE TRIGGER set_mailbox_emails_updated_at
    BEFORE UPDATE ON public.mailbox_emails
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_mailbox_templates_updated_at ON public.mailbox_templates;
CREATE TRIGGER set_mailbox_templates_updated_at
    BEFORE UPDATE ON public.mailbox_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.mailbox_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailbox_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailbox_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailbox_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailbox_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailbox_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailbox_audit_logs ENABLE ROW LEVEL SECURITY;

-- Grant permissions to roles
GRANT ALL ON TABLE public.mailbox_identities TO authenticated, service_role;
GRANT ALL ON TABLE public.mailbox_signatures TO authenticated, service_role;
GRANT ALL ON TABLE public.mailbox_threads TO authenticated, service_role;
GRANT ALL ON TABLE public.mailbox_emails TO authenticated, service_role;
GRANT ALL ON TABLE public.mailbox_attachments TO authenticated, service_role;
GRANT ALL ON TABLE public.mailbox_templates TO authenticated, service_role;
GRANT ALL ON TABLE public.mailbox_audit_logs TO authenticated, service_role;

-- Policies: Authenticated Admins have full access
DROP POLICY IF EXISTS "Admins full access to mailbox_identities" ON public.mailbox_identities;
CREATE POLICY "Admins full access to mailbox_identities"
    ON public.mailbox_identities FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to mailbox_signatures" ON public.mailbox_signatures;
CREATE POLICY "Admins full access to mailbox_signatures"
    ON public.mailbox_signatures FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to mailbox_threads" ON public.mailbox_threads;
CREATE POLICY "Admins full access to mailbox_threads"
    ON public.mailbox_threads FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to mailbox_emails" ON public.mailbox_emails;
CREATE POLICY "Admins full access to mailbox_emails"
    ON public.mailbox_emails FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to mailbox_attachments" ON public.mailbox_attachments;
CREATE POLICY "Admins full access to mailbox_attachments"
    ON public.mailbox_attachments FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to mailbox_templates" ON public.mailbox_templates;
CREATE POLICY "Admins full access to mailbox_templates"
    ON public.mailbox_templates FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to mailbox_audit_logs" ON public.mailbox_audit_logs;
CREATE POLICY "Admins full access to mailbox_audit_logs"
    ON public.mailbox_audit_logs FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ==============================================================================
-- 11. SUPABASE STORAGE BUCKET: mailbox_attachments (PRIVATE)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('mailbox_attachments', 'mailbox_attachments', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Admins full access to mailbox_attachments bucket" ON storage.objects;
CREATE POLICY "Admins full access to mailbox_attachments bucket"
    ON storage.objects FOR ALL
    TO authenticated
    USING (bucket_id = 'mailbox_attachments' AND public.is_admin())
    WITH CHECK (bucket_id = 'mailbox_attachments' AND public.is_admin());

-- ==============================================================================
-- 12. CLEAN STATE: No dummy identities, signatures, or templates are seeded.
-- Configure your custom verified domain identities directly via the Admin Panel.
-- ==============================================================================
