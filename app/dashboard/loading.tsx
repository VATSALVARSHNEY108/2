import { ShimmerSkeleton, PremiumSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] pt-32 pb-24">
      <div className="section-container">
        
        {/* Header Skeleton */}
        <header className="mb-20">
          <ShimmerSkeleton className="w-40 h-8 rounded-full mb-8" />
          <ShimmerSkeleton className="w-2/3 h-20 md:h-28 rounded-3xl mb-6" />
          <ShimmerSkeleton className="w-1/2 h-6 rounded-xl" />
        </header>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-[2.5rem] p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <ShimmerSkeleton className="w-12 h-12 rounded-2xl mb-6" />
              <div className="space-y-3">
                <ShimmerSkeleton className="w-20 h-10 rounded-xl" />
                <ShimmerSkeleton className="w-32 h-4 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Active Topics Skeleton */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-8">
              <ShimmerSkeleton className="w-48 h-10 rounded-xl" />
              <ShimmerSkeleton className="w-24 h-4 rounded-md" />
            </div>

            <div className="grid gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-[2.5rem] p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center gap-8">
                  <ShimmerSkeleton className="w-20 h-20 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <ShimmerSkeleton className="w-1/2 h-8 rounded-lg" />
                    <ShimmerSkeleton className="w-1/3 h-4 rounded-md" />
                  </div>
                  <ShimmerSkeleton className="w-12 h-12 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel Skeleton */}
          <div className="lg:col-span-4 space-y-12">
            <div className="rounded-[3rem] p-10 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="flex justify-between mb-12">
                <ShimmerSkeleton className="w-14 h-14 rounded-2xl" />
                <ShimmerSkeleton className="w-20 h-12 rounded-xl" />
              </div>
              <ShimmerSkeleton className="w-3/4 h-10 rounded-xl mb-6" />
              <ShimmerSkeleton className="w-full h-12 rounded-xl mb-10" />
              <ShimmerSkeleton className="w-full h-14 rounded-2xl" />
            </div>

            <div className="rounded-[2.5rem] p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <ShimmerSkeleton className="w-32 h-8 rounded-xl mb-10" />
              <div className="space-y-4">
                <ShimmerSkeleton className="w-full h-16 rounded-2xl" />
                <ShimmerSkeleton className="w-full h-16 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

