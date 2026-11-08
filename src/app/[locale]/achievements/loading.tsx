import {
  Skeleton,
  SkeletonHero,
  SkeletonStatCard,
} from "@/components/ui/skeleton";

export default function AchievementsLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonHero
        titleWidth="w-80 sm:w-96"
        descriptionWidth="w-full max-w-xl"
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>

        {/* Milestone Timeline Skeletons */}
        <div className="mx-auto max-w-4xl space-y-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="border-border bg-surface flex gap-6 rounded-2xl border p-6 shadow-xs"
            >
              <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
