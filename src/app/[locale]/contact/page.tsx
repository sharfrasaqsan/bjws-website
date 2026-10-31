import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/sections/contact-form";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { buildPageMetadata } from "@/lib/seo";
import {
  JsonLd,
  getBreadcrumbJsonLd,
  getContactPageJsonLd,
} from "@/components/seo/json-ld";
import {
  MapPin,
  Mail,
  Clock,
  PhoneCall,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contactPage");
  const tCommon = await getTranslations("common");

  const contacts = [
    {
      role: "President",
      name: "A.M. Sahibullah",
      phone: "072 440 9574",
      tel: "0724409574",
      initials: "AMS",
    },
    {
      role: "Secretary",
      name: "A.L.M. Siyam",
      phone: "077 278 2829",
      tel: "0772782829",
      initials: "ALMS",
    },
    {
      role: "Treasurer",
      name: "M.S. Faisarkhan",
      phone: "075 651 0050",
      tel: "0756510050",
      initials: "MSF",
    },
    {
      role: "Organizer & Field Ops",
      name: "A. Abuhuraira",
      phone: "077 622 7323",
      tel: "0776227323",
      initials: "AA",
    },
    {
      role: "English Communications",
      name: "M.N.M. Nashraff",
      phone: "077 227 1248",
      tel: "0772271248",
      initials: "MNMN",
    },
  ];

  const formTranslations = {
    title: t("formTitle"),
    description: t("formDesc"),
    nameLabel: t("nameLabel"),
    phoneLabel: t("phoneLabel"),
    emailLabel: t("emailLabel"),
    emailOptional: t("emailOptional"),
    messageLabel: t("messageLabel"),
    consentText: t("consentText"),
    privacyLinkText: t("privacyLinkText"),
    submitButton: t("submitButton"),
    submittingButton: t("submittingButton"),
    successTitle: t("successTitle"),
    successMessage: t("successMessage"),
    errors: {
      errorNameMin: t("errorNameMin"),
      errorNameMax: t("errorNameMax"),
      errorPhoneInvalid: t("errorPhoneInvalid"),
      errorEmailInvalid: t("errorEmailInvalid"),
      errorMessageMin: t("errorMessageMin"),
      errorMessageMax: t("errorMessageMax"),
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
            { name: t("breadcrumbs"), path: "/contact" },
          ],
          locale
        )}
      />
      <JsonLd data={getContactPageJsonLd(locale)} />

      {/* Hero Page Header */}
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        eyebrow={tCommon("emergencyBadge")}
        imageSrc="/images/gallery/cemetery-road-01.webp"
        imageAlt="BJWS Office and Contact Location in Mullipothanai"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Office Details, Officers, and Location */}
            <ScrollReveal variant="fade-up" className="space-y-8 lg:col-span-5">
              {/* Office Headquarters Card */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-6 sm:p-8 shadow-sm">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                  Official Society Office
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#0b2e1e]">
                  {t("officeDetailsTitle")}
                </h2>

                <div className="mt-6 space-y-5 text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#0b2e1e]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                        {t("addressLabel")}
                      </div>
                      <p className="mt-0.5 font-medium leading-relaxed text-[#2d3748]">
                        {t("addressValue")}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#0b2e1e]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                        {t("emailLabel")}
                      </div>
                      <a
                        href={`mailto:${t("emailValue")}`}
                        className="mt-0.5 inline-block font-semibold text-[#0b2e1e] hover:text-[#b8952b] hover:underline"
                      >
                        {t("emailValue")}
                      </a>
                    </div>
                  </div>

                  {/* Service Availability Hours */}
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#0b2e1e]">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                        {t("hoursLabel")}
                      </div>
                      <p className="mt-0.5 flex items-center gap-2 font-medium text-[#2d3748]">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
                        <span>{t("hoursValue")}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Officer Direct Lines */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-[#0b2e1e]/10 pb-3">
                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                      Direct Telephone Lines
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#0b2e1e]">
                      {t("phoneLabel")}
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#0b2e1e] px-2.5 py-0.5 text-xs font-semibold text-[#d4af37]">
                    24/7 On-Call
                  </span>
                </div>

                <div className="divide-y divide-[#0b2e1e]/10">
                  {contacts.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 py-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b2e1e] font-display text-[10px] font-bold text-[#d4af37]">
                          {c.initials}
                        </span>
                        <div>
                          <div className="text-xs font-medium text-[#6b7280]">
                            {c.role}
                          </div>
                          <div className="text-sm font-bold text-[#0b2e1e]">
                            {c.name}
                          </div>
                        </div>
                      </div>
                      <a
                        href={`tel:${c.tel}`}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#e8f3ee] px-3 py-1.5 text-xs font-bold text-[#0b2e1e] transition-colors hover:bg-[#0b2e1e] hover:text-white"
                      >
                        <PhoneCall className="h-3 w-3" />
                        {c.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mosque & Cemetery Location Map Card */}
              <div className="overflow-hidden rounded-3xl border border-[#0b2e1e]/10 bg-white shadow-sm">
                <div className="relative flex flex-col items-center justify-center bg-[#f4efe6] p-8 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b2e1e] text-[#d4af37] shadow-sm">
                    <MapPin className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h4 className="font-display text-base font-bold text-[#0b2e1e]">
                    {t("mapPlaceholderHeading")}
                  </h4>
                  <p className="mt-1 text-xs text-[#6b7280]">
                    95th Mile Post, Kandy Road, Mullipothanai
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-[#0b2e1e]/10 bg-white p-4 text-xs">
                  <span className="font-medium text-[#4b5563]">
                    Thampalakamam DS Division, Eastern Province
                  </span>
                  <a
                    href="https://www.google.com/maps/search/95th+Buhary+Jummah+Mosque+Mullipothanai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#0b2e1e] hover:text-[#b8952b]"
                  >
                    Google Maps
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column: Contact Inquiry Form */}
            <ScrollReveal variant="fade-up" delay={2} className="lg:col-span-7">
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 sm:p-10 lg:p-12 shadow-sm">
                <div className="mb-8 border-b border-[#0b2e1e]/10 pb-6">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e8f3ee] px-3 py-1 text-xs font-semibold text-[#0b2e1e]">
                    <MessageSquare className="h-3.5 w-3.5 text-[#0b2e1e]" />
                    Inquiry & Assistance
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                    {t("formTitle")}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">
                    {t("formDesc")}
                  </p>
                </div>

                <ContactForm locale={locale} translations={formTranslations} />

                <div className="mt-8 flex items-center gap-2 border-t border-[#0b2e1e]/10 pt-4 text-xs text-[#6b7280]">
                  <ShieldCheck className="h-4 w-4 text-[#0b2e1e]" />
                  <span>All communications are treated with strict confidentiality and community respect.</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </div>
    </>
  );
}
