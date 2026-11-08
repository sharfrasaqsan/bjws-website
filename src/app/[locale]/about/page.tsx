import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";
import { buildPageMetadata } from "@/lib/seo";
import {
  JsonLd,
  getBreadcrumbJsonLd,
  getAboutPageJsonLd,
} from "@/components/seo/json-ld";
import {
  Compass,
  Target,
  Phone,
  FileCheck,
  Check,
  ArrowRight,
  Award,
} from "lucide-react";
import { getSiteAssets } from "@/content/site-assets";
import {
  getTeamMembers,
  type TeamMember,
  resolveMemberPhoto,
} from "@/content/team";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("forewordText").slice(0, 160),
    path: "/about",
    locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const tCommon = await getTranslations("common");

  const coreValues = [
    { title: t("value1Title"), desc: t("value1Desc"), number: "01" },
    { title: t("value2Title"), desc: t("value2Desc"), number: "02" },
    { title: t("value3Title"), desc: t("value3Desc"), number: "03" },
    { title: t("value4Title"), desc: t("value4Desc"), number: "04" },
    { title: t("value5Title"), desc: t("value5Desc"), number: "05" },
  ];

  const missionItems = [
    t("missionItem1"),
    t("missionItem2"),
    t("missionItem3"),
    t("missionItem4"),
    t("missionItem5"),
  ];

  const structureRoles = [
    {
      title: t("rolePresident"),
      number: "01",
      desc:
        locale === "ta"
          ? "சங்கத் தலைமைத்துவம் & பொதுக்கூட்டத் தலைமை"
          : locale === "si"
            ? "සමිතියේ නායකත්වය සහ මහා සභා මුලසුන"
            : "Society Leadership & Assembly Chair",
    },
    {
      title: t("roleVicePresident"),
      number: "02",
      desc:
        locale === "ta"
          ? "நிர்வாக ஆதரவு & உதவித் தலைமை"
          : locale === "si"
            ? "විධායක සහාය සහ අනුප්‍රාප්තිකත්වය"
            : "Executive Support & Deputization",
    },
    {
      title: t("roleSecretary"),
      number: "03",
      desc:
        locale === "ta"
          ? "செயலகப் பணிகள், கூட்டக்குறிப்புகள் & பதிவேடுகள்"
          : locale === "si"
            ? "ලේකම් කාර්යාලය, වාර්තා සහ ලේඛන"
            : "Secretariat, Minutes & Registry",
    },
    {
      title: t("roleViceSecretary"),
      number: "04",
      desc:
        locale === "ta"
          ? "செயலக உதவி & ஆவணப்படுத்தல்"
          : locale === "si"
            ? "ලේකම් සහාය සහ ලේඛනගත කිරීම"
            : "Secretarial Support & Documentation",
    },
    {
      title: t("roleTreasurer"),
      number: "05",
      desc:
        locale === "ta"
          ? "கணக்குகள், தணிக்கை & சந்தா சேகரிப்பு"
          : locale === "si"
            ? "ගිණුම්, විගණන සහ දායකත්ව මුදල්"
            : "Accounts, Audits & Contributions",
    },
    {
      title: t("roleCommittee"),
      number: "06",
      desc:
        locale === "ta"
          ? "சமூக ஆலோசனைகள் & ஷூரா சபை"
          : locale === "si"
            ? "ප්‍රජා උපදේශනය සහ ෂුරා සභාව"
            : "Community Consultation & Shura",
    },
    {
      title: t("roleVolunteers"),
      number: "07",
      desc:
        locale === "ta"
          ? "ஜனாஸா உதவி & மையவாடி பராமரிப்பு"
          : locale === "si"
            ? "அවමංගල්‍ය සහාය සහ සුසාන භූමි නඩත්තුව"
            : "Funeral Support & Cemetery Upkeep",
    },
  ];

  const assets = getSiteAssets();
  let allTeam: TeamMember[] = getTeamMembers();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_inactive", false)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        allTeam = data.map((d) => ({
          id: d.id,
          name: d.name,
          role: {
            en: d.role_en,
            ta: d.role_ta || d.role_en,
            si: d.role_si || d.role_en,
          },
          category: (d.category as TeamMember["category"]) || "operations",
          categoryLabel: {
            en: d.category || "Committee",
            ta: "செயற்குழு",
            si: "කමිටුව",
          },
          phone: d.phone,
          whatsapp: d.whatsapp || undefined,
          email: d.email || undefined,
          address: d.address,
          initials: d.initials,
          photo: resolveMemberPhoto(d.photo || undefined),
          term: d.term,
          isInactive: d.is_inactive,
        }));
      }
    } catch {
      // fallback
    }
  }

  const getOfficer = (
    id: string,
    fallback: {
      name: string;
      role: string;
      phone: string;
      initials: string;
      photo?: string;
    }
  ) => {
    const member = allTeam.find((m) => m.id === id);
    if (!member) return fallback;
    const resolvedPhoto = resolveMemberPhoto(member.photo);
    return {
      name: member.name,
      role: member.role[locale as "en" | "ta" | "si"] || member.role.en,
      phone: member.phone,
      initials: member.initials,
      photo: resolvedPhoto || resolveMemberPhoto(fallback.photo),
    };
  };

  const executiveOfficers = [
    getOfficer("sahibullah", {
      name: "A.M. Sahibullah",
      role: t("rolePresident"),
      phone: "072 440 9574",
      initials: "AMS",
      photo: "/images/team/sahibulla_new.webp",
    }),
    getOfficer("siyam", {
      name: "A.L.M. Siyam",
      role: t("roleSecretary"),
      phone: "077 278 2829",
      initials: "ALMS",
      photo: "/images/team/siyam.webp",
    }),
    getOfficer("faizarkhan", {
      name: "M.S. Faizarkhan",
      role: t("roleTreasurer"),
      phone: "075 651 0050",
      initials: "MSF",
      photo: "/images/team/faisarkhan.webp",
    }),
    getOfficer("abuhuraira", {
      name: "A. Abuhuraira",
      role:
        locale === "ta"
          ? "ஒருங்கிணைப்பாளர் & களச் செயற்பாடுகள்"
          : locale === "si"
            ? "මෙහෙයුම් සම්බන්ධීකාරක"
            : "Organizer & Field Operations",
      phone: "077 622 7323",
      initials: "AA",
      photo: "/images/team/abuhuraira_new.webp",
    }),
  ];

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/about" },
          ],
          locale
        )}
      />
      <JsonLd data={getAboutPageJsonLd(locale)} />

      {/* Hero Page Header */}
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("forewordText")}
        eyebrow={tCommon("regNo")}
        imageSrc={assets.headerAbout || "/images/gallery/ghusl-01.webp"}
        imageAlt="BJWS About Community and Constitution"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          {/* Section 1: Foreword & Heritage Split */}
          <ScrollReveal variant="fade-up">
            <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left: Editorial Foreword Card */}
              <div className="relative overflow-hidden rounded-3xl bg-[#0b2e1e] p-8 text-white shadow-xl sm:p-12 lg:col-span-7">
                <IslamicPattern
                  className="pointer-events-none absolute inset-0 text-white"
                  opacity={0.04}
                  id="about-foreword-pattern"
                />
                <div className="relative z-10">
                  <span className="font-sans text-xs font-bold tracking-wider text-[#d4af37] uppercase">
                    {t("forewordEyebrow")}
                  </span>
                  <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {t("forewordTitle")}
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-[#fbfaf6]/90 sm:text-lg">
                    <p className="italic">&ldquo;{t("forewordText")}&rdquo;</p>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#d4af37]" />
                      <span className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                        DS/TH/SS/VSSO/2023/01
                      </span>
                    </div>
                    <span className="text-white/40">•</span>
                    <span className="text-xs text-white/80">
                      Buhary Jummah Mosque Mahallah, Mullipothana
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Real Photo & Stats Card */}
              <div className="space-y-6 lg:col-span-5">
                <div className="relative aspect-[1280/785] w-full overflow-hidden rounded-2xl border border-[#0b2e1e]/15 bg-white p-1.5 shadow-md sm:rounded-3xl sm:p-2">
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-white sm:rounded-2xl">
                    <Image
                      src={assets.aboutCommunity}
                      alt="Buhary Janaza Welfare Society Official Registered Signboard Banner"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-contain object-center"
                      priority
                    />
                  </div>
                </div>

                {/* Information Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#0b2e1e]/10 bg-white p-3 shadow-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b2e1e] px-3 py-1 text-xs font-bold text-[#d4af37]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d4af37]" />
                    Serving Since 2023
                  </span>
                  <span className="text-xs font-semibold text-[#0b2e1e]">
                    Official Society Signboard & Registry
                  </span>
                </div>

                {/* Stat Highlights Bar */}
                <div className="grid grid-cols-3 gap-3 rounded-2xl border border-[#0b2e1e]/10 bg-white p-4 text-center shadow-xs">
                  <div>
                    <div className="font-display text-2xl font-bold text-[#0b2e1e]">
                      20+
                    </div>
                    <div className="text-[11px] font-semibold text-[#6b7280] uppercase">
                      Members
                    </div>
                  </div>
                  <div className="border-x border-[#0b2e1e]/10">
                    <div className="font-display text-2xl font-bold text-[#0b2e1e]">
                      100+
                    </div>
                    <div className="text-[11px] font-semibold text-[#6b7280] uppercase">
                      Janazas
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-[#0b2e1e]">
                      Ongoing
                    </div>
                    <div className="text-[11px] font-semibold text-[#6b7280] uppercase">
                      Welfare Aid
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 2: Vision & Mission (Asymmetric Institutional Layout) */}
          <ScrollReveal variant="fade-up">
            <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Vision Card */}
              <div className="relative overflow-hidden rounded-3xl border border-[#d4af37]/30 bg-[#f4efe6] p-8 shadow-sm sm:p-10 lg:col-span-5">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b2e1e] text-[#d4af37] shadow-sm">
                  <Compass className="h-6 w-6" strokeWidth={2} />
                </div>
                <span className="block font-sans text-xs font-bold tracking-wider text-[#b8952b] uppercase">
                  {t("visionEyebrow")}
                </span>
                <h2 className="font-display mt-1 text-2xl font-bold text-[#0b2e1e] sm:text-3xl">
                  {t("visionTitle")}
                </h2>
                <blockquote className="font-display mt-6 border-l-3 border-[#0b2e1e] pl-4 text-lg leading-relaxed font-medium text-[#0b2e1e] italic sm:text-xl">
                  &ldquo;{t("visionText")}&rdquo;
                </blockquote>
              </div>

              {/* Mission Card */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-10 lg:col-span-7">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f3ee] text-[#0b2e1e]">
                  <Target className="h-6 w-6" strokeWidth={2} />
                </div>
                <span className="block font-sans text-xs font-bold tracking-wider text-[#0b2e1e] uppercase">
                  {tCommon("societyShort")} Strategic Focus
                </span>
                <h2 className="font-display mt-1 text-2xl font-bold text-[#0b2e1e] sm:text-3xl">
                  {t("missionTitle")}
                </h2>
                <ul className="mt-6 space-y-3.5">
                  {missionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0b2e1e] text-[10px] font-bold text-[#d4af37]">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm leading-relaxed font-medium text-[#2d3748] sm:text-base">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 3: Core Values (Numbered Monogram Grid) */}
          <div className="mb-20">
            <ScrollReveal variant="fade-up" className="mb-10 text-center">
              <span className="font-sans text-xs font-bold tracking-wider text-[#b8952b] uppercase">
                {t("valuesEyebrow")}
              </span>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-[#0b2e1e] sm:text-4xl">
                {t("valuesTitle")}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-[#4b5563]">
                Five guiding Islamic principles that govern every action,
                interaction, and expenditure of our society.
              </p>
            </ScrollReveal>

            <ScrollRevealGroup
              staggerMs={60}
              className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-5"
            >
              {coreValues.map((val) => (
                <div
                  key={val.number}
                  className="group relative flex h-full min-h-[14rem] flex-1 flex-col justify-between rounded-2xl border border-[#0b2e1e]/10 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0b2e1e]/30 hover:shadow-md"
                >
                  <div className="flex flex-1 flex-col">
                    <span className="font-display text-3xl font-bold text-[#d4af37] opacity-80 group-hover:opacity-100">
                      {val.number}
                    </span>
                    <h3 className="font-display mt-3 flex min-h-[1.75rem] items-center text-lg leading-snug font-bold text-[#0b2e1e]">
                      {val.title}
                    </h3>
                    <p className="mt-2 flex min-h-[2.5rem] items-start text-xs leading-relaxed text-[#6b7280]">
                      {val.desc}
                    </p>
                  </div>
                  <div className="mt-auto pt-6">
                    <div className="h-1 w-8 rounded-full bg-[#0b2e1e]/15 transition-all group-hover:w-12 group-hover:bg-[#0b2e1e]" />
                  </div>
                </div>
              ))}
            </ScrollRevealGroup>
          </div>

          {/* Section 4: Historical Background Storyline */}
          <ScrollReveal variant="fade-up">
            <div className="mb-20 rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-12 lg:p-14">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-7">
                  <span className="font-sans text-xs font-bold tracking-wider text-[#b8952b] uppercase">
                    {t("historyEyebrow")}
                  </span>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl lg:text-4xl">
                    {t("historyTitle")}
                  </h2>
                  <p className="text-base leading-relaxed text-[#2d3748] sm:text-lg">
                    {t("historyP1")}
                  </p>
                  <p className="text-base leading-relaxed text-[#4b5563]">
                    {t("historyP2")}
                  </p>
                </div>

                {/* Documentary Frame */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-[#0b2e1e]/15 bg-[#0b2e1e]/5 shadow-sm">
                    <Image
                      src={assets.aboutHistoryWater}
                      alt="Historic Buhary Jummah Mosque, 95th Mile Post, Mullipothana"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute right-4 bottom-3 left-4">
                      <span className="text-xs font-semibold text-white drop-shadow-xs">
                        Buhary Jummah Mosque Mahallah, Mullipothana
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 5: Structure & Governance */}
          <ScrollReveal variant="fade-up">
            <div className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-12">
              {/* Left: Organizational Hierarchy */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-10 lg:col-span-5">
                <span className="font-sans text-xs font-bold tracking-wider text-[#b8952b] uppercase">
                  {t("structureEyebrow")}
                </span>
                <h2 className="font-display mt-1 text-2xl font-bold text-[#0b2e1e] sm:text-3xl">
                  {t("structureTitle")}
                </h2>
                <p className="mt-2 text-sm text-[#4b5563]">
                  {t("structureDesc")}
                </p>

                <ol className="mt-6 divide-y divide-[#0b2e1e]/10">
                  {structureRoles.map((role, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <div className="text-sm font-semibold text-[#0b2e1e]">
                          {role.title}
                        </div>
                        <div className="text-xs text-[#6b7280]">
                          {role.desc}
                        </div>
                      </div>
                      <span className="rounded-full bg-[#f4efe6] px-2.5 py-1 font-mono text-[11px] font-bold text-[#0b2e1e]">
                        {role.number}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Right: Executive Committee Officers */}
              <div
                id="team"
                className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-10 lg:col-span-7"
              >
                <span className="font-sans text-xs font-bold tracking-wider text-[#b8952b] uppercase">
                  Elected Leadership
                </span>
                <h2 className="font-display mt-1 text-2xl font-bold text-[#0b2e1e] sm:text-3xl">
                  {t("leadershipTitle")}
                </h2>
                <p className="mt-2 text-sm text-[#4b5563]">
                  Elected committee representatives serving the Buhary Jummah
                  Mosque area under collective shura consultation.
                </p>

                <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
                  {executiveOfficers.map((officer, idx) => (
                    <div
                      key={idx}
                      className="flex h-full flex-1 flex-col justify-between rounded-2xl border border-[#0b2e1e]/10 bg-[#fbfaf6] p-5 transition-all hover:border-[#0b2e1e]/25 hover:shadow-xs"
                    >
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center justify-between gap-2">
                          {officer.photo ? (
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#c99a45]/40 bg-[#0b2e1e] shadow-xs">
                              <Image
                                src={officer.photo}
                                alt={officer.name}
                                fill
                                sizes="48px"
                                className="object-cover object-top"
                              />
                            </div>
                          ) : (
                            <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b2e1e] text-xs font-bold text-[#d4af37]">
                              {officer.initials}
                            </span>
                          )}
                          <span className="truncate rounded-full bg-[#e8f3ee] px-2.5 py-0.5 text-right text-[11px] font-semibold text-[#0b2e1e]">
                            {officer.role}
                          </span>
                        </div>
                        <h3 className="font-display mt-3 flex min-h-[2.5rem] items-center text-base font-bold text-[#0b2e1e]">
                          {officer.name}
                        </h3>
                      </div>
                      <a
                        href={`tel:${officer.phone.replace(/\s+/g, "")}`}
                        className="mt-auto inline-flex items-center gap-1.5 border-t border-[#0b2e1e]/10 pt-4 text-xs font-semibold text-[#0b2e1e] hover:text-[#b8952b]"
                      >
                        <Phone className="h-3.5 w-3.5 text-[#d4af37]" />
                        {officer.phone}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-[#0b2e1e]/10 pt-4 text-center sm:text-left">
                  <Link
                    href="/team"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0b2e1e] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#12422c]"
                  >
                    <span>View All Society Team Profiles</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#d4af37]" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 6: Official Legal Registration & Community Mandate */}
          <ScrollReveal variant="scale">
            <div className="relative overflow-hidden rounded-3xl bg-[#0b2e1e] p-8 text-white shadow-xl sm:p-12 lg:p-14">
              <IslamicPattern
                className="pointer-events-none absolute inset-0 text-white"
                opacity={0.04}
                id="about-registration-seal"
              />
              <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-3 py-1 text-xs font-semibold text-[#d4af37]">
                    <FileCheck className="h-4 w-4" />
                    Official Government Registration
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {t("registrationTitle")}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-[#fbfaf6]/90">
                    {t("registrationText")}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#d4af37]">
                    <span className="font-mono text-sm tracking-wider text-white">
                      DS/TH/SS/VSSO/2023/01
                    </span>
                    <span className="text-white/40">•</span>
                    <span>Thambalagamuwa DS Division</span>
                    <span className="text-white/40">•</span>
                    <span>Eastern Province, Sri Lanka</span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Link
                    href="/membership"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3.5 text-base font-bold text-[#0b2e1e] shadow-md transition-all hover:bg-[#b8952b]"
                  >
                    Apply for Membership
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/reports"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/20"
                  >
                    Annual Reports & Audits
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </div>
    </>
  );
}
