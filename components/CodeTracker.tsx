"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

interface CodeTrackerProps {
  code: string[];
  activeLine: number;
  theme?: "dark" | "light";
}

export function CodeTracker({ code, activeLine, theme }: CodeTrackerProps) {
  return (
    <div className="panel-container h-full flex flex-col" data-theme={theme}>
      <div className="panel-header shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-[var(--text-primary)]" />
          <span>Code Tracker</span>
        </div>
        <span className="drag-handle text-[10px] text-[var(--text-muted)] opacity-70">:::</span>
      </div>
      <div className="panel-content flex-1 overflow-y-auto border-t border-[var(--border-color)] bg-[var(--bg-primary)] p-4 font-mono custom-scrollbar">
        {code.map((line, i) => (
          <div
            key={i}
            className={`group relative flex items-start py-0.5 transition-colors duration-200 ${
              activeLine === i ? "bg-[var(--accent-soft)] -mx-4 px-4" : ""
            }`}
          >
            <span
              className={`w-6 shrink-0 select-none pr-2 text-right text-[9px] ${
                activeLine === i ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`whitespace-pre text-[10px] leading-relaxed ${
                activeLine === i
                  ? "font-bold text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
              }`}
            >
              {line}
            </span>
            {activeLine === i && (
              <motion.div
                layoutId="tracerBar"
                className="absolute left-0 mt-0.5 h-4 w-0.5 rounded-r-full bg-[var(--text-primary)]"
                initial={false}
              />
            )}
          </div>
        ))}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--text-muted);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
