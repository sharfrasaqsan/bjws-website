import { Skeleton, SkeletonHero, SkeletonCard } from "@/components/ui/skeleton";

export default function ServicesLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonHero
        titleWidth="w-80 sm:w-96"
        descriptionWidth="w-full max-w-2xl"
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {/* 24/7 Hotline highlight banner skeleton */}
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-emerald-800/40 bg-[#062316] p-8 text-white md:flex-row md:items-center">
          <div className="max-w-xl space-y-3">
            <Skeleton className="h-6 w-32 rounded-full bg-amber-400/20" />
            <Skeleton className="h-8 w-72 bg-emerald-900/60" />
            <Skeleton className="h-4 w-96 max-w-full bg-emerald-900/40" />
          </div>
          <Skeleton className="h-12 w-48 shrink-0 rounded-md bg-[#c99a45]/40" />
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <SkeletonCard className="p-7" />
          <SkeletonCard className="p-7" />
          <SkeletonCard className="p-7" />
          <SkeletonCard className="p-7" />
        </div>
      </div>
    </div>
  );
}
