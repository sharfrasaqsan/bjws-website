import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { getAllNotices, type NoticeRecord } from "@/content/notices";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { NoticesListView } from "@/components/sections/notices-list-view";
import { Phone, Bell } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "noticesPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/notices",
    locale,
  });
}

export default async function NoticesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("noticesPage");
  const tCommon = await getTranslations("common");

  let notices: NoticeRecord[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("is_published", true)
        .eq("locale", locale)
        .order("published_at", { ascending: false });

      if (!error && data) {
        notices = data.map((d) => ({
          ...d,
          image_url: d.image_url || undefined,
        }));
      }
    } catch (err) {
      console.warn("Could not fetch notices from Supabase:", err);
    }
  }

  // Fallback to in-memory store ONLY if Supabase is NOT configured (demo mode)
  if (notices.length === 0 && !isSupabaseConfigured()) {
    const live = getAllNotices();
    notices = live.filter((n) => n.is_published && n.locale === locale);
  }

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: t("breadcrumbs"), href: "/notices" },
  ];

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          breadcrumbs.map((b) => ({
            name: b.label,
            path: b.href,
          })),
          locale
        )}
      />

      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        breadcrumbs={breadcrumbs}
      />

      <main className="min-h-screen bg-[#faf8f4] py-10 sm:py-14 dark:bg-[#0c1410]">
        <Container size="xl" className="space-y-8">
          {/* 24/7 Emergency Helpline Callout */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-50 via-amber-100/50 to-emerald-50/60 p-5 shadow-xs dark:border-amber-500/30 dark:from-amber-950/30 dark:via-[#0f241a] dark:to-[#0a1a12]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  <Bell className="h-5 w-5 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-amber-950 sm:text-base dark:text-amber-200">
                    24/7 Community &amp; Emergency Hotline
                  </h2>
                  <p className="mt-0.5 text-xs text-amber-900/80 sm:text-sm dark:text-amber-300/80">
                    {t("hotlineBanner")}
                  </p>
                </div>
              </div>
              <a
                href="tel:+94776227323"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-700 sm:text-sm dark:bg-amber-500 dark:hover:bg-amber-600"
              >
                <Phone className="h-4 w-4" />
                <span>+94 77 622 7323</span>
              </a>
            </div>
          </div>

          {/* Enhanced Notices Directory with Search, Image Lightbox & One-Click Copy */}
          <NoticesListView
            notices={notices}
            locale={locale}
            translations={{
              badge: t("badge"),
              publishedOn: t("publishedOn"),
              updatedOn: t("updatedOn"),
              shareWhatsApp: t("shareWhatsApp"),
              noNotices: t("noNotices"),
              societyName: tCommon("societyName"),
              location: tCommon("location"),
            }}
          />
        </Container>
      </main>
    </>
  );
}
