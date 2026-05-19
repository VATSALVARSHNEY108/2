"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface QueueRendererProps {
  items: (number | string)[];
  maxSize?: number;
}

export const QueueRenderer: React.FC<QueueRendererProps> = ({
  items,
  maxSize = 8,
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-8">
      <div className="flex items-center gap-4">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rear (Enqueue)</span>
         <ArrowRight size={14} className="text-slate-300" />
         <div className="flex gap-2 items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 min-w-[300px] min-h-[80px]">
            <AnimatePresence initial={false}>
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -50, scale: 0.5 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.5 }}
                  className={`
                    shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-md border-2
                    ${i === 0 
                      ? 'bg-amber-500 border-amber-300 text-white' 
                      : 'bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 text-slate-600 dark:text-white'}
                  `}
                >
                  {item}
                  {i === 0 && (
                    <div className="absolute -top-8 text-[9px] font-black text-amber-500 uppercase tracking-widest">Front</div>
                  )}
                  {i === items.length - 1 && i !== 0 && (
                    <div className="absolute -top-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Rear</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {items.length === 0 && (
              <div className="flex-1 text-center text-slate-300 dark:text-slate-700 font-black uppercase tracking-widest text-xs italic">
                Queue Empty
              </div>
            )}
         </div>
         <ArrowRight size={14} className="text-slate-300" />
         <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Front (Dequeue)</span>
      </div>
    </div>
  );
};
