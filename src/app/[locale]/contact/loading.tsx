import { Skeleton, SkeletonHero } from "@/components/ui/skeleton";

export default function ContactLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonHero
        titleWidth="w-72 sm:w-80"
        descriptionWidth="w-full max-w-xl"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Contact Details Column */}
          <div className="space-y-6">
            <div className="border-border bg-surface space-y-3 rounded-2xl border p-6">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="border-border bg-surface space-y-3 rounded-2xl border p-6">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-52" />
            </div>
            <div className="border-border bg-surface space-y-3 rounded-2xl border p-6">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>

          {/* Contact Message Form Column */}
          <div className="border-border bg-surface space-y-6 rounded-2xl border p-8 lg:col-span-2">
            <div className="border-border border-b pb-4">
              <Skeleton className="mb-2 h-7 w-48" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
            </div>

            <Skeleton className="h-11 w-40 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
