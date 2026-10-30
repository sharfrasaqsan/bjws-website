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
} from "lucide-react";

export function Footer() {
  const t = useTranslations();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
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
  ];

  return (
    <footer className="relative overflow-hidden bg-[#062115] text-emerald-100/90 border-t border-emerald-950 mt-auto">
      {/* Subtle Islamic lattice background texture */}
      <IslamicPattern
        opacity={0.04}
        className="text-[#d4a359] pointer-events-none"
      />

      <Container size="xl" className="relative z-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Identity & Legal Registration (Col span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-emerald-800/40 bg-white p-1 shadow-2xs">
                <Image
                  src="/image/bjws logo.webp"
                  alt="BJWS Emblem"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white leading-tight">
                  {t("common.societyName")}
                </h3>
                <p className="text-xs text-[#d4a359] font-medium">
                  {t("common.location")} • {t("common.foundedYear")}
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              {t("footer.tagline")}
            </p>

            {/* Official Registration Box */}
            <div className="rounded-lg bg-white/5 border border-white/10 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4a359]">
                <ShieldCheck className="h-4 w-4" />
                <span>{t("footer.registrationLabel")}</span>
              </div>
              <p className="text-[11px] text-emerald-200/85 leading-relaxed">
                {t("footer.registrationDetails")}
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links (Col span 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-xs font-bold tracking-wider uppercase text-[#d4a359] mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-emerald-200/75 hover:text-white transition-colors"
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
            <h4 className="font-display text-xs font-bold tracking-wider uppercase text-[#d4a359] mb-4">
              {t("footer.servicesTitle")}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {serviceItems.map((service, idx) => (
                <li key={idx}>
                  <Link
                    href={service.href}
                    className="inline-flex items-start gap-2 text-emerald-200/75 hover:text-white transition-colors"
                  >
                    <span className="text-[#c99a45] font-bold text-xs mt-0.5">•</span>
                    <span className="leading-snug">{service.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#124d34] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#0b2e1e] transition-colors"
                >
                  <Heart className="h-3.5 w-3.5 fill-white/20" />
                  <span>Support Our Welfare Work</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Registered Office & 24/7 Hotline (Col span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display text-xs font-bold tracking-wider uppercase text-[#d4a359] mb-4">
              {t("footer.registeredOffice")}
            </h4>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* Address */}
              <div className="flex items-start gap-2.5 text-emerald-200/80">
                <MapPin className="h-4 w-4 text-[#c99a45] shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed text-xs">
                  {t("footer.address")}
                </address>
              </div>

              {/* 24/7 Emergency Phone */}
              <div className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] text-amber-300 font-semibold uppercase tracking-wider">
                    24/7 Emergency Line
                  </span>
                  <a
                    href="tel:+94753738349"
                    className="text-white hover:text-amber-200 font-bold transition-colors"
                  >
                    075 373 8349
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-emerald-300 shrink-0" />
                <a
                  href={`mailto:${t("footer.email")}`}
                  className="text-emerald-200/90 hover:text-white transition-colors"
                >
                  {t("footer.email")}
                </a>
              </div>

              {/* Social */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BJWS Facebook Community"
                  className="inline-flex items-center gap-2 text-xs text-emerald-200/80 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-white/10 transition-colors"
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
        <div className="mt-12 border-t border-emerald-900/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/70 text-center sm:text-left">
          <p>© 2026 {t("footer.rights")}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4">
            <span className="font-mono text-[#d4a359]">{t("common.regNo")}</span>
            <span className="hidden sm:inline">•</span>
            <span>Mullipothanai, Sri Lanka</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
