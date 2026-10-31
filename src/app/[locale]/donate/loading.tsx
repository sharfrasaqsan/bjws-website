import { Skeleton, SkeletonHero } from "@/components/ui/skeleton";

export default function DonateLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SkeletonHero
        titleWidth="w-72 sm:w-80"
        descriptionWidth="w-full max-w-xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Bank Accounts Card */}
          <div className="rounded-2xl border border-border bg-surface p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div>
                <Skeleton className="h-6 w-44 mb-1" />
                <Skeleton className="h-3.5 w-32" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          {/* Donation Form / Slip Upload Card */}
          <div className="rounded-2xl border border-border bg-surface p-8 space-y-5">
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

