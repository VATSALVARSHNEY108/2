"use client";

import React, { useState } from "react";
import { Terminal, Check, AlertCircle } from "lucide-react";

interface ArrayInputProps {
  onConfirm: (arr: number[]) => void;
  defaultValue?: string;
  label?: string;
}

export const ArrayInput: React.FC<ArrayInputProps> = ({ onConfirm, defaultValue = "1, 2, 3, 4, 5", label = "Custom Array" }) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    try {
      const parsed = inputValue
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .map((s) => {
          const n = Number(s);
          if (isNaN(n)) throw new Error(`Invalid number: ${s}`);
          return n;
        });

      if (parsed.length === 0) throw new Error("Array cannot be empty");
      
      setError(null);
      onConfirm(parsed);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{label}</span>
        {error && (
          <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
            <AlertCircle size={10} /> {error}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <Terminal size={14} />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="e.g. 1, 2, 3, 4"
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl py-2 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
        <button
          onClick={handleApply}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          <Check size={16} />
        </button>
      </div>
      <p className="text-[10px] text-[var(--text-muted)] italic">
        Enter numbers separated by commas.
      </p>
    </div>
  );
};
