"use client";

import React from "react";
import { Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PlaygroundEditor from "@/components/PlaygroundEditor";

export default function PlaygroundPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] selection:bg-indigo-500 selection:text-white overflow-y-auto lg:overflow-hidden flex flex-col custom-scrollbar">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="flex-1 max-w-none px-6 sm:px-10 lg:px-12 relative z-10 flex flex-col py-6 lg:py-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6 uppercase tracking-[0.3em] group">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Home
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-500 text-[9px] font-black tracking-widest uppercase mb-4 shadow-sm">
              <Zap size={10} className="animate-pulse" />
              Sandbox Environment
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Lab<span className="text-indigo-500">.</span>Playground
            </h1>
          </div>
          <p className="hidden lg:block text-sm text-[var(--text-secondary)] font-medium max-w-[280px] text-right opacity-60">
            Real-time execution environment for testing complex algorithms and data models.
          </p>
        </header>

        <div className="flex-1 min-h-0">
          <PlaygroundEditor />
        </div>
      </div>
    </div>
  );
}
