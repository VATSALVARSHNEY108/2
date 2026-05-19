"use client";

import React from "react";
import { ShimmerSkeleton } from "./Skeleton";

export function TopicListSkeleton() {
  return (
    <div className="relative">
      {/* Path Line Skeleton */}
      <div className="absolute left-8 md:left-12 top-0 bottom-0 w-px bg-[var(--border-color)] hidden sm:block" />
      
      <div className="grid gap-12 relative z-10">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="flex flex-col sm:flex-row gap-8 md:gap-14 items-start md:items-center"
          >
            {/* Node Skeleton */}
            <div className="flex-shrink-0">
              <ShimmerSkeleton className="w-16 h-16 md:w-24 md:h-24 rounded-full" />
            </div>

            {/* Card Skeleton */}
            <div className="flex-grow w-full">
              <div className="rounded-[3rem] p-8 md:p-10 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex-grow space-y-6">
                    <ShimmerSkeleton className="w-32 h-6 rounded-full" />
                    <ShimmerSkeleton className="w-1/2 h-12 rounded-xl" />
                    <div className="flex gap-6">
                      <ShimmerSkeleton className="w-24 h-4 rounded-md" />
                      <ShimmerSkeleton className="w-24 h-4 rounded-md" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <ShimmerSkeleton className="hidden lg:block w-32 h-10 rounded-xl" />
                    <ShimmerSkeleton className="w-16 h-16 rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
