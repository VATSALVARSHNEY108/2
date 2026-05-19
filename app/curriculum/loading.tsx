import { CoursesSkeleton } from "@/components/CoursesSkeleton";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ShimmerSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 section-container pt-32 pb-24">
        {/* Navigation Skeleton */}
        <div className="inline-flex items-center gap-2 mb-12">
          <ShimmerSkeleton className="w-4 h-4 rounded-full" />
          <ShimmerSkeleton className="w-24 h-4 rounded-md" />
        </div>

        {/* Header Skeleton */}
        <header className="max-w-2xl mb-16 space-y-6">
          <ShimmerSkeleton className="w-32 h-6 rounded-full" />
          <div className="space-y-3">
             <ShimmerSkeleton className="w-3/4 h-16 rounded-2xl" />
             <ShimmerSkeleton className="w-1/2 h-16 rounded-2xl" />
          </div>
          <ShimmerSkeleton className="w-full h-12 rounded-xl" />
        </header>

        {/* Grid Skeleton */}
        <CoursesSkeleton />
      </div>
    </div>
  );
}
