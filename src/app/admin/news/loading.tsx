import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function AdminNewsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-72 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      <SkeletonTable rows={7} columns={5} />
    </div>
  );
}

