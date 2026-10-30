import { getAdminSession } from "@/lib/admin-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import {
  NoticesManager,
  type NoticeRecord,
} from "@/components/admin/notices-manager";

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
        title: "Annual Shramadhana Program at Mahallah Cemetery",
        body: "We invite all youth and community members to participate in the upcoming seasonal clean-up and maintenance of the Mahallah cemetery grounds.",
        locale: "en",
        published_at: "2026-03-01T08:00:00Z",
        is_published: true,
      },
      {
        id: "notice-2",
        title: "மஹல்லா மையவாடி சிரமதானப் பணி அழைப்பு",
        body: "எமது மஹல்லா மையவாடியை துப்புரவு செய்யும் வருடாந்த சிரமதானப் பணியில் அனைத்து இளைஞர்களையும் பொதுமக்களையும் பங்குபற்றுமாறு அன்புடன் அழைக்கின்றோம்.",
        locale: "ta",
        published_at: "2026-03-01T08:00:00Z",
        is_published: true,
      },
      {
        id: "notice-3",
        title: "සුසාන භූමි වාර්ෂික ශ්‍රමදාන වැඩසටහන",
        body: "මහල්ල සුසාන භූමිය පිරිසිදු කිරීමේ වාර්ෂික ශ්‍රමදාන කටයුතු සඳහා සහභාගී වන ලෙස ප්‍රජාවට ආරාධනා කරමු.",
        locale: "si",
        published_at: "2026-03-01T08:00:00Z",
        is_published: true,
      },
    ];
  }

  return (
    <div className="py-8 sm:py-10">
      <Container size="xl">
        <header className="mb-8">
          <div className="border-primary/20 text-primary mb-2 inline-flex items-center gap-2 rounded-full border bg-[#e8f3ee] px-3 py-0.5 text-xs font-semibold">
            <span>Community Bulletin</span>
          </div>
          <h1 className="text-text text-2xl font-bold tracking-tight sm:text-3xl">
            Community Notices & Announcements
          </h1>
          <p className="text-text-muted mt-1 text-xs sm:text-sm">
            Publish, edit, and target community bulletins for Tamil, English,
            and Sinhala audiences.
          </p>
        </header>

        <NoticesManager initialNotices={notices} />
      </Container>
    </div>
  );
}
