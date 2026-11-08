"use client";

import * as React from "react";
import Image from "next/image";
import { type TeamMember, resolveMemberPhoto } from "@/content/team";
import { Phone, MessageCircle, Mail, MapPin, Search } from "lucide-react";
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
    responsibilitiesLabel?: string;
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
      <div className="flex flex-col gap-3 border-b border-[#e6e4dc] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-text-muted text-xs font-semibold sm:text-sm">
          <span>
            {translations.filterAll} ({filteredMembers.length})
          </span>
        </div>

        {/* Search Input */}
        <div className="relative w-full shrink-0 sm:w-72">
          <Search className="text-text-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="border-border bg-surface text-text placeholder:text-text-muted/70 focus:border-primary focus:ring-primary w-full rounded-full border py-2 pr-4 pl-10 text-xs shadow-2xs focus:ring-1 focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="border-border text-text-muted rounded-2xl border border-dashed p-12 text-center">
          <p className="text-sm font-medium">{translations.noResults}</p>
        </div>
      )}

      {/* Team Cards Grid: Responsive 4-Column Directory */}
      <ScrollRevealGroup
        staggerMs={40}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filteredMembers.map((member) => {
          const roleLabel = member.role[locale] || member.role.en;
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
              className={`group bg-surface relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl ${
                member.isInactive
                  ? "border-amber-500/35 hover:border-amber-500/60"
                  : "hover:border-primary/40 border-[#e6e4dc]"
              }`}
            >
              {/* Card Header & Photo (Refined Portrait 4:5 with Balanced Height) */}
              <div className="relative">
                {/* Photo container */}
                <div className="relative aspect-[3/4] max-h-[360px] w-full overflow-hidden bg-[#0c2e1e] sm:max-h-[380px]">
                  {member.photo ? (
                    <Image
                      src={resolveMemberPhoto(member.photo) || ""}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0c2e1e] via-[#082015] to-[#04120c]">
                      <div className="font-display flex h-20 w-20 items-center justify-center rounded-2xl border border-[#c99a45]/30 bg-[#c99a45]/15 text-2xl font-bold tracking-wider text-[#f5eedf]">
                        {member.initials}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <IslamicPattern
                    opacity={0.05}
                    className="pointer-events-none text-[#d4af37]"
                  />

                  {/* Top-Left: Volunteer Ribbon if member is a volunteer */}
                  {member.category === "volunteer" && (
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center sm:top-3 sm:left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#c99a45] px-2.5 py-0.5 text-[10px] font-bold text-[#041a10] shadow-xs ring-1 ring-[#c99a45]/60 backdrop-blur-xs">
                        <span>Volunteer</span>
                      </span>
                    </div>
                  )}

                  {/* Status Badge on Photo (Active vs Temporary Inactive) */}
                  <div className="absolute top-2.5 right-2.5 flex items-center sm:top-3 sm:right-3">
                    {member.isInactive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/90 px-2.5 py-0.5 text-[10px] font-bold text-amber-200 shadow-xs ring-1 ring-amber-500/50 backdrop-blur-xs">
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
                  <div className="absolute right-3 bottom-2.5 left-3 flex items-end gap-2.5 sm:right-3.5 sm:bottom-3 sm:left-3.5">
                    <div className="font-display ring-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#124d34] to-[#041a10] text-xs font-bold text-[#f5eedf] shadow-md ring-[#c99a45]/60 sm:h-11 sm:w-11 sm:rounded-2xl sm:text-sm">
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1 text-white">
                      <span className="block inline-block max-w-full truncate text-[10px] font-medium tracking-wider text-[#d4a359] uppercase sm:text-[11px]">
                        {roleLabel}
                      </span>
                      <h3 className="font-display truncate text-base leading-tight font-bold tracking-tight text-white sm:text-lg">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between gap-3.5 p-4 sm:p-5">
                {/* Meta details */}
                <div className="flex-1 space-y-2">
                  {/* Address */}
                  <div className="text-text-muted flex items-start gap-2 text-xs">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c99a45]" />
                    <span className="line-clamp-2 leading-relaxed">
                      {member.address}
                    </span>
                  </div>

                  {/* Email contact if available */}
                  {member.email ? (
                    <div className="text-text-muted flex items-center gap-2 text-xs">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-[#c99a45]" />
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-primary truncate text-[11px] font-medium transition-colors"
                        title={member.email}
                      >
                        {member.email}
                      </a>
                    </div>
                  ) : null}
                </div>

                {/* Direct Action Buttons */}
                <div className="border-border mt-auto border-t pt-3">
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
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#124d34] px-2.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#0b2e1e]"
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
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
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
                        className="border-border bg-surface hover:bg-muted text-text-muted hover:text-text inline-flex items-center justify-center rounded-lg border p-1.5 transition-colors"
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
