import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
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
  Mail,
  Sparkles,
  BookOpen,
  LifeBuoy,
  Building2,
  CheckCircle2,
  ExternalLink,
  Tag,
} from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import {
  JsonLd,
  getOrganizationJsonLd,
  getServicesJsonLd,
} from "@/components/seo/json-ld";
import { getArticles, type Article } from "@/content/news";
import {
  getApprovedGalleryImages,
  type GalleryImage,
  DEFAULT_BLUR,
  formatCategoryLabel,
} from "@/content/gallery";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { getSiteAssets } from "@/content/site-assets";
import type { HeroBanner } from "@/content/hero-banners";

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

// Select a diverse random sample of approved photos across different categories
function getRandomGalleryShowcase(
  images: GalleryImage[],
  count: number = 5
): GalleryImage[] {
  if (images.length <= count) return [...images];

  // Group by category to ensure a balanced, diverse showcase across community programs
  const byCategory = new Map<string, GalleryImage[]>();
  for (const img of images) {
    const cat = img.category || "general";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(img);
  }

  const shuffledCategories = Array.from(byCategory.keys()).sort(
    () => Math.random() - 0.5
  );
  const selected: GalleryImage[] = [];
  const usedSrcs = new Set<string>();

  // Pick 1 random photo from different categories first
  for (const cat of shuffledCategories) {
    if (selected.length >= count) break;
    const catImages = byCategory.get(cat)!;
    const randomImg = catImages[Math.floor(Math.random() * catImages.length)];
    if (!usedSrcs.has(randomImg.src)) {
      usedSrcs.add(randomImg.src);
      selected.push(randomImg);
    }
  }

  // If still need more to fill count, pick from remaining images
  if (selected.length < count) {
    const remaining = images
      .filter((img) => !usedSrcs.has(img.src))
      .sort(() => Math.random() - 0.5);
    for (const img of remaining) {
      if (selected.length >= count) break;
      selected.push(img);
    }
  }

  return selected.sort(() => Math.random() - 0.5);
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
  const assets = getSiteAssets();

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
          image_url: d.image_url || assets.serviceShramadanaCampaigns,
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

  if (latestArticles.length === 0 && !isSupabaseConfigured()) {
    latestArticles = getArticles(locale).slice(0, 3);
  }

  // Load approved gallery images (from Supabase or local store) and pick random showcase images
  let allGalleryPhotos: GalleryImage[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("approved", true);

      if (!error && data) {
        allGalleryPhotos = data.map((d) => ({
          id: d.id,
          src: d.src,
          altKey: d.caption,
          captionKey: d.caption,
          category: d.category,
          date: d.date,
          location: d.location,
          width: 1200,
          height: 800,
          blurDataURL: DEFAULT_BLUR,
          approved: d.approved,
        }));
      }
    } catch {
      allGalleryPhotos = getApprovedGalleryImages();
    }
  } else {
    allGalleryPhotos = getApprovedGalleryImages();
  }

  // Random 5 images from gallery for "Moments of Community Service" showcase
  const showcasePhotos = getRandomGalleryShowcase(allGalleryPhotos, 5);

  // All 7 Core Programs of BJWS
  const coreServices = [
    {
      id: "funeral-assistance",
      title: tServices("service1Title"),
      badge: tServices("service1Badge"),
      desc: tServices("service1Desc"),
      image:
        assets.serviceFuneralAssistance ||
        "/images/gallery/Funeral-Services.jpeg",
      icon: Clock,
      highlightBadge: "24/7 Immediate Response",
    },
    {
      id: "cemetery-maintenance",
      title: tServices("service2Title"),
      badge: tServices("service2Badge"),
      desc: tServices("service2Desc"),
      image:
        assets.serviceCemeteryMaintenance ||
        "/images/gallery/shramadana-02.webp",
      icon: Sparkles,
      highlightBadge: "1.5 Acres Maintained",
    },
    {
      id: "relief-services",
      title: tServices("service3Title"),
      badge: tServices("service3Badge"),
      desc: tServices("service3Desc"),
      image: assets.serviceReliefWelfare,
      icon: HeartHandshake,
      highlightBadge: "Essential Needs Support",
    },
    {
      id: "education-workshops",
      title: tServices("service4Title"),
      badge: tServices("service4Badge"),
      desc: tServices("service4Desc"),
      image: assets.serviceSunnahEducation,
      icon: BookOpen,
      highlightBadge: "Youth Sunnah Seminars",
    },
    {
      id: "shramadana-campaigns",
      title: tServices("service5Title"),
      badge: tServices("service5Badge"),
      desc: tServices("service5Desc"),
      image: assets.serviceShramadanaCampaigns,
      icon: Users,
      highlightBadge: "Community Volunteering",
    },
    {
      id: "orphan-care",
      title: tServices("service6Title"),
      badge: tServices("service6Badge"),
      desc: tServices("service6Desc"),
      image: assets.serviceOrphanCare,
      icon: Heart,
      highlightBadge: "Kafalah Sponsorship",
    },
    {
      id: "disaster-relief",
      title: tServices("service7Title"),
      badge: tServices("service7Badge"),
      desc: tServices("service7Desc"),
      image: assets.serviceDisasterRelief,
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

  // Load active hero slideshow banners directly from DB (no hardcoded fallbacks)
  let heroSlides: HeroBanner[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("hero_banners")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (!error && data) {
        heroSlides = data.map((d) => ({
          id: d.id,
          src: d.src,
          alt: d.alt,
          label: d.label || undefined,
          title: d.title || undefined,
          subtitle: d.subtitle || undefined,
          order_index: d.order_index ?? 0,
          is_active: d.is_active ?? true,
        }));
      } else {
        heroSlides = [];
      }
    } catch {
      heroSlides = [];
    }
  } else {
    heroSlides = [];
  }

  return (
    <>
      <JsonLd data={getOrganizationJsonLd()} />
      <JsonLd data={getServicesJsonLd(locale)} />

      {/* 1. Full-Bleed Photo Hero with Modern Cinematic Slideshow Background */}
      <section className="relative overflow-hidden bg-[#072115] text-white">
        {/* Modern Cinematic Hero Background Slideshow (7 Slides, 5s hold, smooth crossfade & Ken Burns) */}
        <HeroSlideshow slides={heroSlides} intervalMs={5000} />

        {/* Authentic Islamic geometric pattern */}
        <IslamicPattern
          opacity={0.035}
          className="pointer-events-none z-10 text-[#d4a359]"
        />

        {/* Hero Content with Smooth Entrance Reveal */}
        <div className="relative z-20 mx-auto max-w-7xl px-4 pt-20 pb-32 sm:px-6 sm:pt-28 sm:pb-40 lg:px-8 lg:pt-36 lg:pb-44">
          <ScrollReveal variant="fade-up" className="max-w-3xl">
            {/* Eyebrow badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-950/80 px-4 py-1.5 text-xs font-semibold text-[#d4af37] shadow-lg backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d4af37] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4af37]" />
              </span>
              <span className="tracking-wide">{t("heroEyebrow")}</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display text-3xl leading-[1.14] font-bold tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)] sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>

            {/* Mission / Supporting line with Gold Accent Border */}
            <div className="mt-6 border-l-2 border-[#d4af37]/70 py-0.5 pl-4">
              <p className="text-lg leading-relaxed font-medium text-emerald-50 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] sm:text-xl">
                {t("heroMission")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-emerald-100/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:text-base">
                {t("aboutSectionLead")}
              </p>
            </div>

            {/* Two CTAs */}
            <div className="mt-8 flex flex-col items-stretch gap-4 sm:mt-10 sm:flex-row sm:items-center">
              <Link href="/membership" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="group/btn relative inline-flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-md bg-gradient-to-r from-[#d4af37] via-[#c99a45] to-[#b88937] px-7 py-3.5 text-sm font-bold text-[#072015] shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#e5c158] hover:to-[#c99a45] hover:shadow-xl hover:shadow-[#d4af37]/25 sm:w-auto sm:text-base"
                >
                  <span className="pointer-events-none absolute inset-0 h-full w-1/2 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-1000 ease-out group-hover/btn:translate-x-[300%]" />
                  <Users className="h-4 w-4" />
                  <span>{t("joinUsButton")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </Link>

              <Link href="/donate" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 border-white/80 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/20 hover:shadow-md sm:w-auto sm:text-base"
                >
                  <Heart className="h-4 w-4 fill-white/20 text-[#d4af37]" />
                  <span>{t("supportUsButton")}</span>
                </button>
              </Link>
            </div>

            {/* Modern Glassmorphism Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5 border-t border-white/15 pt-5 sm:mt-12 sm:gap-3 sm:pt-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white/95 shadow-sm backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-[#d4af37]" />
                {tCommon("regNo")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white/95 shadow-sm backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-emerald-300" />
                {tCommon("location")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white/95 shadow-sm backdrop-blur-md">
                <Clock className="h-3.5 w-3.5 text-[#d4af37]" />
                {tCommon("foundedYear")}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Overlapping Info Bar with 3 items (Report a Janaza, Become a Member, Relief Services) */}
      <section className="relative z-30 -mt-10 mb-12 sm:-mt-20 sm:mb-16 lg:-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollRevealGroup
            staggerMs={90}
            className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 lg:gap-6"
          >
            {/* Item 1: Report a Janaza (24/7 Immediate Contact 077 622 7323) */}
            <div className="group relative flex h-full flex-1 flex-col justify-between overflow-hidden rounded-xl border border-emerald-700/50 bg-[#0c3121] p-6 text-white shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#c99a45]/60 lg:p-7">
              <IslamicPattern
                opacity={0.05}
                className="pointer-events-none text-[#c99a45]"
              />
              <div className="relative z-10 flex h-full flex-1 flex-col justify-between">
                <div className="flex flex-1 flex-col">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#c99a45] text-[#072015] shadow-sm">
                      <PhoneCall className="h-6 w-6" />
                    </div>
                    <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/20 px-2.5 text-[11px] font-bold tracking-wider text-amber-300 uppercase">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                      24/7 Immediate Hotline
                    </span>
                  </div>

                  <h2 className="font-display line-clamp-2 flex min-h-[3.25rem] items-center text-xl leading-snug font-bold tracking-tight text-white">
                    {t("infoBarItem1Title")}
                  </h2>
                  <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-xs leading-relaxed text-emerald-100/85 sm:text-sm">
                    {t("infoBarItem1Desc")}
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  <a
                    href="tel:+94776227323"
                    className="inline-flex h-11 w-full items-center justify-between rounded-md bg-[#c99a45] px-4 text-xs font-bold text-[#072015] shadow-sm transition-all duration-150 hover:bg-[#b88937] sm:text-sm"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      <span>{t("infoBarItem1Cta")}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Item 2: Become a Member (LKR 50/mo or LKR 500/yr) */}
            <div className="bg-surface text-foreground group relative flex h-full flex-1 flex-col justify-between overflow-hidden rounded-xl border border-[#e6e4dc] p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#124d34]/40 lg:p-7">
              <div className="relative z-10 flex h-full flex-1 flex-col justify-between">
                <div className="flex flex-1 flex-col">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#124d34] text-white shadow-2xs">
                      <Users className="h-6 w-6" />
                    </div>
                    <span className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-[#124d34]/20 bg-[#e8f3ee] px-2.5 text-[11px] font-bold tracking-wider text-[#124d34] uppercase">
                      50+ Members
                    </span>
                  </div>

                  <h2 className="font-display line-clamp-2 flex min-h-[3.25rem] items-center text-xl leading-snug font-bold tracking-tight text-[#0b2e1e]">
                    {t("infoBarItem2Title")}
                  </h2>
                  <p className="text-text-muted mt-2 line-clamp-2 min-h-[2.75rem] text-xs leading-relaxed sm:text-sm">
                    {t("infoBarItem2Desc")}
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  <Link
                    href="/membership"
                    className="inline-flex h-11 w-full items-center justify-between rounded-md bg-[#124d34] px-4 text-xs font-semibold text-white shadow-2xs transition-all duration-150 hover:bg-[#0b2e1e] sm:text-sm"
                  >
                    <span>{t("infoBarItem2Cta")}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Item 3: Relief & Humanitarian Aid */}
            <div className="bg-surface text-foreground group relative flex h-full flex-1 flex-col justify-between overflow-hidden rounded-xl border border-[#e6e4dc] p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#124d34]/40 lg:p-7">
              <div className="relative z-10 flex h-full flex-1 flex-col justify-between">
                <div className="flex flex-1 flex-col">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-amber-300 bg-[#fef3c7] text-[#92400e] shadow-2xs">
                      <HeartHandshake className="h-6 w-6" />
                    </div>
                    <span className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 text-[11px] font-bold tracking-wider text-amber-800 uppercase">
                      Welfare & Relief
                    </span>
                  </div>

                  <h2 className="font-display line-clamp-2 flex min-h-[3.25rem] items-center text-xl leading-snug font-bold tracking-tight text-[#0b2e1e]">
                    {t("infoBarItem3Title")}
                  </h2>
                  <p className="text-text-muted mt-2 line-clamp-2 min-h-[2.75rem] text-xs leading-relaxed sm:text-sm">
                    {t("infoBarItem3Desc")}
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  <Link
                    href="/services"
                    className="inline-flex h-11 w-full items-center justify-between rounded-md border border-[#124d34] px-4 text-xs font-semibold text-[#124d34] transition-all duration-150 hover:bg-[#124d34] hover:text-white sm:text-sm"
                  >
                    <span>{t("infoBarItem3Cta")}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* 3. About Split & Key Leadership Contact Quick-Bar */}
      <section className="relative overflow-hidden border-b border-[#e6e4dc] bg-[#fbfaf6] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Visual Column with 2 Overlapping Real Photos + Badge */}
            <ScrollReveal
              variant="left"
              className="relative pb-10 sm:pb-12 lg:col-span-6"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border-4 border-white bg-[#0b2e1e] shadow-xl">
                <Image
                  src={assets.aboutGhusl}
                  alt="BJWS Executive Committee Leadership and Community Members"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top"
                  priority
                />
              </div>

              <div className="absolute right-1 -bottom-5 aspect-[1280/785] w-[62%] overflow-hidden rounded-xl border-4 border-white bg-white shadow-2xl sm:-right-4 sm:-bottom-8 sm:w-[56%]">
                <Image
                  src={assets.aboutWater}
                  alt="Buhary Janaza Welfare Society Official Registered Signboard Banner"
                  fill
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="object-contain object-center"
                />
              </div>

              <div className="absolute top-3 left-3 z-10 flex items-center gap-2.5 rounded-xl border-2 border-[#c99a45] bg-[#0b2e1e] p-2.5 text-white shadow-xl sm:-top-5 sm:-left-5 sm:gap-3 sm:p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c99a45] text-[#072015] sm:h-9 sm:w-9">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <span className="block text-[9px] font-bold tracking-wider text-[#d4a359] uppercase sm:text-[11px]">
                    {tCommon("foundedYear")}
                  </span>
                  <span className="font-display block text-xs font-bold text-white sm:text-sm">
                    Buhary Mahallah
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Narrative Column */}
            <ScrollReveal variant="right" className="space-y-6 lg:col-span-6">
              <div className="border-primary/20 text-primary inline-flex items-center gap-2 rounded-full border bg-[#e8f3ee] px-3.5 py-1 text-xs font-semibold">
                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                <span>{t("aboutSectionEyebrow")}</span>
              </div>

              <h2 className="font-display text-2xl leading-snug font-bold tracking-tight text-[#0b2e1e] sm:text-4xl">
                {t("aboutSectionTitle")}
              </h2>

              <p className="text-base leading-relaxed font-medium text-[#1c2420] sm:text-lg">
                {t("aboutSectionLead")}
              </p>

              <p className="text-text-muted text-sm leading-relaxed sm:text-base">
                {t("aboutSectionBody")}
              </p>

              <div className="pt-2">
                <Link href="/about">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#124d34] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0b2e1e] hover:shadow"
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
            <div className="rounded-2xl border border-[#0b2e1e]/15 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-4 border-b border-[#0b2e1e]/10 pb-5 sm:flex-row sm:items-center">
                <div>
                  <span className="font-sans text-xs font-bold tracking-wider text-[#c99a45] uppercase">
                    {t("leadershipBarEyebrow")}
                  </span>
                  <h3 className="font-display mt-1 text-xl font-bold text-[#0b2e1e] sm:text-2xl">
                    {t("leadershipBarTitle")}
                  </h3>
                </div>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#124d34] transition-colors hover:text-[#0b2e1e] sm:text-sm"
                >
                  <span>{t("meetFullTeamButton")}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-3 sm:gap-6">
                {keyLeaders.map((leader, idx) => (
                  <div
                    key={idx}
                    className={`flex h-full flex-1 flex-col justify-between rounded-xl p-4 transition-all sm:p-5 ${
                      leader.isEmergency
                        ? "border-2 border-[#c99a45]/60 bg-[#0b2e1e] text-white shadow-md"
                        : "border border-[#e6e4dc] bg-[#fbfaf6] text-[#1c2420]"
                    }`}
                  >
                    <div className="flex flex-1 flex-col">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                            leader.isEmergency
                              ? "bg-[#c99a45] text-[#072015]"
                              : "bg-[#e8f3ee] text-[#124d34]"
                          }`}
                        >
                          {leader.role}
                        </span>
                      </div>
                      <div className="font-display flex min-h-[2.5rem] items-center text-base font-bold sm:text-lg">
                        {leader.name}
                      </div>
                    </div>
                    <a
                      href={`tel:${leader.tel}`}
                      className={`mt-auto inline-flex items-center gap-2 border-t pt-4 text-xs font-bold transition-all sm:text-sm ${
                        leader.isEmergency
                          ? "border-white/10 text-[#d4a359] hover:text-white"
                          : "border-[#e6e4dc] text-[#124d34] hover:text-[#0b2e1e]"
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
      <section className="bg-surface relative overflow-hidden border-b border-[#e6e4dc] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
            <div className="border-primary/20 text-primary mb-3 inline-flex items-center gap-2 rounded-full border bg-[#e8f3ee] px-3.5 py-1 text-xs font-semibold">
              <span className="bg-primary h-1.5 w-1.5 rounded-full" />
              <span>{t("servicesOverviewEyebrow")}</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-4xl">
              {t("servicesOverviewTitle")}
            </h2>
            <p className="text-text-muted mt-3 text-sm leading-relaxed sm:text-base">
              {t("servicesOverviewDesc")}
            </p>
          </ScrollReveal>

          {/* 7 Core Services Responsive Grid */}
          <ScrollRevealGroup
            staggerMs={70}
            className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {coreServices.map((service, idx) => (
              <div
                key={service.id || idx}
                className="group bg-surface hover:border-primary/40 flex h-full flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-[#e6e4dc] shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Photo with Aspect Ratio for Zero CLS */}
                <div className="bg-muted relative aspect-[16/10] shrink-0 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-md bg-[#0b2e1e]/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#d4a359] uppercase backdrop-blur-xs">
                    {service.badge}
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                    {service.highlightBadge}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-display group-hover:text-primary line-clamp-2 flex min-h-[3.25rem] items-center text-base leading-snug font-bold text-[#0b2e1e] transition-colors sm:text-lg">
                      {service.title}
                    </h3>
                    <p className="text-text-muted mt-2 line-clamp-3 min-h-[4.25rem] text-xs leading-relaxed sm:text-sm">
                      {service.desc}
                    </p>
                  </div>

                  <div className="mt-auto border-t border-[#e6e4dc]/60 pt-5">
                    <Link
                      href="/services"
                      className="text-primary hover:text-primary-hover group/link inline-flex h-9 items-center gap-1.5 text-xs font-semibold sm:text-sm"
                    >
                      <span>{tCommon("learnMore")}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </ScrollRevealGroup>

          {/* Direct CTA to Services Page */}
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b2e1e] px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#12422c] hover:shadow-lg"
            >
              <span>{t("servicesViewAll")}</span>
              <ArrowRight className="h-4 w-4 text-[#d4af37]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Impact Band (Counters & Community Milestones) */}
      <section className="relative overflow-hidden border-b border-emerald-950 bg-[#072115] py-16 text-white sm:py-24">
        <IslamicPattern
          opacity={0.05}
          className="pointer-events-none text-[#d4a359]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-4 py-1 text-xs font-semibold text-[#d4a359]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4a359]" />
              <span>{t("statsBandEyebrow")}</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
              {t("statsBandTitle")}
            </h2>
          </div>

          <ScrollRevealGroup
            staggerMs={80}
            className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {/* Stat 1: Funerals Arranged */}
            <div className="group relative flex h-full flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xs transition-all duration-300 hover:border-[#d4a359]/40 hover:bg-white/[0.07] sm:p-6">
              <div className="flex flex-1 flex-col">
                <div className="font-display text-2xl font-bold tracking-tight text-[#d4a359] sm:text-3xl">
                  <AnimatedCounter value={100} suffix="+" />
                </div>
                <h3 className="mt-2 flex min-h-[2.5rem] items-center text-sm font-semibold tracking-tight text-white sm:text-base">
                  {t("statFuneralsLabel")}
                </h3>
              </div>
              <p className="mt-auto border-t border-white/10 pt-3 text-xs leading-relaxed text-emerald-200/70">
                {t("statFuneralsDesc")}
              </p>
            </div>

            {/* Stat 2: Active Members */}
            <div className="group relative flex h-full flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xs transition-all duration-300 hover:border-[#d4a359]/40 hover:bg-white/[0.07] sm:p-6">
              <div className="flex flex-1 flex-col">
                <div className="font-display text-2xl font-bold tracking-tight text-[#d4a359] sm:text-3xl">
                  <AnimatedCounter value={20} suffix="+" />
                </div>
                <h3 className="mt-2 flex min-h-[2.5rem] items-center text-sm font-semibold tracking-tight text-white sm:text-base">
                  {t("statMembersLabel")}
                </h3>
              </div>
              <p className="mt-auto border-t border-white/10 pt-3 text-xs leading-relaxed text-emerald-200/70">
                {t("statMembersDesc")}
              </p>
            </div>

            {/* Stat 3: Essential Needs Aid */}
            <div className="group relative flex h-full flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xs transition-all duration-300 hover:border-[#d4a359]/40 hover:bg-white/[0.07] sm:p-6">
              <div className="flex flex-1 flex-col">
                <div className="font-display truncate text-2xl font-bold tracking-tight text-[#d4a359] sm:text-3xl">
                  {t("statRationsValue")}
                </div>
                <h3 className="mt-2 flex min-h-[2.5rem] items-center text-sm font-semibold tracking-tight text-white sm:text-base">
                  {t("statRationsLabel")}
                </h3>
              </div>
              <p className="mt-auto border-t border-white/10 pt-3 text-xs leading-relaxed text-emerald-200/70">
                {t("statRationsDesc")}
              </p>
            </div>

            {/* Stat 4: Cemetery Renovated */}
            <div className="group relative flex h-full flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xs transition-all duration-300 hover:border-[#d4a359]/40 hover:bg-white/[0.07] sm:p-6">
              <div className="flex flex-1 flex-col">
                <div className="font-display text-2xl font-bold tracking-tight text-[#d4a359] sm:text-3xl">
                  <AnimatedCounter
                    value={1.5}
                    decimals={1}
                    suffix={
                      locale === "ta"
                        ? " ஏக்கர்"
                        : locale === "si"
                          ? " අක්කර"
                          : " Acres"
                    }
                  />
                </div>
                <h3 className="mt-2 flex min-h-[2.5rem] items-center text-sm font-semibold tracking-tight text-white sm:text-base">
                  {t("statCemeteryLabel")}
                </h3>
              </div>
              <p className="mt-auto border-t border-white/10 pt-3 text-xs leading-relaxed text-emerald-200/70">
                {t("statCemeteryDesc")}
              </p>
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* 6. Dynamic Latest News & Community Bulletins */}
      <section className="relative overflow-hidden border-b border-[#e6e4dc] bg-[#fbfaf6] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:mb-16 sm:flex-row sm:items-end">
            <div>
              <div className="border-primary/20 text-primary mb-3 inline-flex items-center gap-2 rounded-full border bg-[#e8f3ee] px-3.5 py-1 text-xs font-semibold">
                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                <span>{t("newsTeaserEyebrow")}</span>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-4xl">
                {t("newsTeaserTitle")}
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
                {t("newsTeaserDesc")}
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#e8f3ee] px-5 py-2.5 text-xs font-semibold text-[#124d34] transition-colors duration-200 hover:bg-[#124d34] hover:text-white sm:text-sm"
            >
              <span>{t("viewAllNewsButton")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {latestArticles.length === 0 ? (
            <div className="rounded-2xl border border-[#e6e4dc] bg-white p-8 text-center text-xs text-[#6b7280]">
              {t("noArticlesYet")}
            </div>
          ) : (
            <ScrollRevealGroup
              staggerMs={80}
              className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-8"
            >
              {latestArticles.map((article) => {
                const formattedDate = new Date(
                  article.published_at
                ).toLocaleDateString(
                  locale === "ta"
                    ? "ta-LK"
                    : locale === "si"
                      ? "si-LK"
                      : "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                );

                return (
                  <article
                    key={article.id}
                    className="group bg-surface hover:border-primary/40 flex h-full flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-[#e6e4dc] shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="bg-muted relative aspect-[16/10] shrink-0 overflow-hidden">
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 rounded-md bg-[#c99a45] px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#072015] uppercase">
                        {article.categoryLabel[locale as "en" | "ta" | "si"] ||
                          article.category}
                      </span>
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
                        <Calendar className="h-3 w-3 text-[#d4a359]" />
                        <span>{formattedDate}</span>
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                      <div className="flex flex-1 flex-col">
                        <h3 className="font-display group-hover:text-primary line-clamp-2 flex min-h-[3.25rem] items-center text-lg leading-snug font-bold text-[#0b2e1e] transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-text-muted mt-2 line-clamp-3 min-h-[3.75rem] text-xs leading-relaxed sm:text-sm">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-[#e6e4dc] pt-4">
                        <span className="text-[11px] font-medium text-[#6b7280]">
                          {article.read_time_minutes} min read
                        </span>
                        <Link
                          href={`/news/${article.slug}`}
                          className="text-primary hover:text-primary-hover group/link inline-flex items-center gap-1.5 text-xs font-semibold sm:text-sm"
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
          )}
        </div>
      </section>

      {/* 7. Support, Membership & Official BOC Bank Details Section */}
      <section className="relative overflow-hidden bg-[#072115] py-20 text-white sm:py-28">
        <div className="absolute inset-0 z-0">
          <Image
            src={assets.cemeteryVolunteers}
            alt="BJWS Community Volunteers"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#062115]/95 via-[#0b2e1e]/90 to-[#062115]/95" />
        </div>

        <IslamicPattern
          opacity={0.035}
          className="pointer-events-none z-10 text-[#d4a359]"
        />

        <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="scale" className="text-center">
            <p className="font-display mx-auto mb-4 max-w-2xl text-xs tracking-wide text-[#d4a359] italic sm:text-sm">
              {t("ctaQuote")}
            </p>

            <h2 className="font-display text-2xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("ctaTitle")}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-emerald-100/90 sm:text-base lg:text-lg">
              {t("ctaDesc")}
            </p>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/membership" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#c99a45] px-8 py-3.5 text-sm font-bold text-[#072015] shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b88937] sm:w-auto sm:text-base"
                >
                  <Users className="h-4 w-4" />
                  <span>{t("ctaJoinButton")}</span>
                </button>
              </Link>

              <Link href="/donate" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-white/80 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white shadow-sm backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white/20 sm:w-auto sm:text-base"
                >
                  <Heart className="h-4 w-4 fill-white/20" />
                  <span>{t("ctaDonateButton")}</span>
                </button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Official Bank of Ceylon (BOC) Direct Deposit Card */}
          <ScrollReveal variant="fade-up" className="mt-14 sm:mt-16">
            <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-950/80 p-6 shadow-2xl backdrop-blur-md sm:p-8">
              <div className="flex flex-col justify-between gap-6 border-b border-emerald-800/60 pb-6 lg:flex-row lg:items-center">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#c99a45] text-[#072015]">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-wider text-[#d4a359] uppercase">
                      Direct Support Channel
                    </span>
                    <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                      {t("bankTransferTitle")}
                    </h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-900/60 px-3.5 py-1 text-xs text-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#d4a359]" />
                  <span>Verified Official Account</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 items-stretch gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex h-full flex-1 flex-col justify-between rounded-xl border border-emerald-800/40 bg-black/25 p-4">
                  <span className="block text-[11px] font-medium tracking-wider text-emerald-300/80 uppercase">
                    {t("bankNameLabel")}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-white">
                    {t("bankNameValue")}
                  </span>
                </div>

                <div className="flex h-full flex-1 flex-col justify-between rounded-xl border border-emerald-800/40 bg-black/25 p-4">
                  <span className="block text-[11px] font-medium tracking-wider text-emerald-300/80 uppercase">
                    {t("branchLabel")}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-white">
                    {t("branchValue")}
                  </span>
                </div>

                <div className="flex h-full flex-1 flex-col justify-between rounded-xl border border-[#c99a45]/50 bg-[#c99a45]/10 bg-black/25 p-4">
                  <span className="block text-[11px] font-medium tracking-wider text-[#d4a359] uppercase">
                    {t("accountNoLabel")}
                  </span>
                  <span className="mt-1 block font-mono text-base font-bold tracking-wider text-white">
                    90941571
                  </span>
                </div>

                <div className="flex h-full flex-1 flex-col justify-between rounded-xl border border-emerald-800/40 bg-black/25 p-4">
                  <span className="block text-[11px] font-medium tracking-wider text-emerald-300/80 uppercase">
                    {t("accountNameLabel")}
                  </span>
                  <span className="mt-1 block text-xs leading-snug font-bold text-white">
                    {t("accountNameValue")}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-emerald-800/40 pt-4 text-xs text-emerald-200/80">
                <p>{t("bankTransferDesc")}</p>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-1.5 font-bold text-[#d4a359] transition-colors hover:text-white"
                >
                  <span>Bank Slip & Donation Guidelines</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Quick contact helpline link */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-emerald-800/40 pt-6 text-xs text-emerald-200/80">
            <a
              href="tel:+94776227323"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone className="h-3.5 w-3.5 text-[#c99a45]" />
              <span>24/7 Hotline: 077 622 7323</span>
            </a>
            <span>•</span>
            <a
              href="mailto:bjwsociety@gmail.com"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Mail className="h-3.5 w-3.5 text-emerald-300" />
              <span>bjwsociety@gmail.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. Photographic Documentation Strip */}
      <section className="bg-surface relative overflow-hidden border-b border-[#e6e4dc] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#c99a45] uppercase">
                <Camera className="h-3.5 w-3.5" />
                <span>Photographic Documentation</span>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                Moments of Community Service
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-md bg-[#e8f3ee] px-4 py-2 text-xs font-semibold text-[#124d34] transition-colors duration-200 hover:bg-[#124d34] hover:text-white sm:text-sm"
            >
              <span>{t("viewGalleryButton")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 5-Photo Showcase Strip (Dynamic Random Selection from Gallery) */}
          <ScrollRevealGroup
            staggerMs={50}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
          >
            {showcasePhotos.map((photo, i) => (
              <Link
                key={photo.id || photo.src || i}
                href="/gallery"
                className={`group bg-muted relative block overflow-hidden rounded-xl border border-[#e6e4dc] shadow-2xs ${
                  i === 4
                    ? "col-span-2 aspect-[2/1] sm:col-span-1 sm:aspect-[4/5] lg:col-span-1"
                    : "aspect-square sm:aspect-[4/5]"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={
                    photo.captionKey ||
                    photo.altKey ||
                    "Community Service Photo"
                  }
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-[#d4a359] uppercase">
                    <Tag className="h-3 w-3 shrink-0" />
                    <span>{formatCategoryLabel(photo.category)}</span>
                  </div>
                  <span className="line-clamp-2 text-xs leading-tight font-semibold">
                    {photo.captionKey || photo.altKey}
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
