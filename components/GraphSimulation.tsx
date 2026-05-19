import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";

// Types for graph structure
interface GraphNode {
  id: string;
  x: number;
  y: number;
}
interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
}
interface GraphData {
  source: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  // Additional flags (e.g., directed) can be added per algorithm
  [key: string]: any;
}

// Generic step type – algorithm implementations will define concrete shape
interface SimulationStep {
  type: string;
  // Additional fields are optional and algorithm‑specific
  [key: string]: any;
}

/**
 * Props expected by the reusable simulation component.
 * - `title` / `description` – UI header information.
 * - `initialGraph` – Starting graph state.
 * - `generateSteps` – Function that produces an array of SimulationStep objects.
 * - `describeStep` – Human‑readable description for a given step.
 */
interface GraphSimulationProps {
  title: string;
  description: string;
  initialGraph: GraphData;
  generateSteps: (nodes: GraphNode[], edges: GraphEdge[], source: string, extra?: any) => SimulationStep[];
  describeStep: (step: SimulationStep) => string;
  // Optional extra data passed to generateSteps (e.g., directed flag)
  extra?: any;
}

export default function GraphSimulation({
  title,
  description,
  initialGraph,
  generateSteps,
  describeStep,
  extra,
}: GraphSimulationProps) {
  // Theme handling (light / dark)
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  // Graph state management
  const [graph, setGraph] = useState<GraphData>(() => ({
    ...initialGraph,
    // Ensure we always have a source node
    source: initialGraph.source || (initialGraph.nodes[0]?.id ?? "A"),
  }));
  const [selected, setSelected] = useState<null | { type: "node" | "edge"; id: string }>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState(0);

  // Playback controls
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);
  const timerRef = useRef<number | null>(null);

  // Compute steps lazily whenever the underlying graph changes
  const steps = useMemo(() => {
    return generateSteps(graph.nodes, graph.edges, graph.source, extra);
  }, [graph, extra, generateSteps]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] ?? steps[0];

  // Reset simulation when graph changes
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [graph]);

  // Autoplay interval
  useEffect(() => {
    if (!playing) return undefined;
    timerRef.current = window.setInterval(() => {
      setStepIndex((cur) => {
        if (cur >= steps.length - 1) {
          setPlaying(false);
          return cur;
        }
        return cur + 1;
      });
    }, speed);
    return () => window.clearInterval(timerRef.current as number);
  }, [playing, speed, steps.length]);

  // Utility helpers – node/edge ID generators
  const nextNodeId = useCallback((nodes: GraphNode[]) => {
    for (let code = 65; code <= 90; code++) {
      const id = String.fromCharCode(code);
      if (!nodes.some((n) => n.id === id)) return id;
    }
    return `N${nodes.length + 1}`;
  }, []);

  const nextEdgeId = useCallback((edges: GraphEdge[]) => {
    let index = edges.length + 1;
    while (edges.some((e) => e.id === `e${index}`)) index += 1;
    return `e${index}`;
  }, []);

  // Graph manipulation callbacks (add/remove nodes/edges, etc.) – skeleton implementations
  const addNode = useCallback((x = 330, y = 215) => {
    const id = (nodeName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3)) || nextNodeId(graph.nodes);
    if (graph.nodes.some((n) => n.id === id)) return;
    setGraph((g) => ({
      ...g,
      nodes: [...g.nodes, { id, x, y }],
      source: g.source || id,
    }));
    setSelected({ type: "node", id });
    setNodeName("");
  }, [graph.nodes, nodeName, nextNodeId]);

  const addEdge = useCallback((from = edgeFrom, to = edgeTo) => {
    if (!from || !to) return;
    const edge = { id: nextEdgeId(graph.edges), from, to, weight: edgeWeight };
    setGraph((g) => ({ ...g, edges: [...g.edges, edge] }));
    setSelected({ type: "edge", id: edge.id });
    setEdgeSource(null);
  }, [edgeFrom, edgeTo, edgeWeight, graph.edges, nextEdgeId]);

  const removeSelected = useCallback(() => {
    if (!selected) return;
    setGraph((g) => {
      if (selected.type === "edge") {
        return { ...g, edges: g.edges.filter((e) => e.id !== selected.id) };
      }
      if (g.nodes.length <= 1) return g;
      const nodes = g.nodes.filter((n) => n.id !== selected.id);
      const edges = g.edges.filter((e) => e.from !== selected.id && e.to !== selected.id);
      return { ...g, nodes, edges, source: g.source === selected.id ? nodes[0].id : g.source };
    });
    setSelected(null);
  }, [selected]);

  // SVG helpers – similar to existing visualizers (point conversion, dragging, etc.)
  const svgRef = useRef<SVGSVGElement | null>(null);

  const svgPoint = useCallback((event: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM()?.inverse() ?? new DOMMatrix());
  }, []);

  const [dragging, setDragging] = useState<string | null>(null);

  const handleMove = useCallback((event: React.PointerEvent) => {
    const point = svgPoint(event);
    if (dragging) {
      setGraph((g) => ({
        ...g,
        nodes: g.nodes.map((n) =>
          n.id === dragging ? { ...n, x: Math.max(40, Math.min(640, point.x)), y: Math.max(45, Math.min(390, point.y)) } : n
        ),
      }));
    }
  }, [dragging, svgPoint]);

  const handleCanvasClick = useCallback((event: React.PointerEvent) => {
    if (event.target !== svgRef.current) return;
    const pt = svgPoint(event);
    addNode(pt.x, pt.y);
    setSelected(null);
    setEdgeSource(null);
  }, [svgPoint, addNode]);

  const handleNodePointerDown = useCallback((event: React.PointerEvent, node: GraphNode) => {
    event.stopPropagation();
    // Simple click‑to‑select; shift‑click could be used for edge creation in concrete implementations
    setSelected({ type: "node", id: node.id });
    setEdgeSource(node.id);
    setDragging(node.id);
  }, []);

  // Minimal UI – mirrors the structure of existing algorithm pages but with placeholders
  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Graph Algorithms</span>
          <h1>{title}</h1>
          <p className="description">{description}</p>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="editor">
          {/* Controls – left as UI placeholders for the concrete pages */}
          <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID" />
          <button onClick={() => addNode()}>Add Node</button>
          <select value={graph.source} onChange={(e) => setGraph((g) => ({ ...g, source: e.target.value }))}>
            {graph.nodes.map((n) => (
              <option key={n.id}>{n.id}</option>
            ))}
          </select>
          <select value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}>
            {graph.nodes.map((n) => (
              <option key={n.id}>{n.id}</option>
            ))}
          </select>
          <select value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}>
            {graph.nodes.map((n) => (
              <option key={n.id}>{n.id}</option>
            ))}
          </select>
          <input type="number" value={edgeWeight} onChange={(e) => setEdgeWeight(Number(e.target.value))} />
          <button onClick={() => addEdge()}>Join Nodes</button>
          <button onClick={removeSelected}>Remove Selected</button>
        </div>

        <div className="workspace">
          <aside>
            <h2>Current Step</h2>
            <p className="step-desc">{describeStep(step)}</p>
            <div className="controls">
              <button onClick={() => setStepIndex(0)}>|&lt;</button>
              <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>&lt;</button>
              <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
              <button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>&gt;</button>
              <button onClick={() => setStepIndex(steps.length - 1)}>&gt;|</button>
            </div>
            <label>
              Speed
              <input type="range" min={150} max={1400} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
            </label>
            <label>
              Timeline
              <input
                type="range"
                min={0}
                max={Math.max(0, steps.length - 1)}
                value={stepIndex}
                onChange={(e) => {
                  setPlaying(false);
                  setStepIndex(Number(e.target.value));
                }}
              />
            </label>
            <p className="counter">
              {stepIndex + 1} / {steps.length}
            </p>
          </aside>

          <svg
            ref={svgRef}
            viewBox="0 0 680 430"
            onPointerDown={handleCanvasClick}
            onPointerMove={handleMove}
            onPointerUp={() => setDragging(null)}
          >
            {/* Edges */}
            {graph.edges.map((edge) => {
              const from = graph.nodes.find((n) => n.id === edge.from);
              const to = graph.nodes.find((n) => n.id === edge.to);
              if (!from || !to) return null;
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const len = Math.hypot(dx, dy) || 1;
              const endX = to.x - (dx / len) * 30;
              const endY = to.y - (dy / len) * 30;

              const path = `M ${from.x} ${from.y} L ${endX} ${endY}`;
              return (
                <g key={edge.id}>
                  <path className="edge" d={path} markerEnd="url(#arrow)" />
                </g>
              );
            })}

            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="currentColor" />
              </marker>
            </defs>

            {/* Nodes */}
            {graph.nodes.map((node) => (
              <g
                key={node.id}
                className="node"
                onPointerDown={(e) => handleNodePointerDown(e, node)}
                onPointerUp={() => setDragging(null)}
              >
                <circle cx={node.x} cy={node.y} r={27} />
                <text x={node.x} y={node.y + 5}>
                  {node.id}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* Inline CSS – extracted from previous visualizers for quick styling */}
      <style jsx>{`
        .page {
          --bg: #0a0d14;
          --panel: #111827;
          --border: #2b3447;
          --text: #e5e7eb;
          --muted: #98a2b3;
          --blue: #4f7ef8;
          --green: #35c486;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: Arial, sans-serif;
        }
        .page[data-theme="light"] {
          --bg: #f7f9fc;
          --panel: #ffffff;
          --border: #d7deea;
          --text: #172033;
          --muted: #526174;
          --blue: #285bd6;
          --green: #087f5b;
        }
        .hero {
          padding: 120px 24px 80px;
          background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), var(--bg);
          border-bottom: 1px solid var(--border);
        }
        .hero h1 {
          margin: 16px 0;
          font-size: clamp(48px, 9vw, 92px);
          font-weight: 800;
        }
        .description { font-size: 19px; margin: 24px 0; line-height: 1.6; color: var(--muted); }
        .editor, .controls, .toolbar { display: flex; flex-wrap: wrap; gap: 8px; }
        button, input, select { border: 1px solid var(--border); border-radius: 8px; background: var(--panel); color: var(--text); padding: 4px 12px; }
        .workspace { display: grid; grid-template-columns: 360px 1fr; gap: 40px; padding: 40px; }
        aside { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 32px; }
        svg { width: 100%; min-height: 650px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; }
        .node circle { fill: var(--panel); stroke: var(--muted); stroke-width: 2; }
        .edge { fill: none; stroke: var(--muted); stroke-width: 2; }
        .edge:hover { stroke: var(--blue); stroke-width: 3; }
      `}</style>
    </main>
  );
}
