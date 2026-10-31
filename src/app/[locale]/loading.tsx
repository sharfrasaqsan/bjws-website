import {
  Skeleton,
  SkeletonCard,
  SkeletonStatCard,
} from "@/components/ui/skeleton";

export default function RootLocaleLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 animate-fade-in">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-[#072115] text-white pt-20 sm:pt-28 pb-28 sm:pb-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Skeleton className="h-6 w-36 rounded-full bg-emerald-900/50" />
            <Skeleton className="h-12 sm:h-16 w-11/12 bg-emerald-900/60" />
            <Skeleton className="h-5 sm:h-6 w-4/5 bg-emerald-900/40" />
            <Skeleton className="h-4 w-2/3 bg-emerald-900/30" />
            <div className="pt-4 flex flex-wrap gap-4">
              <Skeleton className="h-12 w-40 rounded-md bg-[#c99a45]/30" />
              <Skeleton className="h-12 w-36 rounded-md bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping Info Cards */}
      <div className="relative -mt-12 sm:-mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-8 sm:h-10 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        {/* 4 Program Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      </div>
    </div>
  );
}
