"use client";

import React from "react";
import { ShimmerSkeleton } from "./Skeleton";

export function SimulationSkeleton() {
  return (
    <div className="h-[calc(100vh-200px)] flex flex-col gap-6 animate-fadeUp">
      <div className="flex flex-1 min-h-0 gap-6">
        {/* Left Viz Skeleton */}
        <div className="flex-1 flex flex-col gap-4">
          <ShimmerSkeleton className="flex-1 rounded-[2.5rem]" />
          <ShimmerSkeleton className="h-20 rounded-2xl" />
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="w-[350px] flex flex-col gap-4">
           <ShimmerSkeleton className="h-32 rounded-2xl" />
           <ShimmerSkeleton className="flex-1 rounded-2xl" />
           <ShimmerSkeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default SimulationSkeleton;

