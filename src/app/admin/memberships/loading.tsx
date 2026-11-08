import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function AdminMembershipsLoading() {
  return (
    <div className="space-y-6">
      <div className="border-border/80 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-border flex items-center gap-2 border-b pb-2">
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <SkeletonTable rows={8} columns={6} />
    </div>
  );
}
