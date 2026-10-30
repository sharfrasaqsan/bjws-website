-- ====================================================================
-- Buhary Janaza Welfare Society (BJWS) - Admin & Storage Migration
-- ====================================================================

-- 1. Ensure storage schema and buckets table exist
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

-- 2. Storage RLS Policies for reports bucket
-- Public read access for published PDF reports
CREATE POLICY "Public can view reports storage"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'reports');

-- Authenticated admins can upload reports
CREATE POLICY "Admins can upload reports to storage"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'reports');

-- Authenticated admins can update reports in storage
CREATE POLICY "Admins can update reports in storage"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'reports')
    WITH CHECK (bucket_id = 'reports');

-- Authenticated admins can delete reports from storage
CREATE POLICY "Admins can delete reports from storage"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'reports');

