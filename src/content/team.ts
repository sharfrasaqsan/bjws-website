export interface TeamMember {
  id: string;
  name: string;
  role: {
    en: string;
    ta: string;
    si: string;
  };
  category: "executive" | "operations" | "funeral" | "welfare" | "cemetery";
  categoryLabel: {
    en: string;
    ta: string;
    si: string;
  };
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  initials: string;
  photo?: string;
  term: string;
  responsibilities: {
    en: string[];
    ta: string[];
    si: string[];
  };
  bio: {
    en: string;
    ta: string;
    si: string;
  };
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "sahibullah",
    name: "A.M. Sahibullah",
    role: {
      en: "President",
      ta: "தலைவர்",
      si: "සභාපති",
    },
    category: "executive",
    categoryLabel: {
      en: "Executive Council",
      ta: "நிர்வாகக் குழு",
      si: "විධායක සභාව",
    },
    phone: "072 440 9574",
    whatsapp: "+94724409574",
    email: "mbjwsociety@gmail.com",
    address: "420/7, Mullipothanai, Sri Lanka",
    initials: "AMS",
    photo: "/images/gallery/shramadana-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Executive oversight and strategic society leadership",
        "Presiding officer of assembly meetings and shura sessions",
        "Government and Divisional Secretariat liaison",
        "Overall custodian of society welfare constitution",
      ],
      ta: [
        "சங்கத்தின் ஒட்டுமொத்த தலைமைத்துவம் மற்றும் வழிகாட்டல்",
        "பொதுக்கூட்டங்கள் மற்றும் ஷூரா ஆலோசனைகளுக்கு தலைமை தாங்குதல்",
        "பிரதேச செயலகம் மற்றும் அரச திணைக்களங்களுடனான தொடர்புகள்",
        "சங்க யாப்பு மற்றும் நலன்புரி திட்டங்களை முன்னெடுத்தல்",
      ],
      si: [
        "සමිතියේ සමස්ත නායකත්වය සහ උපායමාර්ගික මඟපෙන්වීම",
        "මහා සභා සහ ෂූරා සාකච්ඡාවල මුලසුන දැරීම",
        "ප්‍රාදේශීය ලේකම් කාර්යාලය සහ රජයේ ආයතන සමඟ සම්බන්ධීකරණය",
        "සමිතියේ ව්‍යවස්ථාව සහ සුභසාධක කටයුතු ආරක්ෂා කිරීම",
      ],
    },
    bio: {
      en: "Founding leader who spearheaded the formal establishment of BJWS in 2023 to ensure dignified, accessible, and structured funeral support for every household in the Buhary Mahallah.",
      ta: "புகாரி மஹல்லா பகுதியில் உள்ள ஒவ்வொரு குடும்பத்திற்கும் கண்ணியமான ஜனாஸா சேவைகள் கிடைப்பதை உறுதிசெய்யும் நோக்கில் 2023 இல் சங்கத்தை நிறுவிய முன்னோடி தலைவர்.",
      si: "බුහාරි මහල්ලාවේ සෑම පවුලකටම ගෞරවනීය අවමංගල්‍ය සහාය සහතික කිරීම සඳහා 2023 දී සමිතිය ආරම්භ කිරීමට මුල් වූ නායකයා.",
    },
  },
  {
    id: "siyam",
    name: "A.L.M. Siyam",
    role: {
      en: "Secretary",
      ta: "செயலாளர்",
      si: "ලේකම්",
    },
    category: "executive",
    categoryLabel: {
      en: "Executive Council",
      ta: "நிர்வாகக் குழு",
      si: "විධායක සභාව",
    },
    phone: "077 278 2829",
    whatsapp: "+94772782829",
    email: "mbjwsociety@gmail.com",
    address: "85, Eacha Nagar, Mullipothanai, Sri Lanka",
    initials: "ALMS",
    photo: "/images/gallery/ghusl-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Management of official records, resolutions, and minutes",
        "Membership enrollment registry and verification",
        "Death registration and administrative documentation",
        "Official society correspondence and public announcements",
      ],
      ta: [
        "சங்கத்தின் உத்தியோகபூர்வ ஆவணங்கள் மற்றும் கூட்டக்குறிப்புகள் பராமரிப்பு",
        "அங்கத்துவ பதிவுகள் மற்றும் உறுப்பினர் சரிபார்ப்பு",
        "ஜனாஸா பதிவு மற்றும் உத்தியோகபூர்வ கடிதத் தொடர்புகள்",
        "பொது அறிவித்தல்கள் மற்றும் நிர்வாக அறிக்கைகள் வெளியிடுதல்",
      ],
      si: [
        "නිල ලේඛන සහ රැස්වීම් වාර්තා පවත්වාගෙන යාම",
        "සාමාජික ලියාපදිංචි ලේඛනය කළමනාකරණය",
        "මරණ ලියාපදිංචිය සහ නිල ලේඛන කටයුතු",
        "නිල ලිපි හුවමාරුව සහ ප්‍රජා නිවේදන නිකුත් කිරීම",
      ],
    },
    bio: {
      en: "Dedicated administrator overseeing statutory reporting under registration DS/TH/SS/VSSO/2023/01, ensuring complete transparency and seamless communication for our members.",
      ta: "அரசாங்க பதிவு DS/TH/SS/VSSO/2023/01 இன் கீழான சட்டப்பூர்வ ஆவணப்படுத்தலையும் அங்கத்தவர்களுக்கான வெளிப்படையான நிர்வாகத்தையும் முன்னெடுக்கும் நிர்வாகி.",
      si: "ලියාපදිංචි අංක DS/TH/SS/VSSO/2023/01 යටතේ නීතිමය ලියකියවිලි සහ සාමාජිකයින්ගේ විනිවිදභාවය සුරකින කැපවූ ලේකම්වරයා.",
    },
  },
  {
    id: "faisarkhan",
    name: "M.S. Faisarkhan",
    role: {
      en: "Treasurer",
      ta: "பொருளாளர்",
      si: "භාණ්ඩාගාරික",
    },
    category: "executive",
    categoryLabel: {
      en: "Executive Council",
      ta: "நிர்வாகக் குழு",
      si: "විධායක සභාව",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    email: "mbjwsociety@gmail.com",
    address: "93D, Eacha Nagar, Mullipothanai, Sri Lanka",
    initials: "MSF",
    photo: "/images/gallery/iftar-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Custody of society accounts and subscription collections (LKR 50/mo, LKR 500/yr)",
        "Maintaining transparent monthly income and expense ledgers",
        "Coordinating independent community audits and annual financial reports",
        "Supervision of emergency funeral disbursement funds",
      ],
      ta: [
        "சங்க நிதிகள் மற்றும் சந்தா வசூலிப்பு (ரூ. 50/மாதம், ரூ. 500/வருடம்)",
        "மாதாந்த வரவு-செலவு கணக்கு ஏடுகளை வெளிப்படையாகப் பராமரித்தல்",
        "வருடாந்த கணக்காய்வு மற்றும் நிதி அறிக்கைகளை சமர்ப்பித்தல்",
        "அவசர ஜனாஸா செலவினங்களுக்கான நிதி ஒதுக்கீடு",
      ],
      si: [
        "සමිතියේ ගිණුම් සහ සාමාජික දායකත්ව භාරකාරිත්වය (මසකට රු. 50, වසරකට රු. 500)",
        "මාසික ආදායම් සහ වියදම් ලෙජර විනිවිදව පවත්වාගෙන යාම",
        "වාර්ෂික මූල්‍ය විගණන වාර්තා සකස් කිරීම",
        "හදිසි අවමංගල්‍ය ආධාර මුදල් නිකුත් කිරීම",
      ],
    },
    bio: {
      en: "Financial steward ensuring every rupee entrusted by the community is rigorously audited, accounted for, and deployed strictly for benevolent welfare objectives.",
      ta: "பொதுமக்கள் வழங்கும் ஒவ்வொரு ரூபாயும் நேர்மையாகவும் முறையாகவும் கணக்கிடப்பட்டு மக்கள் நலனுக்காக மட்டுமே பயன்படுத்தப்படுவதை உறுதிசெய்யும் பொறுப்பாளர்.",
      si: "ප්‍රජාව විසින් භාර දෙන සෑම රුපියලක්ම නිසි ලෙස විගණනය කර පුණ්‍ය කටයුතු සඳහා පමණක් යොදවන බව සහතික කරන මූල්‍ය භාරකරු.",
    },
  },
  {
    id: "abuhuraira",
    name: "A. Abuhuraira",
    role: {
      en: "Operations Coordinator",
      ta: "ஒருங்கிணைப்பாளர்",
      si: "මෙහෙයුම් සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Operations & Logistics",
      ta: "செயற்பாடுகள் & ஒருங்கிணைப்பு",
      si: "මෙහෙයුම් සහ සම්බන්ධීකරණ",
    },
    phone: "077 622 7323",
    whatsapp: "+94776227323",
    email: "mbjwsociety@gmail.com",
    address: "353/7, Mullipothanai, Sri Lanka",
    initials: "AA",
    photo: "/images/team/Abuhuraira.jpeg",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "24/7 on-call coordinator for immediate funeral dispatches",
        "Logistical coordination with Imams, gravediggers, and transport",
        "Mobilizing field volunteer crews during emergencies",
        "Equipment maintenance (stretcher, burial tools, and shade canopies)",
      ],
      ta: [
        "24/7 அவசர ஜனாஸா அழைப்புகளுக்கான உடனடி கள ஒருங்கிணைப்பு",
        "இமாம்கள், மையவாடி பணியாளர்கள் மற்றும் வாகனங்களுடனான இணைப்பு",
        "அவசர வேளைகளில் தன்னார்வலர்களை ஒருங்கிணைத்தல்",
        "ஜனாஸா உபகரணங்கள் மற்றும் கூடாரங்களை தயார் நிலையில் வைத்திருத்தல்",
      ],
      si: [
        "පැය 24 පුරා හදිසි අවමංගල්‍ය ඇමතුම් සඳහා ක්ෂණික සම්බන්ධීකරණය",
        "ඉමාම්වරුන්, සුසාන භූමි සේවකයින් සහ ප්‍රවාහන සේවා සම්බන්ධීකරණය",
        "හදිසි අවස්ථාවලදී ස්වේච්ඡා කණ්ඩායම් මෙහෙයවීම",
        "අවමංගල්‍ය උපකරණ සහ ආවරණ කූඩාරම් නඩත්තුව",
      ],
    },
    bio: {
      en: "First-contact emergency coordinator available round-the-clock to support families through every step of funeral logistics with utmost dignity.",
      ta: "குடும்பங்களுக்கு துயர வேளையில் உடனடி ஆறுதலையும் முழுமையான கள ஆதரவையும் வழங்கும் 24 மணி நேர கள ஒருங்கிணைப்பாளர்.",
      si: "වියෝවට පත් පවුල් සඳහා සෑම පියවරකදීම සහාය වන පැය 24 පුරා ක්‍රියාත්මක ක්ෂණික සම්බන්ධීකාරක.",
    },
  },
  {
    id: "nashraff",
    name: "M.N.M. Nashraff",
    role: {
      en: "English Inquiries & Communications Officer",
      ta: "ஆங்கில மொழித் தொடர்பாளர் & ஊடகப் பொறுப்பாளர்",
      si: "ඉංග්‍රීසි භාෂා සන්නිවේදන නිලධාරී",
    },
    category: "executive",
    categoryLabel: {
      en: "Executive Council",
      ta: "நிர்வாகக் குழு",
      si: "විධායක සභාව",
    },
    phone: "077 227 1248",
    whatsapp: "+94772271248",
    email: "mbjwsociety@gmail.com",
    address: "Kandy Road, Mullipothanai, Sri Lanka",
    initials: "MNMN",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "English correspondence & inquiries",
        "Overseas diaspora & donor liaison",
        "Official reports & briefings",
        "Educational & community pathways",
      ],
      ta: [
        "ஆங்கிலத் தொடர்புகள் & கடிதங்கள்",
        "புலம்பெயர் உறவுகள் & நன்கொடையாளர் தொடர்பு",
        "அறிக்கைகள் & ஊடகப் பிரசுரங்கள்",
        "கல்வி & நலன்புரி ஒருங்கிணைப்பு",
      ],
      si: [
        "ඉංග්‍රීසි සන්නිවේදනය සහ විමසීම්",
        "විදේශගත දායකයින් සමඟ සම්බන්ධතා",
        "නිල වාර්තා සහ මාධ්‍ය නිවේදන",
        "අධ්‍යාපනික සහ සුභසාධක කටයුතු",
      ],
    },
    bio: {
      en: "Dedicated liaison managing English correspondence and relations with diaspora partners.",
      ta: "சங்கத்தின் ஆங்கில மொழித் தொடர்புகள் மற்றும் புலம்பெயர் உறவுகளை ஒருங்கிணைப்பவர்.",
      si: "ඉංග්‍රීසි සන්නිවේදනය සහ විදේශ සබඳතා වගකීමෙන් මෙහෙයවන නිලධාරී.",
    },
  },
  {
    id: "farook",
    name: "M.S. Riyas",
    role: {
      en: "Funeral Welfare Lead",
      ta: "ஜனாஸா சேவை தலைமைப் பொறுப்பாளர்",
      si: "අවමංගල්‍ය සේවා ප්‍රධානී",
    },
    category: "funeral",
    categoryLabel: {
      en: "Funeral Welfare Team",
      ta: "ஜனாஸா சேவைப் பிரிவு",
      si: "අවමංගල්‍ය සේවා අංශය",
    },
    phone: "072 440 9574",
    whatsapp: "+94724409574",
    address: "Kandy Road, Mullipothanai, Sri Lanka",
    initials: "MIF",
    photo: "/images/gallery/ghusl-02.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Direct supervision of ritual washing (Ghusl) and shrouding (Kafan)",
        "Ensuring strict compliance with Islamic Sunnah practices",
        "Training youth volunteers in proper funeral rites",
        "Coordination of family bereavement support",
      ],
      ta: [
        "குளிப்பாட்டல் (Ghusl) மற்றும் கபனிடல் (Kafan) பணிகளை மேற்பார்வையிடல்",
        "சுன்னாஹ் முறைப்படியான அடக்க ஒழுங்குகளைப் பேணல்",
        "இளைஞர்களுக்கான ஜனாஸா வழிகாட்டல் பயிற்சிப் பட்டறைகள் நடத்துதல்",
        "துயருற்ற குடும்பத்தினருக்கு ஆதரவளித்தல்",
      ],
      si: [
        "නාන සහ කෆන් කටයුතු සෘජුව අධීක්ෂණය කිරීම",
        "ඉස්ලාමීය සුන්නාහ් ක්‍රමවේදයන් නිසි පරිදි ක්‍රියාත්මක කිරීම",
        "තරුණ ස්වේච්ඡා සේවකයින්ට අවමංගල්‍ය පුහුණුව ලබා දීම",
        "ශෝකයට පත් පවුල්වලට මානසික සහාය ලබා දීම",
      ],
    },
    bio: {
      en: "Experienced mentor guiding funeral rites according to pure Islamic traditions, having supervised more than 28 dignified janazas across the community.",
      ta: "28 க்கும் மேற்பட்ட ஜனாஸாக்களை சுன்னாஹ்வின் வழியில் கண்ணியமாக வழிநடத்திய அனுபவமிக்க சேவைப் பொறுப்பாளர்.",
      si: "ප්‍රජාව තුළ ජනාසා 28 කට අධික සංඛ්‍යාවක් ඉස්ලාමීය පිළිවෙත්වලට අනුව ගෞරවනීයව මෙහෙයවූ පළපුරුදු නායකයා.",
    },
  },
  {
    id: "niyas",
    name: "A.G.M. Niyas",
    role: {
      en: "Cemetery Grounds Warden",
      ta: "மையவாடி பராமரிப்பு பொறுப்பாளர்",
      si: "සුසාන භූමි පාලක",
    },
    category: "cemetery",
    categoryLabel: {
      en: "Cemetery Grounds Care",
      ta: "மையவாடி பராமரிப்புப் பிரிவு",
      si: "සුසාන භූමි නඩත්තු අංශය",
    },
    phone: "077 529 0417",
    whatsapp: "+94775290417",
    address: "Cemetery Road, Mullipothanai, Sri Lanka",
    initials: "KMN",
    photo: "/images/team/Niyas.jpeg",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Upkeep of the 1.5-acre Mahallah cemetery grounds",
        "Supervision of regular clearing and shramadhana campaigns",
        "Management of concrete boundary works and water facilities",
        "Maintaining orderly burial plots and demarcation markers",
      ],
      ta: [
        "1.5 ஏக்கர் பரப்பளவிலான மையவாடி நிலத்தை தூய்மையாகப் பராமரித்தல்",
        "வருடாந்த சிரமதானப் பணிகளை திட்டமிட்டு முன்னெடுத்தல்",
        "கொங்கிரீட் பாதைகள் மற்றும் நீர் விநியோக வசதிகளை மேற்பார்வையிடல்",
        "மையவாடி அடையாளக் குறியீடுகளை ஒழுங்குபடுத்தல்",
      ],
      si: [
        "අක්කර 1.5 ක සුසාන භූමි පරිශ්‍රය නඩත්තු කිරීම",
        "වාර්ෂික ශ්‍රමදාන කටයුතු සැලසුම් කිරීම සහ මෙහෙයවීම",
        "ජල පහසුකම් සහ කොන්ක්‍රීට් මාර්ග නඩත්තු කිරීම",
        "සුසාන භූමියේ පිළිවෙළ සහ සලකුණු පවත්වාගෙන යාම",
      ],
    },
    bio: {
      en: "Oversees ground maintenance ensuring the cemetery remains a peaceful, dignified, and clean sanctuary for visitation and reflection.",
      ta: "மையவாடி வளாகம் அமைதியான, கண்ணியமான மற்றும் தூய்மையான இடமாக திகழ்வதை உறுதிசெய்யும் களப் பொறுப்பாளர்.",
      si: "සුසාන භූමිය පිරිසිදු, ගෞරවනීය සහ සාමකාමී ස්ථානයක් ලෙස පවත්වාගෙන යාම සහතික කරන භූමි පාලක.",
    },
  },
  {
    id: "rizan",
    name: "S.M. Jaisar",
    role: {
      en: "Welfare & Relief Officer",
      ta: "நலன்புரி மற்றும் நிவாரண அதிகாரி",
      si: "සුභසාධන සහ සහන නිලධාරී",
    },
    category: "welfare",
    categoryLabel: {
      en: "Social Welfare & Aid",
      ta: "சமூக நலன்புரிப் பிரிவு",
      si: "සමාජ සුභසාධන අංශය",
    },
    phone: "077 278 2829",
    whatsapp: "+94772782829",
    address: "Eacha Nagar, Mullipothanai, Sri Lanka",
    initials: "SMR",
    photo: "/images/gallery/iftar-02.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Monthly dry ration pack packaging and doorstep delivery",
        "Needs assessment of vulnerable widows, orphans, and daily wage earners",
        "Annual Ramadan food pack and Iftar distribution coordination",
        "Emergency assistance for economically disadvantaged families",
      ],
      ta: [
        "மாதாந்த உலர் உணவுப் பொதிகளை தயார் செய்து விநியோகித்தல்",
        "நலிவுற்ற குடும்பங்கள், விதவைகள் மற்றும் அநாதைகளின் தேவைகளை இனங்காணல்",
        "ரமழான் நிவாரணப் பொதிகள் மற்றும் இப்தார் ஒழுங்குகள்",
        "பொருளாதார நெருக்கடியில் உள்ள குடும்பங்களுக்கு அவசர நிதி உதவி",
      ],
      si: [
        "මාසික වියළි සලාක පාර්සල් සකස් කර බෙදා හැරීම",
        "වැන්දඹුවන්, අනාථයින් සහ දිළිඳු පවුල් හඳුනා ගැනීම",
        "වාර්ෂික රාමසාන් ආහාර සහ ඉෆ්තාර් බෙදාහැරීම් සංවිධානය කිරීම",
        "ආර්ථික අපහසුතා ඇති පවුල් සඳහා හදිසි ආධාර ලබා දීම",
      ],
    },
    bio: {
      en: "Coordinates our food distribution network, which has successfully delivered over 750 dry ration packages to vulnerable homes across Mullipothanai.",
      ta: "750 க்கும் மேற்பட்ட உலர் உணவுப் பொதிகளை தகுதியான குடும்பங்களுக்கு நேரடியாக விநியோகித்த நலன்புரி ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான ප්‍රදේශයේ පවුල් 750 කට අධික සංඛ්‍යාවකට වියළි සලාක බෙදා දුන් සුභසාධන සම්බන්ධීකාරක.",
    },
  },
  {
    id: "irfan",
    name: "M.M.M. Irfan",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  },
  {
    id: "saheed",
    name: "P.T.M. Saheed",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  },
  {
    id: "hanees",
    name: "M.H. Hanees",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  },
  {
    id: "gafoor",
    name: "A.M.A. Gafoor",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  },
  {
    id: "mansoorali",
    name: "M. Mansoor Ali",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  },
  {
    id: "rikas",
    name: "M.I. Rikas Ahamaed",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  },
  {
    id: "jawfar",
    name: "A.H. Jawfar",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  },
    {
    id: "naleem",
    name: "A. Naleem",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  },
    {
    id: "aqsan",
    name: "A.M. Sharfras Aqsan",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  }, 
  {
    id: "yaseer",
    name: "T.F.M. Yaseer",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  },
   {
    id: "ramees",
    name: "A. Ramees",
    role: {
      en: "Youth Volunteer Coordinator",
      ta: "இளைஞர் தொண்டர் ஒருங்கிணைப்பாளர்",
      si: "තරුණ ස්වේච්ඡා සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Volunteer Corps",
      ta: "தொண்டர் அணி",
      si: "ස්වේච්ඡා බලකාය",
    },
    phone: "075 651 0050",
    whatsapp: "+94756510050",
    address: "95th Mile Post, Mullipothanai, Sri Lanka",
    initials: "TMI",
    photo: "/images/gallery/livelihood-01.webp",
    term: "2023 - Present",
    responsibilities: {
      en: [
        "Mobilizing youth volunteers for cemetery shramadhana and grave preparation",
        "Managing crowd control and parking during large funeral processions",
        "Organizing youth development and civic responsibility seminars",
        "Logistical setup for community workshops and Iftar gatherings",
      ],
      ta: [
        "மையவாடி சிரமதானப் பணிகளுக்கு இளைஞர்களை அணிதிரட்டல்",
        "பெரிய ஜனாஸா ஊர்வலங்களின் போது ஒழுங்குபடுத்தல் பணிகளை மேற்கொள்ளல்",
        "இளைஞர்களுக்கான சமூக விழிப்புணர்வு கருத்தரங்குகளை ஒழுங்குசெய்தல்",
        "சமூக நிகழ்வுகளுக்கான கள ஏற்பாடுகளைச் செய்தல்",
      ],
      si: [
        "සුසාන භූමි ශ්‍රමදාන කටයුතු සඳහා තරුණ පිරිස් මෙහෙයවීම",
        "මහජන අවමංගල්‍ය උත්සවවලදී රථවාහන සහ පිළිවෙළ පවත්වා ගැනීම",
        "තරුණ ප්‍රජා සත්කාරක වැඩමුළු සංවිධානය කිරීම",
        "ප්‍රජා වැඩසටහන් සහ ඉෆ්තාර් කටයුතු සඳහා භූමි සැකසීම",
      ],
    },
    bio: {
      en: "Passionate community organizer galvanizing the next generation of Mullipothanai youth into active, compassionate civic service.",
      ta: "முள்ளிப்பொத்தானை இளைஞர்களை சமூக சேவைக்கும் மக்கள் நலனுக்கும் ஊக்குவிக்கும் துடிப்பான தொண்டர் ஒருங்கிணைப்பாளர்.",
      si: "මුල්ලිපොத்தான තරුණ පරපුර සමාජ සේවය සඳහා දිරිමත් කරන ක්‍රියාකාරී තරුණ සම්බන්ධීකාරක.",
    },
  },
];

