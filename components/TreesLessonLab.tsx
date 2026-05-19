"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TheorySection } from "@/components/TheorySection";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  parent: string | null;
}

interface BSTStep {
  type: string;
  activeNode: string | null;
  visitedNodes: string[];
  foundNode: string | null;
  pathNodes: string[];
  highlightEdge: { from: string; to: string } | null;
  traversalOrder: number[];
  message: string;
  speechMessage: string;
  line: number | null;
  compareResult?: "left" | "right" | "found" | null;
}

interface TreeData {
  nodes: Record<string, TreeNode>;
  rootId: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NODE_R = 26;
const V_GAP  = 80;
const DEFAULT_VALUES = [15, 9, 20, 6, 12, 17, 25, 3, 8, 11, 14];

const INORDER_CODE = [
  "struct Node {",
  "    int value;",
  "    Node *left;",
  "    Node *right;",
  "    Node(int x) : value(x), left(nullptr), right(nullptr) {}",
  "};",
  "",
  "class Solution {",
  "public:",
  "    void inorder(Node* node, vector<int>& res) {",
  "        if (node == nullptr) return;",
  "        inorder(node->left, res);",
  "        res.push_back(node->value);",
  "        inorder(node->right, res);",
  "    }",
  "};",
];

const SEARCH_CODE = [
  "struct Node {",
  "    int value;",
  "    Node *left;",
  "    Node *right;",
  "    Node(int x) : value(x), left(nullptr), right(nullptr) {}",
  "};",
  "",
  "class Solution {",
  "public:",
  "    Node* search(Node* node, int target) {",
  "        if (node == nullptr) return nullptr;",
  "        if (target == node->value) return node;",
  "        if (target < node->value) return search(node->left, target);",
  "        return search(node->right, target);",
  "    }",
  "};",
];

// ─── BST helpers ──────────────────────────────────────────────────────────────
let _uid = 100;
function mkId() { return `n${_uid++}`; }

function insertBST(data: TreeData, value: number): TreeData {
  const newId = mkId();
  const newNode: TreeNode = { id: newId, value, left: null, right: null, parent: null };
  const nodes: Record<string, TreeNode> = { ...data.nodes };

  if (!data.rootId) {
    nodes[newId] = newNode;
    return { nodes, rootId: newId };
  }

  nodes[newId] = { ...newNode };
  let cur = data.rootId;
  while (true) {
    const n = { ...nodes[cur] };
    nodes[cur] = n;
    if (value < n.value) {
      if (!n.left) { n.left = newId; nodes[newId] = { ...nodes[newId], parent: cur }; break; }
      cur = n.left;
    } else if (value > n.value) {
      if (!n.right) { n.right = newId; nodes[newId] = { ...nodes[newId], parent: cur }; break; }
      cur = n.right;
    } else {
      // duplicate — skip
      delete nodes[newId];
      return data;
    }
  }
  return { nodes, rootId: data.rootId };
}

function buildBST(values: number[]): TreeData {
  let data: TreeData = { nodes: {}, rootId: null };
  for (const v of values) data = insertBST(data, v);
  return data;
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function layoutTree(
  nodes: Record<string, TreeNode>,
  rootId: string | null,
  canvasW: number
): Record<string, { x: number; y: number }> {
  const pos: Record<string, { x: number; y: number }> = {};
  if (!rootId || !nodes[rootId]) return pos;

  function leafCount(id: string | null): number {
    if (!id || !nodes[id]) return 1;
    const n = nodes[id];
    if (!n.left && !n.right) return 1;
    return leafCount(n.left) + leafCount(n.right);
  }

  function place(id: string | null, depth: number, lo: number, hi: number) {
    if (!id || !nodes[id]) return;
    pos[id] = { x: (lo + hi) / 2, y: 60 + depth * V_GAP };
    const n = nodes[id];
    const lLeaves = leafCount(n.left);
    const rLeaves = leafCount(n.right);
    const total   = lLeaves + rLeaves || 1;
    const mid     = lo + (hi - lo) * (lLeaves / total);
    place(n.left,  depth + 1, lo,  mid);
    place(n.right, depth + 1, mid, hi);
  }

  place(rootId, 0, 40, canvasW - 40);
  return pos;
}

// ─── Step generators ──────────────────────────────────────────────────────────
function generateInorderSteps(nodes: Record<string, TreeNode>, rootId: string | null): BSTStep[] {
  const steps: BSTStep[] = [];
  const visited: string[] = [];
  const order: number[]   = [];

  steps.push({
    type: "init", activeNode: null, visitedNodes: [], foundNode: null,
    pathNodes: [], highlightEdge: null, traversalOrder: [],
    message: "Start traversal...",
    speechMessage: "Starting traversal.",
    line: 9,
  });

  function traverse(id: string | null) {
    if (!id || !nodes[id]) return;
    const n = nodes[id];

    steps.push({
      type: "process", activeNode: id, visitedNodes: [...visited], foundNode: null,
      pathNodes: [...visited, id],
      highlightEdge: n.parent ? { from: n.parent, to: id } : null,
      traversalOrder: [...order],
      message: `At node ${n.value}`,
      speechMessage: `At node ${n.value}`,
      line: 11,
    });

    traverse(n.left);
    
    visited.push(id);
    order.push(n.value);
    steps.push({
      type: "visit", activeNode: id, visitedNodes: [...visited], foundNode: null,
      pathNodes: [...visited], highlightEdge: null,
      traversalOrder: [...order],
      message: `Visit ${n.value}`,
      speechMessage: `Visiting ${n.value}`,
      line: 12,
    });

    traverse(n.right);
  }

  traverse(rootId);

  steps.push({
    type: "done", activeNode: null, visitedNodes: [...visited], foundNode: null,
    pathNodes: [], highlightEdge: null, traversalOrder: [...order],
    message: "Done!",
    speechMessage: "Traversal complete.",
    line: 14,
  });

  return steps;
}

function generateSearchSteps(
  nodes: Record<string, TreeNode>,
  rootId: string | null,
  target: number
): BSTStep[] {
  const steps: BSTStep[] = [];
  const path: string[] = [];

  steps.push({
    type: "init", activeNode: null, visitedNodes: [], foundNode: null,
    pathNodes: [], highlightEdge: null, traversalOrder: [],
    message: `Searching for ${target}...`,
    speechMessage: `Searching for ${target}...`,
    line: 9,
  });

  let cur: string | null = rootId;
  while (cur && nodes[cur]) {
    const n = nodes[cur];
    path.push(cur);

    if (target === n.value) {
      steps.push({
        type: "found", activeNode: cur, visitedNodes: [...path], foundNode: cur,
        pathNodes: [...path],
        highlightEdge: n.parent ? { from: n.parent, to: cur } : null,
        traversalOrder: [],
        message: `Found ${target}!`,
        speechMessage: `Found ${target}!`,
        line: 11, compareResult: "found",
      });
      return steps;
    } else if (target < n.value) {
      steps.push({
        type: "go-left", activeNode: cur, visitedNodes: [...path], foundNode: null,
        pathNodes: [...path],
        highlightEdge: n.parent ? { from: n.parent, to: cur } : null,
        traversalOrder: [],
        message: `${target} < ${n.value} → LEFT`,
        speechMessage: `${target} is less than ${n.value}. Going left.`,
        line: 12, compareResult: "left",
      });
      cur = n.left;
    } else {
      steps.push({
        type: "go-right", activeNode: cur, visitedNodes: [...path], foundNode: null,
        pathNodes: [...path],
        highlightEdge: n.parent ? { from: n.parent, to: cur } : null,
        traversalOrder: [],
        message: `${target} > ${n.value} → RIGHT`,
        speechMessage: `${target} is greater than ${n.value}. Going right.`,
        line: 13, compareResult: "right",
      });
      cur = n.right;
    }
  }

  steps.push({
    type: "not-found", activeNode: null, visitedNodes: [...path], foundNode: null,
    pathNodes: [...path], highlightEdge: null, traversalOrder: [],
    message: `${target} not found.`,
    speechMessage: `${target} not found.`,
    line: 10,
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
  title: string;
  pos: { x: number; y: number };
  onDrag: (e: React.MouseEvent) => void;
  width: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      position: "absolute", left: pos.x, top: pos.y, minWidth: width,
      background: "rgba(22,27,34,0.95)", border: "1px solid #21262d",
      borderRadius: 10, overflow: "auto", backdropFilter: "blur(8px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)", userSelect: "none", zIndex: 10,
      resize: "both"
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
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  title?: string;
  xStyle?: React.CSSProperties;
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

// ─── Main Component Props ───────────────────────────────────────────────────────
interface TreesLessonLabProps {
  lessonId: string;
  title: string;
  definition: string;
  timeComplexity: string;
  spaceComplexity: string;
  keyPoints: string[];
}

export default function TreesLessonLab({
  lessonId,
  title,
  definition,
  timeComplexity,
  spaceComplexity,
  keyPoints,
}: TreesLessonLabProps) {
  const [treeData, setTreeData]         = useState<TreeData>(() => buildBST(DEFAULT_VALUES));
  const [mode, setMode]                 = useState<"inorder" | "search">("inorder");
  const [searchTarget, setSearchTarget] = useState(12);
  const [searchInput, setSearchInput]   = useState("12");
  const [insertVal, setInsertVal]       = useState("");

  const [stepIdx, setStepIdx]     = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed]         = useState(900);

  const [speechOn, setSpeechOn]       = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [inputError, setInputError]   = useState("");

  const [treeInfoPos,  setTreeInfoPos]  = useState({ x: 16,  y: 16  });
  const [traversalPos, setTraversalPos] = useState({ x: 16,  y: 255 });
  const [codePos,      setCodePos]      = useState({ x: 570, y: 16  });

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
  const steps = useMemo(() => {
    if (mode === "inorder") return generateInorderSteps(treeData.nodes, treeData.rootId);
    return generateSearchSteps(treeData.nodes, treeData.rootId, searchTarget);
  }, [treeData, mode, searchTarget]);

  const step = steps[Math.min(stepIdx, steps.length - 1)] ?? steps[0];
  const CODE = mode === "inorder" ? INORDER_CODE : SEARCH_CODE;

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
  const autoLayout = useMemo(
    () => layoutTree(treeData.nodes, treeData.rootId, canvasW),
    [treeData, canvasW]
  );

  const nodePositions = useMemo(() => {
    const m: Record<string, { x: number; y: number }> = {};
    for (const id of Object.keys(treeData.nodes)) {
      m[id] = draggedPos[id] ?? autoLayout[id] ?? { x: canvasW / 2, y: 60 };
    }
    return m;
  }, [autoLayout, draggedPos, treeData.nodes, canvasW]);

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

  // panel drag (window)
  useEffect(() => {
    const mv = (e: MouseEvent) => {
      if (!panelDrag.current) return;
      const nx = panelDrag.current.sx + e.clientX - panelDrag.current.ox;
      const ny = panelDrag.current.sy + e.clientY - panelDrag.current.oy;
      if      (panelDrag.current.panel === "info") setTreeInfoPos({ x: nx, y: ny });
      else if (panelDrag.current.panel === "trav") setTraversalPos({ x: nx, y: ny });
      else                                          setCodePos({ x: nx, y: ny });
    };
    const up = () => { panelDrag.current = null; };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, []);

  const startPanelDrag = (panel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const p = panel === "info" ? treeInfoPos : panel === "trav" ? traversalPos : codePos;
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
    const dragId = nodeDrag.current.id;
    const dragOx = nodeDrag.current.ox;
    const dragOy = nodeDrag.current.oy;
    const rect = svgRef.current.getBoundingClientRect();
    const nx = e.clientX - rect.left - dragOx;
    const ny = e.clientY - rect.top - dragOy;
    setDraggedPos(prev => ({
      ...prev,
      [dragId]: { x: nx, y: ny },
    }));
  }, []);

  const onSvgMouseUp = useCallback(() => { nodeDrag.current = null; }, []);

  // insert
  const handleInsert = useCallback(() => {
    const v = parseInt(insertVal, 10);
    if (isNaN(v)) return;
    setTreeData(prev => insertBST(prev, v));
    setDraggedPos({});
    setInsertVal("");
    reset();
  }, [insertVal, reset]);

  // custom input
  const applyInput = useCallback(() => {
    const raw = customInput.trim();
    if (!raw) { setInputError("Enter comma-separated numbers"); return; }
    const parts = raw.split(",").map(s => parseInt(s.trim(), 10));
    if (parts.some(isNaN)) { setInputError("Invalid — use: 15,9,20,6,12"); return; }
    setInputError("");
    setTreeData(buildBST(parts));
    setDraggedPos({});
    reset();
  }, [customInput, reset]);

  // node style
  const nodeStyle = (id: string) => {
    if (step.foundNode === id)           return { fill: "#1a3a22", stroke: "#3fb950", sw: 2.5 };
    if (step.activeNode === id)          return { fill: "#2a1f0e", stroke: "#f0883e", sw: 2.5 };
    if (step.visitedNodes.includes(id)) return { fill: "#162032", stroke: "#58a6ff", sw: 1.5 };
    if (step.pathNodes.includes(id))    return { fill: "#1e1a2e", stroke: "#7c3aed", sw: 1.5 };
    return { fill: "#161b22", stroke: "#30363d", sw: 1.5 };
  };

  const textColor = (id: string) => {
    if (step.foundNode === id)           return "#3fb950";
    if (step.activeNode === id)          return "#f0883e";
    if (step.visitedNodes.includes(id)) return "#58a6ff";
    return "#c9d1d9";
  };

  const progress = steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0;

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:"#0d1117", color:"#c9d1d9", fontFamily:"'JetBrains Mono','Fira Code',monospace" }}>
      <TheorySection 
        title={title}
        definition={definition}
        timeComplexity={timeComplexity}
        spaceComplexity={spaceComplexity}
        keyPoints={keyPoints}
      />
      
      {/* TOOLBAR */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", background:"#161b22", borderBottom:"1px solid #21262d", flexShrink:0, flexWrap:"wrap" }}>
        <ToolBtn active={mode==="inorder"} onClick={()=>{ setMode("inorder"); reset(); }}>Traversal</ToolBtn>
        <ToolBtn active={mode==="search"}  onClick={()=>{ setMode("search");  reset(); }}>Search</ToolBtn>
        <Divider/>
        <input value={insertVal} onChange={e=>setInsertVal(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleInsert()}
          placeholder="Value" type="number" style={inputSty(70)} />
        <ToolBtn onClick={handleInsert}>Insert Node</ToolBtn>
        {mode==="search"&&<>
          <Divider/>
          <span style={{fontSize:10,color:"#484f58"}}>Target:</span>
          <input value={searchInput} onChange={e=>setSearchInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"){ const v=parseInt(searchInput,10); if(!isNaN(v)){setSearchTarget(v);reset();} } }}
            placeholder="12" type="number" style={inputSty(60)} />
          <ToolBtn onClick={()=>{ const v=parseInt(searchInput,10); if(!isNaN(v)){setSearchTarget(v);reset();} }}>Search</ToolBtn>
        </>}
        <Divider/>
        <ToolBtn onClick={()=>{ setTreeData(buildBST(DEFAULT_VALUES)); setDraggedPos({}); reset(); }}>Reset</ToolBtn>
        <div style={{marginLeft:"auto",fontSize:10,color:"#484f58"}}>
          Nodes: <span style={{color:"#58a6ff"}}>{Object.keys(treeData.nodes).length}</span>
          &nbsp;&nbsp;Mode: <span style={{color:"#f0883e"}}>{mode==="inorder"?"Traversal":`Search ${searchTarget}`}</span>
        </div>
      </div>

      {/* BODY */}
      <div style={{display:"flex", minHeight:"calc(100vh - 124px)", overflow:"hidden"}}>

        {/* SIDEBAR */}
        <div style={{width:224,background:"#161b22",borderRight:"1px solid #21262d",display:"flex",flexDirection:"column",padding:14,gap:14,flexShrink:0,overflowY:"auto"}}>
          <div style={{fontSize:10,color:"#484f58",lineHeight:1.9}}>
            <div>■ <span style={{color:"#58a6ff"}}>Insert Node</span> from toolbar</div>
            <div>■ Drag nodes to <span style={{color:"#58a6ff"}}>Reposition</span></div>
            <div>■ Drag panel headers to <span style={{color:"#58a6ff"}}>Rearrange</span></div>
            <div>■ 🔊 toggles <span style={{color:"#58a6ff"}}>Narration</span></div>
          </div>

          {/* custom input */}
          <div style={{borderTop:"1px solid #21262d",paddingTop:12}}>
            <SLabel>Custom Input</SLabel>
            <textarea value={customInput} onChange={e=>setCustomInput(e.target.value)}
              placeholder="e.g. 15,9,20,6,12,17,25" rows={3}
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
              <pattern id="bst-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bst-grid)"/>
          </svg>

          {/* tree SVG */}
          <svg ref={svgRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}
            onMouseDown={onSvgMouseDown} onMouseMove={onSvgMouseMove} onMouseUp={onSvgMouseUp}>
            <defs>
              {([["arr-def","#30363d"],["arr-act","#f0883e"],["arr-vis","#58a6ff"],["arr-fnd","#3fb950"],["arr-pth","#7c3aed"]] as [string,string][]).map(([id,fill])=>(
                <marker key={id} id={id} markerWidth="7" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0,7 3,0 6" fill={fill}/>
                </marker>
              ))}
            </defs>

            {/* edges */}
            {Object.values(treeData.nodes).map(n=>{
              const fp=nodePositions[n.id]; if(!fp) return null;
              return (["left","right"] as const).map(side=>{
                const cid=n[side]; if(!cid) return null;
                const tp=nodePositions[cid]; if(!tp) return null;
                const dx=tp.x-fp.x,dy=tp.y-fp.y,len=Math.sqrt(dx*dx+dy*dy); if(len===0) return null;
                const nx2=dx/len,ny2=dy/len;
                const sx=fp.x+nx2*NODE_R,sy=fp.y+ny2*NODE_R;
                const ex=tp.x-nx2*(NODE_R+5),ey=tp.y-ny2*(NODE_R+5);
                const isHl    =step.highlightEdge?.from===n.id&&step.highlightEdge?.to===cid;
                const isVis   =step.visitedNodes.includes(cid);
                const isFnd   =step.foundNode===cid;
                const isPth   =step.pathNodes.includes(cid);
                let stroke="#21262d",marker="url(#arr-def)",sw=1.5;
                if(isFnd)      {stroke="#3fb950";marker="url(#arr-fnd)";sw=2.5;}
                else if(isHl)  {stroke="#f0883e";marker="url(#arr-act)";sw=2.5;}
                else if(isVis) {stroke="#58a6ff";marker="url(#arr-vis)";}
                else if(isPth) {stroke="#7c3aed";marker="url(#arr-pth)";}
                return <line key={`${n.id}-${side}`} x1={sx} y1={sy} x2={ex} y2={ey}
                  stroke={stroke} strokeWidth={sw} markerEnd={marker}
                  style={{transition:"stroke .25s,stroke-width .25s"}}/>;
              });
            })}

            {/* nodes */}
            {Object.values(treeData.nodes).map(n=>{
              const pos=nodePositions[n.id]; if(!pos) return null;
              const s=nodeStyle(n.id),tc=textColor(n.id);
              return (
                <g key={n.id} data-nodeid={n.id} style={{cursor:"grab"}}>
                  {step.foundNode===n.id&&<circle cx={pos.x} cy={pos.y} r={NODE_R+9} fill="none" stroke="#3fb950" strokeWidth={1.5} opacity={0.25} strokeDasharray="5 3"/>}
                  <circle cx={pos.x} cy={pos.y} r={NODE_R} fill={s.fill} stroke={s.stroke} strokeWidth={s.sw} style={{transition:"fill .25s,stroke .25s"}}/>
                  <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fill={tc}
                    style={{fontSize:14,fontWeight:700,fontFamily:"inherit",userSelect:"none",transition:"fill .25s"}}>
                    {n.value}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* PANEL — Tree Info */}
          <FloatPanel title="TREE INFO" pos={treeInfoPos} onDrag={e=>startPanelDrag("info",e)} width={170}>
            <InfoRow label="Nodes" val={Object.keys(treeData.nodes).length}/>
            <InfoRow label="Root"  val={treeData.rootId?treeData.nodes[treeData.rootId]?.value??"—":"—"}/>
            <InfoRow label="Mode"  val={mode==="inorder"?"Traversal":"Search"} color="#f0883e"/>
            {mode==="search"&&<InfoRow label="Target" val={searchTarget} color="#f0883e"/>}
          </FloatPanel>

          {/* PANEL — Traversal/Path */}
          <FloatPanel title={mode==="inorder"?"TRAVERSAL ORDER":"SEARCH PATH"} pos={traversalPos} onDrag={e=>startPanelDrag("trav",e)} width={175}>
            {mode==="inorder"?(
              <>
                <SLabel>Result so far</SLabel>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:6}}>
                  {step.traversalOrder.length===0
                    ?<span style={{fontSize:10,color:"#484f58",fontStyle:"italic"}}>empty</span>
                    :step.traversalOrder.map((v,i)=>(
                      <span key={i} style={{fontSize:11,fontWeight:700,color:"#3fb950",background:"rgba(63,185,80,0.08)",border:"1px solid rgba(63,185,80,0.2)",borderRadius:4,padding:"2px 7px"}}>{v}</span>
                    ))}
                </div>
              </>
            ):(
              <>
                <SLabel>Path taken</SLabel>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:6}}>
                  {step.pathNodes.length===0
                    ?<span style={{fontSize:10,color:"#484f58",fontStyle:"italic"}}>—</span>
                    :step.pathNodes.map((id,i)=>{
                      const isFnd=step.foundNode===id;
                      return <span key={i} style={{fontSize:11,fontWeight:700,color:isFnd?"#3fb950":"#58a6ff",background:isFnd?"rgba(63,185,80,0.08)":"rgba(88,166,255,0.08)",border:`1px solid ${isFnd?"rgba(63,185,80,0.2)":"rgba(88,166,255,0.15)"}`,borderRadius:4,padding:"2px 7px"}}>
                        {treeData.nodes[id]?.value??"?"}
                      </span>;
                    })}
                </div>
              </>
            )}
          </FloatPanel>

          {/* PANEL — Logic Tracker */}
          <FloatPanel title="C++ Code Tracker" pos={codePos} onDrag={e=>startPanelDrag("code",e)} width={292}>
            {CODE.map((line,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"4px 8px",borderRadius:4,background:step.line===i?"rgba(88,166,255,0.1)":"transparent",borderLeft:step.line===i?"2px solid #58a6ff":"2px solid transparent",transition:"background .2s"}}>
                <span style={{fontSize:10,color:"#484f58",minWidth:16,userSelect:"none"}}>{i+1}</span>
                <span style={{fontSize:11,color:step.line===i?"#c9d1d9":"#484f58",fontFamily:"inherit",whiteSpace:"nowrap"}}>{line}</span>
              </div>
            ))}
          </FloatPanel>
        </div>
      </div>
    </div>
  );
}
