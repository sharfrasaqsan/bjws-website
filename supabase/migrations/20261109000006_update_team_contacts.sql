-- ==============================================================================
-- Migration: 20261109000006_update_team_contacts.sql
-- Description: Update verified phone, WhatsApp, email, and address for team members.
-- Targets: public.team_members
-- Note: Member primary keys (id), member_ids (e.g. BJWS004), and roles are preserved.
-- ==============================================================================

-- 1. A.M. Sahibullah (BJWS004)
UPDATE public.team_members
SET 
    phone = '072 440 9574',
    whatsapp = '+94724409574',
    email = 'sahibullahmohamed0@gmail.com',
    address = 'No. 420, Unit 07, Mullipothana'
WHERE id = 'sahibullah' OR name ILIKE '%Sahibullah%';

-- 2. A.M.A. Gafoor (BJWS013)
UPDATE public.team_members
SET 
    phone = '075 343 2627',
    whatsapp = '+94753432627',
    email = 'gafoorgafoor871@gmail.com',
    address = 'No. 101, Eacha Nagar, Mullipothana'
WHERE id = 'gafoor' OR name ILIKE '%Gafoor%';

-- 3. A.L.M. Siyam (BJWS005)
UPDATE public.team_members
SET 
    phone = '077 278 2829',
    whatsapp = '+94772782829',
    email = 'mohamedshiyam2233@gmail.com',
    address = 'No. 85, Eacha Nagar, Mullipothana'
WHERE id = 'siyam' OR name ILIKE '%Siyam%';

-- 4. M.S. Riyas (BJWS002)
UPDATE public.team_members
SET 
    phone = '077 988 2766',
    whatsapp = '+94779882766',
    email = 'Sayirms@gmail.com',
    address = 'No. 53/7, Eachcha Nagar, Mullipothana'
WHERE id = 'riyas' OR name ILIKE '%Riyas%';

-- 5. M.S. Faizarkhan (BJWS014)
UPDATE public.team_members
SET 
    phone = '075 651 0050',
    whatsapp = '+94756510050',
    email = 'faisarkhan95@gmail.com',
    address = 'No. 335, Unit 07, Mullipothana'
WHERE id = 'faizarkhan' OR name ILIKE '%Faizarkhan%';

-- 6. Abuthalib Abuhuraira (BJWS001)
UPDATE public.team_members
SET 
    phone = '077 622 7323',
    whatsapp = '+94776227323',
    email = 'Sawth059@gmail.com',
    address = 'No. 415/R1, Unit 07, Mullipothana'
WHERE id = 'abuhuraira' OR name ILIKE '%Abuhuraira%';

-- 7. N.M. Shamed Nashraff (BJWS008)
UPDATE public.team_members
SET 
    phone = '077 227 1248',
    whatsapp = '+94772271248',
    email = 'nashraff1977@gmail.com',
    address = 'No. 323, Unit 07, Mullipothana'
WHERE id = 'nashraff' OR name ILIKE '%Nashraff%';

-- 8. A.G.M. Niyas (BJWS006)
UPDATE public.team_members
SET 
    phone = '077 529 0417',
    whatsapp = '+94775290417',
    email = 'agm.niyas6710@gmail.com',
    address = 'No. 356, Unit 07, Mullipothana'
WHERE id = 'niyas' OR name ILIKE '%Niyas%';

-- 9. M. Mansoor Ali (BJWS009)
UPDATE public.team_members
SET 
    phone = '077 707 3037',
    whatsapp = '+94777073037',
    email = 'mmmmansoor@gmail.com',
    address = 'No. 356, Unit 07, Mullipothana'
WHERE id = 'mansoorali' OR name ILIKE '%Mansoor%';

-- 10. Mohamed Iqbal Rikas Ahamed (BJWS010)
UPDATE public.team_members
SET 
    phone = '076 715 2016',
    whatsapp = '+94767152016',
    email = 'rikasrikas123@gmail.com',
    address = 'No. 313, Unit 07, Mullipothana'
WHERE id = 'rikas' OR name ILIKE '%Rikas%';

-- 11. S.M. Jaisar (BJWS003)
UPDATE public.team_members
SET 
    phone = '076 713 9496',
    whatsapp = '+94767139496'
WHERE id = 'jaisar' OR name ILIKE '%Jaisar%';

-- 12. M.M.M. Irfan (BJWS015)
UPDATE public.team_members
SET 
    phone = '076 340 5758',
    whatsapp = '+94763405758',
    email = 'irfanmmm2020@gmail.com',
    address = 'No. 133D, Eachcha Nagar, Mullipothana'
WHERE id = 'irfan' OR name ILIKE '%Irfan%';

-- 13. P.T.M. Saheeth (BJWS016)
UPDATE public.team_members
SET 
    phone = '075 263 0333',
    whatsapp = '+94752630333',
    email = 'ptsaheeth@gmail.com',
    address = 'No. 125/A1, Eachcha Nagar, Mullipothana'
WHERE id = 'saheeth' OR name ILIKE '%Saheeth%';

-- 14. M.H. Hanees (BJWS017)
UPDATE public.team_members
SET 
    phone = '077 552 5935',
    whatsapp = '+94775525935',
    email = 'mhhaneesmhhanees@gmail.com',
    address = 'No. 363, Unit 07, Mullipothana'
WHERE id = 'hanees' OR name ILIKE '%Hanees%';

-- 15. A.M. Nawsath (BJWS011)
UPDATE public.team_members
SET 
    phone = '075 202 6133',
    whatsapp = '+94752026133',
    email = 'Nawsath1986@gmail.com',
    address = 'No. 68/1, Eachcha Nagar, Mullippothana'
WHERE id = 'nawsath' OR name ILIKE '%Nawsath%';

-- 16. A.H. Jawffar (BJWS018)
UPDATE public.team_members
SET 
    phone = '075 425 3586',
    whatsapp = '+94754253586',
    email = 'jawffar1966@gmail.com',
    address = 'No. 18/1, Eachcha Nagar, Mullipothana'
WHERE id = 'jawffar' OR name ILIKE '%Jawffar%';

-- 17. A. Naleem (BJWS019)
UPDATE public.team_members
SET 
    phone = '075 916 2799',
    whatsapp = '+94759162799',
    email = 'naleemmavlaviy@gmail.com',
    address = 'No. 339, Unit 07, Mullipothana'
WHERE id = 'naleem' OR name ILIKE '%Naleem%';

-- 18. A.M. Sharfras Aqsan (BJWS020)
UPDATE public.team_members
SET 
    phone = '075 123 0001',
    whatsapp = '+94751230001',
    email = 'sharfrasaqsan@gmail.com',
    address = 'No. 363, Unit 07, Mullipothana'
WHERE id = 'aqsan' OR name ILIKE '%Aqsan%';

-- 19. T.F.M. Yaseer (BJWS007)
UPDATE public.team_members
SET 
    phone = '077 082 6535',
    whatsapp = '+94770826535',
    email = 'Tfmyaseer013@gmail.com',
    address = 'No. 93/D, Eachcha Nagar, Mullipothana'
WHERE id = 'yaseer' OR name ILIKE '%Yaseer%';

-- 20. A. Ramees (BJWS012)
UPDATE public.team_members
SET 
    phone = '077 837 4420',
    whatsapp = '+94778374420',
    email = 'rameesrayyan419@gmail.com',
    address = 'No. 419, Unit 07, Mullipothana'
WHERE id = 'ramees' OR name ILIKE '%Ramees%';
