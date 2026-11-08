import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { TeamGrid } from "@/components/sections/team-grid";
import {
  getTeamMembers,
  type TeamMember,
  findKnownMember,
  ASSIGNED_MEMBER_IDS,
  ASSIGNED_VERIFICATION_TOKENS,
  ASSIGNED_NIC_NUMBERS,
  resolveMemberPhoto,
  calculateExpiryDate,
} from "@/content/team";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ShieldCheck } from "lucide-react";
import { getSiteAssets } from "@/content/site-assets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const assets = getSiteAssets();
  let teamMembers: TeamMember[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_inactive", false)
        .order("created_at", { ascending: false });

      if (!error && data) {
        teamMembers = data.map((d, idx) => {
          const raw = d as Record<string, unknown>;
          const known = findKnownMember({
            id: d.id,
            name: d.name,
            memberId: raw.member_id as string,
          });

          return {
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
            memberId:
              (raw.member_id as string) ||
              known?.memberId ||
              ASSIGNED_MEMBER_IDS[d.id] ||
              `BJWS${(idx + 1).toString().padStart(3, "0")}`,
            nic:
              (raw.nic as string) ||
              known?.nic ||
              ASSIGNED_NIC_NUMBERS[d.id] ||
              "198000000000",
            verificationToken:
              (raw.verification_token as string) ||
              known?.token ||
              ASSIGNED_VERIFICATION_TOKENS[d.id] ||
              `vtok_${d.id}`,
            verificationStatus:
              (raw.verification_status as TeamMember["verificationStatus"]) ||
              "verified",
            issueDate: (raw.issue_date as string) || "2026-01-01",
            expiryDate: calculateExpiryDate(
              (raw.issue_date as string) || "2026-01-01",
              3
            ),
          };
        });
      }
    } catch (err) {
      console.warn("Supabase fetch team members warning:", err);
      teamMembers = getTeamMembers();
    }
  } else {
    teamMembers = getTeamMembers();
  }

  const validLocale = (locale === "ta" || locale === "si" ? locale : "en") as
    "en" | "ta" | "si";

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
        imageSrc={assets.headerTeam || "/images/gallery/home-about.webp"}
        imageAlt="BJWS Society Executive Team and Volunteer Committee"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          {/* Governance & Institutional Mandate Banner */}
          <div className="mb-12 rounded-3xl border border-[#0b2e1e]/15 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3ee] text-[#0b2e1e] ring-1 ring-[#c99a45]/30">
                  <ShieldCheck className="h-6 w-6 text-[#c99a45]" />
                </div>
                <div>
                  <span className="font-sans text-xs font-bold tracking-wider text-[#b8952b] uppercase">
                    Elected Leadership & Shura Council
                  </span>
                  <h2 className="font-display mt-1 text-xl font-bold text-[#0b2e1e] sm:text-2xl">
                    {t("councilTitle")}
                  </h2>
                  <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#4b5563] sm:text-sm">
                    {t("councilDesc")}
                  </p>
                </div>
              </div>

              {/* 3 Key Stats Pills */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="border-border rounded-xl border bg-[#fbfaf6] px-3.5 py-2 text-center">
                  <div className="font-display text-primary text-lg font-bold">
                    {teamMembers.length}
                  </div>
                  <div className="text-text-muted text-[10px] font-semibold tracking-wider uppercase">
                    {t("statMembers")}
                  </div>
                </div>
                <div className="border-border rounded-xl border bg-[#fbfaf6] px-3.5 py-2 text-center">
                  <div className="font-display text-primary text-lg font-bold">
                    24/7
                  </div>
                  <div className="text-text-muted text-[10px] font-semibold tracking-wider uppercase">
                    {t("statOnCall")}
                  </div>
                </div>
                <div className="border-border rounded-xl border bg-[#fbfaf6] px-3.5 py-2 text-center">
                  <div className="font-display text-primary text-lg font-bold">
                    100%
                  </div>
                  <div className="text-text-muted text-[10px] font-semibold tracking-wider uppercase">
                    {t("statHonorary")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Grid with Interactive Filtering & Search */}
          <TeamGrid
            members={teamMembers}
            locale={validLocale}
            translations={translations}
          />
        </Container>
      </div>
    </>
  );
}
