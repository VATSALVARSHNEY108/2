"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, 
  BookOpen, Code, Lightbulb,
  Settings, Maximize2, Terminal,
  Activity, StepForward, StepBack
} from "lucide-react";
import { useTheme } from "next-themes";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SimulationStudioProps {
  title: string;
  topic: string;
  description: string;
  visualization: React.ReactNode;
  explanation: React.ReactNode;
  complexity: React.ReactNode;
  code: React.ReactNode;
  notes: React.ReactNode;
  onNext: () => void;
  onPrev: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  isPlaying: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  activeTopicId?: string;
  topics?: Array<{ id: string; name: string; icon: any }>;
  extraControls?: React.ReactNode;
}

// ─── Components ──────────────────────────────────────────────────────────────

export const SimulationStudio: React.FC<SimulationStudioProps> = ({
  title,
  topic,
  description,
  visualization,
  explanation,
  complexity,
  code,
  notes,
  onNext,
  onPrev,
  onTogglePlay,
  onReset,
  onStepForward,
  onStepBackward,
  isPlaying,
  speed,
  onSpeedChange,
  extraControls,
}) => {
  const [activeTab, setActiveTab] = useState<"explanation" | "complexity" | "code" | "notes">("explanation");
  const { theme } = useTheme();

  const tabs = [
    { id: "explanation", label: "Explanation", icon: BookOpen },
    { id: "complexity", label: "Complexity", icon: Activity },
    { id: "code", label: "Code", icon: Code },
    { id: "notes", label: "Notes", icon: Lightbulb },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-transparent text-[var(--text-primary)] font-sans overflow-hidden">
      {/* Central Workspace Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* ─── Simulation Canvas ─── */}
        <main className="flex-1 flex flex-col min-w-0 relative bg-[var(--bg-primary)]/30">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--accent-vibrant) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="p-12 flex-1 flex flex-col relative z-10 min-h-0">
             {/* Visual Header - Minimal */}
             <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="opacity-40">
                  <span className="text-[10px] font-black uppercase tracking-widest">{topic}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-[var(--bg-elevated)] rounded-lg text-[var(--text-muted)] transition-all">
                    <Settings size={16} />
                  </button>
                  <button className="p-2 hover:bg-[var(--bg-elevated)] rounded-lg text-[var(--text-muted)] transition-all">
                    <Maximize2 size={16} />
                  </button>
                </div>
             </div>

             {/* The Canvas Area */}
             <div className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  {visualization}
                </div>
             </div>
          </div>

          {/* ─── Floating Playback Controls ─── */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
             <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-[var(--bg-secondary)]/80 backdrop-blur-2xl border border-[var(--border-color)] p-2 rounded-[2rem] flex items-center gap-3 shadow-2xl ring-1 ring-[var(--border-subtle)]"
             >
                <button 
                  onClick={onReset}
                  className="p-3 hover:bg-[var(--bg-elevated)] rounded-2xl text-[var(--text-muted)] transition-all active:scale-90"
                >
                  <RotateCcw size={18} />
                </button>

                <div className="h-6 w-[1px] bg-[var(--border-subtle)]" />

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={onStepBackward}
                    className="p-3 hover:bg-[var(--bg-elevated)] rounded-2xl text-[var(--text-muted)] transition-all active:scale-90"
                  >
                    <StepBack size={18} />
                  </button>

                  <button 
                    onClick={onTogglePlay}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-xl ${
                      isPlaying 
                      ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                    }`}
                  >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
                  </button>

                  <button 
                    onClick={onStepForward}
                    className="p-3 hover:bg-[var(--bg-elevated)] rounded-2xl text-[var(--text-muted)] transition-all active:scale-90"
                  >
                    <StepForward size={18} />
                  </button>
                </div>

                <div className="h-6 w-[1px] bg-[var(--border-subtle)]" />

                <div className="flex items-center gap-4 px-4">
                   <div className="flex flex-col gap-1 w-24">
                      <div className="flex justify-between items-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        <span>{speed}ms</span>
                      </div>
                      <input 
                        type="range" min={100} max={2000} step={100} value={speed} 
                        onChange={(e) => onSpeedChange(Number(e.target.value))}
                        className="w-full h-1 bg-[var(--bg-elevated)] rounded-full appearance-none cursor-pointer accent-indigo-500"
                      />
                   </div>
                </div>
             </motion.div>
          </div>
        </main>

        {/* ─── Right Info Panel ─── */}
        <aside className="w-[440px] shrink-0 bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] flex flex-col relative z-30">
          {/* Tabs Header */}
          <div className="flex border-b border-[var(--border-subtle)] px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-4 transition-all relative ${
                  activeTab === tab.id ? 'text-indigo-500' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <tab.icon size={16} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {activeTab === "explanation" && (
                    <div className="prose dark:prose-invert prose-slate max-w-none text-sm">
                      {explanation}
                    </div>
                  )}
                  {activeTab === "complexity" && (
                    <div className="space-y-6 text-sm">
                      {complexity}
                    </div>
                  )}
                  {activeTab === "code" && (
                    <div className="h-full flex flex-col text-sm">
                      {code}
                    </div>
                  )}
                  {activeTab === "notes" && (
                    <div className="space-y-4 text-sm">
                      {notes}
                    </div>
                  )}
                </motion.div>
             </AnimatePresence>
          </div>

          {/* Sticky Controls Section at Bottom of Panel */}
          <div className="p-10 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 space-y-6">
             {extraControls && (
               <div className="pb-6 border-b border-[var(--border-subtle)]/50">
                 {extraControls}
               </div>
             )}
             <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 transition-all active:scale-95">
               <Terminal size={14} />
               Practice on Sandbox
             </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
