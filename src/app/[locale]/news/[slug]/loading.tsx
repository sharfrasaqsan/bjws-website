import { SkeletonArticle } from "@/components/ui/skeleton";

export default function SingleNewsLoading() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <SkeletonArticle />
    </div>
  );
}
