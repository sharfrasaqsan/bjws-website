import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "shimmer" | "circular" | "rounded";
}

/**
 * Base atomic Skeleton component with subtle shimmering and dark-mode adaptation.
 */
export function Skeleton({
  className,
  variant = "shimmer",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-[#124d34]/8 dark:bg-emerald-100/10",
        variant === "circular" && "rounded-full",
        variant === "rounded" && "rounded-2xl",
        variant !== "circular" && variant !== "rounded" && "rounded-lg",
        variant === "shimmer" &&
          "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.8s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent dark:after:via-emerald-400/10",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for standard page hero banners (used across public routes: about, services, team, news, etc.)
 */
export function SkeletonHero({
  titleWidth = "w-64 sm:w-96",
  descriptionWidth = "w-full max-w-xl",
  hasBadge = true,
  hasButtons = false,
  className,
}: {
  titleWidth?: string;
  descriptionWidth?: string;
  hasBadge?: boolean;
  hasButtons?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border relative overflow-hidden border-b bg-gradient-to-b from-[#0b2e1e]/5 to-transparent py-14 sm:py-20 lg:py-24",
        className
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {hasBadge && <Skeleton className="mb-4 h-6 w-36 rounded-full" />}
        <Skeleton className={cn("mb-4 h-10 sm:h-12 lg:h-14", titleWidth)} />
        <Skeleton className={cn("mb-2 h-4 sm:h-5", descriptionWidth)} />
        <Skeleton className="h-4 w-3/4 max-w-md sm:h-5" />

        {hasButtons && (
          <div className="mt-8 flex flex-wrap gap-4">
            <Skeleton className="h-11 w-36 rounded-md" />
            <Skeleton className="h-11 w-32 rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Skeleton for general program / service / news card
 */
export function SkeletonCard({
  hasImage = true,
  className,
}: {
  hasImage?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-surface flex flex-col overflow-hidden rounded-2xl border p-5 shadow-xs",
        className
      )}
      aria-hidden="true"
    >
      {hasImage && <Skeleton className="mb-5 aspect-16/10 w-full rounded-xl" />}
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mb-3 h-6 w-4/5 rounded-md" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-5 h-4 w-2/3" />
      <div className="border-border/50 mt-auto flex items-center justify-between border-t pt-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Skeleton for Society Team Member card (photo, role badge, details)
 */
export function SkeletonTeamCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border bg-surface flex flex-col items-center rounded-2xl border p-6 text-center shadow-xs",
        className
      )}
      aria-hidden="true"
    >
      <Skeleton className="mb-4 h-28 w-28 rounded-full ring-4 ring-[#124d34]/10 sm:h-32 sm:w-32" />
      <Skeleton className="mb-2 h-5 w-36 rounded-md" />
      <Skeleton className="mb-4 h-4 w-24 rounded-full" />
      <Skeleton className="mb-1.5 h-3.5 w-full" />
      <Skeleton className="mb-5 h-3.5 w-4/5" />
      <div className="mt-auto flex items-center gap-2 pt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for Annual Report card
 */
export function SkeletonReportCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border bg-surface flex flex-col justify-between gap-4 rounded-2xl border p-6 shadow-xs sm:flex-row sm:items-center",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 sm:w-64" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-center">
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Skeleton for Admin / Dashboard Data Tables
 */
export function SkeletonTable({
  rows = 5,
  columns = 5,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-surface overflow-hidden rounded-2xl border shadow-xs",
        className
      )}
      aria-hidden="true"
    >
      {/* Table Header */}
      <div className="border-border bg-muted/50 flex items-center justify-between gap-4 border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-44 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>

      {/* Rows */}
      <div className="divide-border/60 divide-y">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div
            key={rIdx}
            className="flex items-center justify-between gap-4 px-6 py-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>

            {Array.from({ length: columns - 2 }).map((_, cIdx) => (
              <div key={cIdx} className="hidden flex-1 md:block">
                <Skeleton className="h-4 w-24" />
              </div>
            ))}

            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for Stat / Metric card
 */
export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border bg-surface rounded-2xl border p-6 shadow-xs",
        className
      )}
      aria-hidden="true"
    >
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="mb-2 h-8 w-24" />
      <Skeleton className="h-3.5 w-36" />
    </div>
  );
}

/**
 * Skeleton for Detail Page Article (News / Blog / Policy)
 */
export function SkeletonArticle({ className }: { className?: string }) {
  return (
    <article
      className={cn("mx-auto max-w-4xl px-4 py-12 sm:px-6", className)}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <span className="text-text-muted/40">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      <Skeleton className="mb-6 h-10 w-11/12 sm:h-14" />

      <div className="border-border mb-8 flex items-center gap-4 border-b pb-6">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <Skeleton className="mb-10 aspect-16/9 w-full rounded-2xl" />

      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </article>
  );
}
