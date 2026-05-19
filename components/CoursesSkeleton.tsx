"use client";

import React from "react";
import { ShimmerSkeleton } from "./Skeleton";

export function CoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div 
          key={i} 
          className="rounded-[2.5rem] p-8 border border-[var(--border-color)] bg-[var(--bg-secondary)] space-y-6"
        >
          <div className="flex justify-between items-start">
            <ShimmerSkeleton className="w-12 h-12 rounded-2xl" />
            <ShimmerSkeleton className="w-8 h-4 rounded-md" />
          </div>
          <div className="space-y-3">
            <ShimmerSkeleton className="w-3/4 h-8 rounded-xl" />
            <ShimmerSkeleton className="w-full h-12 rounded-lg" />
          </div>
          <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center">
            <ShimmerSkeleton className="w-20 h-4 rounded-md" />
            <ShimmerSkeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
