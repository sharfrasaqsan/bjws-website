import { Skeleton, SkeletonHero, SkeletonCard } from "@/components/ui/skeleton";

export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SkeletonHero
        titleWidth="w-80 sm:w-96"
        descriptionWidth="w-full max-w-2xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* 24/7 Hotline highlight banner skeleton */}
        <div className="rounded-2xl border border-emerald-800/40 bg-[#062316] p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <Skeleton className="h-6 w-32 rounded-full bg-amber-400/20" />
            <Skeleton className="h-8 w-72 bg-emerald-900/60" />
            <Skeleton className="h-4 w-96 max-w-full bg-emerald-900/40" />
          </div>
          <Skeleton className="h-12 w-48 rounded-md bg-[#c99a45]/40 shrink-0" />
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkeletonCard className="p-7" />
          <SkeletonCard className="p-7" />
          <SkeletonCard className="p-7" />
          <SkeletonCard className="p-7" />
        </div>
      </div>
    </div>
  );
}

