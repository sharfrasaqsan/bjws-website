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
import { HeartHandshake, ArrowLeft, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Youth Volunteers Management | BJWS Admin",
  description:
    "Dedicated management for youth volunteers, Shramadhana workers, and field support personnel of Buhary Janaza Welfare Society.",
};

export default async function AdminVolunteersPage() {
  await getAdminSession();

  let volunteers: TeamMember[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("category", "volunteer")
        .order("created_at", { ascending: true });

      if (!error && data) {
        volunteers = data.map((d, idx) => {
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
            category: "volunteer" as TeamMember["category"],
            categoryLabel: {
              en: "Youth Volunteers",
              ta: "இளைஞர் தொண்டர்கள்",
              si: "තරුණ ස්වේච්ඡා සේවකයන්",
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
              `BJWS-VOL-${(idx + 1).toString().padStart(3, "0")}`,
            nic:
              (raw.nic as string) ||
              known?.nic ||
              ASSIGNED_NIC_NUMBERS[d.id] ||
              `199${(80 + (idx % 20)).toString()}${((idx + 15) * 1234567).toString().slice(0, 8)}`,
            verificationToken:
              (raw.verification_token as string) ||
              known?.token ||
              ASSIGNED_VERIFICATION_TOKENS[d.id] ||
              `vtok_vol_${d.id}`,
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
        "Could not query Supabase team_members table for volunteers, using fallback store:",
        err
      );
      volunteers = getAllTeamMembersAdmin().filter(
        (m) => m.category === "volunteer"
      );
    }
  } else {
    volunteers = getAllTeamMembersAdmin().filter(
      (m) => m.category === "volunteer"
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
                Volunteers
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c99a45]/20 text-[#c99a45]">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                  Youth Volunteers &amp; Field Taskforce
                </h1>
                <p className="text-xs text-[#6b7280] sm:text-sm">
                  Dedicated directory for youth volunteers assisting in cemetery
                  maintenance (Shramadhana), Janaza transport, and relief work.
                </p>
              </div>
            </div>
          </div>

          {/* Quick link back to Committee Directory */}
          <Link
            href="/admin/team"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            <UserCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            <span>&larr; Switch to Committee Directory</span>
          </Link>
        </div>

        {/* Dedicated Volunteers Client Manager */}
        <TeamManager initialMembers={volunteers} mode="volunteer" />
      </div>
    </div>
  );
}
