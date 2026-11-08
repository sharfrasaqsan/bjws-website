import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function AdminMessagesLoading() {
  return (
    <div className="space-y-6">
      <div className="border-border/80 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      <div className="border-border flex items-center gap-2 border-b pb-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      <SkeletonTable rows={7} columns={5} />
    </div>
  );
}
