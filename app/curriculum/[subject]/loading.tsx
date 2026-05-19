import { ShimmerSkeleton } from "@/components/Skeleton";
import { Layout } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 section-container pt-32 pb-24">
        <div className="inline-flex items-center gap-2 mb-12">
          <ShimmerSkeleton className="w-4 h-4 rounded-full" />
          <ShimmerSkeleton className="w-24 h-4 rounded-md" />
        </div>

        <header className="max-w-2xl mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--text-primary)]/5 border border-[var(--border-color)]">
            <Layout size={12} className="text-slate-700" />
            <ShimmerSkeleton className="w-24 h-3 rounded-md" />
          </div>
          <div className="space-y-3">
             <ShimmerSkeleton className="w-3/4 h-16 rounded-2xl" />
             <ShimmerSkeleton className="w-1/2 h-16 rounded-2xl" />
          </div>
          <ShimmerSkeleton className="w-full h-12 rounded-xl" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <ShimmerSkeleton className="h-64 rounded-[3rem]" />
           <ShimmerSkeleton className="h-64 rounded-[3rem]" />
           <ShimmerSkeleton className="h-64 rounded-[3rem]" />
           <ShimmerSkeleton className="h-64 rounded-[3rem]" />
        </div>
      </div>
    </div>
  );
}
