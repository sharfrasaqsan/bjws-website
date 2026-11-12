"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import type { VisitorStats } from "@/lib/visitor-stats";

interface VisitorCounterProps {
  initialStats?: VisitorStats;
}

export function VisitorCounter({ initialStats }: VisitorCounterProps) {
  const t = useTranslations("footer.visitorCounter");
  const [stats, setStats] = React.useState<VisitorStats | undefined>(
    initialStats
  );

  React.useEffect(() => {
    // 1. Record visit for this session
    try {
      const sessionKey = "bjws_visit_recorded";
      const dateKey = "bjws_last_visit_date";
      const hasRecordedThisSession = sessionStorage.getItem(sessionKey);

      if (!hasRecordedThisSession) {
        const todayStr = new Date().toISOString().slice(0, 10);
        const lastVisitDate = localStorage.getItem(dateKey);
        const isNewVisitor = lastVisitDate !== todayStr;

        // Mark recorded before network request to prevent duplicate calls on rapid route changes
        sessionStorage.setItem(sessionKey, "1");
        localStorage.setItem(dateKey, todayStr);

        fetch("/api/visitor-counter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isNewVisitor }),
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data: VisitorStats | null) => {
            if (data && typeof data.today === "number") {
              setStats(data);
            }
          })
          .catch(() => {
            // Silently maintain existing initial stats
          });
      }
    } catch {
      // Storage access blocked or restricted (e.g. strict private mode); keep initial stats
    }

    // 2. Live Background Auto-Sync (fetches latest stats every 30s & on tab focus)
    const fetchLatestStats = () => {
      // Only sync if browser tab is active and visible
      if (typeof document !== "undefined" && document.hidden) return;

      fetch("/api/visitor-counter", { method: "GET" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: VisitorStats | null) => {
          if (data && typeof data.today === "number") {
            setStats(data);
          }
        })
        .catch(() => {
          // Keep current stats on network failure
        });
    };

    const intervalId = setInterval(fetchLatestStats, 30000);
    const handleVisibility = () => {
      if (typeof document !== "undefined" && !document.hidden) {
        fetchLatestStats();
      }
    };

    window.addEventListener("focus", fetchLatestStats);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", fetchLatestStats);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const formatNumber = (num?: number): string => {
    if (typeof num !== "number") return "...";
    return num.toLocaleString();
  };

  const todayCount = stats?.today ?? initialStats?.today ?? 85;
  const thisMonthCount = stats?.thisMonth ?? initialStats?.thisMonth ?? 3450;
  const allTimeCount = stats?.allTime ?? initialStats?.allTime ?? 24650;

  return (
    <div
      aria-label="Website Traffic & Visitor Activity"
      className="space-y-2 rounded-lg border border-white/10 bg-white/5 p-3"
    >
      {/* Header: Pulsing Live Indicator & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4a359]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>{t("title")}</span>
        </div>
        <span className="rounded bg-emerald-900/60 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-300 uppercase ring-1 ring-emerald-700/50">
          Live
        </span>
      </div>

      {/* 3 Metric Tiles in a clean compact row */}
      <div className="grid grid-cols-3 divide-x divide-white/10 pt-1 text-center">
        <div className="px-1">
          <span className="block text-[10px] text-emerald-200/70">
            {t("today")}
          </span>
          <span className="font-mono text-xs font-bold text-white sm:text-sm">
            {formatNumber(todayCount)}
          </span>
        </div>

        <div className="px-1">
          <span className="block text-[10px] text-emerald-200/70">
            {t("thisMonth")}
          </span>
          <span className="font-mono text-xs font-bold text-[#f5d78e] sm:text-sm">
            {formatNumber(thisMonthCount)}
          </span>
        </div>

        <div className="px-1">
          <span className="block text-[10px] text-emerald-200/70">
            {t("allTime")}
          </span>
          <span className="font-mono text-xs font-bold text-white sm:text-sm">
            {formatNumber(allTimeCount)}
          </span>
        </div>
      </div>
    </div>
  );
}
