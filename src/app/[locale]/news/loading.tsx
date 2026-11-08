import { Skeleton, SkeletonHero, SkeletonCard } from "@/components/ui/skeleton";

export default function NewsLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonHero
        titleWidth="w-72 sm:w-96"
        descriptionWidth="w-full max-w-xl"
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Category Filter Pills & Search */}
        <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-md sm:w-64" />
        </div>

        {/* Featured Post Card Skeleton */}
        <div className="border-border bg-surface grid grid-cols-1 gap-6 rounded-2xl border p-6 shadow-xs lg:grid-cols-2">
          <Skeleton className="aspect-16/10 w-full rounded-xl" />
          <div className="flex flex-col justify-center space-y-3">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex items-center justify-between pt-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
