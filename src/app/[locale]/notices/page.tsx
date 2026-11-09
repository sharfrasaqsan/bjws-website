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
import {
  Megaphone,
  Phone,
  Calendar,
  Clock,
  Share2,
  FileText,
  AlertCircle,
  Bell,
} from "lucide-react";

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

function isJanazaNotice(title: string, body: string): boolean {
  const text = `${title} ${body}`.toLowerCase();
  return (
    text.includes("janaza") ||
    text.includes("death") ||
    text.includes("funeral") ||
    text.includes("ஜனாஸா") ||
    text.includes("மரணம்") ||
    text.includes("ජනාසා") ||
    text.includes("මරණ")
  );
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

      if (!error && data && data.length > 0) {
        notices = data;
      } else {
        // Fallback to any published notice if language-specific not yet published
        const { data: fallbackData } = await supabase
          .from("notices")
          .select("*")
          .eq("is_published", true)
          .order("published_at", { ascending: false });

        if (fallbackData && fallbackData.length > 0) {
          notices = fallbackData;
        }
      }
    } catch (err) {
      console.warn("Could not fetch notices from Supabase:", err);
    }
  }

  // Fallback to in-memory store if DB query returned nothing
  if (notices.length === 0) {
    const live = getAllNotices();
    notices = live.filter((n) => n.is_published && n.locale === locale);
    if (notices.length === 0) {
      notices = live.filter((n) => n.is_published);
    }
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
          {/* 24/7 Emergency Funeral Support Callout */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-50 via-amber-100/50 to-emerald-50/60 p-5 shadow-xs dark:border-amber-500/30 dark:from-amber-950/30 dark:via-[#0f241a] dark:to-[#0a1a12]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  <Bell className="h-5 w-5 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-amber-950 sm:text-base dark:text-amber-200">
                    {tCommon("janazaNotice")}
                  </h2>
                  <p className="mt-0.5 text-xs text-amber-900/80 sm:text-sm dark:text-amber-300/80">
                    {t("hotlineBanner")}
                  </p>
                </div>
              </div>
              <a
                href="tel:+94774835530"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-700 sm:text-sm dark:bg-amber-500 dark:hover:bg-amber-600"
              >
                <Phone className="h-4 w-4" />
                <span>+94 77 483 5530</span>
              </a>
            </div>
          </div>

          {/* Notices Grid or Empty State */}
          {notices.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center dark:border-emerald-950 dark:bg-[#0f1d16]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Megaphone className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-stone-900 dark:text-white">
                {t("noNotices")}
              </h3>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                {tCommon("societyName")} • {tCommon("location")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {notices.map((notice) => {
                const isJanaza = isJanazaNotice(notice.title, notice.body);
                const publishedDateStr = notice.published_at?.slice(0, 10);
                const updatedDateStr = notice.updated_at?.slice(0, 10);
                const hasUpdated =
                  updatedDateStr && updatedDateStr !== publishedDateStr;

                const encodedWhatsAppText = encodeURIComponent(
                  `*${notice.title}*\n\n${notice.body}\n\n— *Buhary Janaza Welfare Society (BJWS)*\nhttps://bjws.org/${locale}/notices`
                );

                return (
                  <article
                    key={notice.id}
                    className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm transition-all hover:border-[#124d34]/40 hover:shadow-md sm:p-7 dark:border-emerald-950/80 dark:bg-[#0f1d16] dark:hover:border-emerald-600/50"
                  >
                    {/* Top Header */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4 dark:border-emerald-950">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                              isJanaza
                                ? "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-800"
                                : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800"
                            }`}
                          >
                            {isJanaza ? (
                              <AlertCircle className="h-3.5 w-3.5" />
                            ) : (
                              <Megaphone className="h-3.5 w-3.5" />
                            )}
                            <span>
                              {isJanaza ? t("badgeJanaza") : t("badge")}
                            </span>
                          </span>

                          <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase dark:text-stone-400">
                            {notice.locale.toUpperCase()}
                          </span>
                        </div>

                        {/* Date Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                          <span className="inline-flex items-center gap-1 font-mono">
                            <Calendar className="h-3.5 w-3.5 text-stone-400" />
                            <span>
                              {t("publishedOn")}: {publishedDateStr}
                            </span>
                          </span>

                          {hasUpdated && (
                            <span className="inline-flex items-center gap-1 font-mono text-amber-700 dark:text-amber-400">
                              <Clock className="h-3.5 w-3.5" />
                              <span>
                                {t("updatedOn")}: {updatedDateStr}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Notice Title */}
                      <h2 className="font-display mt-4 text-lg font-bold text-stone-900 sm:text-xl dark:text-white">
                        {notice.title}
                      </h2>

                      {/* Notice Body */}
                      <div className="mt-3.5 text-xs leading-relaxed whitespace-pre-line text-stone-700 sm:text-sm dark:text-stone-300">
                        {notice.body}
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4 dark:border-emerald-950">
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                        <FileText className="h-3.5 w-3.5" />
                        <span>BJWS Official Dispatch</span>
                      </div>

                      <a
                        href={`https://api.whatsapp.com/send?text=${encodedWhatsAppText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>{t("shareWhatsApp")}</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </main>
    </>
  );
}
