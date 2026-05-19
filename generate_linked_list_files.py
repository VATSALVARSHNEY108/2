import os
import re

DIRECTORY = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\linked-list"

TEMPLATE = """\"use client\";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TheorySection } from "../../../components/TheorySection";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ListNode {
  id: string;
  value: number;
  next: string | null;
}

interface LLStep {
  type: string;
  activeNodes: string[];
  pointers: Record<string, string | null>;
  message: string;
  speechMessage: string;
  line: number | null;
}

interface LLData {
  nodes: Record<string, ListNode>;
  head: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NODE_W = 60;
const NODE_H = 40;
const H_GAP  = 100;
const DEFAULT_VALUES = [10, 20, 30, 40, 50];

const CODE_SNIPPET = [
  "function processLinkedList(head):",
  "  let curr = head",
  "  while curr is not null:",
  "    visit(curr)",
  "    curr = curr.next",
  "  return",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
let _uid = 100;
function mkId() { return `n${_uid++}`; }

function buildLinkedList(values: number[]): LLData {
  const nodes: Record<string, ListNode> = {};
  let head: string | null = null;
  let prevId: string | null = null;

  for (const v of values) {
    const id = mkId();
    nodes[id] = { id, value: v, next: null };
    if (!head) head = id;
    if (prevId) nodes[prevId].next = id;
    prevId = id;
  }
  return { nodes, head };
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function layoutLinkedList(
  data: LLData,
  canvasW: number
): Record<string, { x: number; y: number }> {
  const pos: Record<string, { x: number; y: number }> = {};
  let cur = data.head;
  let i = 0;
  const startX = 80;
  const startY = 150;

  while (cur && data.nodes[cur]) {
    pos[cur] = { x: startX + i * H_GAP, y: startY };
    cur = data.nodes[cur].next;
    i++;
  }
  return pos;
}

// ─── Step generators ──────────────────────────────────────────────────────────
function generateSteps(data: LLData): LLStep[] {
  const steps: LLStep[] = [];
  
  steps.push({
    type: "init", activeNodes: [], pointers: { head: data.head },
    message: "Start traversal...",
    speechMessage: "Starting traversal.",
    line: 0,
  });

  let curr = data.head;
  steps.push({
    type: "init", activeNodes: [], pointers: { head: data.head, curr },
    message: "Set curr = head",
    speechMessage: "Set current to head.",
    line: 1,
  });

  while (curr && data.nodes[curr]) {
    steps.push({
      type: "check", activeNodes: [curr], pointers: { head: data.head, curr },
      message: `Checking node ${data.nodes[curr].value}`,
      speechMessage: `Checking node ${data.nodes[curr].value}`,
      line: 2,
    });
    
    steps.push({
      type: "visit", activeNodes: [curr], pointers: { head: data.head, curr },
      message: `Visiting node ${data.nodes[curr].value}`,
      speechMessage: `Visiting node ${data.nodes[curr].value}`,
      line: 3,
    });

    const nextId = data.nodes[curr].next;
    steps.push({
      type: "move", activeNodes: [], pointers: { head: data.head, curr: nextId },
      message: "Move curr to next node",
      speechMessage: "Moving current to next node.",
      line: 4,
    });
    curr = nextId;
  }

  steps.push({
    type: "done", activeNodes: [], pointers: { head: data.head, curr: null },
    message: "Traversal complete.",
    speechMessage: "Traversal complete.",
    line: 5,
  });

  return steps;
}

// ─── Style helpers ────────────────────────────────────────────────────────────
function inputSty(w: number): React.CSSProperties {
  return {
    background: "#21262d", border: "1px solid #30363d", color: "#c9d1d9",
    padding: "5px 10px", borderRadius: 6, fontSize: 11,
    fontFamily: "inherit", outline: "none", width: w,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ width: 1, height: 24, background: "#21262d", margin: "0 4px" }} />;
}

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 9, color: "#484f58", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>
      {children}
    </div>
  );
}

function FloatPanel({ title, pos, onDrag, width, children }: {
  title: string; pos: { x: number; y: number };
  onDrag: (e: React.MouseEvent) => void; width: number; children: React.ReactNode;
}) {
  return (
    <div style={{
      position: "absolute", left: pos.x, top: pos.y, width,
      background: "rgba(22,27,34,0.95)", border: "1px solid #21262d",
      borderRadius: 10, overflow: "hidden", backdropFilter: "blur(8px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)", userSelect: "none", zIndex: 10,
    }}>
      <div onMouseDown={onDrag} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px", background: "#21262d", cursor: "grab",
        fontSize: 10, fontWeight: 700, letterSpacing: ".12em",
        textTransform: "uppercase", color: "#8b949e",
      }}>
        {title}
        <span style={{ fontSize: 14, opacity: 0.4 }}>⠿</span>
      </div>
      <div style={{ padding: "12px 14px" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, val, color }: { label: string; val: string | number; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: "#484f58" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: color ?? "#c9d1d9" }}>{val}</span>
    </div>
  );
}

function ToolBtn({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "#1f6feb" : "#21262d",
      border: `1px solid ${active ? "#388bfd" : "#30363d"}`,
      color: active ? "#fff" : "#c9d1d9",
      padding: "5px 14px", borderRadius: 6, cursor: "pointer",
      fontSize: 11, fontFamily: "inherit", fontWeight: 600,
    }}>
      {children}
    </button>
  );
}

function CtrlBtn({ children, onClick, primary, title, xStyle }: {
  children: React.ReactNode; onClick: () => void; primary?: boolean; title?: string; xStyle?: React.CSSProperties;
}) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 32, height: 32, borderRadius: 6,
      background: primary ? "#1f6feb" : "#21262d",
      border: `1px solid ${primary ? "#388bfd" : "#30363d"}`,
      color: "#c9d1d9", cursor: "pointer", fontSize: 14,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "inherit", ...xStyle,
    }}>
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function {COMPONENT_NAME}() {
  const [data, setData] = useState<LLData>(() => buildLinkedList(DEFAULT_VALUES));
  
  const [stepIdx, setStepIdx]     = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed]         = useState(900);

  const [speechOn, setSpeechOn]       = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [inputError, setInputError]   = useState("");

  const [infoPos, setInfoPos]   = useState({ x: 16,  y: 16  });
  const [ptrPos, setPtrPos]     = useState({ x: 16,  y: 200 });
  const [codePos, setCodePos]   = useState({ x: 570, y: 16  });

  const [canvasW, setCanvasW] = useState(900);
  const [draggedPos, setDraggedPos] = useState<Record<string, { x: number; y: number }>>({});

  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const synthRef  = useRef<SpeechSynthesis | null>(null);
  const svgRef    = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);
  const nodeDrag  = useRef<{ id: string; ox: number; oy: number } | null>(null);

  // init speech + ResizeObserver
  useEffect(() => {
    if (typeof window !== "undefined") synthRef.current = window.speechSynthesis;
    return () => { synthRef.current?.cancel(); };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ro = new ResizeObserver(es => setCanvasW(es[0].contentRect.width || 900));
    ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, []);

  // steps
  const steps = useMemo(() => generateSteps(data), [data]);
  const step = steps[Math.min(stepIdx, steps.length - 1)] ?? steps[0];

  // speech
  const speak = useCallback((text: string) => {
    if (!speechOn || !synthRef.current) return;
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.05; utt.pitch = 1; utt.volume = 1;
    const vs = synthRef.current.getVoices();
    const v  = vs.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("google"))
            || vs.find(v => v.lang.startsWith("en")) || vs[0];
    if (v) utt.voice = v;
    synthRef.current.speak(utt);
  }, [speechOn]);

  useEffect(() => { if (step) speak(step.speechMessage); }, [stepIdx, speechOn]); // eslint-disable-line
  useEffect(() => { if (!speechOn) synthRef.current?.cancel(); }, [speechOn]);

  // layout
  const autoLayout = useMemo(() => layoutLinkedList(data, canvasW), [data, canvasW]);

  const nodePositions = useMemo(() => {
    const m: Record<string, { x: number; y: number }> = {};
    for (const id of Object.keys(data.nodes)) {
      m[id] = draggedPos[id] ?? autoLayout[id] ?? { x: canvasW / 2, y: 150 };
    }
    return m;
  }, [autoLayout, draggedPos, data.nodes, canvasW]);

  // playback
  const reset = useCallback(() => { setIsPlaying(false); setStepIdx(0); }, []);

  useEffect(() => {
    if (!isPlaying) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setStepIdx(p => {
        if (p >= steps.length - 1) { setIsPlaying(false); return p; }
        return p + 1;
      });
    }, speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, steps.length]);

  // panel drag
  useEffect(() => {
    const mv = (e: MouseEvent) => {
      if (!panelDrag.current) return;
      const nx = panelDrag.current.sx + e.clientX - panelDrag.current.ox;
      const ny = panelDrag.current.sy + e.clientY - panelDrag.current.oy;
      if      (panelDrag.current.panel === "info") setInfoPos({ x: nx, y: ny });
      else if (panelDrag.current.panel === "ptr")  setPtrPos({ x: nx, y: ny });
      else                                         setCodePos({ x: nx, y: ny });
    };
    const up = () => { panelDrag.current = null; };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, []);

  const startPanelDrag = (panel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const p = panel === "info" ? infoPos : panel === "ptr" ? ptrPos : codePos;
    panelDrag.current = { panel, ox: e.clientX, oy: e.clientY, sx: p.x, sy: p.y };
  };

  // node drag (SVG)
  const onSvgMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const el = (e.target as SVGElement).closest("[data-nodeid]") as SVGElement | null;
    if (!el || !svgRef.current) return;
    const id  = el.getAttribute("data-nodeid")!;
    const pos = nodePositions[id];
    if (!pos) return;
    const rect = svgRef.current.getBoundingClientRect();
    nodeDrag.current = { id, ox: e.clientX - rect.left - pos.x, oy: e.clientY - rect.top - pos.y };
    e.preventDefault();
  }, [nodePositions]);

  const onSvgMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!nodeDrag.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setDraggedPos(prev => ({
      ...prev,
      [nodeDrag.current!.id]: {
        x: e.clientX - rect.left  - nodeDrag.current!.ox,
        y: e.clientY - rect.top   - nodeDrag.current!.oy,
      },
    }));
  }, []);

  const onSvgMouseUp = useCallback(() => { nodeDrag.current = null; }, []);

  // custom input
  const applyInput = useCallback(() => {
    const raw = customInput.trim();
    if (!raw) { setInputError("Enter comma-separated numbers"); return; }
    const parts = raw.split(",").map(s => parseInt(s.trim(), 10));
    if (parts.some(isNaN)) { setInputError("Invalid — use: 10,20,30"); return; }
    setInputError("");
    setData(buildLinkedList(parts));
    setDraggedPos({});
    reset();
  }, [customInput, reset]);

  const progress = steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0;

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#0d1117", color:"#c9d1d9", fontFamily:"'JetBrains Mono','Fira Code',monospace", overflow:"hidden" }}>
      <TheorySection 
        title="{TITLE}"
        definition="A comprehensive visualization for {TITLE} operations in a linked list."
        timeComplexity="O(N)"
        spaceComplexity="O(1)"
        keyPoints={["Pointer manipulation", "Sequential access", "Dynamic resizing"]}
      />
      
      {/* TOOLBAR */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", background:"#161b22", borderBottom:"1px solid #21262d", flexShrink:0, flexWrap:"wrap" }}>
        <ToolBtn onClick={()=>{ setData(buildLinkedList(DEFAULT_VALUES)); setDraggedPos({}); reset(); }}>Reset List</ToolBtn>
        <Divider/>
        <div style={{marginLeft:"auto",fontSize:10,color:"#484f58"}}>
          Nodes: <span style={{color:"#58a6ff"}}>{Object.keys(data.nodes).length}</span>
        </div>
      </div>

      {/* BODY */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* SIDEBAR */}
        <div style={{width:224,background:"#161b22",borderRight:"1px solid #21262d",display:"flex",flexDirection:"column",padding:14,gap:14,flexShrink:0,overflowY:"auto"}}>
          <div style={{fontSize:10,color:"#484f58",lineHeight:1.9}}>
            <div>■ Drag nodes to <span style={{color:"#58a6ff"}}>Reposition</span></div>
            <div>■ Drag panel headers to <span style={{color:"#58a6ff"}}>Rearrange</span></div>
            <div>■ 🔊 toggles <span style={{color:"#58a6ff"}}>Narration</span></div>
          </div>

          {/* custom input */}
          <div style={{borderTop:"1px solid #21262d",paddingTop:12}}>
            <SLabel>Custom List</SLabel>
            <textarea value={customInput} onChange={e=>setCustomInput(e.target.value)}
              placeholder="e.g. 10,20,30,40" rows={3}
              style={{width:"100%",background:"#0d1117",border:"1px solid #21262d",color:"#c9d1d9",borderRadius:6,padding:"7px 9px",fontSize:10,fontFamily:"inherit",resize:"vertical",outline:"none",lineHeight:1.6,boxSizing:"border-box"}}
            />
            {inputError&&<div style={{fontSize:10,color:"#f85149",marginTop:3}}>{inputError}</div>}
            <div style={{display:"flex",gap:6,marginTop:7}}>
              <button onClick={applyInput} style={{flex:1,background:"#1f6feb",border:"1px solid #388bfd",color:"#fff",padding:"5px 0",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600}}>Apply</button>
              <button onClick={()=>{setCustomInput("");setInputError("");}} style={{width:30,background:"#21262d",border:"1px solid #30363d",color:"#8b949e",borderRadius:6,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>✕</button>
            </div>
          </div>

          {/* step */}
          <div style={{borderTop:"1px solid #21262d",paddingTop:12}}>
            <SLabel>Current Step</SLabel>
            <div style={{fontSize:11,color:"#c9d1d9",lineHeight:1.65}}>{step?.message ?? "—"}</div>
          </div>

          {/* controls */}
          <div style={{borderTop:"1px solid #21262d",paddingTop:12}}>
            <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
              <CtrlBtn onClick={reset} title="Reset">↺</CtrlBtn>
              <CtrlBtn onClick={()=>setStepIdx(p=>Math.max(0,p-1))} title="Prev">‹</CtrlBtn>
              <CtrlBtn primary onClick={()=>setIsPlaying(p=>!p)} title="Play/Pause">{isPlaying?"⏸":"▶"}</CtrlBtn>
              <CtrlBtn onClick={()=>setStepIdx(p=>Math.min(p+1,steps.length-1))} title="Next">›</CtrlBtn>
              <CtrlBtn onClick={()=>setSpeechOn(p=>!p)} title={speechOn?"Mute":"Unmute"}
                xStyle={{background:speechOn?"#1a3a22":"#21262d",border:`1px solid ${speechOn?"#3fb950":"#30363d"}`,color:speechOn?"#3fb950":"#484f58"}}>
                {speechOn?"🔊":"🔇"}
              </CtrlBtn>
            </div>
            <input type="range" min={150} max={2000} step={100} value={2150-speed}
              onChange={e=>setSpeed(2150-parseInt(e.target.value,10))}
              style={{width:"100%",accentColor:"#f85149"}} />
          </div>

          {/* progress */}
          <div style={{marginTop:"auto"}}>
            <div style={{height:2,background:"#21262d",borderRadius:1}}>
              <div style={{height:"100%",width:`${progress}%`,background:"#58a6ff",transition:"width .3s",borderRadius:1}}/>
            </div>
            <div style={{fontSize:10,color:"#484f58",marginTop:5,textAlign:"right"}}>{stepIdx+1} / {steps.length}</div>
          </div>
        </div>

        {/* CANVAS */}
        <div ref={canvasRef} style={{flex:1,position:"relative",overflow:"hidden",background:"#0d1117"}}>

          {/* grid */}
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
            <defs>
              <pattern id="ll-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ll-grid)"/>
          </svg>

          {/* tree SVG */}
          <svg ref={svgRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}
            onMouseDown={onSvgMouseDown} onMouseMove={onSvgMouseMove} onMouseUp={onSvgMouseUp}>
            <defs>
              <marker id="arr-def" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,7 3,0 6" fill="#30363d"/>
              </marker>
              <marker id="arr-act" markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0,7 3,0 6" fill="#f0883e"/>
              </marker>
            </defs>

            {/* edges */}
            {Object.values(data.nodes).map(n=>{
              const fp=nodePositions[n.id]; if(!fp) return null;
              const cid=n.next; if(!cid) return null;
              const tp=nodePositions[cid]; if(!tp) return null;
              
              const dx=tp.x-fp.x,dy=tp.y-fp.y,len=Math.sqrt(dx*dx+dy*dy); if(len===0) return null;
              const nx2=dx/len,ny2=dy/len;
              
              const sx=fp.x+nx2*(NODE_W/2),sy=fp.y+ny2*(NODE_H/2);
              const ex=tp.x-nx2*(NODE_W/2 + 5),ey=tp.y-ny2*(NODE_H/2 + 5);
              
              const isHl = step.activeNodes.includes(n.id) || step.activeNodes.includes(cid);
              const stroke = isHl ? "#f0883e" : "#21262d";
              const marker = isHl ? "url(#arr-act)" : "url(#arr-def)";
              const sw = isHl ? 2.5 : 1.5;

              return <line key={`edge-${n.id}`} x1={sx} y1={sy} x2={ex} y2={ey}
                stroke={stroke} strokeWidth={sw} markerEnd={marker}
                style={{transition:"stroke .25s,stroke-width .25s"}}/>;
            })}

            {/* pointers rendering (head, curr, etc) */}
            {Object.entries(step.pointers).map(([ptrName, nodeId], idx) => {
               if (!nodeId) return null;
               const pos = nodePositions[nodeId];
               if (!pos) return null;
               return (
                 <g key={`ptr-${ptrName}`} style={{transition: "all 0.3s"}}>
                   <rect x={pos.x - 20} y={pos.y + 35 + (idx * 20)} width="40" height="16" rx="4" fill="#1f6feb" />
                   <text x={pos.x} y={pos.y + 44 + (idx * 20)} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
                     {ptrName}
                   </text>
                 </g>
               );
            })}

            {/* nodes */}
            {Object.values(data.nodes).map(n=>{
              const pos=nodePositions[n.id]; if(!pos) return null;
              const isActive = step.activeNodes.includes(n.id);
              const fill = isActive ? "#2a1f0e" : "#161b22";
              const stroke = isActive ? "#f0883e" : "#30363d";
              const sw = isActive ? 2.5 : 1.5;
              const tc = isActive ? "#f0883e" : "#c9d1d9";

              return (
                <g key={n.id} data-nodeid={n.id} style={{cursor:"grab"}}>
                  <rect x={pos.x - NODE_W/2} y={pos.y - NODE_H/2} width={NODE_W} height={NODE_H} rx={6}
                    fill={fill} stroke={stroke} strokeWidth={sw} style={{transition:"fill .25s,stroke .25s"}}/>
                  <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fill={tc}
                    style={{fontSize:14,fontWeight:700,fontFamily:"inherit",userSelect:"none",transition:"fill .25s"}}>
                    {n.value}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* PANEL — Info */}
          <FloatPanel title="LIST INFO" pos={infoPos} onDrag={e=>startPanelDrag("info",e)} width={170}>
            <InfoRow label="Nodes" val={Object.keys(data.nodes).length}/>
            <InfoRow label="Head"  val={data.head ? data.nodes[data.head]?.value ?? "—" : "—"} color="#f0883e"/>
          </FloatPanel>

          {/* PANEL — Pointers Tracker */}
          <FloatPanel title="POINTERS" pos={ptrPos} onDrag={e=>startPanelDrag("ptr",e)} width={175}>
             <div style={{display:"flex", flexDirection:"column", gap: 8}}>
               {Object.entries(step.pointers).map(([ptrName, ptrId]) => (
                 <InfoRow key={ptrName} label={ptrName} val={ptrId && data.nodes[ptrId] ? data.nodes[ptrId].value : "null"} color="#58a6ff" />
               ))}
             </div>
          </FloatPanel>

          {/* PANEL — Logic Tracker */}
          <FloatPanel title="Logic Tracker" pos={codePos} onDrag={e=>startPanelDrag("code",e)} width={292}>
            {CODE_SNIPPET.map((line,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"4px 8px",borderRadius:4,background:step.line===i?"rgba(88,166,255,0.1)":"transparent",borderLeft:step.line===i?"2px solid #58a6ff":"2px solid transparent",transition:"background .2s"}}>
                <span style={{fontSize:10,color:"#484f58",minWidth:16,userSelect:"none"}}>{i+1}</span>
                <span style={{fontSize:11,color:step.line===i?"#c9d1d9":"#484f58",fontFamily:"inherit"}}>{line}</span>
              </div>
            ))}
          </FloatPanel>
        </div>
      </div>
    </div>
  );
}
"""

def to_camel_case(s):
    # e.g., "Singly Linked List" -> "SinglyLinkedList"
    # or "delete-nth-node-from-end.tsx" -> "DeleteNthNodeFromEnd"
    s = s.replace('.tsx', '')
    words = re.split(r'[^a-zA-Z0-9]+', s)
    return ''.join(w.capitalize() for w in words if w)

def to_title(s):
    s = s.replace('.tsx', '')
    words = re.split(r'[^a-zA-Z0-9]+', s)
    return ' '.join(w.capitalize() for w in words if w)

def main():
    if not os.path.exists(DIRECTORY):
        print(f"Directory {DIRECTORY} not found!")
        return

    count = 0
    for filename in os.listdir(DIRECTORY):
        if filename.endswith(".tsx"):
            path = os.path.join(DIRECTORY, filename)
            component_name = to_camel_case(filename)
            title = to_title(filename)
            
            # Create the final content
            final_content = TEMPLATE.replace('{COMPONENT_NAME}', component_name)
            final_content = final_content.replace('{TITLE}', title)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(final_content)
                
            count += 1
            print(f"Processed: {filename} -> {component_name} | {title}")

    print(f"Successfully processed {count} files.")

if __name__ == "__main__":
    main()
