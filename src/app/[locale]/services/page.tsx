import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata } from "@/lib/seo";
import {
  JsonLd,
  getBreadcrumbJsonLd,
  getServicesJsonLd,
} from "@/components/seo/json-ld";

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

  const programs = [
    {
      title: t("service1Title"),
      badge: t("service1Badge"),
      desc: t("service1Desc"),
      icon: (
        <svg
          className="text-primary h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      items: [
        t("service1Item1"),
        t("service1Item2"),
        t("service1Item3"),
        t("service1Item4"),
        t("service1Item5"),
      ],
    },
    {
      title: t("service2Title"),
      badge: t("service2Badge"),
      desc: t("service2Desc"),
      icon: (
        <svg
          className="text-primary h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      items: [
        t("service2Item1"),
        t("service2Item2"),
        t("service2Item3"),
        t("service2Item4"),
        t("service2Item5"),
      ],
    },
    {
      title: t("service3Title"),
      badge: t("service3Badge"),
      desc: t("service3Desc"),
      icon: (
        <svg
          className="text-primary h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      items: [
        t("service3Item1"),
        t("service3Item2"),
        t("service3Item3"),
        t("service3Item4"),
      ],
    },
    {
      title: t("service4Title"),
      badge: t("service4Badge"),
      desc: t("service4Desc"),
      icon: (
        <svg
          className="text-primary h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      items: [
        t("service4Item1"),
        t("service4Item2"),
        t("service4Item3"),
        t("service4Item4"),
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

      <div className="py-12 sm:py-16">
        <Container size="xl">
          {/* Programs Grid */}
          <div className="space-y-10">
            {programs.map((program, idx) => (
              <Card key={idx} className="p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                  {/* Left column: Header & Description */}
                  <div className="max-w-xl">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="rounded-xl bg-[#e8f3ee] p-2.5"
                        aria-hidden="true"
                      >
                        {program.icon}
                      </div>
                      <Badge variant="primary">{program.badge}</Badge>
                    </div>

                    <CardTitle as="h2" className="mb-3 text-2xl sm:text-3xl">
                      {program.title}
                    </CardTitle>

                    <CardDescription className="text-text-muted text-base leading-relaxed">
                      {program.desc}
                    </CardDescription>

                    <div className="mt-6 hidden lg:block">
                      <Link href="/contact">
                        <Button variant="outline" size="sm">
                          Inquire About This Service →
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right column: Actionable Checklist */}
                  <div className="bg-surface-muted border-border rounded-xl border p-6 lg:w-1/2">
                    <h3 className="text-text-muted mb-4 text-xs font-semibold tracking-wider uppercase">
                      Key Activities & Operational Scope
                    </h3>
                    <ul className="text-text space-y-3 text-sm">
                      {program.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-3">
                          <span className="text-primary mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8f3ee] text-xs font-bold">
                            ✓
                          </span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Emergency Callout Card */}
          <div className="bg-surface border-primary/20 mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border p-8 shadow-xs sm:flex-row sm:p-10">
            <div>
              <Badge variant="primary" size="sm" className="mb-2">
                {tCommon("emergencyBadge")}
              </Badge>
              <h2 className="text-text text-xl font-bold sm:text-2xl">
                Immediate Funeral Coordination Needed?
              </h2>
              <p className="text-text-muted mt-1 text-sm">
                Our funeral management team is on call round the clock to
                support families upon bereavement.
              </p>
            </div>
            <Link href="/contact" className="w-full shrink-0 sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Contact Funeral Team
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
