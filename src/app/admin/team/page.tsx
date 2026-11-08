import { Metadata } from "next";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getAllTeamMembersAdmin,
  type TeamMember,
  findKnownMember,
  ASSIGNED_MEMBER_IDS,
  ASSIGNED_VERIFICATION_TOKENS,
  ASSIGNED_NIC_NUMBERS,
  resolveMemberPhoto,
  calculateExpiryDate,
} from "@/content/team";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { TeamManager } from "@/components/admin/team-manager";
import { UserCheck, ArrowLeft, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Executive Committee Directory | BJWS Admin",
  description:
    "Manage elected officers, executive council, and department leads of Buhary Janaza Welfare Society.",
};

export default async function AdminTeamPage() {
  await getAdminSession();

  let members: TeamMember[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .neq("category", "volunteer")
        .order("created_at", { ascending: true });

      if (!error && data) {
        members = data.map((d, idx) => {
          const raw = d as Record<string, unknown>;
          const known = findKnownMember({
            id: d.id,
            name: d.name,
            memberId: raw.member_id as string,
          });

          return {
            id: d.id,
            name: d.name,
            role: {
              en: d.role_en,
              ta: d.role_ta || d.role_en,
              si: d.role_si || d.role_en,
            },
            category: (d.category as TeamMember["category"]) || "operations",
            categoryLabel: {
              en: d.category || "Committee",
              ta: "செயற்குழு",
              si: "කමිටුව",
            },
            phone: d.phone,
            whatsapp: d.whatsapp || undefined,
            email: d.email || undefined,
            address: d.address,
            initials: d.initials,
            photo: resolveMemberPhoto(d.photo || undefined),
            term: d.term,
            isInactive: d.is_inactive,
            memberId:
              (raw.member_id as string) ||
              known?.memberId ||
              ASSIGNED_MEMBER_IDS[d.id] ||
              `BJWS${(idx + 1).toString().padStart(3, "0")}`,
            nic:
              (raw.nic as string) ||
              known?.nic ||
              ASSIGNED_NIC_NUMBERS[d.id] ||
              `19${(70 + (idx % 25)).toString()}${((idx + 11) * 1234567).toString().slice(0, 8)}`,
            verificationToken:
              (raw.verification_token as string) ||
              known?.token ||
              ASSIGNED_VERIFICATION_TOKENS[d.id] ||
              `vtok_${d.id}_${(100000 + idx * 7391).toString(36)}`,
            verificationStatus:
              (raw.verification_status as TeamMember["verificationStatus"]) ||
              (d.is_inactive ? "suspended" : "verified"),
            issueDate: (raw.issue_date as string) || "2026-01-01",
            expiryDate: calculateExpiryDate(
              (raw.issue_date as string) || "2026-01-01",
              3
            ),
          };
        });
      }
    } catch (err) {
      console.warn(
        "Could not query Supabase team_members table, using fallback store:",
        err
      );
      members = getAllTeamMembersAdmin().filter(
        (m) => m.category !== "volunteer"
      );
    }
  } else {
    members = getAllTeamMembersAdmin().filter(
      (m) => m.category !== "volunteer"
    );
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#124d34] hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
              <span className="text-[#cbd5e1]">/</span>
              <span className="text-xs font-medium text-[#6b7280]">
                Committee Directory
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34]">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                  Executive Committee Directory
                </h1>
                <p className="text-xs text-[#6b7280] sm:text-sm">
                  Manage elected officers, executive council, and department
                  leads of Buhary Janaza Welfare Society.
                </p>
              </div>
            </div>
          </div>

          {/* Quick link to separate Volunteers management */}
          <Link
            href="/admin/volunteers"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#c99a45]/40 bg-[#c99a45]/15 px-4 py-2.5 text-xs font-semibold text-[#8b651e] transition-colors hover:bg-[#c99a45]/25 dark:text-[#f5d78e]"
          >
            <HeartHandshake className="h-4 w-4 text-[#c99a45]" />
            <span>Manage Youth Volunteers &rarr;</span>
          </Link>
        </div>

        {/* Main Client Manager */}
        <TeamManager initialMembers={members} mode="committee" />
      </div>
    </div>
  );
}
