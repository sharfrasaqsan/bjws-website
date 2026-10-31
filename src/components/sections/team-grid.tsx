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

      {/* Team Cards Grid */}
      <ScrollRevealGroup staggerMs={60} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredMembers.map((member) => {
          const roleLabel = member.role[locale] || member.role.en;
          const responsibilitiesList =
            member.responsibilities[locale] || member.responsibilities.en;
          const bioText = member.bio[locale] || member.bio.en;

          return (
            <article
              key={member.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6e4dc] bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl h-full"
            >
              {/* Card Header & Photo */}
              <div className="relative">
                {/* Photo container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c2e1e]">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <IslamicPattern
                    opacity={0.05}
                    className="pointer-events-none text-[#d4af37]"
                  />

                  {/* Active Status Badge on Photo */}
                  <div className="absolute top-3 right-3 flex items-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30 backdrop-blur-xs">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      <span>{translations.activeBadge}</span>
                    </span>
                  </div>

                  {/* Bottom Avatar Monogram & Name Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#124d34] to-[#041a10] font-display text-sm font-bold text-[#f5eedf] shadow-lg ring-2 ring-[#c99a45]/60">
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1 text-white">
                      <span className="inline-block text-[11px] font-medium text-[#d4a359] uppercase tracking-wider">
                        {roleLabel}
                      </span>
                      <h3 className="truncate font-display text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-4">
                {/* Meta details */}
                <div className="space-y-3">
                  {/* Address */}
                  <div className="flex items-start gap-2 text-xs text-text-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#c99a45] mt-0.5" />
                    <span className="leading-relaxed">{member.address}</span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
                    {bioText}
                  </p>

                  {/* Responsibilities */}
                  <div className="rounded-xl border border-border bg-surface-muted/60 p-3 space-y-2 min-h-[110px] flex flex-col justify-start">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {translations.responsibilitiesLabel}
                    </div>
                    <ul className="space-y-1.5 flex-1">
                      {responsibilitiesList.slice(0, 3).map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[11px] text-text leading-snug"
                        >
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-[#c99a45] mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="border-t border-border pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Call Direct */}
                    <a
                      href={`tel:${member.phone.replace(/\s+/g, "")}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#124d34] hover:bg-[#0b2e1e] text-white px-3 py-2 text-xs font-semibold shadow-2xs transition-colors"
                      title={`${translations.callButton} ${member.name}`}
                    >
                      <Phone className="h-3 w-3 text-[#d4af37]" />
                      <span>{translations.callButton}</span>
                    </a>

                    {/* WhatsApp Direct */}
                    {member.whatsapp && (
                      <a
                        href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Assalamu Alaikum ${member.name}, I am contacting you regarding Buhary Janaza Welfare Society.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 px-3 py-2 text-xs font-semibold transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    {/* Email */}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}?subject=Inquiry to ${encodeURIComponent(
                          member.name
                        )} - BJWS`}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-surface hover:bg-muted text-text-muted hover:text-text p-2 transition-colors"
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

