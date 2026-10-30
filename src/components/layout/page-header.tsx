import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  imageSrc?: string;
  imageAlt?: string;
  breadcrumbs: BreadcrumbItem[];
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  imageSrc = "/images/gallery/shramadana-01.webp",
  imageAlt = "Buhary Janaza Welfare Society",
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-[#072115] text-white py-12 sm:py-16 lg:py-20 border-b border-emerald-950">
      {/* Real background photography with deep evergreen overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#062115]/98 via-[#0b2e1e]/92 to-[#072518]/95" />
      </div>

      {/* Subtle Islamic lattice texture */}
      <IslamicPattern
        opacity={0.06}
        className="text-[#d4a359] z-10 pointer-events-none"
      />

      <Container size="xl" className="relative z-20">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-emerald-200/80 font-medium"
        >
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <ChevronRight
                    className="h-3 w-3 text-emerald-400/60"
                    aria-hidden="true"
                  />
                )}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {idx === 0 && <Home className="h-3 w-3" />}
                    <span>{crumb.label}</span>
                  </Link>
                ) : (
                  <span
                    className={
                      isLast ? "text-white font-semibold" : "text-emerald-200/80"
                    }
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Optional Eyebrow badge */}
        {eyebrow && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-3 py-0.5 text-xs font-semibold text-[#d4a359] shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4a359]" />
              {eyebrow}
            </span>
          </div>
        )}

        {/* Page Title */}
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight max-w-4xl">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-4 text-xs sm:text-sm lg:text-base text-emerald-100/85 leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </Container>
    </div>
  );
}

