import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";
import { buildPageMetadata } from "@/lib/seo";
import {
  JsonLd,
  getBreadcrumbJsonLd,
  getAboutPageJsonLd,
} from "@/components/seo/json-ld";
import {
  Compass,
  Target,
  Phone,
  FileCheck,
  Check,
  ArrowRight,
  Award,
} from "lucide-react";

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
    { title: t("rolePresident"), number: "01", desc: "Society Leadership & Assembly Chair" },
    { title: t("roleVicePresident"), number: "02", desc: "Executive Support & Deputization" },
    { title: t("roleSecretary"), number: "03", desc: "Secretariat, Minutes & Registry" },
    { title: t("roleTreasurer"), number: "04", desc: "Accounts, Audits & Contributions" },
    { title: t("roleCommittee"), number: "05", desc: "Community Consultation & Shura" },
    { title: t("roleFuneralTeam"), number: "06", desc: "24/7 Ghusl, Kafan & Burials" },
    { title: t("roleVolunteers"), number: "07", desc: "Cemetery Maintenance & Upkeep" },
  ];

  const executiveOfficers = [
    {
      name: "A.M. Sahibullah",
      role: t("rolePresident"),
      phone: "072 440 9574",
      initials: "AMS",
    },
    {
      name: "A.L.M. Siyam",
      role: t("roleSecretary"),
      phone: "077 278 2829",
      initials: "ALMS",
    },
    {
      name: "M.S. Faisarkhan",
      role: t("roleTreasurer"),
      phone: "075 651 0050",
      initials: "MSF",
    },
    {
      name: "A. Abuhuraira",
      role: "Organizer & Field Operations",
      phone: "077 622 7323",
      initials: "AA",
    },
    {
      name: "M.N.M. Nashraff",
      role: "English Communications Liaison",
      phone: "077 227 1248",
      initials: "MNMN",
    },
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

      {/* Hero Page Header */}
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

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          {/* Section 1: Foreword & Heritage Split */}
          <ScrollReveal variant="fade-up">
            <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left: Editorial Foreword Card */}
              <div className="relative overflow-hidden rounded-3xl bg-[#0b2e1e] p-8 text-white shadow-xl sm:p-12 lg:col-span-7">
                <IslamicPattern
                  className="pointer-events-none absolute inset-0 text-white"
                  opacity={0.04}
                  id="about-foreword-pattern"
                />
                <div className="relative z-10">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    {t("forewordEyebrow")}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {t("forewordTitle")}
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-[#fbfaf6]/90 sm:text-lg">
                    <p className="italic">
                      &ldquo;{t("forewordText")}&rdquo;
                    </p>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#d4af37]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                        DS/TH/SS/VSSO/2023/01
                      </span>
                    </div>
                    <span className="text-white/40">•</span>
                    <span className="text-xs text-white/80">
                      Buhary Jummah Mosque Mahallah, Mullipothanai
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Real Photo & Stats Card */}
              <div className="space-y-6 lg:col-span-5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#0b2e1e]/10 shadow-md">
                  <Image
                    src="/images/gallery/shramadana-01.webp"
                    alt="BJWS Community Members Serving at Mullipothanai"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="rounded-full bg-[#0b2e1e]/90 px-3 py-1.5 text-xs font-bold text-[#d4af37] backdrop-blur-xs">
                      Serving Since 2023
                    </span>
                    <p className="mt-2 text-sm font-medium text-white/90">
                      United under Shura consultation for community welfare and dignity.
                    </p>
                  </div>
                </div>

                {/* Stat Highlights Bar */}
                <div className="grid grid-cols-3 gap-3 rounded-2xl border border-[#0b2e1e]/10 bg-white p-4 text-center shadow-xs">
                  <div>
                    <div className="font-display text-2xl font-bold text-[#0b2e1e]">50+</div>
                    <div className="text-[11px] font-semibold text-[#6b7280] uppercase">Members</div>
                  </div>
                  <div className="border-x border-[#0b2e1e]/10">
                    <div className="font-display text-2xl font-bold text-[#0b2e1e]">28</div>
                    <div className="text-[11px] font-semibold text-[#6b7280] uppercase">Janazas</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-[#0b2e1e]">750+</div>
                    <div className="text-[11px] font-semibold text-[#6b7280] uppercase">Rations</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 2: Vision & Mission (Asymmetric Institutional Layout) */}
          <ScrollReveal variant="fade-up">
            <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Vision Card */}
              <div className="relative overflow-hidden rounded-3xl border border-[#d4af37]/30 bg-[#f4efe6] p-8 shadow-sm sm:p-10 lg:col-span-5">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b2e1e] text-[#d4af37] shadow-sm">
                  <Compass className="h-6 w-6" strokeWidth={2} />
                </div>
                <span className="block font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                  {t("visionEyebrow")}
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#0b2e1e] sm:text-3xl">
                  {t("visionTitle")}
                </h2>
                <blockquote className="mt-6 border-l-3 border-[#0b2e1e] pl-4 font-display text-lg font-medium italic leading-relaxed text-[#0b2e1e] sm:text-xl">
                  &ldquo;{t("visionText")}&rdquo;
                </blockquote>
              </div>

              {/* Mission Card */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-10 lg:col-span-7">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f3ee] text-[#0b2e1e]">
                  <Target className="h-6 w-6" strokeWidth={2} />
                </div>
                <span className="block font-sans text-xs font-bold uppercase tracking-wider text-[#0b2e1e]">
                  {tCommon("societyShort")} Strategic Focus
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#0b2e1e] sm:text-3xl">
                  {t("missionTitle")}
                </h2>
                <ul className="mt-6 space-y-3.5">
                  {missionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0b2e1e] text-[10px] font-bold text-[#d4af37]">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm font-medium leading-relaxed text-[#2d3748] sm:text-base">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 3: Core Values (Numbered Monogram Grid) */}
          <div className="mb-20">
            <ScrollReveal variant="fade-up" className="mb-10 text-center">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                {t("valuesEyebrow")}
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0b2e1e] sm:text-4xl">
                {t("valuesTitle")}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-[#4b5563]">
                Five guiding Islamic principles that govern every action, interaction, and expenditure of our society.
              </p>
            </ScrollReveal>

            <ScrollRevealGroup staggerMs={60} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {coreValues.map((val) => (
                <div
                  key={val.number}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#0b2e1e]/10 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0b2e1e]/30 hover:shadow-md"
                >
                  <div>
                    <span className="font-display text-3xl font-bold text-[#d4af37] opacity-80 group-hover:opacity-100">
                      {val.number}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold text-[#0b2e1e]">
                      {val.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#6b7280]">
                      {val.desc}
                    </p>
                  </div>
                  <div className="mt-5 h-1 w-8 rounded-full bg-[#0b2e1e]/15 transition-all group-hover:w-12 group-hover:bg-[#0b2e1e]" />
                </div>
              ))}
            </ScrollRevealGroup>
          </div>

          {/* Section 4: Historical Background Storyline */}
          <ScrollReveal variant="fade-up">
            <div className="mb-20 rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-12 lg:p-14">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-7">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                    {t("historyEyebrow")}
                  </span>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl lg:text-4xl">
                    {t("historyTitle")}
                  </h2>
                  <p className="text-base leading-relaxed text-[#2d3748] sm:text-lg">
                    {t("historyP1")}
                  </p>
                  <p className="text-base leading-relaxed text-[#4b5563]">
                    {t("historyP2")}
                  </p>
                </div>

                {/* Documentary Frame */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#0b2e1e]/15 shadow-sm">
                    <Image
                      src="/images/gallery/water-concrete-01.webp"
                      alt="First BJWS Community Water and Infrastructure Work"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-xs font-semibold text-white">
                        Early civil works & on-site water facilities at the mosque & cemetery.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 5: Structure & Governance */}
          <ScrollReveal variant="fade-up">
            <div className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-12">
              {/* Left: Organizational Hierarchy */}
              <div className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-10 lg:col-span-5">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                  {t("structureEyebrow")}
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#0b2e1e] sm:text-3xl">
                  {t("structureTitle")}
                </h2>
                <p className="mt-2 text-sm text-[#4b5563]">
                  {t("structureDesc")}
                </p>

                <ol className="mt-6 divide-y divide-[#0b2e1e]/10">
                  {structureRoles.map((role, idx) => (
                    <li key={idx} className="flex items-center justify-between py-3">
                      <div>
                        <div className="text-sm font-semibold text-[#0b2e1e]">
                          {role.title}
                        </div>
                        <div className="text-xs text-[#6b7280]">
                          {role.desc}
                        </div>
                      </div>
                      <span className="rounded-full bg-[#f4efe6] px-2.5 py-1 font-mono text-[11px] font-bold text-[#0b2e1e]">
                        {role.number}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Right: Executive Committee Officers */}
              <div id="team" className="rounded-3xl border border-[#0b2e1e]/10 bg-white p-8 shadow-sm sm:p-10 lg:col-span-7">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                  Elected Leadership
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#0b2e1e] sm:text-3xl">
                  {t("leadershipTitle")}
                </h2>
                <p className="mt-2 text-sm text-[#4b5563]">
                  Elected committee representatives serving the Buhary Jummah Mosque area under collective shura consultation.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {executiveOfficers.map((officer, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-2xl border border-[#0b2e1e]/10 bg-[#fbfaf6] p-5 transition-all hover:border-[#0b2e1e]/25 hover:shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b2e1e] font-display text-xs font-bold text-[#d4af37]">
                            {officer.initials}
                          </span>
                          <span className="rounded-full bg-[#e8f3ee] px-2.5 py-0.5 text-[11px] font-semibold text-[#0b2e1e]">
                            {officer.role}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-base font-bold text-[#0b2e1e]">
                          {officer.name}
                        </h3>
                      </div>
                      <a
                        href={`tel:${officer.phone.replace(/\s+/g, "")}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b2e1e] hover:text-[#b8952b]"
                      >
                        <Phone className="h-3.5 w-3.5 text-[#d4af37]" />
                        {officer.phone}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-[#0b2e1e]/10 pt-4 text-center sm:text-left">
                  <Link
                    href="/team"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0b2e1e] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#12422c]"
                  >
                    <span>View All Society Team Profiles</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#d4af37]" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 6: Official Legal Registration & Community Mandate */}
          <ScrollReveal variant="scale">
            <div className="relative overflow-hidden rounded-3xl bg-[#0b2e1e] p-8 text-white shadow-xl sm:p-12 lg:p-14">
              <IslamicPattern
                className="pointer-events-none absolute inset-0 text-white"
                opacity={0.04}
                id="about-registration-seal"
              />
              <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-3 py-1 text-xs font-semibold text-[#d4af37]">
                    <FileCheck className="h-4 w-4" />
                    Official Government Registration
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {t("registrationTitle")}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-[#fbfaf6]/90">
                    {t("registrationText")}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#d4af37]">
                    <span className="font-mono text-sm tracking-wider text-white">
                      DS/TH/SS/VSSO/2023/01
                    </span>
                    <span className="text-white/40">•</span>
                    <span>Thampalakamam DS Division</span>
                    <span className="text-white/40">•</span>
                    <span>Eastern Province, Sri Lanka</span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Link
                    href="/membership"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3.5 text-base font-bold text-[#0b2e1e] shadow-md transition-all hover:bg-[#b8952b]"
                  >
                    Apply for Membership
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/reports"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/20"
                  >
                    Annual Reports & Audits
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </div>
    </>
  );
}
