import { Skeleton, SkeletonHero, SkeletonCard } from "@/components/ui/skeleton";

export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SkeletonHero
        titleWidth="w-72 sm:w-96"
        descriptionWidth="w-full max-w-xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Category Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full sm:w-64 rounded-md" />
        </div>

        {/* Featured Post Card Skeleton */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="aspect-16/10 rounded-xl w-full" />
          <div className="flex flex-col justify-center space-y-3">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-4 flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

