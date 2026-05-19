import { ShimmerSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl space-y-24">
        {/* Hero Skeleton */}
        <div className="flex flex-col items-center space-y-12">
          <ShimmerSkeleton className="w-48 h-10 rounded-2xl" />
          <ShimmerSkeleton className="w-[80%] h-32 md:h-64 rounded-[3rem]" />
          <div className="space-y-4 flex flex-col items-center w-full">
            <ShimmerSkeleton className="w-2/3 h-8 rounded-xl" />
            <ShimmerSkeleton className="w-1/2 h-4 rounded-lg" />
          </div>
          <div className="flex gap-6">
            <ShimmerSkeleton className="w-40 h-16 rounded-2xl" />
            <ShimmerSkeleton className="w-40 h-16 rounded-2xl" />
          </div>
        </div>

        {/* Features Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <ShimmerSkeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
