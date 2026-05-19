"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ArrayRendererProps {
  items: (number | string)[];
  activeIndex?: number;
  comparingIndices?: number[];
  swappingIndices?: number[];
  sortedIndices?: Set<number>;
  onItemClick?: (index: number) => void;
  editable?: boolean;
}

export const ArrayRenderer: React.FC<ArrayRendererProps> = ({
  items,
  activeIndex = -1,
  comparingIndices = [],
  swappingIndices = [],
  sortedIndices = new Set(),
  onItemClick,
  editable = false,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 overflow-x-auto custom-scrollbar">
      <div className="flex gap-2 items-end min-h-[150px]">
        {items.map((item, i) => {
          const isActive = activeIndex === i;
          const isComparing = comparingIndices.includes(i);
          const isSwapping = swappingIndices.includes(i);
          const isSorted = sortedIndices.has(i);

          return (
            <motion.div
              key={i}
              layout
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                whileHover={editable ? { scale: 1.05, y: -5 } : {}}
                onClick={() => onItemClick?.(i)}
                className={`
                  relative w-12 sm:w-16 flex items-center justify-center rounded-xl font-bold text-lg shadow-sm border-2 transition-all duration-300
                  ${isActive ? 'bg-indigo-600 border-indigo-400 text-white h-24 shadow-indigo-500/20' : 
                    isSwapping ? 'bg-amber-500 border-amber-300 text-white h-20 shadow-amber-500/20' :
                    isComparing ? 'bg-blue-500 border-blue-300 text-white h-20 shadow-blue-500/20' :
                    isSorted ? 'bg-emerald-500 border-emerald-300 text-white h-16' :
                    'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 h-16'}
                `}
              >
                {item}
                {isActive && (
                  <motion.div 
                    layoutId="arrayPointer"
                    className="absolute -top-8 text-indigo-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-current" />
                  </motion.div>
                )}
              </motion.div>
              <span className="text-[10px] font-mono font-bold text-slate-400">[{i}]</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
