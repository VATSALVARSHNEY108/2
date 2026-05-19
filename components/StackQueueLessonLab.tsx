"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Activity, 
  Terminal 
} from "lucide-react";
import { CodeTracker } from "./CodeTracker";

type Mode = "stack" | "queue" | "deque" | "priority" | "monotonic" | "expression";
type TopicKind = 
  | "stack" 
  | "queue" 
  | "deque" 
  | "priority" 
  | "expression" 
  | "monotonic" 
  | "conversion" 
  | "implementation" 
  | "application" 
  | "special";

type Step = {
  label: string;
  message: string;
  line: number;
  items: string[];
  activeIndices: number[];
  vars: Record<string, string | number>;
  expression?: string[];
  exprIndex?: number;
  outputStr?: string;
  originalArray?: number[];
  currentIndex?: number;
  resultArray?: number[];
  minItems?: string[];
  front?: number;
  rear?: number;
  capacity?: number;
};

type Profile = {
  title: string;
  topic: string;
  mode: Mode;
  pattern: string;
  definition: string;
  time: string;
  space: string;
  points: string[];
  code: string[];
  seed: string[];
};

type PanelId = "definition" | "vars" | "sandbox" | "log";

type PanelRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface SandboxLogEntry {
  id: string;
  type: string;
  value?: string;
  timestamp: string;
}

function titleFromSlug(slug: string) {
  return slug.split("-").map((part) => {
    const lower = part.toLowerCase();
    if (["stl", "lru", "bfs", "cpu"].includes(lower)) return lower.toUpperCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(" ");
}

const LESSON_TOPIC: Record<string, TopicKind> = {
  "introduction-to-stack": "stack",
  "stack-basics": "stack",
  "stack-data-structure": "stack",
  "lifo-principle": "stack",
  "stack-operations": "stack",
  "push-operation": "stack",
  "pop-operation": "stack",
  "peek-top-operation": "stack",
  "isempty-isfull": "stack",
  "stack-arrays": "stack",
  "stack-linked-list": "stack",
  "dynamic-stack": "stack",
  "complexity-stack": "stack",
  "applications-stack": "application",
  "backtracking-stack": "application",
  "recursion-call-stack": "application",
  "stl-stack": "stack",
  "practice-patterns-stack": "stack",

  "balanced-parentheses": "expression",
  "valid-parentheses": "expression",
  "infix-expression": "expression",
  "prefix-expression": "expression",
  "postfix-expression": "expression",
  "infix-to-postfix": "conversion",
  "infix-to-prefix": "conversion",
  "postfix-to-infix": "conversion",
  "prefix-to-infix": "conversion",
  "evaluate-postfix": "expression",
  "evaluate-prefix": "expression",

  "monotonic-stack": "monotonic",
  "next-greater-element": "monotonic",
  "next-smaller-element": "monotonic",
  "previous-greater-element": "monotonic",
  "previous-smaller-element": "monotonic",
  "stock-span": "monotonic",
  "largest-rectangle-histogram": "monotonic",
  "maximal-rectangle": "monotonic",
  "trapping-rain-water": "monotonic",
  "monotonic-queue": "monotonic",
  "sliding-window-max": "monotonic",
  "first-negative-window": "monotonic",

  "min-stack": "special",
  "special-stack": "special",
  "stack-using-queue": "implementation",
  "stack-using-queue-queue": "implementation",
  "two-stack-one-array": "implementation",
  "multiple-stack-problems": "implementation",
  "queue-using-stack": "implementation",
  "k-queue-one-array": "implementation",

  "introduction-to-queue": "queue",
  "queue-data-structure": "queue",
  "fifo-principle": "queue",
  "queue-operations": "queue",
  "enqueue-operation": "queue",
  "dequeue-operation": "queue",
  "front-and-rear": "queue",
  "queue-arrays": "queue",
  "queue-linked-list": "queue",
  "circular-queue": "queue",
  "dynamic-queue": "queue",
  "stl-queue": "queue",
  "practice-patterns-queue": "queue",

  "deque-basics": "deque",
  "stl-deque": "deque",

  "priority-queue-intro": "priority",
  "priority-queue-heap": "priority",
  "stl-priority-queue-stl": "priority",

  "applications-queue": "application",
  "cpu-scheduling": "application",
  "printer-queue": "application",
  "bfs-using-queue": "application",
  "circular-tour": "application",
  "lru-cache-queue": "application",
};

const LESSON_FOCUS: Record<string, string> = {
  "lifo-principle": "Last-In-First-Out access order",
  "push-operation": "adding a value to the top of the stack",
  "pop-operation": "removing the top value from the stack",
  "peek-top-operation": "inspecting the top value without removing it",
  "isempty-isfull": "checking empty or boundary limit conditions",
  "balanced-parentheses": "matching pairs of open and close brackets",
  "valid-parentheses": "checking correct ordering of bracket groups",
  "infix-to-postfix": "transforming infix notation using a stack",
  "infix-to-prefix": "converting operators to precede operands",
  "evaluate-postfix": "resolving numerical results using a LIFO buffer",
  "next-greater-element": "finding the first larger element on the right",
  "previous-smaller-element": "locating the closest smaller node to the left",
  "stock-span": "counting successive non-greater elements",
  "largest-rectangle-histogram": "tracking smaller boundary bars with a stack",
  "sliding-window-max": "maintaining maximum elements in a running window",
  "min-stack": "exposing the minimum value in constant O(1) time",
  "stack-using-queue": "recreating LIFO behavior via FIFO queues",
  "queue-using-stack": "simulating FIFO access with dual LIFO stacks",
  "circular-queue": "implementing ring buffers with mod wrap-around",
  "front-and-rear": "maintaining queue endpoints efficiently",
  "bfs-using-queue": "processing graph levels in first-in-first-out order",
};

const PARENTHESES_CODE: string[] = [
  "bool isValid(string s) {",
  "  stack<char> st;",
  "  for (char c : s) {",
  "    if (isOpen(c)) {",
  "      st.push(c);",
  "    } else {",
  "      if (st.empty()) return false;",
  "      if (isMatch(st.top(), c)) st.pop();",
  "      else return false;",
  "    }",
  "  }",
  "  return st.empty();",
  "}",
];


const INFIX_CODE: string[] = [];


const NGE_CODE: string[] = [];


const MIN_STACK_CODE: string[] = [];


const CIRCULAR_QUEUE_CODE: string[] = [];


function profileForLesson(lessonId: string, title?: string): Profile {
  const name = title ?? titleFromSlug(lessonId);
  const topic = LESSON_TOPIC[lessonId] ?? "stack";
  const focus = LESSON_FOCUS[lessonId] ?? `the ${name} pattern`;

  if (topic === "expression" || topic === "conversion") {
    const isConv = topic === "conversion";
    return {
      title: name,
      topic: isConv ? "Expression Conversion" : "Expression Stack",
      mode: "expression",
      pattern: isConv ? "Operator Stack Conversion" : "Bracket Matching",
      definition: `${name} uses a stack for ${focus}. Values are buffered until precedence rules or closing tokens resolve intermediate steps.`,
      time: "O(N)",
      space: "O(N)",
      points: [
        "Scan string tokens left to right.",
        "Push operators or open brackets directly.",
        "Pop elements on matching tokens or precedence drops."
      ],
      code: isConv ? INFIX_CODE : PARENTHESES_CODE,
      seed: isConv ? ["(", "A", "+", "B", ")", "*", "C"] : ["(", "[", "{", "}", "]", ")"],
    };
  }
  if (topic === "monotonic") {
    return {
      title: name,
      topic: "Monotonic Stack/Queue",
      mode: "monotonic",
      pattern: "Monotonic Structure",
      definition: `${name} maintains elements in strictly sorted order. Elements violating sorting are popped before pushing new arrivals.`,
      time: "O(N) Amortized",
      space: "O(N)",
      points: [
        "Maintain elements in increasing/decreasing order.",
        "Pop elements smaller/larger than the incoming value.",
        "The stack top remains the closest active candidate."
      ],
      code: NGE_CODE,
      seed: ["4", "2", "7", "3", "9"],
    };
  }
  if (topic === "queue") {
    const isCirc = lessonId.includes("circular");
    return {
      title: name,
      topic: "Queue Fundamentals",
      mode: "queue",
      pattern: "FIFO Queue",
      definition: `${name} runs on ${focus}. Queues follow First-In-First-Out order: insertions occur at the rear and deletions at the front.`,
      time: "O(1) Core",
      space: "O(N)",
      points: [
        "Enqueue additions at the rear boundary.",
        "Dequeue removals from the front boundary.",
        isCirc ? "Modulo arithmetic reuses empty slot positions." : "Dynamic structures adjust boundaries automatically."
      ],
      code: isCirc ? CIRCULAR_QUEUE_CODE : ["void enqueue(int x) { q.push(x); }", "int dequeue() {", "  int x = q.front();", "  q.pop();", "  return x;", "}"],
      seed: ["A", "B", "C", "D"],
    };
  }
  if (topic === "deque") {
    return {
      title: name,
      topic: "Double Ended Queue",
      mode: "deque",
      pattern: "Deque",
      definition: `${name} permits insertion and removal at both front and rear boundaries, providing dual stack-like and queue-like operations.`,
      time: "O(1) at boundaries",
      space: "O(N)",
      points: [
        "Push/pop at the front boundary.",
        "Push/pop at the rear boundary.",
        "Combines FIFO and LIFO capabilities in a single layout."
      ],
      code: ["dq.push_front(x);", "dq.push_back(y);", "dq.pop_front();", "dq.pop_back();"],
      seed: ["A", "B", "C"],
    };
  }
  if (topic === "priority") {
    return {
      title: name,
      topic: "Priority Queue",
      mode: "priority",
      pattern: "Priority Queue",
      definition: `${name} processes elements according to priority value rather than arrival order, typically backed by binary heap representations.`,
      time: "O(log N) updates",
      space: "O(N)",
      points: [
        "Insertion places elements based on priority order.",
        "Pop removes the highest priority item.",
        "Maintains stable sorted peaks for dynamic schedules."
      ],
      code: ["priority_queue<int> pq;", "pq.push(x); // logarithmic insertion", "topValue = pq.top(); // constant peek", "pq.pop(); // logarithmic removal"],
      seed: ["5", "1", "9", "3"],
    };
  }
  if (topic === "special") {
    return {
      title: name,
      topic: "Augmented Stack",
      mode: "stack",
      pattern: "Augmented Stack",
      definition: `${name} is an optimized variant tracking auxiliary attributes alongside normal LIFO operations, such as O(1) minimum values.`,
      time: "O(1) all ops",
      space: "O(N)",
      points: [
        "Store auxiliary metadata at each stack depth.",
        "Main stack records regular item sequences.",
        "Parallel track retains local minima, maxima, or sums."
      ],
      code: MIN_STACK_CODE,
      seed: ["5", "3", "7", "2"],
    };
  }
  if (topic === "application") {
    if (lessonId === "bfs-using-queue") {
      return {
        title: name,
        topic: "BFS Traversal",
        mode: "queue",
        pattern: "Queue-Driven BFS",
        definition: `${name} demonstrates ${focus}. BFS explores nodes level by level using a FIFO queue to store the current frontier.`,
        time: "O(V + E)",
        space: "O(V)",
        points: [
          "Enqueue the start node and mark visited.",
          "Dequeue one node, then enqueue its unvisited neighbors.",
          "Queue order ensures level-by-level traversal."
        ],
        code: [
          "queue<int> q;",
          "q.push(start); visited[start] = true;",
          "while (!q.empty()) {",
          "  u = q.front(); q.pop();",
          "  for (v : adj[u]) if (!visited[v]) { visited[v]=true; q.push(v); }",
          "}",
        ],
        seed: ["A", "B", "C", "D", "E"],
      };
    }
    if (lessonId === "applications-queue") {
      return {
        title: name,
        topic: "Queue Applications",
        mode: "queue",
        pattern: "Buffer / Pipeline",
        definition: `${name} demonstrates ${focus}. Queues are used to buffer work items between producers and consumers and to preserve fair FIFO order.`,
        time: "Varies",
        space: "O(N)",
        points: [
          "Producer enqueues work at the rear.",
          "Consumer dequeues work from the front.",
          "Queue smooths bursts and decouples components."
        ],
        code: [
          "queue<Job> q;",
          "producer: q.push(job);",
          "consumer: job = q.front(); q.pop();",
        ],
        seed: ["job1", "job2", "job3"],
      };
    }
    if (lessonId === "applications-stack" || lessonId === "backtracking-stack") {
      return {
        title: name,
        topic: "Stack Applications",
        mode: "stack",
        pattern: "DFS / Backtracking",
        definition: `${name} demonstrates ${focus}. Stacks store the most recent state first, making them a natural fit for DFS and backtracking.`,
        time: "Varies",
        space: "O(depth)",
        points: [
          "Push next states/choices onto the stack.",
          "Pop to explore last-added choice first (LIFO).",
          "Dead ends naturally trigger backtracking."
        ],
        code: [
          "stack<State> st;",
          "st.push(start);",
          "while (!st.empty()) {",
          "  s = st.top(); st.pop();",
          "  for (next : expand(s)) st.push(next);",
          "}",
        ],
        seed: ["S", "A", "B", "C"],
      };
    }
    return {
      title: name,
      topic: "Applications",
      mode: "queue",
      pattern: "Real-World Pattern",
      definition: `${name} demonstrates ${focus} in a practical scenario using the appropriate structure.`,
      time: "Varies",
      space: "Varies",
      points: ["Models a real workflow", "Uses the correct access order", "Focuses on invariants"],
      code: ["// See simulation steps"],
      seed: ["A", "B", "C"],
    };
  }
  return {
    title: name,
    topic: "Stack Fundamentals",
    mode: "stack",
    pattern: "LIFO Stack",
    definition: `${name} demonstrates ${focus}. Stacks operate on Last-In-First-Out access, maintaining a single top boundary.`,
    time: "O(1) Core",
    space: "O(N)",
    points: [
      "Push places values on the top boundary.",
      "Pop removes elements from the top boundary.",
      "Peek inspects the top element without editing."
    ],
    code: ["void push(int x) { st.push(x); }", "int pop() {", "  int x = st.top();", "  st.pop();", "  return x;", "}"],
    seed: ["A", "B", "C"],
  };
}

// Generate algorithmic steps based on Lesson ID and Custom String Inputs
function generateAlgorithmSteps(lessonId: string, customInput: string): Step[] {
  const cleanInput = customInput.trim();

  // Custom Topic-Specific Simulations
  if (lessonId === "push-operation") return generatePushSteps(cleanInput);
  if (lessonId === "pop-operation") return generatePopSteps(cleanInput);
  if (lessonId === "peek-top-operation") return generatePeekSteps(cleanInput);
  if (lessonId === "isempty-isfull") return generateIsEmptyIsFullSteps(cleanInput);
  if (lessonId === "stack-arrays") return generateStackArraysSteps(cleanInput);
  if (lessonId === "stack-linked-list") return generateStackLinkedListSteps(cleanInput);
  if (lessonId === "dynamic-stack") return generateDynamicStackSteps(cleanInput);
  if (lessonId === "complexity-stack") return generateComplexityStackSteps();
  if (lessonId === "recursion-call-stack") return generateRecursionCallStackSteps();
  if (lessonId === "two-stack-one-array") return generateTwoStackOneArraySteps();
  if (lessonId === "queue-using-stack") return generateQueueUsingStackSteps();
  if (lessonId === "stack-using-queue" || lessonId === "stack-using-queue-queue") return generateStackUsingQueueSteps();
  if (lessonId === "k-queue-one-array") return generateKQueueOneArraySteps();

  if (lessonId === "enqueue-operation") return generateEnqueueSteps(cleanInput);
  if (lessonId === "dequeue-operation") return generateDequeueSteps(cleanInput);
  if (lessonId === "front-and-rear") return generateFrontRearSteps(cleanInput);
  if (lessonId === "queue-arrays") return generateQueueArraysSteps(cleanInput);
  if (lessonId === "queue-linked-list") return generateQueueLinkedListSteps(cleanInput);
  if (lessonId === "dynamic-queue") return generateDynamicQueueSteps(cleanInput);

  if (lessonId === "sliding-window-max") return generateSlidingWindowMaxSteps(cleanInput);
  if (lessonId === "trapping-rain-water") return generateTrappingRainWaterSteps(cleanInput);
  if (lessonId === "largest-rectangle-histogram") return generateLargestRectangleSteps(cleanInput);
  if (lessonId === "lru-cache-queue") return generateLRUCacheSteps();

  // Application-focused lessons (avoid falling back to generic LIFO demo)
  if (lessonId === "bfs-using-queue") {
    // Small fixed graph for BFS: A -> B,C ; B -> D,E ; C -> F ; E -> G
    const steps: Step[] = [];
    const adjacency: Record<string, string[]> = {
      A: ["B", "C"],
      B: ["D", "E"],
      C: ["F"],
      D: [],
      E: ["G"],
      F: [],
      G: [],
    };

    const start = "A";
    const queue: string[] = [start];
    const visited = new Set<string>([start]);

    steps.push({
      label: "Initialize BFS",
      message: `Start BFS from ${start}. Enqueue start node and mark visited.`,
      line: 1,
      items: [...queue],
      activeIndices: [0],
      vars: { start, visited: Array.from(visited).join(", ") },
      front: 0,
      rear: 0,
    });

    while (queue.length > 0) {
      const node = queue.shift()!;
      steps.push({
        label: `Dequeue ${node}`,
        message: `Process ${node}. Dequeue from front, then enqueue its unvisited neighbors.`,
        line: 2,
        items: [...queue],
        activeIndices: [],
        vars: { current: node, neighbors: adjacency[node].join(", ") || "none", visited: Array.from(visited).join(", ") },
        front: queue.length ? 0 : -1,
        rear: queue.length ? queue.length - 1 : -1,
      });

      for (const nb of adjacency[node]) {
        if (visited.has(nb)) continue;
        visited.add(nb);
        queue.push(nb);
        steps.push({
          label: `Enqueue ${nb}`,
          message: `Neighbor ${nb} is unvisited. Mark visited and enqueue at rear.`,
          line: 3,
          items: [...queue],
          activeIndices: [queue.length - 1],
          vars: { added: nb, visited: Array.from(visited).join(", ") },
          front: 0,
          rear: queue.length - 1,
        });
      }
    }

    steps.push({
      label: "BFS Done",
      message: `Queue is empty. BFS traversal finished.`,
      line: 4,
      items: [],
      activeIndices: [],
      vars: { visited: Array.from(visited).join(", "), status: "done" },
      front: -1,
      rear: -1,
    });
    return steps;
  }

  if (lessonId === "cpu-scheduling") {
    // Round-robin style scheduling with a fixed quantum.
    const steps: Step[] = [];
    const quantum = 2;
    type Proc = { id: string; remaining: number };
    const ready: Proc[] = [
      { id: "P1", remaining: 5 },
      { id: "P2", remaining: 3 },
      { id: "P3", remaining: 4 },
    ];

    steps.push({
      label: "Initialize Ready Queue",
      message: "Processes enter the ready queue in arrival order (FIFO).",
      line: 1,
      items: ready.map((p) => `${p.id}(${p.remaining})`),
      activeIndices: [],
      vars: { quantum, policy: "Round Robin" },
      front: 0,
      rear: ready.length - 1,
    });

    let tick = 0;
    while (ready.length > 0) {
      const proc = ready.shift()!;
      const slice = Math.min(quantum, proc.remaining);
      proc.remaining -= slice;
      tick += slice;

      steps.push({
        label: `Run ${proc.id}`,
        message: `${proc.id} runs for ${slice} ticks (quantum=${quantum}). Remaining=${proc.remaining}.`,
        line: 2,
        items: ready.map((p) => `${p.id}(${p.remaining})`),
        activeIndices: [],
        vars: { running: proc.id, slice, tick, remaining: proc.remaining },
        front: ready.length ? 0 : -1,
        rear: ready.length ? ready.length - 1 : -1,
      });

      if (proc.remaining > 0) {
        ready.push(proc);
        steps.push({
          label: `Re-enqueue ${proc.id}`,
          message: `${proc.id} not finished. Enqueue back to the rear of the ready queue.`,
          line: 3,
          items: ready.map((p) => `${p.id}(${p.remaining})`),
          activeIndices: [ready.length - 1],
          vars: { enqueued: proc.id, tick },
          front: 0,
          rear: ready.length - 1,
        });
      } else {
        steps.push({
          label: `${proc.id} Finished`,
          message: `${proc.id} completed and leaves the system.`,
          line: 4,
          items: ready.map((p) => `${p.id}(${p.remaining})`),
          activeIndices: [],
          vars: { finished: proc.id, tick },
          front: ready.length ? 0 : -1,
          rear: ready.length ? ready.length - 1 : -1,
        });
      }
    }

    steps.push({
      label: "Scheduling Done",
      message: "Ready queue empty. All processes finished.",
      line: 5,
      items: [],
      activeIndices: [],
      vars: { tick, status: "done" },
      front: -1,
      rear: -1,
    });
    return steps;
  }

  if (lessonId === "applications-stack" || lessonId === "backtracking-stack") {
    // Demonstrate stack-driven DFS/backtracking on a small decision tree.
    const steps: Step[] = [];
    const stack: string[] = [];
    const explored: string[] = [];

    steps.push({
      label: "Initialize Stack",
      message: "Use a stack to explore states (LIFO). Push the initial state.",
      line: 1,
      items: [],
      activeIndices: [],
      vars: { explored: "" },
    });

    stack.push("S");
    steps.push({
      label: "Push S",
      message: "Push start state S onto the stack.",
      line: 2,
      items: [...stack],
      activeIndices: [stack.length - 1],
      vars: { explored: explored.join(", ") || "none" },
    });

    // A tiny graph of states to backtrack: S -> A,B ; A -> C ; B -> D
    const next: Record<string, string[]> = { S: ["A", "B"], A: ["C"], B: ["D"], C: [], D: [] };

    while (stack.length > 0) {
      const cur = stack.pop()!;
      explored.push(cur);
      steps.push({
        label: `Pop ${cur}`,
        message: `Pop ${cur}. This is the next state to expand (backtracking explores last-added first).`,
        line: 3,
        items: [...stack],
        activeIndices: [],
        vars: { current: cur, explored: explored.join(", ") },
      });

      const children = next[cur] ?? [];
      if (children.length === 0) {
        steps.push({
          label: `Dead End at ${cur}`,
          message: `${cur} has no further moves. Backtrack by continuing to pop previous states.`,
          line: 4,
          items: [...stack],
          activeIndices: [],
          vars: { current: cur, explored: explored.join(", ") },
        });
        continue;
      }

      // Push children in reverse so the first child is explored next.
      for (const child of [...children].reverse()) {
        stack.push(child);
        steps.push({
          label: `Push ${child}`,
          message: `Push next option ${child} onto the stack.`,
          line: 5,
          items: [...stack],
          activeIndices: [stack.length - 1],
          vars: { current: cur, pushed: child, explored: explored.join(", ") },
        });
      }
    }

    steps.push({
      label: "Exploration Done",
      message: "Stack is empty. All reachable states explored in a backtracking/DFS order.",
      line: 6,
      items: [],
      activeIndices: [],
      vars: { explored: explored.join(", "), status: "done" },
    });
    return steps;
  }

  if (lessonId === "applications-queue") {
    // Demonstrate queue as a buffer between producer and consumer.
    const steps: Step[] = [];
    const queue: string[] = [];
    const produced = ["job1", "job2", "job3"];
    const consumed: string[] = [];

    steps.push({
      label: "Initialize Buffer",
      message: "Queue buffers work items: producer enqueues at rear, consumer dequeues from front.",
      line: 1,
      items: [],
      activeIndices: [],
      vars: { produced: produced.join(", "), consumed: "" },
      front: -1,
      rear: -1,
    });

    for (const job of produced) {
      queue.push(job);
      steps.push({
        label: `Enqueue ${job}`,
        message: `Producer enqueues ${job} at the rear.`,
        line: 2,
        items: [...queue],
        activeIndices: [queue.length - 1],
        vars: { produced: produced.join(", "), consumed: consumed.join(", ") || "none" },
        front: 0,
        rear: queue.length - 1,
      });
    }

    while (queue.length > 0) {
      const job = queue.shift()!;
      consumed.push(job);
      steps.push({
        label: `Dequeue ${job}`,
        message: `Consumer dequeues ${job} from the front and processes it.`,
        line: 3,
        items: [...queue],
        activeIndices: [],
        vars: { consumed: consumed.join(", ") },
        front: queue.length ? 0 : -1,
        rear: queue.length ? queue.length - 1 : -1,
      });
    }

    steps.push({
      label: "Buffer Empty",
      message: "All jobs processed. Queue is empty.",
      line: 4,
      items: [],
      activeIndices: [],
      vars: { consumed: consumed.join(", "), status: "done" },
      front: -1,
      rear: -1,
    });
    return steps;
  }

  if (lessonId === "circular-tour") {
    // Gas Station / Circular Tour greedy trace.
    const steps: Step[] = [];
    const gas = [4, 6, 7, 4];
    const cost = [6, 5, 3, 5];
    let start = 0;
    let tank = 0;
    let total = 0;

    steps.push({
      label: "Initialize Tour",
      message: "Track total surplus and current tank. Reset start when tank becomes negative.",
      line: 1,
      items: [],
      activeIndices: [],
      vars: { gas: gas.join(","), cost: cost.join(","), start, tank, total },
    });

    for (let i = 0; i < gas.length; i++) {
      const diff = gas[i] - cost[i];
      tank += diff;
      total += diff;
      steps.push({
        label: `Visit ${i}`,
        message: `At station ${i}: tank += gas[i]-cost[i] = ${diff}. tank=${tank}.`,
        line: 2,
        items: [],
        activeIndices: [],
        vars: { i, diff, tank, total, start },
      });

      if (tank < 0) {
        steps.push({
          label: "Reset Start",
          message: `tank < 0, so any start <= ${i} fails. Set start = ${i + 1} and reset tank to 0.`,
          line: 3,
          items: [],
          activeIndices: [],
          vars: { i, tank, total, start: i + 1 },
        });
        start = i + 1;
        tank = 0;
      }
    }

    const possible = total >= 0 && start < gas.length;
    steps.push({
      label: possible ? "Tour Possible" : "Tour Impossible",
      message: possible ? `Total surplus >= 0, start index ${start} works.` : "Total surplus < 0, no solution exists.",
      line: 4,
      items: [],
      activeIndices: [],
      vars: { total, start, status: possible ? "possible" : "impossible" },
    });
    return steps;
  }

  // 1. Parentheses Matching
  if (lessonId.includes("parentheses") || lessonId.includes("bracket")) {
    const expr = cleanInput || "([]{})";
    const chars = expr.split("");
    const steps: Step[] = [];
    const stack: string[] = [];

    steps.push({
      label: "Initialize Stack",
      message: `Start with an empty stack. We will scan "${expr}" from left to right.`,
      line: 1,
      items: [],
      activeIndices: [],
      vars: { size: 0, index: "N/A", current: "N/A" },
      expression: chars,
      exprIndex: -1
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const isOpen = c === '(' || c === '[' || c === '{';

      if (isOpen) {
        stack.push(c);
        steps.push({
          label: `Push '${c}'`,
          message: `Encountered open bracket '${c}'. Push it onto the stack.`,
          line: 4,
          items: [...stack],
          activeIndices: [stack.length - 1],
          vars: { size: stack.length, index: i, current: c },
          expression: chars,
          exprIndex: i
        });
      } else {
        if (stack.length === 0) {
          steps.push({
            label: "Underflow Error",
            message: `Scanned closing bracket '${c}' but stack is empty! No matching open partner.`,
            line: 6,
            items: [],
            activeIndices: [],
            vars: { size: 0, index: i, current: c, status: "Invalid" },
            expression: chars,
            exprIndex: i
          });
          return steps;
        }

        const top = stack[stack.length - 1];
        const matches = (c === ')' && top === '(') || 
                        (c === ']' && top === '[') || 
                        (c === '}' && top === '{');

        steps.push({
          label: "Inspect Match",
          message: `Closing bracket '${c}' requires matching '${top}' at top of stack.`,
          line: 7,
          items: [...stack],
          activeIndices: [stack.length - 1],
          vars: { size: stack.length, index: i, current: c, top, matches: matches ? "Yes" : "No" },
          expression: chars,
          exprIndex: i
        });

        if (matches) {
          stack.pop();
          steps.push({
            label: "Pop Partner",
            message: `Brackets match perfectly! Pop '${top}' from stack.`,
            line: 8,
            items: [...stack],
            activeIndices: [],
            vars: { size: stack.length, index: i, current: c, status: "Matched" },
            expression: chars,
            exprIndex: i
          });
        } else {
          steps.push({
            label: "Mismatch Found",
            message: `Bracket '${c}' does not match top of stack '${top}'. Termination triggered.`,
            line: 9,
            items: [...stack],
            activeIndices: [stack.length - 1],
            vars: { size: stack.length, index: i, current: c, status: "Invalid Mismatch" },
            expression: chars,
            exprIndex: i
          });
          return steps;
        }
      }
    }

    const valid = stack.length === 0;
    steps.push({
      label: valid ? "Finished (Valid)" : "Finished (Invalid)",
      message: valid 
        ? "All elements scanned and stack is empty. Brackets are balanced and valid!"
        : `Scanning completed but stack retains unmatched nodes: [${stack.join(", ")}].`,
      line: 11,
      items: [...stack],
      activeIndices: [],
      vars: { size: stack.length, status: valid ? "Balanced" : "Unbalanced" },
      expression: chars,
      exprIndex: chars.length
    });

    return steps;
  }

  // 2. Next Greater Element
  if (lessonId.includes("greater") || lessonId.includes("smaller") || lessonId.includes("monotonic") || lessonId.includes("span")) {
    const listStr = cleanInput || "4, 2, 7, 3, 9";
    const nums = listStr.split(",").map(x => Number(x.trim())).filter(x => !isNaN(x));
    
    if (nums.length === 0) return [];
    const steps: Step[] = [];
    const stack: number[] = [];
    const res: number[] = Array(nums.length).fill(-1);

    steps.push({
      label: "Initialize Monotonic",
      message: "Create a result buffer filled with -1. An empty monotonic stack tracks indices.",
      line: 2,
      items: [],
      activeIndices: [],
      vars: { index: "N/A", current: "N/A" },
      originalArray: nums,
      currentIndex: -1,
      resultArray: [...res]
    });

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];

      steps.push({
        label: `Scan Arr[${i}]`,
        message: `Current index ${i} (value ${val}). Compare it with indices in the monotonic stack.`,
        line: 4,
        items: stack.map(idx => `${nums[idx]} (idx:${idx})`),
        activeIndices: [],
        vars: { index: i, current: val, stack_top: stack.length ? nums[stack[stack.length - 1]] : "Empty" },
        originalArray: nums,
        currentIndex: i,
        resultArray: [...res]
      });

      while (stack.length > 0 && nums[stack[stack.length - 1]] < val) {
        const topIdx = stack[stack.length - 1];

        steps.push({
          label: "Pop Smaller Node",
          message: `Current value ${val} is larger than top of stack ${nums[topIdx]}. Pop index ${topIdx} and record ${val} as its next greater.`,
          line: 5,
          items: stack.map(idx => `${nums[idx]} (idx:${idx})`),
          activeIndices: [stack.length - 1],
          vars: { index: i, current: val, popped_idx: topIdx, popped_val: nums[topIdx], next_greater: val },
          originalArray: nums,
          currentIndex: i,
          resultArray: [...res]
        });

        res[topIdx] = val;
        stack.pop();

        steps.push({
          label: "Update Buffer",
          message: `Result at index ${topIdx} set to ${val}.`,
          line: 7,
          items: stack.map(idx => `${nums[idx]} (idx:${idx})`),
          activeIndices: [],
          vars: { index: i, current: val },
          originalArray: nums,
          currentIndex: i,
          resultArray: [...res]
        });
      }

      stack.push(i);
      steps.push({
        label: "Push index",
        message: `Push current index ${i} (value ${val}) onto the stack.`,
        line: 9,
        items: stack.map(idx => `${nums[idx]} (idx:${idx})`),
        activeIndices: [stack.length - 1],
        vars: { index: i, current: val, pushed: i },
        originalArray: nums,
        currentIndex: i,
        resultArray: [...res]
      });
    }

    steps.push({
      label: "Trace Complete",
      message: "All items evaluated. Unpopped items in the stack have no greater element to their right, retaining -1.",
      line: 11,
      items: stack.map(idx => `${nums[idx]} (idx:${idx})`),
      activeIndices: [],
      vars: { status: "Done" },
      originalArray: nums,
      currentIndex: nums.length,
      resultArray: [...res]
    });

    return steps;
  }

  // 3. Infix / Prefix / Postfix Operations
  if (lessonId === "evaluate-postfix") {
    return generateEvaluatePostfixSteps(cleanInput);
  }
  if (lessonId === "evaluate-prefix") {
    return generateEvaluatePrefixSteps(cleanInput);
  }
  if (lessonId === "infix-to-prefix") {
    return generateInfixToPrefixSteps(cleanInput);
  }
  if (lessonId === "prefix-to-infix") {
    return generatePrefixToInfixSteps(cleanInput);
  }
  if (lessonId === "postfix-to-infix") {
    return generatePostfixToInfixSteps(cleanInput);
  }
  if (lessonId === "infix-to-postfix" || lessonId.includes("postfix") || lessonId.includes("prefix") || lessonId.includes("infix")) {
    return generateInfixToPostfixSteps(cleanInput);
  }

  // 4. Min Stack
  if (lessonId.includes("min-stack") || lessonId.includes("special-stack")) {
    return generateMinStackSteps(cleanInput);
  }

  // 5. Circular Queue
  if (lessonId.includes("circular")) {
    return generateCircularQueueSteps(cleanInput);
  }

  const topic = LESSON_TOPIC[lessonId] ?? "stack";
  if (topic === "queue" || lessonId.includes("queue") || lessonId.includes("fifo") || lessonId.includes("enqueue") || lessonId.includes("dequeue")) {
    return generateQueueSteps(cleanInput);
  }
  if (topic === "deque" || lessonId.includes("deque")) {
    return generateDequeSteps(cleanInput);
  }
  if (topic === "priority" || lessonId.includes("priority")) {
    return generatePriorityQueueSteps(cleanInput);
  }

  // Fallback / Basic stack demonstration
  return generateFallbackStackSteps(cleanInput);
}

function generateQueueSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["A", "B", "C"];
  const items: string[] = [];

  steps.push({
    label: "Initialize Queue",
    message: "Create an empty FIFO Queue. Insertions occur at the rear, removals at the front.",
    line: 0,
    items: [],
    activeIndices: [],
    vars: { size: 0, front: -1, rear: -1 }
  });

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    steps.push({
      label: `Enqueue(${val})`,
      message: i === 0
        ? `Insert element '${val}' at the rear. Front and rear both point to index 0.`
        : `Insert element '${val}' at the rear. Rear advances to index ${i}.`,
      line: 1,
      items: [...items],
      activeIndices: [i],
      vars: { size: items.length, front: 0, rear: i, action: "enqueue" }
    });
  }

  if (items.length > 0) {
    const popped = items.shift()!;
    steps.push({
      label: "Dequeue()",
      message: `Remove the element at the front. Element '${popped}' (First-In) is removed. Front advances to index 1.`,
      line: 2,
      items: [...items],
      activeIndices: [],
      vars: { popped, size: items.length, front: 1, rear: values.length - 1, action: "dequeue" }
    });
  }

  return steps;
}

function generateDequeSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["A", "B", "C"];
  const items: string[] = [];

  steps.push({
    label: "Initialize Deque",
    message: "Create an empty Double-Ended Queue (Deque). Operations are allowed at both ends.",
    line: 0,
    items: [],
    activeIndices: [],
    vars: { size: 0 }
  });

  if (values.length > 0) {
    const val1 = values[0];
    items.push(val1);
    steps.push({
      label: `PushBack(${val1})`,
      message: `Insert element '${val1}' at the rear of the deque.`,
      line: 1,
      items: [...items],
      activeIndices: [0],
      vars: { size: items.length }
    });
  }

  if (values.length > 1) {
    const val2 = values[1];
    items.unshift(val2);
    steps.push({
      label: `PushFront(${val2})`,
      message: `Insert element '${val2}' at the front of the deque. The sequence becomes [${items.join(", ")}].`,
      line: 1,
      items: [...items],
      activeIndices: [0],
      vars: { size: items.length }
    });
  }

  if (values.length > 2) {
    const val3 = values[2];
    items.push(val3);
    steps.push({
      label: `PushBack(${val3})`,
      message: `Insert element '${val3}' at the rear of the deque. The sequence becomes [${items.join(", ")}].`,
      line: 1,
      items: [...items],
      activeIndices: [items.length - 1],
      vars: { size: items.length }
    });
  }

  if (items.length > 0) {
    const poppedF = items.shift()!;
    steps.push({
      label: "PopFront()",
      message: `Remove element '${poppedF}' from the front boundary. Sequence becomes [${items.join(", ")}].`,
      line: 2,
      items: [...items],
      activeIndices: [],
      vars: { popped: poppedF, size: items.length }
    });
  }

  if (items.length > 0) {
    const poppedB = items.pop()!;
    steps.push({
      label: "PopBack()",
      message: `Remove element '${poppedB}' from the rear boundary. Sequence becomes [${items.join(", ")}].`,
      line: 2,
      items: [...items],
      activeIndices: [],
      vars: { popped: poppedB, size: items.length }
    });
  }

  return steps;
}

// ==========================================
// TOPIC-SPECIFIC STEP GENERATORS
// ==========================================

function generatePushSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["10", "20", "30", "40", "50"];
  const cap = Math.max(5, values.length);
  const items: string[] = [];
  
  steps.push({
    label: "Initialize Stack",
    message: `Create an empty stack with capacity = ${cap}. Set top = -1.`,
    line: 0,
    items: [],
    activeIndices: [],
    vars: { top: -1, capacity: cap, size: 0 }
  });
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    steps.push({
      label: `Push(${val})`,
      message: `Check if full (top == capacity - 1). It isn't. Increment top to ${i}, and write ${val} at arr[${i}].`,
      line: 1,
      items: [...items],
      activeIndices: [items.length - 1],
      vars: { top: i, capacity: cap, size: items.length, pushed: val }
    });
  }
  
  steps.push({
    label: "Push(Overflow Element) -> Overflow",
    message: `Attempt to push a new element. Check if full (top == ${cap - 1}, which equals capacity - 1). Stack Overflow Error! Push aborted.`,
    line: 2,
    items: [...items],
    activeIndices: [],
    vars: { top: cap - 1, capacity: cap, size: items.length, error: "Stack Overflow" }
  });
  
  return steps;
}

function generatePopSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const items = parsed.length > 0 ? parsed : ["10", "20", "30"];
  
  steps.push({
    label: "Initialize Stack",
    message: `Create a stack pre-loaded with elements [${items.join(", ")}]. Current top = ${items.length - 1}.`,
    line: 0,
    items: [...items],
    activeIndices: [],
    vars: { top: items.length - 1, size: items.length }
  });
  
  while (items.length > 0) {
    const popped = items.pop()!;
    const newTop = items.length - 1;
    steps.push({
      label: "Pop()",
      message: `Check if empty (top < 0). It isn't. Read top element (${popped}), decrement top to ${newTop}, and return ${popped}.`,
      line: 1,
      items: [...items],
      activeIndices: [],
      vars: { top: newTop, size: items.length, popped }
    });
  }
  
  steps.push({
    label: "Pop() -> Underflow",
    message: "Attempt to pop from an empty stack. Check if empty (top == -1). Stack Underflow Error! Pop aborted.",
    line: 2,
    items: [],
    activeIndices: [],
    vars: { top: -1, size: 0, error: "Stack Underflow" }
  });
  
  return steps;
}

function generatePeekSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const items = parsed.length > 0 ? parsed : ["10", "20", "30"];
  
  steps.push({
    label: "Initialize Stack",
    message: `Create a stack pre-loaded with elements [${items.join(", ")}]. Current top = ${items.length - 1}.`,
    line: 0,
    items: [...items],
    activeIndices: [],
    vars: { top: items.length - 1, size: items.length }
  });
  
  const peakVal = items.length > 0 ? items[items.length - 1] : "N/A";
  steps.push({
    label: "Peek()",
    message: `Read the top element without removing it. top = ${items.length - 1}, arr[${items.length - 1}] = ${peakVal}. Return ${peakVal}. Stack contents are unchanged.`,
    line: 1,
    items: [...items],
    activeIndices: items.length > 0 ? [items.length - 1] : [],
    vars: { top: items.length - 1, size: items.length, peeked: peakVal }
  });
  
  const pushVal = "40";
  items.push(pushVal);
  steps.push({
    label: `Push(${pushVal})`,
    message: `Push ${pushVal} onto the stack. top increments to ${items.length - 1}, arr[${items.length - 1}] = ${pushVal}.`,
    line: 2,
    items: [...items],
    activeIndices: [items.length - 1],
    vars: { top: items.length - 1, size: items.length, pushed: pushVal }
  });
  
  steps.push({
    label: "Peek()",
    message: `Peek again. Current top = ${items.length - 1}, arr[${items.length - 1}] = ${pushVal}. Return ${pushVal}. Stack remains unchanged.`,
    line: 1,
    items: [...items],
    activeIndices: [items.length - 1],
    vars: { top: items.length - 1, size: items.length, peeked: pushVal }
  });
  
  return steps;
}

function generateIsEmptyIsFullSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["10", "20", "30"];
  const cap = values.length;
  const items: string[] = [];
  
  steps.push({
    label: "Initialize empty Stack",
    message: `Create empty stack of capacity = ${cap}. Set top = -1.`,
    line: 0,
    items: [],
    activeIndices: [],
    vars: { top: -1, capacity: cap, isEmpty: "true", isFull: "false" }
  });
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    const fullStatus = i === cap - 1 ? "true" : "false";
    steps.push({
      label: `Push(${val})`,
      message: `Push ${val}. Now top = ${i}. isEmpty is now false since top >= 0.`,
      line: 1,
      items: [...items],
      activeIndices: [i],
      vars: { top: i, capacity: cap, isEmpty: "false", isFull: fullStatus }
    });
  }
  
  return steps;
}

function generateStackArraysSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["15", "25"];
  const cap = Math.max(5, values.length);
  const items: string[] = [];
  
  steps.push({
    label: "Array Allocation",
    message: `Allocate a contiguous memory array of size ${cap}. Initialize top pointer to -1.`,
    line: 1,
    items: [],
    activeIndices: [],
    vars: { top: -1, "arr[0..4]": `[${Array(cap).fill("?").join(", ")}]`, capacity: cap }
  });
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    const layout = `[${[...items, ...Array(cap - items.length).fill("?")].join(", ")}]`;
    steps.push({
      label: `arr[++top] = ${val}`,
      message: `Increment top to ${i}, write ${val} at arr[${i}]. Memory layout updated.`,
      line: 2,
      items: [...items],
      activeIndices: [i],
      vars: { top: i, "arr[0..4]": layout }
    });
  }
  
  if (items.length > 0) {
    const popped = items.pop()!;
    const layout = `[${[...items, `(${popped})`, ...Array(cap - items.length - 1).fill("?")].join(", ")}]`;
    steps.push({
      label: "val = arr[top--]",
      message: `Read top index ${items.length} (value ${popped}), decrement top to ${items.length - 1}. Slot is now logically empty.`,
      line: 3,
      items: [...items],
      activeIndices: [],
      vars: { top: items.length - 1, "arr[0..4]": layout, popped }
    });
  }
  
  return steps;
}

function generateStackLinkedListSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["10", "20", "30"];
  const items: string[] = [];
  
  steps.push({
    label: "Initialize Stack Pointer",
    message: "Define a pointer 'top' initialized to NULL, indicating an empty linked list stack.",
    line: 1,
    items: [],
    activeIndices: [],
    vars: { top: "NULL" }
  });
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    const chain = items.slice().reverse().map(x => `Node(${x})`).join(" -> ") + " -> NULL";
    steps.push({
      label: `Push(${val})`,
      message: `Create Node(${val}). Set Node(${val})->next = top, and update top pointer = Node(${val}).`,
      line: 2,
      items: [...items],
      activeIndices: [i],
      vars: { top: chain }
    });
  }
  
  if (items.length > 0) {
    const popped = items.pop()!;
    const chain = items.slice().reverse().map(x => `Node(${x})`).join(" -> ") + (items.length > 0 ? " -> NULL" : "NULL");
    steps.push({
      label: "Pop()",
      message: `Set temp = top. Update top = top->next. Return temp->data (${popped}) and free memory.`,
      line: 3,
      items: [...items],
      activeIndices: [],
      vars: { top: chain, popped }
    });
  }
  
  return steps;
}

function generateDynamicStackSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["10", "20", "30", "40"];
  let cap = 2;
  const items: string[] = [];
  
  steps.push({
    label: "Initialize Array",
    message: "Allocate array of capacity = 2. Set top = -1.",
    line: 1,
    items: [],
    activeIndices: [],
    vars: { top: -1, capacity: cap, size: 0 }
  });
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    let msg = `Push ${val}. Stack: [${[...items, val].join(", ")}], size = ${items.length + 1}.`;
    let label = `Push(${val})`;
    
    if (items.length >= cap) {
      cap *= 2;
      label = `Resize & Push(${val})`;
      msg = `Stack full! Allocate new array of size ${cap} (double capacity). Copy existing elements, and push ${val}.`;
    }
    
    items.push(val);
    steps.push({
      label,
      message: msg,
      line: 2,
      items: [...items],
      activeIndices: [items.length - 1],
      vars: { top: items.length - 1, capacity: cap, size: items.length }
    });
  }
  
  return steps;
}

function generateComplexityStackSteps(): Step[] {
  const steps: Step[] = [];
  steps.push({
    label: "Push Complexity: O(1)",
    message: "Push only writes to arr[top+1]. No shifts are required, resulting in O(1) constant-time complexity.",
    line: 1,
    items: ["10"],
    activeIndices: [0],
    vars: { operation: "Push", time: "O(1)", space: "O(1) auxiliary" }
  });
  steps.push({
    label: "Pop Complexity: O(1)",
    message: "Pop simply decrements top pointer and returns value. Constant-time O(1) operation.",
    line: 2,
    items: [],
    activeIndices: [],
    vars: { operation: "Pop", time: "O(1)", space: "O(1) auxiliary" }
  });
  steps.push({
    label: "Peek Complexity: O(1)",
    message: "Peek directly reads the memory index arr[top]. Instant lookup, O(1) time.",
    line: 3,
    items: ["20"],
    activeIndices: [0],
    vars: { operation: "Peek", time: "O(1)", space: "O(1) auxiliary" }
  });
  steps.push({
    label: "Space Complexity: O(N)",
    message: "For storing N elements, the stack occupies N storage cells. Linear space complexity.",
    line: 4,
    items: ["20", "30", "40"],
    activeIndices: [],
    vars: { operation: "Storage", time: "N/A", space: "O(N) total" }
  });
  return steps;
}

function generateRecursionCallStackSteps(): Step[] {
  const steps: Step[] = [];
  
  steps.push({
    label: "Call factorial(3)",
    message: "Invoke factorial(3). Push activation record fact(3) onto the system call stack. It requires fact(2).",
    line: 1,
    items: ["fact(3)"],
    activeIndices: [0],
    vars: { stack_depth: 1, current_frame: "fact(3)", variables: "n = 3" }
  });
  
  steps.push({
    label: "Call factorial(2)",
    message: "Invoke factorial(2). Push fact(2) onto the stack. It requires fact(1).",
    line: 2,
    items: ["fact(3)", "fact(2)"],
    activeIndices: [1],
    vars: { stack_depth: 2, current_frame: "fact(2)", variables: "n = 2" }
  });
  
  steps.push({
    label: "Call factorial(1)",
    message: "Invoke factorial(1). Push fact(1) onto the stack. Base case reached (n <= 1).",
    line: 3,
    items: ["fact(3)", "fact(2)", "fact(1)"],
    activeIndices: [2],
    vars: { stack_depth: 3, current_frame: "fact(1)", variables: "n = 1", returns: 1 }
  });
  
  steps.push({
    label: "Return fact(1) = 1",
    message: "fact(1) completes. Pop its frame from the call stack and return 1 to fact(2).",
    line: 4,
    items: ["fact(3)", "fact(2)"],
    activeIndices: [1],
    vars: { stack_depth: 2, current_frame: "fact(2)", returned_val: 1 }
  });
  
  steps.push({
    label: "Return fact(2) = 2 * 1 = 2",
    message: "fact(2) completes. Pop its frame and return 2 to fact(3).",
    line: 5,
    items: ["fact(3)"],
    activeIndices: [0],
    vars: { stack_depth: 1, current_frame: "fact(3)", returned_val: 2 }
  });
  
  steps.push({
    label: "Return fact(3) = 3 * 2 = 6",
    message: "fact(3) completes. Pop the final frame. Return answer 6.",
    line: 6,
    items: [],
    activeIndices: [],
    vars: { stack_depth: 0, final_answer: 6 }
  });
  
  return steps;
}

function generateTwoStackOneArraySteps(): Step[] {
  const steps: Step[] = [];
  const cap = 6;
  
  steps.push({
    label: "Initialize Array",
    message: "Allocate a shared array of size 6. Stack 1 grows left-to-right (top1 = -1). Stack 2 grows right-to-left (top2 = 6).",
    line: 1,
    items: [],
    activeIndices: [],
    vars: { top1: -1, top2: 6, array: "[?, ?, ?, ?, ?, ?]" }
  });
  
  steps.push({
    label: "Push Stack 1 (10)",
    message: "Increment top1 to 0 and write 10 at index 0.",
    line: 2,
    items: ["10"],
    activeIndices: [0],
    vars: { top1: 0, top2: 6, array: "[10, ?, ?, ?, ?, ?]" }
  });
  
  steps.push({
    label: "Push Stack 2 (99)",
    message: "Decrement top2 to 5 and write 99 at index 5.",
    line: 3,
    items: ["10", "99"],
    activeIndices: [1],
    vars: { top1: 0, top2: 5, array: "[10, ?, ?, ?, ?, 99]" }
  });
  
  steps.push({
    label: "Push Stack 1 (20)",
    message: "Increment top1 to 1 and write 20.",
    line: 2,
    items: ["10", "20", "99"],
    activeIndices: [1],
    vars: { top1: 1, top2: 5, array: "[10, 20, ?, ?, ?, 99]" }
  });
  
  steps.push({
    label: "Push Stack 2 (88)",
    message: "Decrement top2 to 4 and write 88.",
    line: 3,
    items: ["10", "20", "88", "99"],
    activeIndices: [2],
    vars: { top1: 1, top2: 4, array: "[10, 20, ?, ?, 88, 99]" }
  });
  
  steps.push({
    label: "Push Stack 1 (30)",
    message: "Increment top1 to 2 and write 30.",
    line: 2,
    items: ["10", "20", "30", "88", "99"],
    activeIndices: [2],
    vars: { top1: 2, top2: 4, array: "[10, 20, 30, ?, 88, 99]" }
  });
  
  steps.push({
    label: "Push Stack 2 (77)",
    message: "Decrement top2 to 3 and write 77. Array is now completely full.",
    line: 3,
    items: ["10", "20", "30", "77", "88", "99"],
    activeIndices: [3],
    vars: { top1: 2, top2: 3, array: "[10, 20, 30, 77, 88, 99]" }
  });
  
  steps.push({
    label: "Push Stack 1 -> Overflow",
    message: "Try to push onto Stack 1. Check if top1 >= top2 - 1 (2 >= 2). It is! The two pointers have met. Shared Array Overflow!",
    line: 4,
    items: ["10", "20", "30", "77", "88", "99"],
    activeIndices: [],
    vars: { top1: 2, top2: 3, error: "Array Overflow" }
  });
  
  return steps;
}

function generateQueueUsingStackSteps(): Step[] {
  const steps: Step[] = [];
  const inSt: string[] = [];
  const outSt: string[] = [];
  
  steps.push({
    label: "Initialize Dual Stacks",
    message: "Initialize 'inStack' for enqueuing and 'outStack' for dequeuing. This represents a FIFO queue.",
    line: 1,
    items: [],
    activeIndices: [],
    vars: { inStack: "[]", outStack: "[]" }
  });
  
  inSt.push("10");
  steps.push({
    label: "Enqueue(10)",
    message: "Push 10 onto inStack. inStack is now [10].",
    line: 2,
    items: ["10"],
    activeIndices: [0],
    vars: { inStack: "[10]", outStack: "[]" }
  });
  
  inSt.push("20");
  steps.push({
    label: "Enqueue(20)",
    message: "Push 20 onto inStack. inStack is now [10, 20].",
    line: 2,
    items: ["10", "20"],
    activeIndices: [1],
    vars: { inStack: "[10, 20]", outStack: "[]" }
  });
  
  steps.push({
    label: "Dequeue() -> Shift Stacks",
    message: "Dequeue requested. outStack is empty! Pop all elements from inStack and push them onto outStack to reverse their order.",
    line: 3,
    items: [],
    activeIndices: [],
    vars: { inStack: "[]", outStack: "[20, 10]" }
  });
  
  steps.push({
    label: "Dequeue() -> Pop outStack",
    message: "Pop the top of outStack (10) and return it. outStack is now [20]. FIFO order is perfectly preserved!",
    line: 4,
    items: [],
    activeIndices: [],
    vars: { inStack: "[]", outStack: "[20]", dequeued: "10" }
  });
  
  return steps;
}

function generateStackUsingQueueSteps(): Step[] {
  const steps: Step[] = [];
  const q1: string[] = [];
  
  steps.push({
    label: "Initialize Queues",
    message: "Initialize a primary queue (q1) and helper queue (q2) to simulate LIFO behavior using FIFO primitives.",
    line: 1,
    items: [],
    activeIndices: [],
    vars: { q1: "[]", q2: "[]" }
  });
  
  q1.push("10");
  steps.push({
    label: "Push(10)",
    message: "q1 is empty. Enqueue 10. q1: [10].",
    line: 2,
    items: ["10"],
    activeIndices: [0],
    vars: { q1: "[10]", q2: "[]" }
  });
  
  steps.push({
    label: "Push(20) -> Insert and Rotate",
    message: "Enqueue 20 into q2. Dequeue all elements of q1 (10) and enqueue into q2. Swap names. q1 becomes [20, 10].",
    line: 3,
    items: ["20", "10"],
    activeIndices: [0],
    vars: { q1: "[20, 10]", q2: "[]", top: 20 }
  });
  
  steps.push({
    label: "Pop()",
    message: "LIFO Pop requested. Simply dequeue the front of q1 (20). Value 20 is successfully popped first!",
    line: 4,
    items: ["10"],
    activeIndices: [],
    vars: { q1: "[10]", q2: "[]", popped: 20 }
  });
  
  return steps;
}

function generateKQueueOneArraySteps(): Step[] {
  const steps: Step[] = [];
  
  steps.push({
    label: "Initialize K Queues",
    message: "Allocate a shared array of size 6, plus front[] and rear[] tracking arrays. Initialize a free list linked chain.",
    line: 1,
    items: [],
    activeIndices: [],
    vars: { front: "[-1, -1]", rear: "[-1, -1]", free: 0, next: "[1, 2, 3, 4, 5, -1]" }
  });
  
  steps.push({
    label: "Enqueue Queue 0 (A)",
    message: "Get index from free list (0). Set front[0]=0, rear[0]=0. next[0] holds next free index (1). Write 'A' to arr[0].",
    line: 2,
    items: ["A"],
    activeIndices: [0],
    vars: { front: "[0, -1]", rear: "[0, -1]", free: 1, array: "['A', ?, ?, ?, ?, ?]" }
  });
  
  steps.push({
    label: "Enqueue Queue 1 (X)",
    message: "Get index from free list (1). Set front[1]=1, rear[1]=1. next[1] holds next free index (2). Write 'X' to arr[1].",
    line: 3,
    items: ["A", "X"],
    activeIndices: [1],
    vars: { front: "[0, 1]", rear: "[0, 1]", free: 2, array: "['A', 'X', ?, ?, ?, ?]" }
  });
  
  steps.push({
    label: "Enqueue Queue 0 (B)",
    message: "Get index from free list (2). Update rear[0] link: next[rear[0]] = 2. Set rear[0]=2. Write 'B' to arr[2].",
    line: 2,
    items: ["A", "X", "B"],
    activeIndices: [2],
    vars: { front: "[0, 1]", rear: "[2, 1]", free: 3, array: "['A', 'X', 'B', ?, ?, ?]" }
  });
  
  return steps;
}

function generateEnqueueSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["10", "20", "30", "40", "50"];
  const cap = Math.max(5, values.length);
  const items: string[] = [];
  
  steps.push({
    label: "Initialize Queue",
    message: `Create an empty queue of capacity = ${cap}. Set front = -1, rear = -1.`,
    line: 0,
    items: [],
    activeIndices: [],
    vars: { front: -1, rear: -1, size: 0, capacity: cap },
    front: -1,
    rear: -1
  });
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    const isFirst = i === 0;
    steps.push({
      label: `Enqueue(${val})`,
      message: isFirst 
        ? `First element enqueued! Set front = 0, rear = 0, and write ${val} at arr[0].`
        : `Increment rear pointer to ${i}, and write ${val} at arr[${i}].`,
      line: 1,
      items: [...items],
      activeIndices: [items.length - 1],
      vars: { front: 0, rear: i, size: items.length, enqueued: val },
      front: 0,
      rear: i
    });
  }
  
  steps.push({
    label: "Enqueue(Overflow Element) -> Overflow",
    message: `Attempt to enqueue a new element. Check if full (rear == capacity - 1). Queue Overflow Error! Enqueue aborted.`,
    line: 2,
    items: [...items],
    activeIndices: [],
    vars: { front: 0, rear: cap - 1, size: items.length, error: "Queue Overflow" },
    front: 0,
    rear: cap - 1
  });
  
  return steps;
}

function generateDequeueSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const items = parsed.length > 0 ? parsed : ["10", "20", "30"];
  
  steps.push({
    label: "Initialize Queue",
    message: `Create a queue pre-loaded with elements [${items.join(", ")}]. Set front = 0, rear = ${items.length - 1}.`,
    line: 0,
    items: [...items],
    activeIndices: [],
    vars: { front: 0, rear: items.length - 1, size: items.length },
    front: 0,
    rear: items.length - 1
  });
  
  let currentFront = 0;
  const originalCount = items.length;
  for (let i = 0; i < originalCount; i++) {
    const val = items.shift()!;
    currentFront++;
    const isEmpty = items.length === 0;
    steps.push({
      label: isEmpty ? "Dequeue() -> Queue Empty" : "Dequeue()",
      message: isEmpty 
        ? `Read front element (${val}). Since front == rear, this was the last element! Reset front = -1, rear = -1.`
        : `Check if empty. It isn't. Read front element (${val}), increment front to ${currentFront}, and return ${val}.`,
      line: isEmpty ? 2 : 1,
      items: [...items],
      activeIndices: [],
      vars: { 
        front: isEmpty ? -1 : currentFront, 
        rear: isEmpty ? -1 : originalCount - 1, 
        size: items.length, 
        dequeued: val 
      },
      front: isEmpty ? -1 : currentFront,
      rear: isEmpty ? -1 : originalCount - 1
    });
  }
  
  steps.push({
    label: "Dequeue() -> Underflow",
    message: "Attempt to dequeue from an empty queue. Check if empty (front == -1). Queue Underflow Error!",
    line: 3,
    items: [],
    activeIndices: [],
    vars: { front: -1, rear: -1, error: "Queue Underflow" },
    front: -1,
    rear: -1
  });
  
  return steps;
}

function generateFrontRearSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["15", "25", "35"];
  const items: string[] = [];
  
  steps.push({
    label: "Initialize Queue",
    message: "An empty queue has no elements. Both front and rear pointers point to -1.",
    line: 0,
    items: [],
    activeIndices: [],
    vars: { front: -1, rear: -1 },
    front: -1,
    rear: -1
  });
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    const msg = i === 0 
      ? `First element enqueued. Both pointers are set to index 0. front = 0, rear = 0.`
      : `Only rear pointer increments. front stays at 0, rear increments to ${i}.`;
    steps.push({
      label: `Enqueue(${val})`,
      message: msg,
      line: 1,
      items: [...items],
      activeIndices: [i],
      vars: { front: 0, rear: i },
      front: 0,
      rear: i
    });
  }
  
  if (items.length > 0) {
    items.shift();
    steps.push({
      label: "Dequeue()",
      message: `Only front pointer increments. front = 1, rear = ${items.length}. Index 0 is now inactive.`,
      line: 2,
      items: [...items],
      activeIndices: [],
      vars: { front: 1, rear: items.length },
      front: 0,
      rear: items.length - 1
    });
  }
  
  return steps;
}

function generateQueueArraysSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["10", "20"];
  const cap = Math.max(5, values.length);
  const items: string[] = [];
  
  steps.push({
    label: "Array Queue Initialization",
    message: `Allocate a fixed array of capacity ${cap}. Set front = 0, rear = -1.`,
    line: 1,
    items: [],
    activeIndices: [],
    vars: { front: 0, rear: -1, array: `[${Array(cap).fill("?").join(", ")}]` },
    front: -1,
    rear: -1
  });
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    const arrState = `[${[...items, ...Array(cap - items.length).fill("?")].join(", ")}]`;
    steps.push({
      label: `Enqueue ${val}`,
      message: `rear increments to ${i}. Write ${val} at arr[${i}].`,
      line: 2,
      items: [...items],
      activeIndices: [i],
      vars: { front: 0, rear: i, array: arrState },
      front: 0,
      rear: i
    });
  }
  
  if (items.length > 0) {
    const popped = items.shift()!;
    const arrState = `[(${popped}), ${[...items, ...Array(cap - items.length - 1).fill("?")].join(", ")}]`;
    steps.push({
      label: `Dequeue ${popped}`,
      message: "front increments to 1. Slot arr[0] is now logically wasted in a simple array implementation!",
      line: 3,
      items: [...items],
      activeIndices: [],
      vars: { front: 1, rear: items.length, array: arrState },
      front: 0,
      rear: items.length - 1
    });
  }
  
  return steps;
}

function generateQueueLinkedListSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["10", "20"];
  const items: string[] = [];
  
  steps.push({
    label: "Initialize Linked Queue",
    message: "Initialize front and rear pointers to NULL, indicating an empty linked list.",
    line: 1,
    items: [],
    activeIndices: [],
    vars: { front: "NULL", rear: "NULL" },
    front: -1,
    rear: -1
  });
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    steps.push({
      label: `Enqueue(${val})`,
      message: i === 0
        ? `Create Node(${val}). Since queue was empty, set both front and rear pointers = Node(${val}).`
        : `Create Node(${val}). Link current rear->next = Node(${val}), and update rear = Node(${val}).`,
      line: 2,
      items: [...items],
      activeIndices: [i],
      vars: { front: `Node(${items[0]})`, rear: `Node(${val})` },
      front: 0,
      rear: i
    });
  }
  
  if (items.length > 0) {
    const popped = items.shift()!;
    steps.push({
      label: "Dequeue()",
      message: `Set temp = front. Update front = front->next. Free temp (Node ${popped}). Return ${popped}.`,
      line: 3,
      items: [...items],
      activeIndices: [],
      vars: { 
        front: items.length > 0 ? `Node(${items[0]})` : "NULL", 
        rear: items.length > 0 ? `Node(${items[items.length - 1]})` : "NULL", 
        popped 
      },
      front: 0,
      rear: Math.max(-1, items.length - 1)
    });
  }
  
  return steps;
}

function generateDynamicQueueSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["10", "20", "30"];
  let cap = 2;
  const items: string[] = [];
  
  steps.push({
    label: "Initialize Array Queue",
    message: "Allocate array of capacity = 2. Set front = 0, rear = -1.",
    line: 1,
    items: [],
    activeIndices: [],
    vars: { front: 0, rear: -1, capacity: cap },
    front: -1,
    rear: -1
  });
  
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    let label = `Enqueue(${val})`;
    let msg = `Enqueue ${val} at rear = ${items.length}.`;
    
    if (items.length >= cap) {
      cap *= 2;
      label = `Resize & Enqueue(${val})`;
      msg = `Queue full! Allocate new array of capacity = ${cap} (double capacity). Copy existing elements and enqueue ${val}.`;
    }
    
    items.push(val);
    steps.push({
      label,
      message: msg,
      line: 2,
      items: [...items],
      activeIndices: [items.length - 1],
      vars: { front: 0, rear: items.length - 1, capacity: cap },
      front: 0,
      rear: items.length - 1
    });
  }
  
  return steps;
}

function generateSlidingWindowMaxSteps(customInput: string): Step[] {
  const listStr = customInput.trim() || "4, 2, 7, 3, 9";
  let nums = listStr.split(/[\s,]+/).map(x => Number(x.trim())).filter(x => !isNaN(x));
  if (nums.length === 0) {
    nums = [4, 2, 7, 3, 9];
  }
  
  const steps: Step[] = [];
  const k = 3;
  const deque: number[] = [];
  const res: number[] = [];
  
  steps.push({
    label: "Initialize Sliding Window",
    message: `Input array: [${nums.join(", ")}], Window size k = 3. Initialize an empty deque.`,
    line: 1,
    items: [],
    activeIndices: [],
    vars: { k, deque: "[]", result: "[]" },
    originalArray: nums,
    currentIndex: -1,
    resultArray: []
  });
  
  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    let expired = -1;
    if (deque.length > 0 && deque[0] < i - k + 1) {
      expired = deque.shift()!;
    }
    
    const dropped: number[] = [];
    while (deque.length > 0 && nums[deque[deque.length - 1]] < val) {
      dropped.push(deque.pop()!);
    }
    
    deque.push(i);
    const currentMax = nums[deque[0]];
    
    if (i >= k - 1) {
      res.push(currentMax);
    }
    
    let msg = `Scan ${val} at index ${i}.`;
    if (expired !== -1) msg += ` Expire out-of-window index ${expired} from front.`;
    if (dropped.length > 0) msg += ` Drop indices [${dropped.join(", ")}] since values < ${val}.`;
    msg += ` Add index ${i} to back.`;
    if (i >= k - 1) msg += ` Current Window Max is ${currentMax}.`;
    
    steps.push({
      label: `Index ${i} (${val})`,
      message: msg,
      line: 2,
      items: deque.map(idx => `${nums[idx]} (idx:${idx})`),
      activeIndices: [deque.length - 1],
      vars: { i, val, deque: `[${deque.join(", ")}]`, result: `[${res.join(", ")}]` },
      originalArray: nums,
      currentIndex: i,
      resultArray: [...res]
    });
  }
  
  return steps;
}

function generateTrappingRainWaterSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const listStr = customInput.trim() || "3, 0, 0, 2, 0, 4";
  let heights = listStr.split(/[\s,]+/).map(x => Number(x.trim())).filter(x => !isNaN(x));
  if (heights.length === 0) {
    heights = [3, 0, 0, 2, 0, 4];
  }
  const stack: number[] = [];
  let trapped = 0;
  
  steps.push({
    label: "Initialize Trapping Water",
    message: `Input heights: [${heights.join(", ")}]. An empty stack stores indices of elements to track valleys.`,
    line: 1,
    items: [],
    activeIndices: [],
    vars: { total_water: 0, stack: "[]" },
    originalArray: heights,
    currentIndex: -1,
    resultArray: []
  });
  
  for (let i = 0; i < heights.length; i++) {
    const h = heights[i];
    
    steps.push({
      label: `Scan boundary h=${h}`,
      message: `At index ${i} (height ${h}). Compare with stack index values.`,
      line: 2,
      items: stack.map(idx => `${heights[idx]} (idx:${idx})`),
      activeIndices: [],
      vars: { i, h, total_water: trapped },
      originalArray: heights,
      currentIndex: i,
      resultArray: []
    });
    
    while (stack.length > 0 && heights[stack[stack.length - 1]] < h) {
      const valleyIdx = stack.pop()!;
      if (stack.length === 0) break;
      
      const leftIdx = stack[stack.length - 1];
      const width = i - leftIdx - 1;
      const boundedHeight = Math.min(heights[leftIdx], h) - heights[valleyIdx];
      const water = width * boundedHeight;
      trapped += water;
      
      steps.push({
        label: "Calculate Water Pocket",
        message: `Found valley index ${valleyIdx} between left index ${leftIdx} and current ${i}. Width = ${width}, height = ${boundedHeight}. Trap +${water} units.`,
        line: 3,
        items: stack.map(idx => `${heights[idx]} (idx:${idx})`),
        activeIndices: [stack.length - 1],
        vars: { left: leftIdx, valley: valleyIdx, right: i, width, height: boundedHeight, added: water, total_water: trapped },
        originalArray: heights,
        currentIndex: i,
        resultArray: []
      });
    }
    
    stack.push(i);
    steps.push({
      label: `Push index ${i}`,
      message: `Push current boundary index ${i} onto the valley-tracking stack.`,
      line: 4,
      items: stack.map(idx => `${heights[idx]} (idx:${idx})`),
      activeIndices: [stack.length - 1],
      vars: { pushed: i, total_water: trapped, stack: `[${stack.join(", ")}]` },
      originalArray: heights,
      currentIndex: i,
      resultArray: []
    });
  }
  
  return steps;
}

function generateLargestRectangleSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const listStr = customInput.trim() || "2, 1, 5, 6, 2, 3";
  let heights = listStr.split(/[\s,]+/).map(x => Number(x.trim())).filter(x => !isNaN(x));
  if (heights.length === 0) {
    heights = [2, 1, 5, 6, 2, 3];
  }
  const stack: number[] = [];
  let maxArea = 0;
  
  steps.push({
    label: "Initialize Histogram",
    message: `Input heights: [${heights.join(", ")}]. Use a stack to track increasing heights. Max area = 0.`,
    line: 1,
    items: [],
    activeIndices: [],
    vars: { max_area: 0, stack: "[]" },
    originalArray: heights,
    currentIndex: -1
  });
  
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    
    steps.push({
      label: i === heights.length ? "Finish Scan" : `Scan Bar ${i} (${h})`,
      message: i === heights.length 
        ? "Scan complete. Clear remaining stack elements."
        : `At index ${i} (height ${h}). Ensure increasing heights in monotonic stack.`,
      line: 2,
      items: stack.map(idx => `${heights[idx]} (idx:${idx})`),
      activeIndices: [],
      vars: { i, h, max_area: maxArea },
      originalArray: heights,
      currentIndex: i < heights.length ? i : heights.length - 1
    });
    
    while (stack.length > 0 && heights[stack[stack.length - 1]] > h) {
      const topIdx = stack.pop()!;
      const height = heights[topIdx];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      const area = height * width;
      maxArea = Math.max(maxArea, area);
      
      steps.push({
        label: "Calculate Area",
        message: `Pop height ${height} (idx:${topIdx}). Width = ${width}. Area = ${height} * ${width} = ${area}. Max area is now ${maxArea}.`,
        line: 3,
        items: stack.map(idx => `${heights[idx]} (idx:${idx})`),
        activeIndices: [],
        vars: { popped_idx: topIdx, height, width, area, max_area: maxArea },
        originalArray: heights,
        currentIndex: i < heights.length ? i : heights.length - 1
      });
    }
    
    if (i < heights.length) {
      stack.push(i);
      steps.push({
        label: `Push index ${i}`,
        message: `Push index ${i} (height ${h}) since it is >= top of stack.`,
        line: 4,
        items: stack.map(idx => `${heights[idx]} (idx:${idx})`),
        activeIndices: [stack.length - 1],
        vars: { pushed: i, max_area: maxArea, stack: `[${stack.join(", ")}]` },
        originalArray: heights,
        currentIndex: i
      });
    }
  }
  
  steps.push({
    label: "Done",
    message: `Evaluation finished. Maximum rectangular area found is ${maxArea}.`,
    line: 5,
    items: [],
    activeIndices: [],
    vars: { max_area: maxArea },
    originalArray: heights,
    currentIndex: heights.length,
    resultArray: []
  });
  
  return steps;
}

function generateLRUCacheSteps(): Step[] {
  const steps: Step[] = [];
  const cap = 3;
  const cache: string[] = [];
  
  steps.push({
    label: "Initialize Cache",
    message: "Create LRU Cache of capacity = 3. Initialize an empty queue to track recency order.",
    line: 1,
    items: [],
    activeIndices: [],
    vars: { size: 0, capacity: cap, queue: "[]" }
  });
  
  cache.push("A");
  steps.push({
    label: "Put(A)",
    message: "Insert 'A'. Added to the back of the queue as the most recently used.",
    line: 2,
    items: [...cache],
    activeIndices: [0],
    vars: { size: 1, capacity: cap, queue: "[A]" }
  });
  
  cache.push("B");
  steps.push({
    label: "Put(B)",
    message: "Insert 'B'. Added to the back. B is now most recent, A is least recent.",
    line: 2,
    items: [...cache],
    activeIndices: [1],
    vars: { size: 2, capacity: cap, queue: "[A, B]" }
  });
  
  cache.push("C");
  steps.push({
    label: "Put(C)",
    message: "Insert 'C'. Cache is now completely full.",
    line: 2,
    items: [...cache],
    activeIndices: [2],
    vars: { size: 3, capacity: cap, queue: "[A, B, C]" }
  });
  
  const idxA = cache.indexOf("A");
  cache.splice(idxA, 1);
  cache.push("A");
  steps.push({
    label: "Get(A) -> Update Recency",
    message: "Access 'A'. Since 'A' is referenced, move it from its position to the back of the queue (most recent).",
    line: 3,
    items: [...cache],
    activeIndices: [2],
    vars: { size: 3, queue: "[B, C, A]" }
  });
  
  const evicted = cache.shift()!;
  cache.push("D");
  steps.push({
    label: "Put(D) -> Eviction",
    message: `Cache full! Evict least recently used item '${evicted}' from the front of the queue. Enqueue 'D' at the back.`,
    line: 4,
    items: [...cache],
    activeIndices: [2],
    vars: { size: 3, evicted, queue: "[C, A, D]" }
  });
  
  return steps;
}

// ==========================================
// EXPRESSION PARSING & EVALUATION GENERATORS
// ==========================================

function generateInfixToPostfixSteps(customInput: string): Step[] {
  const expr = customInput.trim() || "A+B*C-D";
  const chars = expr.replace(/\s+/g, "").split("");
  const steps: Step[] = [];
  const stack: string[] = [];
  let output = "";

  const getPrec = (o: string): number => {
    if (o === '^') return 3;
    if (o === '*' || o === '/') return 2;
    if (o === '+' || o === '-') return 1;
    return -1;
  };

  steps.push({
    label: "Initialize Parser",
    message: `Setup empty operator stack and output buffer. Processing "${expr}".`,
    line: 2,
    items: [],
    activeIndices: [],
    vars: { output: '""', stack: "empty" },
    expression: chars,
    exprIndex: -1,
    outputStr: ""
  });

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const isAl = /[a-zA-Z0-9]/.test(c);

    if (isAl) {
      output += c;
      steps.push({
        label: "Operand to Output",
        message: `Scanned operand '${c}'. Append it directly to output.`,
        line: 4,
        items: [...stack],
        activeIndices: [],
        vars: { current: c, output, stack: stack.join(" ") },
        expression: chars,
        exprIndex: i,
        outputStr: output
      });
    } else if (c === '(') {
      stack.push(c);
      steps.push({
        label: "Push Paren",
        message: `Scanned bracket '('. Push to operator stack.`,
        line: 5,
        items: [...stack],
        activeIndices: [stack.length - 1],
        vars: { current: c, output, stack: stack.join(" ") },
        expression: chars,
        exprIndex: i,
        outputStr: output
      });
    } else if (c === ')') {
      steps.push({
        label: "Close Paren",
        message: "Scanned ')'. Pop operators to output until meeting '(' match.",
        line: 6,
        items: [...stack],
        activeIndices: [],
        vars: { current: c, output, stack: stack.join(" ") },
        expression: chars,
        exprIndex: i,
        outputStr: output
      });

      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        const popped = stack.pop()!;
        output += popped;
        steps.push({
          label: "Pop Inside Paren",
          message: `Pop '${popped}' to output.`,
          line: 7,
          items: [...stack],
          activeIndices: [],
          vars: { current: c, popped, output, stack: stack.join(" ") },
          expression: chars,
          exprIndex: i,
          outputStr: output
        });
      }

      if (stack.length > 0) {
        stack.pop();
        steps.push({
          label: "Discard Paren",
          message: "Discard matching '(' open bracket from stack.",
          line: 8,
          items: [...stack],
          activeIndices: [],
          vars: { current: c, output, stack: stack.join(" ") },
          expression: chars,
          exprIndex: i,
          outputStr: output
        });
      }
    } else {
      steps.push({
        label: "Check Operator",
        message: `Scanned operator '${c}'. Compare precedence with stack top.`,
        line: 10,
        items: [...stack],
        activeIndices: [],
        vars: { current: c, precedence: getPrec(c), top: stack.length ? stack[stack.length - 1] : "None" },
        expression: chars,
        exprIndex: i,
        outputStr: output
      });

      while (stack.length > 0 && getPrec(c) <= getPrec(stack[stack.length - 1])) {
        const popped = stack.pop()!;
        output += popped;
        steps.push({
          label: "Pop Higher Precedence",
          message: `Top operator '${popped}' has higher or equal precedence. Pop it to output.`,
          line: 11,
          items: [...stack],
          activeIndices: [],
          vars: { current: c, popped, output, stack: stack.join(" ") },
          expression: chars,
          exprIndex: i,
          outputStr: output
        });
      }

      stack.push(c);
      steps.push({
        label: "Push Operator",
        message: `Push operator '${c}' onto the stack.`,
        line: 13,
        items: [...stack],
        activeIndices: [stack.length - 1],
        vars: { current: c, output, stack: stack.join(" ") },
        expression: chars,
        exprIndex: i,
        outputStr: output
      });
    }
  }

  steps.push({
    label: "String Ended",
    message: "Expression scan complete. Empty remaining items on the operator stack.",
    line: 16,
    items: [...stack],
    activeIndices: [],
    vars: { output, stack: stack.join(" ") },
    expression: chars,
    exprIndex: chars.length,
    outputStr: output
  });

  while (stack.length > 0) {
    const popped = stack.pop()!;
    output += popped;
    steps.push({
      label: "Pop Remaining",
      message: `Pop '${popped}' to output.`,
      line: 16,
      items: [...stack],
      activeIndices: [],
      vars: { popped, output, stack: stack.join(" ") },
      expression: chars,
      exprIndex: chars.length,
      outputStr: output
    });
  }

  steps.push({
    label: "Postfix Finished",
    message: `Complete. Result string: ${output}`,
    line: 17,
    items: [],
    activeIndices: [],
    vars: { result: output },
    expression: chars,
    exprIndex: chars.length,
    outputStr: output
  });

  return steps;
}

function generateInfixToPrefixSteps(customInput: string): Step[] {
  const expr = customInput.trim() || "A+B*C-D";
  const steps: Step[] = [];

  steps.push({
    label: "1. Reverse Expression",
    message: `Infix to Prefix: First, reverse the infix expression (swapping brackets). Original: "${expr}"`,
    line: 0,
    items: [],
    activeIndices: [],
    vars: { step: "1 / 3 (Reversal)", original: expr, reversed: "" }
  });

  const reverseInfix = (s: string) => {
    let rev = "";
    for (let i = s.length - 1; i >= 0; i--) {
      const c = s[i];
      if (c === '(') rev += ')';
      else if (c === ')') rev += '(';
      else rev += c;
    }
    return rev;
  };

  const reversedExpr = reverseInfix(expr);
  steps.push({
    label: "Reversed Input",
    message: `Reversed infix is "${reversedExpr}". Now convert to postfix.`,
    line: 1,
    items: [],
    activeIndices: [],
    vars: { step: "1 / 3 (Reversal)", original: expr, reversed: reversedExpr }
  });

  const chars = reversedExpr.replace(/\s+/g, "").split("");
  const stack: string[] = [];
  let tempOutput = "";

  const getPrec = (o: string): number => {
    if (o === '^') return 3;
    if (o === '*' || o === '/') return 2;
    if (o === '+' || o === '-') return 1;
    return -1;
  };

  steps.push({
    label: "2. Scan Reversed Infix",
    message: `Scanning reversed expression "${reversedExpr}" left-to-right.`,
    line: 2,
    items: [],
    activeIndices: [],
    vars: { step: "2 / 3 (Reverse Postfix)", tempOutput: '""', stack: "empty" },
    expression: chars,
    exprIndex: -1,
    outputStr: ""
  });

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const isAl = /[a-zA-Z0-9]/.test(c);

    if (isAl) {
      tempOutput += c;
      steps.push({
        label: "Operand to Output",
        message: `Operand '${c}' directly to output.`,
        line: 3,
        items: [...stack],
        activeIndices: [],
        vars: { step: "2 / 3", current: c, tempOutput, stack: stack.join(" ") },
        expression: chars,
        exprIndex: i,
        outputStr: tempOutput
      });
    } else if (c === '(') {
      stack.push(c);
      steps.push({
        label: "Push Paren",
        message: `Push '(' to stack.`,
        line: 4,
        items: [...stack],
        activeIndices: [stack.length - 1],
        vars: { step: "2 / 3", current: c, tempOutput, stack: stack.join(" ") },
        expression: chars,
        exprIndex: i,
        outputStr: tempOutput
      });
    } else if (c === ')') {
      steps.push({
        label: "Close Paren",
        message: `Pop until meeting '(' match.`,
        line: 5,
        items: [...stack],
        activeIndices: [],
        vars: { step: "2 / 3", current: c, tempOutput, stack: stack.join(" ") },
        expression: chars,
        exprIndex: i,
        outputStr: tempOutput
      });

      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        const popped = stack.pop()!;
        tempOutput += popped;
        steps.push({
          label: "Pop Inside Paren",
          message: `Pop '${popped}' to output.`,
          line: 6,
          items: [...stack],
          activeIndices: [],
          vars: { step: "2 / 3", current: c, popped, tempOutput, stack: stack.join(" ") },
          expression: chars,
          exprIndex: i,
          outputStr: tempOutput
        });
      }

      if (stack.length > 0) {
        stack.pop();
      }
    } else {
      while (stack.length > 0 && getPrec(c) < getPrec(stack[stack.length - 1])) {
        const popped = stack.pop()!;
        tempOutput += popped;
        steps.push({
          label: "Pop Higher Precedence",
          message: `Pop strictly higher precedence '${popped}' to output.`,
          line: 7,
          items: [...stack],
          activeIndices: [],
          vars: { step: "2 / 3", current: c, popped, tempOutput, stack: stack.join(" ") },
          expression: chars,
          exprIndex: i,
          outputStr: tempOutput
        });
      }
      stack.push(c);
      steps.push({
        label: "Push Operator",
        message: `Push operator '${c}' onto stack.`,
        line: 8,
        items: [...stack],
        activeIndices: [stack.length - 1],
        vars: { step: "2 / 3", current: c, tempOutput, stack: stack.join(" ") },
        expression: chars,
        exprIndex: i,
        outputStr: tempOutput
      });
    }
  }

  while (stack.length > 0) {
    const popped = stack.pop()!;
    tempOutput += popped;
    steps.push({
      label: "Pop Remaining",
      message: `Pop '${popped}' to output.`,
      line: 9,
      items: [...stack],
      activeIndices: [],
      vars: { step: "2 / 3", popped, tempOutput, stack: stack.join(" ") },
      expression: chars,
      exprIndex: chars.length,
      outputStr: tempOutput
    });
  }

  const finalPrefix = tempOutput.split("").reverse().join("");
  steps.push({
    label: "3. Reverse Output to Prefix",
    message: `Reverse "${tempOutput}" to get final prefix: "${finalPrefix}"`,
    line: 10,
    items: [],
    activeIndices: [],
    vars: { step: "3 / 3 (Prefix Result)", tempPostfix: tempOutput, finalPrefix },
    expression: chars,
    exprIndex: chars.length,
    outputStr: finalPrefix
  });

  return steps;
}

function generatePrefixToInfixSteps(customInput: string): Step[] {
  const expr = customInput.trim() || "*-ABC";
  const tokens = expr.replace(/\s+/g, "").split("");
  const steps: Step[] = [];
  const stack: string[] = [];

  steps.push({
    label: "Initialize Prefix Parser",
    message: `Prefix to Infix: Scan "${expr}" from right to left.`,
    line: 0,
    items: [],
    activeIndices: [],
    vars: { stack: "empty", index: "N/A" },
    expression: tokens,
    exprIndex: tokens.length
  });

  for (let i = tokens.length - 1; i >= 0; i--) {
    const c = tokens[i];
    const isOp = /[\+\-\*\/\^]/.test(c);

    steps.push({
      label: `Scan '${c}'`,
      message: `Scan token '${c}' right-to-left.`,
      line: 1,
      items: [...stack],
      activeIndices: [],
      vars: { index: i, current: c, type: isOp ? "operator" : "operand" },
      expression: tokens,
      exprIndex: i
    });

    if (!isOp) {
      stack.push(c);
      steps.push({
        label: "Push Operand",
        message: `Push operand '${c}' onto stack.`,
        line: 2,
        items: [...stack],
        activeIndices: [stack.length - 1],
        vars: { index: i, current: c, stack: stack.join(" | ") },
        expression: tokens,
        exprIndex: i
      });
    } else {
      if (stack.length < 2) {
        steps.push({
          label: "Error: Invalid Prefix",
          message: `Operator '${c}' requires 2 operands, stack has less!`,
          line: 3,
          items: [...stack],
          activeIndices: [],
          vars: { error: "Underflow", index: i },
          expression: tokens,
          exprIndex: i
        });
        return steps;
      }

      const op1 = stack.pop()!;
      const op2 = stack.pop()!;
      const combined = `(${op1}${c}${op2})`;
      stack.push(combined);

      steps.push({
        label: "Combine Operands",
        message: `Pop '${op1}' and '${op2}'. Combine as "${combined}" and push back.`,
        line: 4,
        items: [...stack],
        activeIndices: [stack.length - 1],
        vars: { op1, op2, operator: c, combined, stack: stack.join(" | ") },
        expression: tokens,
        exprIndex: i
      });
    }
  }

  const finalInfix = stack.pop() || "";
  steps.push({
    label: "Prefix to Infix Finished",
    message: `Prefix conversion complete! Result: "${finalInfix}"`,
    line: 5,
    items: [],
    activeIndices: [],
    vars: { result: finalInfix },
    expression: tokens,
    exprIndex: -1
  });

  return steps;
}

function generatePostfixToInfixSteps(customInput: string): Step[] {
  const expr = customInput.trim() || "AB-C*";
  const tokens = expr.replace(/\s+/g, "").split("");
  const steps: Step[] = [];
  const stack: string[] = [];

  steps.push({
    label: "Initialize Postfix Parser",
    message: `Postfix to Infix: Scan "${expr}" left-to-right.`,
    line: 0,
    items: [],
    activeIndices: [],
    vars: { stack: "empty", index: "N/A" },
    expression: tokens,
    exprIndex: -1
  });

  for (let i = 0; i < tokens.length; i++) {
    const c = tokens[i];
    const isOp = /[\+\-\*\/\^]/.test(c);

    steps.push({
      label: `Scan '${c}'`,
      message: `Scan token '${c}' left-to-right.`,
      line: 1,
      items: [...stack],
      activeIndices: [],
      vars: { index: i, current: c, type: isOp ? "operator" : "operand" },
      expression: tokens,
      exprIndex: i
    });

    if (!isOp) {
      stack.push(c);
      steps.push({
        label: "Push Operand",
        message: `Push operand '${c}' onto stack.`,
        line: 2,
        items: [...stack],
        activeIndices: [stack.length - 1],
        vars: { index: i, current: c, stack: stack.join(" | ") },
        expression: tokens,
        exprIndex: i
      });
    } else {
      if (stack.length < 2) {
        steps.push({
          label: "Error: Invalid Postfix",
          message: `Operator '${c}' requires 2 operands!`,
          line: 3,
          items: [...stack],
          activeIndices: [],
          vars: { error: "Underflow", index: i },
          expression: tokens,
          exprIndex: i
        });
        return steps;
      }

      const op2 = stack.pop()!;
      const op1 = stack.pop()!;
      const combined = `(${op1}${c}${op2})`;
      stack.push(combined);

      steps.push({
        label: "Combine Operands",
        message: `Pop '${op2}' (top) and '${op1}' (below). Combine as "${combined}" and push back.`,
        line: 4,
        items: [...stack],
        activeIndices: [stack.length - 1],
        vars: { op1, op2, operator: c, combined, stack: stack.join(" | ") },
        expression: tokens,
        exprIndex: i
      });
    }
  }

  const finalInfix = stack.pop() || "";
  steps.push({
    label: "Postfix to Infix Finished",
    message: `Postfix conversion complete! Result: "${finalInfix}"`,
    line: 5,
    items: [],
    activeIndices: [],
    vars: { result: finalInfix },
    expression: tokens,
    exprIndex: tokens.length
  });

  return steps;
}

function generateEvaluatePostfixSteps(customInput: string): Step[] {
  const expr = customInput.trim() || "5, 3, +, 8, 2, /, *";
  const tokens = expr.split(/[\s,]+/).filter(x => x.length > 0);
  const steps: Step[] = [];
  const stack: number[] = [];

  steps.push({
    label: "Initialize Postfix Evaluator",
    message: `Evaluate Postfix: Scan elements left-to-right. List: [${tokens.join(", ")}].`,
    line: 0,
    items: [],
    activeIndices: [],
    vars: { stack: "empty", index: "N/A" },
    expression: tokens,
    exprIndex: -1
  });

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isOp = /[\+\-\*\/\^]/.test(token) && token.length === 1;

    steps.push({
      label: `Scan '${token}'`,
      message: `Evaluate token '${token}'.`,
      line: 1,
      items: stack.map(String),
      activeIndices: [],
      vars: { index: i, token, type: isOp ? "operator" : "number" },
      expression: tokens,
      exprIndex: i
    });

    if (!isOp) {
      const num = Number(token);
      if (isNaN(num)) {
        steps.push({
          label: "Error: Invalid Token",
          message: `Token '${token}' is not a valid number.`,
          line: 2,
          items: stack.map(String),
          activeIndices: [],
          vars: { index: i, error: "NaN" },
          expression: tokens,
          exprIndex: i
        });
        return steps;
      }
      stack.push(num);
      steps.push({
        label: "Push Number",
        message: `Push value ${num} onto the evaluator stack.`,
        line: 3,
        items: stack.map(String),
        activeIndices: [stack.length - 1],
        vars: { index: i, num, stack: stack.join(", ") },
        expression: tokens,
        exprIndex: i
      });
    } else {
      if (stack.length < 2) {
        steps.push({
          label: "Evaluation Error",
          message: `Operator '${token}' has insufficient operands!`,
          line: 4,
          items: stack.map(String),
          activeIndices: [],
          vars: { index: i, error: "Underflow" },
          expression: tokens,
          exprIndex: i
        });
        return steps;
      }

      const val2 = stack.pop()!;
      const val1 = stack.pop()!;
      let res = 0;
      if (token === '+') res = val1 + val2;
      else if (token === '-') res = val1 - val2;
      else if (token === '*') res = val1 * val2;
      else if (token === '/') res = val1 / val2;
      else if (token === '^') res = Math.pow(val1, val2);

      stack.push(res);
      steps.push({
        label: `Compute ${val1} ${token} ${val2}`,
        message: `Pop ${val2} (val2) and ${val1} (val1). Calculate ${val1} ${token} ${val2} = ${res}. Push back.`,
        line: 5,
        items: stack.map(String),
        activeIndices: [stack.length - 1],
        vars: { val1, val2, operator: token, res, stack: stack.join(", ") },
        expression: tokens,
        exprIndex: i
      });
    }
  }

  const finalVal = stack.pop() || 0;
  steps.push({
    label: "Evaluation Finished",
    message: `Complete! Final value is ${finalVal}.`,
    line: 6,
    items: [],
    activeIndices: [],
    vars: { result: finalVal },
    expression: tokens,
    exprIndex: tokens.length
  });

  return steps;
}

function generateEvaluatePrefixSteps(customInput: string): Step[] {
  const expr = customInput.trim() || "*, +, 5, 3, /, 8, 2";
  const tokens = expr.split(/[\s,]+/).filter(x => x.length > 0);
  const steps: Step[] = [];
  const stack: number[] = [];

  steps.push({
    label: "Initialize Prefix Evaluator",
    message: `Evaluate Prefix: Scan tokens right-to-left. List: [${tokens.join(", ")}].`,
    line: 0,
    items: [],
    activeIndices: [],
    vars: { stack: "empty", index: "N/A" },
    expression: tokens,
    exprIndex: tokens.length
  });

  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];
    const isOp = /[\+\-\*\/\^]/.test(token) && token.length === 1;

    steps.push({
      label: `Scan '${token}'`,
      message: `Evaluate token '${token}'.`,
      line: 1,
      items: stack.map(String),
      activeIndices: [],
      vars: { index: i, token, type: isOp ? "operator" : "number" },
      expression: tokens,
      exprIndex: i
    });

    if (!isOp) {
      const num = Number(token);
      if (isNaN(num)) {
        steps.push({
          label: "Error: Invalid Token",
          message: `Token '${token}' is not a valid number.`,
          line: 2,
          items: stack.map(String),
          activeIndices: [],
          vars: { index: i, error: "NaN" },
          expression: tokens,
          exprIndex: i
        });
        return steps;
      }
      stack.push(num);
      steps.push({
        label: "Push Number",
        message: `Push value ${num} onto the evaluator stack.`,
        line: 3,
        items: stack.map(String),
        activeIndices: [stack.length - 1],
        vars: { index: i, num, stack: stack.join(", ") },
        expression: tokens,
        exprIndex: i
      });
    } else {
      if (stack.length < 2) {
        steps.push({
          label: "Evaluation Error",
          message: `Operator '${token}' has insufficient operands!`,
          line: 4,
          items: stack.map(String),
          activeIndices: [],
          vars: { index: i, error: "Underflow" },
          expression: tokens,
          exprIndex: i
        });
        return steps;
      }

      const val1 = stack.pop()!;
      const val2 = stack.pop()!;
      let res = 0;
      if (token === '+') res = val1 + val2;
      else if (token === '-') res = val1 - val2;
      else if (token === '*') res = val1 * val2;
      else if (token === '/') res = val1 / val2;
      else if (token === '^') res = Math.pow(val1, val2);

      stack.push(res);
      steps.push({
        label: `Compute ${val1} ${token} ${val2}`,
        message: `Pop ${val1} (val1) and ${val2} (val2). Calculate ${val1} ${token} ${val2} = ${res}. Push back.`,
        line: 5,
        items: stack.map(String),
        activeIndices: [stack.length - 1],
        vars: { val1, val2, operator: token, res, stack: stack.join(", ") },
        expression: tokens,
        exprIndex: i
      });
    }
  }

  const finalVal = stack.pop() || 0;
  steps.push({
    label: "Evaluation Finished",
    message: `Complete! Final value is ${finalVal}.`,
    line: 6,
    items: [],
    activeIndices: [],
    vars: { result: finalVal },
    expression: tokens,
    exprIndex: -1
  });

  return steps;
}

function generatePriorityQueueSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["5", "1", "9"];
  const items: string[] = [];

  steps.push({
    label: "Initialize Priority Queue",
    message: "Create an empty Priority Queue. Elements are sorted by priority (Max-Heap rules).",
    line: 0,
    items: [],
    activeIndices: [],
    vars: { size: 0 }
  });

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    items.sort((a, b) => {
      const numA = Number(a), numB = Number(b);
      if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
      return b.localeCompare(a);
    });
    const topIdx = items.indexOf(val);
    steps.push({
      label: `Push(${val})`,
      message: `Insert element ${val}. Priority Queue bubble-up yields sequence: [${items.join(", ")}].`,
      line: 1,
      items: [...items],
      activeIndices: [topIdx],
      vars: { size: items.length, highest_priority: items[0] }
    });
  }

  if (items.length > 0) {
    const popped = items.shift()!;
    steps.push({
      label: "Pop()",
      message: `Remove the element with the highest priority (${popped}). Front becomes ${items[0] || "None"}.`,
      line: 2,
      items: [...items],
      activeIndices: [],
      vars: { popped, size: items.length, highest_priority: items[0] || "None" }
    });
  }

  return steps;
}

function generateMinStackSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed.map(Number).filter(x => !isNaN(x)) : [5, 3, 7, 2];
  const mainSt: string[] = [];
  const minSt: string[] = [];

  const push = (val: number, line: number) => {
    mainSt.push(String(val));
    const currentMin = minSt.length > 0 ? Math.min(val, Number(minSt[minSt.length - 1])) : val;
    minSt.push(String(currentMin));

    steps.push({
      label: `Push(${val})`,
      message: `Push ${val} onto elements stack. Calculate min(${val}, ${minSt.length > 1 ? minSt[minSt.length - 2] : "inf"}) = ${currentMin}.`,
      line,
      items: [...mainSt],
      activeIndices: [mainSt.length - 1],
      minItems: [...minSt],
      vars: { pushed: val, min: currentMin, size: mainSt.length }
    });
  };

  const pop = (line: number) => {
    const popped = mainSt.pop()!;
    const poppedMin = minSt.pop()!;
    steps.push({
      label: "Pop()",
      message: `Pop top value ${popped}. Min stack pops its top ${poppedMin} to align depth.`,
      line,
      items: [...mainSt],
      activeIndices: [],
      minItems: [...minSt],
      vars: { popped, poppedMin, size: mainSt.length, new_min: minSt.length ? minSt[minSt.length - 1] : "None" }
    });
  };

  const getMin = (line: number) => {
    const minVal = minSt[minSt.length - 1];
    steps.push({
      label: "GetMin()",
      message: `Read minimum value directly from Min Stack peak in O(1) time: ${minVal}.`,
      line,
      items: [...mainSt],
      activeIndices: [],
      minItems: [...minSt],
      vars: { min_val: minVal }
    });
  };

  steps.push({
    label: "Initialize Stack",
    message: "Instantiate dual stacks: one for values, one for historical minimums.",
    line: 0,
    items: [],
    activeIndices: [],
    minItems: [],
    vars: { size: 0, min: "None" }
  });

  for (let i = 0; i < values.length; i++) {
    push(values[i], 4);
  }
  if (values.length > 0) {
    getMin(13);
    pop(8);
    getMin(13);
  }

  return steps;
}

function generateCircularQueueSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed.map(Number).filter(x => !isNaN(x)) : [10, 20, 30, 40, 50, 60, 70, 80];
  const cap = 8;
  const arr: string[] = Array(cap).fill("");
  let front = 0;
  let rear = -1;
  let size = 0;

  const enqueue = (val: number, line: number) => {
    if (size === cap) return;
    rear = (rear + 1) % cap;
    arr[rear] = String(val);
    size++;

    steps.push({
      label: `Enqueue(${val})`,
      message: `rear = (rear + 1) % ${cap} = ${rear}. Write '${val}' at index ${rear}.`,
      line,
      items: [...arr],
      activeIndices: [rear],
      vars: { enqueued: val, front, rear, size },
      front,
      rear,
      capacity: cap
    });
  };

  const dequeue = (line: number) => {
    if (size === 0) return;
    const val = arr[front];
    arr[front] = "";
    const oldFront = front;
    front = (front + 1) % cap;
    size--;

    steps.push({
      label: "Dequeue()",
      message: `Read value '${val}' from front slot ${oldFront}. front = (front + 1) % ${cap} = ${front}.`,
      line,
      items: [...arr],
      activeIndices: [oldFront],
      vars: { dequeued: val, front, rear, size },
      front,
      rear,
      capacity: cap
    });
  };

  steps.push({
    label: "Init Circular Queue",
    message: `Initialize circular buffer ring of capacity ${cap} with front = 0, rear = -1.`,
    line: 0,
    items: [...arr],
    activeIndices: [],
    vars: { front, rear, size, capacity: cap },
    front,
    rear,
    capacity: cap
  });

  for (let i = 0; i < Math.min(3, values.length); i++) {
    enqueue(values[i], 4);
  }
  if (size > 0) dequeue(11);
  for (let i = 3; i < values.length; i++) {
    enqueue(values[i], 4);
  }
  if (size > 0) dequeue(11);

  return steps;
}

function generateFallbackStackSteps(customInput: string): Step[] {
  const steps: Step[] = [];
  const parsed = customInput.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
  const values = parsed.length > 0 ? parsed : ["A", "B", "C"];
  const items: string[] = [];

  steps.push({
    label: "Initialize Structure",
    message: "Allocate a standard LIFO Stack buffer structure.",
    line: 0,
    items: [],
    activeIndices: [],
    vars: { size: 0 }
  });

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    items.push(val);
    steps.push({
      label: `Push(${val})`,
      message: `Insert element '${val}' onto the top boundary.`,
      line: 1,
      items: [...items],
      activeIndices: [i],
      vars: { size: items.length, top: val }
    });
  }

  if (items.length > 0) {
    const popped = items.pop()!;
    steps.push({
      label: "Pop()",
      message: `Remove elements in LIFO order. Top item '${popped}' leaves first.`,
      line: 4,
      items: [...items],
      activeIndices: [],
      vars: { popped, size: items.length, top: items[items.length - 1] || "None" }
    });
  }

  return steps;
}

interface StackQueueProps {
  lessonId: string;
  title?: string;
  definition?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  keyPoints?: string[];
}

export default function StackQueueLessonLab({
  lessonId,
  title,
  definition,
  timeComplexity,
  spaceComplexity,
  keyPoints
}: StackQueueProps) {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  const baseProfile = useMemo(() => profileForLesson(lessonId, title), [lessonId, title]);
  const profile = useMemo(() => ({
    ...baseProfile,
    ...(definition ? { definition } : {}),
    ...(timeComplexity ? { time: timeComplexity } : {}),
    ...(spaceComplexity ? { space: spaceComplexity } : {}),
    ...(keyPoints ? { points: keyPoints } : {}),
  }), [baseProfile, definition, timeComplexity, spaceComplexity, keyPoints]);

  // Dynamic customization inputs
  const defaultCustomInput = useMemo(() => {
    if (lessonId.includes("parentheses") || lessonId.includes("bracket")) return "([]{})";
    if (lessonId === "trapping-rain-water") return "3, 0, 0, 2, 0, 4";
    if (lessonId === "largest-rectangle-histogram" || lessonId === "maximal-rectangle") return "2, 1, 5, 6, 2, 3";
    const topic = LESSON_TOPIC[lessonId] ?? "stack";
    if (topic === "monotonic" || lessonId.includes("greater") || lessonId.includes("smaller") || lessonId.includes("monotonic") || lessonId.includes("span") || lessonId.includes("window")) return "4, 2, 7, 3, 9";
    if (lessonId.includes("postfix") || lessonId.includes("infix") || lessonId.includes("prefix")) return "A+B*C-D";
    if (topic === "priority" || topic === "special" || lessonId.includes("priority")) return "5, 3, 7, 2";
    if (topic === "queue" || lessonId.includes("circular") || lessonId.includes("queue")) return "10, 20, 30, 40";
    return "A, B, C, D";
  }, [lessonId]);

  const [customInput, setCustomInput] = useState(defaultCustomInput);
  const [customInputSubmitted, setCustomInputSubmitted] = useState(defaultCustomInput);

  // Playback control
  const steps = useMemo(() => generateAlgorithmSteps(lessonId, customInputSubmitted), [lessonId, customInputSubmitted]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(850);

  // Sandbox Mode state
  const [sandboxMode, setSandboxMode] = useState(false);
  const [sandboxType, setSandboxType] = useState<"stack" | "queue" | "deque" | "priority">("stack");
  const [sandboxItems, setSandboxItems] = useState<string[]>(["A", "B", "C"]);
  const [sandboxInput, setSandboxInput] = useState("");
  const [sandboxLog, setSandboxLog] = useState<SandboxLogEntry[]>([]);

  // Drag and Drop positions (glassmorphic panels)
  const [panelPositions, setPanelPositions] = useState<Record<PanelId, { x: number; y: number }>>({
    definition: { x: 24, y: 16 },
    vars: { x: 24, y: 220 },
    sandbox: { x: 440, y: 16 },
    log: { x: 440, y: 240 }
  });

  const [draggingPanel, setDraggingPanel] = useState<PanelId | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const step = useMemo(() => steps[Math.min(stepIndex, steps.length - 1)] || {
    label: "Initialize",
    message: "No steps generated.",
    line: 0,
    items: [],
    activeIndices: [],
    vars: {}
  }, [steps, stepIndex]);

  // Dynamically align sandbox configuration with the active lesson topic
  useEffect(() => {
    const topic = LESSON_TOPIC[lessonId] ?? "stack";
    if (topic === "queue" || lessonId.includes("queue") || lessonId.includes("fifo")) {
      setSandboxType("queue");
      setSandboxItems(["A", "B", "C"]);
    } else if (topic === "deque" || lessonId.includes("deque")) {
      setSandboxType("deque");
      setSandboxItems(["A", "B", "C"]);
    } else if (topic === "priority" || lessonId.includes("priority")) {
      setSandboxType("priority");
      setSandboxItems(["9", "5", "3"]);
    } else {
      setSandboxType("stack");
      setSandboxItems(["A", "B", "C"]);
    }
  }, [lessonId]);

  // Auto-play interval
  useEffect(() => {
    if (!playing) return;
    if (stepIndex >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIndex((idx) => Math.min(steps.length - 1, idx + 1));
    }, speed);
    return () => window.clearTimeout(timer);
  }, [playing, stepIndex, steps.length, speed]);

  const handlePointerDown = useCallback((e: React.PointerEvent, panelId: PanelId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggingPanel(panelId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingPanel) return;
    const container = document.getElementById("sq-canvas-container");
    if (!container) return;
    const cRect = container.getBoundingClientRect();

    const newX = Math.max(8, Math.min(cRect.width - 290, e.clientX - cRect.left - dragOffset.x));
    const newY = Math.max(8, Math.min(cRect.height - 210, e.clientY - cRect.top - dragOffset.y));

    setPanelPositions((prev) => ({
      ...prev,
      [draggingPanel]: { x: newX, y: newY }
    }));
  }, [draggingPanel, dragOffset]);

  const handlePointerUp = useCallback(() => {
    setDraggingPanel(null);
  }, []);

  const resetCanvasLayout = useCallback(() => {
    setPanelPositions({
      definition: { x: 24, y: 16 },
      vars: { x: 24, y: 220 },
      sandbox: { x: 440, y: 16 },
      log: { x: 440, y: 240 }
    });
  }, []);

  // Sandbox operations handlers
  const handlePush = () => {
    const val = sandboxInput.trim() || String.fromCharCode(65 + Math.floor(Math.random() * 26));
    setSandboxInput("");

    let nextItems = [...sandboxItems];
    if (sandboxType === "stack") {
      nextItems.push(val);
    } else if (sandboxType === "queue") {
      nextItems.push(val);
    } else if (sandboxType === "deque") {
      nextItems.push(val); // default back
    } else if (sandboxType === "priority") {
      nextItems.push(val);
      nextItems.sort((a, b) => {
        const numA = Number(a), numB = Number(b);
        if (!isNaN(numA) && !isNaN(numB)) return numB - numA; // numeric max-heap
        return b.localeCompare(a); // lexicographical max-heap
      });
    }

    setSandboxItems(nextItems);
    addLogEntry("push", val);
  };

  const handlePop = () => {
    if (sandboxItems.length === 0) return;
    let nextItems = [...sandboxItems];
    let popped: string;

    if (sandboxType === "stack" || sandboxType === "priority") {
      popped = nextItems.pop()!;
    } else {
      popped = nextItems.shift()!;
    }

    setSandboxItems(nextItems);
    addLogEntry("pop", popped);
  };

  const handleDequePushFront = () => {
    const val = sandboxInput.trim() || String.fromCharCode(65 + Math.floor(Math.random() * 26));
    setSandboxInput("");
    setSandboxItems([val, ...sandboxItems]);
    addLogEntry("push_front", val);
  };

  const handleDequePopBack = () => {
    if (sandboxItems.length === 0) return;
    const nextItems = [...sandboxItems];
    const popped = nextItems.pop()!;
    setSandboxItems(nextItems);
    addLogEntry("pop_back", popped);
  };

  const addLogEntry = (type: string, val?: string) => {
    const newEntry: SandboxLogEntry = {
      id: Math.random().toString(),
      type,
      value: val,
      timestamp: new Date().toLocaleTimeString()
    };
    setSandboxLog((prev) => [newEntry, ...prev].slice(0, 10));
  };

  const clearSandbox = () => {
    setSandboxItems([]);
    setSandboxLog([]);
    addLogEntry("clear");
  };

  const triggerTraceRefresh = () => {
    setStepIndex(0);
    setPlaying(false);
    setCustomInputSubmitted(customInput);
  };

  const isStackLike = profile.mode === "stack" || profile.mode === "expression" || profile.mode === "priority" || profile.mode === "monotonic";

  return (
    <main className="sq-page" data-theme={theme}>
      {/* High Contrast Eyebrow and Hero */}
      <section className="sq-hero">
        <div className="sq-content-width">
          <span className="sq-eyebrow">Interactive DSA Laboratory</span>
          <h1>{profile.title}</h1>
          <p className="sq-description">{profile.definition}</p>
          <div className="sq-tag-group">
            <div className="sq-tag"><span>Topic</span><strong>{profile.topic}</strong></div>
            <div className="sq-tag"><span>Pattern</span><strong>{profile.pattern}</strong></div>
            <div className="sq-tag"><span>Time</span><strong>{profile.time}</strong></div>
            <div className="sq-tag"><span>Space</span><strong>{profile.space}</strong></div>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="sq-simulator">
        <div className="sq-workspace">
          {/* Left panel sidebar: Controls & Details */}
          <aside className="sq-sidebar">
            <div className="sq-mode-tabs">
              <button 
                className={!sandboxMode ? "active" : ""} 
                onClick={() => setSandboxMode(false)}
              >
                Algorithm Trace
              </button>
              <button 
                className={sandboxMode ? "active" : ""} 
                onClick={() => setSandboxMode(true)}
              >
                Interactive Sandbox
              </button>
            </div>

            {!sandboxMode ? (
              // Algorithmic Walkthrough Details
              <div className="sq-panel-inner">
                <div className="sq-meta-label">Current Step</div>
                <h3>{step?.label || "Run"}</h3>
                <p className="sq-step-desc">{step?.message || "Click play to begin algorithmic walkthrough."}</p>

                {/* Standard Playback Controls */}
                <div className="sq-controls-row">
                  <button title="Reset" className="sq-btn-circle" onClick={() => { setStepIndex(0); setPlaying(false); }}><RotateCcw size={15} /></button>
                  <button title={playing ? "Pause" : "Play"} className="sq-btn-circle sq-btn-play" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={15} /> : <Play size={15} />}</button>
                  <button title="Previous" className="sq-btn-circle" onClick={() => setStepIndex((v) => Math.max(0, v - 1))}><ChevronLeft size={15} /></button>
                  <button title="Next" className="sq-btn-circle" onClick={() => setStepIndex((v) => Math.min(steps.length - 1, v + 1))}><ChevronRight size={15} /></button>
                  <button title="Fit Windows" className="sq-btn-text" onClick={resetCanvasLayout}>Fit</button>
                </div>

                <div className="sq-slider-container">
                  <div className="sq-slider-header">
                    <span>Playback Speed</span>
                    <span>{speed}ms</span>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="2000" 
                    step="100"
                    value={speed} 
                    onChange={(e) => setSpeed(Number(e.target.value))} 
                  />
                </div>

                <div className="sq-timeline-container">
                  <div className="sq-slider-header">
                    <span>Timeline</span>
                    <span>{stepIndex + 1} / {steps.length}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={Math.max(0, steps.length - 1)} 
                    value={stepIndex} 
                    onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} 
                  />
                </div>

                {/* Algorithm Input Form */}
                {defaultCustomInput && (
                  <div className="sq-input-card">
                    <div className="sq-meta-label">Custom Input Data</div>
                    <div className="sq-input-group">
                      <input 
                        type="text" 
                        value={customInput} 
                        placeholder={defaultCustomInput} 
                        onChange={(e) => setCustomInput(e.target.value)} 
                        className="sq-field"
                      />
                      <button className="sq-btn-action" onClick={triggerTraceRefresh}>Trace</button>
                    </div>
                    <span className="sq-tip-text">
                      {lessonId.includes("parentheses") && "Enter bracket strings e.g. ([{}])"}
                      {lessonId.includes("greater") && "Enter comma-separated numbers e.g. 5,1,8,2"}
                      {lessonId.includes("postfix") && "Enter algebra strings e.g. (A+B)*C"}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // Interactive Sandbox Configuration
              <div className="sq-panel-inner">
                <div className="sq-meta-label">Sandbox Configuration</div>
                <h3>Playground Structure</h3>
                <p className="sq-step-desc">Test custom boundaries and inspect push/pop LIFO or FIFO execution chains in real-time.</p>

                <div className="sq-structure-selector">
                  <label className="sq-radio-item">
                    <input 
                      type="radio" 
                      name="sandboxType" 
                      checked={sandboxType === "stack"} 
                      onChange={() => { setSandboxType("stack"); setSandboxItems(["A", "B", "C"]); }} 
                    />
                    <span>Stack (LIFO)</span>
                  </label>
                  <label className="sq-radio-item">
                    <input 
                      type="radio" 
                      name="sandboxType" 
                      checked={sandboxType === "queue"} 
                      onChange={() => { setSandboxType("queue"); setSandboxItems(["A", "B", "C"]); }} 
                    />
                    <span>Queue (FIFO)</span>
                  </label>
                  <label className="sq-radio-item">
                    <input 
                      type="radio" 
                      name="sandboxType" 
                      checked={sandboxType === "deque"} 
                      onChange={() => { setSandboxType("deque"); setSandboxItems(["A", "B", "C"]); }} 
                    />
                    <span>Deque (Double-Ended)</span>
                  </label>
                  <label className="sq-radio-item">
                    <input 
                      type="radio" 
                      name="sandboxType" 
                      checked={sandboxType === "priority"} 
                      onChange={() => { setSandboxType("priority"); setSandboxItems(["9", "5", "3"]); }} 
                    />
                    <span>Priority Queue</span>
                  </label>
                </div>

                <div className="sq-input-card">
                  <div className="sq-meta-label">Add Custom Element</div>
                  <input 
                    type="text" 
                    value={sandboxInput} 
                    placeholder="Enter value (e.g. 42, X)" 
                    maxLength={10}
                    onChange={(e) => setSandboxInput(e.target.value)} 
                    className="sq-field sq-wide-field"
                    onKeyDown={(e) => e.key === "Enter" && handlePush()}
                  />
                  
                  <div className="sq-sandbox-actions">
                    {sandboxType !== "deque" ? (
                      <>
                        <button className="sq-btn-action sq-glow-btn" onClick={handlePush}>
                          <Plus size={14} /> {sandboxType === "queue" ? "Enqueue" : "Push"}
                        </button>
                        <button className="sq-btn-action sq-warn-btn" onClick={handlePop} disabled={sandboxItems.length === 0}>
                          <Trash2 size={14} /> {sandboxType === "queue" ? "Dequeue" : "Pop"}
                        </button>
                      </>
                    ) : (
                      <div className="sq-deque-grid">
                        <button className="sq-btn-action" onClick={handleDequePushFront}><Plus size={12} /> Push Front</button>
                        <button className="sq-btn-action" onClick={handlePush}><Plus size={12} /> Push Back</button>
                        <button className="sq-btn-action sq-warn-btn" onClick={handlePop} disabled={sandboxItems.length === 0}><Trash2 size={12} /> Pop Front</button>
                        <button className="sq-btn-action sq-warn-btn" onClick={handleDequePopBack} disabled={sandboxItems.length === 0}><Trash2 size={12} /> Pop Back</button>
                      </div>
                    )}
                  </div>
                  <button className="sq-btn-text sq-clear-btn" onClick={clearSandbox}>
                    Clear Workspace
                  </button>
                </div>
              </div>
            )}

            <div className="sq-info-card">
              <div className="sq-meta-label">Structural Invariants</div>
              {profile.points.map((p, idx) => (
                <div key={idx} className="sq-bullet-row">
                  <span className="sq-bullet">▪</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Center visualizer and right logic tracker */}
          <div className="sq-canvas-shell">
            <div 
              id="sq-canvas-container" 
              className="sq-canvas-relative"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* SVG Canvas rendering structures */}
              <svg className="sq-svg-canvas">
                <defs>
                  <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={theme === "light" ? "#000" : "#fff"} floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Render background grid */}
                <g className="sq-grid-lines">
                  <line x1="0" y1="220" x2="720" y2="220" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="360" y1="0" x2="360" y2="440" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="5,5" />
                </g>

                {/* SCENARIO A: CIRCULAR QUEUE SPECIAL VISUALIZATION */}
                {!sandboxMode && lessonId.includes("circular") && step.capacity ? (
                  <g className="sq-circular-vis">
                    <circle cx="360" cy="220" r="110" className="sq-ring-back" />
                    <circle cx="360" cy="220" r="70" className="sq-ring-inner" />
                    
                    {/* Render radial slots */}
                    {(() => {
                      const capacity = step.capacity ?? 8;
                      return Array.from({ length: capacity }).map((_, idx) => {
                        const angle = (idx * 360) / capacity - 90;
                        const rad = (angle * Math.PI) / 180;
                        const xOuter = 360 + 110 * Math.cos(rad);
                        const yOuter = 220 + 110 * Math.sin(rad);
                        const xInner = 360 + 70 * Math.cos(rad);
                        const yInner = 220 + 70 * Math.sin(rad);

                        const slotVal = step.items[idx];
                        const active = step.activeIndices.includes(idx);
                        const isF = step.front === idx;
                        const isR = step.rear === idx;

                        // Midpoint for text
                        const textRad = angle * Math.PI / 180;
                        const xText = 360 + 90 * Math.cos(textRad);
                        const yText = 220 + 90 * Math.sin(textRad);

                        return (
                          <g key={idx}>
                            <line x1={xInner} y1={yInner} x2={xOuter} y2={yOuter} stroke="var(--border-color)" strokeWidth="1.5" />
                            <circle 
                              cx={xText} 
                              cy={yText} 
                              r="15" 
                              className={`sq-ring-slot ${active ? "active" : ""} ${slotVal ? "filled" : ""}`} 
                            />
                            <text x={xText} y={yText + 4} className="sq-ring-slot-text">{slotVal || idx}</text>
                            
                            {/* Pointers */}
                            {isF && (
                              <path 
                                d={`M 360 220 L ${360 + 60 * Math.cos(rad)} ${220 + 60 * Math.sin(rad)}`} 
                                className="sq-circular-pointer front-ptr"
                                markerEnd="url(#arrow)"
                              />
                            )}
                            {isR && (
                              <path 
                                d={`M 360 220 L ${360 + 60 * Math.cos(rad)} ${220 + 60 * Math.sin(rad)}`} 
                                className="sq-circular-pointer rear-ptr"
                                markerEnd="url(#arrow)"
                              />
                            )}
                          </g>
                        );
                      });
                    })()}
                    <text x="360" y="224" className="sq-center-circle-text">CIRCULAR</text>
                  </g>
                ) : !sandboxMode && (lessonId.includes("parentheses") || lessonId.includes("postfix")) ? (
                  // SCENARIO B: BRACKETS / PARSING SPECIAL LAYOUT
                  <g className="sq-parsing-vis">
                    {/* Render input character string scan */}
                    {step.expression && (
                      <g transform="translate(40, 60)">
                        <text x="0" y="-15" className="sq-vis-header-label">INPUT STRING</text>
                        {step.expression.map((c, idx) => {
                          const isScanned = step.exprIndex !== undefined && idx <= step.exprIndex;
                          const isActive = step.exprIndex === idx;
                          return (
                            <g key={idx} transform={`translate(${idx * 40}, 0)`}>
                              <rect 
                                x="0" 
                                y="0" 
                                width="34" 
                                height="34" 
                                rx="6" 
                                className={`sq-bracket-box ${isActive ? "active" : ""} ${isScanned ? "scanned" : ""}`} 
                              />
                              <text x="17" y="22" className="sq-bracket-text">{c}</text>
                              {isActive && <text x="17" y="48" className="sq-active-ptr-text">▲</text>}
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {/* Output Postfix Box */}
                    {step.outputStr !== undefined && (
                      <g transform="translate(40, 160)">
                        <text x="0" y="-12" className="sq-vis-header-label">CONVERTED OUTPUT</text>
                        <rect x="0" y="0" width="360" height="42" rx="8" className="sq-output-str-box" />
                        <text x="16" y="26" className="sq-output-str-text">
                          {step.outputStr || <tspan fill="var(--text-muted)">Empty output...</tspan>}
                        </text>
                      </g>
                    )}

                    {/* Stack container drawn vertically */}
                    <g transform="translate(490, 80)">
                      <text x="45" y="-15" className="sq-vis-header-label" textAnchor="middle">OPERATOR STACK</text>
                      <path d="M 10 0 V 240 H 80 V 0" className="sq-cup-outline" />
                      
                      {step.items.map((item, idx) => {
                        const active = step.activeIndices.includes(idx);
                        return (
                          <g key={idx} transform={`translate(16, ${200 - idx * 46})`}>
                            <rect 
                              x="0" 
                              y="0" 
                              width="48" 
                              height="36" 
                              rx="6" 
                              className={`sq-stack-block ${active ? "active" : ""}`} 
                            />
                            <text x="24" y="22" className="sq-stack-block-text">{item}</text>
                          </g>
                        );
                      })}
                      {step.items.length === 0 && (
                        <text x="45" y="125" className="sq-empty-buffer-text">EMPTY</text>
                      )}
                    </g>
                  </g>
                ) : !sandboxMode && (lessonId.includes("min-stack") || lessonId.includes("special-stack")) ? (
                  // SCENARIO C: DUAL MIN STACK
                  <g className="sq-min-stack-vis">
                    {/* Element Stack */}
                    <g transform="translate(180, 100)">
                      <text x="45" y="-20" className="sq-vis-header-label" textAnchor="middle">ELEMENT STACK</text>
                      <path d="M 10 0 V 220 H 80 V 0" className="sq-cup-outline" />
                      {step.items.map((item, idx) => {
                        const active = step.activeIndices.includes(idx);
                        return (
                          <g key={idx} transform={`translate(16, ${180 - idx * 46})`}>
                            <rect x="0" y="0" width="48" height="36" rx="6" className={`sq-stack-block ${active ? "active" : ""}`} />
                            <text x="24" y="22" className="sq-stack-block-text">{item}</text>
                          </g>
                        );
                      })}
                    </g>

                    {/* Min Stack */}
                    <g transform="translate(460, 100)">
                      <text x="45" y="-20" className="sq-vis-header-label" textAnchor="middle">MIN STACK</text>
                      <path d="M 10 0 V 220 H 80 V 0" className="sq-cup-outline" />
                      {step.minItems?.map((item, idx) => {
                        const active = step.activeIndices.includes(idx);
                        return (
                          <g key={idx} transform={`translate(16, ${180 - idx * 46})`}>
                            <rect x="0" y="0" width="48" height="36" rx="6" className={`sq-stack-block sq-min-block ${active ? "active" : ""}`} />
                            <text x="24" y="22" className="sq-stack-block-text">{item}</text>
                          </g>
                        );
                      })}
                    </g>
                  </g>
                ) : !sandboxMode && step.originalArray ? (
                  // SCENARIO D: MONOTONIC NGE ARRAY RENDER
                  <g className="sq-nge-vis">
                    {/* Original numbers array */}
                    <g transform="translate(40, 60)">
                      <text x="0" y="-15" className="sq-vis-header-label">ORIGINAL ARRAY (i)</text>
                      {step.originalArray.map((val, idx) => {
                        const isCurrent = step.currentIndex === idx;
                        const isPast = step.currentIndex !== undefined && idx < step.currentIndex;
                        return (
                          <g key={idx} transform={`translate(${idx * 55}, 0)`}>
                            <rect x="0" y="0" width="45" height="40" rx="6" className={`sq-nge-box ${isCurrent ? "active" : ""} ${isPast ? "passed" : ""}`} />
                            <text x="22" y="25" className="sq-nge-text">{val}</text>
                            <text x="22" y="-4" className="sq-nge-idx-text">idx:{idx}</text>
                            {isCurrent && <text x="22" y="55" className="sq-active-ptr-text">▲</text>}
                          </g>
                        );
                      })}
                    </g>

                    {/* Result Array */}
                    {(() => {
                      const resultArray = step.resultArray;
                      if (!resultArray) return null;
                      return (
                        <g transform="translate(40, 180)">
                          <text x="0" y="-15" className="sq-vis-header-label">NEXT GREATER VALUE</text>
                          {resultArray.map((val, idx) => {
                            const changed = resultArray[idx] !== -1;
                            return (
                              <g key={idx} transform={`translate(${idx * 55}, 0)`}>
                                <rect x="0" y="0" width="45" height="40" rx="6" className={`sq-nge-res-box ${changed ? "filled" : ""}`} />
                                <text x="22" y="25" className="sq-nge-res-text">{val}</text>
                              </g>
                            );
                          })}
                        </g>
                      );
                    })()}

                    {/* Monotonic stack */}
                    <g transform="translate(520, 80)">
                      <text x="45" y="-15" className="sq-vis-header-label" textAnchor="middle">MONOTONIC STACK</text>
                      <path d="M 10 0 V 220 H 80 V 0" className="sq-cup-outline" />
                      {step.items.map((item, idx) => {
                        const active = step.activeIndices.includes(idx);
                        return (
                          <g key={idx} transform={`translate(16, ${170 - idx * 46})`}>
                            <rect x="0" y="0" width="48" height="36" rx="6" className={`sq-stack-block ${active ? "active" : ""}`} />
                            <text x="24" y="22" className="sq-stack-block-text">{item.split(" ")[0]}</text>
                          </g>
                        );
                      })}
                      {step.items.length === 0 && (
                        <text x="45" y="120" className="sq-empty-buffer-text">EMPTY</text>
                      )}
                    </g>
                  </g>
                ) : (
                  // DEFAULT RENDER FOR SANDBOX OR SKELETON TRACES
                  <g className="sq-default-vis">
                    {/* Render standard visual container based on Type */}
                    {((sandboxMode && sandboxType === "stack") || (!sandboxMode && isStackLike)) ? (
                      // Visual vertical stack container
                      <g transform="translate(252, 54)">
                        {(() => {
                          const currentItems = sandboxMode ? sandboxItems : step.items;

                          return (
                            <>
                              <rect x="0" y="0" width="224" height="364" rx="30" className="sq-visual-card" />
                              <rect x="18" y="18" width="188" height="56" rx="20" className="sq-visual-header-card" />
                              <text x="34" y="40" className="sq-visual-overline">Graph-inspired view</text>
                              <text x="34" y="62" className="sq-visual-title">LIFO STACK</text>

                              <g transform="translate(26, 92)">
                                <rect x="0" y="0" width="172" height="248" rx="28" className="sq-stack-well" />
                                <path d="M 26 22 V 214" className="sq-cup-outline" />
                                <path d="M 146 22 V 214" className="sq-cup-outline" />
                                <path d="M 26 214 Q 86 234 146 214" className="sq-cup-outline" />
                                <text x="86" y="20" className="sq-capacity-label">push zone</text>

                                {currentItems.map((item, idx) => {
                                  const active = !sandboxMode && step.activeIndices.includes(idx);
                                  const isTop = idx === currentItems.length - 1;

                                  return (
                                    <g key={idx} transform={`translate(40, ${184 - idx * 46})`}>
                                      {isTop && <rect x="-10" y="-8" width="112" height="52" rx="18" className="sq-top-halo" />}
                                      <rect
                                        x="0"
                                        y="0"
                                        width="92"
                                        height="36"
                                        rx="14"
                                        className={`sq-stack-block ${active ? "active" : ""} ${isTop ? "sq-top-block" : ""}`}
                                        style={{ transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
                                      />
                                      <text x="46" y="22" className="sq-stack-block-text">{item}</text>
                                      {isTop && (
                                        <>
                                          <path d="M 100 18 H 122" className="sq-pointer-line sq-top-pointer" />
                                          <circle cx="126" cy="18" r="4" className="sq-pointer-dot sq-top-pointer-dot" />
                                          <text x="138" y="22" className="sq-top-label-arrow">TOP</text>
                                        </>
                                      )}
                                    </g>
                                  );
                                })}

                                {currentItems.length === 0 && (
                                  <g transform="translate(25, 74)">
                                    <rect x="0" y="0" width="122" height="92" rx="22" className="sq-empty-card" />
                                    <text x="61" y="42" className="sq-empty-buffer-text">STACK</text>
                                    <text x="61" y="62" className="sq-empty-buffer-subtext">Waiting for push()</text>
                                  </g>
                                )}
                              </g>
                            </>
                          );
                        })()}
                      </g>
                    ) : (
                      // Visual horizontal queue / deque / priority container
                      <g transform="translate(54, 112)">
                        {(() => {
                          const currentItems = sandboxMode ? sandboxItems : step.items;
                          const heading = (() => {
                            if (sandboxMode) {
                              return `${sandboxType.toUpperCase()} WORKSPACE`;
                            }
                            const topic = LESSON_TOPIC[lessonId] ?? "stack";
                            if (topic === "deque" || lessonId.includes("deque")) return "DOUBLE-ENDED QUEUE";
                            if (topic === "priority" || lessonId.includes("priority")) return "PRIORITY QUEUE";
                            return "FIFO QUEUE";
                          })();

                          return (
                            <>
                              <rect x="0" y="0" width="568" height="248" rx="30" className="sq-visual-card" />
                              <rect x="18" y="18" width="532" height="56" rx="20" className="sq-visual-header-card" />
                              <text x="34" y="40" className="sq-visual-overline">Graph-inspired flow</text>
                              <text x="34" y="62" className="sq-visual-title">{heading}</text>

                              <g transform="translate(30, 102)">
                                <rect x="0" y="0" width="500" height="92" rx="28" className="sq-queue-track" />
                                <line x1="28" y1="30" x2="472" y2="30" className="sq-queue-rail" />
                                <line x1="28" y1="62" x2="472" y2="62" className="sq-queue-rail" />
                                <path d="M 14 46 H 40" className="sq-pointer-line sq-rear-pointer" />
                                <path d="M 460 46 H 486" className="sq-pointer-line sq-front-pointer" />
                                <text x="8" y="18" className="sq-queue-badge-text rear-badge">ENQUEUE</text>
                                <text x="492" y="18" className="sq-queue-badge-text front-badge">DEQUEUE</text>

                                {currentItems.map((item, idx) => {
                                  const active = !sandboxMode && step.activeIndices.includes(idx);
                                  const isF = idx === 0;
                                  const isR = idx === currentItems.length - 1;

                                  return (
                                    <g key={idx} transform={`translate(${42 + idx * 72}, 26)`}>
                                      {(isF || isR) && (
                                        <rect x="-10" y="-12" width="76" height="60" rx="20" className={isF ? "sq-front-halo" : "sq-rear-halo"} />
                                      )}
                                      <rect
                                        x="0"
                                        y="0"
                                        width="56"
                                        height="40"
                                        rx="14"
                                        className={`sq-stack-block ${active ? "active" : ""} ${isF ? "sq-front-block" : ""} ${isR ? "sq-rear-block" : ""}`}
                                        style={{ transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
                                      />
                                      <text x="28" y="24" className="sq-stack-block-text">{item}</text>

                                      {isF && (
                                        <text x="28" y="-18" className="sq-queue-badge-text front-badge">Front</text>
                                      )}
                                      {isR && !isF && (
                                        <text x="28" y="-18" className="sq-queue-badge-text rear-badge">Rear</text>
                                      )}
                                    </g>
                                  );
                                })}

                                {currentItems.length === 0 && (
                                  <g transform="translate(154, 12)">
                                    <rect x="0" y="0" width="192" height="68" rx="22" className="sq-empty-card" />
                                    <text x="96" y="28" className="sq-empty-buffer-text">QUEUE EMPTY</text>
                                    <text x="96" y="48" className="sq-empty-buffer-subtext">Rear adds, front removes</text>
                                  </g>
                                )}
                              </g>
                            </>
                          );
                        })()}
                      </g>
                    )}
                  </g>
                )}
              </svg>

              {/* FLOATING GLASSMORPHIC PANELS */}
              
              {/* 1. Theory & Description Panel */}
              <div 
                style={{ left: panelPositions.definition.x, top: panelPositions.definition.y }}
                className="sq-glass-panel"
              >
                <div 
                  className="sq-panel-header" 
                  onPointerDown={(e) => handlePointerDown(e, "definition")}
                >
                  <div className="sq-panel-title">
                    <HelpCircle size={11} />
                    <span>Invariants</span>
                  </div>
                  <span className="sq-drag-handle">⠿</span>
                </div>
                <div className="sq-panel-body">
                  <p>{profile.definition}</p>
                </div>
              </div>

              {/* 2. Log Panel / Variables Panel */}
              {!sandboxMode ? (
                <div 
                  style={{ left: panelPositions.vars.x, top: panelPositions.vars.y }}
                  className="sq-glass-panel"
                >
                  <div 
                    className="sq-panel-header" 
                    onPointerDown={(e) => handlePointerDown(e, "vars")}
                  >
                    <div className="sq-panel-title">
                      <Activity size={11} />
                      <span>Variables</span>
                    </div>
                    <span className="sq-drag-handle">⠿</span>
                  </div>
                  <div className="sq-panel-body sq-vars-body">
                    {Object.entries(step?.vars || {}).map(([k, v]) => (
                      <div key={k} className="sq-var-row">
                        <span className="sq-var-key">{k}</span>
                        <strong className="sq-var-val">{String(v)}</strong>
                      </div>
                    ))}
                    {Object.keys(step?.vars || {}).length === 0 && (
                      <div className="sq-muted-text">No variables initialized.</div>
                    )}
                  </div>
                </div>
              ) : (
                // Sandbox Operations Log Panel
                <div 
                  style={{ left: panelPositions.log.x, top: panelPositions.log.y }}
                  className="sq-glass-panel"
                >
                  <div 
                    className="sq-panel-header" 
                    onPointerDown={(e) => handlePointerDown(e, "log")}
                  >
                    <div className="sq-panel-title">
                      <Terminal size={11} />
                      <span>Sandbox Log</span>
                    </div>
                    <span className="sq-drag-handle">⠿</span>
                  </div>
                  <div className="sq-panel-body sq-log-body">
                    {sandboxLog.map((log) => (
                      <div key={log.id} className="sq-log-row">
                        <span className="sq-log-time">{log.timestamp}</span>
                        <span className={`sq-log-badge ${log.type}`}>
                          {log.type.replace("_", " ").toUpperCase()}
                        </span>
                        {log.value && <strong className="sq-log-value">{log.value}</strong>}
                      </div>
                    ))}
                    {sandboxLog.length === 0 && (
                      <div className="sq-muted-text">Perform operations to see audit logs...</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right logic / Code tracker panel */}
            <div className="sq-code-shell">
              <CodeTracker code={profile.code} activeLine={step?.line || 0} theme={theme} />
            </div>
          </div>
        </div>
      </section>

      {/* Styled JSX Vanilla CSS styling */}
      <style jsx>{`
        .sq-page { 
          --bg: var(--bg-primary); 
          --panel: var(--bg-secondary); 
          --panel-elevated: var(--bg-elevated); 
          --border: var(--border-color); 
          --text: var(--text-primary); 
          --muted: var(--text-secondary); 
          --accent: var(--accent-vibrant);
          --accent-soft: var(--accent-soft);
          --accent-glow: var(--accent-glow);
          background: var(--bg); 
          color: var(--text); 
          min-height: 100vh;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          transition: background 0.3s, color 0.3s;
        }

        .sq-hero { 
          padding: 80px 48px 36px; 
          border-bottom: 1px solid var(--border); 
          background: linear-gradient(180deg, var(--panel) 0%, transparent 100%);
        }

        .sq-content-width { 
          max-width: 1280px; 
          margin: 0 auto; 
        }

        .sq-eyebrow { 
          color: var(--muted); 
          font-size: 11px; 
          font-weight: 900; 
          letter-spacing: 0.18em; 
          text-transform: uppercase; 
        }

        .sq-hero h1 { 
          margin: 12px 0 16px; 
          font-size: clamp(36px, 6vw, 64px); 
          font-weight: 900; 
          letter-spacing: -0.02em; 
          line-height: 0.95; 
        }

        .sq-description { 
          font-size: 16px; 
          max-width: 840px; 
          margin-bottom: 28px; 
          line-height: 1.6; 
          color: var(--muted); 
        }

        .sq-tag-group { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 12px; 
        }

        .sq-tag { 
          border: 1px solid var(--border); 
          background: var(--panel); 
          padding: 10px 16px; 
          border-radius: 8px; 
          display: flex; 
          flex-direction: column; 
          min-width: 130px; 
        }

        .sq-tag span { 
          font-size: 9px; 
          text-transform: uppercase; 
          letter-spacing: 0.08em; 
          color: var(--muted); 
        }

        .sq-tag strong { 
          font-size: 15px; 
          color: var(--text); 
          margin-top: 2px;
        }

        .sq-simulator { 
          padding: 24px 36px 80px; 
        }

        .sq-workspace { 
          max-width: 1280px; 
          margin: 0 auto; 
          display: grid; 
          grid-template-columns: 290px 1fr; 
          gap: 24px; 
        }

        .sq-sidebar { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          min-width: 0; 
        }

        .sq-mode-tabs { 
          display: flex; 
          border: 1px solid var(--border); 
          border-radius: 8px; 
          background: var(--panel); 
          padding: 3px; 
        }

        .sq-mode-tabs button { 
          flex: 1; 
          background: transparent; 
          border: 0; 
          color: var(--muted); 
          font-size: 11px; 
          font-weight: 800; 
          padding: 8px 4px; 
          border-radius: 6px; 
          cursor: pointer; 
          transition: all 0.2s;
        }

        .sq-mode-tabs button.active { 
          background: var(--panel-elevated); 
          color: var(--text); 
          box-shadow: 0 2px 8px rgba(0,0,0,0.08); 
        }

        .sq-panel-inner { 
          border: 1px solid var(--border); 
          background: var(--panel); 
          border-radius: 12px; 
          padding: 18px; 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
        }

        .sq-meta-label { 
          font-size: 9px; 
          font-weight: 900; 
          text-transform: uppercase; 
          letter-spacing: 0.1em; 
          color: var(--muted); 
        }

        .sq-panel-inner h3 { 
          margin: 0; 
          font-size: 17px; 
          font-weight: 900; 
          letter-spacing: -0.01em; 
        }

        .sq-step-desc { 
          font-size: 12.5px; 
          color: var(--muted); 
          line-height: 1.5; 
          min-height: 56px; 
          margin: 0; 
        }

        .sq-controls-row { 
          display: flex; 
          gap: 8px; 
          align-items: center; 
        }

        .sq-btn-circle { 
          width: 32px; 
          height: 32px; 
          border-radius: 50%; 
          border: 1px solid var(--border); 
          background: var(--panel-elevated); 
          color: var(--text); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          transition: background 0.2s;
        }

        .sq-btn-circle:hover { 
          background: var(--border); 
        }

        .sq-btn-play { 
          background: var(--text); 
          color: var(--bg); 
          border-color: var(--text);
        }

        .sq-btn-play:hover { 
          opacity: 0.9; 
          background: var(--text);
        }

        .sq-btn-text { 
          border: 1px solid var(--border); 
          background: transparent; 
          color: var(--text); 
          font-size: 11px; 
          font-weight: 700; 
          border-radius: 6px; 
          padding: 0 12px; 
          height: 32px; 
          cursor: pointer; 
        }

        .sq-btn-text:hover { 
          background: var(--accent-soft); 
        }

        .sq-slider-container { 
          display: flex; 
          flex-direction: column; 
          gap: 6px; 
        }

        .sq-slider-header { 
          display: flex; 
          justify-content: space-between; 
          font-size: 11px; 
          color: var(--muted); 
        }

        .sq-slider-container input, .sq-timeline-container input { 
          width: 100%; 
          accent-color: var(--text); 
          cursor: pointer; 
        }

        .sq-timeline-container { 
          display: flex; 
          flex-direction: column; 
          gap: 6px; 
          border-top: 1px solid var(--border); 
          padding-top: 12px; 
        }

        .sq-input-card { 
          border: 1px solid var(--border); 
          border-radius: 10px; 
          padding: 12px; 
          background: var(--panel-elevated); 
        }

        .sq-input-group { 
          display: flex; 
          gap: 6px; 
          margin-top: 8px; 
        }

        .sq-field { 
          flex: 1; 
          background: var(--bg); 
          border: 1px solid var(--border); 
          border-radius: 6px; 
          padding: 0 8px; 
          height: 32px; 
          font-size: 12px; 
          color: var(--text); 
          outline: none; 
        }

        .sq-wide-field { 
          width: 100%; 
          margin-top: 8px; 
        }

        .sq-btn-action { 
          background: var(--text); 
          color: var(--bg); 
          border: 0; 
          border-radius: 6px; 
          font-weight: 800; 
          font-size: 11px; 
          padding: 0 12px; 
          height: 32px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 4px; 
        }

        .sq-btn-action:hover { 
          opacity: 0.9; 
        }

        .sq-warn-btn { 
          background: transparent; 
          border: 1px solid var(--border); 
          color: var(--text); 
        }

        .sq-warn-btn:hover { 
          background: rgba(220, 38, 38, 0.1); 
          border-color: rgb(220, 38, 38); 
          color: rgb(220, 38, 38);
        }

        .sq-tip-text { 
          font-size: 10px; 
          color: var(--muted); 
          margin-top: 6px; 
          display: block; 
        }

        .sq-structure-selector { 
          display: flex; 
          flex-direction: column; 
          gap: 8px; 
          background: var(--panel-elevated); 
          padding: 10px; 
          border-radius: 8px; 
        }

        .sq-radio-item { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          font-size: 12px; 
          cursor: pointer; 
        }

        .sq-radio-item input { 
          accent-color: var(--text); 
        }

        .sq-sandbox-actions { 
          display: flex; 
          gap: 8px; 
          margin-top: 10px; 
        }

        .sq-deque-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 6px; 
          width: 100%; 
        }

        .sq-deque-grid button { 
          justify-content: center; 
        }

        .sq-clear-btn { 
          width: 100%; 
          margin-top: 10px; 
        }

        .sq-info-card { 
          border: 1px solid var(--border); 
          background: var(--panel); 
          border-radius: 12px; 
          padding: 16px; 
        }

        .sq-bullet-row { 
          display: flex; 
          gap: 8px; 
          font-size: 12px; 
          color: var(--muted); 
          margin-top: 8px; 
          line-height: 1.45; 
        }

        .sq-bullet { 
          color: var(--text); 
        }

        .sq-canvas-shell { 
          display: grid; 
          grid-template-columns: 1fr 280px; 
          gap: 16px; 
          min-width: 0; 
        }

        .sq-canvas-relative { 
          position: relative; 
          background: var(--panel); 
          border: 1px solid var(--border); 
          border-radius: 16px; 
          overflow: hidden; 
          min-height: 520px; 
          height: 100%; 
          user-select: none; 
        }

        .sq-svg-canvas { 
          width: 100%; 
          height: 100%; 
          min-height: 520px; 
        }

        .sq-grid-lines line { 
          opacity: 0.4; 
        }

        .sq-vis-header-label { 
          font-size: 10px; 
          font-weight: 900; 
          letter-spacing: 0.12em; 
          fill: var(--muted); 
        }

        .sq-visual-card {
          fill: color-mix(in srgb, var(--panel) 90%, transparent);
          stroke: color-mix(in srgb, var(--border) 88%, var(--accent) 12%);
          stroke-width: 1.5;
        }

        .sq-visual-header-card {
          fill: color-mix(in srgb, var(--panel-elevated) 92%, transparent);
          stroke: color-mix(in srgb, var(--border) 84%, var(--accent) 16%);
          stroke-width: 1.5;
        }

        .sq-visual-overline {
          fill: var(--muted);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .sq-visual-title {
          fill: var(--text);
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .sq-stack-well {
          fill: color-mix(in srgb, var(--bg) 84%, var(--panel-elevated) 16%);
          stroke: color-mix(in srgb, var(--border) 80%, var(--accent) 20%);
          stroke-width: 1.5;
        }

        .sq-queue-track {
          fill: color-mix(in srgb, var(--bg) 78%, var(--panel-elevated) 22%);
          stroke: color-mix(in srgb, var(--border) 80%, var(--accent) 20%);
          stroke-width: 1.5;
        }

        .sq-queue-rail {
          stroke: color-mix(in srgb, var(--border) 70%, var(--muted) 30%);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-dasharray: 8 8;
        }

        .sq-capacity-label {
          fill: var(--muted);
          font-size: 9px;
          font-weight: 800;
          text-anchor: middle;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* SVG Cup Stack */
        .sq-cup-outline { 
          fill: none; 
          stroke: var(--border); 
          stroke-width: 3; 
          stroke-linecap: round; 
        }

        .sq-stack-block { 
          fill: color-mix(in srgb, var(--panel-elevated) 90%, transparent); 
          stroke: color-mix(in srgb, var(--border) 78%, var(--text) 22%); 
          stroke-width: 1.5; 
          cursor: grab;
        }

        .sq-stack-block.active { 
          fill: color-mix(in srgb, var(--accent-soft) 72%, var(--panel-elevated) 28%); 
          stroke: var(--accent); 
          stroke-width: 2.5; 
        }

        .sq-top-block { 
          fill: color-mix(in srgb, var(--accent-soft) 82%, var(--panel-elevated) 18%);
          stroke: var(--accent); 
          stroke-width: 2.4; 
        }

        .sq-front-block {
          fill: color-mix(in srgb, var(--text) 12%, var(--panel-elevated) 88%);
          stroke: var(--text);
          stroke-width: 2.2;
        }

        .sq-rear-block {
          stroke: color-mix(in srgb, var(--accent) 52%, var(--border) 48%);
        }

        .sq-top-halo,
        .sq-front-halo,
        .sq-rear-halo {
          stroke: none;
        }

        .sq-top-halo {
          fill: color-mix(in srgb, var(--accent-soft) 34%, transparent);
        }

        .sq-front-halo {
          fill: color-mix(in srgb, var(--text) 9%, transparent);
        }

        .sq-rear-halo {
          fill: color-mix(in srgb, var(--accent-soft) 22%, transparent);
        }

        .sq-stack-block-text { 
          fill: var(--text); 
          font-size: 13px; 
          font-weight: 800; 
          text-anchor: middle; 
        }

        .sq-top-label-arrow { 
          fill: var(--accent); 
          font-size: 10px; 
          font-weight: 900; 
          text-transform: uppercase; 
          letter-spacing: 0.08em; 
        }

        .sq-pointer-line {
          fill: none;
          stroke-width: 2.5;
          stroke-linecap: round;
        }

        .sq-top-pointer,
        .sq-front-pointer {
          stroke: var(--text);
        }

        .sq-rear-pointer {
          stroke: var(--accent);
        }

        .sq-pointer-dot {
          stroke: none;
        }

        .sq-top-pointer-dot {
          fill: var(--accent);
        }

        .sq-empty-buffer-text { 
          fill: var(--muted); 
          font-size: 10px; 
          font-weight: 900; 
          text-anchor: middle; 
          letter-spacing: 0.1em; 
        }

        .sq-empty-card {
          fill: color-mix(in srgb, var(--panel-elevated) 70%, transparent);
          stroke: color-mix(in srgb, var(--border) 78%, var(--accent) 22%);
          stroke-width: 1.5;
          stroke-dasharray: 6 8;
        }

        .sq-empty-buffer-subtext {
          fill: var(--muted);
          font-size: 10px;
          text-anchor: middle;
        }

        /* Bracket Box parsing style */
        .sq-bracket-box { 
          fill: var(--panel-elevated); 
          stroke: var(--border); 
          stroke-width: 1.5; 
        }

        .sq-bracket-box.scanned { 
          opacity: 0.5; 
        }

        .sq-bracket-box.active { 
          fill: var(--accent-soft); 
          stroke: var(--text); 
          stroke-width: 2.5; 
          opacity: 1; 
        }

        .sq-bracket-text { 
          fill: var(--text); 
          font-size: 15px; 
          font-weight: 900; 
          text-anchor: middle; 
        }

        .sq-active-ptr-text { 
          fill: var(--text); 
          font-size: 11px; 
          text-anchor: middle; 
        }

        .sq-output-str-box { 
          fill: var(--bg); 
          stroke: var(--border); 
          stroke-width: 1.5; 
        }

        .sq-output-str-text { 
          fill: var(--text); 
          font-size: 14px; 
          font-weight: 900; 
          font-family: monospace; 
        }

        /* Radial circular visualization */
        .sq-ring-back { 
          fill: none; 
          stroke: var(--border); 
          stroke-width: 8; 
          opacity: 0.5; 
        }

        .sq-ring-inner { 
          fill: none; 
          stroke: var(--border); 
          stroke-width: 2; 
        }

        .sq-ring-slot { 
          fill: var(--bg); 
          stroke: var(--border); 
          stroke-width: 1.5; 
          transition: all 0.3s;
        }

        .sq-ring-slot.filled { 
          fill: var(--panel-elevated); 
        }

        .sq-ring-slot.active { 
          stroke: var(--text); 
          fill: var(--accent-soft); 
          stroke-width: 2.5; 
        }

        .sq-ring-slot-text { 
          fill: var(--text); 
          font-size: 10px; 
          font-weight: 900; 
          text-anchor: middle; 
        }

        .sq-circular-pointer { 
          fill: none; 
          stroke-width: 2.5; 
          stroke-linecap: round; 
        }

        .front-ptr { 
          stroke: var(--text); 
        }

        .rear-ptr { 
          stroke: var(--muted); 
          stroke-dasharray: 4,3; 
        }

        .sq-center-circle-text { 
          fill: var(--muted); 
          font-size: 10px; 
          font-weight: 900; 
          text-anchor: middle; 
          letter-spacing: 0.12em; 
        }

        /* NGE / Monotonic grid visualization */
        .sq-nge-box { 
          fill: var(--panel-elevated); 
          stroke: var(--border); 
          stroke-width: 1.5; 
        }

        .sq-nge-box.active { 
          fill: var(--accent-soft); 
          stroke: var(--text); 
          stroke-width: 2.5; 
        }

        .sq-nge-box.passed { 
          opacity: 0.5; 
        }

        .sq-nge-text { 
          fill: var(--text); 
          font-size: 15px; 
          font-weight: 900; 
          text-anchor: middle; 
        }

        .sq-nge-idx-text { 
          fill: var(--muted); 
          font-size: 9px; 
          font-weight: 800; 
          text-anchor: middle; 
        }

        .sq-nge-res-box { 
          fill: var(--bg); 
          stroke: var(--border); 
          stroke-width: 1.5; 
        }

        .sq-nge-res-box.filled { 
          fill: var(--panel-elevated); 
        }

        .sq-nge-res-text { 
          fill: var(--text); 
          font-size: 14px; 
          font-weight: 900; 
          text-anchor: middle; 
        }

        /* Dual Min Stack style */
        .sq-min-block { 
          stroke: var(--border); 
        }

        /* Glassmorphic Panel Design */
        .sq-glass-panel { 
          position: absolute; 
          width: 260px; 
          background: rgba(var(--bg-primary), 0.75); 
          backdrop-filter: blur(12px); 
          border: 1px solid var(--border); 
          border-radius: 12px; 
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.15); 
          overflow: hidden; 
          z-index: 10; 
        }

        .sq-panel-header { 
          background: var(--panel-elevated); 
          padding: 6px 10px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          border-bottom: 1px solid var(--border); 
          cursor: grab; 
        }

        .sq-panel-header:active { 
          cursor: grabbing; 
        }

        .sq-panel-title { 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          font-size: 9.5px; 
          font-weight: 900; 
          text-transform: uppercase; 
          letter-spacing: 0.08em; 
          color: var(--text); 
        }

        .sq-drag-handle { 
          font-size: 10px; 
          color: var(--muted); 
        }

        .sq-panel-body { 
          padding: 10px 12px; 
          font-size: 11px; 
          line-height: 1.45; 
          color: var(--muted); 
        }

        .sq-panel-body p { 
          margin: 0; 
        }

        .sq-vars-body { 
          display: flex; 
          flex-direction: column; 
          gap: 6px; 
        }

        .sq-var-row { 
          display: flex; 
          justify-content: space-between; 
          border-bottom: 1px solid var(--border); 
          padding-bottom: 4px; 
        }

        .sq-var-row:last-child { 
          border-bottom: 0; 
        }

        .sq-var-key { 
          color: var(--muted); 
          font-family: monospace; 
        }

        .sq-var-val { 
          color: var(--text); 
          font-family: monospace; 
        }

        .sq-log-body { 
          display: flex; 
          flex-direction: column; 
          gap: 6px; 
          max-height: 130px; 
          overflow-y: auto; 
        }

        .sq-log-row { 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          font-size: 9.5px; 
          border-bottom: 1px solid var(--border); 
          padding-bottom: 4px; 
        }

        .sq-log-time { 
          color: var(--muted); 
        }

        .sq-log-badge { 
          font-weight: 900; 
          padding: 1px 4px; 
          border-radius: 4px; 
          font-size: 8px; 
          background: var(--border); 
          color: var(--text); 
        }

        .sq-log-badge.push, .sq-log-badge.enqueue, .sq-log-badge.push_front { 
          background: rgba(16, 185, 129, 0.15); 
          color: rgb(16, 185, 129); 
        }

        .sq-log-badge.pop, .sq-log-badge.dequeue, .sq-log-badge.pop_back { 
          background: rgba(239, 68, 68, 0.15); 
          color: rgb(239, 68, 68); 
        }

        .sq-log-badge.clear { 
          background: rgba(245, 158, 11, 0.15); 
          color: rgb(245, 158, 11); 
        }

        .sq-log-value { 
          font-family: monospace; 
          color: var(--text); 
        }

        .sq-muted-text { 
          color: var(--muted); 
          font-style: italic; 
        }

        /* Queue horizontal visualization helper classes */
        .sq-queue-badge-text { 
          fill: var(--muted); 
          font-size: 9px; 
          font-weight: 900; 
          text-anchor: middle; 
          text-transform: uppercase; 
          letter-spacing: 0.05em; 
        }

        .front-badge { 
          fill: var(--text); 
        }

        .rear-badge {
          fill: var(--accent);
        }

        .sq-code-shell { 
          border: 1px solid var(--border); 
          border-radius: 16px; 
          overflow: hidden; 
          height: 100%; 
          min-height: 520px; 
        }

        @media (max-width: 1120px) { 
          .sq-canvas-shell { 
            grid-template-columns: 1fr; 
          } 
          .sq-code-shell { 
            min-height: 320px; 
          } 
        }

        @media (max-width: 960px) { 
          .sq-workspace { 
            grid-template-columns: 1fr; 
          } 
        }

        @media (max-width: 600px) { 
          .sq-simulator { 
            padding: 16px; 
          } 
        }
      `}</style>
    </main>
  );
}
