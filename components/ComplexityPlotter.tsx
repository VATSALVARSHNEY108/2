"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, TrendingUp, Info } from "lucide-react";

const COMPLEXITIES = [
  { id: "O(1)", name: "Constant", formula: (n: number) => 10, color: "#10b981" },
  { id: "O(log N)", name: "Logarithmic", formula: (n: number) => Math.log2(n) * 10, color: "#3b82f6" },
  { id: "O(N)", name: "Linear", formula: (n: number) => n, color: "#8b5cf6" },
  { id: "O(N log N)", name: "Linearithmic", formula: (n: number) => n * Math.log2(n) / 5, color: "#ec4899" },
  { id: "O(N²)", name: "Quadratic", formula: (n: number) => (n * n) / 100, color: "#f59e0b" },
];

export default function ComplexityPlotter() {
  const [activeComplexities, setActiveComplexities] = useState<string[]>(["O(N)", "O(N²)"]);
  const [nValue, setNValue] = useState(100);

  const toggleComplexity = (id: string) => {
    setActiveComplexities(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const chartWidth = 600;
  const chartHeight = 300;
  const padding = 40;

  return (
    <div className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Complexity Visualizer</h3>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-medium">Growth Rate Comparison</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 flex gap-8">
        {/* Chart Area */}
        <div className="flex-1 relative bg-[var(--bg-secondary)]/30 rounded-xl border border-[var(--border-subtle)] overflow-hidden min-h-[300px]">
          <svg className="w-full h-full p-4 overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Grid Lines */}
            {[...Array(5)].map((_, i) => (
              <line 
                key={`v-${i}`} 
                x1={(i * chartWidth) / 4} y1={0} 
                x2={(i * chartWidth) / 4} y2={chartHeight} 
                stroke="var(--border-color)" strokeOpacity="0.1" 
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <line 
                key={`h-${i}`} 
                x1={0} y1={(i * chartHeight) / 4} 
                x2={chartWidth} y2={(i * chartHeight) / 4} 
                stroke="var(--border-color)" strokeOpacity="0.1" 
              />
            ))}

            {/* Curves */}
            {COMPLEXITIES.map((comp) => {
              if (!activeComplexities.includes(comp.id)) return null;
              
              const points = [];
              for (let x = 0; x <= chartWidth; x += 5) {
                const n = (x / chartWidth) * nValue;
                const y = chartHeight - (comp.formula(n) * (chartHeight / 100));
                if (y >= 0 && y <= chartHeight) {
                  points.push(`${x},${y}`);
                }
              }
              
              return (
                <motion.path
                  key={comp.id}
                  d={`M ${points.join(" L ")}`}
                  fill="none"
                  stroke={comp.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              );
            })}
          </svg>
          
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Input N: {nValue}</span>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="w-48 flex flex-col gap-4">
          <div>
            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-3">Toggles</span>
            <div className="space-y-2">
              {COMPLEXITIES.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => toggleComplexity(comp.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all text-left ${
                    activeComplexities.includes(comp.id)
                    ? 'bg-[var(--bg-elevated)] border-indigo-500/50 shadow-lg'
                    : 'bg-transparent border-[var(--border-subtle)] opacity-50 grayscale'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: comp.color }} />
                  <span className="text-[11px] font-bold">{comp.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-[var(--border-subtle)]">
            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-3">Scale</span>
            <input 
              type="range" min={10} max={1000} step={10} value={nValue}
              onChange={(e) => setNValue(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-[var(--bg-elevated)] rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 flex items-center gap-2">
        <Info size={12} className="text-indigo-400" />
        <span className="text-[10px] text-[var(--text-muted)] font-medium">Observe how $O(N^2)$ dominates other functions as $N$ increases.</span>
      </div>
    </div>
  );
}
