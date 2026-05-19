"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import SimulationSkeleton from "./SimulationSkeleton";

interface LessonLoaderProps {
  subjectId: string;
  topicId: string;
  lessonId: string;
  lessonName: string;
  subjectName: string;
  topicName: string;
  prevLesson: { id: string; name: string } | null;
  nextLesson: { id: string; name: string } | null;
  children: React.ReactNode;
}

export default function LessonLoader({
  subjectId,
  topicId,
  lessonId,
  lessonName,
  subjectName,
  topicName,
  prevLesson,
  nextLesson,
  children,
}: LessonLoaderProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-fetch next lesson route natively with Next.js router if needed,
    // but Next.js <Link> already handles prefetching.
  }, [subjectId, topicId, lessonId, nextLesson]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      {/* Top Bar Navigation - High Density */}
      <div className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)] px-6 py-2">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Link href="/" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0">
              <Home size={14} />
            </Link>
            <ChevronRight size={12} className="text-[var(--text-muted)] shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                {subjectName} <ChevronRight size={10} className="opacity-50" /> {topicName}
              </div>
              <h1 className="text-sm font-black text-[var(--text-primary)] tracking-tight truncate">
                {lessonName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {prevLesson && (
              <Link 
                href={`/curriculum/${subjectId}/${topicId}/${prevLesson.id}`}
                className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-indigo-500/50 text-[var(--text-muted)] hover:text-indigo-500 transition-all"
                title={`Previous: ${prevLesson.name}`}
              >
                <ChevronLeft size={16} />
              </Link>
            )}
            {nextLesson && (
              <Link 
                href={`/curriculum/${subjectId}/${topicId}/${nextLesson.id}`}
                className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 hover:shadow-lg transition-all"
              >
                Next <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Full Page Edge-to-Edge */}
      <main className="flex-1 w-full relative">
        {loading && (
          <div className="p-8">
             <SimulationSkeleton />
          </div>
        )}

        {!loading && (
          <div className="w-full h-full border-b border-[var(--border-subtle)]">
            <Suspense fallback={<SimulationSkeleton />}>
              {children}
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
}
