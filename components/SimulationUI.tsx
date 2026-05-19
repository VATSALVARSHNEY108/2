"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Terminal, 
  Clock, 
  Settings, 
  Info,
  Maximize2,
  ChevronLeft,
  BookOpen
} from "lucide-react";

interface ConceptStep {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface LogEntry {
  id: number;
  message: string;
  type?: "info" | "success" | "warning" | "error";
}

interface SimulationUIProps {
  title: string;
  category: string;
  description: string;
  conceptSteps: ConceptStep[];
  visualization: React.ReactNode;
  codeLines: string[];
  activeCodeLine: number;
  onNext: () => void;
  onPrev?: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  isPlaying: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  stats: React.ReactNode;
  logs: LogEntry[];
  logRef?: React.RefObject<HTMLDivElement | null>;
}

export const SimulationUI: React.FC<SimulationUIProps> = ({
  visualization,
  codeLines,
  activeCodeLine,
  onNext,
  onPrev,
  onTogglePlay,
  onReset,
  isPlaying,
  speed,
  onSpeedChange,
  stats,
  logs,
  logRef
}) => {
  return (
    <div className="flex-1 h-full bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-500 overflow-hidden">
      
      {/* Main Lab Area */}
      <main className="flex-1 flex min-h-0">
        {/* Left: Visualization (Flexible) */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-100 dark:border-slate-800 bg-[#fcfdfe] dark:bg-[#030712]">
          {/* Canvas Viewport */}
          <div className="flex-1 relative overflow-hidden flex flex-col p-4">
             {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-10 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded">
                  <Settings size={12} className="text-slate-400 dark:text-slate-500" />
                </div>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Interactive Laboratory</span>
              </div>
            </div>

            <div className="flex-1 relative z-10 min-h-0 flex items-center justify-center">
              {visualization}
            </div>

            {/* Floating Feedback Bar */}
            <div className="relative z-10 mt-3">
               <motion.div 
                key={logs.length} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-600 dark:bg-indigo-700 text-white p-2.5 rounded-xl shadow-lg flex items-center gap-2.5 border border-indigo-500 max-w-2xl mx-auto"
               >
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center shrink-0">
                    <Info size={14} />
                  </div>
                  <p className="text-[10px] font-medium leading-tight">
                    {logs.length > 0 ? logs[logs.length - 1].message : "Ready to explore. Use controls below."}
                  </p>
               </motion.div>
            </div>
          </div>

          {/* Bottom Controls Bar */}
          <div className="h-16 px-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 shrink-0 bg-white dark:bg-[#020617]">
             <div className="flex items-center gap-2">
                <button 
                  onClick={onReset}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400 transition-all active:scale-95"
                >
                  <RotateCcw size={16} />
                </button>
                
                <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
                  {onPrev && (
                    <button onClick={onPrev} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-all">
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  <button 
                    onClick={onTogglePlay}
                    className={`px-5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 ${
                      isPlaying 
                      ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border border-slate-100 dark:border-slate-700 shadow-sm' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    }`}
                  >
                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                    <span className="text-[10px]">{isPlaying ? 'Pause' : 'Start'}</span>
                  </button>
                  <button onClick={onNext} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-all">
                    <ChevronRight size={16} />
                  </button>
                </div>
             </div>

             <div className="flex-1 flex items-center gap-3">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Speed</span>
                <input 
                  type="range" min={100} max={2000} step={100} value={speed} 
                  onChange={(e) => onSpeedChange(Number(e.target.value))}
                  className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-[9px] font-mono font-bold text-slate-500 w-10 text-right">{speed}ms</span>
             </div>
          </div>
        </div>

        {/* Right: Insights (Compact Width) */}
        <div className="w-[320px] flex flex-col bg-white dark:bg-[#020617] shrink-0">
          {/* Stats Section */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-emerald-50 dark:bg-emerald-500/10 rounded text-emerald-600 dark:text-emerald-400">
                  <Clock size={10} />
                </div>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Analytics</span>
             </div>
             {stats}
          </div>

          {/* Logic Tracer */}
          <div className="flex-[3] flex flex-col min-h-0 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800">
             <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0F172A]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-indigo-400" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Tracer</span>
                </div>
                <div className="text-[9px] font-mono text-slate-700">cpp</div>
             </div>
             <div className="flex-1 p-4 font-mono overflow-y-auto custom-scrollbar">
                {codeLines.map((line, i) => (
                  <div key={i} className={`flex items-start py-0.5 relative group ${activeCodeLine === i ? 'bg-indigo-500/15 -mx-4 px-4' : ''}`}>
                    <span className={`w-6 shrink-0 text-[9px] select-none text-right pr-2 ${activeCodeLine === i ? 'text-indigo-400 font-bold' : 'text-slate-700'}`}>
                      {i + 1}
                    </span>
                    <span className={`text-[10px] whitespace-pre leading-relaxed transition-colors ${
                      activeCodeLine === i ? 'text-indigo-600 dark:text-indigo-100' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}>
                      {line}
                    </span>
                    {activeCodeLine === i && (
                      <motion.div layoutId="tracerBar" className="absolute left-0 w-0.5 h-4 bg-indigo-500 rounded-r-full mt-0.5" />
                    )}
                  </div>
                ))}
             </div>
          </div>

          {/* Execution Log */}
          <div className="flex-[2] flex flex-col min-h-0">
             <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={12} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">History</span>
                </div>
             </div>
             <div ref={logRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-2">
                <AnimatePresence mode="popLayout">
                  {logs.map((log, i) => (
                    <motion.div 
                      key={log.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-2 text-[10px] leading-relaxed ${i === logs.length - 1 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      <span className="text-indigo-400/30 font-mono">[{log.id}]</span>
                      <span>{log.message}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};
