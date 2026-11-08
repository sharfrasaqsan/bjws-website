import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  Heart,
  Globe,
  Code2,
} from "lucide-react";

export function Footer() {
  const t = useTranslations();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/team", label: t("nav.team") },
    { href: "/services", label: t("nav.services") },
    { href: "/news", label: t("nav.news") },
    { href: "/achievements", label: t("nav.achievements") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/membership", label: t("nav.membership") },
    { href: "/reports", label: t("nav.reports") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const serviceItems = [
    { label: t("servicesPage.service1Title"), href: "/services" },
    { label: t("servicesPage.service2Title"), href: "/services" },
    { label: t("servicesPage.service3Title"), href: "/services" },
    { label: t("servicesPage.service4Title"), href: "/services" },
    { label: t("servicesPage.service5Title"), href: "/services" },
    { label: t("servicesPage.service6Title"), href: "/services" },
    { label: t("servicesPage.service7Title"), href: "/services" },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-emerald-950 bg-[#062115] text-emerald-100/90">
      {/* Subtle Islamic lattice background texture */}
      <IslamicPattern
        opacity={0.04}
        className="pointer-events-none text-[#d4a359]"
      />

      <Container size="xl" className="relative z-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Identity & Legal Registration (Col span 4) */}
          <div className="space-y-5 lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-emerald-800/40 bg-white p-1 shadow-2xs">
                <Image
                  src="/images/bjws logo.webp"
                  alt="BJWS Emblem"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-display text-base leading-tight font-bold text-white sm:text-lg">
                  {t("common.societyName")}
                </h3>
                <p className="text-xs font-medium text-[#d4a359]">
                  {t("common.location")} • {t("common.foundedYear")}
                </p>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-emerald-200/80 sm:text-sm">
              {t("footer.tagline")}
            </p>

            {/* Official Registration Box */}
            <div className="space-y-1 rounded-lg border border-white/10 bg-white/5 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4a359]">
                <ShieldCheck className="h-4 w-4" />
                <span>{t("footer.registrationLabel")}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-200/85">
                {t("footer.registrationDetails")}
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links (Col span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-display mb-4 text-xs font-bold tracking-wider text-[#d4a359] uppercase">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-emerald-200/75 transition-colors hover:text-white"
                  >
                    <ChevronRight className="h-3 w-3 text-[#c99a45]" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Community Services (Col span 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-display mb-4 text-xs font-bold tracking-wider text-[#d4a359] uppercase">
              {t("footer.servicesTitle")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {serviceItems.map((service, idx) => (
                <li key={idx}>
                  <Link
                    href={service.href}
                    className="inline-flex items-start gap-2 text-emerald-200/75 transition-colors hover:text-white"
                  >
                    <span className="mt-0.5 text-xs font-bold text-[#c99a45]">
                      •
                    </span>
                    <span className="leading-snug">{service.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#124d34] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#0b2e1e]"
                >
                  <Heart className="h-3.5 w-3.5 fill-white/20" />
                  <span>Support Our Welfare Work</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Registered Office & 24/7 Hotline (Col span 3) */}
          <div className="space-y-4 lg:col-span-3">
            <h4 className="font-display mb-4 text-xs font-bold tracking-wider text-[#d4a359] uppercase">
              {t("footer.registeredOffice")}
            </h4>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* Address */}
              <div className="flex items-start gap-2.5 text-emerald-200/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c99a45]" />
                <address className="text-xs leading-relaxed not-italic">
                  {t("footer.address")}
                </address>
              </div>

              {/* 24/7 Emergency Phone */}
              <div className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <span className="block text-[11px] font-semibold tracking-wider text-amber-300 uppercase">
                    24/7 Emergency Line
                  </span>
                  <a
                    href="tel:+94776227323"
                    className="font-bold text-white transition-colors hover:text-amber-200"
                  >
                    077 622 7323
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-emerald-300" />
                <a
                  href={`mailto:${t("footer.email")}`}
                  className="text-emerald-200/90 transition-colors hover:text-white"
                >
                  {t("footer.email")}
                </a>
              </div>

              {/* Social */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BJWS Facebook Community"
                  className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-emerald-200/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg
                    className="h-3.5 w-3.5 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook Community</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Reg No */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-emerald-900/60 pt-6 text-center text-xs text-emerald-200/70 sm:flex-row sm:text-left">
          <p>© 2026 {t("footer.rights")}</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start sm:gap-4">
            <span className="font-mono text-[#d4a359]">
              {t("common.regNo")}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Mullipothana, Sri Lanka</span>
            <span className="hidden sm:inline">•</span>
            <Link
              href="/privacy"
              className="text-emerald-300/80 underline-offset-2 transition-colors hover:text-white hover:underline"
            >
              {t("nav.privacy") || "Privacy Policy"}
            </Link>
          </div>
        </div>

        {/* Developer Credit & Direct Contact */}
        <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-emerald-950/80 pt-4 text-center text-xs text-emerald-200/70 md:flex-row md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:justify-start">
            <Code2 className="h-3.5 w-3.5 text-[#d4a359]" />
            <span className="text-[11px] text-emerald-200/60">
              Designed & Developed by:
            </span>
            <a
              href="https://linkedin.com/in/sharfiras"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-0.5 font-bold text-[#f5d78e] transition-colors hover:text-white hover:underline"
            >
              A.M. Sharfras Aqsan
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[11px] sm:gap-x-4 md:justify-end">
            <a
              href="tel:+94751230001"
              className="inline-flex items-center gap-1.5 text-emerald-200/80 transition-colors hover:text-white"
              title="Call Developer"
            >
              <Phone className="h-3 w-3 text-[#d4a359]" />
              <span>+94 75 123 0001</span>
            </a>
            <span className="hidden text-emerald-800 sm:inline">•</span>
            <a
              href="mailto:sharfrasaqsan@gmail.com"
              className="inline-flex items-center gap-1.5 text-emerald-200/80 transition-colors hover:text-white"
              title="Email Developer"
            >
              <Mail className="h-3 w-3 text-[#d4a359]" />
              <span>sharfrasaqsan@gmail.com</span>
            </a>
            <span className="hidden text-emerald-800 sm:inline">•</span>
            <a
              href="https://sharfrasaqsan.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#f5d78e] transition-colors hover:text-white hover:underline"
              title="Developer Portfolio"
            >
              <Globe className="h-3 w-3 text-[#d4a359]" />
              <span>sharfrasaqsan.vercel.app</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
