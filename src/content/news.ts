export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "cemetery" | "welfare" | "sunnah" | "announcements" | "general";
  categoryLabel: {
    en: string;
    ta: string;
    si: string;
  };
  author: string;
  image_url: string;
  locale: "en" | "ta" | "si";
  published_at: string;
  is_published: boolean;
  read_time_minutes: number;
}

export const SEED_ARTICLES: Article[] = [
  {
    id: "art-shramadhana-2026",
    slug: "annual-cemetery-shramadhana-2026",
    title: "Annual Mahallah Cemetery Shramadhana & Grounds Restoration Completed",
    excerpt: "Over 80 community volunteers and youth joined hands to clear, beautify, and reinforce pathways across the 1.5-acre cemetery grounds.",
    content: `The Buhary Janaza Welfare Society (BJWS) successfully concluded its flagship Annual Cemetery Shramadhana and Maintenance Drive this past weekend at the Buhary Jummah Mosque Mahallah Cemetery in Mullipothanai.

Under the active guidance of Society President A.M. Sahibullah and Cemetery Warden K.M. Niyas, more than 80 volunteers—comprising community elders, youth, and local residents—participated in this noble collective effort for the pleasure of Allah (SWT).

### Key Accomplishments of the Clean-Up Drive:
1. **Vegetation & Weed Clearing:** Thorough clearing of invasive overgrowth, wild bushes, and debris across the entire 1.5-acre resting grounds.
2. **Pedestrian & Transport Pathways:** Restoration of the gravel access road leading from Kandy Road, ensuring smooth funeral vehicle and hearse accessibility in all weather conditions.
3. **Solar & Water Infrastructure:** Cleared and tested the solar water supply pumps, storage tanks, and ablution taps dedicated for visitors and grave preparation crews.
4. **Boundary & Marker Alignment:** Demarcated burial plots systematically to maintain respectful distances and tidy navigation for grieving families.

"Preserving the sanctity and cleanliness of our resting grounds is a fundamental collective duty (Fard Kifayah) for our community," remarked Secretary A.L.M. Siyam during the post-shramadhana assembly. "We express our sincere gratitude to all youth who gave their time and energy to honor our departed brothers and sisters."

The Society extends its heartfelt prayers and Jazakallah Khair to every volunteer who contributed tools, machinery, and refreshments. Regular maintenance rounds will continue monthly under the oversight of our dedicated grounds team.`,
    category: "cemetery",
    categoryLabel: {
      en: "Cemetery Care",
      ta: "மையவாடி பராமரிப்பு",
      si: "සුසාන භූමි නඩත්තුව",
    },
    author: "BJWS Media Secretariat",
    image_url: "/images/gallery/shramadana-01.webp",
    locale: "en",
    published_at: "2026-03-02T08:00:00Z",
    is_published: true,
    read_time_minutes: 4,
  },
  {
    id: "art-membership-2026",
    slug: "membership-enrollment-update-2026",
    title: "BJWS Annual Membership & Mutual Safety Net Scheme Open for 2026",
    excerpt: "Revised affordable welfare contributions: Monthly plan is now LKR 60, and annual one-time settlement is LKR 500.",
    content: `The Executive Committee of Buhary Janaza Welfare Society announces that membership enrollment and renewal for the 2026/2027 term is now officially open for all resident Muslim households of the Buhary Mahallah in Mullipothanai.

To ensure maximum inclusivity and alleviate economic burdens on families, the society assembly has established an affordable dual contribution schedule:

### Contribution Schedule:
- **Monthly Welfare Subscription:** LKR 60 per month (collected via designated area collectors or digital transfer).
- **Annual Welfare Settlement:** LKR 500 per year (one-time settlement covering the complete operational cycle).

### What Your Membership Guarantees:
Every registered member household receives full, round-the-clock funeral assistance during moments of bereavement, including:
- Immediate 24/7 coordination team dispatch upon notification.
- Provision of quality shrouding fabric (Kafan), camphor, perfumes, and washing essentials.
- Organization of ritual Ghusl by trained, certified practitioners.
- Cemetery grave digging, burial permits, and logistical transport coordination.
- Comprehensive exemption from funeral fees for financially struggling households.

"Our goal is that no family in Mullipothanai should ever face the pain of losing a loved one with financial anxiety," said Treasurer M.S. Faisarkhan. "The modest subscription of LKR 60 per month forms a collective safety net that shields every neighbor."

Enrollment can be completed online via our website or in-person at the Society Administrative Desk at the 95th Mile Post Buhary Jummah Mosque.`,
    category: "announcements",
    categoryLabel: {
      en: "Announcements",
      ta: "அறிவித்தல்கள்",
      si: "නිවේදන",
    },
    author: "Executive Committee",
    image_url: "/images/gallery/shramadana-02.webp",
    locale: "en",
    published_at: "2026-02-25T10:00:00Z",
    is_published: true,
    read_time_minutes: 3,
  },
  {
    id: "art-sunnah-workshop-2026",
    slug: "proper-ghusl-and-kafan-workshop",
    title: "Sunnah Rites & Practical Workshop: Ritual Washing (Ghusl) and Shrouding (Kafan)",
    excerpt: "Practical demonstration conducted for 45 youth volunteers under senior Islamic scholars to ensure adherence to authentic Prophetic traditions.",
    content: `In accordance with our objective to empower the younger generation with essential religious competencies, the Buhary Janaza Welfare Society recently hosted a comprehensive Janaza Preparation Seminar and Hands-on Workshop at the Jamiya Mosque Hall.

Facilitated by Funeral Welfare Lead M.I. Mohamed Farook alongside respected local Imams, the intensive training brought together 45 young volunteers from across Mullipothanai and surrounding Mahallahs.

### Core Modules Covered During the Seminar:
1. **The Islamic Perspective on Death & Dignity:** Understanding the rights of the deceased and the supreme etiquette required when handling a Janaza.
2. **Hands-on Ghusl Demonstration:** Step-by-step practical training on ritual purification using water, lotus leaves (sidr), and camphor, while strictly preserving modesty and privacy.
3. **Kafan Tailoring & Shrouding:** Demonstrating standard cutting, wrapping, and knotting of shrouding sheets for both males and females according to authentic Sunnah.
4. **Emotional Intelligence & Bereavement Etiquette:** How to comfort grieving relatives with tact, empathy, and Qur'anic supplications.

"Passing down these essential communal responsibilities ensures our community remains self-reliant and rooted in pure Islamic character," stated Coordinator A. Aboohuraira.

Participants received official BJWS Volunteer Certificates and were formally integrated into our 24/7 on-call emergency response roster.`,
    category: "sunnah",
    categoryLabel: {
      en: "Sunnah Education",
      ta: "சுன்னாஹ் வழிகாட்டல்",
      si: "ඉස්ලාමීය අධ්‍යාපනය",
    },
    author: "Islamic Welfare Bureau",
    image_url: "/images/gallery/ghusl-01.webp",
    locale: "en",
    published_at: "2026-02-14T09:30:00Z",
    is_published: true,
    read_time_minutes: 5,
  },
  {
    id: "art-ration-distribution-2026",
    slug: "monthly-dry-ration-welfare-drive",
    title: "Monthly Dry Ration Welfare Drive Reaches 750+ Deserving Families",
    excerpt: "Essential food security packages comprising rice, flour, dhal, and cooking essentials delivered quietly to doorstep of vulnerable households.",
    content: `Amidst ongoing economic challenges affecting low-income families and daily wage earners, the Buhary Janaza Welfare Society completed another major phase of its ongoing Monthly Food Assistance Initiative.

Supervised by Welfare Officer S.H. Mohamed Rizan, volunteers packaged and distributed nutritious dry food packs directly to the doorsteps of over 750 families, focusing on widows, orphans, elderly persons without support, and households facing acute hardship.

### Each Ration Parcel Included:
- 10 kg of Samba & Nadu rice
- 2 kg Red lentils (Dhal)
- 2 kg Wheat flour
- 2 kg White sugar
- 1 liter Vegetable cooking oil
- Tea leaves and essential condiments

To protect the self-respect and dignity of all recipients, distributions were carried out discreetly in the early morning and late evening directly to residences, following strict confidentiality guidelines established by the executive council.

"Feeding the hungry and caring for our neighbors is at the heart of our Islamic faith," remarked President A.M. Sahibullah. "We express our sincere gratitude to individual philanthropists and Mahallah diaspora members whose sadaqah and donations make this continuous lifeline possible."

Plans are underway to expand the upcoming round into special Ramadan Blessing Hampers ahead of the holy month.`,
    category: "welfare",
    categoryLabel: {
      en: "Welfare Relief",
      ta: "உலர் உணவு நிவாரணம்",
      si: "සුභසාධන සහන",
    },
    author: "Welfare Relief Desk",
    image_url: "/images/gallery/iftar-01.webp",
    locale: "en",
    published_at: "2026-01-28T11:00:00Z",
    is_published: true,
    read_time_minutes: 4,
  },
  // Tamil Localized Seed Articles
  {
    id: "art-shramadhana-2026-ta",
    slug: "annual-cemetery-shramadhana-2026-ta",
    title: "முள்ளிப்பொத்தானை மஹல்லா மையவாடி வருடாந்த சிரமதானப் பணி வெற்றிகரமாக நிறைவு",
    excerpt: "80 க்கும் மேற்பட்ட இளைஞர்கள் மற்றும் பொதுமக்கள் ஒன்றிணைந்து 1.5 ஏக்கர் மையவாடி நிலத்தை துப்புரவு செய்து புனரமைத்தனர்.",
    content: `முள்ளிப்பொத்தானை புகாரி ஜும்ஆ பள்ளிவாசல் பகுதி மையவாடியை தூய்மைப்படுத்தி பராமரிக்கும் வருடாந்த சிரமதானப் பணி கடந்த ஞாயிற்றுக்கிழமை சங்கத் தலைவர் A.M. சாகிபுல்லாஹ் மற்றும் மையவாடி பொறுப்பாளர் K.M. நியாஸ் ஆகியோரின் வழிகாட்டலில் வெகு சிறப்பாக நடைபெற்றது.

இப்பணியில் 80 க்கும் மேற்பட்ட இளைஞர்கள், பொதுமக்கள் மற்றும் நலன்விரும்பிகள் தன்னார்வத்துடன் கலந்துகொண்டு மையவாடியை சீரமைக்கும் பணியில் ஈடுபட்டனர்.

### சிரமதானத்தின் முக்கிய பணிகள்:
1. **முட்புதர்கள் மற்றும் கழிவுகள் அகற்றுதல்:** 1.5 ஏக்கர் பரப்பளவிலான மையவாடி வளாகத்தில் அடர்ந்து வளர்ந்திருந்த முட்புதர்கள் மற்றும் தேவையற்ற கழிவுகள் முழுமையாக அகற்றப்பட்டன.
2. **பாதைகள் சீரமைப்பு:** கண்டி வீதியிலிருந்து மையவாடிக்கு செல்லும் பிரதான பாதை மழைக்காலத்திலும் வாகனங்கள் சென்றுவரக்கூடிய வகையில் கொங்கிரீட் மற்றும் சரளைக்கற்கள் இடப்பட்டு புனரமைக்கப்பட்டது.
3. **நீர் விநியோக வசதிகள்:** ஜனாஸா குளிப்பாட்டல் மற்றும் அடக்கப் பணிகளுக்கு தேவையான சோலார் நீர் இறைக்கும் இயந்திரம் மற்றும் நீர்த்தாங்கி சுத்திகரிக்கப்பட்டு தயார் நிலையில் வைக்கப்பட்டது.
4. **அடையாளக் குறியீடுகள்:** மையவாடி நிலப்பரப்பு முறையாக ஒழுங்குபடுத்தப்பட்டு அடையாளக் குறியீடுகள் புதுப்பிக்கப்பட்டன.

சங்கத்தின் செயலாளர் A.L.M. சியாம் கருத்து தெரிவிக்கையில், "மையவாடியை கண்ணியமாகவும் தூய்மையாகவும் பராமரிப்பது எமது சமூகத்தின் தலையாய கடமையாகும். இப்பணியில் பங்கேற்ற அனைத்து சகோதரர்களுக்கும் அல்லாஹ் நற்கூலி வழங்குவானாக" என்றார்.`,
    category: "cemetery",
    categoryLabel: {
      en: "Cemetery Care",
      ta: "மையவாடி பராமரிப்பு",
      si: "සුසාන භූමි නඩත්තුව",
    },
    author: "ஊடகப் பிரிவு",
    image_url: "/images/gallery/shramadana-01.webp",
    locale: "ta",
    published_at: "2026-03-02T08:00:00Z",
    is_published: true,
    read_time_minutes: 4,
  },
  {
    id: "art-membership-2026-ta",
    slug: "membership-enrollment-update-2026-ta",
    title: "2026 ஆம் ஆண்டிற்கான புதிய அங்கத்துவ பதிவு மற்றும் கட்டண விபரம்",
    excerpt: "சமூகத்தின் நலன் கருதி திருத்தப்பட்ட சந்தா: மாதாந்தம் ரூபா 60 மற்றும் வருடாந்தம் ரூபா 500.",
    content: `புகாரி ஜனாஸா நலன்புரிச் சங்கத்தின் (BJWS) 2026 ஆம் ஆண்டிற்கான அங்கத்துவப் பதிவுகளும் புதுப்பித்தல்களும் தற்போது உத்தியோகபூர்வமாக ஆரம்பிக்கப்பட்டுள்ளன.

சமூகத்தின் பொருளாதார நிலையைக் கருத்தில் கொண்டு, எளிய மாதாந்த மற்றும் வருடாந்த சந்தா நிர்ணயிக்கப்பட்டுள்ளது:

### அங்கத்துவ சந்தா விபரம்:
- **மாதாந்த சந்தா:** ரூபா 60 (மஹல்லா பகுதி வசூலிப்பாளர்கள் அல்லது வங்கி வைப்பிலிடல் மூலம்).
- **வருடாந்த சந்தா:** ரூபா 500 (ஒருமுறை முழு வருடத்திற்கான கொடுப்பனவு).

### அங்கத்துவம் வழங்குவது என்ன?
- 24/7 உடனடி ஜனாஸா சேவை ஒருங்கிணைப்பு.
- கஃபன் துணி மற்றும் குளிப்பாட்டல் உபகரணங்கள் இலவசமாக வழங்கப்படல்.
- பயிற்சி பெற்ற அனுபவமிக்கோரால் சுன்னாஹ் முறைப்படியான குளிப்பாட்டல்.
- அடக்க ஒழுங்குகள் மற்றும் மையவாடி ஒருங்கிணைப்பு.

அங்கத்துவ விண்ணப்பப் படிவங்களை எமது இணையத்தளம் ஊடாகவோ அல்லது 95ம் கட்டை பள்ளிவாசல் நிர்வாகக் காரியாலயத்திலோ பெற்றுக்கொள்ளலாம்.`,
    category: "announcements",
    categoryLabel: {
      en: "Announcements",
      ta: "அறிவித்தல்கள்",
      si: "නිවේදන",
    },
    author: "நிர்வாகக் குழு",
    image_url: "/images/gallery/shramadana-02.webp",
    locale: "ta",
    published_at: "2026-02-25T10:00:00Z",
    is_published: true,
    read_time_minutes: 3,
  },
  // Sinhala Localized Seed Articles
  {
    id: "art-shramadhana-2026-si",
    slug: "annual-cemetery-shramadhana-2026-si",
    title: "මුල්ලිපොத்தான සුසාන භූමි වාර්ෂික ශ්‍රමදානය සාර්ථකව අවසන්",
    excerpt: "තරුණයින් සහ ප්‍රජා නායකයින් 80 කට අධික පිරිසකගේ සහභාගීත්වයෙන් අක්කර 1.5 ක සුසාන භූමිය පිරිසිදු කරන ලදී.",
    content: `බුහාරි ජනාසා සුභසාධක සමිතිය (BJWS) විසින් වාර්ෂිකව සංවිධානය කරනු ලබන මහල්ල සුසාන භූමි ශ්‍රමදාන වැඩසටහන පසුගියදා මුල්ලිපොத்தான බුහාරි සුසාන භූමි පරිශ්‍රයේදී සාර්ථකව පවත්වන ලදී.

සමිතියේ සභාපති A.M. සාහිබුල්ලාහ් සහ සුසාන භූමි පාලක K.M. නියාස් යන මහත්වරුන්ගේ මඟපෙන්වීම යටතේ ස්වේච්ඡා සේවකයින් 80 කට අධික පිරිසක් මේ සඳහා එක්වූහ.

### ශ්‍රමදානයේදී සිදුකළ ප්‍රධාන කටයුතු:
1. අක්කර 1.5 ක භූමියේ වල් පැලෑටි සහ අපද්‍රව්‍ය ඉවත් කිරීම.
2. සුසාන භූමියට පිවිසෙන ප්‍රවේශ මාර්ගය පිළිසකර කිරීම.
3. ජල සැපයුම සහ සූර්ය බලශක්ති පොම්ප පද්ධතිය පරීක්ෂා කර නඩත්තු කිරීම.
4. සොහොන් සලකුණු සහ මංමාවත් නිසි පරිදි වෙන් කිරීම.

ප්‍රජාව වෙනුවෙන් සිදුකළ මෙම උතුම් සේවයට දායක වූ සැමට සමිතියේ කෘතඥතාව හිමිවේ.`,
    category: "cemetery",
    categoryLabel: {
      en: "Cemetery Care",
      ta: "மையவாடி பராமரிப்பு",
      si: "සුසාන භූමි නඩත්තුව",
    },
    author: "මාධ්‍ය අංශය",
    image_url: "/images/gallery/shramadana-01.webp",
    locale: "si",
    published_at: "2026-03-02T08:00:00Z",
    is_published: true,
    read_time_minutes: 4,
  },
  {
    id: "art-membership-2026-si",
    slug: "membership-enrollment-update-2026-si",
    title: "2026 වසර සඳහා නව සාමාජික ලියාපදිංචිය සහ දායකත්ව විස්තර",
    excerpt: "ප්‍රජාවගේ පහසුව තකා සංශෝධිත දායකත්වය: මසකට රු. 60 සහ වසරකට රු. 500.",
    content: `මුල්ලිපොத்தான බුහාරි ජුම්මා මස්ජිද ප්‍රදේශයේ පදිංචි මුස්ලිම් ප්‍රජාව වෙනුවෙන් 2026 වසර සඳහා සාමාජික ලියාපදිංචිය දැන් විවෘතව පවතී.

### සාමාජික දායකත්ව විස්තර:
- **මාසික දායකත්වය:** මසකට රු. 50.
- **වාර්ෂික දායකත්වය:** වසරකට රු. 500.

### සාමාජිකත්වයෙන් හිමිවන ප්‍රතිලාභ:
- පැය 24 පුරා ක්‍රියාත්මක හදිසි අවමංගල්‍ය සහාය.
- කෆන් රෙදි සහ නාන උපකරණ නොමිලේ සැපයීම.
- ඉස්ලාමීය සම්ප්‍රදායානුකූල අවමංගල්‍ය කටයුතු සම්පූර්ණ කිරීම.
- සුසාන භූමි පහසුකම් සහ නීතිමය ලියකියවිලි සම්බන්ධීකරණය.

වැඩිදුර විස්තර සඳහා සමිතියේ ක්ෂණික දුරකථන අංකය අමතන්න: 077 622 7323.`,
    category: "announcements",
    categoryLabel: {
      en: "Announcements",
      ta: "அறிவித்தல்கள்",
      si: "නිවේදන",
    },
    author: "විධායක කමිටුව",
    image_url: "/images/gallery/shramadana-02.webp",
    locale: "si",
    published_at: "2026-02-25T10:00:00Z",
    is_published: true,
    read_time_minutes: 3,
  },
];

// In-memory persistent storage for server actions in development / demo mode
let liveArticlesStore = [...SEED_ARTICLES];

export function getArticles(locale: string = "en", includeDrafts: boolean = false): Article[] {
  let list = liveArticlesStore;
  if (!includeDrafts) {
    list = list.filter((a) => a.is_published);
  }

  const localized = list.filter((a) => a.locale === locale);
  if (localized.length > 0) {
    return localized.sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  }

  // Fallback to English articles if active locale has no entries
  return list
    .filter((a) => a.locale === "en")
    .sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
}

export function getAllArticlesAdmin(): Article[] {
  return [...liveArticlesStore].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export function getArticleBySlug(slug: string, locale: string = "en"): Article | undefined {
  const cleanSlug = decodeURIComponent(slug).toLowerCase();
  
  // Try exact match with locale
  let match = liveArticlesStore.find(
    (a) => a.slug.toLowerCase() === cleanSlug && a.locale === locale
  );
  if (match) return match;

  // Try slug match with any locale
  match = liveArticlesStore.find((a) => a.slug.toLowerCase() === cleanSlug);
  return match;
}

export function addArticleStore(article: Article): void {
  liveArticlesStore = [article, ...liveArticlesStore];
}

export function updateArticleStore(id: string, updates: Partial<Article>): boolean {
  const index = liveArticlesStore.findIndex((a) => a.id === id);
  if (index === -1) return false;

  liveArticlesStore[index] = {
    ...liveArticlesStore[index],
    ...updates,
  };
  return true;
}

export function deleteArticleStore(id: string): boolean {
  const initialLen = liveArticlesStore.length;
  liveArticlesStore = liveArticlesStore.filter((a) => a.id !== id);
  return liveArticlesStore.length < initialLen;
}

