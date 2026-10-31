import { SkeletonArticle } from "@/components/ui/skeleton";

export default function SingleNewsLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SkeletonArticle />
    </div>
  );
}

