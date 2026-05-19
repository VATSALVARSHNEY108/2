"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Plus, Trash2 } from "lucide-react";
import { CodeTracker } from "@/components/CodeTracker";

type NodeKind = "normal" | "active" | "done" | "warn";

interface LessonProps {
  lessonId: string;
  title: string;
  scenario?: LessonScenario;
}

interface ListNode {
  id: string;
  value: string;
  x: number;
  y: number;
}

interface VisualLink {
  from: string;
  to: string;
  kind?: "next" | "prev" | "random" | "loop";
  label?: string;
}

export interface Step {
  message: string;
  line: number;
  active?: string[];
  done?: string[];
  warn?: string[];
  pointers: Record<string, string>;
}

interface Profile {
  eyebrow: string;
  definition: string;
  time: string;
  space: string;
  mode: "traverse" | "insert" | "delete" | "reverse" | "cycle" | "merge" | "arithmetic" | "structure";
  variant: string;
  cards: { title: string; body: string; highlight?: boolean }[];
  code: string[];
}

interface OperationInputs {
  insertValue: string;
  insertPosition: number;
  deleteValue: string;
  deletePosition: number;
  nthFromEnd: number;
}

export type LessonScenario = {
  profile?: Partial<Pick<Profile, "eyebrow" | "definition" | "time" | "space" | "mode" | "variant" | "cards" | "code">>;
  nodes?: ListNode[];
  links?: VisualLink[];
  steps?: Step[];
};

const BASE_NODES: ListNode[] = [
  { id: "N1", value: "12", x: 90, y: 230 },
  { id: "N2", value: "7", x: 210, y: 230 },
  { id: "N3", value: "19", x: 330, y: 230 },
  { id: "N4", value: "4", x: 450, y: 230 },
  { id: "N5", value: "31", x: 570, y: 230 },
];

function nodesFromValues(values: string[], y = 230): ListNode[] {
  return values.map((value, index) => ({
    id: `N${index + 1}`,
    value,
    x: 90 + index * 120,
    y,
  }));
}

function parseNodeValues(input: string) {
  return input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function clampIndex(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function getInitialNodes(variant: string): ListNode[] {
  if (variant.includes("add-two-numbers")) return nodesFromValues(["2", "4", "3", "5", "6"], 205);
  if (variant.includes("multiply")) return nodesFromValues(["1", "2", "3", "4", "5"], 205);
  if (variant.includes("palindrome")) return nodesFromValues(["r", "a", "d", "a", "r"]);
  if (variant.includes("dedupe-sorted")) return nodesFromValues(["3", "3", "7", "7", "9"]);
  if (variant.includes("dedupe-unsorted")) return nodesFromValues(["8", "4", "8", "2", "4"]);
  if (variant.includes("odd-even") || variant.includes("segregate")) return nodesFromValues(["5", "8", "1", "6", "3"]);
  if (variant.includes("merge") || variant.includes("sort") || variant.includes("partition")) return nodesFromValues(["1", "2", "4", "3", "5"]);
  if (variant.includes("cycle") || variant.includes("loop")) return nodesFromValues(["10", "20", "30", "40", "50"]);
  if (variant.includes("stack")) return nodesFromValues(["top", "14", "9", "2"], 220);
  if (variant.includes("queue")) return nodesFromValues(["front", "11", "24", "rear"], 220);
  if (variant.includes("polynomial")) return nodesFromValues(["5x^3", "2x^2", "7x", "4"], 220);
  if (variant.includes("sparse")) return nodesFromValues(["0,2:9", "1,4:6", "3,1:8"], 220);
  if (variant.includes("random")) return nodesFromValues(["A", "B", "C", "D"], 220);
  if (variant.includes("lru")) return nodesFromValues(["MRU", "8", "3", "LRU"], 220);
  if (variant.includes("skip")) return nodesFromValues(["-inf", "10", "25", "40", "+inf"], 220);
  if (variant.includes("xor")) return nodesFromValues(["A", "B", "C", "D"]);
  return BASE_NODES;
}

function formatTitle(id: string) {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const LESSON_DETAIL: Record<string, Partial<Pick<Profile, "eyebrow" | "definition" | "time" | "space" | "mode" | "variant" | "cards" | "code">>> = {
  "add-two-numbers": {
    eyebrow: "Linked List Algorithms - Digit Addition",
    definition: "Add Two Numbers stores each number in reverse digit order, walks both lists together, and builds a third list while carrying overflow into the next digit.",
    variant: "add-two-numbers",
    code: ["carry = 0", "while l1 or l2 or carry:", "  total = digit(l1) + digit(l2) + carry", "  append(total % 10)", "  carry = total // 10", "  advance l1 and l2"],
  },
  "multiply-linked-lists": {
    eyebrow: "Linked List Algorithms - Digit Multiplication",
    definition: "Multiply Linked Lists converts digit chains into place-value products, accumulates partial results, and normalizes carry across the answer list.",
    time: "O(n x m)",
    space: "O(n + m)",
    variant: "multiply-linked-lists",
    code: ["for each digit a from list1:", "  for each digit b from list2:", "    product[i+j] += a * b", "normalize carry", "build result list"],
  },
  "insertion-at-beginning": { variant: "insert-beginning", time: "O(1)", code: ["new.next = head", "head = new", "if tail is null: tail = new"] },
  "insertion-at-end": { variant: "insert-end", time: "O(1) with tail", code: ["tail.next = new", "tail = new", "new.next = null"] },
  "insertion-at-position": { variant: "insert-position", code: ["prev = node at position - 1", "new.next = prev.next", "prev.next = new"] },
  "insertion-in-dll": {
    eyebrow: "Linked List Operations - DLL Insertion",
    definition: "Insertion in a doubly linked list updates both forward and backward links so neighbors remain reachable from either direction.",
    variant: "insert-dll",
    code: ["new.prev = prev", "new.next = next", "prev.next = new", "next.prev = new"],
  },
  "deletion-from-beginning": { variant: "delete-beginning", time: "O(1)", code: ["oldHead = head", "head = head.next", "oldHead.next = null"] },
  "deletion-from-end": { variant: "delete-end", code: ["prev = node before tail", "prev.next = null", "tail = prev"] },
  "deletion-by-position": { variant: "delete-position", code: ["prev = node before position", "target = prev.next", "prev.next = target.next", "detach target"] },
  "deletion-by-value": { variant: "delete-value", code: ["while curr.data != value:", "  prev = curr", "  curr = curr.next", "prev.next = curr.next"] },
  "delete-nth-node-from-end": { variant: "delete-nth-end", code: ["move fast n steps", "move slow and fast together", "slow.next = slow.next.next"] },
  "deletion-in-dll": {
    eyebrow: "Linked List Operations - DLL Deletion",
    definition: "Deletion in a doubly linked list bypasses the target from both sides by updating next and prev links.",
    variant: "delete-dll",
    code: ["prev = target.prev", "next = target.next", "prev.next = next", "next.prev = prev"],
  },
  "reverse-linked-list": { variant: "reverse-iterative" },
  "recursive-reversal": { variant: "reverse-recursive", space: "O(n)", code: ["if head.next is null: return head", "newHead = reverse(head.next)", "head.next.next = head", "head.next = null"] },
  "reverse-in-k-groups": { variant: "reverse-k-group", time: "O(n)", code: ["find k-node block", "reverse exactly k links", "connect previous block", "continue from next block"] },
  "reverse-dll": {
    eyebrow: "Linked List Algorithms - DLL Reversal",
    definition: "Reverse DLL swaps each node's next and prev fields, then moves the head to the old tail.",
    variant: "reverse-dll",
    code: ["while curr:", "  swap(curr.next, curr.prev)", "  curr = curr.prev", "head = oldTail"],
  },
  "detect-loop": { variant: "detect-loop" },
  "floyd-cycle-detection": { variant: "floyd-cycle" },
  "loop-start-point": { variant: "loop-start", code: ["detect meeting point", "reset one pointer to head", "move both one step", "meeting node is loop start"] },
  "remove-loop": { variant: "remove-loop", code: ["find loop start", "walk loop to last node", "last.next = null"] },
  "merge-sorted-lists": { variant: "merge-sorted" },
  "merge-sort-linked-list": { variant: "merge-sort", time: "O(n log n)", space: "O(log n)" },
  "sort-linked-list": { variant: "sort-linked-list", time: "O(n log n)", space: "O(log n)" },
  "flatten-linked-list": { variant: "flatten", time: "O(n log k)", code: ["push list heads by value", "pop smallest node", "append to flat chain", "push child/next candidate"] },
  "partition-linked-list": { variant: "partition", code: ["if node < x: append to before list", "else append to after list", "beforeTail.next = afterHead"] },
  "remove-duplicates-sorted": { variant: "dedupe-sorted", code: ["if curr.data == curr.next.data:", "  curr.next = curr.next.next", "else curr = curr.next"] },
  "remove-duplicates-unsorted": { variant: "dedupe-unsorted", space: "O(n)", code: ["seen = set()", "if curr.data in seen: prev.next = curr.next", "else add curr.data"] },
  "odd-even-linked-list": { variant: "odd-even", code: ["odd.next = even.next", "odd = odd.next", "even.next = odd.next", "even = even.next", "odd.next = evenHead"] },
  "rotate-linked-list": { variant: "rotate", code: ["connect tail to head", "steps = length - k % length", "move to new tail", "break circle"] },
  "swap-nodes-in-pairs": { variant: "swap-pairs", code: ["first = prev.next", "second = first.next", "first.next = second.next", "second.next = first", "prev.next = second"] },
  "check-palindrome": { variant: "palindrome", space: "O(1)", code: ["middle = slow/fast", "reverse second half", "compare left and right", "restore optional"] },
  "middle-of-linked-list": { variant: "middle", code: ["slow = head", "fast = head", "while fast and fast.next:", "  slow = slow.next", "  fast = fast.next.next"] },
  "nth-node-from-end": { variant: "nth-end", code: ["move fast n steps", "move slow and fast together", "slow is nth from end"] },
  "intersection-point": { variant: "intersection-point", code: ["a = headA", "b = headB", "a = a.next or headB", "b = b.next or headA", "stop when a == b"] },
  "intersection-of-lists": { variant: "intersection-point" },
  "segregate-even-odd": { variant: "segregate-even-odd", code: ["append even nodes to even list", "append odd nodes to odd list", "evenTail.next = oddHead"] },
  "searching": { variant: "searching", code: ["curr = head", "while curr:", "  if curr.data == target: return curr", "  curr = curr.next"] },
  "length": { variant: "length", code: ["count = 0", "curr = head", "while curr:", "  count += 1", "  curr = curr.next"] },
  "traversal": { variant: "traversal" },
  "updating-nodes": { variant: "update-node", code: ["find node", "old = curr.data", "curr.data = newValue"] },
  "stack-using-linked-list": { variant: "stack-linked-list", time: "O(1) push/pop", code: ["push: new.next = top; top = new", "pop: top = top.next"] },
  "queue-using-linked-list": { variant: "queue-linked-list", time: "O(1) enqueue/dequeue", code: ["enqueue: rear.next = new; rear = new", "dequeue: front = front.next"] },
  "lru-using-dll": { variant: "lru-dll", time: "O(1)", space: "O(capacity)", code: ["if key exists: move node to front", "if full: evict tail.prev", "insert new node after head"] },
  "clone-with-random-pointer": { variant: "clone-random", time: "O(n)", space: "O(1)", code: ["interleave clone after original", "clone.random = original.random.next", "separate cloned chain"] },
  "polynomial-linked-list": { variant: "polynomial", code: ["align terms by power", "add coefficients", "skip zero coefficient terms"] },
  "sparse-matrix-linked-list": { variant: "sparse-matrix", code: ["store non-zero cells only", "link by row and column", "skip implicit zero values"] },
  "circular-linked-list": { variant: "circular-list" },
  "circular-doubly-linked-list": { variant: "circular-dll" },
  "circular-operations": { variant: "circular-operations" },
  "doubly-linked-list": { variant: "doubly-list" },
  "doubly-operations": { variant: "doubly-operations" },
  "singly-linked-list": { variant: "singly-list" },
  "types-of-linked-list": { variant: "types" },
  "node-structure": { variant: "node-structure" },
  "memory-representation": { variant: "memory" },
  "dynamic-memory-allocation": { variant: "dynamic-memory" },
  "header-linked-list": { variant: "header-list" },
  "iterator-linked-list": { variant: "iterator" },
  "stl-list": { variant: "stl-list" },
  "skip-list-basics": { variant: "skip-list" },
  "xor-linked-list-basics": { variant: "xor-list" },
  "advantages-disadvantages": { variant: "tradeoffs" },
  "practice-patterns": { variant: "practice-patterns" },
  "linked-list-basics": { variant: "linked-list-basics" },
  "introduction-to-linked-list": { variant: "introduction" },
};

function getProfile(lessonId: string, title: string): Profile {
  const id = lessonId.toLowerCase();
  const detail = LESSON_DETAIL[id] || {};
  const isReverse = id.includes("reverse") || id.includes("reversal");
  const isInsert = id.includes("insertion") || id.includes("insert");
  const isDelete = id.includes("deletion") || id.includes("delete") || id.includes("remove");
  const isCycle = id.includes("cycle") || id.includes("loop") || id.includes("floyd");
  const isMerge = id.includes("merge") || id.includes("sort") || id.includes("flatten") || id.includes("partition");
  const isArithmetic = id.includes("add") || id.includes("multiply");
  const isStructure = id.includes("doubly") || id.includes("circular") || id.includes("xor") || id.includes("memory") || id.includes("node") || id.includes("types") || id.includes("stl") || id.includes("header") || id.includes("skip");

  if (isArithmetic) {
    const base: Profile = {
      eyebrow: "Linked List Algorithms - Arithmetic",
      definition: `${title} treats list nodes as digit containers and moves through them one pointer step at a time, carrying intermediate values into a result list.`,
      time: "O(n + m)",
      space: "O(max(n,m))",
      mode: "arithmetic",
      variant: "arithmetic",
      cards: [
        { title: "Digit Flow", body: "Each node contributes one digit or coefficient to the current operation." },
        { title: "Carry State", body: "The carry panel shows how local node values affect the next result node.", highlight: true },
        { title: "Result Chain", body: "The output list grows one node at a time while source pointers advance." },
        { title: "Edge Cases", body: "Different list lengths, final carry, and zero values must be handled explicitly." },
      ],
      code: ["carry = 0", "while l1 or l2 or carry:", "  sum = value(l1) + value(l2) + carry", "  append(sum % 10)", "  carry = sum / 10", "  advance pointers"],
    };
    return { ...base, ...detail };
  }

  if (isCycle) {
    const base: Profile = {
      eyebrow: "Linked List Algorithms - Cycle Detection",
      definition: `${title} uses pointer movement to reason about loops, entry points, and safe traversal in a linked structure.`,
      time: "O(n)",
      space: "O(1)",
      mode: "cycle",
      variant: "cycle",
      cards: [
        { title: "Slow Pointer", body: "The slow pointer advances one node at a time." },
        { title: "Fast Pointer", body: "The fast pointer advances two nodes at a time and reveals repeated structure.", highlight: true },
        { title: "Meeting Point", body: "If the two pointers meet, the list contains a loop." },
        { title: "Loop Repair", body: "Removal problems identify the link that closes the loop and disconnect it." },
      ],
      code: ["slow = head", "fast = head", "while fast and fast.next:", "  slow = slow.next", "  fast = fast.next.next", "  if slow == fast: loop found"],
    };
    return { ...base, ...detail };
  }

  if (isReverse) {
    const base: Profile = {
      eyebrow: "Linked List Algorithms - Reversal",
      definition: `${title} rewires node links so traversal order changes without copying the entire list.`,
      time: "O(n)",
      space: id.includes("recursive") ? "O(n)" : "O(1)",
      mode: "reverse",
      variant: "reverse",
      cards: [
        { title: "Pointer Trio", body: "`prev`, `curr`, and `next` protect the chain while each link is reversed." },
        { title: "Rewire Step", body: "The current node points backward to `prev`, then all pointers advance.", highlight: true },
        { title: "New Head", body: "When traversal ends, `prev` becomes the new head." },
        { title: "Variants", body: "DLL and k-group reversal use the same pointer discipline with extra boundaries." },
      ],
      code: ["prev = null", "curr = head", "while curr:", "  next = curr.next", "  curr.next = prev", "  prev = curr", "  curr = next", "head = prev"],
    };
    return { ...base, ...detail };
  }

  if (isInsert) {
    const base: Profile = {
      eyebrow: "Linked List Operations - Insertion",
      definition: `${title} adds a node by locating the correct position and changing a small number of links.`,
      time: id.includes("beginning") ? "O(1)" : "O(n)",
      space: "O(1)",
      mode: "insert",
      variant: "insert",
      cards: [
        { title: "Allocate Node", body: "The new node is prepared before any existing link is changed." },
        { title: "Find Position", body: "Traversal stops at the predecessor when inserting in the middle." },
        { title: "Link Order", body: "Connect the new node forward first, then connect the predecessor to it.", highlight: true },
        { title: "Boundary Cases", body: "Empty list, head insertion, and tail insertion each adjust different pointers." },
      ],
      code: ["newNode = Node(value)", "if position == 0: insert at head", "prev = node before position", "newNode.next = prev.next", "prev.next = newNode", "update tail if needed"],
    };
    return { ...base, ...detail };
  }

  if (isDelete) {
    const base: Profile = {
      eyebrow: "Linked List Operations - Deletion",
      definition: `${title} removes a node by preserving access to its neighbors and bypassing the target link safely.`,
      time: id.includes("beginning") ? "O(1)" : "O(n)",
      space: "O(1)",
      mode: "delete",
      variant: "delete",
      cards: [
        { title: "Locate Target", body: "Traversal keeps both previous and current pointers." },
        { title: "Bypass Link", body: "`prev.next` jumps over the target node.", highlight: true },
        { title: "Release Node", body: "The removed node is detached from the visible chain." },
        { title: "Boundary Cases", body: "Deleting head, tail, missing value, or the only node needs separate handling." },
      ],
      code: ["prev = null", "curr = head", "while curr is not target:", "  prev = curr", "  curr = curr.next", "prev.next = curr.next", "delete curr"],
    };
    return { ...base, ...detail };
  }

  if (isMerge) {
    const base: Profile = {
      eyebrow: "Linked List Algorithms - Ordering",
      definition: `${title} rearranges or combines chains by comparing nodes and stitching links into a useful order.`,
      time: id.includes("sort") ? "O(n log n)" : "O(n)",
      space: id.includes("merge-sort") ? "O(log n)" : "O(1)",
      mode: "merge",
      variant: "merge",
      cards: [
        { title: "Compare Heads", body: "The smallest eligible node becomes the next output node." },
        { title: "Stitch Result", body: "A tail pointer appends chosen nodes without scanning again.", highlight: true },
        { title: "Preserve Remainder", body: "When one list ends, the remaining chain can be attached directly." },
        { title: "Stable Links", body: "Most linked-list sorts move links instead of shifting array cells." },
      ],
      code: ["dummy = Node(0)", "tail = dummy", "while a and b:", "  pick smaller head", "  tail.next = picked", "  tail = tail.next", "attach remaining nodes"],
    };
    return { ...base, ...detail };
  }

  if (isStructure) {
    const base: Profile = {
      eyebrow: "Linked List Structure - Representation",
      definition: `${title} focuses on how nodes, links, memory, and variants shape traversal and update behavior.`,
      time: "Depends",
      space: "O(n)",
      mode: "structure",
      variant: "structure",
      cards: [
        { title: "Node Layout", body: "Each node stores data plus one or more links to related nodes." },
        { title: "Memory Model", body: "Nodes do not need contiguous memory, which makes insertion flexible.", highlight: true },
        { title: "Variants", body: "Singly, doubly, circular, header, skip, and XOR lists trade simplicity for power." },
        { title: "Pointer Cost", body: "Extra links improve navigation but increase memory and update complexity." },
      ],
      code: ["class Node:", "  data", "  next", "head points to first node", "node.next points forward", "tail.next is null or head"],
    };
    return { ...base, ...detail };
  }

  const base: Profile = {
    eyebrow: "Linked List Algorithms - Traversal",
    definition: `${title} walks through connected nodes using pointer state instead of direct indexing.`,
    time: "O(n)",
    space: "O(1)",
    mode: "traverse",
    variant: "traverse",
    cards: [
      { title: "Sequential Access", body: "A linked list must be followed node by node from a known pointer." },
      { title: "Pointer State", body: "`current`, `previous`, and helper pointers explain the algorithm's progress.", highlight: true },
      { title: "No Random Indexing", body: "Unlike arrays, reaching the kth node requires k pointer moves." },
      { title: "Common Patterns", body: "Traversal powers search, length, middle, nth-from-end, palindrome, and intersection tasks." },
    ],
    code: ["current = head", "while current:", "  visit current.data", "  if condition: answer = current", "  current = current.next", "return answer"],
  };
  return { ...base, ...detail };
}

function buildSteps(nodes: ListNode[], profile: Profile, inputs: OperationInputs): Step[] {
  const ids = nodes.map((node) => node.id);
  const mode = profile.mode;
  const variant = profile.variant;
  const insertValue = inputs.insertValue.trim() || "99";
  const insertPosition = clampIndex(inputs.insertPosition, 0, nodes.length);
  const deletePosition = clampIndex(inputs.deletePosition, 0, Math.max(0, nodes.length - 1));
  const nthFromEnd = clampIndex(inputs.nthFromEnd, 1, Math.max(1, nodes.length));
  const valueIndex = Math.max(0, nodes.findIndex((node) => node.value === inputs.deleteValue.trim()));
  const targetIndex = valueIndex === -1 ? Math.min(2, Math.max(0, nodes.length - 1)) : valueIndex;
  const safePrev = ids[Math.max(0, targetIndex - 1)] || "null";
  const safeTarget = ids[targetIndex] || ids[0] || "null";
  const safeNext = ids[targetIndex + 1] || "null";

  if (variant === "insert-beginning") {
    return [
      { message: `Create new node(${insertValue}) and keep its next pointer empty for the moment.`, line: 0, active: ["NEW"], pointers: { newNode: `NEW(${insertValue})`, oldHead: ids[0] } },
      { message: "Point the new node to the current head so the old chain stays reachable.", line: 0, active: ["NEW", ids[0]], pointers: { "NEW.next": ids[0], head: ids[0] } },
      { message: "Move head to the new node. No traversal was needed.", line: 1, done: ["NEW", ...ids], pointers: { head: "NEW", tail: ids[ids.length - 1] } },
    ];
  }
  if (variant === "insert-end") {
    return [
      { message: `Create new node(${insertValue}) and use the tail pointer to jump directly to the last node.`, line: 0, active: [ids[ids.length - 1], "NEW"], pointers: { tail: ids[ids.length - 1], newNode: `NEW(${insertValue})` } },
      { message: "Attach the old tail to the new node.", line: 0, active: [ids[ids.length - 1], "NEW"], done: ids.slice(0, -1), pointers: { "tail.next": "NEW" } },
      { message: "Promote the new node to tail and leave its next pointer null.", line: 1, done: [...ids, "NEW"], pointers: { head: ids[0], tail: "NEW", "NEW.next": "null" } },
    ];
  }
  if (variant === "insert-position" || variant === "insert-dll") {
    const prevIndex = clampIndex(insertPosition - 1, 0, Math.max(0, nodes.length - 1));
    const nextIndex = clampIndex(insertPosition, 0, Math.max(0, nodes.length - 1));
    const prev = insertPosition === 0 ? "null" : ids[prevIndex];
    const next = insertPosition >= nodes.length ? "null" : ids[nextIndex];
    return [
      { message: `Create new node(${insertValue}) for position ${insertPosition}.`, line: 0, active: ["NEW"], pointers: { newNode: `NEW(${insertValue})`, position: String(insertPosition) } },
      { message: insertPosition === 0 ? "Position is head, so no predecessor traversal is needed." : "Traverse until the predecessor of the insertion point is selected.", line: 0, active: prev === "null" ? [ids[0]] : [prev], done: ids.slice(0, prevIndex), pointers: { prev, next } },
      { message: "Connect the new node to the next part of the chain first.", line: 1, active: next === "null" ? ["NEW"] : ["NEW", next], pointers: { "NEW.next": next } },
      { message: prev === "null" ? "Move head to the new node." : "Connect the predecessor to the new node.", line: 2, active: prev === "null" ? ["NEW", ids[0]] : [prev, "NEW"], done: ids.slice(0, Math.max(0, insertPosition)), pointers: { "prev.next": prev === "null" ? "head = NEW" : "NEW" } },
      { message: "Insertion complete. The chain remains reachable from head.", line: 2, done: [...ids, "NEW"], pointers: { inserted: `NEW(${insertValue})`, position: String(insertPosition) } },
    ];
  }
  if (variant === "delete-beginning") {
    return [
      { message: "Save the current head before moving it.", line: 0, active: [ids[0]], pointers: { oldHead: ids[0], head: ids[0] } },
      { message: "Advance head to the second node.", line: 1, active: [ids[1]], warn: [ids[0]], pointers: { head: ids[1], removed: ids[0] } },
      { message: "Detach the old head from the chain.", line: 2, done: ids.slice(1), warn: [ids[0]], pointers: { head: ids[1], "oldHead.next": "null" } },
    ];
  }
  if (variant === "delete-end") {
    return [
      { message: "Traverse until current reaches the tail.", line: 0, active: [ids[ids.length - 2], ids[ids.length - 1]], pointers: { prev: ids[ids.length - 2], curr: ids[ids.length - 1] } },
      { message: "Break the predecessor's next link.", line: 1, active: [ids[ids.length - 2]], warn: [ids[ids.length - 1]], pointers: { "prev.next": "null", removed: ids[ids.length - 1] } },
      { message: "The predecessor is now the tail.", line: 2, done: ids.slice(0, -1), pointers: { head: ids[0], tail: ids[ids.length - 2] } },
    ];
  }
  if (variant === "delete-position" || variant === "delete-dll") {
    const prev = deletePosition === 0 ? "null" : ids[deletePosition - 1];
    const target = ids[deletePosition] || ids[0];
    const next = ids[deletePosition + 1] || "null";
    return [
      { message: `Validate delete position ${deletePosition}.`, line: 0, active: [target], pointers: { position: String(deletePosition), target } },
      { message: deletePosition === 0 ? "Target is the head node." : "Traverse until prev is one node before the target.", line: 0, active: prev === "null" ? [target] : [prev, target], done: ids.slice(0, deletePosition), pointers: { prev, curr: target } },
      { message: prev === "null" ? "Move head to target.next." : "Bypass the target by linking prev.next to target.next.", line: 2, active: next === "null" ? [prev] : [prev, next].filter((id) => id !== "null"), warn: [target], pointers: { "prev.next": next, removed: target } },
      { message: "Detach the target node from the visible chain.", line: 3, done: ids.filter((id) => id !== target), warn: [target], pointers: { removed: target, next } },
    ];
  }
  if (variant === "delete-value") {
    const missing = !nodes.some((node) => node.value === inputs.deleteValue.trim());
    return [
      { message: `Search for value ${inputs.deleteValue || nodes[targetIndex]?.value || ""} from the head.`, line: 0, active: [ids[0]], pointers: { targetValue: inputs.deleteValue || nodes[targetIndex]?.value || "", curr: ids[0] } },
      { message: missing ? "The exact value is not in the list, so the scan reaches null." : "Advance prev and curr until the value is found.", line: 1, active: [safePrev, safeTarget].filter((id) => id !== "null"), done: ids.slice(0, targetIndex), pointers: { prev: safePrev, curr: missing ? "null" : safeTarget } },
      missing
        ? { message: "No node is deleted because the value was not found.", line: 1, done: ids, pointers: { deleted: "false" } }
        : { message: "Bypass the found node and preserve the rest of the chain.", line: 3, active: [safePrev, safeNext].filter((id) => id !== "null"), warn: [safeTarget], pointers: { removed: safeTarget, "prev.next": safeNext } },
    ];
  }
  if (variant === "delete-nth-end" || variant === "nth-end") {
    const deleting = variant === "delete-nth-end";
    const targetFromStart = Math.max(0, nodes.length - nthFromEnd);
    const beforeTarget = targetFromStart === 0 ? "dummy" : ids[targetFromStart - 1];
    const target = ids[targetFromStart] || ids[0];
    const afterTarget = ids[targetFromStart + 1] || "null";
    return [
      { message: `Move fast ${nthFromEnd} steps ahead to create the required gap.`, line: 0, active: [ids[Math.min(nthFromEnd - 1, ids.length - 1)]], pointers: { slow: "dummy", fast: ids[Math.min(nthFromEnd - 1, ids.length - 1)], gap: String(nthFromEnd) } },
      { message: "Move slow and fast together until fast reaches the end.", line: 1, active: [beforeTarget === "dummy" ? target : beforeTarget, ids[ids.length - 1]], done: ids.slice(0, Math.max(0, targetFromStart - 1)), pointers: { slow: beforeTarget, fast: ids[ids.length - 1] } },
      deleting
        ? { message: "Slow is before the target, so bypass slow.next.", line: 2, active: [beforeTarget, afterTarget].filter((id) => id !== "dummy" && id !== "null"), warn: [target], pointers: { target, "slow.next": afterTarget } }
        : { message: "The slow pointer now identifies the nth node from the end.", line: 2, active: [target], done: ids, pointers: { answer: target, fromEnd: String(nthFromEnd) } },
    ];
  }
  if (variant === "middle") {
    return [
      { message: "Start slow and fast at head.", line: 0, active: [ids[0]], pointers: { slow: ids[0], fast: ids[0] } },
      { message: "Slow moves one step while fast moves two.", line: 2, active: [ids[1], ids[2]], pointers: { slow: ids[1], fast: ids[2] } },
      { message: "When fast reaches the end, slow is sitting on the middle node.", line: 3, active: [ids[2]], done: ids, pointers: { middle: ids[2], fast: "null" } },
    ];
  }
  if (variant === "palindrome") {
    return [
      { message: "Find the middle with slow and fast pointers.", line: 0, active: [ids[2]], pointers: { slow: ids[2], fast: ids[4] } },
      { message: "Reverse the second half so it can be compared from the outside in.", line: 1, active: [ids[3], ids[4]], pointers: { rightHead: ids[4], leftHead: ids[0] } },
      { message: "Compare matching values from both halves.", line: 2, active: [ids[0], ids[4]], done: [ids[2]], pointers: { left: ids[0], right: ids[4], match: "true" } },
      { message: "All compared pairs match, so the list is a palindrome.", line: 3, done: ids, pointers: { result: "palindrome" } },
    ];
  }
  if (variant === "intersection-point") {
    return [
      { message: "Pointer A walks list A while pointer B walks list B.", line: 0, active: [ids[0], ids[1]], pointers: { a: "A.head", b: "B.head" } },
      { message: "When a pointer falls off, redirect it to the other head.", line: 2, active: [ids[2], ids[3]], pointers: { a: "B.head", b: "A.head" } },
      { message: "Equalized path lengths make both pointers meet at the shared node.", line: 4, active: [ids[3]], done: ids.slice(0, 4), pointers: { intersection: ids[3] } },
    ];
  }
  if (variant === "dedupe-sorted" || variant === "dedupe-unsorted") {
    return [
      { message: variant === "dedupe-sorted" ? "Sorted duplicates appear next to each other." : "Track values already seen while scanning the list.", line: 0, active: [ids[0]], pointers: { curr: ids[0], seen: variant === "dedupe-unsorted" ? "{}" : "adjacent" } },
      { message: "A duplicate is found and the previous link skips over it.", line: 1, active: [ids[0], ids[2]], warn: [ids[1]], pointers: { duplicate: ids[1], "prev.next": ids[2] } },
      { message: "Continue until every remaining node has a unique value.", line: 2, done: [ids[0], ids[2], ids[4]], warn: [ids[1], ids[3]], pointers: { result: "unique chain" } },
    ];
  }
  if (variant === "rotate") {
    return [
      { message: "Measure length and connect tail to head to make a temporary ring.", line: 0, active: [ids[0], ids[4]], pointers: { tail: ids[4], "tail.next": ids[0] } },
      { message: "Walk length - k % length steps to find the new tail.", line: 2, active: [ids[2]], pointers: { newTail: ids[2], newHead: ids[3] } },
      { message: "Break the ring after the new tail.", line: 3, done: ids, pointers: { head: ids[3], tail: ids[2], "tail.next": "null" } },
    ];
  }
  if (variant === "swap-pairs") {
    return [
      { message: "Select the next two nodes as a pair.", line: 0, active: [ids[0], ids[1]], pointers: { first: ids[0], second: ids[1] } },
      { message: "Rewire the pair so second comes before first.", line: 2, active: [ids[1], ids[0]], done: [ids[1], ids[0]], pointers: { "second.next": ids[0], "first.next": ids[2] } },
      { message: "Advance to the next pair and repeat.", line: 4, active: [ids[2], ids[3]], done: [ids[0], ids[1]], pointers: { prev: ids[0], first: ids[2], second: ids[3] } },
    ];
  }
  if (variant === "stack-linked-list" || variant === "queue-linked-list") {
    return variant === "stack-linked-list"
      ? [
          { message: "Push inserts at the top/head of the list.", line: 0, active: ["NEW", ids[0]], pointers: { top: ids[0], newNode: "NEW" } },
          { message: "Pop removes the top node by moving top to top.next.", line: 1, active: [ids[1]], warn: [ids[0]], pointers: { popped: ids[0], top: ids[1] } },
          { message: "Both operations touch only the head pointer.", line: 1, done: ids.slice(1), pointers: { complexity: "O(1)" } },
        ]
      : [
          { message: "Enqueue appends at rear using the tail pointer.", line: 0, active: [ids[3], "NEW"], pointers: { rear: ids[3], newNode: "NEW" } },
          { message: "Dequeue removes from front by advancing the front pointer.", line: 1, active: [ids[1]], warn: [ids[0]], pointers: { front: ids[1], removed: ids[0] } },
          { message: "Front and rear make both operations constant time.", line: 1, done: ids.slice(1), pointers: { complexity: "O(1)" } },
        ];
  }
  if (variant === "clone-random") {
    return [
      { message: "Insert each cloned node directly after its original.", line: 0, active: [ids[0]], done: ["R1"], pointers: { original: ids[0], clone: "R1" } },
      { message: "Use original.random.next to assign clone random links.", line: 1, active: [ids[1], ids[3]], pointers: { "clone.random": "original.random.next" } },
      { message: "Separate the interleaved nodes into original and clone chains.", line: 2, done: ids, pointers: { clonedHead: "R1" } },
    ];
  }
  if (mode === "insert") {
    return [
      { message: `Prepare new node(${insertValue}) before touching existing links.`, line: 0, active: ["NEW"], pointers: { head: ids[0], newNode: `NEW(${insertValue})` } },
      { message: "Traverse until the predecessor of the insertion point is selected.", line: 2, active: [ids[1]], pointers: { prev: ids[1], curr: ids[2] } },
      { message: "Connect the new node to the next part of the chain first.", line: 3, active: ["NEW", ids[2]], pointers: { newNode: "NEW", next: ids[2] } },
      { message: "Connect the predecessor to the new node.", line: 4, active: [ids[1], "NEW"], done: [ids[0]], pointers: { prev: ids[1], newNode: "NEW" } },
      { message: "Insertion complete. The chain remains reachable from head.", line: 5, done: [...ids, "NEW"], pointers: { head: ids[0], tail: ids[ids.length - 1] } },
    ];
  }
  if (mode === "delete") {
    return [
      { message: "Start with previous behind current.", line: 0, active: [ids[0]], pointers: { prev: "null", curr: ids[0] } },
      { message: "Advance both pointers until current reaches the target.", line: 3, active: [safePrev, safeTarget].filter((id) => id !== "null"), pointers: { prev: safePrev, curr: safeTarget } },
      { message: "Bypass the target by linking previous to current.next.", line: 4, active: [safePrev, safeNext].filter((id) => id !== "null"), warn: [safeTarget], pointers: { prev: safePrev, target: safeTarget, next: safeNext } },
      { message: "Detach the target node from the visible chain.", line: 5, done: ids.filter((id) => id !== safeTarget), warn: [safeTarget], pointers: { head: ids[0], removed: safeTarget } },
    ];
  }
  if (mode === "reverse") {
    return [
      { message: "Initialize previous as null and current at head.", line: 0, active: [ids[0]], pointers: { prev: "null", curr: ids[0], next: ids[1] } },
      { message: "Store next before rewiring current.", line: 3, active: [ids[0], ids[1]], pointers: { prev: "null", curr: ids[0], next: ids[1] } },
      { message: "Reverse the current node link toward previous.", line: 4, active: [ids[0]], done: [ids[0]], pointers: { prev: "null", curr: ids[0] } },
      { message: "Advance prev and curr together.", line: 5, active: [ids[1]], done: [ids[0]], pointers: { prev: ids[0], curr: ids[1], next: ids[2] } },
      { message: "Repeat until every link points backward.", line: 6, active: [ids[3]], done: [ids[0], ids[1], ids[2]], pointers: { prev: ids[2], curr: ids[3], next: ids[4] } },
      { message: "Previous becomes the new head.", line: 7, done: ids, pointers: { head: ids[4], tail: ids[0] } },
    ];
  }
  if (mode === "cycle") {
    return [
      { message: "Place slow and fast at head.", line: 0, active: [ids[0]], pointers: { slow: ids[0], fast: ids[0] } },
      { message: "Slow moves one step; fast moves two.", line: 3, active: [ids[1], ids[2]], pointers: { slow: ids[1], fast: ids[2] } },
      { message: "Continue until fast ends or the pointers meet.", line: 4, active: [ids[2], ids[4]], pointers: { slow: ids[2], fast: ids[4] } },
      { message: "A repeated meeting means a cycle exists.", line: 5, active: [ids[3]], warn: [ids[1]], pointers: { slow: ids[3], fast: ids[3], loop: ids[1] } },
    ];
  }
  if (mode === "merge") {
    return [
      { message: "Compare the two current heads.", line: 2, active: [ids[0], ids[1]], pointers: { a: ids[0], b: ids[1], tail: "dummy" } },
      { message: "Append the smaller node to the result chain.", line: 4, active: [ids[1]], done: [ids[1]], pointers: { picked: ids[1], tail: ids[1] } },
      { message: "Advance only the list that contributed a node.", line: 5, active: [ids[0], ids[2]], done: [ids[1]], pointers: { a: ids[0], b: ids[2], tail: ids[1] } },
      { message: "Keep stitching nodes in sorted or partitioned order.", line: 5, active: [ids[2], ids[3]], done: [ids[0], ids[1]], pointers: { tail: ids[2], nextPick: ids[3] } },
      { message: "Attach the remaining chain.", line: 6, done: ids, pointers: { resultHead: ids[1], tail: ids[4] } },
    ];
  }
  if (mode === "arithmetic") {
    return [
      { message: "Read the first pair of digit nodes.", line: 1, active: [ids[0], ids[1]], pointers: { l1: ids[0], l2: ids[1], carry: "0" } },
      { message: "Compute digit plus carry and append the result node.", line: 2, active: [ids[0], ids[1]], done: ["R1"], pointers: { sum: "19", carry: "1", result: "R1" } },
      { message: "Advance both source pointers.", line: 5, active: [ids[2], ids[3]], done: ["R1"], pointers: { l1: ids[2], l2: ids[3], carry: "1" } },
      { message: "Continue until both lists and carry are exhausted.", line: 1, active: [ids[4]], done: ["R1", "R2"], pointers: { l1: ids[4], l2: "null", carry: "1" } },
      { message: "The result list stores the final arithmetic answer.", line: 4, done: ["R1", "R2", "R3"], pointers: { resultHead: "R1", carry: "0" } },
    ];
  }
  if (mode === "structure") {
    return [
      { message: "A head pointer gives access to the first node.", line: 2, active: [ids[0]], pointers: { head: ids[0] } },
      { message: "Each node stores data and a link field.", line: 1, active: [ids[1]], done: [ids[0]], pointers: { current: ids[1], next: ids[2] } },
      { message: "Variants add prev, child, random, or circular links.", line: 4, active: [ids[2], ids[3]], pointers: { current: ids[2], extraLink: ids[3] } },
      { message: "The tail either points to null or loops back in circular lists.", line: 5, active: [ids[4]], done: ids, pointers: { tail: ids[4], next: "null/head" } },
    ];
  }
  return [
    { message: "Start traversal from the head pointer.", line: 0, active: [ids[0]], pointers: { head: ids[0], current: ids[0] } },
    { message: "Visit current.data and evaluate the lesson condition.", line: 2, active: [ids[1]], done: [ids[0]], pointers: { current: ids[1], previous: ids[0] } },
    { message: "Advance current to the next node.", line: 4, active: [ids[2]], done: [ids[0], ids[1]], pointers: { current: ids[2], previous: ids[1] } },
    { message: "Continue until the target, answer, or null is reached.", line: 3, active: [ids[3]], done: [ids[0], ids[1], ids[2]], pointers: { current: ids[3], answer: ids[2] } },
    { message: "Traversal complete.", line: 5, done: ids, pointers: { current: "null", result: ids[2] } },
  ];
}

function kindForNode(nodeId: string, step: Step): NodeKind {
  if (step.warn?.includes(nodeId)) return "warn";
  if (step.active?.includes(nodeId)) return "active";
  if (step.done?.includes(nodeId)) return "done";
  return "normal";
}

function getNodeById(nodes: ListNode[], id: string) {
  return nodes.find((node) => node.id === id);
}

function getNextNodeId(nodes: ListNode[]) {
  const nextNumber =
    nodes.reduce((max, node) => {
      const match = /^N(\d+)$/.exec(node.id);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0) + 1;
  return `N${nextNumber}`;
}

function relayoutLinear(nodes: ListNode[], y = 230): ListNode[] {
  // Keep the chain readable after structural edits (insert/delete) so nodes don't overlap.
  return nodes.map((node, index) => ({
    ...node,
    x: 90 + index * 120,
    y,
  }));
}

function applyOperation(nodes: ListNode[], profile: Profile, inputs: OperationInputs): ListNode[] {
  const variant = profile.variant;
  const insertValue = inputs.insertValue.trim() || "99";
  const insertPosition = clampIndex(inputs.insertPosition, 0, nodes.length);
  const deletePosition = clampIndex(inputs.deletePosition, 0, Math.max(0, nodes.length - 1));
  const nthFromEnd = clampIndex(inputs.nthFromEnd, 1, Math.max(1, nodes.length));

  if (variant === "insert-beginning") {
    const newNode: ListNode = {
      id: getNextNodeId(nodes),
      value: insertValue,
      x: 90,
      y: 230,
    };
    return relayoutLinear([newNode, ...nodes]);
  }

  if (variant === "insert-end") {
    const newNode: ListNode = {
      id: getNextNodeId(nodes),
      value: insertValue,
      x: 90,
      y: 230,
    };
    return relayoutLinear([...nodes, newNode]);
  }

  if (variant === "insert-position" || variant === "insert-dll") {
    const newNode: ListNode = {
      id: getNextNodeId(nodes),
      value: insertValue,
      x: 90,
      y: 230,
    };
    const next = nodes.slice();
    next.splice(insertPosition, 0, newNode);
    return relayoutLinear(next);
  }

  if (variant === "delete-beginning") {
    return relayoutLinear(nodes.slice(1));
  }

  if (variant === "delete-end") {
    return relayoutLinear(nodes.slice(0, -1));
  }

  if (variant === "delete-position" || variant === "delete-dll") {
    if (nodes.length === 0) return nodes;
    const next = nodes.slice();
    next.splice(deletePosition, 1);
    return relayoutLinear(next);
  }

  if (variant === "delete-value") {
    const target = inputs.deleteValue.trim();
    if (!target) return nodes;
    const idx = nodes.findIndex((n) => n.value === target);
    if (idx === -1) return nodes;
    const next = nodes.slice();
    next.splice(idx, 1);
    return relayoutLinear(next);
  }

  if (variant === "delete-nth-end") {
    if (nodes.length === 0) return nodes;
    const idx = clampIndex(nodes.length - nthFromEnd, 0, nodes.length - 1);
    const next = nodes.slice();
    next.splice(idx, 1);
    return relayoutLinear(next);
  }

  return nodes;
}

function pointerLinksFromStep(nodes: ListNode[], step: Step): VisualLink[] {
  const links: VisualLink[] = [];

  for (const [rawKey, rawValue] of Object.entries(step.pointers || {})) {
    const key = String(rawKey);
    const value = String(rawValue);
    if (!key.includes(".")) continue;

    const [fromKey, field] = key.split(".", 2);
    if (field !== "next" && field !== "prev") continue;

    const from =
      fromKey === "head" ? nodes[0]?.id :
      fromKey === "tail" ? nodes[nodes.length - 1]?.id :
      fromKey === "oldHead" ? nodes[0]?.id :
      fromKey;

    const to = value.includes("NEW") ? "NEW" : value;
    if (!from || !to) continue;
    if (to === "null" || to === "dummy") continue;

    links.push({ from, to, kind: field as "next" | "prev", label: key });
  }

  // De-dupe identical links (same from/to/kind).
  const seen = new Set<string>();
  return links.filter((l) => {
    const sig = `${l.kind}:${l.from}->${l.to}`;
    if (seen.has(sig)) return false;
    seen.add(sig);
    return true;
  });
}

function linePath(from: ListNode, to: ListNode) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const startX = from.x + (dx / length) * 42;
  const startY = from.y + (dy / length) * 22;
  const endX = to.x - (dx / length) * 46;
  const endY = to.y - (dy / length) * 22;
  return `M ${startX} ${startY} L ${endX} ${endY}`;
}

function curvePath(from: ListNode, to: ListNode, bend = -52) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 + bend;
  return `M ${from.x + 38} ${from.y} Q ${midX} ${midY} ${to.x - 42} ${to.y}`;
}

export default function LinkedListLessonStudio({ lessonId, title, scenario }: LessonProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  const profile = useMemo(
    () => ({ ...getProfile(lessonId, title || formatTitle(lessonId)), ...scenario?.profile }),
    [lessonId, scenario?.profile, title]
  );
  const initialNodes = useMemo(() => scenario?.nodes || getInitialNodes(profile.variant), [profile.variant, scenario?.nodes]);

  const [nodes, setNodes] = useState<ListNode[]>(initialNodes);
  const [listInput, setListInput] = useState(() => initialNodes.map((node) => node.value).join(", "));
  const [operationInputs, setOperationInputs] = useState<OperationInputs>({
    insertValue: "99",
    insertPosition: 2,
    deleteValue: initialNodes[2]?.value || initialNodes[0]?.value || "",
    deletePosition: Math.min(2, Math.max(0, initialNodes.length - 1)),
    nthFromEnd: Math.min(2, Math.max(1, initialNodes.length)),
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [statePos, setStatePos] = useState({ x: 24, y: 24 });
  const [infoPos, setInfoPos] = useState({ x: 460, y: 24 });
  const [codePos, setCodePos] = useState({ x: 24, y: 300 });
  const [activePanel, setActivePanel] = useState<"state" | "info" | "code" | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const supportsCustomOperation = profile.variant.startsWith("insert-") || profile.variant.startsWith("delete-");
  const steps = useMemo(
    () => (supportsCustomOperation ? buildSteps(nodes, profile, operationInputs) : scenario?.steps || buildSteps(nodes, profile, operationInputs)),
    [nodes, operationInputs, profile, scenario?.steps, supportsCustomOperation]
  );
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const isCircular = profile.variant.includes("circular");
  const isDoubly = profile.variant.includes("doubly") || profile.variant.includes("dll");
  const scenarioLinks = scenario?.links;
  const operationLinks = useMemo(() => (supportsCustomOperation ? pointerLinksFromStep(nodes, step) : []), [nodes, step, supportsCustomOperation]);
  const visualLinks = scenarioLinks;

  useEffect(() => {
    let timer: number | undefined;
    if (playing && stepIndex < steps.length - 1) {
      timer = window.setInterval(() => {
        setStepIndex((current) => {
          if (current >= steps.length - 2) {
            setPlaying(false);
            return steps.length - 1;
          }
          return current + 1;
        });
      }, speed);
    }
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [playing, speed, stepIndex, steps.length]);

  useEffect(() => {
    setNodes(initialNodes);
    setListInput(initialNodes.map((node) => node.value).join(", "));
    setOperationInputs((current) => ({
      ...current,
      deleteValue: initialNodes[2]?.value || initialNodes[0]?.value || "",
      deletePosition: Math.min(2, Math.max(0, initialNodes.length - 1)),
      nthFromEnd: Math.min(2, Math.max(1, initialNodes.length)),
      insertPosition: Math.min(2, initialNodes.length),
    }));
    setSelected(null);
    setStepIndex(0);
    setPlaying(false);
  }, [initialNodes]);

  const lastAppliedKey = useRef<string | null>(null);
  const appliedThisLastStep = useRef(false);
  useEffect(() => {
    if (!supportsCustomOperation) return;
    if (steps.length === 0) return;
    if (stepIndex !== steps.length - 1) return;
    if (appliedThisLastStep.current) return;

    const applyKey = JSON.stringify({ variant: profile.variant, inputs: operationInputs, seed: nodes.map((n) => `${n.id}:${n.value}`).join("|") });
    if (lastAppliedKey.current === applyKey) return;
    lastAppliedKey.current = applyKey;
    appliedThisLastStep.current = true;

    const nextNodes = applyOperation(nodes, profile, operationInputs);
    if (nextNodes === nodes) return;

    // Commit the structural change at the end of the simulation so users see the list actually update.
    setNodes(nextNodes);
    setListInput(nextNodes.map((node) => node.value).join(", "));
    setSelected(null);
    setPlaying(false);
    setOperationInputs((current) => ({
      ...current,
      deleteValue: nextNodes[2]?.value || nextNodes[0]?.value || "",
      deletePosition: clampIndex(current.deletePosition, 0, Math.max(0, nextNodes.length - 1)),
      insertPosition: clampIndex(current.insertPosition, 0, nextNodes.length),
      nthFromEnd: clampIndex(current.nthFromEnd, 1, Math.max(1, nextNodes.length)),
    }));
    setStepIndex(0);
  }, [nodes, operationInputs, profile, stepIndex, steps.length, supportsCustomOperation]);

  useEffect(() => {
    // Re-arm after leaving the last step.
    if (stepIndex !== steps.length - 1) appliedThisLastStep.current = false;
  }, [stepIndex, steps.length]);

  const svgPoint = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const handleMove = (e: React.PointerEvent) => {
    if (!draggingNode && !activePanel) return;
    const pt = svgPoint(e);
    if (draggingNode) {
      setNodes((current) =>
        current.map((node) =>
          node.id === draggingNode
            ? { ...node, x: Math.max(50, Math.min(630, pt.x)), y: Math.max(90, Math.min(410, pt.y)) }
            : node
        )
      );
      return;
    }
    if (activePanel === "state") setStatePos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    if (activePanel === "info") setInfoPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    if (activePanel === "code") setCodePos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
  };

  const startPanelDrag = (e: React.PointerEvent, panel: "state" | "info" | "code", pos: { x: number; y: number }) => {
    e.stopPropagation();
    const pt = svgPoint(e);
    setActivePanel(panel);
    setDragOffset({ x: pt.x - pos.x, y: pt.y - pos.y });
  };

  const addNode = () => {
    setNodes((current) => {
      const newId = getNextNodeId(current);
      const next = current.length + 1;
      const updated = [
        ...current,
        { id: newId, value: String((next * 7) % 41), x: Math.min(620, 90 + current.length * 105), y: 320 },
      ];
      setListInput(updated.map((node) => node.value).join(", "));
      setSelected(newId);
      return updated;
    });
    setStepIndex(0);
  };

  const applyListInput = () => {
    const values = parseNodeValues(listInput);
    if (values.length === 0) return;
    const nextNodes = nodesFromValues(values);
    setNodes(nextNodes);
    setOperationInputs((current) => ({
      ...current,
      deleteValue: values[Math.min(current.deletePosition, values.length - 1)] || values[0],
      deletePosition: clampIndex(current.deletePosition, 0, values.length - 1),
      insertPosition: clampIndex(current.insertPosition, 0, values.length),
      nthFromEnd: clampIndex(current.nthFromEnd, 1, values.length),
    }));
    setSelected(null);
    setStepIndex(0);
    setPlaying(false);
  };

  const updateSelectedValue = (value: string) => {
    if (!selected) return;
    setNodes((current) => {
      const next = current.map((node) => (node.id === selected ? { ...node, value } : node));
      setListInput(next.map((node) => node.value).join(", "));
      return next;
    });
    setStepIndex(0);
  };

  const removeSelected = () => {
    if (!selected || nodes.length <= 1) return;
    setNodes((current) => {
      const updated = current.filter((node) => node.id !== selected);
      setListInput(updated.map((node) => node.value).join(", "));
      return updated;
    });
    setSelected(null);
    setStepIndex(0);
  };

  const reset = () => {
    setNodes(initialNodes);
    setListInput(initialNodes.map((node) => node.value).join(", "));
    setOperationInputs({
      insertValue: "99",
      insertPosition: Math.min(2, initialNodes.length),
      deleteValue: initialNodes[2]?.value || initialNodes[0]?.value || "",
      deletePosition: Math.min(2, Math.max(0, initialNodes.length - 1)),
      nthFromEnd: Math.min(2, Math.max(1, initialNodes.length)),
    });
    setSelected(null);
    setStepIndex(0);
    setPlaying(false);
  };

  return (
    <main className="ll-page" data-theme={theme} suppressHydrationWarning>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">{profile.eyebrow}</span>
          <h1>{title}</h1>
          <p className="description">{profile.definition}</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">{profile.time}</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">{profile.space}</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          {profile.cards.map((card) => (
            <article key={card.title} className={card.highlight ? "guide-card highlight" : "guide-card"}>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor">
            <button onClick={addNode} suppressHydrationWarning><Plus size={16} /> Add Node</button>
            <button onClick={removeSelected} disabled={!selected} suppressHydrationWarning><Trash2 size={16} /> Remove</button>
            <button onClick={reset} suppressHydrationWarning><RotateCcw size={16} /> Reset</button>
            <div className="input-strip">
              <label>
                <span>List values</span>
                <input value={listInput} onChange={(e) => setListInput(e.target.value)} onBlur={applyListInput} placeholder="12, 7, 19, 4" />
              </label>
              <button onClick={applyListInput} suppressHydrationWarning>Apply List</button>
              <label>
                <span>Selected value</span>
                <input
                  value={selected ? nodes.find((node) => node.id === selected)?.value || "" : ""}
                  onChange={(e) => updateSelectedValue(e.target.value)}
                  disabled={!selected}
                  placeholder="Select node"
                />
              </label>
            </div>
            {profile.mode === "insert" && (
              <div className="input-strip operation-strip">
                <label>
                  <span>Insert value</span>
                  <input
                    value={operationInputs.insertValue}
                    suppressHydrationWarning
                    onChange={(e) => {
                      setOperationInputs((current) => ({ ...current, insertValue: e.target.value }));
                      setStepIndex(0);
                    }}
                  />
                </label>
                <label>
                  <span>Position</span>
                  <input
                    type="number"
                    min={0}
                    max={nodes.length}
                    value={operationInputs.insertPosition}
                    suppressHydrationWarning
                    onChange={(e) => {
                      setOperationInputs((current) => ({ ...current, insertPosition: clampIndex(Number(e.target.value), 0, nodes.length) }));
                      setStepIndex(0);
                    }}
                  />
                </label>
              </div>
            )}
            {profile.mode === "delete" && (
              <div className="input-strip operation-strip">
                <label>
                  <span>Delete value</span>
                  <input
                    value={operationInputs.deleteValue}
                    suppressHydrationWarning
                    onChange={(e) => {
                      setOperationInputs((current) => ({ ...current, deleteValue: e.target.value }));
                      setStepIndex(0);
                    }}
                  />
                </label>
                <label>
                  <span>Delete position</span>
                  <input
                    type="number"
                    min={0}
                    max={Math.max(0, nodes.length - 1)}
                    value={operationInputs.deletePosition}
                    suppressHydrationWarning
                    onChange={(e) => {
                      setOperationInputs((current) => ({ ...current, deletePosition: clampIndex(Number(e.target.value), 0, Math.max(0, nodes.length - 1)) }));
                      setStepIndex(0);
                    }}
                  />
                </label>
                <label>
                  <span>N from end</span>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, nodes.length)}
                    value={operationInputs.nthFromEnd}
                    suppressHydrationWarning
                    onChange={(e) => {
                      setOperationInputs((current) => ({ ...current, nthFromEnd: clampIndex(Number(e.target.value), 1, Math.max(1, nodes.length)) }));
                      setStepIndex(0);
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>Click a node to select it</span>
                <span>Drag nodes to reposition the chain</span>
                <span>Drag panel headers to rearrange tools</span>
                <span>Resize panel corners when space gets tight</span>
              </div>
              <div className="status-panel">
                <h2>Current Step</h2>
                <p className="status-msg">{step.message}</p>
                <div className="playback-controls">
                  <button onClick={() => setStepIndex(0)} suppressHydrationWarning><RotateCcw size={16} /></button>
                  <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))} suppressHydrationWarning><ChevronLeft size={18} /></button>
                  <button onClick={() => setPlaying((value) => !value)} className="play-btn" suppressHydrationWarning>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
                  <button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))} suppressHydrationWarning><ChevronRight size={18} /></button>
                </div>
                <div className="speed-ctrl">
                  <span>Speed</span>
                  <input type="range" min="100" max="1600" step="100" value={1700 - speed} onChange={(e) => setSpeed(1700 - Number(e.target.value))} />
                </div>
              </div>
            </aside>

            <svg ref={svgRef} viewBox="0 0 700 500" onPointerMove={handleMove} onPointerUp={() => { setDraggingNode(null); setActivePanel(null); }}>
              <defs>
                <marker id="ll-arrow" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
                  <path d="M0,0 L0,8 L10,4 z" fill="currentColor" />
                </marker>
              </defs>

              {visualLinks
                ? visualLinks.map((link) => {
                    const from = getNodeById(nodes, link.from);
                    const to = getNodeById(nodes, link.to);
                    if (!from || !to) return null;
                    const active = step.active?.includes(from.id) || step.active?.includes(to.id);
                    const className = ["link", link.kind || "next", active ? "active" : ""].filter(Boolean).join(" ");
                    const d = link.kind === "random" || link.kind === "prev" || link.kind === "loop" ? curvePath(from, to, link.kind === "prev" ? 56 : -60) : linePath(from, to);
                    const labelX = (from.x + to.x) / 2;
                    const labelY = (from.y + to.y) / 2 + (link.kind === "prev" ? 48 : -44);
                    return (
                      <g key={`${link.from}-${link.to}-${link.kind || "next"}`}>
                        <path className={className} d={d} markerEnd="url(#ll-arrow)" />
                        {link.label && <text x={labelX} y={labelY} className="link-label">{link.label}</text>}
                      </g>
                    );
                  })
                : nodes.slice(0, -1).map((node, index) => {
                    const next = nodes[index + 1];
                    const active = step.active?.includes(node.id) || step.active?.includes(next.id);
                    return <path key={`${node.id}-${next.id}`} className={active ? "link active" : "link"} d={linePath(node, next)} markerEnd="url(#ll-arrow)" />;
                  })}

              {!visualLinks && isDoubly && nodes.slice(1).map((node, index) => {
                const prev = nodes[index];
                const active = step.active?.includes(node.id) || step.active?.includes(prev.id);
                return (
                  <path
                    key={`${node.id}-${prev.id}-prev`}
                    className={active ? "link prev active" : "link prev"}
                    d={`M ${node.x - 38} ${node.y + 26} C ${node.x - 72} ${node.y + 70}, ${prev.x + 72} ${prev.y + 70}, ${prev.x + 38} ${prev.y + 26}`}
                    markerEnd="url(#ll-arrow)"
                  />
                );
              })}

              {!visualLinks && (profile.mode === "cycle" || isCircular) && nodes.length > 3 && (
                <path
                  className="link loop"
                  d={`M ${nodes[nodes.length - 1].x} ${nodes[nodes.length - 1].y + 28} C 520 430, 210 430, ${isCircular ? nodes[0].x : nodes[1].x} ${isCircular ? nodes[0].y + 28 : nodes[1].y + 28}`}
                  markerEnd="url(#ll-arrow)"
                />
              )}

              {operationLinks.map((link) => {
                const from = link.from === "NEW" ? { id: "NEW", value: operationInputs.insertValue || "NEW", x: 336, y: 122 } : getNodeById(nodes, link.from);
                const to = link.to === "NEW" ? { id: "NEW", value: operationInputs.insertValue || "NEW", x: 336, y: 122 } : getNodeById(nodes, link.to);
                if (!from || !to) return null;
                const className = ["link", "overlay", link.kind || "next"].filter(Boolean).join(" ");
                const d = link.kind === "prev" ? curvePath(from, to, 56) : linePath(from, to);
                const labelX = (from.x + to.x) / 2;
                const labelY = (from.y + to.y) / 2 - 52;
                return (
                  <g key={`overlay-${link.from}-${link.to}-${link.kind || "next"}`}>
                    <path className={className} d={d} markerEnd="url(#ll-arrow)" />
                    {link.label && <text x={labelX} y={labelY} className="link-label overlay-label">{link.label}</text>}
                  </g>
                );
              })}

              {profile.mode === "insert" && (
                <g className={kindForNode("NEW", step)}>
                  <rect x={300} y={100} width="72" height="44" rx="10" className="node-box" />
                  <text x={336} y={127} className="node-value">{operationInputs.insertValue || "NEW"}</text>
                  <text x={336} y={86} className="node-id">NEW</text>
                </g>
              )}

              {profile.mode === "arithmetic" && ["R1", "R2", "R3"].map((id, index) => (
                <g key={id} className={kindForNode(id, step)}>
                  <rect x={235 + index * 92} y={360} width="70" height="42" rx="10" className="node-box result" />
                  <text x={270 + index * 92} y={386} className="node-value">{id}</text>
                </g>
              ))}

              {nodes.map((node) => {
                const kind = kindForNode(node.id, step);
                return (
                  <g
                    key={node.id}
                    className={`list-node ${kind} ${selected === node.id ? "selected" : ""}`}
                    onPointerDown={(e) => { e.stopPropagation(); setSelected(node.id); setDraggingNode(node.id); }}
                  >
                    <rect x={node.x - 38} y={node.y - 24} width="76" height="48" rx="12" className="node-box" />
                    <line x1={node.x + 16} y1={node.y - 24} x2={node.x + 16} y2={node.y + 24} className="node-divider" />
                    <text x={node.x - 10} y={node.y + 5} className="node-value">{node.value}</text>
                    <text x={node.x + 27} y={node.y + 5} className="next-value">next</text>
                    {isDoubly && <text x={node.x - 29} y={node.y - 32} className="prev-label">prev</text>}
                    <text x={node.x} y={node.y + 44} className="node-id">{node.id}</text>
                  </g>
                );
              })}

              <foreignObject x={statePos.x} y={statePos.y} width="190" height="250" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "state", statePos)}>
                    <span>Pointer State</span>
                    <span className="drag-handle">::</span>
                  </div>
                  <div className="panel-content pointer-table">
                    {Object.entries(step.pointers).map(([name, value]) => (
                      <div key={name} className="pointer-row">
                        <span>{name}</span>
                        <b>{value}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={infoPos.x} y={infoPos.y} width="190" height="190" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "info", infoPos)}>
                    <span>Lesson Data</span>
                    <span className="drag-handle">::</span>
                  </div>
                  <div className="panel-content info-panel">
                    <div className="info-stat"><span>Nodes</span><b>{nodes.length}</b></div>
                    <div className="info-stat"><span>Selected</span><b>{selected || "-"}</b></div>
                    <div className="info-stat"><span>Pattern</span><b>{profile.mode}</b></div>
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={codePos.x} y={codePos.y} width="250" height="190" className="movable-panel">
                <div onPointerDown={(e) => startPanelDrag(e, "code", codePos)} className="code-shell">
                  <CodeTracker code={profile.code} activeLine={step.line} theme={theme} />
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </section>

      <style jsx>{`
        .ll-page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: Arial, sans-serif; }
        .ll-page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        .hero { padding: 128px 24px 88px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .content-width { max-width: 1280px; margin: 0 auto; }
        .eyebrow { color: var(--blue); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.18em; }
        h1 { margin: 18px 0; font-size: clamp(48px, 8vw, 92px); line-height: 0.96; letter-spacing: -0.04em; font-weight: 900; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .description { max-width: 900px; color: var(--muted); font-size: 20px; line-height: 1.65; margin: 28px 0 42px; }
        .complexity-tag-group, .actions, .editor, .playback-controls { display: flex; flex-wrap: wrap; gap: 10px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 12px 20px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { color: var(--muted); font-size: 11px; text-transform: uppercase; font-weight: 800; }
        .complexity-tag .value { color: var(--blue); font-family: monospace; font-size: 20px; font-weight: 900; }
        .primary-btn, button { border: 1px solid var(--border); border-radius: 10px; min-height: 40px; padding: 0 14px; background: var(--panel2); color: var(--text); display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        input { border: 1px solid var(--border); border-radius: 10px; min-height: 40px; padding: 0 12px; background: var(--panel); color: var(--text); outline: none; }
        input:disabled { opacity: 0.48; cursor: not-allowed; }
        input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px color-mix(in srgb, var(--blue) 20%, transparent); }
        .primary-btn { background: var(--blue); color: #fff; border-radius: 999px; padding: 14px 32px; font-weight: 800; text-decoration: none; margin-top: 34px; }
        .detailed-guide { max-width: 1280px; margin: 0 auto; padding: 92px 24px; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 34px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 34px; }
        .guide-card.highlight { border-bottom: 4px solid var(--amber); }
        .guide-card h2 { font-size: 19px; margin-bottom: 14px; }
        .guide-card p { color: var(--muted); font-size: 14px; line-height: 1.75; }
        .simulator { padding: 72px 0 120px; border-top: 1px solid var(--border); }
        .simulator-content { max-width: 1420px; margin: 0 auto; padding: 0 32px; }
        .editor { margin-bottom: 20px; align-items: flex-end; }
        .input-strip { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; width: 100%; padding: 12px; background: var(--panel); border: 1px solid var(--border); border-radius: 14px; }
        .operation-strip { border-color: color-mix(in srgb, var(--blue) 35%, var(--border)); background: color-mix(in srgb, var(--blue) 7%, var(--panel)); }
        .input-strip label { display: flex; flex-direction: column; gap: 6px; min-width: 140px; flex: 1; }
        .input-strip label:first-child { flex: 2; min-width: 240px; }
        .input-strip span { color: var(--muted); font-size: 10px; text-transform: uppercase; font-weight: 900; letter-spacing: 0.08em; }
        .workspace { display: grid; grid-template-columns: 330px 1fr; gap: 36px; background: var(--panel); border: 1px solid var(--border); border-radius: 20px; padding: 36px; box-shadow: 0 25px 60px -22px rgba(0,0,0,0.6); }
        aside { display: flex; flex-direction: column; gap: 26px; resize: both; overflow: auto; min-width: 220px; min-height: 220px; max-width: 560px; max-height: 640px; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 12px; padding: 14px; color: var(--muted); font-size: 12px; display: flex; flex-direction: column; gap: 6px; }
        .status-panel { display: flex; flex-direction: column; gap: 14px; }
        .status-panel h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); }
        .status-msg { min-height: 74px; line-height: 1.55; font-weight: 700; }
        .play-btn { background: var(--blue); color: #fff; border-color: var(--blue); border-radius: 999px; width: 48px; justify-content: center; }
        .speed-ctrl { color: var(--muted); font-size: 12px; display: flex; flex-direction: column; gap: 8px; }
        .speed-ctrl input { accent-color: var(--blue); }
        svg { width: 100%; min-height: 620px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 12px; }
        .link { color: var(--muted); fill: none; stroke: currentColor; stroke-width: 2.5; opacity: 0.65; transition: all 0.25s; }
        .link.active { color: var(--blue); stroke-width: 4; opacity: 1; filter: drop-shadow(0 0 8px var(--blue)); }
        .link.overlay { color: var(--amber); opacity: 0.92; stroke-dasharray: 6 6; stroke-width: 3; }
        .link.loop { color: var(--amber); stroke-dasharray: 8 5; }
        .link.prev { color: var(--green); opacity: 0.48; stroke-dasharray: 5 4; }
        .link.random { color: var(--amber); opacity: 0.78; stroke-dasharray: 3 5; }
        .overlay-label { fill: var(--amber); opacity: 0.9; font-weight: 800; }
        .link-label { fill: var(--muted); font-size: 10px; font-weight: 900; text-anchor: middle; text-transform: uppercase; }
        .list-node { cursor: grab; }
        .list-node:active { cursor: grabbing; }
        .node-box { fill: var(--panel); stroke: var(--border); stroke-width: 2; transition: all 0.25s; }
        .node-divider { stroke: var(--border); stroke-width: 1; }
        .node-value, .next-value, .node-id, .prev-label { fill: var(--text); font-weight: 900; text-anchor: middle; user-select: none; }
        .next-value { fill: var(--muted); font-size: 9px; text-transform: uppercase; }
        .prev-label { fill: var(--green); font-size: 9px; text-transform: uppercase; }
        .node-id { fill: var(--muted); font-size: 10px; font-family: monospace; }
        .list-node.active .node-box, g.active .node-box { fill: var(--blue); stroke: var(--blue); filter: drop-shadow(0 0 10px var(--blue)); }
        .list-node.active text, g.active text { fill: #fff; }
        .list-node.done .node-box, g.done .node-box { stroke: var(--green); fill: color-mix(in srgb, var(--green) 15%, var(--panel)); }
        .list-node.warn .node-box, g.warn .node-box { stroke: var(--red); fill: color-mix(in srgb, var(--red) 14%, var(--panel)); }
        .list-node.selected .node-box { stroke: var(--amber); stroke-width: 4; }
        .node-box.result { stroke: var(--green); }
        .movable-panel { cursor: grab; overflow: visible; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.35)); }
        .movable-panel:active { cursor: grabbing; }
        .movable-panel > div { resize: both; overflow: auto; min-width: 150px; min-height: 120px; max-width: 620px; max-height: 430px; }
        .panel-container { height: 100%; background: color-mix(in srgb, var(--panel) 90%, transparent); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
        .panel-header { background: var(--panel2); border-bottom: 1px solid var(--border); padding: 10px 14px; display: flex; justify-content: space-between; color: var(--muted); font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; }
        .panel-content { padding: 14px; flex: 1; overflow: auto; }
        .pointer-row { display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding: 7px 0; font-size: 12px; font-family: monospace; }
        .pointer-row span { color: var(--muted); }
        .pointer-row b { color: var(--blue); }
        .info-panel { display: flex; flex-direction: column; gap: 12px; }
        .info-stat { display: flex; flex-direction: column; gap: 4px; }
        .info-stat span { color: var(--muted); font-size: 10px; text-transform: uppercase; font-weight: 900; }
        .info-stat b { color: var(--text); font-size: 15px; }
        .code-shell { height: 100%; }
        @media (max-width: 920px) {
          .workspace { grid-template-columns: 1fr; padding: 20px; }
          svg { min-height: 560px; }
          .description { font-size: 17px; }
        }
      `}</style>
    </main>
  );
}
