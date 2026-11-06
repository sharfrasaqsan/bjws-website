import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMemberByVerification, type TeamMember } from "@/content/team";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { formatGoogleDriveImageUrl } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Official Credential Verification | Buhary Janaza Welfare Society",
  description: "Official digital identity and credential verification portal for BJWS representatives.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function CredentialVerificationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string; token?: string }>;
}) {
  const { locale } = await params;
  const { id, token } = await searchParams;

  let member: TeamMember | null = id && token ? getMemberByVerification(id, token) : null;

  if (!member && id && token && isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("team_members") as any)
        .select("*")
        .or(`id.eq.${id},member_id.ilike.${id}`)
        .eq("verification_token", token)
        .single();
      if (data) {
        const raw = data as Record<string, unknown>;
        member = {
          id: data.id,
          name: data.name,
          role: {
            en: data.role_en,
            ta: data.role_ta || data.role_en,
            si: data.role_si || data.role_en,
          },
          category: (data.category as TeamMember["category"]) || "operations",
          categoryLabel: {
            en: data.category || "Committee",
            ta: "செயற்குழு",
            si: "කමිටුව",
          },
          phone: data.phone,
          whatsapp: data.whatsapp || undefined,
          email: data.email || undefined,
          address: data.address,
          initials: data.initials,
          photo: data.photo || undefined,
          term: data.term,
          isInactive: data.is_inactive,
          memberId: (raw.member_id as string) || id,
          nic: (raw.nic as string) || "Pending NIC",
          verificationToken: (raw.verification_token as string) || token,
          verificationStatus:
            (raw.verification_status as TeamMember["verificationStatus"]) ||
            (data.is_inactive ? "suspended" : "verified"),
          issueDate: (raw.issue_date as string) || "2024-01-01",
        };
      }
    } catch {
      // fallback
    }
  }
  const currentTimestamp = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Colombo",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-[#072115] text-[#fbfaf6] py-10 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Subtle Guilloche / Geometric Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #c99a45 2%, transparent 0%), radial-gradient(circle at 75px 75px, #c99a45 2%, transparent 0%)`,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative w-full max-w-xl z-10 space-y-6">
        {/* TOP BRAND HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-[#c99a45]/30 p-2 shadow-xl mx-auto">
            <Image
              src="/images/bjws logo.webp"
              alt="BJWS Emblem"
              width={64}
              height={64}
              priority
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
              BUHARY JANAZA WELFARE SOCIETY
            </h1>
            <p className="text-xs text-[#c99a45] font-semibold tracking-wider uppercase">
              புஹாரி ஜனாஸா நலன்புரிச் சங்கம் &bull; Government Reg: TR/131/2023
            </p>
            <p className="text-[11px] text-white/60 font-mono mt-0.5">
              Official Digital Credential & Field Verification System
            </p>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {[
              { code: "en", label: "English" },
              { code: "ta", label: "தமிழ்" },
              { code: "si", label: "සිංහල" },
            ].map((lang) => (
              <Link
                key={lang.code}
                href={`/${lang.code}/verify/credential?id=${encodeURIComponent(id || "")}&token=${encodeURIComponent(token || "")}`}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                  locale === lang.code
                    ? "bg-[#c99a45] text-[#072115] shadow-xs"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {lang.label}
              </Link>
            ))}
          </div>
        </div>

        {/* VERIFICATION CARD */}
        {member ? (
          <div className="rounded-3xl border-2 border-[#c99a45] bg-[#0c2f1f] shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Holographic Status Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 px-5 py-3 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                </span>
                <span className="font-serif text-xs sm:text-sm font-bold tracking-wider uppercase">
                  Active Verified Member & Official
                </span>
              </div>
              <ShieldCheck className="h-5 w-5 text-white shrink-0" />
            </div>

            {/* Main Credential Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Officer Photo & ID Number */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="relative h-28 w-28 shrink-0 rounded-2xl overflow-hidden border-2 border-[#c99a45] shadow-xl bg-black/40">
                  {member.photo ? (
                    <Image
                      src={formatGoogleDriveImageUrl(member.photo)}
                      alt={member.name}
                      fill
                      priority
                      unoptimized={member.photo.includes("googleusercontent.com")}
                      className="object-cover object-top"
                      sizes="112px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[#c99a45] font-serif">
                      {member.initials}
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 bg-emerald-600 rounded-full p-1 text-white shadow-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#c99a45]/20 border border-[#c99a45]/50 px-3 py-0.5 text-xs font-mono font-bold text-[#f5d78e]">
                    <Sparkles className="h-3 w-3" />
                    <span>ID: {member.memberId || "BJWS000"}</span>
                  </div>

                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {member.name}
                    </h2>
                    <p className="font-sans text-sm font-semibold text-[#c99a45]">
                      {member.role.en}
                      {member.role.ta && (
                        <span className="text-white/80 font-normal"> &bull; {member.role.ta}</span>
                      )}
                    </p>
                    <p className="text-xs text-white/60">
                      {member.categoryLabel.en} ({member.categoryLabel.ta})
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Credential Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs">
                {/* National Identity Card (NIC) */}
                <div className="rounded-xl bg-black/30 p-3 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
                    National ID (NIC)
                  </span>
                  <p className="font-mono text-sm font-semibold text-[#f5d78e]">
                    {member.nic || "Registered with Secretariat"}
                  </p>
                </div>

                {/* Term of Service */}
                <div className="rounded-xl bg-black/30 p-3 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
                    Tenure / Term
                  </span>
                  <p className="font-sans text-sm font-semibold text-white">
                    {member.term}
                  </p>
                </div>

                {/* Issue Date */}
                <div className="rounded-xl bg-black/30 p-3 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
                    Official Issue Date
                  </span>
                  <p className="font-mono text-xs text-white/90 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#c99a45]" />
                    <span>{member.issueDate || "2024-01-01"}</span>
                  </p>
                </div>

                {/* Official Contact */}
                <div className="rounded-xl bg-black/30 p-3 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
                    Official Telephone
                  </span>
                  <p className="font-mono text-xs text-white/90 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#c99a45]" />
                    <a href={`tel:${member.phone.replace(/\s+/g, "")}`} className="hover:underline">
                      {member.phone}
                    </a>
                  </p>
                </div>
              </div>

              {/* Society Address & Issuing Jurisdiction */}
              <div className="rounded-2xl bg-black/40 p-4 border border-[#c99a45]/20 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-white/80">
                  <MapPin className="h-4 w-4 text-[#c99a45] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Jurisdiction: </span>
                    <span>Thambalagamuwa DS Division &bull; Mullipothana, Trincomalee, Sri Lanka</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-white/80">
                  <Building className="h-4 w-4 text-[#c99a45] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Official Authority: </span>
                    <span>Authorized to represent the society in community affairs, funeral relief, and official administrative engagements.</span>
                  </div>
                </div>
              </div>

              {/* Security Status & Live Timestamp */}
              <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 p-3.5 space-y-1 text-[11px] font-mono text-emerald-200/90">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Server Authentication Timestamp</span>
                  </span>
                  <span>SSL 256-Bit Secure</span>
                </div>
                <p className="text-white font-semibold">{currentTimestamp} (Sri Lanka Standard Time)</p>
              </div>

              {/* Direct Verification Call & Confirmation */}
              <div className="pt-2 text-center space-y-3">
                <p className="text-xs text-white/70">
                  Questions regarding this official credential? Contact the Secretariat directly:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="tel:+94772782829"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#124d34] hover:bg-[#0b2e1e] text-white px-4 py-2 text-xs font-bold border border-[#c99a45]/40 shadow-xs transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#c99a45]" />
                    <span>Call Secretariat: 077 278 2829</span>
                  </a>

                  <a
                    href="mailto:bjwsociety@gmail.com"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-white/70" />
                    <span>Email Inquiries</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* INVALID / UNVERIFIED CREDENTIAL ALERT */
          <div className="rounded-3xl border-2 border-red-500/70 bg-[#260c0c] shadow-2xl p-6 sm:p-8 space-y-5 text-center backdrop-blur-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/20 text-red-400 mx-auto border border-red-500/30">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-red-200 tracking-tight">
                UNVERIFIED OR INVALID CREDENTIAL
              </h2>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                செல்லுபடியற்ற அல்லது அங்கீகரிக்கப்படாத சான்றிதழ்
              </p>
              <p className="text-xs text-white/80 max-w-md mx-auto leading-relaxed pt-2">
                This verification link is invalid, has expired, or was revoked by the Buhary Janaza Welfare Society administration.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 p-4 border border-red-500/20 text-left text-xs space-y-2 text-white/80">
              <p className="font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <span>Security Notice:</span>
              </p>
              <p>
                To verify an official representative of BJWS, please scan the authentic physical QR code printed on their authorized society identity card.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-xs text-white/70">
                To report fraud or confirm membership status manually, call our General Secretariat:
              </p>
              <a
                href="tel:+94772782829"
                className="inline-flex items-center gap-2 rounded-xl bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 text-xs font-bold shadow-md transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>Call Hotline: 077 278 2829</span>
              </a>
            </div>
          </div>
        )}

        {/* FOOTER NOTE */}
        <div className="text-center text-[11px] text-white/40 space-y-1 font-mono">
          <p>&copy; {new Date().getFullYear()} Buhary Janaza Welfare Society (BJWS). All rights reserved.</p>
          <p>Mullipothana, Thambalagamuwa DS, Trincomalee District, Sri Lanka.</p>
        </div>
      </div>
    </div>
  );
}
