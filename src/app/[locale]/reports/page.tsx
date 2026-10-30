import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { NoticesSection } from "@/components/sections/notices-section";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { FileText, Download, ShieldCheck, FileCheck } from "lucide-react";

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

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          {/* Financial Transparency Declaration */}
          <div className="mb-16 rounded-3xl border border-[#0b2e1e]/15 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3ee] text-[#0b2e1e]">
                <ShieldCheck className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                  Accountability Declaration
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#0b2e1e] sm:text-3xl">
                  {t("transparencyTitle")}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-[#4b5563]">
                  {t("transparencyBody")}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#6b7280]">
                  <span>• Audited by General Assembly</span>
                  <span>• Submitted to Divisional Secretariat</span>
                  <span>• Reg: DS/TH/SS/VSSO/2023/01</span>
                </div>
              </div>
            </div>
          </div>

          {/* Published Reports List */}
          <div className="mb-20">
            <div className="mb-8 border-b border-[#0b2e1e]/10 pb-4">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                Public Records
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                {t("reportsListTitle")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col justify-between rounded-3xl border border-[#0b2e1e]/10 bg-white p-6 sm:p-8 shadow-xs transition-all hover:border-[#0b2e1e]/25 hover:shadow-md"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#0b2e1e] px-3 py-1 font-display text-xs font-bold text-[#d4af37]">
                        {report.year} Annual Report
                      </span>
                      {report.file_size && (
                        <span className="font-mono text-xs font-semibold text-[#6b7280]">
                          PDF • {report.file_size}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4efe6] text-[#0b2e1e]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-[#0b2e1e]">
                          {report.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#6b7280]">
                          Audited by community-nominated treasurer & approved by the executive committee.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#0b2e1e]/10 pt-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#6b7280]">
                      <FileCheck className="h-3.5 w-3.5 text-[#0b2e1e]" />
                      Verified Official Copy
                    </span>
                    <a
                      href={report.file_path}
                      download
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b2e1e] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#12422c]"
                    >
                      <Download className="h-3.5 w-3.5 text-[#d4af37]" />
                      <span>{t("downloadButton")}</span>
                    </a>
                  </div>
                </div>
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
