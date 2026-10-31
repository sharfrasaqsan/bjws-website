import { Skeleton, SkeletonHero } from "@/components/ui/skeleton";

export default function MembershipLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SkeletonHero
        titleWidth="w-80 sm:w-96"
        descriptionWidth="w-full max-w-2xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Pricing Cards Dual Column (Monthly 50 LKR vs Yearly 500 LKR) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-surface p-8 space-y-5">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-4 w-52" />
            <div className="space-y-3 pt-4 border-t border-border/60">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <Skeleton className="h-11 w-full rounded-md pt-2" />
          </div>

          <div className="rounded-2xl border-2 border-[#c99a45]/30 bg-surface p-8 space-y-5 shadow-md">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-4 w-52" />
            <div className="space-y-3 pt-4 border-t border-border/60">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <Skeleton className="h-11 w-full rounded-md pt-2" />
          </div>
        </div>

        {/* Membership Application Form Skeleton */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-surface p-8 space-y-6">
          <div className="border-b border-border pb-4">
            <Skeleton className="h-7 w-56 mb-2" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </div>

          <Skeleton className="h-12 w-44 rounded-md" />
        </div>
      </div>
    </div>
  );
}

