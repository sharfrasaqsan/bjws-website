import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import {
  Heart,
  Landmark,
  MessageCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Users,
  FileCheck,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donatePage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/donate",
    locale,
  });
}

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("donatePage");
  const tCommon = await getTranslations("common");

  const causes = [
    {
      title: t("cause1Title"),
      desc: t("cause1Desc"),
      icon: Clock,
      badge: "24/7 Primary Mission",
    },
    {
      title: t("cause2Title"),
      desc: t("cause2Desc"),
      icon: Heart,
      badge: "Social Welfare Aid",
    },
    {
      title: t("cause3Title"),
      desc: t("cause3Desc"),
      icon: Sparkles,
      badge: "Cemetery Infrastructure",
    },
  ];

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/donate" },
          ],
          locale
        )}
      />
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        eyebrow={t("eyebrow")}
        imageSrc="/images/gallery/iftar-01.webp"
        imageAlt="BJWS Charitable Welfare and Funeral Support"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Official Bank Account Card */}
            <div className="space-y-8 lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl bg-[#0b2e1e] p-8 text-white shadow-xl sm:p-10 lg:p-12">
                <IslamicPattern
                  className="pointer-events-none absolute inset-0 text-white"
                  opacity={0.04}
                  id="donate-bank-pattern"
                />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-3 py-1 text-xs font-semibold text-[#d4af37]">
                    <Landmark className="h-4 w-4" />
                    Official Society Account
                  </div>

                  <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {t("bankDetailsTitle")}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#fbfaf6]/80 sm:text-base">
                    {t("bankDetailsSubtitle")}
                  </p>

                  {/* Bank Account Ledger Box */}
                  <div className="mt-8 space-y-4 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-xs">
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                        {t("accountNameLabel")}
                      </span>
                      <span className="mt-1 block font-display text-lg font-bold text-white sm:text-xl">
                        {t("accountName")}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                        {t("bankNameLabel")}
                      </span>
                      <span className="mt-1 block text-base font-medium text-white">
                        {t("bankName")}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                        {t("accountNumberLabel")}
                      </span>
                      <span className="mt-1 block font-mono text-base font-bold text-white sm:text-lg">
                        {t("accountNumber")}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                        {t("branchLabel")}
                      </span>
                      <span className="mt-1 block text-sm text-[#fbfaf6]/90">
                        {t("branch")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#d4af37]">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Reg No: DS/TH/SS/VSSO/2023/01 • Divisional Secretariat, Thampalakamam</span>
                  </div>
                </div>
              </div>

              {/* Confirmation & Receipts Card */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-10">
                <div className="mb-3 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-[#0b2e1e]" />
                  <h3 className="font-display text-xl font-bold text-[#0b2e1e]">
                    {t("confirmationTitle")}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#4b5563]">
                  {t("confirmationDesc")}
                </p>

                <div className="mt-5 rounded-2xl bg-[#fbfaf6] border border-[#0b2e1e]/10 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
                    Verified Officer Contact
                  </div>
                  <div className="mt-1 text-base font-bold text-[#0b2e1e]">
                    {t("treasurerContact")}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="https://wa.me/94756510050"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0b2e1e] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#12422c]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25d366]" />
                    {t("sendReceiptWhatsapp")}
                  </a>
                  <a
                    href="tel:0756510050"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#0b2e1e]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0b2e1e] transition-colors hover:bg-[#e8f3ee]"
                  >
                    <Phone className="h-4 w-4 text-[#d4af37]" />
                    Call Treasurer Directly
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Cause Breakdown & Alternative Membership */}
            <div className="space-y-8 lg:col-span-5">
              {/* How Funds Are Allocated */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-10">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                  Transparent Allocation
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold text-[#0b2e1e]">
                  {t("causesTitle")}
                </h3>

                <div className="mt-6 space-y-6">
                  {causes.map((c, idx) => {
                    const Icon = c.icon;
                    return (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3ee] text-[#0b2e1e]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="inline-block rounded-full bg-[#f4efe6] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0b2e1e]">
                            {c.badge}
                          </span>
                          <h4 className="mt-1 font-display text-base font-bold text-[#0b2e1e]">
                            {c.title}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-[#4b5563]">
                            {c.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Looking for Ongoing Membership? */}
              <div className="rounded-3xl border-2 border-[#d4af37]/40 bg-[#f4efe6] p-8 shadow-sm sm:p-10">
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#0b2e1e]" />
                  <h3 className="font-display text-xl font-bold text-[#0b2e1e]">
                    {t("membershipAltTitle")}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#4b5563]">
                  {t("membershipAltDesc")}
                </p>
                <div className="mt-6">
                  <Link
                    href="/membership"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0b2e1e] px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#12422c]"
                  >
                    {t("membershipAltButton")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

