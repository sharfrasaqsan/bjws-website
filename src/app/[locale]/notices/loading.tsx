import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function NoticesLoading() {
  return (
    <main className="min-h-screen bg-[#faf8f4] pb-20 dark:bg-[#0c1410]">
      {/* Hero skeleton */}
      <div className="bg-[#062115] py-16">
        <Container size="xl">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="mt-4 h-10 w-96 bg-white/10" />
          <Skeleton className="mt-2 h-5 w-full max-w-xl bg-white/10" />
        </Container>
      </div>

      <Container size="xl" className="mt-10 space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl bg-black/5 dark:bg-white/5" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs dark:border-emerald-950 dark:bg-[#0f1d16]"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="mt-4 h-7 w-3/4" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="mt-6 h-9 w-36 rounded-lg" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
