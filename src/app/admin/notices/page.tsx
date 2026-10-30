import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  NoticesManager,
  type NoticeRecord,
} from "@/components/admin/notices-manager";
import { Megaphone, ArrowLeft } from "lucide-react";

export default async function AdminNoticesPage() {
  await getAdminSession();

  let notices: NoticeRecord[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("notices")
        .select(
          "id, title, body, locale, published_at, is_published, created_at"
        )
        .order("published_at", { ascending: false });

      if (!error && data) {
        notices = data;
      }
    } catch (err) {
      console.warn("Failed to fetch notices:", err);
    }
  } else {
    notices = [
      {
        id: "notice-1",
        title: "Annual Shramadhana Program at Mahallah Cemetery Grounds",
        body: "We invite all youth, volunteers, and community members to participate in the upcoming seasonal clean-up and maintenance of the Mahallah cemetery grounds. Refreshments and tools will be provided by the society.",
        locale: "en",
        published_at: "2026-03-01T08:00:00Z",
        is_published: true,
      },
      {
        id: "notice-2",
        title: "மஹல்லா மையவாடி சிரமதானப் பணி அழைப்பு",
        body: "எமது மஹல்லா மையவாடியை துப்புரவு செய்யும் வருடாந்த சிரமதானப் பணியில் அனைத்து இளைஞர்களையும் பொதுமக்களையும் பங்குபற்றுமாறு அன்புடன் அழைக்கின்றோம். உபகரணங்கள் மற்றும் சிற்றுண்டிகள் சங்கத்தினால் வழங்கப்படும்.",
        locale: "ta",
        published_at: "2026-03-01T08:00:00Z",
        is_published: true,
      },
      {
        id: "notice-3",
        title: "සුසාන භූමි වාර්ෂික ශ්‍රමදාන වැඩසටහන",
        body: "මහල්ල සුසාන භූමිය පිරිසිදු කිරීමේ වාර්ෂික ශ්‍රමදාන කටයුතු සඳහා සහභාගී වන ලෙස ප්‍රජාවට ආරාධනා කරමු. සියලු උපකරණ සහ ප්‍රබෝධක සමිතිය විසින් සපයනු ලැබේ.",
        locale: "si",
        published_at: "2026-03-01T08:00:00Z",
        is_published: true,
      },
    ];
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
                Announcements
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34]">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                  Community Bulletins &amp; Notices
                </h1>
                <p className="text-xs text-[#6b7280] sm:text-sm">
                  Broadcast Janaza announcements, Shramadhana alerts, and community notices in Tamil, English, and Sinhala.
                </p>
              </div>
            </div>
          </div>
        </div>

        <NoticesManager initialNotices={notices} />
      </div>
    </div>
  );
}
