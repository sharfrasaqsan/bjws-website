import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { NoticesSection } from "@/components/sections/notices-section";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";

// Incremental Static Regeneration (ISR) every hour
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reportsPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/reports",
    locale,
  });
}

interface ReportItem {
  id: string;
  title: string;
  year: number;
  file_path: string;
  file_size: string | null;
}

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("reportsPage");
  const tCommon = await getTranslations("common");

  let reports: ReportItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("reports")
        .select("id, title, year, file_path, file_size")
        .eq("is_published", true)
        .order("year", { ascending: false });

      if (!error && data) {
        reports = data;
      }
    } catch (err) {
      console.warn("Could not fetch reports from Supabase:", err);
    }
  }

  // Verified reports from Profile Book Section 11 (Financial Overview & Transparency)
  if (reports.length === 0) {
    reports = [
      {
        id: "rep-2024",
        title: "Annual Activities & Financial Summary Report 2024",
        year: 2024,
        file_path: "/documents/reports/bjws-annual-report-2024.pdf",
        file_size: "1.8 MB",
      },
      {
        id: "rep-2023",
        title: "Foundational Activities & Welfare Overview 2023",
        year: 2023,
        file_path: "/documents/reports/bjws-annual-report-2023.pdf",
        file_size: "1.4 MB",
      },
    ];
  }

  const noticeTranslations = {
    sectionTitle: t("noticesTitle"),
    sectionEyebrow: t("noticesEyebrow"),
    sectionSubtitle: t("noticesSubtitle"),
    emptyMessage: t("noticesEmpty"),
    noticeBadge: t("noticesBadge"),
  };

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/reports" },
          ],
          locale
        )}
      />
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        eyebrow={t("eyebrow")}
        imageSrc="/images/gallery/shramadana-02.webp"
        imageAlt="BJWS Transparency & Governance Reports"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="py-12 sm:py-16">
        <Container size="xl">

          {/* Financial Transparency Declaration */}
          <div className="bg-surface border-border mb-12 rounded-xl border p-6 shadow-2xs">
            <h2 className="text-text mb-2 text-base font-bold">
              {t("transparencyTitle")}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              {t("transparencyBody")}
            </p>
          </div>

          {/* Published Reports List */}
          <div className="mb-16">
            <div className="border-border mb-6 border-b pb-4">
              <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                Archived Documentation
              </span>
              <h2 className="text-text mt-1 text-2xl font-bold tracking-tight">
                {t("reportsListTitle")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {reports.map((report) => (
                <Card
                  key={report.id}
                  className="flex flex-col justify-between p-6"
                >
                  <CardHeader className="p-0 pb-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <Badge variant="primary" size="sm">
                        {report.year} Report
                      </Badge>
                      {report.file_size && (
                        <span className="text-text-muted font-mono text-xs">
                          PDF • {report.file_size}
                        </span>
                      )}
                    </div>
                    <CardTitle as="h3" className="text-lg">
                      {report.title}
                    </CardTitle>
                    <CardDescription className="pt-1 text-xs">
                      Audited by community-nominated treasurer & approved by
                      executive committee.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="border-border mt-3 flex items-center justify-between border-t p-0 pt-2">
                    <span className="text-text-muted text-xs">
                      Official Document
                    </span>
                    <a
                      href={report.file_path}
                      download
                      className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>{t("downloadButton")}</span>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Live Community Notices Section */}
          <NoticesSection locale={locale} translations={noticeTranslations} />
        </Container>
      </div>
    </>
  );
}
