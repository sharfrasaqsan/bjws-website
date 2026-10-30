import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import {
  Clock,
  Users,
  Sparkles,
  HeartHandshake,
  BookOpen,
  Check,
  Calendar,
  Target,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "achievementsPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/achievements",
    locale,
  });
}

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("achievementsPage");
  const tCommon = await getTranslations("common");

  const achievementCategories = [
    {
      title: t("categoryFuneralTitle"),
      metric: "28",
      metricLabel: "Janazas Completed",
      items: [
        t("categoryFuneralItem1"),
        t("categoryFuneralItem2"),
        t("categoryFuneralItem3"),
      ],
      icon: Clock,
    },
    {
      title: t("categoryMembershipTitle"),
      metric: "300+",
      metricLabel: "Active Members",
      items: [t("categoryMembershipItem1"), t("categoryMembershipItem2")],
      icon: Users,
    },
    {
      title: t("categoryCemeteryTitle"),
      metric: "1.5",
      metricLabel: "Acres Renovated",
      items: [
        t("categoryCemeteryItem1"),
        t("categoryCemeteryItem2"),
        t("categoryCemeteryItem3"),
      ],
      icon: Sparkles,
    },
    {
      title: t("categoryWelfareTitle"),
      metric: "750+",
      metricLabel: "Rations Distributed",
      items: [t("categoryWelfareItem1"), t("categoryWelfareItem2")],
      icon: HeartHandshake,
    },
    {
      title: t("categoryEducationTitle"),
      metric: "4",
      metricLabel: "Workshops & Events",
      items: [t("categoryEducationItem1"), t("categoryEducationItem2")],
      icon: BookOpen,
    },
  ];

  const shortTermGoals = [
    t("shortTerm1"),
    t("shortTerm2"),
    t("shortTerm3"),
    t("shortTerm4"),
  ];

  const longTermGoals = [
    t("longTerm1"),
    t("longTerm2"),
    t("longTerm3"),
    t("longTerm4"),
  ];

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/achievements" },
          ],
          locale
        )}
      />
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        eyebrow={t("eyebrow")}
        imageSrc="/images/gallery/shramadana-02.webp"
        imageAlt="BJWS Verified Community Milestones & Achievements"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          {/* Section 1: Verified Achievements by Category (Deduplicated Integrated Dashboard) */}
          <div className="mb-20">
            <div className="mb-10 text-center sm:text-left">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                Accountability & Verified Milestones
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl lg:text-4xl">
                Verified Community Achievements (2023 – 2025)
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4b5563] sm:text-base">
                Tangible milestones achieved through community shura consultation, volunteer labor, and transparent donor contributions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {achievementCategories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <article
                    key={idx}
                    className="flex flex-col justify-between rounded-3xl border border-[#0b2e1e]/10 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0b2e1e]/25 hover:shadow-md"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#0b2e1e]/10 pb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f3ee] text-[#0b2e1e]">
                          <Icon className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <div className="text-right">
                          <span className="block font-display text-2xl font-bold text-[#0b2e1e]">
                            {cat.metric}
                          </span>
                          <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#b8952b]">
                            {cat.metricLabel}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-display text-xl font-bold text-[#0b2e1e]">
                        {cat.title}
                      </h3>
                      <ul className="mt-4 space-y-2.5 text-sm text-[#4b5563]">
                        {cat.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2.5">
                            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2e1e] text-[9px] font-bold text-[#d4af37]">
                              ✓
                            </span>
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Section 2: Future Goals Roadmap / Strategic Timeline */}
          <div className="space-y-12">
            <div className="text-center sm:text-left">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                {t("goalsEyebrow")}
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl lg:text-4xl">
                {t("goalsTitle")}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4b5563] sm:text-base">
                {t("goalsDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Short Term Goals Card */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 sm:p-10 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#0b2e1e]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#0b2e1e]">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#0b2e1e]">
                        {t("shortTermTitle")}
                      </h3>
                      <div className="text-xs text-[#6b7280]">Next 12 Months Priority</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#e8f3ee] px-3 py-1 text-xs font-semibold text-[#0b2e1e]">
                    Phase 1
                  </span>
                </div>

                <ul className="space-y-3.5">
                  {shortTermGoals.map((goal, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl border border-[#0b2e1e]/10 bg-[#fbfaf6] p-4 text-sm font-medium text-[#2d3748]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0b2e1e] text-[10px] font-bold text-[#d4af37]">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span className="leading-relaxed">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Long Term Goals Card */}
              <div className="relative overflow-hidden rounded-3xl bg-[#0b2e1e] p-8 text-white shadow-xl sm:p-10">
                <IslamicPattern
                  className="pointer-events-none absolute inset-0 text-white"
                  opacity={0.04}
                  id="achievements-roadmap-pattern"
                />
                <div className="relative z-10">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-t-0 border-b border-white/15 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/20 text-[#d4af37]">
                        <Target className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-white">
                          {t("longTermTitle")}
                        </h3>
                        <div className="text-xs text-[#fbfaf6]/70">Vision Horizon (Next 3–5 Years)</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#d4af37] px-3 py-1 text-xs font-bold text-[#0b2e1e]">
                      Phase 2
                    </span>
                  </div>

                  <ul className="space-y-3.5">
                    {longTermGoals.map((goal, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-medium text-[#fbfaf6] backdrop-blur-xs"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d4af37] text-[10px] font-bold text-[#0b2e1e]">
                          ★
                        </span>
                        <span className="leading-relaxed">{goal}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 border-t border-white/15 pt-6">
                    <Link
                      href="/donate"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37] hover:underline"
                    >
                      Support These Long-Term Projects
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
