import * as React from "react";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { getAllNotices } from "@/content/notices";
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
  } else {
    // Only check in-memory store in local dev when Supabase is unconfigured
    const liveNotices = getAllNotices();
    notices = liveNotices
      .filter((n) => n.is_published && n.locale === locale)
      .map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        published_at: n.published_at,
      }));
  }

  // When all community notices are unpublished or deleted, cleanly hide the section
  if (notices.length === 0) {
    return null;
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
