import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { buildPageMetadata } from "@/lib/seo";
import {
  JsonLd,
  getBreadcrumbJsonLd,
  getServicesJsonLd,
} from "@/components/seo/json-ld";
import {
  Clock,
  HeartHandshake,
  BookOpen,
  Sparkles,
  PhoneCall,
  ArrowRight,
  Check,
  ShieldCheck,
  Users,
  Heart,
  LifeBuoy,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/services",
    locale,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("servicesPage");
  const tCommon = await getTranslations("common");

  const services = [
    {
      id: "funeral-services",
      badge: t("service1Badge"),
      title: t("service1Title"),
      desc: t("service1Desc"),
      icon: Clock,
      image: "/images/gallery/ghusl-02.webp",
      imageAlt: "BJWS Ritual Ghusl and Kafan Services",
      imageBadge: "24/7 Response Available",
      reverse: false,
      isEmergency: true,
      items: [
        t("service1Item1"),
        t("service1Item2"),
        t("service1Item3"),
        t("service1Item4"),
        t("service1Item5"),
      ],
    },
    {
      id: "cemetery-maintenance",
      badge: t("service2Badge"),
      title: t("service2Title"),
      desc: t("service2Desc"),
      icon: Sparkles,
      image: "/images/gallery/shramadana-02.webp",
      imageAlt: "Mahallah Cemetery Shramadhana Clean-Up",
      imageBadge: "1.5 Acres Under Care",
      reverse: true,
      isEmergency: false,
      items: [
        t("service2Item1"),
        t("service2Item2"),
        t("service2Item3"),
        t("service2Item4"),
        t("service2Item5"),
      ],
    },
    {
      id: "ration-distribution",
      badge: t("service3Badge"),
      title: t("service3Title"),
      desc: t("service3Desc"),
      icon: HeartHandshake,
      image: "/images/gallery/iftar-01.webp",
      imageAlt: "BJWS Monthly Dry Ration and Food Welfare",
      imageBadge: "750+ Families Supported",
      reverse: false,
      isEmergency: false,
      items: [
        t("service3Item1"),
        t("service3Item2"),
        t("service3Item3"),
        t("service3Item4"),
      ],
    },
    {
      id: "education-workshops",
      badge: t("service4Badge"),
      title: t("service4Title"),
      desc: t("service4Desc"),
      icon: BookOpen,
      image: "/images/gallery/ghusl-01.webp",
      imageAlt: "Youth and Volunteer Funeral Training Seminar",
      imageBadge: "Sunnah Education",
      reverse: true,
      isEmergency: false,
      items: [
        t("service4Item1"),
        t("service4Item2"),
        t("service4Item3"),
        t("service4Item4"),
      ],
    },
    {
      id: "shramadana-campaigns",
      badge: t("service5Badge"),
      title: t("service5Title"),
      desc: t("service5Desc"),
      icon: Users,
      image: "/images/gallery/shramadana-01.webp",
      imageAlt: "BJWS Community Shramadana and Environmental Cleanliness Campaign",
      imageBadge: "Community Shramadana",
      reverse: false,
      isEmergency: false,
      items: [
        t("service5Item1"),
        t("service5Item2"),
        t("service5Item3"),
        t("service5Item4"),
      ],
    },
    {
      id: "orphan-care",
      badge: t("service6Badge"),
      title: t("service6Title"),
      desc: t("service6Desc"),
      icon: Heart,
      image: "/images/gallery/livelihood-01.webp",
      imageAlt: "BJWS Orphan Support and Vulnerable Household Care",
      imageBadge: "Kafalah Care",
      reverse: true,
      isEmergency: false,
      items: [
        t("service6Item1"),
        t("service6Item2"),
        t("service6Item3"),
        t("service6Item4"),
      ],
    },
    {
      id: "disaster-relief",
      badge: t("service7Badge"),
      title: t("service7Title"),
      desc: t("service7Desc"),
      icon: LifeBuoy,
      image: "/images/gallery/water-concrete-01.webp",
      imageAlt: "BJWS Emergency Flood and Disaster Relief Response",
      imageBadge: "Crisis Response",
      reverse: false,
      isEmergency: false,
      items: [
        t("service7Item1"),
        t("service7Item2"),
        t("service7Item3"),
        t("service7Item4"),
      ],
    },
  ];

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/services" },
          ],
          locale
        )}
      />
      <JsonLd data={getServicesJsonLd(locale)} />

      {/* Hero Page Header */}
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        eyebrow={t("eyebrow")}
        imageSrc="/images/gallery/ghusl-02.webp"
        imageAlt="BJWS Community Funeral Services & Welfare Programs"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      {/* Main Services Alternating Showcase */}
      <section className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          <div className="space-y-16 sm:space-y-24">
            {services.map((svc, index) => {
              const Icon = svc.icon;
              return (
                <ScrollReveal
                  key={svc.id}
                  id={svc.id}
                  as="article"
                  variant={svc.reverse ? "left" : "right"}
                  className={`scroll-mt-24 rounded-3xl border border-[#0b2e1e]/10 bg-white p-6 sm:p-10 lg:p-12 shadow-sm transition-all duration-300 hover:shadow-md ${
                    svc.isEmergency ? "ring-2 ring-[#0b2e1e]/15" : ""
                  }`}
                >
                  <div
                    className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 ${
                      svc.reverse ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    {/* Visual Media Column */}
                    <div className="lg:col-span-5">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#0b2e1e]/10 bg-[#0b2e1e]/5 shadow-sm">
                        <Image
                          src={svc.image}
                          alt={svc.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        {/* Floating Status / Key Stat Badge */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b2e1e]/90 px-3.5 py-1.5 text-xs font-semibold text-[#fbfaf6] shadow-md backdrop-blur-xs">
                            <span className="h-2 w-2 rounded-full bg-[#d4af37]" />
                            {svc.imageBadge}
                          </span>
                          <span className="font-mono text-xs font-bold text-white/80">
                            0{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content & Operational Checklist Column */}
                    <div className="lg:col-span-7">
                      {/* Eyebrow & Category */}
                      <div className="mb-3 flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ee] px-3 py-1 text-xs font-semibold text-[#0b2e1e]">
                          <Icon className="h-3.5 w-3.5 text-[#0b2e1e]" strokeWidth={2} />
                          {svc.badge}
                        </span>
                        {svc.isEmergency && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-700">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
                            24/7 Active
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                        {svc.title}
                      </h2>

                      {/* Description */}
                      <p className="mt-3 text-base leading-relaxed text-[#4b5563]">
                        {svc.desc}
                      </p>

                      {/* Operational Checklist Box */}
                      <div className="mt-6 rounded-2xl border border-[#0b2e1e]/10 bg-[#fbfaf6] p-5 sm:p-6">
                        <div className="mb-3.5 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-[#0b2e1e]" strokeWidth={2} />
                          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#0b2e1e]">
                            {t("operationalScope")}
                          </h3>
                        </div>
                        <ul className="space-y-2.5">
                          {svc.items.map((item, itemIdx) => (
                            <li
                              key={itemIdx}
                              className="flex items-start gap-3 text-sm text-[#2d3748]"
                            >
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0b2e1e] text-[10px] font-bold text-[#d4af37]">
                                <Check className="h-3 w-3" strokeWidth={2.5} />
                              </span>
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Links */}
                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        {svc.isEmergency ? (
                          <a
                            href="tel:0776227323"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#0b2e1e] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#12422c]"
                          >
                            <PhoneCall className="h-4 w-4 text-[#d4af37]" />
                            {t("callEmergency")}: 077 622 7323
                          </a>
                        ) : null}
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#0b2e1e]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b2e1e] shadow-2xs transition-colors hover:bg-[#e8f3ee]"
                        >
                          {t("inquireService")}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Emergency Callout Card Banner */}
          <ScrollReveal variant="scale" className="relative mt-20 overflow-hidden rounded-3xl bg-[#0b2e1e] p-8 text-white shadow-xl sm:p-12 lg:p-14">
            <IslamicPattern
              className="pointer-events-none absolute inset-0 text-white"
              opacity={0.04}
              id="services-emergency-pattern"
            />
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-3 py-1 text-xs font-semibold text-[#d4af37]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#d4af37]" />
                  {tCommon("emergencyBadge")}
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {t("emergencyTitle")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#fbfaf6]/85 sm:text-base">
                  {t("emergencyDesc")}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href="tel:0776227323"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#d4af37] px-6 py-3.5 text-base font-bold text-[#0b2e1e] shadow-md transition-all hover:bg-[#b8952b]"
                >
                  <PhoneCall className="h-5 w-5" />
                  077 622 7323
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/20"
                >
                  {t("contactCommittee")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
