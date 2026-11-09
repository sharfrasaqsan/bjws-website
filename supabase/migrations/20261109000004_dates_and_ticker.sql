-- ====================================================================
-- Buhary Janaza Welfare Society (BJWS)
-- Migration: Add published_at, updated_at, and show_on_homepage columns
-- ====================================================================

-- 1. Table: notices (Add show_on_homepage and updated_at)
ALTER TABLE public.notices 
ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.notices 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_notices_homepage ON public.notices(show_on_homepage, is_published, published_at DESC);

-- 2. Table: reports (Add published_at and updated_at)
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_reports_published_at ON public.reports(published_at DESC);

-- 3. Table: articles (Add updated_at)
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

