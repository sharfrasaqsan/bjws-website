import { Skeleton, SkeletonHero } from "@/components/ui/skeleton";

export default function DonateLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonHero
        titleWidth="w-72 sm:w-80"
        descriptionWidth="w-full max-w-xl"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Bank Accounts Card */}
          <div className="border-border bg-surface space-y-6 rounded-2xl border p-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="mb-1 h-6 w-44" />
                <Skeleton className="h-3.5 w-32" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="border-border/80 bg-muted/40 space-y-2 rounded-xl border p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="border-border/80 bg-muted/40 space-y-2 rounded-xl border p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          {/* Donation Form / Slip Upload Card */}
          <div className="border-border bg-surface space-y-5 rounded-2xl border p-8">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-72 max-w-full" />

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
