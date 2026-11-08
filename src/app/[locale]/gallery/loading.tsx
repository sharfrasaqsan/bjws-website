import { Skeleton, SkeletonHero } from "@/components/ui/skeleton";

export default function GalleryLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonHero
        titleWidth="w-72 sm:w-96"
        descriptionWidth="w-full max-w-xl"
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>

        {/* Gallery Photo Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="border-border bg-surface overflow-hidden rounded-2xl border p-2 shadow-xs"
            >
              <Skeleton className="mb-3 aspect-4/3 w-full rounded-xl" />
              <div className="space-y-1.5 p-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
