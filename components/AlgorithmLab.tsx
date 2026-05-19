import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Activity,
  Info,
  Code as CodeIcon,
} from "lucide-react";

interface Step {
  message: string;
  line: number;
}

interface AlgorithmLabProps {
  title: string;
  topic: string;
  steps: Step[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onReset: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  visualization: React.ReactNode;
  pseudocode: string[];
  discovery?: React.ReactNode;
  accentColor?: string;
}

export const AlgorithmLab: React.FC<AlgorithmLabProps> = React.memo(
  ({
    title,
    topic,
    steps,
    currentStepIndex,
    onStepChange,
    onReset,
    isPlaying,
    onTogglePlay,
    speed,
    onSpeedChange,
    visualization,
    pseudocode,
    discovery,
    accentColor = "#6366F1",
  }) => {
    const safeIndex = Math.min(
      currentStepIndex,
      Math.max(steps.length - 1, 0)
    );

    const step: Step =
      steps[safeIndex] || {
        message: "No steps available.",
        line: -1,
      };

    const progress =
      steps.length > 0
        ? ((safeIndex + 1) / steps.length) * 100
        : 0;

    return (
      <div className="w-full max-w-[1400px] mx-auto overflow-hidden rounded-[40px] border border-white/10 bg-[#0a0f1e] shadow-2xl flex flex-col h-[800px] font-mono">
        
        {/* Top Bar */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-[#030712]/50">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />

            <h2 className="ml-4 text-sm font-black uppercase tracking-[0.3em] text-white/80">
              {title}
            </h2>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {topic}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5 w-full relative overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute inset-y-0 left-0"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* Left Panel */}
          <div className="flex-[1.5] border-r border-white/5 flex flex-col relative bg-[#030712]">
            
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="flex-1 flex items-center justify-center p-12 overflow-hidden relative">
              {visualization}
            </div>

            {/* Floating Message */}
            <div className="p-8 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={safeIndex}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl relative z-10"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Info
                      size={14}
                      className="text-indigo-400"
                      style={{ color: accentColor }}
                    />

                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      System Message
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-sans italic">
                    "{step.message}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col bg-[#0a0f1e]/50 overflow-hidden">
            
            {/* Pseudocode */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-b border-white/5">
              <div className="flex items-center gap-3 mb-6 opacity-40">
                <CodeIcon size={14} />

                <span className="text-[10px] font-black uppercase tracking-widest">
                  Pseudocode
                </span>
              </div>

              <div className="space-y-1">
                {pseudocode.map((line, i) => (
                  <div
                    key={i}
                    className={`px-4 py-1.5 rounded-lg text-xs transition-all flex gap-4 ${
                      step.line === i
                        ? "bg-amber-500/20 text-amber-200 border border-amber-500/20"
                        : "text-slate-500"
                    }`}
                  >
                    <span className="w-4 opacity-30 text-right">
                      {i}
                    </span>

                    <pre className="font-mono whitespace-pre-wrap break-words">
                      {line}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Discovery Monitor */}
            <div className="p-8 flex-1 flex flex-col min-h-0">
              
              <div className="flex items-center gap-3 mb-6 opacity-40">
                <Activity size={14} />

                <span className="text-[10px] font-black uppercase tracking-widest">
                  Discovery Monitor
                </span>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {discovery || (
                  <div className="flex flex-col items-center justify-center h-full text-slate-700 italic text-[10px]">
                    Waiting for data points...
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />

                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Active
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />

                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Found
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />

                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Comparing
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1E293B]" />

                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Default
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="px-8 py-6 border-t border-white/5 bg-[#030712]/50 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="p-3 hover:bg-white/5 rounded-2xl text-slate-400 transition-all active:scale-90"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-[2rem] border border-white/10">
            
            <button
              onClick={() => onStepChange(Math.max(0, safeIndex - 1))}
              disabled={safeIndex === 0}
              className="p-3 hover:bg-white/5 rounded-2xl text-slate-400 transition-all active:scale-90 disabled:opacity-20"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-xl"
              style={{
                backgroundColor: isPlaying ? "transparent" : "white",
                color: isPlaying ? "white" : "black",
                border: isPlaying
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "none",
              }}
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play
                  size={24}
                  className="ml-1"
                  fill="currentColor"
                />
              )}
            </button>

            <button
              onClick={() =>
                onStepChange(
                  Math.min(steps.length - 1, safeIndex + 1)
                )
              }
              disabled={
                safeIndex === steps.length - 1 ||
                steps.length === 0
              }
              className="p-3 hover:bg-white/5 rounded-2xl text-slate-400 transition-all active:scale-90 disabled:opacity-20"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            
            <div className="flex flex-col gap-1 w-32">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <span>Playback Speed</span>

                <span style={{ color: accentColor }}>
                  {Math.round((2000 - speed + 100) / 20)}x
                </span>
              </div>

              <input
                type="range"
                min={100}
                max={2000}
                step={100}
                value={2100 - speed}
                onChange={(e) =>
                  onSpeedChange(2100 - Number(e.target.value))
                }
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                style={{ accentColor }}
              />
            </div>

            <div className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
              Step{" "}
              <span className="text-white">
                {safeIndex + 1}
              </span>{" "}
              / {steps.length}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AlgorithmLab.displayName = "AlgorithmLab";
