import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata } from "@/lib/seo";
import {
  JsonLd,
  getBreadcrumbJsonLd,
  getAboutPageJsonLd,
} from "@/components/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("forewordText").slice(0, 160),
    path: "/about",
    locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const tCommon = await getTranslations("common");

  const coreValues = [
    { title: t("value1Title"), desc: t("value1Desc"), number: "01" },
    { title: t("value2Title"), desc: t("value2Desc"), number: "02" },
    { title: t("value3Title"), desc: t("value3Desc"), number: "03" },
    { title: t("value4Title"), desc: t("value4Desc"), number: "04" },
    { title: t("value5Title"), desc: t("value5Desc"), number: "05" },
  ];

  const missionItems = [
    t("missionItem1"),
    t("missionItem2"),
    t("missionItem3"),
    t("missionItem4"),
    t("missionItem5"),
  ];

  const structureRoles = [
    t("rolePresident"),
    t("roleVicePresident"),
    t("roleSecretary"),
    t("roleTreasurer"),
    t("roleCommittee"),
    t("roleFuneralTeam"),
    t("roleVolunteers"),
  ];

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/about" },
          ],
          locale
        )}
      />
      <JsonLd data={getAboutPageJsonLd(locale)} />
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("forewordText")}
        eyebrow={tCommon("regNo")}
        imageSrc="/images/gallery/ghusl-01.webp"
        imageAlt="BJWS About Community and Constitution"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="py-12 sm:py-16">
        <Container size="xl">
          {/* Vision & Mission */}
          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Vision */}
            <Card className="border-primary/30 bg-[#f7faf8]">
              <CardHeader>
                <Badge variant="primary" size="sm" className="mb-2 w-fit">
                  {t("visionEyebrow")}
                </Badge>
                <CardTitle as="h2" className="text-primary text-2xl">
                  {t("visionTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text text-base leading-relaxed font-medium sm:text-lg">
                  &ldquo;{t("visionText")}&rdquo;
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card>
              <CardHeader>
                <Badge variant="outline" size="sm" className="mb-2 w-fit">
                  {tCommon("societyShort")} Roadmap
                </Badge>
                <CardTitle as="h2" className="text-2xl">
                  {t("missionTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-text-muted space-y-3 text-sm sm:text-base">
                  {missionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8f3ee] text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <Section
            variant="surface"
            title={t("valuesTitle")}
            eyebrow={t("valuesEyebrow")}
            description="Five guiding Islamic principles that govern every action, interaction, and expenditure of our society."
            className="mb-16 rounded-2xl"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coreValues.map((val) => (
                <Card key={val.number} className="bg-surface">
                  <CardHeader>
                    <span className="text-primary font-mono text-xs font-bold">
                      {val.number}
                    </span>
                    <CardTitle as="h3" className="text-lg">
                      {val.title}
                    </CardTitle>
                    <CardDescription className="pt-1 text-sm">
                      {val.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </Section>

          {/* Historical Background */}
          <div className="bg-surface border-border mb-16 rounded-2xl border p-8 sm:p-12">
            <div className="max-w-3xl space-y-4">
              <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                {t("historyEyebrow")}
              </span>
              <h2 className="text-text text-2xl font-bold tracking-tight sm:text-3xl">
                {t("historyTitle")}
              </h2>
              <p className="text-text pt-2 text-base leading-relaxed sm:text-lg">
                {t("historyP1")}
              </p>
              <p className="text-text-muted text-base leading-relaxed">
                {t("historyP2")}
              </p>
            </div>
          </div>

          {/* Structure & Governance */}
          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Organizational Hierarchy */}
            <Card>
              <CardHeader>
                <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                  {t("structureEyebrow")}
                </span>
                <CardTitle as="h2" className="text-2xl">
                  {t("structureTitle")}
                </CardTitle>
                <CardDescription>{t("structureDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="divide-border/80 border-border/80 divide-y border-y text-sm sm:text-base">
                  {structureRoles.map((role, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between py-3"
                    >
                      <span className="text-text font-medium">{role}</span>
                      <span className="text-text-muted font-mono text-xs">
                        Tier 0{idx + 1}
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Executive Officers */}
            <Card>
              <CardHeader>
                <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                  Committee
                </span>
                <CardTitle as="h2" className="text-2xl">
                  {t("leadershipTitle")}
                </CardTitle>
                <CardDescription>
                  Elected committee representatives serving the Buhary Jummah
                  Mosque area.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-surface-muted border-border flex items-center justify-between rounded-lg border p-3.5">
                  <div>
                    <div className="text-text-muted text-xs">
                      {t("rolePresident")}
                    </div>
                    <div className="text-text text-base font-semibold">
                      {t("leadershipPresident")}
                    </div>
                  </div>
                  <Badge variant="primary">Executive</Badge>
                </div>

                <div className="bg-surface-muted border-border flex items-center justify-between rounded-lg border p-3.5">
                  <div>
                    <div className="text-text-muted text-xs">
                      {t("roleSecretary")}
                    </div>
                    <div className="text-text text-base font-semibold">
                      {t("leadershipSecretary")}
                    </div>
                  </div>
                  <Badge variant="outline">Executive</Badge>
                </div>

                <div className="bg-surface-muted border-border flex items-center justify-between rounded-lg border p-3.5">
                  <div>
                    <div className="text-text-muted text-xs">
                      {t("roleTreasurer")}
                    </div>
                    <div className="text-text text-base font-semibold">
                      {t("leadershipTreasurer")}
                    </div>
                  </div>
                  <Badge variant="outline">Finance</Badge>
                </div>

                <div className="bg-surface-muted border-border flex items-center justify-between rounded-lg border p-3.5">
                  <div>
                    <div className="text-text-muted text-xs">Coordination</div>
                    <div className="text-text text-base font-semibold">
                      {t("leadershipCoordinator")}
                    </div>
                  </div>
                  <Badge variant="outline">Logistics</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Membership Details & Registration */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-text mb-2 text-xl font-bold">
                {t("membershipTitle")}
              </h2>
              <p className="text-text-muted mb-4 text-sm leading-relaxed">
                {t("membershipDesc")}
              </p>
              <div className="space-y-2">
                <div className="text-primary rounded-md bg-[#e8f3ee] p-3 text-sm font-semibold">
                  • {t("monthlyContribution")}
                </div>
                <div className="text-primary rounded-md bg-[#e8f3ee] p-3 text-sm font-semibold">
                  • {t("annualContribution")}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-text mb-2 text-xl font-bold">
                {t("registrationTitle")}
              </h2>
              <p className="text-text-muted mb-4 text-sm leading-relaxed">
                {t("registrationText")}
              </p>
              <div className="bg-surface-muted border-border rounded-md border p-4">
                <div className="text-text-muted font-mono text-xs font-semibold uppercase">
                  Official Identifier
                </div>
                <div className="text-text mt-1 font-mono text-base font-bold">
                  DS/TH/SS/VSSO/2023/01
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    </>
  );
}
