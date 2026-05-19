"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, RotateCcw, StepForward, StepBack, 
  Settings, Maximize2, Trash2, Plus, Share2,
  MousePointer2, Zap, Terminal, Activity, Layers, Database
} from "lucide-react";
import { useTheme } from "next-themes";
import { CodeTracker } from "./CodeTracker";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SimulationLabProps {
  initialCode?: string[];
  initialNodes?: any[];
  initialEdges?: any[];
  title?: string;
}

interface PanelState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SimulationLab({
  initialCode = [
    "// Problem Solving Logic",
    "Identify input constraints (N)",
    "Select optimal algorithm (O(N log N))",
    "Initialize state trackers",
    "Loop through test cases:",
    "  Solve subproblem",
    "  Record result",
    "Return final answer"
  ],
  initialNodes = [
    { id: "A", x: 100, y: 150 },
    { id: "B", x: 300, y: 100 },
    { id: "C", x: 300, y: 250 },
  ],
  initialEdges = [
    { id: "e1", from: "A", to: "B" },
    { id: "e2", from: "A", to: "C" },
  ],
  title = "Interactive Lab Environment"
}: SimulationLabProps) {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  const svgRef = useRef<SVGSVGElement>(null);

  // Simulation State
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [activeLine, setActiveLine] = useState(0);

  // Panel Positions
  const [panels, setPanels] = useState<PanelState[]>([
    { id: "logic", title: "Logic Tracker", x: 20, y: 20, width: 220, height: 200, icon: <Terminal size={12} /> },
    { id: "state", title: "State Observer", x: 440, y: 20, width: 220, height: 150, icon: <Layers size={12} /> },
    { id: "history", title: "History", x: 440, y: 190, width: 220, height: 150, icon: <Database size={12} /> },
  ]);

  // Interaction State
  const [draggingPanel, setDraggingPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState<string | null>(null);

  // ─── Playback Logic ───

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStepIndex(prev => {
        const next = (prev + 1) % initialCode.length;
        setActiveLine(next);
        return next;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, initialCode.length]);

  const reset = () => {
    setStepIndex(0);
    setActiveLine(0);
    setIsPlaying(false);
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  // ─── Dragging & Mouse ───

  const getSVGPoint = useCallback((e: React.PointerEvent | PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()?.inverse() ?? new DOMMatrix());
  }, []);

  const handlePointerDown = (e: React.PointerEvent, type: "panel" | "node" | "canvas", id: string, extra?: any) => {
    e.stopPropagation();
    const pt = getSVGPoint(e);
    
    if (type === "panel") {
      setDraggingPanel(id);
      setDragOffset({ x: pt.x - extra.x, y: pt.y - extra.y });
    } else if (type === "node") {
      if (isLinking) {
        if (isLinking !== id) {
          const edgeId = `e-${isLinking}-${id}`;
          setEdges([...edges, { id: edgeId, from: isLinking, to: id }]);
        }
        setIsLinking(null);
      } else {
        setDraggingNode(id);
        setSelectedNode(id);
        setDragOffset({ x: pt.x - extra.x, y: pt.y - extra.y });
      }
    } else if (type === "canvas") {
      setSelectedNode(null);
      setIsLinking(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingPanel && !draggingNode) return;
    const pt = getSVGPoint(e);

    if (draggingPanel) {
      setPanels(panels.map(p => p.id === draggingPanel ? { ...p, x: pt.x - dragOffset.x, y: pt.y - dragOffset.y } : p));
    } else if (draggingNode) {
      setNodes(nodes.map(n => n.id === draggingNode ? { ...n, x: pt.x - dragOffset.x, y: pt.y - dragOffset.y } : n));
    }
  };

  const addNodeAtPoint = (e: React.MouseEvent) => {
    if (e.target !== svgRef.current) return;
    const pt = getSVGPoint(e as any);
    const id = String.fromCharCode(65 + nodes.length);
    setNodes([...nodes, { id, x: pt.x, y: pt.y }]);
  };

  const deleteSelected = () => {
    if (!selectedNode) return;
    setNodes(nodes.filter(n => n.id !== selectedNode));
    setEdges(edges.filter(e => e.from !== selectedNode && e.to !== selectedNode));
    setSelectedNode(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-[2rem] overflow-hidden shadow-2xl relative select-none">
      {/* ─── Lab Header ─── */}
      <div className="flex items-center justify-between px-10 py-6 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
            <Activity size={18} className="text-indigo-500" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight">{title}</h3>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Simulation Lab v2.0</span>
               <div className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
               <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-widest">Graph Engine Ready</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           {/* Step Counter */}
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Timeline</span>
              <div className="flex items-center gap-2">
                 <div className="flex gap-1">
                    {initialCode.map((_, i) => (
                      <div key={i} className={`w-3 h-1 rounded-full transition-all duration-300 ${i <= stepIndex ? 'bg-indigo-500' : 'bg-[var(--border-subtle)]'}`} />
                    ))}
                 </div>
                 <span className="text-xs font-mono font-bold text-indigo-500">{stepIndex + 1}/{initialCode.length}</span>
              </div>
           </div>
           
           <div className="h-8 w-[1px] bg-[var(--border-subtle)]" />

           <div className="flex items-center gap-2 bg-[var(--bg-elevated)] p-1.5 rounded-2xl border border-[var(--border-subtle)]">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-lg ${
                  isPlaying ? 'bg-[var(--bg-secondary)] text-indigo-500 border border-indigo-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </button>
              <button 
                onClick={reset}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-all active:scale-90"
              >
                <RotateCcw size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* ─── Main Canvas ─── */}
      <div className="flex-1 relative overflow-hidden bg-[var(--bg-primary)]">
         <svg 
           ref={svgRef}
           className="w-full h-full cursor-crosshair"
           onPointerMove={handlePointerMove}
           onPointerUp={() => { setDraggingPanel(null); setDraggingNode(null); }}
           onPointerDown={(e) => handlePointerDown(e, "canvas", "")}
           onDoubleClick={addNodeAtPoint}
         >
            {/* Grid Pattern */}
            <defs>
              <pattern id="labGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#labGrid)" />

            {/* Edges */}
            {edges.map((edge) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              return (
                <motion.line
                  key={edge.id}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke="var(--border-color)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => (
              <g 
                key={node.id} 
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown(e, "node", node.id, node)}
              >
                <motion.circle
                  cx={node.x} cy={node.y} r="24"
                  fill={selectedNode === node.id ? "rgba(79, 70, 229, 0.15)" : "var(--bg-secondary)"}
                  stroke={selectedNode === node.id ? "#6366f1" : "var(--border-subtle)"}
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1, stroke: "#6366f1" }}
                />
                <text 
                  x={node.x} y={node.y + 5} 
                  textAnchor="middle" 
                  className={`text-xs font-black select-none pointer-events-none ${selectedNode === node.id ? 'fill-indigo-500' : 'fill-[var(--text-secondary)]'}`}
                >
                  {node.id}
                </text>
              </g>
            ))}

            {panels.map((panel) => (
              <foreignObject 
                key={panel.id}
                x={panel.x} y={panel.y} 
                width="100%" height="100%"
                className="drop-shadow-2xl pointer-events-none"
              >
                <div 
                  style={{ minWidth: panel.width, minHeight: panel.height, width: panel.width, height: panel.height }}
                  className="inline-flex flex-col bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-2xl pointer-events-auto resize"
                >
                   <div 
                     className="px-4 py-3 bg-[var(--bg-elevated)]/50 border-b border-[var(--border-subtle)] flex items-center justify-between cursor-grab active:cursor-grabbing"
                     onPointerDown={(e) => handlePointerDown(e, "panel", panel.id, panel)}
                   >
                      <div className="flex items-center gap-2">
                        <div className="text-indigo-500">{panel.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{panel.title}</span>
                      </div>
                      <div className="text-[var(--text-muted)] opacity-30 tracking-tight">⠿</div>
                   </div>
                   
                   <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                      {panel.id === "logic" ? (
                        <div className="h-full -m-4">
                           <CodeTracker code={initialCode} activeLine={activeLine} />
                        </div>
                      ) : panel.id === "state" ? (
                        <div className="space-y-3">
                           <div className="flex items-center justify-between bg-[var(--bg-primary)] p-3 rounded-xl border border-[var(--border-subtle)]">
                              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Active Node</span>
                              <span className="text-xs font-mono font-black text-indigo-500">{selectedNode || "None"}</span>
                           </div>
                           <div className="flex items-center justify-between bg-[var(--bg-primary)] p-3 rounded-xl border border-[var(--border-subtle)]">
                              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Queue</span>
                              <span className="text-xs font-mono font-black text-[var(--text-secondary)]">[{nodes.slice(0, 2).map(n => n.id).join(", ")}]</span>
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-2 opacity-50 italic text-[10px] text-center mt-4">
                           Waiting for step trigger...
                        </div>
                      )}
                   </div>
                </div>
              </foreignObject>
            ))}
         </svg>

         {/* ─── Lab Overlay Controls ─── */}
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
            <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-2xl border border-[var(--border-subtle)] px-6 py-3 rounded-3xl flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/5">
               <div className="flex items-center gap-2">
                  <MousePointer2 size={14} className="text-indigo-400" />
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Edit Mode</span>
               </div>
               
               <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsLinking(selectedNode)}
                    disabled={!selectedNode}
                    className={`p-2 rounded-lg transition-all ${isLinking ? 'bg-indigo-500 text-white' : 'hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] disabled:opacity-30'}`}
                    title="Connect Node"
                  >
                    <Share2 size={16} />
                  </button>
                  <button 
                    onClick={deleteSelected}
                    disabled={!selectedNode}
                    className="p-2 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 rounded-lg transition-all disabled:opacity-30"
                    title="Delete Node"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>

               <div className="h-4 w-[1px] bg-[var(--border-subtle)]" />

               <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 w-24">
                     <div className="flex justify-between items-center text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                        <span>Speed</span>
                        <span>{speed}ms</span>
                     </div>
                     <input 
                       type="range" min={200} max={2000} step={200} value={speed}
                       onChange={(e) => setSpeed(Number(e.target.value))}
                       className="w-full h-1 bg-[var(--bg-elevated)] rounded-full appearance-none cursor-pointer accent-indigo-500"
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* ─── Lab Helper Tooltip ─── */}
         <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-1/2 -translate-y-1/2 left-8 pointer-events-none hidden lg:block"
            >
               <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4 group">
                     <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center shadow-lg group-hover:border-indigo-500/50 transition-all">
                        <Zap size={14} className="text-indigo-400" />
                     </div>
                     <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">Double-Click to Spawn</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                     <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center shadow-lg group-hover:border-indigo-500/50 transition-all">
                        <MousePointer2 size={14} className="text-indigo-400" />
                     </div>
                     <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">Drag Panels to Organize</span>
                     </div>
                  </div>
               </div>
            </motion.div>
         </AnimatePresence>
      </div>

      <style jsx>{`
         .custom-scrollbar::-webkit-scrollbar {
           width: 4px;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
           background: transparent;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
           background: #1e293b;
           border-radius: 10px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
           background: #334155;
         }
      `}</style>
    </div>
  );
}
