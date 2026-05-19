import os

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\linked-list'

ALGO_INFO = {
    "traversal": {
        "title": "Linked List Traversal",
        "eyebrow": "Linked List Operations",
        "description": "Visiting every node in a linked list from the head to the end.",
        "time": "O(N)",
        "space": "O(1)",
        "guide": [
            {"title": "Definition", "desc": "Traversal is the process of visiting each node in a data structure exactly once."},
            {"title": "Algorithm", "desc": "1. Start at the head node.\n2. Process the current node's data.\n3. Move to the next node using the 'next' pointer.\n4. Repeat until the current node is null."},
            {"title": "Time Complexity", "desc": "O(N) because we visit each of the N nodes exactly once during the traversal."}
        ],
        "code": [
            "void traverse(Node* head) {",
            "    Node* temp = head;",
            "    while (temp != nullptr) {",
            "        // Process temp->data",
            "        temp = temp->next;",
            "    }",
            "}"
        ]
    },
    "insertion": {
        "title": "Linked List Insertion",
        "eyebrow": "Linked List Operations",
        "description": "Adding a new node to a specific position in a linked list.",
        "time": "O(1) to O(N)",
        "space": "O(1)",
        "guide": [
            {"title": "Definition", "desc": "Insertion involves allocating a new node and updating pointers to include it in the list."},
            {"title": "Algorithm", "desc": "1. Create a new node with data.\n2. Find the correct insertion point (head, tail, or middle).\n3. Update the new node's next pointer.\n4. Update the previous node's next pointer to the new node."},
            {"title": "Time Complexity", "desc": "O(1) for insertion at the head. O(N) for insertion at the end (without a tail pointer) or in the middle."}
        ],
        "code": [
            "void insertAtHead(Node*& head, int val) {",
            "    Node* newNode = new Node(val);",
            "    newNode->next = head;",
            "    head = newNode;",
            "}"
        ]
    },
    "deletion": {
        "title": "Linked List Deletion",
        "eyebrow": "Linked List Operations",
        "description": "Removing a node from a linked list and freeing its memory.",
        "time": "O(1) to O(N)",
        "space": "O(1)",
        "guide": [
            {"title": "Definition", "desc": "Deletion removes an existing node from the list and properly links the adjacent nodes."},
            {"title": "Algorithm", "desc": "1. Traverse to find the node to delete and its previous node.\n2. Update the previous node's next pointer to bypass the target node.\n3. Free the memory of the target node."},
            {"title": "Time Complexity", "desc": "O(1) for deleting the head. O(N) for deleting a specific value or at a specific position."}
        ],
        "code": [
            "void deleteHead(Node*& head) {",
            "    if (!head) return;",
            "    Node* temp = head;",
            "    head = head->next;",
            "    delete temp;",
            "}"
        ]
    },
    "reverse": {
        "title": "Reverse Linked List",
        "eyebrow": "Linked List Transformations",
        "description": "Reversing the direction of all pointers in a singly linked list.",
        "time": "O(N)",
        "space": "O(1)",
        "guide": [
            {"title": "Definition", "desc": "Reversing a linked list means changing the next pointers of all nodes so the tail becomes the new head."},
            {"title": "Algorithm", "desc": "1. Maintain three pointers: prev, curr, and next.\n2. Iterate through the list.\n3. Save curr-&gt;next, then set curr-&gt;next to prev.\n4. Move prev to curr and curr to next."},
            {"title": "Time Complexity", "desc": "O(N) since we must visit every node once to flip its pointer."}
        ],
        "code": [
            "Node* reverseList(Node* head) {",
            "    Node* prev = nullptr;",
            "    Node* curr = head;",
            "    while (curr != nullptr) {",
            "        Node* nextTemp = curr->next;",
            "        curr->next = prev;",
            "        prev = curr;",
            "        curr = nextTemp;",
            "    }",
            "    return prev;",
            "}"
        ]
    },
    "basics": {
        "title": "Linked List Basics",
        "eyebrow": "Data Structure Fundamentals",
        "description": "Fundamentals of a linear data structure where elements are not stored in contiguous memory locations.",
        "time": "O(N)",
        "space": "O(N)",
        "guide": [
            {"title": "Definition", "desc": "A linked list is a sequence of nodes, where each node contains data and a reference (pointer) to the next node."},
            {"title": "Algorithm", "desc": "Basic operations involve manipulating these node pointers to insert, delete, or traverse elements dynamically without reallocation."},
            {"title": "Time Complexity", "desc": "Access/Search: O(N)\nInsertion/Deletion (at head): O(1)\nInsertion/Deletion (at tail/middle): O(N)"}
        ],
        "code": [
            "struct Node {",
            "    int data;",
            "    Node* next;",
            "    Node(int val) {",
            "        data = val;",
            "        next = nullptr;",
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
    {{ id: "B", x: 220, y: 200 }},
    {{ id: "C", x: 340, y: 200 }},
    {{ id: "D", x: 460, y: 200 }},
    {{ id: "E", x: 580, y: 200 }},
  ],
  edges: [
    {{ id: "e1", from: "A", to: "B", weight: 1 }},
    {{ id: "e2", from: "B", to: "C", weight: 1 }},
    {{ id: "e3", from: "C", to: "D", weight: 1 }},
    {{ id: "e4", from: "D", to: "E", weight: 1 }},
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
  
  if (type === "traversal" || type === "reverse" || type === "basics" || type === "insertion" || type === "deletion") {{
    steps.push({{ type: "init", dist, message: "Initialize traversal from head node A." }});
    let current = source;
    while (current) {{
      steps.push({{ type: "visit", u: current, dist, message: `Processing node ${{current}}` }});
      const nextEdge = edges.find(e => e.from === current);
      if (nextEdge) {{
        steps.push({{ type: "edge", u: current, v: nextEdge.to, edge: nextEdge.id, dist, message: `Moving to next node ${{nextEdge.to}}` }});
        current = nextEdge.to;
      }} else {{
        break;
      }}
    }}
    steps.push({{ type: "done", dist, message: "Reached the end of the linked list." }});
  }} else {{
      steps.push({{ type: "init", dist, message: "Algorithm starting..." }});
      steps.push({{ type: "done", dist, message: "Algorithm finished." }});
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
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="28" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#2b3447" />
              </marker>
              <marker id="arrow-active" markerWidth="10" markerHeight="10" refX="28" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#4f7ef8" />
              </marker>
            </defs>
            {{graph.edges.map((edge) => {{
              const from = graph.nodes.find(n => n.id === edge.from); const to = graph.nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              const isActive = step.edge === edge.id;
              return (
                <line key={{edge.id}} x1={{from.x}} y1={{from.y}} x2={{to.x}} y2={{to.y}} style={{{{ stroke: isActive ? "#4f7ef8" : "#2b3447", strokeWidth: isActive ? 4 : 2, transition: "all 0.3s" }}}} markerEnd={{isActive ? "url(#arrow-active)" : "url(#arrow)"}} />
              );
            }})}}
            {{graph.nodes.map((node) => (
              <g key={{node.id}} onPointerDown={{() => setDragging(node.id)}} style={{{{ cursor: "grab" }}}}>
                <rect x={{node.x - 30}} y={{node.y - 20}} width="60" height="40" rx="8" style={{{{ fill: step.u === node.id || step.v === node.id ? "#4f7ef8" : "#172033", stroke: "#2b3447", strokeWidth: 2, transition: "all 0.3s" }}}} />
                <text x={{node.x}} y={{node.y + 5}} style={{{{ fill: "white", fontSize: "14px", textAnchor: "middle", fontWeight: 800, userSelect: "none" }}}}>{{node.id}}</text>
              </g>
            ))}}

            <foreignObject x={{distPos.x}} y={{distPos.y}} width="100%" height="100%" style={{{{ pointerEvents: "none" }}}}>
              <div style={{{{ pointerEvents: "auto", display: "inline-flex", flexDirection: "column", background: "#172033", border: "1px solid #2b3447", borderRadius: "8px", height: "200px", minWidth: "160px", resize: "both", overflow: "hidden" }}}}>
                <div onPointerDown={{(e) => startPanelDrag(e, "dist", distPos)}} style={{{{ background: "#111827", padding: "8px 12px", fontSize: "10px", fontWeight: 800, textTransform: "uppercase", cursor: "grab", flexShrink: 0 }}}}>Values</div>
                <div style={{{{ padding: "12px", flex: 1, overflowY: "auto" }}}}>
                  {{graph.nodes.map((node, index) => (
                    <div key={{node.id}} style={{{{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "4px 0", borderBottom: "1px solid #2b3447" }}}}><span>Node {{node.id}}</span><b>{{index * 10 + 5}}</b></div>
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

def migrate_file(filename):
    filepath = os.path.join(dir_path, filename)
    algo_key = "basics"
    for k in ALGO_INFO:
        if k in filename.lower():
            algo_key = k
            break
    
    info = ALGO_INFO.get(algo_key, ALGO_INFO["basics"])
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
        print(f"Migrating {{filename}}...")
        migrate_file(filename)
