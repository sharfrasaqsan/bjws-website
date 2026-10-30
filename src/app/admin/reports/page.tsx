import { getAdminSession } from "@/lib/admin-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import {
  ReportsManager,
  type ReportRecord,
} from "@/components/admin/reports-manager";

export default async function AdminReportsPage() {
  await getAdminSession();

  let reports: ReportRecord[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
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
    reports = [
      {
        id: "rep-2024",
        title: "Annual Activities & Financial Summary Report 2024",
        year: 2024,
        file_path: "/documents/reports/bjws-annual-report-2024.pdf",
        file_size: "1.8 MB",
        is_published: true,
      },
      {
        id: "rep-2023",
        title: "Foundational Activities & Welfare Overview 2023",
        year: 2023,
        file_path: "/documents/reports/bjws-annual-report-2023.pdf",
        file_size: "1.4 MB",
        is_published: true,
      },
    ];
  }

  return (
    <div className="py-8 sm:py-10">
      <Container size="xl">
        <header className="mb-8">
          <div className="border-primary/20 text-primary mb-2 inline-flex items-center gap-2 rounded-full border bg-[#e8f3ee] px-3 py-0.5 text-xs font-semibold">
            <span>Financial Transparency</span>
          </div>
          <h1 className="text-text text-2xl font-bold tracking-tight sm:text-3xl">
            Audited Reports & Storage
          </h1>
          <p className="text-text-muted mt-1 text-xs sm:text-sm">
            Upload annual financial reports to Supabase Storage and publish
            documentation for community transparency.
          </p>
        </header>

        <ReportsManager initialReports={reports} />
      </Container>
    </div>
  );
}
