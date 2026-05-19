"use client";

import React, { useState, useEffect } from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--text-primary)]/[0.05] rounded-md ${className}`}
    />
  );
}

export function ShimmerSkeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[var(--text-primary)]/[0.03] rounded-xl border border-[var(--border-color)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer-move_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[var(--text-primary)]/[0.05] before:to-transparent ${className}`}
    />
  );
}

export function PremiumSkeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2.5rem] p-8 ${className}`}>
      <div className="space-y-4">
        <ShimmerSkeleton className="w-12 h-12 rounded-2xl" />
        <ShimmerSkeleton className="w-3/4 h-8 rounded-xl" />
        <ShimmerSkeleton className="w-full h-4 rounded-lg" />
        <ShimmerSkeleton className="w-5/6 h-4 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * A wrapper that ensures its children (or a skeleton) are shown for a minimum duration.
 */
export function LoadingDelay({ 
  children, 
  skeleton, 
  delay = 1000 
}: { 
  children: React.ReactNode; 
  skeleton: React.ReactNode; 
  delay?: number 
}) {
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChildren(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!showChildren) return <>{skeleton}</>;
  return <>{children}</>;
}
