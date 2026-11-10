-- ====================================================================
-- Buhary Janaza Welfare Society (BJWS) - Hero Banners Migration
-- Table: hero_banners
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.hero_banners (
    id TEXT PRIMARY KEY,
    src TEXT NOT NULL,
    alt TEXT NOT NULL,
    label TEXT,
    title TEXT,
    subtitle TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hero_banners_active_order ON public.hero_banners(is_active, order_index ASC);

-- Row Level Security (RLS)
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- 1. Public can view active banners
DROP POLICY IF EXISTS "Public can view active hero banners" ON public.hero_banners;
CREATE POLICY "Public can view active hero banners"
    ON public.hero_banners
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- 2. Authenticated admins can manage all banners
DROP POLICY IF EXISTS "Authenticated admins can manage hero banners" ON public.hero_banners;
CREATE POLICY "Authenticated admins can manage hero banners"
    ON public.hero_banners
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

