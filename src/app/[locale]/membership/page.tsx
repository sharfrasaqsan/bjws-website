import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { MembershipForm } from "@/components/sections/membership-form";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import {
  Check,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Users,
  Clock,
  Building2,
  MapPin,
  PhoneCall,
  ArrowRight,
} from "lucide-react";
import { getSiteAssets } from "@/content/site-assets";

// Feature flag: Set to true when opening online membership registration
const IS_ONLINE_REGISTRATION_OPEN = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "membershipPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/membership",
    locale,
  });
}

export default async function MembershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("membershipPage");
  const tCommon = await getTranslations("common");
  const assets = getSiteAssets();

  const formTranslations = {
    fullNameLabel: t("fullNameLabel"),
    nicLabel: t("nicLabel"),
    nicPlaceholder: t("nicPlaceholder"),
    nicHint: t("nicHint"),
    phoneLabel: t("phoneLabel"),
    emailLabel: t("emailLabel"),
    emailOptional: t("emailOptional"),
    addressLabel: t("addressLabel"),
    familySizeLabel: t("familySizeLabel"),
    familySizeHint: t("familySizeHint"),
    planLabel: t("planLabel"),
    planMonthly: t("planMonthly"),
    planMonthlyPrice: t("planMonthlyPrice"),
    planAnnual: t("planAnnual"),
    planAnnualPrice: t("planAnnualPrice"),
    preferredContactLabel: t("preferredContactLabel"),
    contactPhone: t("contactPhone"),
    contactWhatsapp: t("contactWhatsapp"),
    contactSms: t("contactSms"),
    consentText: t("consentText"),
    privacyLinkText: t("privacyLinkText"),
    submitButton: t("submitButton"),
    submittingButton: t("submittingButton"),
    successTitle: t("successTitle"),
    successMessage: t("successMessage"),
    referenceCodeLabel: t("referenceCodeLabel"),
    referenceNotice: t("referenceNotice"),
    errors: {
      errorNameMin: t("errorNameMin"),
      errorNameMax: t("errorNameMax"),
      errorNicInvalid: t("errorNicInvalid"),
      errorDuplicateNIC: t("errorDuplicateNIC"),
      errorDuplicatePhone: t("errorDuplicatePhone"),
      errorMahallaRequired: t("errorMahallaRequired"),
      errorPhoneInvalid: t("errorPhoneInvalid"),
      errorEmailInvalid: t("errorEmailInvalid"),
      errorAddressRequired: t("errorAddressRequired"),
      errorAddressMax: t("errorAddressMax"),
      errorFamilySizeMin: t("errorFamilySizeMin"),
      errorFamilySizeMax: t("errorFamilySizeMax"),
      errorConsentRequired: t("errorConsentRequired"),
      errorRateLimit: t("errorRateLimit"),
      errorDatabaseFailed: t("errorDatabaseFailed"),
      errorGeneric: t("errorGeneric"),
    },
  };

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/membership" },
          ],
          locale
        )}
      />
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        eyebrow={tCommon("regNo")}
        imageSrc={assets.headerMembership || "/images/gallery/home-about.webp"}
        imageAlt="BJWS Membership Registration and Community Solidarity"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Membership Structure & Benefit Cards */}
            <ScrollReveal variant="fade-up" className="space-y-8 lg:col-span-5">
              {/* Plan Overview & Comparison Tiers */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-6 shadow-sm sm:p-8">
                <span className="font-sans text-xs font-bold tracking-wider text-[#b8952b] uppercase">
                  Community Safety Net
                </span>
                <h2 className="font-display mt-1 text-2xl font-bold text-[#0b2e1e]">
                  {t("overviewTitle")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
                  {t("overviewText")}
                </p>

                {/* Tier 1: Monthly Plan Card */}
                <div className="mt-6 rounded-2xl border border-[#0b2e1e]/10 bg-[#fbfaf6] p-5 transition-all hover:border-[#0b2e1e]/25">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold tracking-wider text-[#6b7280] uppercase">
                        Standard Option
                      </span>
                      <h3 className="font-display text-lg font-bold text-[#0b2e1e]">
                        {t("planMonthly")}
                      </h3>
                    </div>
                    <span className="font-display rounded-full bg-[#0b2e1e] px-3 py-1 text-sm font-bold text-[#d4af37]">
                      {t("planMonthlyPrice")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#4b5563]">
                    {t("planMonthlyDesc")}
                  </p>
                  <ul className="mt-3 space-y-1.5 border-t border-[#0b2e1e]/10 pt-3 text-xs text-[#2d3748]">
                    <li className="flex items-center gap-2">
                      <Check
                        className="h-3.5 w-3.5 text-[#0b2e1e]"
                        strokeWidth={2.5}
                      />
                      <span>
                        Full Janaza washing, shrouding & burial coordination
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check
                        className="h-3.5 w-3.5 text-[#0b2e1e]"
                        strokeWidth={2.5}
                      />
                      <span>Recorded in official Mahallah member registry</span>
                    </li>
                  </ul>
                </div>

                {/* Tier 2: Annual Plan Card (Recommended) */}
                <div className="relative mt-4 rounded-2xl border-2 border-[#d4af37] bg-[#fbfaf6] p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="absolute -top-3 right-4 rounded-full bg-[#d4af37] px-3 py-0.5 text-[10px] font-bold tracking-wider text-[#0b2e1e] uppercase shadow-xs">
                    Most Recommended
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold tracking-wider text-[#b8952b] uppercase">
                        Full Year Settle
                      </span>
                      <h3 className="font-display text-lg font-bold text-[#0b2e1e]">
                        {t("planAnnual")}
                      </h3>
                    </div>
                    <span className="font-display rounded-full bg-[#0b2e1e] px-3 py-1 text-sm font-bold text-[#d4af37]">
                      {t("planAnnualPrice")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#4b5563]">
                    {t("planAnnualDesc")}
                  </p>
                  <ul className="mt-3 space-y-1.5 border-t border-[#0b2e1e]/10 pt-3 text-xs text-[#2d3748]">
                    <li className="flex items-center gap-2">
                      <Sparkles
                        className="h-3.5 w-3.5 text-[#b8952b]"
                        strokeWidth={2.5}
                      />
                      <span>
                        Uninterrupted 12-month coverage without monthly
                        reminders
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles
                        className="h-3.5 w-3.5 text-[#b8952b]"
                        strokeWidth={2.5}
                      />
                      <span>
                        Directly supports cemetery infrastructure maintenance
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Eligibility & Guidelines Card */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck
                    className="h-5 w-5 text-[#0b2e1e]"
                    strokeWidth={2}
                  />
                  <h3 className="font-display text-lg font-bold text-[#0b2e1e]">
                    {t("criteriaTitle")}
                  </h3>
                </div>
                <ul className="space-y-3 text-xs text-[#4b5563] sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e8f3ee] text-[10px] font-bold text-[#0b2e1e]">
                      ✓
                    </span>
                    <span className="leading-relaxed">{t("criteria1")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e8f3ee] text-[10px] font-bold text-[#0b2e1e]">
                      ✓
                    </span>
                    <span className="leading-relaxed">{t("criteria2")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e8f3ee] text-[10px] font-bold text-[#0b2e1e]">
                      ✓
                    </span>
                    <span className="leading-relaxed">{t("criteria3")}</span>
                  </li>
                </ul>

                <div className="mt-6 flex items-center gap-2 border-t border-[#0b2e1e]/10 pt-4 text-xs text-[#6b7280]">
                  <Users className="h-4 w-4 text-[#0b2e1e]" />
                  <span>
                    Serving resident families across Buhary Mosque Mahallah.
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column: Registration Form or Coming Soon Announcement */}
            <ScrollReveal variant="fade-up" delay={2} className="lg:col-span-7">
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
                {IS_ONLINE_REGISTRATION_OPEN ? (
                  <>
                    <div className="mb-8 border-b border-[#0b2e1e]/10 pb-6">
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e8f3ee] px-3 py-1 text-xs font-semibold text-[#0b2e1e]">
                        <HeartHandshake className="h-3.5 w-3.5 text-[#0b2e1e]" />
                        Official Application
                      </div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                        {t("formHeading")}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">
                        {t("formSubheading")}
                      </p>
                    </div>

                    <MembershipForm translations={formTranslations} />
                  </>
                ) : (
                  <div className="space-y-8">
                    {/* Coming Soon Notice Header */}
                    <div>
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-900 shadow-xs">
                        <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                        <span>{t("comingSoonBadge")}</span>
                      </div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                        {t("comingSoonHeading")}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
                        {t("comingSoonSubheading")}
                      </p>
                    </div>

                    {/* How to Register Meanwhile Card */}
                    <div className="rounded-2xl border border-[#0b2e1e]/10 bg-[#fbfaf6] p-6 sm:p-7 space-y-5">
                      <div className="flex items-center gap-2.5 text-[#0b2e1e]">
                        <Building2 className="h-5 w-5 text-[#b8952b]" />
                        <h3 className="font-display text-base font-bold text-[#0b2e1e]">
                          {t("comingSoonNoticeTitle")}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-[#4b5563]">
                        {t("comingSoonNoticeText")}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#0b2e1e]/10">
                        {/* Option 1: In Person */}
                        <div className="rounded-xl bg-white p-4 border border-[#0b2e1e]/5 shadow-xs">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#0b2e1e] uppercase tracking-wider mb-1.5">
                            <MapPin className="h-4 w-4 text-[#b8952b]" />
                            <span>{t("comingSoonInPersonTitle")}</span>
                          </div>
                          <p className="text-xs text-[#6b7280] leading-relaxed">
                            {t("comingSoonInPersonDesc")}
                          </p>
                        </div>

                        {/* Option 2: Direct Contact */}
                        <div className="rounded-xl bg-white p-4 border border-[#0b2e1e]/5 shadow-xs">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#0b2e1e] uppercase tracking-wider mb-1.5">
                            <PhoneCall className="h-4 w-4 text-[#0b2e1e]" />
                            <span>{t("comingSoonContactDeskTitle")}</span>
                          </div>
                          <p className="text-xs text-[#6b7280] leading-relaxed">
                            {t("comingSoonContactDeskDesc")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Callouts */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Link
                        href={`/${locale}/contact`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b2e1e] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#134931] hover:shadow-md focus:outline-hidden focus:ring-2 focus:ring-[#0b2e1e] focus:ring-offset-2"
                      >
                        <span>{t("comingSoonContactButton")}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href="tel:+94772782829"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0b2e1e]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#0b2e1e] shadow-xs transition-all hover:bg-[#fbfaf6] hover:border-[#0b2e1e]/40 focus:outline-hidden"
                      >
                        <PhoneCall className="h-4 w-4 text-[#b8952b]" />
                        <span>{t("comingSoonHelplineButton")}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </div>
    </>
  );
}
