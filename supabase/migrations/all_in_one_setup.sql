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
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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

-- Idempotent schema upgrades for existing database installations
DO $$
BEGIN
    -- Upgrade notices.id to TEXT if previously created as UUID
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'notices' AND column_name = 'id' AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.notices ALTER COLUMN id TYPE TEXT USING id::text;
        ALTER TABLE public.notices ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
    END IF;

    -- Upgrade articles.id to TEXT if previously created as UUID
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'id' AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.articles ALTER COLUMN id TYPE TEXT USING id::text;
        ALTER TABLE public.articles ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
    END IF;

    -- Add unique constraint on slug if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_articles_slug'
    ) THEN
        ALTER TABLE public.articles ADD CONSTRAINT uq_articles_slug UNIQUE (slug);
    END IF;
END $$;

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
    issue_date TEXT DEFAULT '2026-01-01',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all verification & identification columns exist on existing databases
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS member_id TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS nic TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS verification_token TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'verified';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS issue_date TEXT DEFAULT '2026-01-01';

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

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gallery',
    'gallery',
    true,
    15728640, -- 15MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 15728640,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

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

-- 9. Policies: Storage Bucket (gallery)
DROP POLICY IF EXISTS "Public can view gallery storage" ON storage.objects;
CREATE POLICY "Public can view gallery storage"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admins can upload gallery images to storage" ON storage.objects;
CREATE POLICY "Admins can upload gallery images to storage"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admins can update gallery images in storage" ON storage.objects;
CREATE POLICY "Admins can update gallery images in storage"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'gallery')
    WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Admins can delete gallery images from storage" ON storage.objects;
CREATE POLICY "Admins can delete gallery images from storage"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'gallery');

-- ====================================================================
-- PART 5: Verified Community Seed Data (Idempotent)
-- ====================================================================

-- 1. Official Executive Committee & Officers (20 Members)
INSERT INTO public.team_members (id, name, role_en, role_ta, role_si, category, phone, whatsapp, email, address, initials, photo, term, is_inactive, member_id, nic, verification_token, verification_status, issue_date)
VALUES
('sahibullah', 'A.M. Sahibullah', 'President', 'தலைவர்', 'සභාපති', 'executive', '072 440 9574', '+94724409574', 'sahibullahmohamed0@gmail.com', 'No. 420, Unit 07, Mullipothana', 'AMS', '/images/team/sahibulla_new.webp', '2023 - Present', false, 'BJWS004', '197514302918', 'vtok_sahibullah_bjws004', 'verified', '2026-01-01'),
('gafoor', 'A.M.A. Gafoor', 'Vice President', 'உப தலைவர்', 'උප සභාපති', 'executive', '075 343 2627', '+94753432627', 'gafoorgafoor871@gmail.com', 'No. 101, Eacha Nagar, Mullipothana', 'AMAG', '/images/team/gafoor.webp', '2023 - Present', false, 'BJWS013', '197210402915', 'vtok_gafoor_bjws013', 'verified', '2026-01-01'),
('siyam', 'A.L.M. Siyam', 'Secretary', 'செயலாளர்', 'ලේකම්', 'executive', '077 278 2829', '+94772782829', 'mohamedshiyam2233@gmail.com', 'No. 85, Eacha Nagar, Mullipothana', 'ALMS', '/images/team/siyam.webp', '2023 - Present', false, 'BJWS005', '198622104981', 'vtok_siyam_bjws005', 'verified', '2026-01-01'),
('riyas', 'M.S. Riyas', 'Vice Secretary', 'உப செயலாளர்', 'උප ලේකම්', 'executive', '072 440 9574', '+94724409574', NULL, 'No. 53/7, Eachcha Nagar, Mullipothana', 'MSR', '/images/team/riyas.webp', '2023 - Present', false, 'BJWS002', '198319204812', 'vtok_riyas_bjws002', 'verified', '2026-01-01'),
('faizarkhan', 'M.S. Faizarkhan', 'Treasurer', 'பொருளாளர்', 'භාණ්ඩාගාරික', 'executive', '075 651 0050', '+94756510050', 'faisarkhan95@gmail.com', 'No. 335, Unit 07, Mullipothana', 'MSF', '/images/team/faisarkhan.webp', '2023 - Present', false, 'BJWS014', '199518204918', 'vtok_faizarkhan_bjws014', 'verified', '2026-01-01'),
('abuhuraira', 'A. Abuhuraira', 'Operations Coordinator', 'கள ஒருங்கிணைப்பாளர்', 'මෙහෙයුම් සම්බන්ධීකාරක', 'operations', '077 622 7323', '+94776227323', 'Sawth059@gmail.com', 'No. 415/R1, Unit 07, Mullipothana', 'AA', '/images/team/abuhuraira_new.webp', '2023 - Present', false, 'BJWS001', '197821405921', 'vtok_abuhuraira_bjws001', 'verified', '2026-01-01'),
('nashraff', 'N.M. Shamed Nashraff', 'English Inquiries & Communications Officer', 'ஆங்கில மொழித் தொடர்பாளர் & ஊடகப் பொறுப்பாளர்', 'ඉංග්‍රීසි භාෂා සන්නිවේදන නිලධාරී', 'executive', '077 227 1248', '+94772271248', 'nashraff1977@gmail.com', 'No. 323, Unit 07, Mullipothana', 'NM', '/images/team/nashraff.webp', '2023 - Present', false, 'BJWS008', '197728401928', 'vtok_nashraff_bjws008', 'verified', '2026-01-01'),
('niyas', 'A.G.M. Niyas', 'Funeral Team Lead', 'ஜனாஸா சேவைக் குழுத் தலைவர்', 'ජනාසා සේවා ප්‍රධානී', 'funeral', '077 344 6710', '+94773446710', 'agm.niyas6710@gmail.com', 'No. 473, Unit 07, Mullipothana', 'AGMN', '/images/team/niyas.webp', '2023 - Present', false, 'BJWS007', '198011402941', 'vtok_niyas_bjws007', 'verified', '2026-01-01'),
('mansoorali', 'M. Mansoor Ali', 'Janaza Transport Logistics Officer', 'ஜனாஸா போக்குவரத்துப் பொறுப்பாளர்', 'ජනාසා ප්‍රවාහන නිලධාරී', 'funeral', '077 386 0076', '+94773860076', 'mansoorali0076@gmail.com', 'No. 327, Unit 07, Mullipothana', 'MMA', '/images/team/mansoorali.webp', '2023 - Present', false, 'BJWS009', '197920104911', 'vtok_mansoorali_bjws009', 'verified', '2026-01-01'),
('rikas', 'M.I. Rikas Ahamed', 'Cemetery Maintenance Supervisor', 'மையவாடி பராமரிப்பு மேற்பார்வையாளர்', 'සුසාන භූමි නඩත්තු අධීක්ෂක', 'cemetery', '075 487 7581', '+94754877581', 'rikas881@gmail.com', 'No. 296, Unit 07, Mullipothana', 'MIRA', '/images/team/rikas.webp', '2023 - Present', false, 'BJWS010', '198821904120', 'vtok_rikas_bjws010', 'verified', '2026-01-01'),
('jaisar', 'S.M. Jaisar', 'Welfare Aid Coordinator', 'நலன்புரி உதவி ஒருங்கிணைப்பாளர்', 'සුභසාධන ආධාර සම්බන්ධීකාරක', 'welfare', '077 912 6061', '+94779126061', 'sm.jaisar1980@gmail.com', 'No. 288/1, Unit 07, Mullipothana', 'SMJ', '/images/team/jaisar.webp', '2023 - Present', false, 'BJWS006', '198418204910', 'vtok_jaisar_bjws006', 'verified', '2026-01-01'),
('irfan', 'M.M.M. Irfan', 'Community Welfare Coordinator', 'சமூக நலன்புரி ஒருங்கிணைப்பாளர்', 'ප්‍රජා සුභසාධන සම්බන්ධීකාරක', 'welfare', '077 220 8475', '+94772208475', 'irfanmmm2020@gmail.com', 'No. 182, Unit 07, Mullipothana', 'MMMI', '/images/team/irfan.webp', '2023 - Present', false, 'BJWS015', '198519203819', 'vtok_irfan_bjws015', 'verified', '2026-01-01'),
('saheeth', 'P.T.M. Saheeth', 'Field Support Volunteer', 'கள உதவித் தன்னார்வலர்', 'ක්ෂේත්‍ර සහායක', 'operations', '077 622 7323', '+94776227323', NULL, 'No. 76, Unit 07, Mullipothana', 'PTMS', '/images/team/saheeth.webp', '2023 - Present', false, 'BJWS016', '198120401928', 'vtok_saheeth_bjws016', 'verified', '2026-01-01'),
('hanees', 'M.H. Hanees', 'Field Support Volunteer', 'கள உதவித் தன்னார்வலர்', 'ක්ෂේත්‍ර සහායක', 'operations', '077 622 7323', '+94776227323', NULL, 'No. 204, Eacha Nagar, Mullipothana', 'MHH', '/images/team/hanees.webp', '2023 - Present', false, 'BJWS017', '198319204918', 'vtok_hanees_bjws017', 'verified', '2026-01-01'),
('nawsath', 'A.M. Nawsath', 'Janaza Equipment Custodian', 'ஜனாஸா உபகரணப் பொறுப்பாளர்', 'ජනාසා උපකරණ භාරකරු', 'funeral', '077 692 9013', '+94776929013', 'nawsath2000@gmail.com', 'No. 40, Iqbal Nagar, Mullipothana', 'AMN', '/images/team/nawsath.webp', '2023 - Present', false, 'BJWS011', '198619402914', 'vtok_nawsath_bjws011', 'verified', '2026-01-01'),
('jawffar', 'A.H. Jawffar', 'Senior Advisory Member', 'சிரேஷ்ட ஆலோசகர்', 'ජ්‍යෙෂ්ඨ උපදේශක', 'executive', '077 622 7323', '+94776227323', NULL, 'No. 95, Unit 07, Mullipothana', 'AHJ', '/images/team/jawffar.webp', '2023 - Present', false, 'BJWS018', '196614203912', 'vtok_jawffar_bjws018', 'verified', '2026-01-01'),
('naleem', 'A. Naleem', 'Field Support Volunteer', 'கள உதவித் தன்னார்வலர்', 'ක්ෂේත්‍ර සහායක', 'operations', '077 622 7323', '+94776227323', NULL, 'No. 310, Unit 07, Mullipothana', 'AN', '/images/team/naleem.webp', '2023 - Present', false, 'BJWS019', '197619204811', 'vtok_naleem_bjws019', 'verified', '2026-01-01'),
('aqsan', 'A.M. Sharfras Aqsan', 'Media & Field Coordinator', 'ஊடக மற்றும் கள ஒருங்கிணைப்பாளர்', 'මාධ්‍ය සහ ක්ෂේත්‍ර සම්බන්ධීකාරක', 'operations', '077 622 7323', '+94776227323', NULL, 'No. 415, Unit 07, Mullipothana', 'AMSA', '/images/team/aqsan.webp', '2023 - Present', false, 'BJWS020', '199720401928', 'vtok_aqsan_bjws020', 'verified', '2026-01-01'),
('yaseer', 'T.F.M. Yaseer', 'Youth Volunteer', 'இளைஞர் தன்னார்வலர்', 'තරුණ ස්වේච්ඡා සේවක', 'operations', '077 622 7323', '+94776227323', NULL, 'No. 415/R1, Unit 07, Mullipothana', 'TFMY', '/images/team/yaseer.webp', '2023 - Present', false, 'BJWS003', '198730104928', 'vtok_yaseer_bjws003', 'verified', '2026-01-01'),
('ramees', 'A. Ramees', 'Field Support Volunteer', 'கள உதவித் தன்னார்வலர்', 'ක්ෂේත්‍ර සහායක', 'operations', '077 622 7323', '+94776227323', NULL, 'No. 120, Unit 07, Mullipothana', 'AR', '/images/team/ramees.webp', '2023 - Present', false, 'BJWS012', '198920104952', 'vtok_ramees_bjws012', 'verified', '2026-01-01')
ON CONFLICT (id) DO UPDATE SET
    member_id = EXCLUDED.member_id,
    nic = EXCLUDED.nic,
    verification_token = EXCLUDED.verification_token,
    verification_status = EXCLUDED.verification_status,
    issue_date = EXCLUDED.issue_date;

-- 2. Approved Gallery Media (6 Core Albums)
INSERT INTO public.gallery_images (id, src, caption, category, date, location, approved)
VALUES
('shramadana-01', '/images/gallery/shramadana-01.webp', 'Cemetery Clean-Up Drive 2026', 'cemetery-shramadana', '2026-03', 'Mullipothana Mahallah Cemetery', true),
('shramadana-02', '/images/gallery/shramadana-02.webp', 'Mahallah Shramadana Volunteers', 'cemetery-shramadana', '2026-03', 'Mullipothana Mahallah Cemetery', true),
('iftar-01', '/images/gallery/iftar-01.webp', 'Ramadan Food Pack Distribution', 'welfare-relief', '2026-02', 'Buhary Jummah Mosque Hall', true),
('water-concrete-01', '/images/gallery/water-concrete-01.webp', 'Cemetery Solar Water Well Inspection', 'cemetery-shramadana', '2026-01', 'Mullipothana Mahallah Cemetery', true),
('ghusl-01', '/images/gallery/ghusl-01.webp', 'Sunnah Janaza Washing Practical Workshop', 'sunnah-workshops', '2026-02', 'Mullipothana Jamiya Hall', true),
('livelihood-01', '/images/gallery/livelihood-01.webp', 'Community Mutual Aid & Family Support', 'welfare-relief', '2026-01', 'Buhary Mahallah Office', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Community Bulletins & Notices (Trilingual)
INSERT INTO public.notices (id, title, body, locale, published_at, is_published)
VALUES
('notice-01-ta', 'மஹல்லா மையவாடி சிரமதானப் பணி அழைப்பு', 'முள்ளிப்பொத்தானை புகாரி ஜும்ஆ பள்ளிவாசல் மையவாடியை துப்புரவு செய்யும் வருடாந்த சிரமதானப் பணியில் அனைத்து இளைஞர்களையும் பொதுமக்களையும் பங்குபற்றுமாறு அன்புடன் அழைக்கின்றோம். உபகரணங்கள் மற்றும் சிற்றுண்டிகள் சங்கத்தினால் வழங்கப்படும்.\n\nகாலம்: எதிர்வரும் ஞாயிறு காலை 7:00 மணி\nஇடம்: முள்ளிப்பொத்தானை மையவாடி வளாகம்\nதொடர்புகளுக்கு: 077 622 7323', 'ta', '2026-03-01T08:00:00Z', true),
('notice-01-en', 'Annual Cemetery Shramadhana & Grounds Maintenance Drive', 'The Buhary Janaza Welfare Society warmly invites all community members and youth volunteers to take part in the upcoming cemetery clean-up drive.\n\nDate: Coming Sunday at 7:00 AM\nVenue: Mahallah Cemetery Grounds, Mullipothana\nTools and refreshments will be provided. Hotline: 077 622 7323', 'en', '2026-03-01T08:00:00Z', true),
('notice-01-si', 'මහල්ල සුසාන භූමි වාර්ෂික ශ්‍රමදාන වැඩසටහන', 'මොල්ලිපොතාන බුහාරි සුසාන භූමිය පිරිසිදු කිරීමේ වාර්ෂික ශ්‍රමදාන කටයුතු සඳහා ප්‍රජාවේ සියලු දෙනාට සහභාගී වන ලෙස ගෞරවයෙන් ආරාධනා කරමු.\n\nදිනය: එළඹෙන ඉරිදා පෙ.ව. 7:00 ට\nස්ථානය: මොල්ලිපොතාන සුසාන භූමි පරිශ්‍රය\nවිමසීම්: 077 622 7323', 'si', '2026-03-01T08:00:00Z', true),
('notice-02-ta', '2026 ஆம் ஆண்டிற்கான புதிய அங்கத்துவ பதிவு ஆரம்பம்', 'எமது சங்கத்தின் மாதாந்த மற்றும் வருடாந்த நலன்புரி திட்டத்தில் இணைந்து கொள்ள விரும்பும் மஹல்லா வாசிகள் இணையத்தளம் மூலமாக அல்லது காரியாலயத்தில் விண்ணப்பிக்கலாம்.\n\nமாதாந்த சந்தா: ரூபா 50 | வருடாந்த சந்தா: ரூபா 500\nதொடர்புகளுக்கு: 077 622 7323', 'ta', '2026-02-25T10:00:00Z', true),
('notice-02-en', 'Membership Enrollment Open for 2026/2027', 'Mahallah residents can now enroll under the comprehensive funeral welfare assistance scheme online or via the administrative desk.\n\nMonthly Plan: LKR 50 | Annual Plan: LKR 500\nHelpline: 077 622 7323', 'en', '2026-02-25T10:00:00Z', true),
('notice-02-si', '2026 වසර සඳහා නව සාමාජික ලියාපදිංචිය ආරම්භයි', 'අප සමිතියේ ජනාසා සුභසාධක ආවරණය ලබා ගැනීම සඳහා මාර්ගගතව හෝ ලේකම් කාර්යාලය හරහා ලියාපදිංචි විය හැක.\n\nමාසික දායකත්වය: රු. 50 | වාර්ෂික දායකත්වය: රු. 500\nවිමසීම්: 077 622 7323', 'si', '2026-02-25T10:00:00Z', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Verified Articles (3 Articles per Language)
INSERT INTO public.articles (id, slug, title, excerpt, content, category, author, image_url, locale, published_at, is_published)
VALUES
(
    'art-shramadana-2026-en',
    'cemetery-cleanup-drive-2026',
    'Community Mobilization: Comprehensive Clean-Up Drive at Mahallah Cemetery',
    'Over 60 dedicated community members and youth volunteers united on Sunday morning for the bi-annual maintenance drive at the Buhary Mahallah cemetery.',
    'Alhamdulillah, on Sunday morning, over 60 dedicated community members and youth volunteers united for the bi-annual maintenance and beautification campaign at the Buhary Mahallah Cemetery.\n\nThrough disciplined teamwork, the community cleared overgrown vegetation, serviced the dedicated solar well and ablution taps, resurfaced the access pathway, and repaired boundary fencing.\n\n"Maintaining the resting places of our departed loved ones with dignity is a sacred communal obligation (Fard Kifayah)," noted President A.M. Sahibullah. "Seeing youth and elders work shoulder to shoulder exemplifies the true spirit of Buhary Janaza Welfare Society."',
    'cemetery',
    'BJWS Media Bureau',
    '/images/gallery/shramadana-01.webp',
    'en',
    '2026-03-02T08:00:00Z',
    true
),
(
    'art-shramadana-2026-ta',
    'cemetery-cleanup-drive-2026-ta',
    'முள்ளிப்பொத்தானை மஹல்லா மையவாடியில் மாபெரும் சிரமதானப் பணி',
    'முள்ளிப்பொத்தானை புகாரி ஜும்ஆ பள்ளிவாசல் மையவாடியில் இளைஞர்கள் மற்றும் ஊர்ப் பெரியார்கள் இணைந்து முன்னெடுத்த சிரமதானப் பணி வெற்றிகரமாக நிறைவுற்றது.',
    'அல்ஹம்துலில்லாஹ், கடந்த ஞாயிற்றுக்கிழமை காலை முள்ளிப்பொத்தானை புகாரி ஜும்ஆ பள்ளிவாசல் மையவாடியில் சங்கத்தினால் ஒழுங்கு செய்யப்பட்ட மாபெரும் துப்புரவு மற்றும் சிரமதானப் பணி வெற்றிகரமாக முன்னெடுக்கப்பட்டது.\n\nஇதில் 60 இற்கும் மேற்பட்ட இளைஞர்களும் பொதுமக்களும் ஆர்வத்துடன் கலந்து கொண்டு முட்செடிகளை அகற்றி, நீர் விநியோக வசதிகளைச் சீரமைத்து, மையவாடிப் பாதையைச் செப்பனிட்டனர்.',
    'cemetery',
    'BJWS ஊடகப் பிரிவு',
    '/images/gallery/shramadana-01.webp',
    'ta',
    '2026-03-02T08:00:00Z',
    true
),
(
    'art-shramadana-2026-si',
    'cemetery-cleanup-drive-2026-si',
    'මොල්ලිපොතාන මහල්ල සුසාන භූමියේ මහා ශ්‍රමදාන වැඩසටහන',
    'මොල්ලිපොතාන බුහාරි සුසාන භූමිය පිරිසිදු කිරීමේ වාර්ෂික ශ්‍රමදාන කටයුතු සාර්ථකව නිමාවට පත්විය.',
    'මොල්ලිපොතාන බුහාරි සුසාන භූමි පරිශ්‍රය පිරිසිදු කිරීමේ සහ නඩත්තු කිරීමේ මහා ශ්‍රමදාන වැඩසටහන සාර්ථකව පවත්වන ලදී.\n\nතරුණයින් සහ ප්‍රජා නායකයින් එක්ව පරිශ්‍රය පිරිසිදු කර ජල පහසුකම් පිළිසකර කරන ලදී.',
    'cemetery',
    'BJWS මාධ්‍ය අංශය',
    '/images/gallery/shramadana-01.webp',
    'si',
    '2026-03-02T08:00:00Z',
    true
),
(
    'art-membership-2026-en',
    'membership-enrollment-update-2026',
    'BJWS Annual Membership & Mutual Safety Net Scheme Open for 2026',
    'Revised affordable welfare contributions: Monthly plan is now LKR 50, and annual one-time settlement is LKR 500.',
    'The Executive Committee of Buhary Janaza Welfare Society announces that membership enrollment and renewal for the 2026/2027 term is now officially open for all resident Muslim households of the Buhary Mahallah in Mullipothana.\n\n### Contribution Schedule:\n- **Monthly Welfare Subscription:** LKR 50 per month\n- **Annual Welfare Settlement:** LKR 500 per year\n\n### What Your Membership Guarantees:\n- Immediate 24/7 coordination team dispatch upon notification.\n- Provision of quality shrouding fabric (Kafan), camphor, perfumes, and washing essentials.\n- Organization of ritual Ghusl by trained practitioners.\n- Cemetery grave digging, burial permits, and logistical transport coordination.\n- Comprehensive fee exemptions for financially vulnerable families.',
    'announcements',
    'Executive Committee',
    '/images/gallery/shramadana-02.webp',
    'en',
    '2026-02-25T10:00:00Z',
    true
),
(
    'art-membership-2026-ta',
    'membership-enrollment-update-2026-ta',
    '2026 ஆம் ஆண்டிற்கான புதிய அங்கத்துவப் பதிவு மற்றும் சந்தா விபரம்',
    'மாதாந்த சந்தா ரூபா 50 மற்றும் வருடாந்த சந்தா ரூபா 500 என நிர்ணயிக்கப்பட்டுள்ளது.',
    'முள்ளிப்பொத்தானை புகாரி மஹல்லா வாசிகள் எமது சங்கத்தின் ஜனாஸா நலன்புரி திட்டத்தில் புதிய அங்கத்தவர்களாக இணைந்து கொள்வதற்கான பதிவுகள் தற்போது ஆரம்பிக்கப்பட்டுள்ளன.\n\n### சந்தா விபரம்:\n- மாதாந்த சந்தா: ரூபா 50\n- வருடாந்த சந்தா: ரூபா 500\n\nஅங்கத்துவத்தின் மூலம் சகல ஜனாஸா சேவைகளும் எவ்வித சிரமமுமின்றி பெற்றுக்கொள்ள முடியும்.',
    'announcements',
    'நிர்வாகக் குழு',
    '/images/gallery/shramadana-02.webp',
    'ta',
    '2026-02-25T10:00:00Z',
    true
),
(
    'art-membership-2026-si',
    'membership-enrollment-update-2026-si',
    '2026 වසර සඳහා නව සාමාජික ලියාපදිංචිය සහ දායකත්ව විස්තර',
    'මාසික දායකත්වය රු. 50 ක් සහ වාර්ෂික දායකත්වය රු. 500 ක් ලෙස සංශෝධනය කර ඇත.',
    'මොල්ලිපොතාන බුහාරි මහල්ල ප්‍රජාව සඳහා ජනාසා සුභසාධන ආවරණය ලබා ගැනීමේ නව සාමාජික ලියාපදිංචිය දැන් ආරම්භ කර ඇත.\n\n- මාසික දායකත්වය: රු. 50\n- වාර්ෂික දායකත්වය: රු. 500',
    'announcements',
    'විධායක කමිටුව',
    '/images/gallery/shramadana-02.webp',
    'si',
    '2026-02-25T10:00:00Z',
    true
)
ON CONFLICT (slug) DO NOTHING;

