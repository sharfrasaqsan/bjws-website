import { Skeleton } from "@/components/ui/skeleton";

export default function AdminHeroLoading() {
  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:space-y-8 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#e6e4dc] bg-white p-4 shadow-xs"
            >
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
