import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/privacy",
    locale,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacyPage");
  const tCommon = await getTranslations("common");

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/privacy" },
          ],
          locale
        )}
      />
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        eyebrow={tCommon("regNo")}
        imageSrc="/images/gallery/shramadana-01.webp"
        imageAlt="BJWS Privacy & Data Protection"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="py-12 sm:py-16">
        <Container size="lg">

          {/* Policy Content Sections */}
          <div className="space-y-8">
            <Card className="p-6 sm:p-8">
              <CardHeader className="p-0 pb-3">
                <CardTitle as="h2" className="text-xl">
                  {t("section1Title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-muted space-y-2 p-0 text-sm leading-relaxed sm:text-base">
                <p>{t("section1Body")}</p>
              </CardContent>
            </Card>

            <Card className="p-6 sm:p-8">
              <CardHeader className="p-0 pb-3">
                <CardTitle as="h2" className="text-xl">
                  {t("section2Title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-muted space-y-2 p-0 text-sm leading-relaxed sm:text-base">
                <p>{t("section2Body")}</p>
              </CardContent>
            </Card>

            <Card className="p-6 sm:p-8">
              <CardHeader className="p-0 pb-3">
                <CardTitle as="h2" className="text-xl">
                  {t("section3Title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-muted space-y-2 p-0 text-sm leading-relaxed sm:text-base">
                <p>{t("section3Body")}</p>
              </CardContent>
            </Card>

            <Card className="p-6 sm:p-8">
              <CardHeader className="p-0 pb-3">
                <CardTitle as="h2" className="text-xl">
                  {t("section4Title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-text-muted space-y-2 p-0 text-sm leading-relaxed sm:text-base">
                <p>{t("section4Body")}</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </>
  );
}
