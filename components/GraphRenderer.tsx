"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  RefreshCw,
  Zap,
  MousePointer2,
  GitGraph
} from "lucide-react";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface GraphRendererProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  editable?: boolean;
  currentNode?: string | null;
  visitedNodes?: Set<string>;
  queueNodes?: string[];
}

export const GraphRenderer: React.FC<GraphRendererProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  editable = true,
  currentNode = null,
  visitedNodes = new Set(),
  queueNodes = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, zoom: 1 });
  const [newEdgeSource, setNewEdgeSource] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(viewBox.zoom * delta, 0.5), 3);
    setViewBox(prev => ({ ...prev, zoom: newZoom }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && (e.target as HTMLElement).tagName === "svg") {
      setIsPanning(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setViewBox(prev => ({
        ...prev,
        x: prev.x + e.movementX / prev.zoom,
        y: prev.y + e.movementY / prev.zoom
      }));
    }
  };

  const addNode = (e: React.MouseEvent) => {
    if (!editable || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / viewBox.zoom - viewBox.x;
    const y = (e.clientY - rect.top - rect.height / 2) / viewBox.zoom - viewBox.y;
    
    const id = nodes.length > 0 ? String.fromCharCode(nodes[nodes.length - 1].id.charCodeAt(0) + 1) : "A";
    onNodesChange([...nodes, { id, x, y, label: id }]);
  };

  const handleNodeClick = (id: string) => {
    if (!editable) return;
    if (newEdgeSource === null) {
      setNewEdgeSource(id);
    } else {
      if (newEdgeSource !== id) {
        const edgeId = `${newEdgeSource}-${id}`;
        const reverseId = `${id}-${newEdgeSource}`;
        if (!edges.find(e => e.id === edgeId || e.id === reverseId)) {
          onEdgesChange([...edges, { id: edgeId, source: newEdgeSource, target: id }]);
        }
      }
      setNewEdgeSource(null);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-[#fcfdfe] dark:bg-[#030712] select-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsPanning(false)}
      onDoubleClick={addNode}
    >
      {/* Floating Instructions */}
      <AnimatePresence>
        {editable && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-slate-900/90 dark:bg-white/90 backdrop-blur text-white dark:text-slate-900 rounded-full text-[10px] font-bold shadow-2xl flex items-center gap-4 whitespace-nowrap border border-white/10 dark:border-slate-200/20"
          >
            <div className="flex items-center gap-1.5"><Zap size={12} className="text-amber-400" /> <span>Double-click to spawn node</span></div>
            <div className="w-px h-3 bg-white/20 dark:bg-slate-300" />
            <div className="flex items-center gap-1.5"><MousePointer2 size={12} className="text-blue-400" /> <span>Drag to move</span></div>
            <div className="w-px h-3 bg-white/20 dark:bg-slate-300" />
            <div className="flex items-center gap-1.5"><GitGraph size={12} className="text-emerald-400" /> <span>Select two nodes to link</span></div>
          </motion.div>
        )}
      </AnimatePresence>

      <svg 
        className="w-full h-full cursor-move"
        viewBox={`${-200 / viewBox.zoom - viewBox.x} ${-200 / viewBox.zoom - viewBox.y} ${400 / viewBox.zoom} ${400 / viewBox.zoom}`}
      >
        {/* Edges */}
        {edges.map((edge) => {
          const s = nodes.find(n => n.id === edge.source);
          const t = nodes.find(n => n.id === edge.target);
          if (!s || !t) return null;
          const isVisited = visitedNodes.has(s.id) && visitedNodes.has(t.id);
          const isCurrent = currentNode === s.id || currentNode === t.id;

          return (
            <motion.line
              key={edge.id}
              x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke={isCurrent ? "#6366f1" : isVisited ? "#10b981" : "#cbd5e1"}
              strokeWidth={isCurrent ? 3 : 1.5}
              strokeOpacity={isCurrent ? 1 : 0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isVisited = visitedNodes.has(node.id);
          const isCurrent = currentNode === node.id;
          const isInQueue = queueNodes.includes(node.id);
          const isSelected = newEdgeSource === node.id;

          return (
            <motion.g 
              key={node.id}
              drag={editable}
              dragMomentum={false}
              onDrag={(e, info) => {
                const newNodes = nodes.map(n => 
                  n.id === node.id ? { ...n, x: n.x + info.delta.x / viewBox.zoom, y: n.y + info.delta.y / viewBox.zoom } : n
                );
                onNodesChange(newNodes);
              }}
            >
              <motion.circle
                cx={node.x} cy={node.y} r={20}
                fill={isCurrent ? "#6366f1" : isVisited ? "#10b981" : isInQueue ? "#f59e0b" : isSelected ? "#818cf8" : "#fff"}
                stroke={isCurrent ? "#4f46e5" : isVisited ? "#059669" : isInQueue ? "#d97706" : isSelected ? "#6366f1" : "#cbd5e1"}
                strokeWidth={2}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(node.id);
                }}
                className="cursor-pointer shadow-xl transition-colors duration-300"
              />
              <text
                x={node.x} y={node.y}
                textAnchor="middle" dy=".3em"
                className={`text-[10px] font-black select-none pointer-events-none ${
                  isVisited || isCurrent || isInQueue || isSelected ? 'fill-white' : 'fill-slate-600'
                }`}
              >
                {node.label}
              </text>

              {editable && (
                <motion.g 
                  initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                  transform={`translate(${node.x + 14}, ${node.y - 14})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodesChange(nodes.filter(n => n.id !== node.id));
                    onEdgesChange(edges.filter(e => e.source !== node.id && e.target !== node.id));
                  }}
                  className="cursor-pointer"
                >
                  <circle r={7} fill="#ef4444" />
                  <text textAnchor="middle" dy=".3em" fill="white" className="text-[8px] font-bold">×</text>
                </motion.g>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Toolbar */}
      <div className="absolute top-6 right-6 flex flex-col gap-2">
         <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-1.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
            <button onClick={() => setViewBox(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.2, 3) }))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
               <Maximize2 size={16} className="text-slate-600 dark:text-slate-400" />
            </button>
            <button onClick={() => setViewBox(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.2, 0.5) }))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
               <Minimize2 size={16} className="text-slate-600 dark:text-slate-400" />
            </button>
            <button onClick={() => setViewBox({ x: 0, y: 0, zoom: 1 })} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
               <RefreshCw size={16} className="text-slate-600 dark:text-slate-400" />
            </button>
         </div>
      </div>
    </div>
  );
};
