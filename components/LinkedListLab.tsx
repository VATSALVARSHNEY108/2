"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TheorySection } from "./TheorySection";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LLNode {
  id: string;
  value: number | string;
  next: string | null;
}

interface LLStep {
  type: string;
  activeNode: string | null;
  prevNode: string | null;
  visitedNodes: string[];
  foundNode: string | null;
  highlightEdge: string | null; 
  message: string;
  speechMessage: string;
  line: number | null;
  pointers: Record<string, string | null>; 
  resultNodes: string[];
}

interface LLData {
  nodes: Record<string, LLNode>;
  headId: string | null;
  order: string[]; 
}

export interface LLConfig {
  title: string;
  definition: string;
  timeComplexity: string;
  spaceComplexity: string;
  keyPoints: string[];
  code: string[];
  archetype: "theory" | "traverse" | "insert" | "delete" | "reverse" | "slowfast";
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NODE_W  = 64;
const NODE_H  = 44;
const ARROW_W = 36;
const START_X = 80;
const START_Y = 200;
const SPACING = NODE_W + ARROW_W;

const DEFAULT_VALUES = [10, 23, 5, 47, 18, 31, 9];

// ─── UID ─────────────────────────────────────────────────────────────────────
let _uid = 1;
function mkId() { return `ll${_uid++}`; }

function buildList(values: (number | string)[]): LLData {
  if (values.length === 0) return { nodes: {}, headId: null, order: [] };
  const ids = values.map(() => mkId());
  const nodes: Record<string, LLNode> = {};
  ids.forEach((id, i) => {
    nodes[id] = { id, value: values[i], next: ids[i + 1] ?? null };
  });
  return { nodes, headId: ids[0], order: ids };
}

// ─── Step Generators ─────────────────────────────────────────────────────────

function genTraverse(data: LLData): LLStep[] {
  const steps: LLStep[] = [];
  const visited: string[] = [];

  steps.push({
    type: "init", activeNode: null, prevNode: null, visitedNodes: [], foundNode: null, highlightEdge: null,
    message: "Set cur = head. Begin traversal.", speechMessage: "Starting traversal.",
    line: 0, pointers: { cur: data.headId }, resultNodes: [],
  });

  let cur = data.headId;
  while (cur && data.nodes[cur]) {
    const n = data.nodes[cur];
    visited.push(cur);
    steps.push({
      type: "visit", activeNode: cur, prevNode: null, visitedNodes: [...visited], foundNode: null, highlightEdge: null,
      message: `Visit node ${n.value}. Move cur to next.`, speechMessage: `Visiting ${n.value}.`,
      line: 2, pointers: { cur }, resultNodes: [...visited],
    });
    if (n.next) {
      steps.push({
        type: "advance", activeNode: cur, prevNode: null, visitedNodes: [...visited], foundNode: null, highlightEdge: `${cur}-${n.next}`,
        message: `Follow next pointer.`, speechMessage: `Following next pointer.`,
        line: 3, pointers: { cur: n.next }, resultNodes: [...visited],
      });
    }
    cur = n.next;
  }
  steps.push({
    type: "done", activeNode: null, prevNode: null, visitedNodes: [...visited], foundNode: null, highlightEdge: null,
    message: `Traversal complete!`, speechMessage: "Traversal complete.",
    line: 4, pointers: { cur: null }, resultNodes: [...visited],
  });
  return steps;
}

function genInsert(data: LLData): LLStep[] {
  const steps: LLStep[] = [];
  const newId = mkId();
  const value = 99;
  const pos = 2;

  steps.push({
    type: "init", activeNode: null, prevNode: null, visitedNodes: [], foundNode: null, highlightEdge: null,
    message: `Create new node(${value}).`, speechMessage: `Creating new node.`,
    line: 0, pointers: {}, resultNodes: [],
  });

  let cur = data.headId;
  let idx = 0;
  const visited: string[] = [];

  while (cur && data.nodes[cur] && idx < pos - 1) {
    visited.push(cur);
    const n = data.nodes[cur];
    steps.push({
      type: "advance", activeNode: cur, prevNode: null, visitedNodes: [...visited], foundNode: null, highlightEdge: n.next ? `${cur}-${n.next}` : null,
      message: `Walk to position ${pos - 1}.`, speechMessage: `Moving forward.`,
      line: 3, pointers: { cur }, resultNodes: [],
    });
    cur = n.next;
    idx++;
  }

  if (cur) {
    visited.push(cur);
    const n = data.nodes[cur];
    steps.push({
      type: "insert", activeNode: cur, prevNode: null, visitedNodes: [...visited], foundNode: null, highlightEdge: null,
      message: `At node ${n.value}. Link: newNode.next = cur.next, cur.next = newNode.`, speechMessage: `Inserting node.`,
      line: 6, pointers: { cur }, resultNodes: [],
    });
  }

  steps.push({
    type: "done", activeNode: null, prevNode: null, visitedNodes: [...visited], foundNode: null, highlightEdge: null,
    message: `Node inserted.`, speechMessage: `Insertion complete.`,
    line: 7, pointers: {}, resultNodes: [],
  });
  return steps;
}

function genDelete(data: LLData): LLStep[] {
  const steps: LLStep[] = [];
  const target = 5;

  steps.push({
    type: "init", activeNode: null, prevNode: null, visitedNodes: [], foundNode: null, highlightEdge: null,
    message: `Delete node with value ${target}.`, speechMessage: `Deleting node.`,
    line: 0, pointers: { prev: null, cur: data.headId }, resultNodes: [],
  });

  let prev = data.headId;
  let cur  = data.nodes[data.headId ?? ""]?.next ?? null;
  const visited: string[] = prev ? [prev] : [];

  while (cur && data.nodes[cur]) {
    const n  = data.nodes[cur];
    steps.push({
      type: "check", activeNode: cur, prevNode: prev, visitedNodes: [...visited, cur], foundNode: null, highlightEdge: prev ? `${prev}-${cur}` : null,
      message: `Is ${n.value} == ${target}?`, speechMessage: `Checking value.`,
      line: 3, pointers: { prev, cur }, resultNodes: [],
    });

    if (n.value === target) {
      steps.push({
        type: "delete", activeNode: cur, prevNode: prev, visitedNodes: [...visited, cur], foundNode: cur, highlightEdge: prev ? `${prev}-${cur}` : null,
        message: `Found ${target}! prev.next = cur.next.`, speechMessage: `Unlinking node.`,
        line: 5, pointers: { prev, cur }, resultNodes: [],
      });
      return steps;
    }
    visited.push(cur);
    prev = cur;
    cur  = n.next;
  }
  return steps;
}

function genReverse(data: LLData): LLStep[] {
  const steps: LLStep[] = [];
  steps.push({
    type: "init", activeNode: null, prevNode: null, visitedNodes: [], foundNode: null, highlightEdge: null,
    message: "Set prev = null, cur = head.", speechMessage: "Starting reversal.",
    line: 1, pointers: { prev: null, cur: data.headId }, resultNodes: [],
  });

  let prev: string | null = null;
  let cur:  string | null = data.headId;
  const reversed: string[] = [];

  while (cur && data.nodes[cur]) {
    const n = data.nodes[cur];
    const next = n.next;
    steps.push({
      type: "save-next", activeNode: cur, prevNode: prev, visitedNodes: [...reversed], foundNode: null, highlightEdge: cur && next ? `${cur}-${next}` : null,
      message: `Save next.`, speechMessage: `Saving next pointer.`,
      line: 3, pointers: { prev, cur, next }, resultNodes: [...reversed],
    });
    steps.push({
      type: "flip", activeNode: cur, prevNode: prev, visitedNodes: [...reversed], foundNode: null, highlightEdge: null,
      message: `Flip: cur.next = prev.`, speechMessage: `Flipping pointer.`,
      line: 4, pointers: { prev, cur }, resultNodes: [...reversed],
    });
    reversed.push(cur);
    prev = cur;
    cur  = next;
  }
  steps.push({
    type: "done", activeNode: null, prevNode: prev, visitedNodes: [...reversed], foundNode: null, highlightEdge: null,
    message: `Reversal complete!`, speechMessage: `List reversed.`,
    line: 7, pointers: { head: prev, cur: null }, resultNodes: [...reversed],
  });
  return steps;
}

function genSlowFast(data: LLData): LLStep[] {
  const steps: LLStep[] = [];
  steps.push({
    type: "init", activeNode: null, prevNode: null, visitedNodes: [], foundNode: null, highlightEdge: null,
    message: "Initialize slow and fast pointers.", speechMessage: "Initializing slow and fast pointers.",
    line: 1, pointers: { slow: data.headId, fast: data.headId }, resultNodes: [],
  });

  let slow = data.headId;
  let fast = data.headId;
  const visited: string[] = [];

  while (fast && data.nodes[fast]?.next) {
    visited.push(slow!);
    slow = data.nodes[slow!].next;
    fast = data.nodes[data.nodes[fast].next!].next;
    steps.push({
      type: "move", activeNode: slow, prevNode: null, visitedNodes: [...visited], foundNode: null, highlightEdge: null,
      message: `slow moves 1 step, fast moves 2 steps.`, speechMessage: `Moving pointers.`,
      line: 3, pointers: { slow, fast }, resultNodes: [],
    });
  }
  steps.push({
    type: "done", activeNode: slow, prevNode: null, visitedNodes: [...visited], foundNode: null, highlightEdge: null,
    message: `Middle/End reached!`, speechMessage: `Algorithm complete.`,
    line: 5, pointers: { slow, fast }, resultNodes: [],
  });
  return steps;
}

// ─── Shared UI ───────────────────────────────────────────────────────────────
function FloatPanel({ title, pos, onDrag, width, children }: any) {
  return (
    <div style={{ position: "absolute", left: pos.x, top: pos.y, minWidth: width, background: "rgba(22,27,34,0.95)", border: "1px solid #21262d", borderRadius: 10, overflow: "auto", backdropFilter: "blur(8px)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)", userSelect: "none", zIndex: 10, resize: "both" }}>
      <div onMouseDown={onDrag} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#21262d", cursor: "grab", fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#8b949e" }}>
        {title}<span style={{ fontSize: 14, opacity: .4 }}>⠿</span>
      </div>
      <div style={{ padding: "12px 14px" }}>{children}</div>
    </div>
  );
}

function CtrlBtn({ children, onClick, primary, title, xStyle }: any) {
  return (
    <button onClick={onClick} title={title} style={{ width: 32, height: 32, borderRadius: 6, background: primary ? "#1f6feb" : "#21262d", border: `1px solid ${primary ? "#388bfd" : "#30363d"}`, color: "#c9d1d9", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", ...xStyle }}>
      {children}
    </button>
  );
}

export default function LinkedListLab({ config }: { config: LLConfig }) {
  const [listData, setListData] = useState<LLData>(() => buildList(DEFAULT_VALUES));
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [speechOn, setSpeechOn] = useState(false);

  const [listInfoPos, setListInfoPos] = useState({ x: 16, y: 16 });
  const [pointersPos, setPointersPos] = useState({ x: 16, y: 180 });
  const [codePos, setCodePos] = useState({ x: 570, y: 16 });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);
  const [canvasH, setCanvasH] = useState(500);

  useEffect(() => {
    if (typeof window !== "undefined") synthRef.current = window.speechSynthesis;
    return () => { synthRef.current?.cancel(); };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ro = new ResizeObserver(es => setCanvasH(es[0].contentRect.height || 500));
    ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, []);

  const steps = useMemo((): LLStep[] => {
    switch (config.archetype) {
      case "traverse": return genTraverse(listData);
      case "insert":   return genInsert(listData);
      case "delete":   return genDelete(listData);
      case "reverse":  return genReverse(listData);
      case "slowfast": return genSlowFast(listData);
      default:         return genTraverse(listData);
    }
  }, [listData, config.archetype]);

  const step = steps[Math.min(stepIdx, steps.length - 1)] ?? steps[0];

  const speak = useCallback((text: string) => {
    if (!speechOn || !synthRef.current) return;
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.05; utt.volume = 1;
    synthRef.current.speak(utt);
  }, [speechOn]);

  useEffect(() => { if (step) speak(step.speechMessage); }, [stepIdx, speechOn]); // eslint-disable-line

  const reset = useCallback(() => { setIsPlaying(false); setStepIdx(0); }, []);

  useEffect(() => {
    if (!isPlaying) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setStepIdx(p => { if (p >= steps.length - 1) { setIsPlaying(false); return p; } return p + 1; });
    }, speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, steps.length]);

  const startPanelDrag = (panel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const p = panel === "info" ? listInfoPos : panel === "ptrs" ? pointersPos : codePos;
    panelDrag.current = { panel, ox: e.clientX, oy: e.clientY, sx: p.x, sy: p.y };
  };

  useEffect(() => {
    const mv = (e: MouseEvent) => {
      if (!panelDrag.current) return;
      const nx = panelDrag.current.sx + e.clientX - panelDrag.current.ox;
      const ny = panelDrag.current.sy + e.clientY - panelDrag.current.oy;
      if      (panelDrag.current.panel === "info")  setListInfoPos({ x: nx, y: ny });
      else if (panelDrag.current.panel === "ptrs")  setPointersPos({ x: nx, y: ny });
      else                                           setCodePos({ x: nx, y: ny });
    };
    const up = () => { panelDrag.current = null; };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, []);

  const progress = steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0;
  const listLen  = listData.order.length;
  const svgW     = Math.max(listLen * SPACING + 120, 600);
  const svgY     = Math.max((canvasH - NODE_H) / 2, START_Y);
  const pointerEntries = step && step.pointers ? Object.entries(step.pointers).filter(([, v]) => v !== undefined && v !== null) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", fontFamily: "'JetBrains Mono','Fira Code',monospace", overflow: "hidden" }}>
      <TheorySection 
        title={config.title}
        definition={config.definition}
        timeComplexity={config.timeComplexity}
        spaceComplexity={config.spaceComplexity}
        keyPoints={config.keyPoints}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", background: "#161b22", borderBottom: "1px solid #21262d", flexShrink: 0 }}>
        <button onClick={reset} style={{ background: "#21262d", border: "1px solid #30363d", color: "#c9d1d9", padding: "5px 14px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Reset Simulation</button>
        <div style={{ marginLeft: "auto", fontSize: 10, color: "#484f58" }}>Length: <span style={{ color: "#58a6ff" }}>{listLen}</span></div>
      </div>
      <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 124px)", overflow: "hidden" }}>
        <div style={{ width: 224, background: "#161b22", borderRight: "1px solid #21262d", display: "flex", flexDirection: "column", padding: 14, gap: 14, flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: "#484f58", lineHeight: 1.9 }}>
            <div>■ Drag panel headers to <span style={{ color: "#58a6ff" }}>Rearrange</span></div>
            <div>■ 🔊 toggles <span style={{ color: "#58a6ff" }}>Narration</span></div>
          </div>
          {config.archetype !== "theory" && (
            <>
              <div style={{ borderTop: "1px solid #21262d", paddingTop: 12 }}>
                <div style={{ fontSize: 9, color: "#484f58", textTransform: "uppercase", marginBottom: 6 }}>Current Step</div>
                <div style={{ fontSize: 11, color: "#c9d1d9", lineHeight: 1.65 }}>{step?.message ?? "—"}</div>
              </div>
              <div style={{ borderTop: "1px solid #21262d", paddingTop: 12 }}>
                <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
                  <CtrlBtn onClick={reset} title="Reset">↺</CtrlBtn>
                  <CtrlBtn onClick={() => setStepIdx(p => Math.max(0, p - 1))} title="Prev">‹</CtrlBtn>
                  <CtrlBtn primary onClick={() => setIsPlaying(p => !p)} title="Play/Pause">{isPlaying ? "⏸" : "▶"}</CtrlBtn>
                  <CtrlBtn onClick={() => setStepIdx(p => Math.min(p + 1, steps.length - 1))} title="Next">›</CtrlBtn>
                  <CtrlBtn onClick={() => setSpeechOn(p => !p)} title="Mute/Unmute" xStyle={{ background: speechOn ? "#1a3a22" : "#21262d", color: speechOn ? "#3fb950" : "#484f58" }}>{speechOn ? "🔊" : "🔇"}</CtrlBtn>
                </div>
                <input type="range" min={150} max={2000} step={100} value={2150 - speed} onChange={e => setSpeed(2150 - parseInt(e.target.value, 10))} style={{ width: "100%", accentColor: "#f85149" }} />
              </div>
              <div style={{ marginTop: "auto" }}>
                <div style={{ height: 2, background: "#21262d", borderRadius: 1 }}><div style={{ height: "100%", width: `${progress}%`, background: "#58a6ff", transition: "width .3s" }} /></div>
                <div style={{ fontSize: 10, color: "#484f58", marginTop: 5, textAlign: "right" }}>{stepIdx + 1} / {steps.length}</div>
              </div>
            </>
          )}
        </div>
        <div ref={canvasRef} style={{ flex: 1, position: "relative", overflow: "hidden", background: "#0d1117" }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}><defs><pattern id="ll-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#ll-grid)" /></svg>
          <div style={{ position: "absolute", inset: 0, overflow: "auto" }}>
            <svg width={svgW} height={Math.max(canvasH, 500)} style={{ display: "block", minWidth: "100%", minHeight: "100%" }}>
              <defs>
                <marker id="ll-arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#30363d" /></marker>
                <marker id="ll-arr-vis" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#58a6ff" /></marker>
                <marker id="ll-arr-act" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#f0883e" /></marker>
              </defs>
              {listData.headId && <text x={START_X + NODE_W / 2} y={svgY - 36} textAnchor="middle" fill="#484f58" style={{ fontSize: 10 }}>HEAD</text>}
              {listData.order.map((id, idx) => {
                const x = START_X + idx * SPACING;
                const y = svgY;
                const n = listData.nodes[id];
                if (!n) return null;
                const isVis = step?.visitedNodes?.includes(id);
                const isAct = step?.activeNode === id;
                const bg = isAct ? "#2a1f0e" : isVis ? "#162032" : "#161b22";
                const border = isAct ? "#f0883e" : isVis ? "#58a6ff" : "#30363d";
                const ptrsHere = pointerEntries.filter(([, vid]) => vid === id).map(([k]) => k);
                return (
                  <g key={id}>
                    {ptrsHere.map((ptr, pi) => (
                      <g key={ptr}>
                        <text x={x + NODE_W / 2} y={y - 46 - pi * 14} textAnchor="middle" fill="#f0883e" style={{ fontSize: 9, fontWeight: 700 }}>{ptr}</text>
                        <line x1={x + NODE_W / 2} y1={y - 38 - pi * 14} x2={x + NODE_W / 2} y2={y - 6} stroke="#f0883e" strokeDasharray="3 2" />
                      </g>
                    ))}
                    <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={8} fill={bg} stroke={border} strokeWidth={isAct ? 2 : 1.5} style={{ transition: "fill .25s, stroke .25s" }} />
                    <text x={x + NODE_W / 2 - 6} y={y + NODE_H / 2} textAnchor="middle" dominantBaseline="middle" fill={border} style={{ fontSize: 13, fontWeight: 700 }}>{n.value}</text>
                    <rect x={x + NODE_W - 14} y={y + NODE_H / 2 - 7} width={12} height={14} rx={3} fill={n.next ? "rgba(88,166,255,0.12)" : "rgba(248,81,73,0.12)"} stroke={n.next ? "rgba(88,166,255,0.3)" : "rgba(248,81,73,0.3)"} />
                    <text x={x + NODE_W - 8} y={y + NODE_H / 2} textAnchor="middle" dominantBaseline="middle" fill={n.next ? "#58a6ff" : "#f85149"} style={{ fontSize: 8 }}>{n.next ? "→" : "∅"}</text>
                    <text x={x + NODE_W / 2} y={y + NODE_H + 16} textAnchor="middle" fill="#333d4d" style={{ fontSize: 9 }}>[{idx}]</text>
                    {n.next && <line x1={x + NODE_W - 2} y1={y + NODE_H / 2} x2={x + SPACING - 4} y2={y + NODE_H / 2} stroke={step?.highlightEdge === `${id}-${n.next}` ? "#f0883e" : isVis ? "#58a6ff" : "#30363d"} strokeWidth={1.5} markerEnd="url(#ll-arr)" />}
                  </g>
                );
              })}
            </svg>
          </div>
          <FloatPanel title="LIST INFO" pos={listInfoPos} onDrag={(e: React.MouseEvent) => startPanelDrag("info", e)} width={170}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 11, color: "#484f58" }}>Length</span><span style={{ fontSize: 13, color: "#c9d1d9" }}>{listLen}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 11, color: "#484f58" }}>Archetype</span><span style={{ fontSize: 13, color: "#f0883e" }}>{config.archetype}</span></div>
          </FloatPanel>
          {config.archetype !== "theory" && (
            <>
              <FloatPanel title="POINTERS" pos={pointersPos} onDrag={(e: React.MouseEvent) => startPanelDrag("ptrs", e)} width={170}>
                {pointerEntries.length === 0 && <div style={{ fontSize: 10, color: "#484f58", fontStyle: "italic" }}>none</div>}
                {pointerEntries.map(([name, vid]) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: "#f0883e", fontWeight: 700 }}>{name}</span>
                    <span style={{ fontSize: 12, color: vid ? "#c9d1d9" : "#484f58", fontWeight: 700 }}>{vid ? `→ [${listData.nodes[vid as string]?.value}]` : "null"}</span>
                  </div>
                ))}
              </FloatPanel>
              <FloatPanel title="Logic Tracker" pos={codePos} onDrag={(e: React.MouseEvent) => startPanelDrag("code", e)} width={280}>
                {config.code.map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "4px 8px", borderRadius: 4, background: step?.line === i ? "rgba(88,166,255,0.1)" : "transparent", borderLeft: step?.line === i ? "2px solid #58a6ff" : "2px solid transparent" }}>
                    <span style={{ fontSize: 10, color: "#484f58", minWidth: 16 }}>{i + 1}</span>
                    <span style={{ fontSize: 11, color: step?.line === i ? "#c9d1d9" : "#484f58", fontFamily: "inherit", whiteSpace: "nowrap" }}>{line}</span>
                  </div>
                ))}
              </FloatPanel>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
