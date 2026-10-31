"use client";

import * as React from "react";
import Image from "next/image";
import { type TeamMember } from "@/content/team";
import { Phone, MessageCircle, Mail, MapPin, CheckCircle2, Search } from "lucide-react";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { ScrollRevealGroup } from "@/components/ui/scroll-reveal";

interface TeamGridProps {
  members: TeamMember[];
  locale: "en" | "ta" | "si";
  translations: {
    searchPlaceholder: string;
    filterAll: string;
    callButton: string;
    whatsappButton: string;
    responsibilitiesLabel: string;
    termLabel: string;
    addressLabel: string;
    noResults: string;
    activeBadge: string;
    inactiveBadge?: string;
  };
}

export function TeamGrid({ members, locale, translations }: TeamGridProps) {
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredMembers = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return members;

    return members.filter((m) => {
      const nameMatch = m.name.toLowerCase().includes(q);
      const roleMatch = (m.role[locale] || m.role.en).toLowerCase().includes(q);
      const addressMatch = m.address.toLowerCase().includes(q);
      const phoneMatch = m.phone.includes(q);

      return nameMatch || roleMatch || addressMatch || phoneMatch;
    });
  }, [members, searchQuery, locale]);

  return (
    <div className="space-y-8">
      {/* Controls Strip: Member Count and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#e6e4dc] pb-6">
        <div className="text-xs sm:text-sm font-semibold text-text-muted">
          <span>{translations.filterAll} ({filteredMembers.length})</span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="w-full rounded-full border border-border bg-surface pl-10 pr-4 py-2 text-xs sm:text-sm text-text placeholder:text-text-muted/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-text-muted">
          <p className="text-sm font-medium">{translations.noResults}</p>
        </div>
      )}

      {/* Team Cards Grid: Responsive 4-Column Directory */}
      <ScrollRevealGroup
        staggerMs={40}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
      >
        {filteredMembers.map((member) => {
          const roleLabel = member.role[locale] || member.role.en;
          const responsibilitiesList =
            member.responsibilities[locale] || member.responsibilities.en;
          const inactiveLabel =
            translations.inactiveBadge ||
            (locale === "ta"
              ? "தற்காலிக இடைநிறுத்தம்"
              : locale === "si"
              ? "තාවකාලිකව අක්‍රියයි"
              : "Temporary Inactive");

          return (
            <article
              key={member.id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full ${
                member.isInactive
                  ? "border-amber-500/35 hover:border-amber-500/60"
                  : "border-[#e6e4dc] hover:border-primary/40"
              }`}
            >
              {/* Card Header & Photo (Refined Portrait 4:5 with Balanced Height) */}
              <div className="relative">
                {/* Photo container */}
                <div className="relative aspect-[3/4] max-h-[360px] sm:max-h-[380px] w-full overflow-hidden bg-[#0c2e1e]">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0c2e1e] via-[#082015] to-[#04120c]">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#c99a45]/15 border border-[#c99a45]/30 text-[#f5eedf] font-display text-2xl font-bold tracking-wider">
                        {member.initials}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <IslamicPattern
                    opacity={0.05}
                    className="pointer-events-none text-[#d4af37]"
                  />

                  {/* Status Badge on Photo (Active vs Temporary Inactive) */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center">
                    {member.isInactive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/90 px-2.5 py-0.5 text-[10px] font-bold text-amber-200 ring-1 ring-amber-500/50 backdrop-blur-xs shadow-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span>{inactiveLabel}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30 backdrop-blur-xs">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        <span>{translations.activeBadge}</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Avatar Monogram & Name Overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 sm:bottom-3 sm:left-3.5 sm:right-3.5 flex items-end gap-2.5">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#124d34] to-[#041a10] font-display text-xs sm:text-sm font-bold text-[#f5eedf] shadow-md ring-1.5 ring-[#c99a45]/60">
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1 text-white">
                      <span className="inline-block text-[10px] sm:text-[11px] font-medium text-[#d4a359] uppercase tracking-wider truncate max-w-full block">
                        {roleLabel}
                      </span>
                      <h3 className="truncate font-display text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-3.5">
                {/* Meta details */}
                <div className="space-y-2.5">
                  {/* Address */}
                  <div className="flex items-start gap-1.5 text-xs text-text-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#c99a45] mt-0.5" />
                    <span className="leading-relaxed line-clamp-1">{member.address}</span>
                  </div>

                  {/* Responsibilities */}
                  <div className="rounded-xl border border-border bg-surface-muted/60 p-2.5 sm:p-3 space-y-1.5 min-h-[95px] flex flex-col justify-start">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {translations.responsibilitiesLabel}
                    </div>
                    <ul className="space-y-1 flex-1">
                      {responsibilitiesList.slice(0, 3).map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-[11px] text-text leading-snug"
                        >
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-[#c99a45] mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="border-t border-border pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Call Direct or Inactive Notice */}
                    {member.isInactive ? (
                      <div className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-200">
                        <Phone className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        <span>{inactiveLabel}</span>
                      </div>
                    ) : (
                      <a
                        href={`tel:${member.phone.replace(/\s+/g, "")}`}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#124d34] hover:bg-[#0b2e1e] text-white px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors"
                        title={`${translations.callButton} ${member.name}`}
                      >
                        <Phone className="h-3 w-3 text-[#d4af37]" />
                        <span>{translations.callButton}</span>
                      </a>
                    )}

                    {/* WhatsApp Direct (Active members only) */}
                    {!member.isInactive && member.whatsapp && (
                      <a
                        href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Assalamu Alaikum ${member.name}, I am contacting you regarding Buhary Janaza Welfare Society.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 px-2.5 py-1.5 text-xs font-semibold transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    {/* Email */}
                    {!member.isInactive && member.email && (
                      <a
                        href={`mailto:${member.email}?subject=Inquiry to ${encodeURIComponent(
                          member.name
                        )} - BJWS`}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-surface hover:bg-muted text-text-muted hover:text-text p-1.5 transition-colors"
                        title={member.email}
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </ScrollRevealGroup>
    </div>
  );
}

