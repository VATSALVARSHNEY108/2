"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { 
  Plus, 
  Settings, 
  RotateCcw, 
  Trash2, 
  MousePointer2, 
  Zap, 
  Maximize2, 
  Network,
  ChevronRight,
  Activity,
  Box,
  Share2
} from "lucide-react";

interface Point {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

export default function InteractiveGraphPlotter() {
  const [points, setPoints] = useState<Point[]>([
    { id: "1", x: 100, y: 100, label: "Start", color: "#8b5cf6" },
    { id: "2", x: 300, y: 200, label: "End", color: "#ec4899" },
  ]);
  const [connections, setConnections] = useState<Connection[]>([
    { id: "c1", from: "1", to: "2" }
  ]);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [isAddingConnection, setIsAddingConnection] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const addPoint = (e: React.MouseEvent) => {
    if (e.target !== containerRef.current && (e.target as HTMLElement).tagName !== 'svg') return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPoint: Point = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      label: `Node ${points.length + 1}`,
      color: ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"][points.length % 5],
    };
    
    setPoints([...points, newPoint]);
  };

  const updatePointPosition = (id: string, x: number, y: number) => {
    setPoints(points.map(p => p.id === id ? { ...p, x, y } : p));
  };

  const removePoint = (id: string) => {
    setPoints(points.filter(p => p.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
    if (selectedPoint === id) setSelectedPoint(null);
  };

  const handlePointClick = (id: string) => {
    if (isAddingConnection) {
      if (isAddingConnection !== id) {
        const connectionId = `c-${isAddingConnection}-${id}`;
        if (!connections.find(c => c.id === connectionId || (c.from === id && c.to === isAddingConnection))) {
          setConnections([...connections, { id: connectionId, from: isAddingConnection, to: id }]);
        }
      }
      setIsAddingConnection(null);
    } else {
      setSelectedPoint(id);
    }
  };

  const reset = () => {
    setPoints([
      { id: "1", x: 100, y: 100, label: "Start", color: "#8b5cf6" },
      { id: "2", x: 300, y: 200, label: "End", color: "#ec4899" },
    ]);
    setConnections([{ id: "c1", from: "1", to: "2" }]);
    setSelectedPoint(null);
    setIsAddingConnection(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-2xl relative group/canvas">
      {/* Canvas Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Activity size={16} className="text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Interactive Graph Plotter</h3>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-medium">Simulation Environment</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={reset}
            className="p-2 hover:bg-[var(--bg-elevated)] rounded-lg text-[var(--text-muted)] transition-all active:scale-90"
            title="Reset Simulation"
          >
            <RotateCcw size={16} />
          </button>
          <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />
          <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
            <Plus size={14} />
            Add Data
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden cursor-crosshair active:cursor-grabbing bg-[var(--bg-primary)]"
        onDoubleClick={addPoint}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
        
        {/* SVG Layer for Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--border-color)" />
            </marker>
          </defs>
          {connections.map((conn) => {
            const from = points.find(p => p.id === conn.from);
            const to = points.find(p => p.id === conn.to);
            if (!from || !to) return null;
            
            return (
              <motion.line
                key={conn.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="var(--border-color)"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </svg>

        {/* Interactive Points */}
        {points.map((point) => (
          <motion.div
            key={point.id}
            drag
            dragMomentum={false}
            onDrag={(e, info) => {
              updatePointPosition(point.id, point.x + info.delta.x, point.y + info.delta.y);
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute z-10 cursor-grab active:cursor-grabbing flex items-center justify-center`}
            style={{ 
              left: point.x - 20, 
              top: point.y - 20,
              width: 40,
              height: 40
            }}
          >
            <div 
              onClick={() => handlePointClick(point.id)}
              className={`w-full h-full rounded-xl border-2 flex items-center justify-center transition-all duration-300 shadow-xl ${
                selectedPoint === point.id 
                ? 'bg-indigo-500 border-white shadow-indigo-500/40' 
                : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] hover:border-indigo-400'
              }`}
            >
              <span className={`text-[10px] font-black ${selectedPoint === point.id ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                {point.label.slice(0, 1)}
              </span>
            </div>
            
            {/* Tooltip-like label */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded text-[9px] font-bold text-[var(--text-muted)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              {point.label}
            </div>

            {/* Quick Actions on Selected */}
            <AnimatePresence>
              {selectedPoint === point.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg shadow-2xl z-20"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsAddingConnection(point.id); }}
                    className="p-1.5 hover:bg-indigo-500/10 rounded-md text-indigo-500 transition-all"
                    title="Connect to node"
                  >
                    <Share2 size={12} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removePoint(point.id); }}
                    className="p-1.5 hover:bg-red-500/10 rounded-md text-red-500 transition-all"
                    title="Delete node"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Connection Tool active hint */}
        <AnimatePresence>
          {isAddingConnection && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl z-30 pointer-events-none flex items-center gap-2"
            >
              <Zap size={12} className="animate-pulse" />
              Select target node to connect
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions Overlay */}
        <div className="absolute top-6 left-6 p-4 bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--border-subtle)] rounded-xl z-10 pointer-events-none transition-all duration-500 group-hover/canvas:opacity-0 group-hover/canvas:translate-x-[-20px]">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer2 size={12} className="text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">How to use</span>
          </div>
          <ul className="space-y-1.5">
            <li className="text-[9px] text-[var(--text-muted)] flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              Double click to spawn a new node
            </li>
            <li className="text-[9px] text-[var(--text-muted)] flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              Drag nodes to move them freely
            </li>
            <li className="text-[9px] text-[var(--text-muted)] flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              Click a node to edit or connect
            </li>
          </ul>
        </div>
      </div>
      
      {/* Canvas Footer */}
      <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 flex items-center justify-between shrink-0">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Nodes: {points.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-border-color" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Links: {connections.length}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
          <span className="opacity-50">v1.0.4 Simulation-Ready</span>
          <div className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
          <span className="text-emerald-500">System Online</span>
        </div>
      </div>
    </div>
  );
}
