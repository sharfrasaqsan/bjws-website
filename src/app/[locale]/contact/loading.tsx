import { Skeleton, SkeletonHero } from "@/components/ui/skeleton";

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SkeletonHero
        titleWidth="w-72 sm:w-80"
        descriptionWidth="w-full max-w-xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Details Column */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-52" />
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>

          {/* Contact Message Form Column */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

