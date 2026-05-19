import os

base_dir = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa'

targets = {
    "stack-queue": {
        "eyebrow": "Stack & Queue Operations",
        "description": "LIFO and FIFO data structures used for organizing data sequentially.",
        "time": "O(1)",
        "space": "O(N)",
        "guide": [
            {"title": "Definition", "desc": "Stacks follow Last-In-First-Out (LIFO) while Queues follow First-In-First-Out (FIFO) ordering."},
            {"title": "Algorithm", "desc": "1. Stack: Push elements to the top, pop from the top.\n2. Queue: Enqueue elements to the rear, dequeue from the front."},
            {"title": "Time Complexity", "desc": "O(1) for push, pop, enqueue, and dequeue operations in standard implementations."}
        ],
        "code": [
            "void push(int val) {",
            "    stack.push_back(val);",
            "}",
            "void pop() {",
            "    if (!stack.empty())",
            "        stack.pop_back();",
            "}"
        ]
    },
    "hashing": {
        "eyebrow": "Hashing Fundamentals",
        "description": "Using hash functions to map data to specific buckets for O(1) lookups.",
        "time": "O(1)",
        "space": "O(N)",
        "guide": [
            {"title": "Definition", "desc": "Hashing converts a given key into another value to index a hash table for rapid data retrieval."},
            {"title": "Algorithm", "desc": "1. Compute hash value of the key.\n2. Use the hash value as an index in the array.\n3. Handle collisions using chaining or open addressing."},
            {"title": "Time Complexity", "desc": "Average case O(1) for search, insert, and delete. Worst case O(N) depending on collisions."}
        ],
        "code": [
            "int hashFunction(int key) {",
            "    return key % tableSize;",
            "}",
            "void insert(int key) {",
            "    int index = hashFunction(key);",
            "    table[index].push_back(key);",
            "}"
        ]
    },
    "recursion-backtracking": {
        "eyebrow": "Recursion & Backtracking",
        "description": "Solving problems by breaking them down into smaller sub-problems recursively.",
        "time": "O(2^N)",
        "space": "O(N)",
        "guide": [
            {"title": "Definition", "desc": "Recursion is a function calling itself. Backtracking explores all potential solutions and abandons invalid ones."},
            {"title": "Algorithm", "desc": "1. Define the base case to terminate recursion.\n2. Do some work and recursively call for the next state.\n3. Undo the work (backtrack) if exploring multiple paths."},
            {"title": "Time Complexity", "desc": "Often exponential O(2^N) or factorial O(N!) depending on the branching factor and depth."}
        ],
        "code": [
            "void solve(int step, State state) {",
            "    if (isGoal(state)) return;",
            "    for (Option opt : options) {",
            "        apply(opt, state);",
            "        solve(step + 1, state);",
            "        undo(opt, state);",
            "    }",
            "}"
        ]
    },
    "dynamic-programming": {
        "eyebrow": "Dynamic Programming",
        "description": "Optimizing recursive solutions by caching overlapping subproblem results.",
        "time": "O(N^2)",
        "space": "O(N)",
        "guide": [
            {"title": "Definition", "desc": "Dynamic Programming (DP) is a technique that stores the results of expensive function calls to avoid redundant computations."},
            {"title": "Algorithm", "desc": "1. Define the state and transitions.\n2. Identify the base cases.\n3. Compute iteratively (bottom-up) or recursively with memoization (top-down)."},
            {"title": "Time Complexity", "desc": "Usually bounded by the number of unique states multiplied by the time taken to compute each state."}
        ],
        "code": [
            "int solve(int i, vector<int>& memo) {",
            "    if (i == 0) return 0;",
            "    if (memo[i] != -1) return memo[i];",
            "    int res = compute(i) + solve(i - 1, memo);",
            "    return memo[i] = res;",
            "}"
        ]
    },
    "searching-sorting": {
        "eyebrow": "Searching & Sorting",
        "description": "Algorithms designed to locate specific elements or arrange elements in a particular order.",
        "time": "O(N log N)",
        "space": "O(1)",
        "guide": [
            {"title": "Definition", "desc": "Sorting organizes data sequentially. Searching efficiently queries this structured data (e.g., Binary Search)."},
            {"title": "Algorithm", "desc": "1. Sorting typically involves dividing the array and merging/partitioning.\n2. Binary Search divides the search space in half recursively or iteratively."},
            {"title": "Time Complexity", "desc": "Sorting is typically O(N log N). Binary search is O(log N). Linear search is O(N)."}
        ],
        "code": [
            "int binarySearch(vector<int>& arr, int target) {",
            "    int l = 0, r = arr.size() - 1;",
            "    while (l <= r) {",
            "        int m = l + (r - l) / 2;",
            "        if (arr[m] == target) return m;",
            "        if (arr[m] < target) l = m + 1;",
            "        else r = m - 1;",
            "    }",
            "    return -1;",
            "}"
        ]
    }
}

TEMPLATE = """\"use client\";

import {{ useCallback, useEffect, useMemo, useRef, useState }} from "react";
import {{ useTheme }} from "next-themes";
import {{ Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Activity, Zap, MousePointer2, List }} from "lucide-react";
import {{ CodeTracker }} from "../../../components/CodeTracker";

interface NodeItem {{ id: string; x: number; y: number; val: string; }}
interface DataState {{ nodes: NodeItem[]; }}

interface Step {{
  type: string;
  dist: Record<string, number>;
  activeIds?: string[];
  message: string;
  line?: number;
}}

const initialData: DataState = {{
  nodes: [
    {{ id: "0", x: 100, y: 200, val: "A" }},
    {{ id: "1", x: 220, y: 200, val: "B" }},
    {{ id: "2", x: 340, y: 200, val: "C" }},
    {{ id: "3", x: 460, y: 200, val: "D" }},
    {{ id: "4", x: 580, y: 200, val: "E" }},
  ],
}};

function cloneData(data: DataState): DataState {{
  return {{
    nodes: data.nodes.map((node) => ({{ ...node }})),
  }};
}}

function getSteps(nodes: NodeItem[]): Step[] {{
  const steps: Step[] = [];
  const dist: Record<string, number> = {{}};
  
  steps.push({{ type: "init", dist, message: "Initialize algorithm." }});
  
  for (let i = 0; i < nodes.length; i++) {{
    steps.push({{ type: "process", activeIds: [nodes[i].id], dist, message: `Processing element ${{nodes[i].val}} at index ${{i}}`, line: Math.min(i + 1, 6) }});
  }}
  
  steps.push({{ type: "done", dist, message: "Algorithm finished.", line: 0 }});
  return steps;
}}

export default function {comp_name}Simulation() {{
  const svgRef = useRef<SVGSVGElement>(null);
  const {{ resolvedTheme }} = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [data, setData] = useState(() => cloneData(initialData));
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);
  const [dragging, setDragging] = useState<string | null>(null);

  const [distPos, setDistPos] = useState({{ x: 20, y: 20 }});
  const [infoPos, setInfoPos] = useState({{ x: 440, y: 20 }});
  const [codePos, setCodePos] = useState({{ x: 20, y: 220 }});
  const [activeDragPanel, setActiveDragPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({{ x: 0, y: 0 }});

  const steps = useMemo(() => getSteps(data.nodes), [data]);
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
      setData(d => ({{ ...d, nodes: d.nodes.map(n => n.id === dragging ? {{ ...n, x: Math.max(40, Math.min(640, pt.x)), y: Math.max(45, Math.min(390, pt.y)) }} : n) }}));
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
            {{data.nodes.map((node, i) => {{
               const isLast = i === data.nodes.length - 1;
               if (isLast) return null;
               const nextNode = data.nodes[i+1];
               return (
                 <line key={{`line-${{node.id}}`}} x1={{node.x + 30}} y1={{node.y}} x2={{nextNode.x - 30}} y2={{nextNode.y}} style={{{{ stroke: "#2b3447", strokeWidth: 2 }}}} />
               );
            }})}}
            
            {{data.nodes.map((node) => (
              <g key={{node.id}} onPointerDown={{() => setDragging(node.id)}} style={{{{ cursor: "grab" }}}}>
                <rect x={{node.x - 30}} y={{node.y - 20}} width="60" height="40" rx="8" style={{{{ fill: step.activeIds?.includes(node.id) ? "#4f7ef8" : "#172033", stroke: "#2b3447", strokeWidth: 2, transition: "all 0.3s" }}}} />
                <text x={{node.x}} y={{node.y + 5}} style={{{{ fill: "white", fontSize: "14px", textAnchor: "middle", fontWeight: 800, userSelect: "none" }}}}>{{node.val}}</text>
              </g>
            ))}}

            <foreignObject x={{distPos.x}} y={{distPos.y}} width="100%" height="100%" style={{{{ pointerEvents: "none" }}}}>
              <div style={{{{ pointerEvents: "auto", display: "inline-flex", flexDirection: "column", background: "#172033", border: "1px solid #2b3447", borderRadius: "8px", height: "200px", minWidth: "160px", resize: "both", overflow: "hidden" }}}}>
                <div onPointerDown={{(e) => startPanelDrag(e, "dist", distPos)}} style={{{{ background: "#111827", padding: "8px 12px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", cursor: "grab", flexShrink: 0 }}}}>State Variables</div>
                <div style={{{{ padding: "12px", flex: 1, overflowY: "auto" }}}}>
                  {{data.nodes.map((node, index) => (
                    <div key={{node.id}} style={{{{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "4px 0", borderBottom: "1px solid #2b3447" }}}}><span>Item {{index}}</span><b>{{node.val}}</b></div>
                  ))}}
                </div>
              </div>
            </foreignObject>

            <foreignObject x={{codePos.x}} y={{codePos.y}} width="100%" height="100%" style={{{{ pointerEvents: "none" }}}}>
              <div style={{{{ pointerEvents: "auto", display: "inline-flex", flexDirection: "column", height: "250px", minWidth: "300px", resize: "both", overflow: "hidden", borderRadius: "8px" }}}}>
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
        lines = item['desc'].replace('<', '&lt;').replace('>', '&gt;').split('\\n')
        desc_html = "".join([f"<p style={{{{ fontSize: '15px', lineHeight: '1.8', color: '#98a2b3', marginBottom: '8px' }}}}>{line}</p>" for line in lines])
        
        cards += f"""
          <article style={{{{ background: "#111827", border: "1px solid #2b3447", padding: "32px", borderRadius: "20px" }}}}>
            <h2 style={{{{ fontSize: "20px", marginBottom: "20px" }}}}>{item['title']}</h2>
            {desc_html}
          </article>"""
    return cards

def migrate_directory(target_dir, info_key):
    full_path = os.path.join(base_dir, target_dir)
    if not os.path.exists(full_path):
        print(f"Directory {{full_path}} does not exist.")
        return

    info = targets[info_key]
    guide_cards = generate_guide_cards(info["guide"])
    algo_code_lines = str(info["code"])

    for filename in os.listdir(full_path):
        if filename.endswith(".tsx"):
            filepath = os.path.join(full_path, filename)
            comp_name = filename.replace('.tsx', '').replace('-', ' ').title().replace(' ', '').replace('(', '').replace(')', '')
            
            content = TEMPLATE.format(
                comp_name=comp_name,
                title=comp_name,
                eyebrow=info["eyebrow"],
                description=info["description"],
                time_complexity=info["time"],
                space_complexity=info["space"],
                guide_cards=guide_cards,
                algo_code_lines=algo_code_lines
            )
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Migrated {{target_dir}}/{{filename}}")

for topic_key in targets.keys():
    migrate_directory(topic_key, topic_key)

