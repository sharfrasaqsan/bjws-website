import * as React from "react";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NoticesSectionProps {
  locale: string;
  translations: {
    sectionTitle: string;
    sectionEyebrow: string;
    sectionSubtitle: string;
    emptyMessage: string;
    noticeBadge: string;
  };
}

interface NoticeItem {
  id: string;
  title: string;
  body: string;
  published_at: string;
}

export async function NoticesSection({
  locale,
  translations,
}: NoticesSectionProps) {
  let notices: NoticeItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("notices")
        .select("id, title, body, published_at")
        .eq("is_published", true)
        .eq("locale", locale)
        .order("published_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        notices = data;
      }
    } catch (err) {
      console.warn("Could not fetch notices from Supabase:", err);
    }
  }

  // Fallback verified announcement from Profile Book
  if (notices.length === 0) {
    const fallbackNotices: Record<string, NoticeItem[]> = {
      en: [
        {
          id: "seed-1",
          title: "Seasonal Cemetery Shramadhana Program",
          body: "The society invites community elders and youth volunteers to join the upcoming cemetery grounds maintenance and clean-up drive at the Mahallah cemetery.",
          published_at: "2026-03-01",
        },
      ],
      ta: [
        {
          id: "seed-1",
          title: "மஹல்லா மையவாடி சிரமதானப் பணி அழைப்பு",
          body: "எமது மஹல்லா மையவாடியை துப்புரவு செய்யும் சிரமதானப் பணியில் அனைத்து இளைஞர்களையும் பொதுமக்களையும் பங்குபற்றுமாறு அன்புடன் அழைக்கின்றோம்.",
          published_at: "2026-03-01",
        },
      ],
      si: [
        {
          id: "seed-1",
          title: "සුසාන භූමි වාර්ෂික ශ්‍රමදාන වැඩසටහන",
          body: "මහල්ල සුසාන භූමිය පිරිසිදු කිරීමේ වාර්ෂික ශ්‍රමදාන කටයුතු සඳහා සහභාගී වන ලෙස ප්‍රජාවට ආරාධනා කරමු.",
          published_at: "2026-03-01",
        },
      ],
    };

    notices = fallbackNotices[locale] || fallbackNotices.en;
  }

  return (
    <div className="space-y-6">
      <div className="border-border border-b pb-4">
        <span className="text-primary text-xs font-semibold tracking-wider uppercase">
          {translations.sectionEyebrow}
        </span>
        <h2 className="text-text mt-1 text-2xl font-bold tracking-tight">
          {translations.sectionTitle}
        </h2>
        <p className="text-text-muted mt-1 text-sm">
          {translations.sectionSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {notices.map((notice) => (
          <Card key={notice.id} className="p-6">
            <CardHeader className="p-0 pb-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="primary" size="sm">
                  {translations.noticeBadge}
                </Badge>
                <time className="text-text-muted font-mono text-xs">
                  {notice.published_at.slice(0, 10)}
                </time>
              </div>
              <CardTitle as="h3" className="text-lg">
                {notice.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-text-muted p-0 pt-1 text-sm leading-relaxed">
              {notice.body}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
