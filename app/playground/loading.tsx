import React from "react";
import { ShimmerSkeleton } from "@/components/Skeleton";

export default function PlaygroundLoading() {
  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)]">
      {/* Top Navbar Skeleton */}
      <div className="h-14 border-b border-[var(--border-color)] flex items-center px-6 gap-6 bg-[var(--bg-secondary)]/80 backdrop-blur-xl">
        <ShimmerSkeleton className="w-8 h-8 rounded-full" />
        <ShimmerSkeleton className="w-32 h-6 rounded-md" />
        <div className="ml-auto flex gap-4">
          <ShimmerSkeleton className="w-24 h-10 rounded-xl" />
          <ShimmerSkeleton className="w-24 h-10 rounded-xl" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="w-[300px] border-r border-[var(--border-color)] p-8 space-y-10 hidden md:block bg-[var(--bg-primary)]">
          <div className="space-y-4">
            <ShimmerSkeleton className="w-full h-10 rounded-xl" />
            <div className="space-y-3 pl-4 border-l border-[var(--border-color)]">
              <ShimmerSkeleton className="w-3/4 h-4 rounded-md" />
              <ShimmerSkeleton className="w-1/2 h-4 rounded-md" />
              <ShimmerSkeleton className="w-2/3 h-4 rounded-md" />
            </div>
          </div>
          <ShimmerSkeleton className="w-full h-64 rounded-[2rem]" />
        </div>

        {/* Editor Area Skeleton */}
        <div className="flex-1 flex flex-col p-10 space-y-8 bg-[var(--bg-secondary)]/30">
          <div className="flex justify-between items-center">
            <ShimmerSkeleton className="w-64 h-12 rounded-2xl" />
            <ShimmerSkeleton className="w-40 h-10 rounded-full" />
          </div>
          <ShimmerSkeleton className="flex-1 w-full rounded-[2.5rem] shadow-2xl" />
          <div className="h-40 flex gap-6">
            <ShimmerSkeleton className="flex-1 rounded-2xl" />
            <ShimmerSkeleton className="w-80 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
