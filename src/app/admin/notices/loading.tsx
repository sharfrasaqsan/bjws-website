import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function AdminNoticesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-88 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      <SkeletonTable rows={6} columns={4} />
    </div>
  );
}

