-- ====================================================================
-- Buhary Janaza Welfare Society (BJWS) - Complete Database Setup
-- Run this in your Supabase Project > SQL Editor
-- Project URL: https://fwnixwzdpioyhjvtqhxm.supabase.co
-- ====================================================================

-- ====================================================================
-- PART 1: Core System Tables
-- ====================================================================

-- 1. Table: contact_messages (Inquiries & Messages)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'ta',
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived', 'replied')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Table: membership_requests (Membership Applications)
CREATE TABLE IF NOT EXISTS public.membership_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address_area TEXT NOT NULL,
    family_size INTEGER CHECK (family_size > 0),
    preferred_contact TEXT NOT NULL DEFAULT 'phone' CHECK (preferred_contact IN ('phone', 'whatsapp', 'sms', 'email')),
    plan TEXT NOT NULL DEFAULT 'monthly' CHECK (plan IN ('monthly', 'annual')),
    consent BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Table: notices (Community Bulletins & Announcements)
CREATE TABLE IF NOT EXISTS public.notices (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'ta',
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Table: reports (Audit & Annual Reports Metadata)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 2023),
    file_path TEXT NOT NULL,
    file_size TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Table: articles (News, Welfare & Community Articles)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    author TEXT NOT NULL DEFAULT 'BJWS Media Bureau',
    image_url TEXT,
    locale TEXT NOT NULL DEFAULT 'en',
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Table: team_members (Officers, Executive Committee & Field Volunteers)
CREATE TABLE IF NOT EXISTS public.team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role_en TEXT NOT NULL,
    role_ta TEXT,
    role_si TEXT,
    category TEXT NOT NULL DEFAULT 'executive',
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    address TEXT NOT NULL,
    initials TEXT NOT NULL,
    photo TEXT,
    term TEXT NOT NULL DEFAULT '2023 - 2026',
    is_inactive BOOLEAN NOT NULL DEFAULT false,
    member_id TEXT,
    nic TEXT,
    verification_token TEXT,
    verification_status TEXT DEFAULT 'verified',
    issue_date TEXT DEFAULT '2024-01-01',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Table: gallery_images (Approved Field Documentation Media)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id TEXT PRIMARY KEY,
    src TEXT NOT NULL,
    caption TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'cemetery-shramadana',
    date TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Mullipothana',
    approved BOOLEAN NOT NULL DEFAULT true,
    consent_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- PART 2: Performance Indexes
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_membership_requests_status ON public.membership_requests(status);
CREATE INDEX IF NOT EXISTS idx_notices_published ON public.notices(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_published ON public.reports(is_published, year DESC);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(locale, is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON public.team_members(is_inactive, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_members_member_id ON public.team_members(member_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_approved ON public.gallery_images(approved, created_at DESC);

-- ====================================================================
-- PART 3: Storage Buckets Configuration
-- ====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'reports',
    'reports',
    true,
    20971520, -- 20MB limit
    ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 20971520,
    allowed_mime_types = ARRAY['application/pdf'];

-- ====================================================================
-- PART 4: Row Level Security (RLS) Configuration
-- ====================================================================
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 1. Policies: contact_messages
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
    ON public.contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can view and manage contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated admins can view and manage contact messages"
    ON public.contact_messages
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 2. Policies: membership_requests
DROP POLICY IF EXISTS "Public can submit membership requests with consent" ON public.membership_requests;
CREATE POLICY "Public can submit membership requests with consent"
    ON public.membership_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (consent = true);

DROP POLICY IF EXISTS "Authenticated admins can view and manage membership requests" ON public.membership_requests;
CREATE POLICY "Authenticated admins can view and manage membership requests"
    ON public.membership_requests
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 3. Policies: notices
DROP POLICY IF EXISTS "Public can view published notices" ON public.notices;
CREATE POLICY "Public can view published notices"
    ON public.notices
    FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated admins can manage notices" ON public.notices;
CREATE POLICY "Authenticated admins can manage notices"
    ON public.notices
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Policies: reports
DROP POLICY IF EXISTS "Public can view published reports" ON public.reports;
CREATE POLICY "Public can view published reports"
    ON public.reports
    FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated admins can manage reports" ON public.reports;
CREATE POLICY "Authenticated admins can manage reports"
    ON public.reports
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 5. Policies: articles
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
    ON public.articles
    FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated admins can manage articles" ON public.articles;
CREATE POLICY "Authenticated admins can manage articles"
    ON public.articles
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 6. Policies: team_members
DROP POLICY IF EXISTS "Public can view active team members" ON public.team_members;
CREATE POLICY "Public can view active team members"
    ON public.team_members
    FOR SELECT
    TO anon, authenticated
    USING (is_inactive = false);

DROP POLICY IF EXISTS "Authenticated admins can manage team members" ON public.team_members;
CREATE POLICY "Authenticated admins can manage team members"
    ON public.team_members
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 7. Policies: gallery_images
DROP POLICY IF EXISTS "Public can view approved gallery images" ON public.gallery_images;
CREATE POLICY "Public can view approved gallery images"
    ON public.gallery_images
    FOR SELECT
    TO anon, authenticated
    USING (approved = true);

DROP POLICY IF EXISTS "Authenticated admins can manage gallery images" ON public.gallery_images;
CREATE POLICY "Authenticated admins can manage gallery images"
    ON public.gallery_images
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 8. Policies: Storage Bucket (reports)
DROP POLICY IF EXISTS "Public can view reports storage" ON storage.objects;
CREATE POLICY "Public can view reports storage"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'reports');

DROP POLICY IF EXISTS "Admins can upload reports to storage" ON storage.objects;
CREATE POLICY "Admins can upload reports to storage"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'reports');

DROP POLICY IF EXISTS "Admins can update reports in storage" ON storage.objects;
CREATE POLICY "Admins can update reports in storage"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'reports')
    WITH CHECK (bucket_id = 'reports');

DROP POLICY IF EXISTS "Admins can delete reports from storage" ON storage.objects;
CREATE POLICY "Admins can delete reports from storage"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'reports');

