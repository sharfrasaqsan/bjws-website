import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";

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
      badge: "28 Janazahs Completed",
      items: [
        t("categoryFuneralItem1"),
        t("categoryFuneralItem2"),
        t("categoryFuneralItem3"),
      ],
      icon: (
        <svg
          className="text-primary h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: t("categoryMembershipTitle"),
      badge: "300+ Members",
      items: [t("categoryMembershipItem1"), t("categoryMembershipItem2")],
      icon: (
        <svg
          className="text-primary h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: t("categoryCemeteryTitle"),
      badge: "1.5 Acres Renovated",
      items: [
        t("categoryCemeteryItem1"),
        t("categoryCemeteryItem2"),
        t("categoryCemeteryItem3"),
      ],
      icon: (
        <svg
          className="text-primary h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
          />
        </svg>
      ),
    },
    {
      title: t("categoryWelfareTitle"),
      badge: "750+ Dry Rations",
      items: [t("categoryWelfareItem1"), t("categoryWelfareItem2")],
      icon: (
        <svg
          className="text-primary h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      title: t("categoryEducationTitle"),
      badge: "4 Workshops & 2 Events",
      items: [t("categoryEducationItem1"), t("categoryEducationItem2")],
      icon: (
        <svg
          className="text-primary h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
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

      <div className="py-12 sm:py-16">
        <Container size="xl">
          {/* Achievements by Category */}
          <div className="mb-20">
            <div className="mb-8">
              <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                Section 8
              </span>
              <h2 className="text-text mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Verified Achievements (2023 – 2025)
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {achievementCategories.map((cat, idx) => (
                <Card key={idx} className="flex flex-col justify-between">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div
                        className="rounded-lg bg-[#e8f3ee] p-2"
                        aria-hidden="true"
                      >
                        {cat.icon}
                      </div>
                      <Badge variant="primary" size="sm">
                        {cat.badge}
                      </Badge>
                    </div>
                    <CardTitle as="h3" className="text-xl">
                      {cat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-text-muted space-y-2.5 text-sm">
                      {cat.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2">
                          <span className="text-primary font-bold select-none">
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Future Goals Roadmap / Timeline */}
          <Section
            variant="surface"
            title={t("goalsTitle")}
            eyebrow={t("goalsEyebrow")}
            description={t("goalsDesc")}
            className="rounded-2xl"
          >
            <div className="border-primary/30 relative my-6 space-y-12 border-l-2 pl-6 sm:pl-8">
              {/* Timeline Item 1: Short Term */}
              <div className="relative">
                {/* Dot */}
                <div className="border-primary bg-surface absolute top-1.5 -left-[31px] h-4 w-4 rounded-full border-2 sm:-left-[39px]" />

                <div className="bg-surface border-border rounded-xl border p-6 shadow-2xs">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-text text-xl font-bold">
                      {t("shortTermTitle")}
                    </h3>
                    <Badge variant="primary">Year 1 Milestones</Badge>
                  </div>

                  <ul className="text-text grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    {shortTermGoals.map((goal, idx) => (
                      <li
                        key={idx}
                        className="bg-surface-muted flex items-start gap-2.5 rounded-lg p-3"
                      >
                        <span className="text-primary font-bold">✓</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Timeline Item 2: Long Term */}
              <div className="relative">
                {/* Dot */}
                <div className="border-accent bg-surface absolute top-1.5 -left-[31px] h-4 w-4 rounded-full border-2 sm:-left-[39px]" />

                <div className="bg-surface border-border rounded-xl border p-6 shadow-2xs">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-text text-xl font-bold">
                      {t("longTermTitle")}
                    </h3>
                    <Badge variant="accent">Vision Horizon (3–5 Years)</Badge>
                  </div>

                  <ul className="text-text grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    {longTermGoals.map((goal, idx) => (
                      <li
                        key={idx}
                        className="bg-surface-muted flex items-start gap-2.5 rounded-lg p-3"
                      >
                        <span className="text-accent font-bold">★</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Section>
        </Container>
      </div>
    </>
  );
}
