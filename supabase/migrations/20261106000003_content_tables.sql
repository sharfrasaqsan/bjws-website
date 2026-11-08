-- ====================================================================
-- Buhary Janaza Welfare Society (BJWS) - Content Tables Migration
-- Tables: articles, team_members, gallery_images
-- ====================================================================

-- 1. Table: articles (News, Blog & Community Articles)
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug TEXT NOT NULL UNIQUE,
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

-- 2. Table: team_members (Executive Committee, Officers & Volunteers)
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

-- 3. Table: gallery_images (Approved Field & Event Documentation)
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
-- Indexes for High Performance Querying
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(locale, is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON public.team_members(is_inactive, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_members_member_id ON public.team_members(member_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_approved ON public.gallery_images(approved, created_at DESC);

-- ====================================================================
-- Row Level Security (RLS) Configuration
-- ====================================================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- RLS: articles
-- --------------------------------------------------------------------
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

-- --------------------------------------------------------------------
-- RLS: team_members
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active team members" ON public.team_members;
DROP POLICY IF EXISTS "Public can view team members for transparency and verification" ON public.team_members;
CREATE POLICY "Public can view team members for transparency and verification"
    ON public.team_members
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated admins can manage team members" ON public.team_members;
CREATE POLICY "Authenticated admins can manage team members"
    ON public.team_members
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- --------------------------------------------------------------------
-- RLS: gallery_images
-- --------------------------------------------------------------------
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

