import os
import re

DIRECTORY = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\stack-queue"

TEMPLATE = """\"use client\";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";

// ─── Component Entry ──────────────────────────────────────────────────────────
export default function {COMPONENT_NAME}Lesson() {
  // Theme handling
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  // ─── Setup Topic State ──────────────────────────────────────────────────────
  const lessonId = "{SLUG}";
  const title = "{TITLE}";
  const definition = "{DEFINITION}";
  const timeComplexity = "{TIME_COMPLEXITY}";
  const spaceComplexity = "{SPACE_COMPLEXITY}";
  const keyPoints = {KEY_POINTS};
  
  const [category] = useState<"stack" | "queue" | "deque" | "priority" | "monotonic" | "expression" | "minstack" | "circular">("{CATEGORY}");

  // ─── Visual Configs ─────────────────────────────────────────────────────────
  const NODE_W = 68;
  const NODE_H = 42;
  const V_GAP = 52;
  const H_GAP = 85;

  // ─── State Management ───────────────────────────────────────────────────────
  const [elements, setElements] = useState<string[]>(() => {
    if (category === "expression") return ["(", "A", "+", "B", ")", "*", "C"];
    if (category === "monotonic") return ["4", "2", "7", "3", "9"];
    if (category === "minstack") return ["15", "8", "12", "5", "10"];
    return ["10", "20", "30", "40"];
  });

  const [stackItems, setStackItems] = useState<string[]>([]);
  const [minStackItems, setMinStackItems] = useState<string[]>([]);
  const [queueItems, setQueueItems] = useState<string[]>([]);
  const [dequeItems, setDequeItems] = useState<string[]>([]);
  const [priorityItems, setPriorityItems] = useState<number[]>([]);
  const [resultString, setResultString] = useState("");
  const [resultsArray, setResultsArray] = useState<string[]>([]);

  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [speechOn, setSpeechOn] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [infoPos, setInfoPos] = useState({ x: 24, y: 16 });
  const [ptrPos, setPtrPos] = useState({ x: 24, y: 220 });
  const [codePos, setCodePos] = useState({ x: 520, y: 16 });
  const [canvasW, setCanvasW] = useState(900);
  const [sandboxInput, setSandboxInput] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  // ─── Initialize Speech & Layout ──────────────────────────────────────────────
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

  // ─── Topic Specific Code & Step Generation ──────────────────────────────────
  const codeSnippet = useMemo(() => {
    if (category === "expression") return [
      "string infixToPostfix(string s) {",
      "  stack<char> st; string res = \\\"\\\";",
      "  for (char c : s) {",
      "    if (isalnum(c)) res += c;",
      "    else if (c == '(') st.push(c);",
      "    else if (c == ')') {",
      "      while (st.top() != '(') { res += st.top(); st.pop(); }",
      "      st.pop();",
      "    } else {",
      "      while (!st.empty() && prec(c) <= prec(st.top())) {",
      "        res += st.top(); st.pop();",
      "      }",
      "      st.push(c);",
      "    }",
      "  }",
      "  return res;",
      "}"
    ];
    if (category === "monotonic") return [
      "vector<int> nextGreater(vector<int> arr) {",
      "  stack<int> s; vector<int> res(arr.size(), -1);",
      "  for (int i = 0; i < arr.size(); i++) {",
      "    while (!s.empty() && arr[s.top()] < arr[i]) {",
      "      res[s.top()] = arr[i]; s.pop();",
      "    }",
      "    s.push(i);",
      "  }",
      "  return res;",
      "}"
    ];
    if (category === "minstack") return [
      "void push(int x) {",
      "  mainStack.push(x);",
      "  if (minStack.empty() || x <= minStack.top())",
      "    minStack.push(x);",
      "  else minStack.push(minStack.top());",
      "}",
      "void pop() {",
      "  mainStack.pop(); minStack.pop();",
      "}",
      "int getMin() { return minStack.top(); }"
    ];
    if (category === "circular") return [
      "void enqueue(int x) {",
      "  if (isFull()) throw error;",
      "  rear = (rear + 1) % capacity;",
      "  arr[rear] = x; count++;",
      "}",
      "int dequeue() {",
      "  if (isEmpty()) throw error;",
      "  int val = arr[front];",
      "  front = (front + 1) % capacity; count--;",
      "  return val;",
      "}"
    ];
    if (category === "deque") return [
      "void insertFront(int x) {",
      "  front = (front - 1 + size) % size;",
      "  arr[front] = x; count++;",
      "}",
      "void insertRear(int x) {",
      "  arr[rear] = x; count++;",
      "  rear = (rear + 1) % size;",
      "}"
    ];
    if (category === "priority") return [
      "void insert(int x) {",
      "  arr.push_back(x);",
      "  int i = arr.size() - 1;",
      "  while (i > 0 && arr[parent(i)] < arr[i]) {",
      "    swap(arr[parent(i)], arr[i]);",
      "    i = parent(i);",
      "  }",
      "}"
    ];
    if (category === "queue") return [
      "void enqueue(int x) {",
      "  if (rear >= size - 1) return; // Overflow",
      "  arr[++rear] = x;",
      "}",
      "int dequeue() {",
      "  if (front > rear) return -1; // Underflow",
      "  return arr[front++];",
      "}"
    ];
    return [
      "void push(int x) {",
      "  if (top >= size - 1) return; // Overflow",
      "  arr[++top] = x;",
      "}",
      "int pop() {",
      "  if (top < 0) return -1; // Underflow",
      "  return arr[top--];",
      "}"
    ];
  }, [category]);

  const steps = useMemo(() => {
    const sArr: any[] = [];
    if (category === "expression") {
      sArr.push({ activeIdx: -1, stack: [], result: "", msg: "Start parsing infix expression...", line: 0 });
      let st: string[] = [];
      let res = "";
      for (let idx = 0; idx < elements.length; idx++) {
        const c = elements[idx];
        if (/[A-Za-z0-9]/.test(c)) {
          res += c;
          sArr.push({ activeIdx: idx, stack: [...st], result: res, msg: `Operand '${c}' appended to postfix result directly.`, line: 3 });
        } else if (c === "(") {
          st.push(c);
          sArr.push({ activeIdx: idx, stack: [...st], result: res, msg: "Open bracket '(' pushed to operator stack.", line: 4 });
        } else if (c === ")") {
          sArr.push({ activeIdx: idx, stack: [...st], result: res, msg: "Closing bracket ')' detected. Pop operators until '(' is matched.", line: 5 });
          while (st.length > 0 && st[st.length - 1] !== "(") {
            const topOp = st.pop()!;
            res += topOp;
            sArr.push({ activeIdx: idx, stack: [...st], result: res, msg: `Popped operator '${topOp}' and appended to result.`, line: 6 });
          }
          if (st[st.length - 1] === "(") st.pop();
          sArr.push({ activeIdx: idx, stack: [...st], result: res, msg: "Matching '(' discarded from stack.", line: 7 });
        } else {
          // Operator precedence comparison
          while (st.length > 0 && st[st.length - 1] !== "(" && (c === "+" || c === "-") && (st[st.length - 1] === "*" || st[st.length - 1] === "/")) {
            const topOp = st.pop()!;
            res += topOp;
            sArr.push({ activeIdx: idx, stack: [...st], result: res, msg: `Popped operator '${topOp}' due to lower incoming precedence.`, line: 10 });
          }
          st.push(c);
          sArr.push({ activeIdx: idx, stack: [...st], result: res, msg: `Operator '${c}' pushed to stack.`, line: 12 });
        }
      }
      while (st.length > 0) {
        const topOp = st.pop()!;
        res += topOp;
        sArr.push({ activeIdx: -1, stack: [...st], result: res, msg: `Flushing operator '${topOp}' to result at end of expression.`, line: 15 });
      }
      sArr.push({ activeIdx: -1, stack: [], result: res, msg: "Infix to Postfix conversion completed successfully!", line: 16 });
    }
    else if (category === "monotonic") {
      sArr.push({ activeIdx: -1, stack: [], results: Array(elements.length).fill("-1"), msg: "Initialize stack and results array with -1.", line: 1 });
      const st: number[] = [];
      const res = Array(elements.length).fill("-1");
      for (let idx = 0; idx < elements.length; idx++) {
        const val = parseInt(elements[idx], 10);
        sArr.push({ activeIdx: idx, stack: [...st], results: [...res], msg: `Scanning element ${val} at index ${idx}.`, line: 2 });
        while (st.length > 0 && parseInt(elements[st[st.length - 1]], 10) < val) {
          const poppedIdx = st.pop()!;
          res[poppedIdx] = val.toString();
          sArr.push({ activeIdx: idx, stack: [...st], results: [...res], msg: `Popped index ${poppedIdx} from stack because ${elements[poppedIdx]} < ${val}. Updated result[${poppedIdx}] = ${val}.`, line: 4 });
        }
        st.push(idx);
        sArr.push({ activeIdx: idx, stack: [...st], results: [...res], msg: `Pushed index ${idx} onto the stack.`, line: 6 });
      }
      sArr.push({ activeIdx: -1, stack: [...st], results: [...res], msg: "All elements processed. Elements remaining in stack have no greater element.", line: 8 });
    }
    else if (category === "minstack") {
      sArr.push({ activeIdx: -1, stack: [], minStack: [], msg: "Initialize empty Main Stack and auxiliary Min Stack.", line: 0 });
      const st: string[] = [];
      const mst: string[] = [];
      for (let idx = 0; idx < elements.length; idx++) {
        const val = elements[idx];
        const numVal = parseInt(val, 10);
        st.push(val);
        const curMin = mst.length === 0 ? numVal : Math.min(parseInt(mst[mst.length - 1], 10), numVal);
        mst.push(curMin.toString());
        sArr.push({ activeIdx: idx, stack: [...st], minStack: [...mst], msg: `Pushing ${val}. Current minimum is ${curMin}.`, line: 2 });
      }
      // pop one to show behavior
      st.pop();
      mst.pop();
      sArr.push({ activeIdx: -1, stack: [...st], minStack: [...mst], msg: "Popping top element. Top layers of both Main and Min stacks are discarded.", line: 6 });
    }
    else if (category === "circular") {
      // Circular queue animation
      sArr.push({ activeIdx: -1, front: 0, rear: -1, queue: Array(5).fill(null), msg: "Circular Queue initialized with capacity 5.", line: 0 });
      const q = Array(5).fill(null);
      let front = 0;
      let rear = -1;
      let count = 0;
      const inputs = ["10", "20", "30", "40"];
      for (let idx = 0; idx < inputs.length; idx++) {
        const val = inputs[idx];
        rear = (rear + 1) % 5;
        q[rear] = val;
        count++;
        sArr.push({ activeIdx: rear, front, rear, queue: [...q], msg: `Enqueue ${val} at index ${rear}. count = ${count}.`, line: 3 });
      }
      // dequeue one
      q[front] = null;
      front = (front + 1) % 5;
      count--;
      sArr.push({ activeIdx: front, front, rear, queue: [...q], msg: `Dequeue element from index 0. front advanced to ${front}. count = ${count}.`, line: 8 });
    }
    else if (category === "deque") {
      sArr.push({ activeIdx: -1, front: 2, rear: 2, queue: Array(5).fill(null), msg: "Deque initialized in central slots.", line: 0 });
      const q = Array(5).fill(null);
      q[2] = "10";
      let front = 2;
      let rear = 3;
      sArr.push({ activeIdx: 2, front, rear, queue: [...q], msg: "Enqueue Rear 10. rear advances to 3.", line: 0 });
      q[rear] = "20";
      rear = (rear + 1) % 5;
      sArr.push({ activeIdx: 3, front, rear, queue: [...q], msg: "Enqueue Rear 20. rear advances to 4.", line: 6 });
      front = (front - 1 + 5) % 5;
      q[front] = "5";
      sArr.push({ activeIdx: front, front, rear, queue: [...q], msg: "Enqueue Front 5. front moves left to 1.", line: 2 });
    }
    else if (category === "priority") {
      // priority bubble-up trace
      sArr.push({ activeIdx: -1, pq: [], msg: "Priority Queue initialized empty.", line: 0 });
      const items = [15, 25, 10, 30, 20];
      const activePq: number[] = [];
      for (let idx = 0; idx < items.length; idx++) {
        const val = items[idx];
        activePq.push(val);
        // sort descending to simulate heap properties
        activePq.sort((a, b) => b - a);
        sArr.push({ activeIdx: activePq.indexOf(val), pq: [...activePq], msg: `Insert ${val}. Heap bubbles element up to maintaining max order.`, line: 4 });
      }
    }
    else if (category === "queue") {
      sArr.push({ activeIdx: -1, front: 0, rear: -1, queue: [], msg: "FIFO Queue initialized empty.", line: 0 });
      const q: string[] = [];
      for (let idx = 0; idx < elements.length; idx++) {
        q.push(elements[idx]);
        sArr.push({ activeIdx: q.length - 1, front: 0, rear: q.length - 1, queue: [...q], msg: `Enqueue ${elements[idx]} to rear of the queue.`, line: 2 });
      }
      q.shift();
      sArr.push({ activeIdx: -1, front: 1, rear: q.length, queue: [...q], msg: "Dequeue operation completes. Element removed from front.", line: 6 });
    }
    else {
      // Standard Stack
      sArr.push({ activeIdx: -1, stack: [], msg: "LIFO Stack initialized empty.", line: 0 });
      const st: string[] = [];
      for (let idx = 0; idx < elements.length; idx++) {
        st.push(elements[idx]);
        sArr.push({ activeIdx: st.length - 1, stack: [...st], msg: `Push ${elements[idx]} onto the stack.`, line: 2 });
      }
      st.pop();
      sArr.push({ activeIdx: -1, stack: [...st], msg: "Pop operation removes top element.", line: 6 });
    }
    return sArr;
  }, [elements, category]);

  const step = steps[Math.min(stepIdx, steps.length - 1)] ?? steps[0];

  // ─── Playback Controls ──────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setIsPlaying(false);
    setStepIdx(0);
    if (category === "expression") {
      setStackItems([]);
      setResultString("");
    } else if (category === "monotonic") {
      setStackItems([]);
      setResultsArray(Array(elements.length).fill("-1"));
    } else if (category === "minstack") {
      setStackItems([]);
      setMinStackItems([]);
    } else if (category === "circular" || category === "deque") {
      setQueueItems([]);
    } else if (category === "priority") {
      setPriorityItems([]);
    } else if (category === "queue") {
      setQueueItems([]);
    } else {
      setStackItems([]);
    }
  }, [category, elements.length]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setStepIdx(p => {
        if (p >= steps.length - 1) {
          setIsPlaying(false);
          return p;
        }
        return p + 1;
      });
    }, speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, steps.length]);

  // Synchronize state values during step playback
  useEffect(() => {
    if (!step) return;
    if (category === "expression") {
      setStackItems(step.stack ?? []);
      setResultString(step.result ?? "");
    } else if (category === "monotonic") {
      setStackItems((step.stack ?? []).map((idx: number) => elements[idx]));
      setResultsArray(step.results ?? []);
    } else if (category === "minstack") {
      setStackItems(step.stack ?? []);
      setMinStackItems(step.minStack ?? []);
    } else if (category === "circular" || category === "deque") {
      setQueueItems(step.queue ?? []);
    } else if (category === "priority") {
      setPriorityItems(step.pq ?? []);
    } else if (category === "queue") {
      setQueueItems(step.queue ?? []);
    } else {
      setStackItems(step.stack ?? []);
    }
  }, [stepIdx, step, category, elements]);

  // ─── Speech Synthesis ────────────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (!speechOn || !synthRef.current) return;
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.05;
    utt.pitch = 1;
    utt.volume = 1;
    const vs = synthRef.current.getVoices();
    const v = vs.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("google"))
      || vs.find(v => v.lang.startsWith("en"))
      || vs[0];
    if (v) utt.voice = v;
    synthRef.current.speak(utt);
  }, [speechOn]);

  useEffect(() => {
    if (step) speak(step.msg);
  }, [stepIdx, speechOn]); // eslint-disable-line

  useEffect(() => {
    if (!speechOn) synthRef.current?.cancel();
  }, [speechOn]);

  // ─── Panel Drag Handlers ─────────────────────────────────────────────────────
  useEffect(() => {
    const mv = (e: MouseEvent) => {
      if (!panelDrag.current) return;
      const nx = panelDrag.current.sx + e.clientX - panelDrag.current.ox;
      const ny = panelDrag.current.sy + e.clientY - panelDrag.current.oy;
      if (panelDrag.current.panel === "info") setInfoPos({ x: nx, y: ny });
      else if (panelDrag.current.panel === "ptr") setPtrPos({ x: nx, y: ny });
      else setCodePos({ x: nx, y: ny });
    };
    const up = () => { panelDrag.current = null; };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  const startPanelDrag = (panel: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const p = panel === "info" ? infoPos : panel === "ptr" ? ptrPos : codePos;
    panelDrag.current = { panel, ox: e.clientX, oy: e.clientY, sx: p.x, sy: p.y };
  };

  // ─── Custom Inputs ──────────────────────────────────────────────────────────
  const applyInput = useCallback(() => {
    const raw = customInput.trim();
    if (!raw) {
      setInputError("Input field cannot be empty");
      return;
    }
    if (category === "expression") {
      const chars = raw.split("").filter(c => c.trim() !== "");
      setElements(chars);
    } else {
      const parts = raw.split(",").map(s => s.trim());
      if (parts.some(p => p === "")) {
        setInputError("Invalid input format — e.g. 10,20,30");
        return;
      }
      setElements(parts);
    }
    setInputError("");
    reset();
  }, [customInput, category, reset]);

  // ─── Sandbox Operations ──────────────────────────────────────────────────────
  const handleSandboxOp = (op: string) => {
    const val = sandboxInput.trim();
    if (op.startsWith("push") && !val) return;
    if (op.startsWith("enqueue") && !val) return;

    if (category === "queue" || category === "circular") {
      if (op === "enqueue") {
        setQueueItems(prev => [...prev.filter(x => x !== null), val]);
      } else if (op === "dequeue") {
        setQueueItems(prev => prev.slice(1));
      }
    } else if (category === "deque") {
      if (op === "pushFront") {
        setDequeItems(prev => [val, ...prev]);
      } else if (op === "pushBack") {
        setDequeItems(prev => [...prev, val]);
      } else if (op === "popFront") {
        setDequeItems(prev => prev.slice(1));
      } else if (op === "popBack") {
        setDequeItems(prev => prev.slice(0, -1));
      }
    } else if (category === "priority") {
      if (op === "insert") {
        const num = parseInt(val, 10);
        if (!isNaN(num)) {
          setPriorityItems(prev => [...prev, num].sort((a, b) => b - a));
        }
      } else if (op === "extractMax") {
        setPriorityItems(prev => prev.slice(1));
      }
    } else {
      // Stack
      if (op === "push") {
        setStackItems(prev => [...prev, val]);
      } else if (op === "pop") {
        setStackItems(prev => prev.slice(0, -1));
      }
    }
    setSandboxInput("");
  };

  const progress = steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0;

  // ─── Render Canvas SVG Helpers ───────────────────────────────────────────────
  const renderVisualizer = () => {
    if (category === "queue" || category === "deque") {
      const displayQueue = queueItems.length > 0 ? queueItems : elements;
      return (
        <g>
          {/* Horizontal Track pipeline */}
          <path d={`M 100 150 L ${canvasW - 100} 150 M 100 230 L ${canvasW - 100} 230`} fill="none" stroke="var(--border)" strokeWidth={3} />
          {displayQueue.map((item, idx) => {
            if (item === null) return null;
            const x = 160 + idx * H_GAP;
            const y = 190;
            const isActive = idx === step.activeIdx;
            return (
              <g key={`q-${idx}`} style={{ transition: "all 0.3s" }}>
                <rect x={x - NODE_W/2} y={y - NODE_H/2} width={NODE_W} height={NODE_H} rx={6}
                  fill={isActive ? "var(--orange-bg)" : "var(--panel)"} stroke={isActive ? "var(--orange)" : "var(--border)"} strokeWidth={isActive ? 2.5 : 1.5} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={isActive ? "var(--orange)" : "var(--text)"} fontSize="13" fontWeight="bold">
                  {item}
                </text>
                <text x={x} y={y - 32} textAnchor="middle" fill="var(--muted)" fontSize="10">
                  [{idx}]
                </text>
              </g>
            );
          })}
          {/* Boundary pointers */}
          {displayQueue.length > 0 && (
            <>
              <text x={160} y={260} textAnchor="middle" fill="var(--blue)" fontSize="11" fontWeight="bold">← FRONT</text>
              <text x={160 + (displayQueue.length - 1) * H_GAP} y={260} textAnchor="middle" fill="var(--orange)" fontSize="11" fontWeight="bold">← REAR</text>
            </>
          )}
        </g>
      );
    }

    if (category === "circular") {
      const displayQueue = queueItems.length > 0 ? queueItems : elements;
      const cx = canvasW / 2;
      const cy = 240;
      const radius = 105;
      return (
        <g>
          {/* Ring backdrop */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--border)" strokeWidth={3} strokeDasharray="6,6" />
          
          {Array(5).fill(null).map((_, idx) => {
            const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            const item = displayQueue[idx];
            const isActive = idx === step.activeIdx;

            return (
              <g key={`cir-${idx}`} style={{ transition: "all 0.3s" }}>
                <circle cx={x} cy={y} r={24} fill={isActive ? "var(--orange-bg)" : item ? "var(--panel)" : "var(--bg)"} stroke={isActive ? "var(--orange)" : "var(--border)"} strokeWidth={2} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={isActive ? "var(--orange)" : item ? "var(--text)" : "var(--muted)"} fontSize="12" fontWeight="bold">
                  {item || `[${idx}]`}
                </text>
                {/* front pointer */}
                {idx === step.front && (
                  <text x={x + 36 * Math.cos(angle)} y={y + 36 * Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" fill="var(--blue)" fontSize="9" fontWeight="extrabold">FRONT</text>
                )}
                {/* rear pointer */}
                {idx === step.rear && (
                  <text x={x - 36 * Math.cos(angle)} y={y - 36 * Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" fill="var(--orange)" fontSize="9" fontWeight="extrabold">REAR</text>
                )}
              </g>
            );
          })}
        </g>
      );
    }

    if (category === "priority") {
      const displayPq = priorityItems.length > 0 ? priorityItems : elements.map(x => parseInt(x, 10)).sort((a,b)=>b-a);
      const cx = canvasW / 2;
      const startY = 110;
      const coords = [
        { x: cx, y: startY }, // root
        { x: cx - 120, y: startY + 70 }, // left
        { x: cx + 120, y: startY + 70 }, // right
        { x: cx - 180, y: startY + 140 }, // left-left
        { x: cx - 60, y: startY + 140 }   // left-right
      ];
      return (
        <g>
          {/* Render Connection Lines first */}
          {coords.map((c, idx) => {
            if (idx === 0) return null;
            const parentIdx = Math.floor((idx - 1) / 2);
            if (idx >= displayPq.length) return null;
            return (
              <line key={`line-${idx}`} x1={coords[parentIdx].x} y1={coords[parentIdx].y} x2={c.x} y2={c.y} stroke="var(--border)" strokeWidth={2} />
            );
          })}

          {displayPq.slice(0, 5).map((val, idx) => {
            const { x, y } = coords[idx];
            const isActive = idx === step.activeIdx;
            return (
              <g key={`pq-${idx}`} style={{ transition: "all 0.3s" }}>
                <circle cx={x} cy={y} r={24} fill={isActive ? "var(--orange-bg)" : "var(--panel)"} stroke={isActive ? "var(--orange)" : "var(--border)"} strokeWidth={2} />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={isActive ? "var(--orange)" : "var(--text)"} fontSize="12" fontWeight="bold">
                  {val}
                </text>
                <text x={x} y={y - 32} textAnchor="middle" fill="var(--muted)" fontSize="9" fontWeight="bold">
                  idx: {idx}
                </text>
              </g>
            );
          })}
        </g>
      );
    }

    // Otherwise Stack layout (Standard, Monotonic, Expression, MinStack)
    const displayStack = stackItems;
    return (
      <g>
        {/* Stack Container Cup */}
        <path d={`M ${canvasW/2 - 60} 100 L ${canvasW/2 - 60} 340 A 10 10 0 0 0 ${canvasW/2 - 50} 350 L ${canvasW/2 + 50} 350 A 10 10 0 0 0 ${canvasW/2 + 60} 340 L ${canvasW/2 + 60} 100`}
          fill="none" stroke="var(--border)" strokeWidth={3} />
        
        {displayStack.map((item, idx) => {
          const x = canvasW/2;
          const y = 310 - idx * V_GAP;
          const isActive = idx === step.activeIdx || (category === "expression" && idx === displayStack.length - 1);
          return (
            <g key={`st-${idx}`} style={{ transition: "all 0.3s" }}>
              <rect x={x - NODE_W/2} y={y - NODE_H/2} width={NODE_W} height={NODE_H} rx={6}
                fill={isActive ? "var(--orange-bg)" : "var(--panel)"} stroke={isActive ? "var(--orange)" : "var(--border)"} strokeWidth={isActive ? 2.5 : 1.5} />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={isActive ? "var(--orange)" : "var(--text)"} fontSize="13" fontWeight="bold">
                {item}
              </text>
            </g>
          );
        })}

        {/* Min Stack visual rendering side-by-side if minstack */}
        {category === "minstack" && (
          <g transform={`translate(160, 0)`}>
            <text x={canvasW/2} y={80} textAnchor="middle" fill="var(--orange)" fontSize="10" fontWeight="extrabold" letterSpacing="0.1em">AUX MIN STACK</text>
            <path d={`M ${canvasW/2 - 60} 100 L ${canvasW/2 - 60} 340 A 10 10 0 0 0 ${canvasW/2 - 50} 350 L ${canvasW/2 + 50} 350 A 10 10 0 0 0 ${canvasW/2 + 60} 340 L ${canvasW/2 + 60} 100`}
              fill="none" stroke="var(--orange)" strokeWidth={2} opacity={0.4} />
            {minStackItems.map((item, idx) => {
              const x = canvasW/2;
              const y = 310 - idx * V_GAP;
              return (
                <g key={`mst-${idx}`} style={{ transition: "all 0.3s" }}>
                  <rect x={x - NODE_W/2} y={y - NODE_H/2} width={NODE_W} height={NODE_H} rx={6}
                    fill="var(--bg)" stroke="var(--orange)" strokeWidth={1.5} />
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="var(--orange)" fontSize="13" fontWeight="bold">
                    {item}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </g>
    );
  };

  return (
    <main className="page" data-theme={theme}>
      {/* ─── Hero Section ─── */}
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">{category.toUpperCase()} STRUCTURES</span>
          <h1>{title}</h1>
          <p className="description">{definition}</p>
        </div>
      </section>

      {/* ─── Simulator Lab Workspace ─── */}
      <section id="simulator" className="simulator">
        
        {/* Toolbar */}
        <div className="toolbar">
          <button onClick={() => { setElements(category === "expression" ? ["(", "A", "+", "B", ")"] : ["10", "20", "30", "40"]); reset(); }}>
            Reset Demo
          </button>
          <div className="separator" />
          <div className="complexity-badge">Time: <strong>{timeComplexity}</strong></div>
          <div className="complexity-badge">Space: <strong>{spaceComplexity}</strong></div>
        </div>

        {/* Core Layout Grid */}
        <div className="workspace">
          
          {/* Interactive Controller panel */}
          <aside>
            <div className="panel-section">
              <h3>Key Learning Points</h3>
              <ul className="points-list">
                {keyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
            </div>

            {/* Custom inputs */}
            <div className="panel-section">
              <h3>Custom Dataset Input</h3>
              <textarea
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder={category === "expression" ? "e.g. A+B*C" : "e.g. 10,20,30,40"}
                rows={2}
              />
              {inputError && <div className="error-text">{inputError}</div>}
              <div className="button-group">
                <button className="primary" onClick={applyInput}>Apply</button>
                <button onClick={() => { setCustomInput(""); setInputError(""); }}>Clear</button>
              </div>
            </div>

            {/* Sandbox operations */}
            <div className="panel-section">
              <h3>Interactive Sandbox</h3>
              <input
                type="text"
                value={sandboxInput}
                onChange={e => setSandboxInput(e.target.value)}
                placeholder="Value"
              />
              <div className="button-group" style={{ marginTop: 8 }}>
                {category === "queue" || category === "circular" ? (
                  <>
                    <button onClick={() => handleSandboxOp("enqueue")}>Enqueue</button>
                    <button onClick={() => handleSandboxOp("dequeue")}>Dequeue</button>
                  </>
                ) : category === "deque" ? (
                  <>
                    <button onClick={() => handleSandboxOp("pushFront")}>+Front</button>
                    <button onClick={() => handleSandboxOp("pushBack")}>+Rear</button>
                    <button onClick={() => handleSandboxOp("popFront")}>-Front</button>
                    <button onClick={() => handleSandboxOp("popBack")}>-Rear</button>
                  </>
                ) : category === "priority" ? (
                  <>
                    <button onClick={() => handleSandboxOp("insert")}>Insert</button>
                    <button onClick={() => handleSandboxOp("extractMax")}>Extract Max</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleSandboxOp("push")}>Push</button>
                    <button onClick={() => handleSandboxOp("pop")}>Pop</button>
                  </>
                )}
              </div>
            </div>

            {/* Playback rate */}
            <div className="panel-section footer-controls">
              <div className="playback-row">
                <button onClick={reset}>↺</button>
                <button onClick={() => setStepIdx(p => Math.max(0, p - 1))}>‹</button>
                <button className="primary" onClick={() => setIsPlaying(p => !p)}>
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button onClick={() => setStepIdx(p => Math.min(p + 1, steps.length - 1))}>›</button>
                <button className={speechOn ? "primary" : ""} onClick={() => setSpeechOn(p => !p)}>
                  {speechOn ? "🔊" : "🔇"}
                </button>
              </div>
              <input type="range" min={200} max={2000} step={100} value={2200 - speed}
                onChange={e => setSpeed(2200 - parseInt(e.target.value, 10))} />
              <div className="timeline-counter">
                {stepIdx + 1} / {steps.length}
              </div>
            </div>
          </aside>

          {/* SVG Canvas Area */}
          <div className="canvas-wrapper" ref={canvasRef}>
            {/* Background Grid */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <defs>
                <pattern id="canvas-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="var(--grid-line)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#canvas-grid)" />
            </svg>

            {/* Simulation visual structures */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              {renderVisualizer()}
            </svg>

            {/* Drift Panel: Logic Tracker */}
            <div className="drift-panel logic-tracker" style={{ left: codePos.x, top: codePos.y }}>
              <div className="drift-header" onMouseDown={e => startPanelDrag("code", e)}>
                <span>LOGIC TRACKER</span>
                <span className="drag-handle">⠿</span>
              </div>
              <div className="drift-body code-body">
                {codeSnippet.map((line, i) => (
                  <div key={i} className={`code-line ${step.line === i ? "active" : ""}`}>
                    <span className="line-num">{i + 1}</span>
                    <span className="line-content">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drift Panel: Pointers & State */}
            <div className="drift-panel state-engine" style={{ left: ptrPos.x, top: ptrPos.y }}>
              <div className="drift-header" onMouseDown={e => startPanelDrag("ptr", e)}>
                <span>STATE ENGINE</span>
                <span className="drag-handle">⠿</span>
              </div>
              <div className="drift-body state-body">
                {category === "expression" && (
                  <>
                    <div className="state-row"><span>Scanned</span><strong className="blue">{step.activeIdx >= 0 ? elements[step.activeIdx] : "null"}</strong></div>
                    <div className="state-row"><span>Postfix</span><strong className="green">{resultString || "null"}</strong></div>
                  </>
                )}
                {category === "monotonic" && (
                  <>
                    <div className="state-row"><span>Scanned</span><strong className="blue">{step.activeIdx >= 0 ? elements[step.activeIdx] : "null"}</strong></div>
                    <div className="state-column">
                      <span>Result List:</span>
                      <strong className="green">[{resultsArray.join(", ")}]</strong>
                    </div>
                  </>
                )}
                {category === "circular" && (
                  <>
                    <div className="state-row"><span>Front</span><strong className="blue">{step.front}</strong></div>
                    <div className="state-row"><span>Rear</span><strong className="orange">{step.rear}</strong></div>
                  </>
                )}
                {category !== "expression" && category !== "monotonic" && category !== "circular" && (
                  <>
                    <div className="state-row"><span>Size</span><strong className="blue">{stackItems.length || queueItems.length || priorityItems.length || 0}</strong></div>
                    <div className="state-row"><span>Top/Front</span><strong className="orange">{stackItems[stackItems.length - 1] || queueItems[0] || priorityItems[0] || "null"}</strong></div>
                  </>
                )}
                <div className="step-alert">
                  {step?.msg}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── Premium Glassmorphic Stylesheets ─── */}
      <style jsx>{`
        .page {
          --bg: #0d1117;
          --panel: #161b22;
          --border: #21262d;
          --text: #c9d1d9;
          --muted: #8b949e;
          --blue: #58a6ff;
          --green: #3fb950;
          --orange: #f0883e;
          --orange-bg: rgba(240,136,62,0.1);
          --grid-line: rgba(255,255,255,0.03);
          --drift-bg: rgba(22,27,34,0.92);
          
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
          overflow-x: hidden;
        }

        .page[data-theme="light"] {
          --bg: #ffffff;
          --panel: #f6f8fa;
          --border: #d0d7de;
          --text: #24292f;
          --muted: #57606a;
          --blue: #0969da;
          --green: #1a7f37;
          --orange: #bc4c00;
          --orange-bg: rgba(188,76,0,0.08);
          --grid-line: rgba(0,0,0,0.03);
          --drift-bg: rgba(246,248,250,0.94);
        }

        .hero {
          padding: 52px 40px 42px;
          background: radial-gradient(circle at 10% 20%, rgba(88,166,255,0.05), transparent 45%), var(--bg);
          border-bottom: 1px solid var(--border);
        }

        .hero .content-width {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero .eyebrow {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: var(--blue);
        }

        .hero h1 {
          margin: 8px 0;
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .hero .description {
          font-size: 13.5px;
          color: var(--muted);
          line-height: 1.6;
          max-width: 900px;
        }

        .simulator {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
        }

        .toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 40px;
          background: var(--panel);
          border-bottom: 1px solid var(--border);
        }

        .toolbar .separator {
          width: 1px;
          height: 16px;
          background: var(--border);
        }

        .complexity-badge {
          font-size: 10.5px;
          color: var(--muted);
        }

        .complexity-badge strong {
          color: var(--blue);
          margin-left: 3px;
        }

        .workspace {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
          padding: 24px 40px;
        }

        aside {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          height: fit-content;
        }

        .panel-section h3 {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          margin: 0 0 8px 0;
          font-weight: 800;
        }

        .points-list {
          padding-left: 14px;
          margin: 0;
          font-size: 11px;
          color: var(--text);
          line-height: 1.6;
        }

        .points-list li {
          margin-bottom: 6px;
        }

        textarea, input {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 6px;
          padding: 8px;
          font-family: inherit;
          font-size: 11px;
          box-sizing: border-box;
          outline: none;
        }

        textarea:focus, input:focus {
          border-color: var(--blue);
        }

        .button-group {
          display: flex;
          gap: 6px;
          margin-top: 6px;
        }

        button {
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 6px;
          padding: 6px 12px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        button:hover {
          border-color: var(--blue);
          color: var(--blue);
        }

        button.primary {
          background: var(--blue);
          border-color: var(--blue);
          color: var(--bg);
        }

        button.primary:hover {
          opacity: 0.9;
          color: var(--bg);
        }

        .error-text {
          font-size: 10px;
          color: #f85149;
          margin-top: 4px;
        }

        .footer-controls {
          border-top: 1px solid var(--border);
          padding-top: 14px;
        }

        .playback-row {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }

        .playback-row button {
          flex: 1;
          padding: 6px 0;
        }

        .timeline-counter {
          font-size: 9px;
          color: var(--muted);
          text-align: right;
          margin-top: 4px;
        }

        .canvas-wrapper {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          min-height: 520px;
        }

        .drift-panel {
          position: absolute;
          width: 320px;
          background: var(--drift-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          z-index: 10;
        }

        .state-engine {
          width: 200px;
        }

        .drift-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: var(--panel);
          border-bottom: 1px solid var(--border);
          cursor: grab;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--muted);
        }

        .drift-header:active {
          cursor: grabbing;
        }

        .drift-body {
          padding: 10px;
        }

        .code-body {
          display: flex;
          flex-direction: column;
          max-height: 280px;
          overflow-y: auto;
        }

        .code-line {
          display: flex;
          gap: 8px;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 10px;
          color: var(--muted);
          border-left: 2px solid transparent;
        }

        .code-line.active {
          background: rgba(88,166,255,0.08);
          border-left-color: var(--blue);
          color: var(--text);
        }

        .line-num {
          min-width: 14px;
          color: rgba(255,255,255,0.15);
          user-select: none;
        }

        .line-content {
          white-space: pre;
        }

        .state-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .state-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }

        .state-row span {
          color: var(--muted);
        }

        .state-row strong.blue { color: var(--blue); }
        .state-row strong.green { color: var(--green); }
        .state-row strong.orange { color: var(--orange); }

        .state-column {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 11px;
        }

        .state-column span {
          color: var(--muted);
        }

        .state-column strong.green { color: var(--green); }

        .step-alert {
          margin-top: 10px;
          border-top: 1px solid var(--border);
          padding-top: 8px;
          font-size: 10.5px;
          line-height: 1.5;
          color: var(--text);
        }
      `}</style>
    </main>
  );
}
"""

def to_camel_case(s):
    s = s.replace('.tsx', '')
    words = re.split(r'[^a-zA-Z0-9]+', s)
    return ''.join(w.capitalize() for w in words if w)

def to_title(s):
    s = s.replace('.tsx', '')
    words = re.split(r'[^a-zA-Z0-9]+', s)
    return ' '.join(w.capitalize() for w in words if w)

def get_metadata(slug):
    # Monotonic Stack & Queue / Sliding Window
    if any(k in slug for k in ["greater", "smaller", "monotonic", "span", "histogram", "rectangle", "water", "sliding-window", "window"]):
        return {
            "category": "monotonic",
            "definition": "Monotonic structures maintain elements in strictly sorted order. Violating elements are popped upon new insertions, providing O(1) nearest-candidate queries.",
            "time": "O(N) Amortized",
            "space": "O(N) Linear Space",
            "points": [
                "Maintains strictly increasing or decreasing sequences",
                "Amortizes pops to ensure overall linear time complexity",
                "Directly resolves nearest smaller/greater neighbor problems"
            ]
        }
    # Balanced Parentheses / Expression Parsing
    elif any(k in slug for k in ["parentheses", "bracket", "postfix", "prefix", "infix", "evaluate"]):
        return {
            "category": "expression",
            "definition": "Expression parsing utilizes a LIFO stack to manage bracket validation, precedence comparison, and operator/operand evaluation.",
            "time": "O(N) Linear Time",
            "space": "O(N) Linear Space",
            "points": [
                "Scan expressions from left-to-right or right-to-left",
                "Use the stack to defer low-precedence operators",
                "Match open and close bracket tokens systematically"
            ]
        }
    # Deque
    elif "deque" in slug:
        return {
            "category": "deque",
            "definition": "A Deque (Double-Ended Queue) allows constant-time insertion and deletion at both the front and rear boundaries.",
            "time": "O(1) at Boundaries",
            "space": "O(N) Total Storage",
            "points": [
                "Combines properties of both stacks and queues",
                "Supports push_front, push_back, pop_front, pop_back",
                "Backed by segmented arrays or doubly-linked nodes"
            ]
        }
    # Priority Queue
    elif "priority" in slug:
        return {
            "category": "priority",
            "definition": "A Priority Queue processes elements based on priority value rather than arrival order, typically backed by a binary heap representation.",
            "time": "O(log N) Updates",
            "space": "O(N) Total Storage",
            "points": [
                "Always yields the highest (or lowest) priority item first",
                "Logarithmic insertion and deletion times",
                "Constant time peak/top lookups"
            ]
        }
    # Circular Queue
    elif "circular" in slug:
        return {
            "category": "circular",
            "definition": "A Circular Queue connects the rear back to the front in a ring layout, utilizing modulo arithmetic to reuse empty slots and prevent storage leaks.",
            "time": "O(1) Core Operations",
            "space": "O(N) Total Storage",
            "points": [
                "Uses modulo arithmetic: (index + 1) % capacity",
                "Prevents memory fragmentation by reusing front slots",
                "Tracks full vs empty states via element counters"
            ]
        }
    # Queue Operations / Basics
    elif any(k in slug for k in ["queue", "fifo"]):
        return {
            "category": "queue",
            "definition": "A Queue is a linear data structure that follows the FIFO (First In First Out) principle, inserting at the rear and removing at the front.",
            "time": "O(1) Core Operations",
            "space": "O(N) Total Storage",
            "points": [
                "FIFO (First-In-First-Out) access pattern",
                "Enqueue adds to the rear boundary",
                "Dequeue removes from the front boundary"
            ]
        }
    # Special / Augmented Stack
    elif any(k in slug for k in ["min-stack", "special-stack", "two-stack", "multiple-stack"]):
        return {
            "category": "minstack",
            "definition": "Augmented stacks track auxiliary metadata (like historical minimums, maximums, or multi-stack offsets) alongside normal LIFO operations.",
            "time": "O(1) All Operations",
            "space": "O(N) Linear Space",
            "points": [
                "Synchronized helper stack tracks current state values",
                "Supports O(1) constant-time retrieval of local properties",
                "Enables memory-efficient multi-stack boundaries in single arrays"
            ]
        }
    # Standard Stack Operations
    elif any(k in slug for k in ["push", "pop", "peek", "top", "empty", "full"]):
        return {
            "category": "stack",
            "definition": "Stack operations manage data at the top boundary. Push adds an item, Pop removes the top item, Peek inspects it, and IsEmpty/IsFull check capacity.",
            "time": "O(1) Constant Time",
            "space": "O(1) Auxiliary Space",
            "points": [
                "Push adds to the top of the stack",
                "Pop removes the most recently added item",
                "Peek/Top inspects without removing"
            ]
        }
    # Default/Standard Stack Basics
    else:
        return {
            "category": "stack",
            "definition": "A stack is a linear data structure that follows the LIFO (Last In First Out) principle, allowing operations only at the top boundary.",
            "time": "O(1) Core Operations",
            "space": "O(N) Total Storage",
            "points": [
                "LIFO (Last-In-First-Out) access pattern",
                "All operations occur at the top boundary",
                "Constant time O(1) push, pop, and peek"
            ]
        }

def main():
    if not os.path.exists(DIRECTORY):
        print(f"Directory {DIRECTORY} not found!")
        return

    count = 0
    for filename in os.listdir(DIRECTORY):
        if filename.endswith(".tsx"):
            path = os.path.join(DIRECTORY, filename)
            slug = filename.replace(".tsx", "")
            comp_name = to_camel_case(filename)
            title = to_title(filename)
            meta = get_metadata(slug)
            
            # Format the template
            formatted_content = TEMPLATE.replace("{COMPONENT_NAME}", comp_name)
            formatted_content = formatted_content.replace("{SLUG}", slug)
            formatted_content = formatted_content.replace("{TITLE}", title)
            formatted_content = formatted_content.replace("{DEFINITION}", meta["definition"])
            formatted_content = formatted_content.replace("{TIME_COMPLEXITY}", meta["time"])
            formatted_content = formatted_content.replace("{SPACE_COMPLEXITY}", meta["space"])
            formatted_content = formatted_content.replace("{KEY_POINTS}", repr(meta["points"]))
            formatted_content = formatted_content.replace("{CATEGORY}", meta["category"])
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(formatted_content)
            
            count += 1
            print(f"Overwrote {filename} with interactive topic-specific simulation.")

    print(f"Completed! Overwrote {count} files successfully.")

if __name__ == "__main__":
    main()
