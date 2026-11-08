import {
  Skeleton,
  SkeletonHero,
  SkeletonReportCard,
} from "@/components/ui/skeleton";

export default function ReportsLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonHero
        titleWidth="w-80 sm:w-96"
        descriptionWidth="w-full max-w-2xl"
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Transparency summary row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="border-border bg-surface space-y-2 rounded-2xl border p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3.5 w-40" />
          </div>
          <div className="border-border bg-surface space-y-2 rounded-2xl border p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3.5 w-40" />
          </div>
          <div className="border-border bg-surface space-y-2 rounded-2xl border p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3.5 w-40" />
          </div>
        </div>

        {/* Section title & filter */}
        <div className="border-border flex flex-col items-stretch justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
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
