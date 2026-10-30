import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/sections/contact-form";
import { buildPageMetadata } from "@/lib/seo";
import {
  JsonLd,
  getBreadcrumbJsonLd,
  getContactPageJsonLd,
} from "@/components/seo/json-ld";

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
      title: "President",
      person: t("phoneLeader1"),
      tel: "0753738349",
    },
    {
      title: "Secretary",
      person: t("phoneLeader2"),
      tel: "0772782829",
    },
    {
      title: "Treasurer",
      person: t("phoneLeader3"),
      tel: "0756510050",
    },
    {
      title: "Coordinator",
      person: t("phoneLeader4"),
      tel: "0776227323",
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

      <div className="py-12 sm:py-16">
        <Container size="xl">
          {/* Contact Information & Form Grid */}
          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Office Details, Officers, and Map */}
            <div className="space-y-6 lg:col-span-5">
              <Card className="p-6 sm:p-8">
                <CardHeader className="p-0 pb-4">
                  <CardTitle as="h2" className="text-xl">
                    {t("officeDetailsTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-0 text-sm">
                  <div>
                    <div className="text-text-muted mb-1 text-xs font-semibold tracking-wider uppercase">
                      {t("addressLabel")}
                    </div>
                    <p className="text-text leading-relaxed font-medium">
                      {t("addressValue")}
                    </p>
                  </div>

                  <div>
                    <div className="text-text-muted mb-1 text-xs font-semibold tracking-wider uppercase">
                      {t("emailLabel")}
                    </div>
                    <a
                      href={`mailto:${t("emailValue")}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      {t("emailValue")}
                    </a>
                  </div>

                  <div>
                    <div className="text-text-muted mb-1 text-xs font-semibold tracking-wider uppercase">
                      {t("hoursLabel")}
                    </div>
                    <p className="text-text flex items-center gap-2 font-medium">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
                      <span>{t("hoursValue")}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Officer Phone Numbers */}
              <Card className="p-6">
                <div className="border-border mb-3 flex items-center justify-between border-b pb-3">
                  <h3 className="text-text text-sm font-bold tracking-wider uppercase">
                    {t("phoneLabel")}
                  </h3>
                  <Badge variant="primary">24/7 Hotlines</Badge>
                </div>
                <div className="divide-border divide-y text-sm">
                  {contacts.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 py-2.5"
                    >
                      <span className="text-text text-xs font-medium sm:text-sm">
                        {c.person}
                      </span>
                      <a
                        href={`tel:${c.tel}`}
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Map Placeholder */}
              <Card className="overflow-hidden">
                <div className="bg-surface-muted border-border relative flex h-48 flex-col items-center justify-center border-b p-6 text-center">
                  <div className="bg-primary text-primary-foreground mb-2 flex h-12 w-12 items-center justify-center rounded-full shadow-md">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-text text-sm font-bold">
                    {t("mapPlaceholderHeading")}
                  </h4>
                  <p className="text-text-muted mt-0.5 text-[11px]">
                    95th Mile Post, Kandy Road, Mullipothanai
                  </p>
                </div>
                <div className="bg-surface flex items-center justify-between p-4 text-xs">
                  <span className="text-text-muted">
                    Eastern Province, Sri Lanka
                  </span>
                  <a
                    href="https://www.google.com/maps/search/95th+Buhary+Jummah+Mosque+Mullipothanai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                  >
                    View Map ↗
                  </a>
                </div>
              </Card>
            </div>

            {/* Right Column: Contact Inquiry Form */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-8">
                <CardHeader className="border-border mb-6 border-b p-0 pb-6">
                  <CardTitle as="h2" className="text-xl sm:text-2xl">
                    {t("formTitle")}
                  </CardTitle>
                  <p className="text-text-muted pt-1 text-xs sm:text-sm">
                    {t("formDesc")}
                  </p>
                </CardHeader>

                <ContactForm locale={locale} translations={formTranslations} />
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
