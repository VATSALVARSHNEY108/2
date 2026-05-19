"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, RotateCcw, Terminal, 
  Code2, Sparkles, Copy, Check,
  Cpu, Zap, Gauge, Braces
} from "lucide-react";

const languages = [
  { id: "cpp", name: "C++", icon: "C++", defaultCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, CoreCode!" << std::endl;\n    return 0;\n}` },
  { id: "python", name: "Python", icon: "Py", defaultCode: `def main():\n    print("Hello, CoreCode!")\n\nif __name__ == "__main__":\n    main()` },
  { id: "java", name: "Java", icon: "Jv", defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CoreCode!");\n    }\n}` },
  { id: "javascript", name: "JavaScript", icon: "JS", defaultCode: `function main() {\n    console.log("Hello, CoreCode!");\n}\n\nmain();` },
];

export default function PlaygroundEditor() {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [code, setCode] = useState(selectedLang.defaultCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [stats, setStats] = useState({ time: "0ms", memory: "0KB" });

  useEffect(() => {
    setCode(selectedLang.defaultCode);
  }, [selectedLang]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(prev => [...prev, `> Executing ${selectedLang.name} environment...`]);
    
    // Simulate execution delay
    await new Promise(r => setTimeout(r, 1200));
    
    setOutput(prev => [
      ...prev, 
      `Hello, CoreCode!`,
      `[Done] exited with code=0 in 0.42s`
    ]);
    setStats({ time: "42ms", memory: "1.2MB" });
    setIsRunning(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      // Reset cursor position after state update
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Editor Section */}
      <div className="lg:col-span-8 flex flex-col premium-card !p-0 overflow-hidden min-h-[400px] lg:min-h-0 border-[var(--border-subtle)] shadow-2xl">
        {/* Editor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/80 backdrop-blur-md gap-4">
          <div className="flex items-center gap-4 sm:gap-6 overflow-hidden">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                <Code2 size={16} />
              </div>
              <span className="text-[12px] font-bold tracking-tight text-[var(--text-primary)] truncate max-w-[100px] sm:max-w-none">
                {selectedLang.name === 'Python' ? 'main.py' : selectedLang.name === 'JavaScript' ? 'script.js' : 'main.' + selectedLang.id}
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/20 border border-[var(--border-subtle)] flex-shrink-0">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedLang.id === lang.id 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
                  }`}
                >
                  {lang.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
            <div className="flex items-center gap-1">
              <button 
                onClick={copyCode}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-[var(--text-primary)]/5 text-[var(--text-muted)] transition-all active:scale-95 border border-transparent hover:border-[var(--border-subtle)]"
                title="Copy Code"
              >
                {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={16} />}
              </button>
              <button 
                onClick={() => setCode(selectedLang.defaultCode)}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-[var(--text-primary)]/5 text-[var(--text-muted)] transition-all active:scale-95 border border-transparent hover:border-[var(--border-subtle)]"
                title="Reset Code"
              >
                <RotateCcw size={16} />
              </button>
            </div>
            <div className="hidden sm:block w-px h-6 bg-[var(--border-subtle)] mx-1" />
            <button 
              onClick={handleRun}
              disabled={isRunning}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                isRunning 
                  ? "bg-white/5 text-[var(--text-muted)] cursor-not-allowed" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 hover:-translate-y-0.5"
              }`}
            >
              {isRunning ? <Sparkles size={14} className="animate-spin text-indigo-300" /> : <Play size={14} fill="currentColor" />}
              {isRunning ? "Running" : "Execute"}
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 relative font-jetbrains text-[13px] leading-[1.7] group bg-[var(--bg-primary)]/40 overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-14 bg-black/[0.03] border-r border-[var(--border-subtle)] flex flex-col items-end py-6 pr-4 text-[10px] font-black text-[var(--text-muted)] select-none opacity-40">
            {code.split('\n').map((_, i) => (
              <div key={i} className="h-[22.1px] flex items-center">{String(i + 1).padStart(2, '0')}</div>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleTab}
            className="w-full h-full bg-transparent p-6 pl-20 outline-none resize-none text-[var(--text-primary)] caret-indigo-500 scrollbar-hide selection:bg-indigo-500/20"
            spellCheck={false}
          />
          
          <div className="absolute bottom-4 right-6 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-30 pointer-events-none">
            <span className="flex items-center gap-1.5"><Zap size={10} /> Optimized</span>
            <span>UTF-8 // {selectedLang.name}</span>
          </div>
        </div>

        {/* Console Area */}
        <div className="h-48 border-t border-[var(--border-subtle)] bg-[#09090b] flex flex-col shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Terminal.Output</span>
              </div>
            </div>
            <button 
              onClick={() => setOutput([])} 
              className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-2 group"
            >
              <RotateCcw size={10} className="group-hover:rotate-180 transition-transform duration-500" />
              Clear
            </button>
          </div>
          <div className="flex-1 p-6 font-mono text-[12px] overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.05),transparent_40%)]">
            {output.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 opacity-20 group">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-indigo-500/30 transition-colors">
                    <Check size={16} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white italic">System ready for execution</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {output.map((line, i) => (
                  <div key={i} className={`flex items-start gap-4 ${line.startsWith('>') ? 'text-indigo-400 font-bold' : 'text-white/80'}`}>
                     <span className="w-4 text-right opacity-20 select-none text-[10px] mt-0.5">{i+1}</span>
                     <span className="flex-1 leading-relaxed whitespace-pre-wrap">{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Side Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 overflow-y-auto lg:overflow-visible custom-scrollbar pb-8 lg:pb-0">
        <div className="premium-card !p-6 sm:!p-8 space-y-6 sm:space-y-8 shadow-xl border-[var(--border-subtle)] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Gauge size={20} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Real-time Metrics</h3>
            </div>
            <div className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-[8px] font-black text-green-500 uppercase tracking-widest">Live</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-[var(--border-subtle)] space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Zap size={24} className="text-indigo-500" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] block">Latency</span>
              <p className="text-3xl font-black text-indigo-500 tracking-tighter tabular-nums">{stats.time}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-[var(--border-subtle)] space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Cpu size={24} className="text-amber-500" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] block">Memory</span>
              <p className="text-3xl font-black text-amber-500 tracking-tighter tabular-nums">{stats.memory}</p>
            </div>
          </div>

          <div className="pt-2 space-y-4">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
               <span className="text-[var(--text-muted)]">CPU Intensity</span>
               <span className="text-indigo-500 flex items-center gap-1.5">
                 <Sparkles size={10} className={isRunning ? "animate-spin" : ""} />
                 {isRunning ? "High Load" : "Nominal"}
               </span>
             </div>
             <div className="w-full h-1.5 bg-[var(--text-primary)]/5 rounded-full overflow-hidden border border-[var(--border-subtle)]">
               <motion.div 
                animate={{ width: isRunning ? "85%" : "15%" }}
                className={`h-full transition-colors duration-500 ${isRunning ? 'bg-indigo-500' : 'bg-indigo-500/40'}`}
               />
             </div>
          </div>
        </div>

        <div className="premium-card !p-8 space-y-8 border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
              <Braces size={20} />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Environment</h3>
          </div>

          <div className="space-y-5">
            {[
              { 
                label: selectedLang.id === 'python' ? "Interpreter" : "Compiler", 
                value: selectedLang.id === 'cpp' ? "GCC 11.4" : selectedLang.id === 'python' ? "Python 3.11" : selectedLang.id === 'java' ? "OpenJDK 17" : "Node.js 20", 
                icon: Cpu 
              },
              { 
                label: "Standard", 
                value: selectedLang.id === 'cpp' ? "C++ 20" : selectedLang.id === 'python' ? "PEP 8" : selectedLang.id === 'java' ? "LTS" : "ES2023", 
                icon: Braces 
              },
              { label: "Execution", value: "Isolated", icon: Zap },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between group/item">
                <div className="flex items-center gap-3 text-[var(--text-muted)]">
                  <div className="w-6 h-6 rounded-lg bg-black/5 flex items-center justify-center group-hover/item:text-indigo-500 transition-colors">
                    <item.icon size={12} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{item.label}</span>
                </div>
                <span className="text-[11px] font-black text-[var(--text-primary)] tracking-tight">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
