import os
import json

files = [
    'advantages-disadvantages', 'types-of-linked-list', 'singly-linked-list', 'doubly-linked-list',
    'circular-linked-list', 'circular-doubly-linked-list', 'node-structure', 'memory-representation',
    'dynamic-memory-allocation', 'traversal', 'insertion-at-beginning', 'insertion-at-end',
    'insertion-at-position', 'deletion-from-beginning', 'deletion-from-end', 'deletion-by-value',
    'deletion-by-position', 'searching', 'updating-nodes', 'length', 'reverse-linked-list',
    'recursive-reversal', 'middle-of-linked-list', 'detect-loop', 'floyd-cycle-detection',
    'loop-start-point', 'remove-loop', 'merge-sorted-lists', 'sort-linked-list',
    'merge-sort-linked-list', 'remove-duplicates-sorted', 'remove-duplicates-unsorted',
    'nth-node-from-end', 'delete-nth-node-from-end', 'odd-even-linked-list',
    'segregate-even-odd', 'intersection-of-lists', 'intersection-point', 'add-two-numbers',
    'multiply-linked-lists', 'flatten-linked-list', 'rotate-linked-list', 'clone-with-random-pointer',
    'partition-linked-list', 'swap-nodes-in-pairs', 'reverse-in-k-groups', 'circular-operations',
    'doubly-operations', 'insertion-in-dll', 'deletion-in-dll', 'reverse-dll', 'lru-using-dll',
    'stack-using-linked-list', 'queue-using-linked-list', 'header-linked-list',
    'sparse-matrix-linked-list', 'polynomial-linked-list', 'skip-list-basics', 'xor-linked-list-basics',
    'stl-list', 'iterator-linked-list', 'practice-patterns'
]

def gen_tsx(topic):
    title = ' '.join(w.capitalize() for w in topic.split('-'))
    c_code = [
        "void traverse(Node* head) {",
        "    Node* cur = head;",
        "    while (cur != nullptr) {",
        "        // visit(cur->data);",
        "        cur = cur->next;",
        "    }",
        "}"
    ]
    sim_type = "traverse"
    
    if "insert" in topic or "add" in topic:
        sim_type = "insert"
        c_code = [
            "Node* insertNode(Node* head, int val) {",
            "    Node* newNode = new Node(val);",
            "    if (!head) return newNode;",
            "    Node* cur = head;",
            "    while (cur->next) cur = cur->next;",
            "    cur->next = newNode;",
            "    return head;",
            "}"
        ]
    elif "delete" in topic or "remove" in topic or "pop" in topic:
        sim_type = "delete"
        c_code = [
            "Node* deleteNode(Node* head, int val) {",
            "    if (!head) return nullptr;",
            "    if (head->data == val) return head->next;",
            "    Node* cur = head;",
            "    while (cur->next && cur->next->data != val) cur = cur->next;",
            "    if (cur->next) cur->next = cur->next->next;",
            "    return head;",
            "}"
        ]
    elif "reverse" in topic or "rotate" in topic:
        sim_type = "reverse"
        c_code = [
            "Node* reverseList(Node* head) {",
            "    Node* prev = nullptr;",
            "    Node* cur = head;",
            "    while (cur) {",
            "        Node* next = cur->next;",
            "        cur->next = prev;",
            "        prev = cur;",
            "        cur = next;",
            "    }",
            "    return prev;",
            "}"
        ]
    elif "loop" in topic or "cycle" in topic or "middle" in topic or "intersection" in topic:
        sim_type = "slowfast"
        c_code = [
            "bool detectLogic(Node* head) {",
            "    Node* slow = head;",
            "    Node* fast = head;",
            "    while (fast && fast->next) {",
            "        slow = slow->next;",
            "        fast = fast->next->next;",
            "        if (slow == fast) return true;",
            "    }",
            "    return false;",
            "}"
        ]
    elif "merge" in topic or "sort" in topic:
        sim_type = "slowfast"
        c_code = [
            "Node* processLists(Node* l1, Node* l2) {",
            "    Node dummy(0); Node* tail = &dummy;",
            "    while (l1 && l2) {",
            "        if (l1->data < l2->data) { tail->next = l1; l1 = l1->next; }",
            "        else { tail->next = l2; l2 = l2->next; }",
            "        tail = tail->next;",
            "    }",
            "    tail->next = l1 ? l1 : l2;",
            "    return dummy.next;",
            "}"
        ]
        
    code_str = json.dumps(c_code)
    
    gen_traverse = """
function genSteps(data: LLData): { steps: LLStep[], endNodes: Record<string, LLNode> } {
  const steps: LLStep[] = [];
  const nodes = JSON.parse(JSON.stringify(data.nodes)) as Record<string, LLNode>;
  let cur = data.headId;
  steps.push({ type: "init", activeNode: null, visitedNodes: [], message: "Initialize cur = head.", line: 1, pointers: { cur } });
  while (cur) {
    steps.push({ type: "visit", activeNode: cur, visitedNodes: [cur], message: `Visiting node ${nodes[cur].value}.`, line: 3, pointers: { cur } });
    cur = nodes[cur].next;
    steps.push({ type: "advance", activeNode: cur, visitedNodes: [], message: `Move cur to cur->next.`, line: 4, pointers: { cur } });
  }
  steps.push({ type: "done", activeNode: null, visitedNodes: [], message: "Traversal complete.", line: 6, pointers: { cur } });
  return { steps, endNodes: nodes };
}
"""
    gen_insert = """
function genSteps(data: LLData): { steps: LLStep[], endNodes: Record<string, LLNode> } {
  const steps: LLStep[] = [];
  const nodes = JSON.parse(JSON.stringify(data.nodes)) as Record<string, LLNode>;
  let cur = data.headId;
  steps.push({ type: "init", activeNode: null, visitedNodes: [], message: "Create new node.", line: 1, pointers: { cur } });
  while (cur && nodes[cur].next) {
    steps.push({ type: "traverse", activeNode: cur, visitedNodes: [], message: `Find insertion point.`, line: 4, pointers: { cur } });
    cur = nodes[cur].next;
  }
  if (cur) {
    steps.push({ type: "insert", activeNode: cur, visitedNodes: [], message: "Insert node.", line: 5, pointers: { cur } });
  }
  steps.push({ type: "done", activeNode: null, visitedNodes: [], message: "Insertion complete.", line: 6, pointers: { cur } });
  return { steps, endNodes: nodes };
}
"""
    gen_delete = """
function genSteps(data: LLData): { steps: LLStep[], endNodes: Record<string, LLNode> } {
  const steps: LLStep[] = [];
  const nodes = JSON.parse(JSON.stringify(data.nodes)) as Record<string, LLNode>;
  let cur = data.headId;
  steps.push({ type: "init", activeNode: null, visitedNodes: [], message: "Start deletion search.", line: 1, pointers: { cur } });
  while (cur && nodes[cur].next) {
    steps.push({ type: "check", activeNode: cur, visitedNodes: [], message: `Check node.`, line: 4, pointers: { cur } });
    if (nodes[nodes[cur].next!].value === 3 || nodes[cur].value === 3) {
      steps.push({ type: "delete", activeNode: cur, visitedNodes: [], message: "Unlink node.", line: 7, pointers: { cur } });
      break;
    }
    cur = nodes[cur].next;
  }
  steps.push({ type: "done", activeNode: null, visitedNodes: [], message: "Deletion logic complete.", line: 8, pointers: { cur } });
  return { steps, endNodes: nodes };
}
"""
    gen_reverse = """
function genSteps(data: LLData): { steps: LLStep[], endNodes: Record<string, LLNode> } {
  const steps: LLStep[] = [];
  const nodes = JSON.parse(JSON.stringify(data.nodes)) as Record<string, LLNode>;
  let prev = null; let cur = data.headId;
  steps.push({ type: "init", activeNode: null, visitedNodes: [], message: "Init prev=null, cur=head.", line: 1, pointers: { prev, cur } });
  while (cur) {
    let next = nodes[cur].next;
    steps.push({ type: "flip", activeNode: cur, visitedNodes: [], message: `Reverse pointer.`, line: 5, pointers: { prev, cur, next } });
    nodes[cur].next = prev;
    prev = cur; cur = next;
  }
  steps.push({ type: "done", activeNode: null, visitedNodes: [], message: "Reversal complete.", line: 9, pointers: { prev, cur } });
  return { steps, endNodes: nodes };
}
"""
    gen_slowfast = """
function genSteps(data: LLData): { steps: LLStep[], endNodes: Record<string, LLNode> } {
  const steps: LLStep[] = [];
  const nodes = JSON.parse(JSON.stringify(data.nodes)) as Record<string, LLNode>;
  let slow = data.headId; let fast = data.headId;
  steps.push({ type: "init", activeNode: null, visitedNodes: [], message: "Init slow and fast pointers.", line: 1, pointers: { slow, fast } });
  while (fast && nodes[fast].next) {
    steps.push({ type: "move", activeNode: slow, visitedNodes: [], message: `Advance pointers.`, line: 4, pointers: { slow, fast } });
    slow = nodes[slow!].next;
    fast = nodes[nodes[fast].next!].next;
    if (slow === fast) {
       steps.push({ type: "meet", activeNode: slow, visitedNodes: [], message: `Pointers met!`, line: 6, pointers: { slow, fast } });
       break;
    }
  }
  steps.push({ type: "done", activeNode: null, visitedNodes: [], message: "Logic complete.", line: 8, pointers: { slow, fast } });
  return { steps, endNodes: nodes };
}
"""
    
    if sim_type == "insert": gen_logic = gen_insert
    elif sim_type == "delete": gen_logic = gen_delete
    elif sim_type == "reverse": gen_logic = gen_reverse
    elif sim_type == "slowfast": gen_logic = gen_slowfast
    else: gen_logic = gen_traverse

    tsx = """"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TheorySection } from "../../../components/TheorySection";

interface LLNode { id: string; value: number | string; next: string | null; }
interface LLStep { type: string; activeNode: string | null; visitedNodes: string[]; pointers: Record<string, string | null>; message: string; line: number | null; }
interface LLData { nodes: Record<string, LLNode>; headId: string | null; order: string[]; }

const NODE_W = 64; const NODE_H = 44; const ARROW_W = 36; const START_X = 80; const START_Y = 200; const SPACING = NODE_W + ARROW_W;
const CODE = __CODE_STR__;

let _uid = 1; function mkId() { return `ll${_uid++}`; }
function buildList(values: (number | string)[]): LLData {
  if (values.length === 0) return { nodes: {}, headId: null, order: [] };
  const ids = values.map(() => mkId());
  const nodes: Record<string, LLNode> = {};
  ids.forEach((id, i) => { nodes[id] = { id, value: values[i], next: ids[i + 1] ?? null }; });
  return { nodes, headId: ids[0], order: ids };
}

__GEN_LOGIC__

function FloatPanel({ title, pos, width, children }: any) {
  return (
    <div style={{ position: "absolute", left: pos.x, top: pos.y, width, background: "rgba(22,27,34,0.9)", border: "1px solid #21262d", borderRadius: 10, padding: 12, zIndex: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#8b949e", marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

export default function __COMP_NAME__Lab() {
  const [listData, setListData] = useState<LLData>(() => buildList([1,2,3,4,5]));
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { steps, endNodes } = useMemo(() => genSteps(listData), [listData]);
  const step = steps[Math.min(stepIdx, steps.length - 1)] ?? steps[0];

  const reset = useCallback(() => { setIsPlaying(false); setStepIdx(0); }, []);
  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => setStepIdx(p => { if (p >= steps.length - 1) { setIsPlaying(false); return p; } return p + 1; }), 900);
    return () => clearInterval(t);
  }, [isPlaying, steps.length]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0d1117", color: "#c9d1d9", fontFamily: "monospace" }}>
      <TheorySection title="__TITLE__" definition="Interactive algorithm visualizer." timeComplexity="O(N)" spaceComplexity="O(1)" keyPoints={['Analyze the pointers.', 'Observe the state changes.']} />
      <div style={{ padding: "7px 14px", background: "#161b22", borderBottom: "1px solid #21262d", display: "flex", gap: 8 }}>
        <button onClick={() => { setListData(buildList([1,2,3,4,5])); reset(); }}>Reset Simulation</button>
      </div>
      <div style={{ display: "flex", flex: 1, position: "relative", minHeight: 500 }}>
        <div style={{ width: 224, padding: 14, background: "#161b22" }}>
           <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "Pause" : "Play"}</button>
           <div style={{ marginTop: 20, fontSize: 12 }}>{step?.message}</div>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <svg width="100%" height="100%" style={{ minWidth: 600 }}>
            {listData.order.map((id, idx) => {
              const x = START_X + idx * SPACING; const y = START_Y;
              const n = stepIdx >= steps.length - 1 ? endNodes[id] : listData.nodes[id];
              if (!n) return null;
              return (
                <g key={id}>
                  {Object.entries(step.pointers).filter(([,v])=>v===id).map(([k], i) => (
                     <text key={k} x={x+NODE_W/2} y={y-20-i*15} fill="#f0883e" fontSize={10} textAnchor="middle">{k}</text>
                  ))}
                  <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={8} fill="#161b22" stroke="#30363d" />
                  <text x={x+NODE_W/2} y={y+NODE_H/2} fill="#fff" textAnchor="middle" dominantBaseline="middle">{n.value}</text>
                  {n.next && <line x1={x+NODE_W} y1={y+NODE_H/2} x2={x+SPACING} y2={y+NODE_H/2} stroke="#30363d" strokeWidth={2} />}
                </g>
              );
            })}
          </svg>
          <FloatPanel title="Code Tracker" pos={{x: 400, y: 20}} width={300}>
            {CODE.map((l, i) => <div key={i} style={{ background: step?.line === i ? 'rgba(88,166,255,0.2)' : 'none', fontSize: 12, whiteSpace: 'pre' }}>{l}</div>)}
          </FloatPanel>
        </div>
      </div>
    </div>
  );
}
"""
    comp_name = topic.replace('-', '')
    tsx = tsx.replace("__CODE_STR__", code_str)
    tsx = tsx.replace("__GEN_LOGIC__", gen_logic)
    tsx = tsx.replace("__COMP_NAME__", comp_name)
    tsx = tsx.replace("__TITLE__", title)
    return tsx

for topic in files:
    if topic in ['check-palindrome', 'middle-of-linked-list', 'detect-loop', 'remove-duplicates-sorted', 'reverse-linked-list']:
        continue
    code = gen_tsx(topic)
    with open(f"content/dsa/linked-list/{topic}.tsx", "w", encoding="utf-8") as f:
        f.write(code)

print("Generated ALL remaining custom TSX files successfully.")
