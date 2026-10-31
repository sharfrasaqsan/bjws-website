import { Skeleton, SkeletonHero, SkeletonReportCard } from "@/components/ui/skeleton";

export default function ReportsLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SkeletonHero
        titleWidth="w-80 sm:w-96"
        descriptionWidth="w-full max-w-2xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Transparency summary row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3.5 w-40" />
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3.5 w-40" />
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3.5 w-40" />
          </div>
        </div>

        {/* Section title & filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-10 w-44 rounded-md" />
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          <SkeletonReportCard />
          <SkeletonReportCard />
          <SkeletonReportCard />
          <SkeletonReportCard />
        </div>
      </div>
    </div>
  );
}

