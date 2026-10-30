-- ====================================================================
-- Buhary Janaza Welfare Society (BJWS) - Initial Database Schema
-- Location: Mullipothanai, Sri Lanka (Reg No: DS/TH/SS/VSSO/2023/01)
-- ====================================================================

-- 1. Table: contact_messages
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

-- 2. Table: membership_requests
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

-- 3. Table: notices
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'ta',
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Table: reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 2023),
    file_path TEXT NOT NULL,
    file_size TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- Performance Indexes
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_membership_requests_status ON public.membership_requests(status);
CREATE INDEX IF NOT EXISTS idx_notices_published ON public.notices(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_published ON public.reports(is_published, year DESC);

-- ====================================================================
-- Row Level Security (RLS) Configuration
-- ====================================================================
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- RLS: contact_messages
-- Rule: The public can INSERT only. No public SELECT. Authenticated admins have full access.
-- --------------------------------------------------------------------
CREATE POLICY "Public can submit contact messages"
    ON public.contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated admins can view and manage contact messages"
    ON public.contact_messages
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- --------------------------------------------------------------------
-- RLS: membership_requests
-- Rule: The public can INSERT with consent only. No public SELECT. Authenticated admins have full access.
-- --------------------------------------------------------------------
CREATE POLICY "Public can submit membership requests with consent"
    ON public.membership_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (consent = true);

CREATE POLICY "Authenticated admins can view and manage membership requests"
    ON public.membership_requests
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- --------------------------------------------------------------------
-- RLS: notices
-- Rule: The public can SELECT only published notices. Admins have full access.
-- --------------------------------------------------------------------
CREATE POLICY "Public can view published notices"
    ON public.notices
    FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

CREATE POLICY "Authenticated admins can manage notices"
    ON public.notices
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- --------------------------------------------------------------------
-- RLS: reports
-- Rule: The public can SELECT only published reports. Admins have full access.
-- --------------------------------------------------------------------
CREATE POLICY "Public can view published reports"
    ON public.reports
    FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

CREATE POLICY "Authenticated admins can manage reports"
    ON public.reports
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ====================================================================
-- Initial Seed Records (Derived from Profile Book)
-- ====================================================================
INSERT INTO public.notices (title, body, locale, is_published, published_at)
VALUES
    (
        'Annual Shramadhana Program at Mahallah Cemetery',
        'We invite all youth and community members to participate in the upcoming seasonal clean-up and maintenance of the Mahallah cemetery grounds.',
        'en',
        true,
        '2026-03-01 08:00:00+00'
    ),
    (
        'மஹல்லா மையவாடி சிரமதானப் பணி அழைப்பு',
        'எமது மஹல்லா மையவாடியை துப்புரவு செய்யும் வருடாந்த சிரமதானப் பணியில் அனைத்து இளைஞர்களையும் பொதுமக்களையும் பங்குபற்றுமாறு அன்புடன் அழைக்கின்றோம்.',
        'ta',
        true,
        '2026-03-01 08:00:00+00'
    ),
    (
        'සුසාන භූමි වාර්ෂික ශ්‍රමදාන වැඩසටහන',
        'මහල්ල සුසාන භූමිය පිරිසිදු කිරීමේ වාර්ෂික ශ්‍රමදාන කටයුතු සඳහා සහභාගී වන ලෙස ප්‍රජාවට ආරාධනා කරමු.',
        'si',
        true,
        '2026-03-01 08:00:00+00'
    )
ON CONFLICT DO NOTHING;

INSERT INTO public.reports (title, year, file_path, file_size, is_published)
VALUES
    (
        'Annual Activities & Financial Summary Report 2024',
        2024,
        '/documents/reports/bjws-annual-report-2024.pdf',
        '1.8 MB',
        true
    ),
    (
        'Foundational Activities & Welfare Overview 2023',
        2023,
        '/documents/reports/bjws-annual-report-2023.pdf',
        '1.4 MB',
        true
    )
ON CONFLICT DO NOTHING;

