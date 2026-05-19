import React from "react";
import { ShimmerSkeleton } from "@/components/Skeleton";

export default function NotesLoading() {
  return (
    <div className="flex h-[calc(100vh-80px)] bg-[var(--bg-primary)] overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-[340px] bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col p-10 space-y-12">
        <div className="flex justify-between items-center">
          <ShimmerSkeleton className="w-16 h-4" />
          <ShimmerSkeleton className="w-8 h-8 rounded-xl" />
        </div>
        
        <div className="space-y-4">
          <ShimmerSkeleton className="w-48 h-8 rounded-xl" />
          <ShimmerSkeleton className="w-full h-14 rounded-2xl" />
        </div>

        <div className="space-y-10">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <ShimmerSkeleton className="w-32 h-3 rounded-full opacity-60" />
              <div className="space-y-3 pl-4 border-l border-[var(--border-color)]">
                <ShimmerSkeleton className="w-full h-12 rounded-2xl" />
                <ShimmerSkeleton className="w-5/6 h-12 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-[var(--border-color)]">
           <div className="flex items-center gap-4 p-5 rounded-3xl bg-[var(--text-primary)]/[0.02] border border-[var(--border-color)]">
              <ShimmerSkeleton className="w-12 h-12 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <ShimmerSkeleton className="w-24 h-4 rounded-md" />
                <ShimmerSkeleton className="w-16 h-3 rounded-md" />
              </div>
           </div>
        </div>
      </div>

      {/* Editor Content Skeleton */}
      <div className="flex-1 flex flex-col relative">
        {/* Toolbar Skeleton */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 p-2.5 rounded-[2rem] bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl">
          <ShimmerSkeleton className="w-12 h-12 rounded-2xl" />
          <div className="w-px h-8 bg-[var(--border-color)]" />
          <ShimmerSkeleton className="w-24 h-12 rounded-2xl" />
          <div className="w-px h-8 bg-[var(--border-color)]" />
          <ShimmerSkeleton className="w-32 h-12 rounded-2xl" />
          <div className="w-px h-8 bg-[var(--border-color)]" />
          <ShimmerSkeleton className="w-32 h-12 rounded-2xl" />
        </div>
        
        <div className="flex-1 pt-48 pb-32 px-12 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-16">
            <ShimmerSkeleton className="w-3/4 h-24 md:h-32 rounded-3xl" />
            <div className="space-y-6">
              <ShimmerSkeleton className="w-full h-6 rounded-lg" />
              <ShimmerSkeleton className="w-full h-6 rounded-lg" />
              <ShimmerSkeleton className="w-5/6 h-6 rounded-lg" />
              <ShimmerSkeleton className="w-full h-6 rounded-lg" />
              <ShimmerSkeleton className="w-4/5 h-6 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <ShimmerSkeleton className="aspect-video rounded-[2.5rem]" />
              <ShimmerSkeleton className="aspect-video rounded-[2.5rem]" />
            </div>
          </div>
        </div>
        
        <footer className="h-16 border-t border-[var(--border-color)] px-12 flex items-center justify-between bg-[var(--bg-primary)]/90 backdrop-blur-2xl">
           <div className="flex gap-10">
              <ShimmerSkeleton className="w-32 h-3 rounded-full" />
              <ShimmerSkeleton className="w-32 h-3 rounded-full" />
           </div>
           <ShimmerSkeleton className="w-24 h-3 rounded-full" />
        </footer>
      </div>
    </div>
  );
}
