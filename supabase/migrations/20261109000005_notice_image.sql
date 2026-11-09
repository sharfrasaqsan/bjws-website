-- ====================================================================
-- Buhary Janaza Welfare Society (BJWS)
-- Migration: Add image_url to notices table
-- ====================================================================

ALTER TABLE public.notices 
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

-- Refresh schema cache
COMMENT ON COLUMN public.notices.image_url IS 'Optional URL or storage path for notice flyer, banner, or circular image';

