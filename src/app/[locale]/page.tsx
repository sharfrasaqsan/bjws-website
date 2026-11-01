import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";
import {
  PhoneCall,
  Phone,
  Users,
  HeartHandshake,
  ArrowRight,
  Heart,
  ShieldCheck,
  MapPin,
  Clock,
  Award,
  Calendar,
  Camera,
  Eye,
  Mail,
  Sparkles,
  BookOpen,
  LifeBuoy,
  Building2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import {
  JsonLd,
  getOrganizationJsonLd,
  getServicesJsonLd,
} from "@/components/seo/json-ld";
import { getArticles, type Article } from "@/content/news";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("heroTitle")} | ${tCommon("societyShort")}`,
    description: t("heroMission"),
    path: "/",
    locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tServices = await getTranslations("servicesPage");

  // Fetch top 3 latest published news articles
  let latestArticles: Article[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .eq("locale", locale)
        .order("published_at", { ascending: false })
        .limit(3);

      if (!error && data && data.length > 0) {
        latestArticles = data.map((d) => ({
          id: d.id,
          slug: d.slug,
          title: d.title,
          excerpt: d.excerpt,
          content: d.content,
          category: (d.category as Article["category"]) || "general",
          categoryLabel: {
            en: d.category || "General News",
            ta: "செய்திகள்",
            si: "පුවත්",
          },
          author: d.author || "BJWS Secretariat",
          image_url: d.image_url || "/images/gallery/shramadana-01.webp",
          locale: (d.locale as "en" | "ta" | "si") || "en",
          published_at: d.published_at || d.created_at,
          is_published: true,
          read_time_minutes: Math.max(
            1,
            Math.ceil((d.content?.split(/\s+/).length || 200) / 180)
          ),
        }));
      }
    } catch {
      // Fallback handled below
    }
  }

  if (latestArticles.length === 0) {
    latestArticles = getArticles(locale).slice(0, 3);
  }

  // All 7 Core Programs of BJWS
  const coreServices = [
    {
      id: "funeral-assistance",
      title: tServices("service1Title"),
      badge: tServices("service1Badge"),
      desc: tServices("service1Desc"),
      image: "/images/gallery/ghusl-02.webp",
      icon: Clock,
      highlightBadge: "24/7 Immediate Response",
    },
    {
      id: "cemetery-maintenance",
      title: tServices("service2Title"),
      badge: tServices("service2Badge"),
      desc: tServices("service2Desc"),
      image: "/images/gallery/shramadana-02.webp",
      icon: Sparkles,
      highlightBadge: "1.5 Acres Maintained",
    },
    {
      id: "relief-services",
      title: tServices("service3Title"),
      badge: tServices("service3Badge"),
      desc: tServices("service3Desc"),
      image: "/images/gallery/iftar-01.webp",
      icon: HeartHandshake,
      highlightBadge: "Essential Needs Support",
    },
    {
      id: "education-workshops",
      title: tServices("service4Title"),
      badge: tServices("service4Badge"),
      desc: tServices("service4Desc"),
      image: "/images/gallery/ghusl-01.webp",
      icon: BookOpen,
      highlightBadge: "Youth Sunnah Seminars",
    },
    {
      id: "shramadana-campaigns",
      title: tServices("service5Title"),
      badge: tServices("service5Badge"),
      desc: tServices("service5Desc"),
      image: "/images/gallery/shramadana-01.webp",
      icon: Users,
      highlightBadge: "Community Volunteering",
    },
    {
      id: "orphan-care",
      title: tServices("service6Title"),
      badge: tServices("service6Badge"),
      desc: tServices("service6Desc"),
      image: "/images/gallery/livelihood-01.webp",
      icon: Heart,
      highlightBadge: "Kafalah Sponsorship",
    },
    {
      id: "disaster-relief",
      title: tServices("service7Title"),
      badge: tServices("service7Badge"),
      desc: tServices("service7Desc"),
      image: "/images/gallery/water-concrete-01.webp",
      icon: LifeBuoy,
      highlightBadge: "Emergency Crisis Aid",
    },
  ];

  // Key Leadership & 24/7 Field Contacts
  const keyLeaders = [
    {
      role: t("presidentRole"),
      name: "A.M. Sahibullah",
      phone: "072 440 9574",
      tel: "+94724409574",
      initials: "AMS",
    },
    {
      role: t("organizerRole"),
      name: "A. Abuhuraira",
      phone: "077 622 7323",
      tel: "+94776227323",
      initials: "AA",
      isEmergency: true,
    },
    {
      role: t("secretaryRole"),
      name: "A.L.M. Siyam",
      phone: "077 278 2829",
      tel: "+94772782829",
      initials: "ALMS",
    },
  ];

  return (
    <>
      <JsonLd data={getOrganizationJsonLd()} />
      <JsonLd data={getServicesJsonLd(locale)} />

      {/* 1. Full-Bleed Photo Hero with Dark Green Overlay */}
      <section className="relative overflow-hidden bg-[#072115] text-white">
        {/* Real photo background with next/image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/shramadana-01.webp"
            alt="BJWS Community Service at Cemetery Grounds, Mullipothanai"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Deep evergreen gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#062115]/95 via-[#0b2e1e]/90 to-[#072518]/92" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Authentic Islamic geometric pattern */}
        <IslamicPattern
          opacity={0.06}
          className="text-[#d4a359] z-10 pointer-events-none"
        />

        {/* Hero Content */}
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-36 pb-32 sm:pb-40 lg:pb-44">
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-4 py-1.5 text-xs font-semibold text-[#d4a359] shadow-sm backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4a359]" />
              <span>{t("heroEyebrow")}</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.14]">
              {t("heroTitle")}
            </h1>

            {/* Mission / Supporting line */}
            <p className="mt-5 text-lg sm:text-xl text-emerald-100/90 font-medium leading-relaxed">
              {t("heroMission")}
            </p>

            <p className="mt-3 text-sm sm:text-base text-emerald-200/75 leading-relaxed">
              {t("aboutSectionLead")}
            </p>

            {/* Two CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/membership" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2.5 rounded-md bg-[#c99a45] px-7 py-3.5 text-sm sm:text-base font-bold text-[#072015] shadow-lg transition-all duration-200 hover:bg-[#b88937] hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Users className="h-4 w-4" />
                  <span>{t("joinUsButton")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>

              <Link href="/donate" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2.5 rounded-md border-2 border-white/80 bg-white/10 px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm backdrop-blur-xs transition-all duration-200 hover:border-white hover:bg-white/20 hover:-translate-y-0.5"
                >
                  <Heart className="h-4 w-4 fill-white/20" />
                  <span>{t("supportUsButton")}</span>
                </button>
              </Link>
            </div>

            {/* Trust line */}
            <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 border-t border-emerald-800/40 pt-5 sm:pt-6 text-xs font-medium text-emerald-200/70">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#c99a45]" />
                {tCommon("regNo")}
              </span>
              <span className="hidden sm:inline text-emerald-700/60">•</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-300" />
                {tCommon("location")}
              </span>
              <span className="hidden sm:inline text-emerald-700/60">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-300" />
                {tCommon("foundedYear")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Overlapping Info Bar with 3 items (Report a Janaza, Become a Member, Relief Services) */}
      <section className="relative z-30 -mt-10 sm:-mt-20 lg:-mt-28 mb-12 sm:mb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollRevealGroup
            staggerMs={90}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
          >
            {/* Item 1: Report a Janaza (24/7 Immediate Contact 077 622 7323) */}
            <div className="relative overflow-hidden rounded-xl bg-[#0c3121] p-6 lg:p-7 text-white shadow-xl border border-emerald-700/50 transition-all duration-200 hover:border-[#c99a45]/60 hover:-translate-y-1 group">
              <IslamicPattern
                opacity={0.05}
                className="text-[#c99a45] pointer-events-none"
              />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#c99a45] text-[#072015] shadow-sm">
                      <PhoneCall className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      24/7 Immediate Hotline
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-bold tracking-tight text-white">
                    {t("infoBarItem1Title")}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                    {t("infoBarItem1Desc")}
                  </p>
                </div>

                <a
                  href="tel:+94776227323"
                  className="mt-6 inline-flex items-center justify-between rounded-md bg-[#c99a45] hover:bg-[#b88937] text-[#072015] font-bold px-4 py-2.5 text-xs sm:text-sm shadow-sm transition-all duration-150"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    <span>{t("infoBarItem1Cta")}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Item 2: Become a Member (LKR 50/mo or LKR 500/yr) */}
            <div className="rounded-xl bg-surface p-6 lg:p-7 text-foreground shadow-xl border border-[#e6e4dc] transition-all duration-200 hover:border-[#124d34]/40 hover:-translate-y-1 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#124d34] text-white shadow-2xs">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f3ee] text-[#124d34] border border-[#124d34]/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    50+ Members
                  </span>
                </div>

                <h2 className="font-display text-xl font-bold tracking-tight text-[#0b2e1e]">
                  {t("infoBarItem2Title")}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">
                  {t("infoBarItem2Desc")}
                </p>
              </div>

              <Link
                href="/membership"
                className="mt-6 inline-flex items-center justify-between rounded-md bg-[#124d34] hover:bg-[#0b2e1e] text-white font-semibold px-4 py-2.5 text-xs sm:text-sm shadow-2xs transition-all duration-150"
              >
                <span>{t("infoBarItem2Cta")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Item 3: Relief & Humanitarian Aid */}
            <div className="rounded-xl bg-surface p-6 lg:p-7 text-foreground shadow-xl border border-[#e6e4dc] transition-all duration-200 hover:border-[#124d34]/40 hover:-translate-y-1 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fef3c7] text-[#92400e] border border-amber-300 shadow-2xs">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    Welfare & Relief
                  </span>
                </div>

                <h2 className="font-display text-xl font-bold tracking-tight text-[#0b2e1e]">
                  {t("infoBarItem3Title")}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">
                  {t("infoBarItem3Desc")}
                </p>
              </div>

              <Link
                href="/services"
                className="mt-6 inline-flex items-center justify-between rounded-md border border-[#124d34] text-[#124d34] hover:bg-[#124d34] hover:text-white font-semibold px-4 py-2.5 text-xs sm:text-sm transition-all duration-150"
              >
                <span>{t("infoBarItem3Cta")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* 3. About Split & Key Leadership Contact Quick-Bar */}
      <section className="relative overflow-hidden bg-[#fbfaf6] py-16 sm:py-24 border-b border-[#e6e4dc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column with 2 Overlapping Real Photos + Badge */}
            <ScrollReveal
              variant="left"
              className="lg:col-span-6 relative pb-6 sm:pb-0"
            >
              <div className="relative aspect-[4/3] sm:aspect-[14/11] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-surface">
                <Image
                  src="/images/gallery/ghusl-01.webp"
                  alt="BJWS Ritual Washing and Shrouding Training Workshop"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="absolute -bottom-2 right-2 sm:-bottom-8 sm:-right-6 w-1/2 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-surface">
                <Image
                  src="/images/gallery/water-concrete-01.webp"
                  alt="BJWS Cemetery Water Supply Infrastructure"
                  fill
                  sizes="(max-width: 1024px) 60vw, 25vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="absolute top-3 left-3 sm:-top-6 sm:-left-6 bg-[#0b2e1e] text-white border-2 border-[#c99a45] rounded-xl p-2.5 sm:p-4 shadow-xl flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-[#c99a45] text-[#072015]">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <span className="block text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#d4a359]">
                    {tCommon("foundedYear")}
                  </span>
                  <span className="block font-display text-xs sm:text-sm font-bold text-white">
                    Buhary Mahallah
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Narrative Column */}
            <ScrollReveal variant="right" className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[#e8f3ee] px-3.5 py-1 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t("aboutSectionEyebrow")}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0b2e1e] leading-snug">
                {t("aboutSectionTitle")}
              </h2>

              <p className="text-base sm:text-lg text-[#1c2420] font-medium leading-relaxed">
                {t("aboutSectionLead")}
              </p>

              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                {t("aboutSectionBody")}
              </p>

              <div className="pt-2">
                <Link href="/about">
                  <button
                    type="button"
                    className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-[#124d34] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#0b2e1e] hover:shadow hover:-translate-y-0.5"
                  >
                    <span>{t("aboutReadMore")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Key Leadership & 24/7 Immediate Contact Bar */}
          <ScrollReveal variant="fade-up" className="mt-16 sm:mt-20">
            <div className="rounded-2xl border border-[#0b2e1e]/15 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0b2e1e]/10 pb-5">
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#c99a45]">
                    {t("leadershipBarEyebrow")}
                  </span>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-[#0b2e1e]">
                    {t("leadershipBarTitle")}
                  </h3>
                </div>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#124d34] hover:text-[#0b2e1e] transition-colors"
                >
                  <span>{t("meetFullTeamButton")}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {keyLeaders.map((leader, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 sm:p-5 transition-all ${
                      leader.isEmergency
                        ? "bg-[#0b2e1e] text-white border-2 border-[#c99a45]/60 shadow-md"
                        : "bg-[#fbfaf6] border border-[#e6e4dc] text-[#1c2420]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          leader.isEmergency
                            ? "bg-[#c99a45] text-[#072015]"
                            : "bg-[#e8f3ee] text-[#124d34]"
                        }`}
                      >
                        {leader.role}
                      </span>
                    </div>
                    <div className="font-display text-base sm:text-lg font-bold">
                      {leader.name}
                    </div>
                    <a
                      href={`tel:${leader.tel}`}
                      className={`mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-bold transition-all ${
                        leader.isEmergency
                          ? "text-[#d4a359] hover:text-white"
                          : "text-[#124d34] hover:text-[#0b2e1e]"
                      }`}
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{leader.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Programs / All 7 Core Community Services */}
      <section className="relative overflow-hidden bg-surface py-16 sm:py-24 border-b border-[#e6e4dc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[#e8f3ee] px-3.5 py-1 text-xs font-semibold text-primary mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{t("servicesOverviewEyebrow")}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0b2e1e]">
              {t("servicesOverviewTitle")}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
              {t("servicesOverviewDesc")}
            </p>
          </ScrollReveal>

          {/* 7 Core Services Responsive Grid */}
          <ScrollRevealGroup
            staggerMs={70}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {coreServices.map((service, idx) => (
              <div
                key={service.id || idx}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e6e4dc] bg-surface shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                {/* Photo with Aspect Ratio for Zero CLS */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 rounded-md bg-[#0b2e1e]/90 text-[#d4a359] text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider backdrop-blur-xs">
                    {service.badge}
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/50 text-white text-[11px] font-medium px-2 py-0.5 backdrop-blur-xs">
                    {service.highlightBadge}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-[#0b2e1e] group-hover:text-primary transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
                      {service.desc}
                    </p>
                  </div>

                  <Link
                    href="/services"
                    className="mt-5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover group/link"
                  >
                    <span>{tCommon("learnMore")}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </ScrollRevealGroup>

          {/* Direct CTA to Services Page */}
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b2e1e] px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#12422c] hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>{t("servicesViewAll")}</span>
              <ArrowRight className="h-4 w-4 text-[#d4af37]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Impact Band (Counters & Community Milestones) */}
      <section className="relative overflow-hidden bg-[#072115] py-16 sm:py-24 text-white border-b border-emerald-950">
        <IslamicPattern
          opacity={0.05}
          className="text-[#d4a359] pointer-events-none"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-4 py-1 text-xs font-semibold text-[#d4a359] mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4a359]" />
              <span>{t("statsBandEyebrow")}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {t("statsBandTitle")}
            </h2>
          </div>

          <ScrollRevealGroup
            staggerMs={80}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {/* Stat 1: Funerals Arranged */}
            <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-xs transition-all hover:bg-white/8 hover:border-emerald-500/30 group">
              <div className="font-display text-4xl sm:text-5xl font-bold text-[#d4a359]">
                <AnimatedCounter value={28} />
              </div>
              <h3 className="mt-2 text-base sm:text-lg font-bold text-white tracking-tight">
                {t("statFuneralsLabel")}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-emerald-200/75 leading-relaxed">
                {t("statFuneralsDesc")}
              </p>
            </div>

            {/* Stat 2: Active Members */}
            <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-xs transition-all hover:bg-white/8 hover:border-emerald-500/30 group">
              <div className="font-display text-4xl sm:text-5xl font-bold text-[#d4a359]">
                <AnimatedCounter value={50} suffix="+" />
              </div>
              <h3 className="mt-2 text-base sm:text-lg font-bold text-white tracking-tight">
                {t("statMembersLabel")}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-emerald-200/75 leading-relaxed">
                {t("statMembersDesc")}
              </p>
            </div>

            {/* Stat 3: Essential Needs Aid */}
            <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-xs transition-all hover:bg-white/8 hover:border-emerald-500/30 group">
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#d4a359]">
                {t("statRationsValue")}
              </div>
              <h3 className="mt-2 text-base sm:text-lg font-bold text-white tracking-tight">
                {t("statRationsLabel")}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-emerald-200/75 leading-relaxed">
                {t("statRationsDesc")}
              </p>
            </div>

            {/* Stat 4: Cemetery Renovated */}
            <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-xs transition-all hover:bg-white/8 hover:border-emerald-500/30 group">
              <div className="font-display text-4xl sm:text-5xl font-bold text-[#d4a359]">
                <AnimatedCounter value={1.5} decimals={1} suffix=" Acres" />
              </div>
              <h3 className="mt-2 text-base sm:text-lg font-bold text-white tracking-tight">
                {t("statCemeteryLabel")}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-emerald-200/75 leading-relaxed">
                {t("statCemeteryDesc")}
              </p>
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* 6. Dynamic Latest News & Community Bulletins */}
      <section className="relative overflow-hidden bg-[#fbfaf6] py-16 sm:py-24 border-b border-[#e6e4dc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 sm:mb-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-[#e8f3ee] px-3.5 py-1 text-xs font-semibold text-primary mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t("newsTeaserEyebrow")}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0b2e1e]">
                {t("newsTeaserTitle")}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed">
                {t("newsTeaserDesc")}
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-xl bg-[#e8f3ee] hover:bg-[#124d34] hover:text-white text-[#124d34] px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors duration-200 shrink-0"
            >
              <span>{t("viewAllNewsButton")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ScrollRevealGroup
            staggerMs={80}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {latestArticles.map((article) => {
              const formattedDate = new Date(article.published_at).toLocaleDateString(
                locale === "ta" ? "ta-LK" : locale === "si" ? "si-LK" : "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

              return (
                <article
                  key={article.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e6e4dc] bg-surface shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 rounded-md bg-[#c99a45] text-[#072015] text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">
                      {article.categoryLabel[locale as "en" | "ta" | "si"] ||
                        article.category}
                    </span>
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-white text-[11px] font-medium bg-black/40 px-2.5 py-1 rounded backdrop-blur-xs">
                      <Calendar className="h-3 w-3 text-[#d4a359]" />
                      <span>{formattedDate}</span>
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#0b2e1e] group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#e6e4dc] pt-4">
                      <span className="text-[11px] font-medium text-[#6b7280]">
                        {article.read_time_minutes} min read
                      </span>
                      <Link
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover group/link"
                      >
                        <span>{t("readArticle")}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* 7. Support, Membership & Official BOC Bank Details Section */}
      <section className="relative overflow-hidden bg-[#072115] py-20 sm:py-28 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/shramadana-01.webp"
            alt="BJWS Community Volunteers"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#062115]/95 via-[#0b2e1e]/90 to-[#062115]/95" />
        </div>

        <IslamicPattern
          opacity={0.06}
          className="text-[#d4a359] z-10 pointer-events-none"
        />

        <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="scale" className="text-center">
            <p className="font-display italic text-xs sm:text-sm text-[#d4a359] mb-4 tracking-wide max-w-2xl mx-auto">
              {t("ctaQuote")}
            </p>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {t("ctaTitle")}
            </h2>

            <p className="mt-4 text-sm sm:text-base lg:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
              {t("ctaDesc")}
            </p>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/membership" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 rounded-md bg-[#c99a45] hover:bg-[#b88937] text-[#072015] font-bold px-8 py-3.5 text-sm sm:text-base shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Users className="h-4 w-4" />
                  <span>{t("ctaJoinButton")}</span>
                </button>
              </Link>

              <Link href="/donate" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 rounded-md border-2 border-white/80 bg-white/10 hover:bg-white/20 hover:border-white text-white font-semibold px-8 py-3.5 text-sm sm:text-base shadow-sm backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Heart className="h-4 w-4 fill-white/20" />
                  <span>{t("ctaDonateButton")}</span>
                </button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Official Bank of Ceylon (BOC) Direct Deposit Card */}
          <ScrollReveal variant="fade-up" className="mt-14 sm:mt-16">
            <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-950/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-emerald-800/60 pb-6">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#c99a45] text-[#072015]">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#d4a359]">
                      Direct Support Channel
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                      {t("bankTransferTitle")}
                    </h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-3.5 py-1 text-xs text-emerald-200 border border-emerald-700/50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#d4a359]" />
                  <span>Verified Official Account</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                <div className="rounded-xl bg-black/25 p-4 border border-emerald-800/40">
                  <span className="block text-[11px] font-medium text-emerald-300/80 uppercase tracking-wider">
                    {t("bankNameLabel")}
                  </span>
                  <span className="block mt-1 text-sm font-bold text-white">
                    {t("bankNameValue")}
                  </span>
                </div>

                <div className="rounded-xl bg-black/25 p-4 border border-emerald-800/40">
                  <span className="block text-[11px] font-medium text-emerald-300/80 uppercase tracking-wider">
                    {t("branchLabel")}
                  </span>
                  <span className="block mt-1 text-sm font-bold text-white">
                    {t("branchValue")}
                  </span>
                </div>

                <div className="rounded-xl bg-black/25 p-4 border border-[#c99a45]/50 bg-[#c99a45]/10">
                  <span className="block text-[11px] font-medium text-[#d4a359] uppercase tracking-wider">
                    {t("accountNoLabel")}
                  </span>
                  <span className="block mt-1 font-mono text-base font-bold text-white tracking-wider">
                    90941571
                  </span>
                </div>

                <div className="rounded-xl bg-black/25 p-4 border border-emerald-800/40">
                  <span className="block text-[11px] font-medium text-emerald-300/80 uppercase tracking-wider">
                    {t("accountNameLabel")}
                  </span>
                  <span className="block mt-1 text-xs font-bold text-white leading-snug">
                    {t("accountNameValue")}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-emerald-800/40 text-xs text-emerald-200/80">
                <p>{t("bankTransferDesc")}</p>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-1.5 font-bold text-[#d4a359] hover:text-white transition-colors"
                >
                  <span>Bank Slip & Donation Guidelines</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Quick contact helpline link */}
          <div className="mt-10 pt-6 border-t border-emerald-800/40 text-xs text-emerald-200/80 flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+94776227323"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5 text-[#c99a45]" />
              <span>24/7 Hotline: 077 622 7323</span>
            </a>
            <span>•</span>
            <a
              href="mailto:mbjwsociety@gmail.com"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5 text-emerald-300" />
              <span>mbjwsociety@gmail.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. Photographic Documentation Strip */}
      <section className="relative overflow-hidden bg-surface py-16 sm:py-24 border-b border-[#e6e4dc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#c99a45] mb-2">
                <Camera className="h-3.5 w-3.5" />
                <span>Photographic Documentation</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0b2e1e]">
                Moments of Community Service
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-md bg-[#e8f3ee] hover:bg-[#124d34] hover:text-white text-[#124d34] px-4 py-2 text-xs sm:text-sm font-semibold transition-colors duration-200"
            >
              <span>{t("viewGalleryButton")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 5-Photo Showcase Strip */}
          <ScrollRevealGroup
            staggerMs={50}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
          >
            {[
              {
                src: "/images/gallery/cemetery-road-01.webp",
                caption: "Cemetery Access Road",
              },
              {
                src: "/images/gallery/ghusl-01.webp",
                caption: "Ghusl Training Session",
              },
              {
                src: "/images/gallery/water-concrete-01.webp",
                caption: "Water Facilities",
              },
              {
                src: "/images/gallery/iftar-01.webp",
                caption: "Ration Pack Storage",
              },
              {
                src: "/images/gallery/shramadana-02.webp",
                caption: "Mahallah Shramadhana",
              },
            ].map((photo, i) => (
              <Link
                key={i}
                href="/gallery"
                className={`group relative rounded-xl overflow-hidden shadow-2xs border border-[#e6e4dc] bg-muted block ${
                  i === 4
                    ? "col-span-2 sm:col-span-1 lg:col-span-1 aspect-[2/1] sm:aspect-[4/5]"
                    : "aspect-square sm:aspect-[4/5]"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                  <Eye className="h-5 w-5 text-[#d4a359] mb-1 opacity-90" />
                  <span className="text-xs font-semibold leading-tight line-clamp-2">
                    {photo.caption}
                  </span>
                </div>
              </Link>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>
    </>
  );
}
