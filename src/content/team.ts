export type TeamCategory =
  "executive" | "operations" | "funeral" | "welfare" | "cemetery" | "volunteer";

export const TEAM_CATEGORY_LABELS: Record<
  TeamCategory,
  { en: string; ta: string; si: string }
> = {
  executive: {
    en: "Executive Council",
    ta: "நிர்வாகக் குழு",
    si: "විධායක සභාව",
  },
  operations: {
    en: "Operations & Committee",
    ta: "செயற்குழு",
    si: "මෙහෙයුම් කමිටුව",
  },
  funeral: {
    en: "Funeral Services",
    ta: "ஜனாஸா சேவைகள்",
    si: "අවමංගල්‍ය සේවා",
  },
  welfare: {
    en: "Community Welfare",
    ta: "பொது நலன்புரி",
    si: "ප්‍රජා සුභසාධන",
  },
  cemetery: {
    en: "Cemetery Care",
    ta: "மையவாடி பராமரிப்பு",
    si: "සුසාන භූමි නඩත්තුව",
  },
  volunteer: {
    en: "Youth Volunteers",
    ta: "இளைஞர் தொண்டர்கள்",
    si: "තරුණ ස්වේච්ඡා සේවකයන්",
  },
};

export interface TeamMember {
  id: string;
  name: string;
  role: {
    en: string;
    ta: string;
    si: string;
  };
  category: TeamCategory;
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
  isInactive?: boolean;
  memberId?: string; // Format: BJWS000 or BJWS-VOL-000
  nic?: string; // National Identity Card number
  verificationToken?: string; // Secure token for QR verification
  verificationStatus?: "verified" | "suspended" | "pending";
  issueDate?: string;
  expiryDate?: string;
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
    email: "sahibullahmohamed0@gmail.com",
    address: "No. 420, Unit 07, Mullipothana",
    initials: "AMS",
    photo: "/images/team/sahibulla_new.webp",
    term: "2023 - Present",
  },
  {
    id: "gafoor",
    name: "A.M.A. Gafoor",
    role: {
      en: "Vice President",
      ta: "உப தலைவர்",
      si: "උප සභාපති",
    },
    category: "executive",
    categoryLabel: {
      en: "Executive Council",
      ta: "நிர்வாகக் குழு",
      si: "විධායක සභාව",
    },
    phone: "075 343 2627",
    whatsapp: "+94753432627",
    email: "gafoorgafoor871@gmail.com",
    address: "No. 101, Eacha Nagar, Mullipothana",
    initials: "AMAG",
    photo: "/images/team/gafoor.webp",
    term: "2023 - Present",
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
    email: "mohamedshiyam2233@gmail.com",
    address: "No. 85, Eacha Nagar, Mullipothana",
    initials: "ALMS",
    photo: "/images/team/siyam.webp",
    term: "2023 - Present",
  },
  {
    id: "riyas",
    name: "M.S. Riyas",
    role: {
      en: "Vice Secretary",
      ta: "உப செயலாளர்",
      si: "උප ලේකම්",
    },
    category: "executive",
    categoryLabel: {
      en: "Executive Council",
      ta: "நிர்வாகக் குழு",
      si: "විධායක සභාව",
    },
    phone: "077 988 2766",
    whatsapp: "+94779882766",
    email: "Sayirms@gmail.com",
    address: "No. 53/7, Eachcha Nagar, Mullipothana",
    initials: "MSR",
    photo: "/images/team/riyas.webp",
    term: "2023 - Present",
  },
  {
    id: "faizarkhan",
    name: "M.S. Faizarkhan",
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
    email: "faisarkhan95@gmail.com",
    address: "No. 335, Unit 07, Mullipothana",
    initials: "MSF",
    photo: "/images/team/faisarkhan.webp",
    term: "2023 - Present",
  },
  {
    id: "abuhuraira",
    name: "A. Abuhuraira",
    role: {
      en: "Operations Coordinator",
      ta: "கள ஒருங்கிணைப்பாளர்",
      si: "මෙහෙයුම් සම්බන්ධීකාරක",
    },
    category: "operations",
    categoryLabel: {
      en: "Field Operations",
      ta: "கள நடவடிக்கைகள்",
      si: "ක්ෂේත්‍ර මෙහෙයුම්",
    },
    phone: "077 622 7323",
    whatsapp: "+94776227323",
    email: "Sawth059@gmail.com",
    address: "No. 415/R1, Unit 07, Mullipothana",
    initials: "AA",
    photo: "/images/team/abuhuraira_new.webp",
    term: "2023 - Present",
  },
  {
    id: "nashraff",
    name: "N.M. Shamed Nashraff",
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
    email: "nashraff1977@gmail.com",
    address: "No. 323, Unit 07, Mullipothana",
    initials: "NMSN",
    photo: "/images/team/nashraf.webp",
    term: "2023 - Present",
  },
  {
    id: "niyas",
    name: "A.G.M. Niyas",
    role: {
      en: "Internal Auditor",
      ta: "உள்ளகக் கணக்காய்வாளர்",
      si: "අභ්‍යන්තර විගණක",
    },
    category: "executive",
    categoryLabel: {
      en: "Executive Council",
      ta: "நிர்வாகக் குழு",
      si: "විධායක සභාව",
    },
    phone: "077 529 0417",
    whatsapp: "+94775290417",
    email: "agm.niyas6710@gmail.com",
    address: "No. 356, Unit 07, Mullipothana",
    initials: "AGMN",
    photo: "/images/team/niyas_new.webp",
    term: "2023 - Present",
  },
  {
    id: "mansoorali",
    name: "M. Mansoor Ali",
    role: {
      en: "Executive Committee Member",
      ta: "நிர்வாகக் குழு உறுப்பினர்",
      si: "විධායක කමිටු සාමාජික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "077 707 3037",
    whatsapp: "+94777073037",
    email: "mmmmansoor@gmail.com",
    address: "No. 356, Unit 07, Mullipothana",
    initials: "MMA",
    photo: "/images/team/mansoor.webp",
    term: "2023 - Present",
  },
  {
    id: "rikas",
    name: "M.I. Rikas Ahamed",
    role: {
      en: "Executive Committee Member",
      ta: "நிர்வாகக் குழு உறுப்பினர்",
      si: "විධායක කමිටු සාමාජික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "076 715 2016",
    whatsapp: "+94767152016",
    email: "rikasrikas123@gmail.com",
    address: "No. 313, Unit 07, Mullipothana",
    initials: "MIRA",
    photo: "/images/team/rikas.webp",
    term: "2023 - Present",
  },
  {
    id: "jaisar",
    name: "S.M. Jaisar",
    role: {
      en: "Executive Committee Member",
      ta: "நிர்வாகக் குழு உறுப்பினர்",
      si: "විධායක කමිටු සාමාජික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "076 713 9496",
    whatsapp: "+94767139496",
    address: "No. 307, Unit 07, Mullipothana",
    initials: "SMJ",
    photo: "/images/team/jaisar.webp",
    term: "2023 - Present",
  },
  {
    id: "irfan",
    name: "M.M.M. Irfan",
    role: {
      en: "Executive Committee Member",
      ta: "நிர்வாகக் குழு உறுப்பினர்",
      si: "විධායක කමිටු සාමාජික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "076 340 5758",
    whatsapp: "+94763405758",
    email: "irfanmmm2020@gmail.com",
    address: "No. 133D, Echcha Nagar, Mullipothana",
    initials: "MMMI",
    photo: "/images/team/irfan_new.webp",
    term: "2023 - Present",
  },
  {
    id: "saheeth",
    name: "P.T.M. Saheeth",
    role: {
      en: "Executive Committee Member",
      ta: "நிர்வாகக் குழு உறுப்பினர்",
      si: "විධායක කමිටු සාමාජික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "075 263 0333",
    whatsapp: "+94752630333",
    email: "ptsaheeth@gmail.com",
    address: "No. 125.A1, Echcha Nagar, Mullipothana",
    initials: "PTMS",
    photo: "/images/team/saheed.webp",
    term: "2023 - Present",
  },
  {
    id: "hanees",
    name: "M.H. Hanees",
    role: {
      en: "Executive Committee Member",
      ta: "நிர்வாகக் குழு உறுப்பினர்",
      si: "විධායක කමිටු සාමාජික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "077 552 5935",
    whatsapp: "+94775525935",
    email: "mhhaneesmhhanees@gmail.com",
    address: "No. 363, Unit 07, Mullipothana",
    initials: "MHH",
    photo: "/images/team/hanees.webp",
    term: "2023 - Present",
  },
  {
    id: "nawsath",
    name: "A.M. Nawsath",
    role: {
      en: "Executive Committee Member",
      ta: "நிர்வாகக் குழு உறுப்பினர்",
      si: "විධායක කමිටු සාමාජික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "075 202 6133",
    whatsapp: "+94752026133",
    email: "Nawsath1986@gmail.com",
    address: "No. 68/1, Echcha Nagar, Mullippothana",
    initials: "AMN",
    photo: "/images/team/nawshad.webp",
    term: "2023 - Present",
  },
  {
    id: "jawffar",
    name: "A.H. Jawffar",
    role: {
      en: "Executive Committee Member",
      ta: "நிர்வாகக் குழு உறுப்பினர்",
      si: "විධායක කමිටු සාමාජික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "075 425 3586",
    whatsapp: "+94754253586",
    email: "jawffar1966@gmail.com",
    address: "No. 18/1, Eachcha Nagar, Mullipothana",
    initials: "AHJ",
    photo: "/images/team/jawffar.webp",
    term: "2023 - Present",
  },
  {
    id: "naleem",
    name: "A. Naleem",
    role: {
      en: "Executive Committee Member",
      ta: "நிர்வாகக் குழு உறுப்பினர்",
      si: "විධායක කමිටු සාමාජික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "075 916 2799",
    whatsapp: "+94759162799",
    email: "naleemmavlaviy@gmail.com",
    address: "No. 339, Unit 07, Mullipothana",
    initials: "AN",
    photo: "/images/team/naleem.webp",
    term: "2023 - Present",
  },
  {
    id: "aqsan",
    name: "A.M. Sharfras Aqsan",
    role: {
      en: "Digital & Media",
      ta: "டிஜிட்டல் & ஊடகம்",
      si: "ඩිජිටල් සහ මාධ්‍ය",
    },
    category: "operations",
    categoryLabel: {
      en: "Digital & Media",
      ta: "டிஜிட்டல் & ஊடகம்",
      si: "ඩිජිටල් සහ මාධ්‍ය",
    },
    phone: "075 123 0001",
    whatsapp: "+94751230001",
    email: "sharfrasaqsan@gmail.com",
    address: "No. 363, Unit 07, Mullipothana",
    initials: "AMSA",
    photo: "/images/team/sharfras.webp",
    term: "2023 - Present",
  },
  {
    id: "yaseer",
    name: "T.F.M. Yaseer",
    role: {
      en: "Former Treasurer",
      ta: "முன்னாள் பொருளாளர்",
      si: "හිටපු භාණ්ඩාගාරික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "077 082 6535",
    whatsapp: "+94770826535",
    email: "Tfmyaseer013@gmail.com",
    address: "No. 93/D, Echcha Nagar, Mullipothana",
    initials: "TFMY",
    photo: "/images/team/yaseer.webp",
    term: "2023 - 2024",
    isInactive: true,
  },
  {
    id: "ramees",
    name: "A. Ramees",
    role: {
      en: "Former Committee Member",
      ta: "முன்னாள் செயற்குழு உறுப்பினர்",
      si: "හිටපු කමිටු සාමාජික",
    },
    category: "operations",
    categoryLabel: {
      en: "Executive Committee",
      ta: "நிர்வாகக் குழு",
      si: "විධායක කමිටුව",
    },
    phone: "077 837 4420",
    whatsapp: "+94778374420",
    email: "rameesrayyan419@gmail.com",
    address: "No. 419, Unit 07, Mullipothana",
    initials: "AR",
    photo: "/images/team/ramees.webp",
    term: "2023 - 2024",
    isInactive: true,
  },
  {
    id: "volunteer-anfas",
    name: "M.I. Mohamed Anfas",
    role: {
      en: "Youth Volunteer Team Leader",
      ta: "இளைஞர் தொண்டர் அணித் தலைவர்",
      si: "තරුණ ස්වේච්ඡා කණ්ඩායම් නායක",
    },
    category: "volunteer",
    categoryLabel: {
      en: "Youth Volunteers",
      ta: "இளைஞர் தொண்டர்கள்",
      si: "තරුණ ස්වේච්ඡා සේවකයන්",
    },
    phone: "077 891 2345",
    whatsapp: "+94778912345",
    email: "anfas.volunteers@gmail.com",
    address: "Main Street, Mullipothana",
    initials: "MIA",
    term: "2024 - Present",
    memberId: "BJWS-VOL-001",
    nic: "199824501234",
    verificationToken: "vtok_volunteer_anfas_001",
    verificationStatus: "verified",
    issueDate: "2026-01-01",
  },
];

// Global store persistence for Next.js hot-reload in development
declare global {
  var __liveTeamStore: TeamMember[] | undefined;
}

export interface OfficialMemberRegistryItem {
  key: string;
  name: string;
  nameKeywords: string[];
  memberId: string;
  token: string;
  nic: string;
}

export const KNOWN_OFFICIAL_MEMBERS: OfficialMemberRegistryItem[] = [
  {
    key: "abuhuraira",
    name: "A. Abuhuraira",
    nameKeywords: ["abuhuraira", "abuhurairah", "abu huraira"],
    memberId: "BJWS001",
    token: "vtok_abuhuraira_bjws001",
    nic: "197821405921",
  },
  {
    key: "riyas",
    name: "M.S. Riyas",
    nameKeywords: ["riyas", "m.s. riyas"],
    memberId: "BJWS002",
    token: "vtok_riyas_bjws002",
    nic: "198319204812",
  },
  {
    key: "yaseer",
    name: "T.F.M. Yaseer",
    nameKeywords: ["yaseer", "yasir", "t.f.m. yaseer"],
    memberId: "BJWS003",
    token: "vtok_yaseer_bjws003",
    nic: "198730104928",
  },
  {
    key: "sahibullah",
    name: "A.M. Sahibullah",
    nameKeywords: ["sahibullah", "sahibulla", "a.m. sahibullah"],
    memberId: "BJWS004",
    token: "vtok_sahibullah_bjws004",
    nic: "197514302918",
  },
  {
    key: "siyam",
    name: "A.L.M. Siyam",
    nameKeywords: ["siyam", "shiyam", "a.l.m. siyam", "a.l.m.siyam"],
    memberId: "BJWS005",
    token: "vtok_siyam_bjws005",
    nic: "198622104981",
  },
  {
    key: "jaisar",
    name: "S.M. Jaisar",
    nameKeywords: ["jaisar", "jaizar", "s.m. jaisar"],
    memberId: "BJWS006",
    token: "vtok_jaisar_bjws006",
    nic: "198418204910",
  },
  {
    key: "niyas",
    name: "A.G.M. Niyas",
    nameKeywords: ["niyas", "niyaz", "a.g.m. niyas"],
    memberId: "BJWS007",
    token: "vtok_niyas_bjws007",
    nic: "198011402941",
  },
  {
    key: "nashraff",
    name: "N.M. Shamed Nashraff",
    nameKeywords: ["nashraff", "nashraf", "shamed nashraff"],
    memberId: "BJWS008",
    token: "vtok_nashraff_bjws008",
    nic: "197728401928",
  },
  {
    key: "mansoorali",
    name: "M. Mansoor Ali",
    nameKeywords: ["mansoor", "mansoor ali", "m. mansoor ali"],
    memberId: "BJWS009",
    token: "vtok_mansoorali_bjws009",
    nic: "197920104911",
  },
  {
    key: "rikas",
    name: "M.I. Rikas Ahamed",
    nameKeywords: ["rikas", "rikas ahamed", "m.i. rikas ahamed"],
    memberId: "BJWS010",
    token: "vtok_rikas_bjws010",
    nic: "198821904120",
  },
  {
    key: "nawsath",
    name: "A.M. Nawsath",
    nameKeywords: ["nawsath", "nawshad", "a.m. nawsath"],
    memberId: "BJWS011",
    token: "vtok_nawsath_bjws011",
    nic: "198619402914",
  },
  {
    key: "ramees",
    name: "A. Ramees",
    nameKeywords: ["ramees", "ramis", "a. ramees"],
    memberId: "BJWS012",
    token: "vtok_ramees_bjws012",
    nic: "198920104952",
  },
  {
    key: "gafoor",
    name: "A.M.A. Gafoor",
    nameKeywords: ["gafoor", "gafur", "ama. gafoor", "a.m.a. gafoor"],
    memberId: "BJWS013",
    token: "vtok_gafoor_bjws013",
    nic: "197210402915",
  },
  {
    key: "faizarkhan",
    name: "M.S. Faizarkhan",
    nameKeywords: ["faizar", "faizarkhan", "faisarkhan", "ms. faizarkhan"],
    memberId: "BJWS014",
    token: "vtok_faizarkhan_bjws014",
    nic: "199518204918",
  },
  {
    key: "irfan",
    name: "M.M.M. Irfan",
    nameKeywords: ["irfan", "m.m.m. irfan"],
    memberId: "BJWS015",
    token: "vtok_irfan_bjws015",
    nic: "198519203819",
  },
  {
    key: "saheeth",
    name: "P.T.M. Saheeth",
    nameKeywords: ["saheeth", "saheed", "ptm. saheeth", "p.t.m. saheeth"],
    memberId: "BJWS016",
    token: "vtok_saheeth_bjws016",
    nic: "198120401928",
  },
  {
    key: "hanees",
    name: "M.H. Hanees",
    nameKeywords: ["hanees", "hanis", "m.h. hanees", "m h hanees"],
    memberId: "BJWS017",
    token: "vtok_hanees_bjws017",
    nic: "198319204918",
  },
  {
    key: "jawffar",
    name: "A.H. Jawffar",
    nameKeywords: [
      "jawffar",
      "jauffar",
      "jaffar",
      "a.h. jawffar",
      "a . h. jawffar",
    ],
    memberId: "BJWS018",
    token: "vtok_jawffar_bjws018",
    nic: "196614203912",
  },
  {
    key: "naleem",
    name: "A. Naleem",
    nameKeywords: ["naleem", "nalim", "a. naleem"],
    memberId: "BJWS019",
    token: "vtok_naleem_bjws019",
    nic: "197619204811",
  },
  {
    key: "aqsan",
    name: "A.M. Sharfras Aqsan",
    nameKeywords: [
      "aqsan",
      "sharfras",
      "sharfras aqsan",
      "a.m. sharfras aqsan",
    ],
    memberId: "BJWS020",
    token: "vtok_aqsan_bjws020",
    nic: "199720401928",
  },
  {
    key: "volunteer-anfas",
    name: "M.I. Mohamed Anfas",
    nameKeywords: ["anfas", "mohamed anfas", "m.i. mohamed anfas"],
    memberId: "BJWS-VOL-001",
    token: "vtok_volunteer_anfas_001",
    nic: "199824501234",
  },
];

export function findKnownMember(query: {
  id?: string;
  name?: string;
  memberId?: string;
}): OfficialMemberRegistryItem | undefined {
  const normId = query.id?.trim().toLowerCase() || "";
  const normMemberId = query.memberId?.trim().toUpperCase() || "";
  const normName =
    query.name
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "";

  return KNOWN_OFFICIAL_MEMBERS.find((km) => {
    // 1. Direct match on official ID (e.g. "BJWS004")
    if (normMemberId && km.memberId.toUpperCase() === normMemberId) return true;
    if (normId && km.memberId.toLowerCase() === normId) return true;

    // 2. Direct match on key slug (e.g. "sahibullah")
    if (normId && km.key.toLowerCase() === normId) return true;

    // 3. Name keyword matching (tolerant of spacing, dots, punctuation)
    if (normName) {
      return km.nameKeywords.some((kw) => {
        const cleanKw = kw.toLowerCase().replace(/[^a-z0-9]/g, "");
        return normName.includes(cleanKw) || cleanKw.includes(normName);
      });
    }

    return false;
  });
}

export const ASSIGNED_MEMBER_IDS: Record<string, string> = Object.fromEntries(
  KNOWN_OFFICIAL_MEMBERS.map((m) => [m.key, m.memberId])
);

export const ASSIGNED_VERIFICATION_TOKENS: Record<string, string> =
  Object.fromEntries(KNOWN_OFFICIAL_MEMBERS.map((m) => [m.key, m.token]));

export const ASSIGNED_NIC_NUMBERS: Record<string, string> = Object.fromEntries(
  KNOWN_OFFICIAL_MEMBERS.map((m) => [m.key, m.nic])
);

export function calculateExpiryDate(
  issueDateStr: string = "2026-01-01",
  years = 3
): string {
  try {
    const parts = issueDateStr.trim().split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      if (!isNaN(year)) {
        return `${year + years}-${parts[1]}-${parts[2]}`;
      }
    }
  } catch {}
  return "2029-01-01";
}

export function resolveMemberPhoto(photo?: string): string | undefined {
  if (!photo) return undefined;
  let p = photo.trim();
  p = p.replace(/\/sahibulla\.webp$/i, "/sahibulla_new.webp");
  p = p.replace(/\/abuhuraira\.webp$/i, "/abuhuraira_new.webp");
  p = p.replace(/\/irfan\.webp$/i, "/irfan_new.webp");
  p = p.replace(/\/jaisar1\.webp$/i, "/jaisar.webp");
  p = p.replace(/\/niyas\.webp$/i, "/niyas_new.webp");
  return p;
}

export function initializeTeamMemberDefaults(
  member: TeamMember,
  index: number
): TeamMember {
  const known = findKnownMember({
    id: member.id,
    name: member.name,
    memberId: member.memberId,
  });

  const memberId =
    member.memberId ||
    known?.memberId ||
    `BJWS${(index + 1).toString().padStart(3, "0")}`;

  const verificationToken =
    member.verificationToken ||
    known?.token ||
    `vtok_${member.id}_${memberId.toLowerCase()}`;

  const nic =
    member.nic ||
    known?.nic ||
    `19${(70 + (index % 25)).toString()}${((index + 11) * 1234567).toString().slice(0, 8)}`;

  const verificationStatus =
    member.verificationStatus || (member.isInactive ? "suspended" : "verified");

  const issueDate = member.issueDate || "2026-01-01";
  const expiryDate = member.expiryDate || calculateExpiryDate(issueDate, 3);
  const photo = resolveMemberPhoto(member.photo);

  return {
    ...member,
    photo,
    memberId,
    nic,
    verificationToken,
    verificationStatus,
    issueDate,
    expiryDate,
  };
}

declare global {
  var __liveTeamStore: TeamMember[] | undefined;
}

// In-memory store for server actions in development / demo mode (persists across module re-evaluations)
let liveTeamStore: TeamMember[] =
  globalThis.__liveTeamStore ||
  TEAM_MEMBERS.map((m, idx) => initializeTeamMemberDefaults(m, idx));
globalThis.__liveTeamStore = liveTeamStore;

export function getTeamMembers(includeInactive: boolean = true): TeamMember[] {
  if (includeInactive) {
    return [...liveTeamStore];
  }
  return liveTeamStore.filter((m) => !m.isInactive);
}

export function getAllTeamMembersAdmin(): TeamMember[] {
  return [...liveTeamStore];
}

export function getNextMemberId(): string {
  const existingNumbers = liveTeamStore
    .map((m) => {
      const match = m.memberId?.match(/^BJWS(\d+)$/i);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));
  const max = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  return `BJWS${(max + 1).toString().padStart(3, "0")}`;
}

export function getMemberByVerification(
  id: string,
  token: string
): TeamMember | null {
  if (!id || !token) return null;
  const targetId = id.trim().toLowerCase();
  const targetToken = token.trim();

  // 1. Direct match in liveTeamStore
  const direct = liveTeamStore.find(
    (m) =>
      (m.id.toLowerCase() === targetId ||
        (m.memberId && m.memberId.toLowerCase() === targetId)) &&
      m.verificationToken === targetToken
  );
  if (direct) return direct;

  // 2. Match against official known registry
  const known = KNOWN_OFFICIAL_MEMBERS.find(
    (km) =>
      (km.memberId.toLowerCase() === targetId ||
        km.key.toLowerCase() === targetId) &&
      km.token === targetToken
  );
  if (known) {
    const fromStore = liveTeamStore.find(
      (m) =>
        m.id.toLowerCase() === known.key ||
        (m.memberId && m.memberId.toUpperCase() === known.memberId)
    );
    if (fromStore) {
      return {
        ...fromStore,
        memberId: fromStore.memberId || known.memberId,
        verificationToken: fromStore.verificationToken || known.token,
        nic: fromStore.nic || known.nic,
        verificationStatus: fromStore.isInactive ? "suspended" : "verified",
      };
    }
  }

  return null;
}

export function regenerateMemberVerificationTokenStore(
  id: string
): string | null {
  const member = liveTeamStore.find((m) => m.id === id || m.memberId === id);
  if (!member) return null;
  const newToken =
    "vtok_" +
    Math.random().toString(36).substring(2, 9) +
    Math.random().toString(36).substring(2, 9);
  member.verificationToken = newToken;
  globalThis.__liveTeamStore = liveTeamStore;
  return newToken;
}

export function addTeamMemberStore(member: TeamMember): void {
  const issueDate = member.issueDate || "2026-01-01";
  const memberWithDefaults: TeamMember = {
    ...member,
    photo: resolveMemberPhoto(member.photo),
    memberId: member.memberId || getNextMemberId(),
    nic: member.nic || "Pending NIC submission",
    verificationToken:
      member.verificationToken ||
      "vtok_" +
        Math.random().toString(36).substring(2, 9) +
        Math.random().toString(36).substring(2, 9),
    verificationStatus:
      member.verificationStatus ||
      (member.isInactive ? "suspended" : "verified"),
    issueDate,
    expiryDate: member.expiryDate || calculateExpiryDate(issueDate, 3),
  };

  const firstInactiveIndex = liveTeamStore.findIndex((m) => m.isInactive);
  if (firstInactiveIndex !== -1 && !memberWithDefaults.isInactive) {
    liveTeamStore.splice(firstInactiveIndex, 0, memberWithDefaults);
  } else {
    liveTeamStore.push(memberWithDefaults);
  }
  globalThis.__liveTeamStore = liveTeamStore;
}

export function updateTeamMemberStore(
  id: string,
  updates: Partial<TeamMember>
): boolean {
  const index = liveTeamStore.findIndex(
    (m) => m.id === id || m.memberId === id
  );
  if (index === -1) return false;

  const current = liveTeamStore[index];
  const photo =
    updates.photo !== undefined
      ? resolveMemberPhoto(updates.photo)
      : current.photo;
  const issueDate = updates.issueDate || current.issueDate || "2026-01-01";
  const expiryDate =
    updates.expiryDate ||
    current.expiryDate ||
    calculateExpiryDate(issueDate, 3);
  const nic =
    updates.nic !== undefined && updates.nic !== "" ? updates.nic : current.nic;
  const memberId =
    updates.memberId !== undefined && updates.memberId !== ""
      ? updates.memberId
      : current.memberId;

  liveTeamStore[index] = {
    ...current,
    ...updates,
    photo,
    issueDate,
    expiryDate,
    nic,
    memberId,
    role: {
      ...current.role,
      ...(updates.role || {}),
    },
    categoryLabel: {
      ...current.categoryLabel,
      ...(updates.categoryLabel || {}),
    },
  };
  globalThis.__liveTeamStore = liveTeamStore;
  return true;
}

export function deleteTeamMemberStore(id: string): boolean {
  const initialLen = liveTeamStore.length;
  liveTeamStore = liveTeamStore.filter((m) => m.id !== id);
  globalThis.__liveTeamStore = liveTeamStore;
  return liveTeamStore.length < initialLen;
}

export function toggleTeamMemberActiveStore(id: string): boolean {
  const member = liveTeamStore.find((m) => m.id === id);
  if (!member) return false;
  member.isInactive = !member.isInactive;
  globalThis.__liveTeamStore = liveTeamStore;
  return true;
}

export function reorderTeamMembersStore(orderedIds: string[]): void {
  const idMap = new Map(liveTeamStore.map((m) => [m.id, m]));
  const reordered: TeamMember[] = [];

  for (const id of orderedIds) {
    const member = idMap.get(id);
    if (member) {
      reordered.push(member);
      idMap.delete(id);
    }
  }

  // Preserve any remaining members not in the ordered list
  for (const remaining of idMap.values()) {
    reordered.push(remaining);
  }

  liveTeamStore = reordered;
  globalThis.__liveTeamStore = liveTeamStore;
}
