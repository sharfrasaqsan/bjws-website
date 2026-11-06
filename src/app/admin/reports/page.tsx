import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getAdminSession } from "@/lib/admin-auth";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  ReportsManager,
  type ReportRecord,
} from "@/components/admin/reports-manager";
import { FileText, ArrowLeft } from "lucide-react";

export default async function AdminReportsPage() {
  await getAdminSession();

  let reports: ReportRecord[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from("reports")
        .select(
          "id, title, year, file_path, file_size, is_published, created_at"
        )
        .order("year", { ascending: false });

      if (!error && data) {
        reports = data;
      }
    } catch (err) {
      console.warn("Failed to fetch reports:", err);
    }
  } else {
    reports = [];
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
                Financial Reports &amp; Storage
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5eedf] text-[#8b651e]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                  Audited Reports &amp; Storage
                </h1>
                <p className="text-xs text-[#6b7280] sm:text-sm">
                  Upload annual financial reports and official documentation directly to Supabase Storage for community transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ReportsManager initialReports={reports} />
      </div>
    </div>
  );
}
