import {
  Skeleton,
  SkeletonHero,
  SkeletonTeamCard,
} from "@/components/ui/skeleton";

export default function TeamLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonHero
        titleWidth="w-80 sm:w-96"
        descriptionWidth="w-full max-w-xl"
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {/* Category Tabs Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Skeleton className="h-10 w-36 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>

        {/* Section title */}
        <div className="border-border border-b pb-4">
          <Skeleton className="mb-2 h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonTeamCard key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
