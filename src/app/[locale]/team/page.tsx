import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { TeamGrid } from "@/components/sections/team-grid";
import { TEAM_MEMBERS } from "@/content/team";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ShieldCheck } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "teamPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/team",
    locale,
  });
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("teamPage");
  const tCommon = await getTranslations("common");

  const validLocale = (locale === "ta" || locale === "si" ? locale : "en") as
    | "en"
    | "ta"
    | "si";

  const translations = {
    searchPlaceholder: t("searchPlaceholder"),
    filterAll: t("filterAll"),
    callButton: t("callButton"),
    whatsappButton: t("whatsappButton"),
    responsibilitiesLabel: t("responsibilitiesLabel"),
    termLabel: t("termLabel"),
    addressLabel: t("addressLabel"),
    noResults: t("noResults"),
    activeBadge: t("activeBadge"),
    inactiveBadge: t("inactiveBadge"),
  };

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/team" },
          ],
          locale
        )}
      />
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        eyebrow={tCommon("regNo")}
        imageSrc="/images/gallery/shramadana-01.webp"
        imageAlt="BJWS Society Executive Team and Volunteer Committee"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          {/* Governance & Institutional Mandate Banner */}
          <div className="mb-12 rounded-3xl border border-[#0b2e1e]/15 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3ee] text-[#0b2e1e] ring-1 ring-[#c99a45]/30">
                  <ShieldCheck className="h-6 w-6 text-[#c99a45]" />
                </div>
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                    Elected Leadership & Shura Council
                  </span>
                  <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-[#0b2e1e]">
                    {t("councilTitle")}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[#4b5563] max-w-2xl leading-relaxed">
                    {t("councilDesc")}
                  </p>
                </div>
              </div>

              {/* 3 Key Stats Pills */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl bg-[#fbfaf6] border border-border px-3.5 py-2 text-center">
                  <div className="font-display text-lg font-bold text-primary">8+</div>
                  <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    Officers
                  </div>
                </div>
                <div className="rounded-xl bg-[#fbfaf6] border border-border px-3.5 py-2 text-center">
                  <div className="font-display text-lg font-bold text-primary">24/7</div>
                  <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    On-Call
                  </div>
                </div>
                <div className="rounded-xl bg-[#fbfaf6] border border-border px-3.5 py-2 text-center">
                  <div className="font-display text-lg font-bold text-primary">100%</div>
                  <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    Honorary
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Grid with Interactive Filtering & Search */}
          <TeamGrid
            members={TEAM_MEMBERS}
            locale={validLocale}
            translations={translations}
          />
        </Container>
      </div>
    </>
  );
}
