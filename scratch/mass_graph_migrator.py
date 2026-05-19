
import os
import re

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\graphs'

ALGO_INFO = {
    "bfs": {
        "title": "Breadth-First Search",
        "eyebrow": "Graph Traversal • Level Order",
        "description": "BFS explores a graph level by level, starting from a source node and visiting all neighbors at the current depth before moving to the next level.",
        "time": "O(V + E)",
        "space": "O(V)",
        "guide": [
            {"title": "Level Order", "desc": "Visits all nodes at distance k before moving to k+1."},
            {"title": "Queue Strategy", "desc": "Uses a FIFO (First-In-First-Out) queue to track the exploration frontier."},
            {"title": "Shortest Path", "desc": "Guaranteed to find the shortest path in an unweighted graph."},
            {"title": "Connectivity", "desc": "Used to find connected components in an undirected graph."}
        ],
        "code": [
            "void bfs(int source) {",
            "    queue<int> q;",
            "    q.push(source);",
            "    visited[source] = true;",
            "    while (!q.empty()) {",
            "        int u = q.front(); q.pop();",
            "        for (int v : adj[u]) {",
            "            if (!visited[v]) {",
            "                visited[v] = true;",
            "                dist[v] = dist[u] + 1;",
            "                q.push(v);",
            "            }",
            "        }",
            "    }",
            "}"
        ]
    },
    "dfs": {
        "title": "Depth-First Search",
        "eyebrow": "Graph Traversal • Deep Exploration",
        "description": "DFS explores as far as possible along each branch before backtracking. It's the foundation for many advanced algorithms like cycle detection and SCC.",
        "time": "O(V + E)",
        "space": "O(V) recursion stack",
        "guide": [
            {"title": "Backtracking", "desc": "Deep dives into one path and backtracks when no unvisited neighbors remain."},
            {"title": "Stack Strategy", "desc": "Uses a LIFO (Last-In-First-Out) stack, typically via recursion."},
            {"title": "Topological Sort", "desc": "Essential for determining execution order in a DAG."},
            {"title": "Cycle Detection", "desc": "Uses back-edges in the DFS tree to identify cycles."}
        ],
        "code": [
            "void dfs(int u) {",
            "    visited[u] = true;",
            "    discovery[u] = ++time;",
            "    for (int v : adj[u]) {",
            "        if (!visited[v]) {",
            "            parent[v] = u;",
            "            dfs(v);",
            "        }",
            "    }",
            "    finish[u] = ++time;",
            "}"
        ]
    },
    "dijkstra": {
        "title": "Dijkstra's Algorithm",
        "eyebrow": "Single Source Shortest Path",
        "description": "Dijkstra's algorithm finds the shortest paths from a source node to all other nodes in a graph with non-negative edge weights.",
        "time": "O(E log V)",
        "space": "O(V)",
        "guide": [
            {"title": "Greedy Choice", "desc": "Always picks the unvisited node with the smallest known distance."},
            {"title": "Priority Queue", "desc": "Uses a min-priority queue to efficiently select the next node."},
            {"title": "Edge Relaxation", "desc": "Updates a neighbor's distance if a shorter path is found via the current node."},
            {"title": "Non-Negative Only", "desc": "Does not work with negative edge weights (use Bellman-Ford instead)."}
        ],
        "code": [
            "void dijkstra(int source) {",
            "    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;",
            "    pq.push({0, source});",
            "    dist[source] = 0;",
            "    while (!pq.empty()) {",
            "        auto [d, u] = pq.top(); pq.pop();",
            "        if (d > dist[u]) continue;",
            "        for (auto& edge : adj[u]) {",
            "            int v = edge.to, w = edge.weight;",
            "            if (dist[u] + w < dist[v]) {",
            "                dist[v] = dist[u] + w;",
            "                pq.push({dist[v], v});",
            "            }",
            "        }",
            "    }",
            "}"
        ]
    },
    "basics": {
        "title": "Graph Basics",
        "eyebrow": "Graph Core Operations",
        "description": "Fundamentals of graph theory and representation including nodes, edges, adjacency list, and basic connectivity.",
        "time": "O(V + E)",
        "space": "O(V + E)",
        "guide": [
            {"title": "Representation", "desc": "Graphs can be represented using adjacency lists or adjacency matrices."},
            {"title": "Vertices & Edges", "desc": "The building blocks of any graph. E &lt;= V^2 in dense graphs."},
            {"title": "Degree", "desc": "Number of edges connected to a vertex (in-degree and out-degree for directed)."},
            {"title": "Connectivity", "desc": "Determining if there is a path between two given vertices."}
        ],
        "code": [
            "class Graph {",
            "    int V;",
            "    vector<vector<int>> adj;",
            "public:",
            "    Graph(int V) {",
            "        this->V = V;",
            "        adj.resize(V);",
            "    }",
            "    void addEdge(int u, int v) {",
            "        adj[u].push_back(v);",
            "        adj[v].push_back(u); // undirected",
            "    }",
            "};"
        ]
    },
}

TEMPLATE = """\"use client\";

import {{ useCallback, useEffect, useMemo, useRef, useState }} from "react";
import {{ useTheme }} from "next-themes";
import {{ Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Activity, Zap, MousePointer2, List }} from "lucide-react";
import {{ CodeTracker }} from "../../../components/CodeTracker";

interface GraphNode {{ id: string; x: number; y: number; }}
interface GraphEdge {{ id: string; from: string; to: string; weight: number; }}
interface GraphData {{ source: string; nodes: GraphNode[]; edges: GraphEdge[]; }}

interface Step {{
  type: string;
  dist: Record<string, number>;
  visited?: string[];
  queue?: string[];
  stack?: string[];
  edge?: string;
  u?: string;
  v?: string;
  weight?: number;
  message: string;
  line?: number;
}}

const initialGraph: GraphData = {{
  source: "A",
  nodes: [
    {{ id: "A", x: 100, y: 200 }},
    {{ id: "B", x: 300, y: 100 }},
    {{ id: "C", x: 500, y: 150 }},
    {{ id: "D", x: 250, y: 350 }},
    {{ id: "E", x: 550, y: 320 }},
  ],
  edges: [
    {{ id: "e1", from: "A", to: "B", weight: 4 }},
    {{ id: "e2", from: "A", to: "D", weight: 2 }},
    {{ id: "e3", from: "B", to: "C", weight: 5 }},
    {{ id: "e4", from: "B", to: "D", weight: 8 }},
    {{ id: "e5", from: "D", to: "E", weight: 3 }},
    {{ id: "e6", from: "C", to: "E", weight: 1 }},
  ],
}};

function cloneGraph(graph: GraphData): GraphData {{
  return {{
    source: graph.source,
    nodes: graph.nodes.map((node) => ({{ ...node }})),
    edges: graph.edges.map((edge) => ({{ ...edge }})),
  }};
}}

function getSteps(nodes: GraphNode[], edges: GraphEdge[], source: string, type: string): Step[] {{
  const steps: Step[] = [];
  const dist: Record<string, number> = {{}};
  nodes.forEach(n => dist[n.id] = n.id === source ? 0 : Infinity);

  if (type === "bfs") {{
    const queue = [source];
    const visited = new Set([source]);
    steps.push({{ type: "init", dist: {{...dist}}, queue: [...queue], visited: Array.from(visited), message: "Initialize queue with source." }});
    while (queue.length > 0) {{
        const u = queue.shift()!;
        steps.push({{ type: "pop", u, dist: {{...dist}}, queue: [...queue], visited: Array.from(visited), message: `Exploring node ${{u}}` }});
        for (const edge of edges.filter(e => e.from === u)) {{
            const v = edge.to;
            steps.push({{ type: "check", u, v, edge: edge.id, dist: {{...dist}}, queue: [...queue], visited: Array.from(visited), message: `Checking neighbor ${{v}}` }});
            if (!visited.has(v)) {{
                visited.add(v); dist[v] = dist[u] + 1; queue.push(v);
                steps.push({{ type: "visit", u, v, edge: edge.id, dist: {{...dist}}, queue: [...queue], visited: Array.from(visited), message: `Visited ${{v}}, added to queue.` }});
            }}
        }}
    }}
  }} else {{
      steps.push({{ type: "init", dist: {{...dist}}, message: "Algorithm starting..." }});
      steps.push({{ type: "done", dist: {{...dist}}, message: "Algorithm finished." }});
  }}
  return steps;
}}

export default function {comp_name}Simulation() {{
  const svgRef = useRef<SVGSVGElement>(null);
  const {{ resolvedTheme }} = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [graph, setGraph] = useState(() => cloneGraph(initialGraph));
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);
  const [dragging, setDragging] = useState<string | null>(null);

  const [distPos, setDistPos] = useState({{ x: 20, y: 20 }});
  const [infoPos, setInfoPos] = useState({{ x: 440, y: 20 }});
  const [codePos, setCodePos] = useState({{ x: 20, y: 220 }});
  const [activeDragPanel, setActiveDragPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({{ x: 0, y: 0 }});

  const steps = useMemo(() => getSteps(graph.nodes, graph.edges, graph.source, "{algo_key}"), [graph]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {{
    let timer: number;
    if (playing && stepIndex < steps.length - 1) {{
      timer = window.setInterval(() => {{ setStepIndex((s) => s + 1); }}, speed);
    }} else if (stepIndex >= steps.length - 1) {{ setPlaying(false); }}
    return () => clearInterval(timer);
  }}, [playing, stepIndex, steps.length, speed]);

  const svgPoint = (e: React.PointerEvent) => {{
    const svg = svgRef.current; if (!svg) return {{ x: 0, y: 0 }};
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }};

  const handleMove = (e: React.PointerEvent) => {{
    if (!dragging && !activeDragPanel) return;
    const pt = svgPoint(e);
    if (dragging) {{
      setGraph(g => ({{ ...g, nodes: g.nodes.map(n => n.id === dragging ? {{ ...n, x: Math.max(40, Math.min(640, pt.x)), y: Math.max(45, Math.min(390, pt.y)) }} : n) }}));
    }} else if (activeDragPanel === "dist") {{ setDistPos({{ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y }}); }}
    else if (activeDragPanel === "info") {{ setInfoPos({{ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y }}); }}
    else if (activeDragPanel === "code") {{ setCodePos({{ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y }}); }}
  }};

  const startPanelDrag = (e: React.PointerEvent, id: string, pos: {{ x: number, y: number }}) => {{
    e.stopPropagation();
    const pt = svgPoint(e);
    setActiveDragPanel(id);
    setDragOffset({{ x: pt.x - pos.x, y: pt.y - pos.y }});
  }};

  return (
    <main style={{{{ background: "#0a0d14", color: "#e5e7eb", minHeight: "100vh", fontFamily: "sans-serif" }}}}>
      <section style={{{{ padding: "100px 24px", borderBottom: "1px solid #2b3447" }}}}>
        <div style={{{{ maxWidth: "1200px", margin: "0 auto" }}}}>
          <span style={{{{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#4f7ef8", letterSpacing: "2px" }}}}>{eyebrow}</span>
          <h1 style={{{{ fontSize: "64px", fontWeight: 800, margin: "20px 0" }}}}>{title}</h1>
          <p style={{{{ fontSize: "18px", color: "#98a2b3", maxWidth: "800px", lineHeight: "1.6" }}}}>{description}</p>
          <div style={{{{ display: "flex", gap: "16px" }}}}>
            <div style={{{{ background: "#111827", border: "1px solid #2b3447", padding: "12px 20px", borderRadius: "12px" }}}}>
               <div style={{{{ fontSize: "11px", color: "#98a2b3", textTransform: "uppercase" }}}}>Time</div>
               <div style={{{{ fontSize: "20px", fontWeight: 700, color: "#4f7ef8" }}}}>{time_complexity}</div>
            </div>
            <div style={{{{ background: "#111827", border: "1px solid #2b3447", padding: "12px 20px", borderRadius: "12px" }}}}>
               <div style={{{{ fontSize: "11px", color: "#98a2b3", textTransform: "uppercase" }}}}>Space</div>
               <div style={{{{ fontSize: "20px", fontWeight: 700, color: "#4f7ef8" }}}}>{space_complexity}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{{{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}}}>
        <div style={{{{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "32px" }}}}>
          {guide_cards}
        </div>
      </section>

      <section id="simulator" style={{{{ padding: "80px 0", borderTop: "1px solid #2b3447" }}}}>
        <div style={{{{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px", display: "grid", gridTemplateColumns: "300px 1fr", gap: "40px" }}}}>
          <aside>
            <div style={{{{ background: "#111827", border: "1px solid #2b3447", padding: "24px", borderRadius: "20px" }}}}>
              <h2 style={{{{ fontSize: "16px", marginBottom: "16px" }}}}>Current Step</h2>
              <p style={{{{ fontSize: "14px", lineHeight: "1.6", color: "#e5e7eb", minHeight: "60px" }}}}>{{step.message}}</p>
              <div style={{{{ display: "flex", gap: "12px", marginTop: "24px" }}}}>
                <button onClick={{() => setStepIndex(0)}} style={{{{ background: "#172033", border: "1px solid #2b3447", color: "#e5e7eb", padding: "8px", borderRadius: "8px", cursor: "pointer" }}}}><RotateCcw size={{16}} /></button>
                <button onClick={{() => setPlaying(!playing)}} style={{{{ background: "#4f7ef8", color: "white", border: "none", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}}}>{{playing ? <Pause size={{20}} /> : <Play size={{20}} />}}</button>
                <button onClick={{() => setStepIndex(i => Math.min(steps.length-1, i+1))}} style={{{{ background: "#172033", border: "1px solid #2b3447", color: "#e5e7eb", padding: "8px", borderRadius: "8px", cursor: "pointer" }}}}><ChevronRight size={{20}} /></button>
              </div>
            </div>
          </aside>
          
          <svg ref={{svgRef}} viewBox="0 0 680 430" style={{{{ background: "#111827", border: "1px solid #2b3447", borderRadius: "16px", width: "100%", height: "500px" }}}} onPointerMove={{handleMove}} onPointerUp={{() => {{ setDragging(null); setActiveDragPanel(null); }}}}>
            {{graph.edges.map((edge) => {{
              const from = graph.nodes.find(n => n.id === edge.from); const to = graph.nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              const isActive = step.edge === edge.id;
              return (
                <line key={{edge.id}} x1={{from.x}} y1={{from.y}} x2={{to.x}} y2={{to.y}} style={{{{ stroke: isActive ? "#4f7ef8" : "#2b3447", strokeWidth: isActive ? 4 : 2, transition: "all 0.3s" }}}} />
              );
            }})}}
            {{graph.nodes.map((node) => (
              <g key={{node.id}} onPointerDown={{() => setDragging(node.id)}} style={{{{ cursor: "grab" }}}}>
                <circle cx={{node.x}} cy={{node.y}} r="25" style={{{{ fill: step.u === node.id || step.v === node.id ? "#4f7ef8" : "#172033", stroke: "#2b3447", strokeWidth: 2, transition: "all 0.3s" }}}} />
                <text x={{node.x}} y={{node.y + 5}} style={{{{ fill: "white", fontSize: "14px", textAnchor: "middle", fontWeight: 800, userSelect: "none" }}}}>{{node.id}}</text>
              </g>
            ))}}

            <foreignObject x={{distPos.x}} y={{distPos.y}} width="100%" height="100%" style={{{{ pointerEvents: "none" }}}}>
              <div style={{{{ pointerEvents: "auto", display: "inline-flex", flexDirection: "column", background: "#172033", border: "1px solid #2b3447", borderRadius: "8px", height: "200px", minWidth: "160px", resize: "both", overflow: "hidden" }}}}>
                <div onPointerDown={{(e) => startPanelDrag(e, "dist", distPos)}} style={{{{ background: "#111827", padding: "8px 12px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", cursor: "grab", flexShrink: 0 }}}}>Distances</div>
                <div style={{{{ padding: "12px", flex: 1, overflowY: "auto" }}}}>
                  {{Object.entries(step.dist).map(([id, d]) => (
                    <div key={{id}} style={{{{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "4px 0", borderBottom: "1px solid #2b3447" }}}}><span>{{id}}</span><b>{{d === Infinity ? "∞" : d}}</b></div>
                  ))}}
                </div>
              </div>
            </foreignObject>

            <foreignObject x={{codePos.x}} y={{codePos.y}} width="100%" height="100%" style={{{{ pointerEvents: "none" }}}}>
              <div style={{{{ pointerEvents: "auto", display: "inline-flex", flexDirection: "column", height: "180px", minWidth: "220px", resize: "both", overflow: "hidden", borderRadius: "8px" }}}}>
                <div onPointerDown={{(e) => startPanelDrag(e, "code", codePos)}} style={{{{ height: "100%", width: "100%", display: "flex", flexDirection: "column", cursor: "grab" }}}}>
                  <CodeTracker code={{{algo_code_lines}}} activeLine={{step.line || 0}} />
                </div>
              </div>
            </foreignObject>
          </svg>
        </div>
      </section>
    </main>
  );
}}
"""

def generate_guide_cards(guide_list):
    cards = ""
    for item in guide_list:
        cards += f"""
          <article style={{{{ background: "#111827", border: "1px solid #2b3447", padding: "32px", borderRadius: "20px" }}}}>
            <h2 style={{{{ fontSize: "20px", marginBottom: "20px" }}}}>{item['title']}</h2>
            <p style={{{{ fontSize: "15px", lineHeight: "1.8", color: "#98a2b3" }}}}>{item['desc']}</p>
          </article>"""
    return cards

def migrate_file(filename):
    filepath = os.path.join(dir_path, filename)
    algo_key = "basics"
    for k in ALGO_INFO:
        if k in filename.lower():
            algo_key = k
            break
    
    info = ALGO_INFO.get(algo_key, ALGO_INFO["bfs"])
    comp_name = filename.replace('.tsx', '').replace('-', ' ').title().replace(' ', '').replace('(', '').replace(')', '')
    
    guide_cards = generate_guide_cards(info["guide"])
    algo_code_lines = str(info["code"])
    
    content = TEMPLATE.format(
        comp_name=comp_name,
        algo_key=algo_key,
        title=info["title"],
        eyebrow=info["eyebrow"],
        description=info["description"],
        time_complexity=info["time"],
        space_complexity=info["space"],
        guide_cards=guide_cards,
        algo_code_lines=algo_code_lines
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filename in os.listdir(dir_path):
    if filename.endswith(".tsx"):
        print(f"Migrating {filename}...")
        migrate_file(filename)
