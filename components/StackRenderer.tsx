"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StackRendererProps {
  items: (number | string)[];
  maxSize?: number;
  highlightTop?: boolean;
}

export const StackRenderer: React.FC<StackRendererProps> = ({
  items,
  maxSize = 5,
  highlightTop = true,
}) => {
  const visibleItems = items.slice(-maxSize);
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="relative">
        <div className="relative w-48 h-[300px] border-x-4 border-b-4 border-slate-200 dark:border-slate-800 rounded-b-3xl flex flex-col-reverse p-3 gap-2 overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
          <AnimatePresence initial={false}>
            {visibleItems.map((item, i) => (
              <motion.div
                key={`${item}-${i}`}
                initial={{ opacity: 0, y: -50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                className={`
                  relative h-12 w-full shrink-0 rounded-xl flex items-center justify-center font-bold shadow-md border-2
                  ${i === visibleItems.length - 1 && highlightTop 
                    ? 'bg-indigo-600 border-indigo-400 text-white' 
                    : 'bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 text-slate-600 dark:text-white'}
                `}
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-slate-300 dark:text-slate-700 font-black uppercase tracking-widest text-xs italic">
              Stack Empty
            </div>
          )}
        </div>

        {/* Ghost layer for the Top label to render outside overflow-hidden */}
        <div className="absolute inset-0 pointer-events-none flex flex-col-reverse p-3 gap-2 overflow-visible">
          <AnimatePresence initial={false}>
            {visibleItems.map((item, i) => (
              <motion.div
                key={`ghost-${item}-${i}`}
                initial={{ opacity: 0, y: -50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                className="relative h-12 w-full shrink-0"
              >
                {i === visibleItems.length - 1 && highlightTop && (
                  <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                    ← Top
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
