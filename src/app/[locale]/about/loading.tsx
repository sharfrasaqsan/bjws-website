import { Skeleton, SkeletonHero } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonHero
        titleWidth="w-72 sm:w-96"
        descriptionWidth="w-full max-w-2xl"
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {/* Mission & Vision Dual Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="border-border bg-surface space-y-4 rounded-2xl border p-8">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="border-border bg-surface space-y-4 rounded-2xl border p-8">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Narrative / History block */}
        <div className="border-border bg-surface space-y-4 rounded-2xl border p-8">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
