"use client";

import * as React from "react";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "topbar" | "pill" | "admin" | "menu";
  className?: string;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", callback);
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => {
    window.removeEventListener("storage", callback);
    observer.disconnect();
  };
}

function getSnapshot() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot() {
  return "light";
}

function subscribeMounted() {
  return () => {};
}

export function ThemeToggle({
  variant = "topbar",
  className,
}: ThemeToggleProps) {
  const isMounted = useSyncExternalStore(
    subscribeMounted,
    () => true,
    () => false
  );

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("bjws-theme", "dark");
        document.cookie = "bjws-theme=dark; path=/; max-age=31536000; SameSite=Lax";
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("bjws-theme", "light");
        document.cookie = "bjws-theme=light; path=/; max-age=31536000; SameSite=Lax";
      } catch {}
    }
  };

  if (!isMounted) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center opacity-0",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold text-text shadow-2xs transition-colors hover:bg-surface-muted",
          className
        )}
      >
        <span className="flex items-center gap-2">
          {isDark ? (
            <Sun className="h-4 w-4 text-[#e0b85c]" />
          ) : (
            <Moon className="h-4 w-4 text-[#124d34]" />
          )}
          <span>Appearance</span>
        </span>
        <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-text-muted capitalize">
          {theme} mode
        </span>
      </button>
    );
  }

  if (variant === "admin") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className={cn(
          "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#1a432f] bg-[#0b2e1e] text-[#d1fae5] shadow-2xs transition-colors hover:border-[#c99a45]/40 hover:bg-[#124d34] hover:text-white",
          className
        )}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-[#e0b85c] transition-transform hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 text-[#a7c5b6] transition-transform hover:-rotate-12" />
        )}
      </button>
    );
  }

  // Default: topbar variant
  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={cn(
        "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-emerald-200/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-[#e0b85c] transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-emerald-200 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
