import {
  Skeleton,
  SkeletonTable,
  SkeletonStatCard,
} from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Bar */}
      <div className="border-border/80 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Quick Action Pills */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* Recent Activity Table */}
      <SkeletonTable rows={6} columns={5} />
    </div>
  );
}
