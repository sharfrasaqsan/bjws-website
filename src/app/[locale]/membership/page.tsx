import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MembershipForm } from "@/components/sections/membership-form";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";

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

  const formTranslations = {
    fullNameLabel: t("fullNameLabel"),
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
    errors: {
      errorNameMin: t("errorNameMin"),
      errorNameMax: t("errorNameMax"),
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
        imageSrc="/images/gallery/shramadana-01.webp"
        imageAlt="BJWS Membership Registration"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="py-12 sm:py-16">
        <Container size="xl">

          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Membership Structure & Benefits */}
            <div className="space-y-6 lg:col-span-5">
              <Card className="p-6 sm:p-8">
                <CardHeader className="p-0 pb-4">
                  <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                    Structure
                  </span>
                  <CardTitle as="h2" className="text-xl">
                    {t("overviewTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-text-muted space-y-4 p-0 text-sm leading-relaxed">
                  <p>{t("overviewText")}</p>

                  <div className="space-y-3 pt-2">
                    <div className="bg-surface-muted border-border rounded-xl border p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-text font-bold">
                          {t("planMonthly")}
                        </span>
                        <Badge variant="primary">{t("planMonthlyPrice")}</Badge>
                      </div>
                      <p className="text-text-muted text-xs">
                        {t("planMonthlyDesc")}
                      </p>
                    </div>

                    <div className="bg-surface-muted border-border rounded-xl border p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-text font-bold">
                          {t("planAnnual")}
                        </span>
                        <Badge variant="primary">{t("planAnnualPrice")}</Badge>
                      </div>
                      <p className="text-text-muted text-xs">
                        {t("planAnnualDesc")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <h3 className="text-text mb-3 text-base font-bold">
                  {t("criteriaTitle")}
                </h3>
                <ul className="text-text-muted space-y-2.5 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>{t("criteria1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>{t("criteria2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>{t("criteria3")}</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Right Column: Registration Form */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-8">
                <CardHeader className="border-border mb-6 border-b p-0 pb-6">
                  <CardTitle as="h2" className="text-xl sm:text-2xl">
                    {t("formHeading")}
                  </CardTitle>
                  <p className="text-text-muted pt-1 text-xs sm:text-sm">
                    {t("formSubheading")}
                  </p>
                </CardHeader>

                <MembershipForm translations={formTranslations} />
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
