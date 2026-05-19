import { ShimmerSkeleton, PremiumSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] pt-32 pb-24">
      <div className="section-container">
        
        {/* Profile Hero Skeleton */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-16 mb-20">
          <ShimmerSkeleton className="w-48 h-48 md:w-56 md:h-56 rounded-[3.5rem]" />
          
          <div className="flex-grow space-y-6 text-center lg:text-left">
            <div className="flex gap-4 justify-center lg:justify-start">
              <ShimmerSkeleton className="w-32 h-8 rounded-full" />
              <ShimmerSkeleton className="w-24 h-8 rounded-full" />
            </div>
            <ShimmerSkeleton className="w-2/3 h-16 md:h-24 rounded-2xl" />
            <ShimmerSkeleton className="w-full max-w-xl h-6 rounded-lg" />
            <div className="flex gap-6 justify-center lg:justify-start">
              <ShimmerSkeleton className="w-24 h-4 rounded-md" />
              <ShimmerSkeleton className="w-24 h-4 rounded-md" />
            </div>
          </div>

          <div className="flex gap-4">
            <ShimmerSkeleton className="w-32 h-14 rounded-2xl" />
            <ShimmerSkeleton className="w-14 h-14 rounded-2xl" />
          </div>
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column Skeleton */}
          <div className="lg:col-span-8 space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-[2.5rem] p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <ShimmerSkeleton className="w-12 h-12 rounded-2xl mb-6" />
                  <ShimmerSkeleton className="w-20 h-10 rounded-xl mb-2" />
                  <ShimmerSkeleton className="w-24 h-3 rounded-md" />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <ShimmerSkeleton className="w-48 h-10 rounded-xl mb-8" />
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-[2rem] p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center gap-6">
                  <ShimmerSkeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <ShimmerSkeleton className="w-1/4 h-3 rounded-md" />
                    <ShimmerSkeleton className="w-1/2 h-6 rounded-lg" />
                  </div>
                  <ShimmerSkeleton className="w-20 h-8 rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-4 space-y-12">
            <div className="rounded-[2.5rem] p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <ShimmerSkeleton className="w-40 h-8 rounded-xl mb-10" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex flex-col items-center gap-4">
                    <ShimmerSkeleton className="w-12 h-12 rounded-full" />
                    <ShimmerSkeleton className="w-16 h-4 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
              <ShimmerSkeleton className="w-40 h-8 rounded-xl mb-10" />
              <div className="space-y-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between">
                      <ShimmerSkeleton className="w-24 h-4 rounded-md" />
                      <ShimmerSkeleton className="w-10 h-4 rounded-md" />
                    </div>
                    <ShimmerSkeleton className="w-full h-2 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
