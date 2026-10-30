import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ShieldCheck, Lock, Eye, Mail } from "lucide-react";

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

  const sections = [
    {
      title: t("section1Title"),
      body: t("section1Body"),
      icon: ShieldCheck,
      number: "01",
    },
    {
      title: t("section2Title"),
      body: t("section2Body"),
      icon: Lock,
      number: "02",
    },
    {
      title: t("section3Title"),
      body: t("section3Body"),
      icon: Eye,
      number: "03",
    },
    {
      title: t("section4Title"),
      body: t("section4Body"),
      icon: Mail,
      number: "04",
    },
  ];

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

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="lg">
          <div className="space-y-8">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <article
                  key={sec.number}
                  className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-xs transition-all hover:border-[#0b2e1e]/25 hover:shadow-md sm:p-10"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3ee] text-[#0b2e1e]">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div>
                      <span className="font-display text-sm font-bold text-[#d4af37]">
                        Section {sec.number}
                      </span>
                      <h2 className="mt-1 font-display text-xl font-bold text-[#0b2e1e] sm:text-2xl">
                        {sec.title}
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-[#4b5563]">
                        {sec.body}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </div>
    </>
  );
}
