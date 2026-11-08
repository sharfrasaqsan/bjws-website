import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getMemberByVerification,
  resolveMemberPhoto,
  calculateExpiryDate,
  type TeamMember,
} from "@/content/team";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  MapPin,
  Phone,
  Building2,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Official Credential Verification | Buhary Janaza Welfare Society",
  description:
    "Official verification portal for BJWS Executive Committee ID credentials and authorized community personnel.",
  robots: {
    index: false,
    follow: false,
  },
};

interface VerifyPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string; token?: string }>;
}

export default async function CredentialVerificationPage({
  params,
  searchParams,
}: VerifyPageProps) {
  const { locale } = await params;
  const { id, token } = await searchParams;

  const validLocale = locale === "ta" || locale === "si" ? locale : "en";

  let member: TeamMember | null = null;
  const memberCode = id?.trim().toUpperCase() || "";
  const verificationToken = token?.trim() || "";

  // 1. Try Supabase lookup if configured
  if (isSupabaseConfigured() && memberCode) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .or(
          `member_id.ilike.${memberCode},id.ilike.${memberCode.toLowerCase()}`
        )
        .maybeSingle();

      if (!error && data) {
        const raw = data as Record<string, unknown>;
        const dbToken = (raw.verification_token as string) || "";
        // Match token (or if no db token is stored, match known)
        if (!verificationToken || dbToken === verificationToken) {
          const issueDate = (raw.issue_date as string) || "2026-01-01";
          member = {
            id: data.id,
            name: data.name,
            role: {
              en: data.role_en,
              ta: data.role_ta || data.role_en,
              si: data.role_si || data.role_en,
            },
            category: (data.category as TeamMember["category"]) || "executive",
            categoryLabel: {
              en: "Executive Committee",
              ta: "நிர்வாகக் குழு",
              si: "විධායක සභාව",
            },
            phone: data.phone,
            whatsapp: data.whatsapp || undefined,
            email: data.email || undefined,
            address: data.address,
            initials: data.initials,
            photo: resolveMemberPhoto(data.photo || undefined),
            term: data.term || "2023 - 2026",
            isInactive: data.is_inactive,
            memberId: (raw.member_id as string) || memberCode,
            nic: (raw.nic as string) || undefined,
            verificationToken: dbToken,
            verificationStatus:
              (raw.verification_status as TeamMember["verificationStatus"]) ||
              (data.is_inactive ? "suspended" : "verified"),
            issueDate,
            expiryDate: calculateExpiryDate(issueDate, 3),
          };
        }
      }
    } catch (err) {
      console.warn("Supabase verification lookup warning:", err);
    }
  }

  // 2. Fallback to in-memory store & official registry
  if (!member && memberCode) {
    const fromStore = getMemberByVerification(memberCode, verificationToken);
    if (fromStore) {
      member = fromStore;
    }
  }

  const isValid =
    member && !member.isInactive && member.verificationStatus !== "suspended";

  const memberPhoto = member?.photo
    ? resolveMemberPhoto(member.photo)
    : undefined;
  const issueDate = member?.issueDate || "2026-01-01";
  const expiryDate = member?.expiryDate || calculateExpiryDate(issueDate, 3);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faf8] px-4 py-12 sm:px-6 lg:px-8 dark:bg-[#06180e]">
      <div className="w-full max-w-lg space-y-6">
        {/* Verification Status Card */}
        <div className="overflow-hidden rounded-3xl border border-[#c99a45]/40 bg-white shadow-xl dark:bg-[#0b2416]">
          {/* Header Banner */}
          <div
            className={`p-6 text-center text-white ${
              isValid
                ? "bg-gradient-to-br from-[#0f3d29] to-[#124d34]"
                : "bg-gradient-to-br from-red-900 to-amber-950"
            }`}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-xs">
              {isValid ? (
                <ShieldCheck className="h-10 w-10 text-[#f5d78e]" />
              ) : (
                <ShieldAlert className="h-10 w-10 text-red-300" />
              )}
            </div>

            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
              {isValid ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  <span className="text-emerald-200">
                    Verified Official Credential
                  </span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3.5 w-3.5 text-red-300" />
                  <span className="text-red-200">
                    Credential Invalid or Revoked
                  </span>
                </>
              )}
            </div>

            <h1 className="font-serif text-xl font-bold tracking-wide text-white sm:text-2xl">
              Buhary Janaza Welfare Society
            </h1>
            <p className="mt-1 text-xs text-white/70">
              Mullipothana, Sri Lanka &bull; Reg No: DS/TH/SS/VSSO/2023/01
            </p>
          </div>

          {/* Member Details */}
          {member && isValid ? (
            <div className="space-y-6 p-6 sm:p-7">
              {/* Profile Overview */}
              <div className="border-border/60 flex items-center gap-4 border-b pb-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-[#c99a45] bg-[#0c2e1e] shadow-md">
                  {memberPhoto ? (
                    <Image
                      src={memberPhoto}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-serif text-lg font-bold text-[#f5eedf]">
                      {member.initials}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-[#c99a45]/30 bg-[#0b2e1e] px-2 py-0.5 font-mono text-xs font-bold text-[#c99a45]">
                      {member.memberId || memberCode}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 uppercase dark:text-emerald-400">
                      Active Officer
                    </span>
                  </div>
                  <h2 className="text-text mt-1 text-lg font-bold">
                    {member.name}
                  </h2>
                  <p className="text-primary text-xs font-semibold">
                    {member.role[validLocale] || member.role.en}
                  </p>
                </div>
              </div>

              {/* Credential Attributes */}
              <div className="grid grid-cols-1 gap-3.5 text-xs sm:grid-cols-2">
                {member.nic && (
                  <div className="bg-muted/40 border-border/60 rounded-xl border p-3">
                    <span className="text-text-muted block text-[11px] font-bold tracking-wider uppercase">
                      National Identity Card (NIC)
                    </span>
                    <span className="text-text font-mono text-sm font-bold">
                      {member.nic}
                    </span>
                  </div>
                )}

                <div className="bg-muted/40 border-border/60 rounded-xl border p-3">
                  <span className="text-text-muted block text-[11px] font-bold tracking-wider uppercase">
                    Contact Hotline
                  </span>
                  <a
                    href={`tel:${member.phone}`}
                    className="text-primary font-mono text-sm font-bold hover:underline"
                  >
                    {member.phone}
                  </a>
                </div>

                <div className="bg-muted/40 border-border/60 rounded-xl border p-3">
                  <span className="text-text-muted block text-[11px] font-bold tracking-wider uppercase">
                    Issue Date
                  </span>
                  <span className="text-text font-mono text-sm font-bold">
                    {issueDate}
                  </span>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <span className="block text-[11px] font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                    Valid Thru (3 Years)
                  </span>
                  <span className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-200">
                    {expiryDate}
                  </span>
                </div>
              </div>

              {/* Address & Authority Details */}
              <div className="bg-muted/30 border-border/60 space-y-1.5 rounded-xl border p-3.5 text-xs">
                <div className="text-text-muted flex items-start gap-2">
                  <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong className="text-text">Registered Address:</strong>{" "}
                    {member.address}
                  </span>
                </div>
                <div className="text-text-muted flex items-start gap-2">
                  <Building2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong className="text-text">Authority:</strong> Authorized
                    for 24/7 emergency funeral rites, logistics &amp; cemetery
                    welfare coordination.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-6 text-center sm:p-7">
              <p className="text-text-muted text-sm">
                The credential ID <strong>{memberCode || "UNKNOWN"}</strong>{" "}
                could not be verified against the official BJWS registry or has
                been suspended.
              </p>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
                Please contact the BJWS Secretariat immediately if you suspect
                an unauthorized or counterfeit credential.
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="border-border/60 bg-muted/30 flex flex-col items-center justify-between gap-3 border-t p-4 text-xs sm:flex-row sm:p-5">
            <Link
              href={`/${validLocale}`}
              className="text-primary inline-flex items-center gap-1.5 font-bold hover:underline"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <a
              href="tel:0776227323"
              className="flex items-center gap-2 rounded-full bg-[#0b2e1e] px-4 py-2 font-bold text-[#f5d78e] shadow-xs transition-colors hover:bg-[#124d34]"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Emergency: 077 622 7323</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
