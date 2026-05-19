"use client";

import React from "react";
import { ShimmerSkeleton } from "./Skeleton";

export function LessonListSkeleton() {
  return (
    <div className="grid gap-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className="rounded-[2rem] p-6 md:p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6 flex-1">
            <ShimmerSkeleton className="w-16 h-16 rounded-2xl" />
            <div className="space-y-4 flex-1">
              <ShimmerSkeleton className="w-1/3 h-8 rounded-lg" />
              <div className="flex gap-4">
                <ShimmerSkeleton className="w-20 h-4 rounded-md" />
                <ShimmerSkeleton className="w-24 h-4 rounded-md" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ShimmerSkeleton className="hidden lg:block w-24 h-10 rounded-xl" />
            <div className="flex items-center gap-4">
              <ShimmerSkeleton className="w-28 h-10 rounded-xl" />
              <ShimmerSkeleton className="w-12 h-12 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
