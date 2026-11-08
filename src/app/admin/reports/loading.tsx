import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function AdminReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="border-border/80 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      <SkeletonTable rows={6} columns={5} />
    </div>
  );
}
