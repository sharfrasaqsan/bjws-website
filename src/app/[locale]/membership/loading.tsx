import { Skeleton, SkeletonHero } from "@/components/ui/skeleton";

export default function MembershipLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonHero
        titleWidth="w-80 sm:w-96"
        descriptionWidth="w-full max-w-2xl"
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {/* Pricing Cards Dual Column (Monthly 50 LKR vs Yearly 500 LKR) */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="border-border bg-surface space-y-5 rounded-2xl border p-8">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-4 w-52" />
            <div className="border-border/60 space-y-3 border-t pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <Skeleton className="h-11 w-full rounded-md pt-2" />
          </div>

          <div className="bg-surface space-y-5 rounded-2xl border-2 border-[#c99a45]/30 p-8 shadow-md">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-4 w-52" />
            <div className="border-border/60 space-y-3 border-t pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <Skeleton className="h-11 w-full rounded-md pt-2" />
          </div>
        </div>

        {/* Membership Application Form Skeleton */}
        <div className="border-border bg-surface mx-auto max-w-3xl space-y-6 rounded-2xl border p-8">
          <div className="border-border border-b pb-4">
            <Skeleton className="mb-2 h-7 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
