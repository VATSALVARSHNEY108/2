"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Pause,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Shuffle,
  Trash2,
} from "lucide-react";

type LessonKind = "search" | "sort" | "partition" | "answer" | "selection" | "merge" | "concept";

type Step = {
  label: string;
  message: string;
  array: number[];
  active: number[];
  done: number[];
  range?: [number, number];
  pivot?: number;
  result?: number | string | null;
  line: number;
  vars: Record<string, string | number>;
};

type LessonProfile = {
  title: string;
  kind: LessonKind;
  definition: string;
  time: string;
  space: string;
  points: string[];
  code: string[];
  defaultArray: number[];
  target: number;
};

type LessonProps = {
  lessonId: string;
  title?: string;
};

const BASE_ARRAY = [42, 17, 8, 99, 23, 61, 4, 55];
const SORTED_ARRAY = [4, 8, 17, 23, 42, 55, 61, 99];

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  },
  hero: {
    padding: "96px 48px 44px",
    borderBottom: "1px solid var(--border-color)",
  },
  shell: {
    maxWidth: 1280,
    margin: "0 auto",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase" as const,
    letterSpacing: "0.16em",
    color: "var(--text-secondary)",
  },
  h1: {
    margin: "16px 0",
    fontSize: "clamp(40px, 7vw, 76px)",
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: 0,
  },
  intro: {
    maxWidth: 850,
    color: "var(--text-secondary)",
    fontSize: 17,
    lineHeight: 1.7,
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 12,
    marginTop: 26,
  },
  badge: {
    border: "1px solid var(--border-color)",
    background: "var(--bg-secondary)",
    padding: "12px 16px",
    borderRadius: 8,
    minWidth: 150,
  },
  label: {
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    color: "var(--text-secondary)",
  },
  value: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: 800,
  },
  body: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "36px 32px 96px",
    display: "grid",
    gridTemplateColumns: "minmax(260px, 340px) minmax(0, 1fr)",
    gap: 24,
  },
  card: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
  },
  panel: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    padding: 18,
  },
  input: {
    width: "100%",
    height: 36,
    borderRadius: 6,
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    padding: "0 10px",
    outline: "none",
    fontWeight: 700,
  },
  button: {
    height: 36,
    borderRadius: 6,
    border: "1px solid var(--border-color)",
    background: "var(--bg-elevated)",
    color: "var(--text-primary)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "0 12px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    border: "1px solid var(--border-color)",
    background: "var(--bg-elevated)",
    color: "var(--text-primary)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => {
      const lower = part.toLowerCase();
      if (["stl", "bst", "dfs", "bfs"].includes(lower)) return lower.toUpperCase();
      if (lower === "sqrt") return "Square Root";
      if (lower === "nth") return "Nth";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function kindFromSlug(slug: string): LessonKind {
  if (slug.includes("dutch") || slug.includes("012") || slug.includes("lomuto") || slug.includes("hoare") || slug.includes("partitioning-techniques")) return "partition";
  if (slug.includes("pages") || slug.includes("cows") || slug.includes("koko") || slug.includes("ship") || slug.includes("root") || slug.includes("binary-search-on-answer") || slug.includes("painters-partition")) return "answer";
  if (slug.includes("quick-select") || slug.includes("kth")) return "selection";
  if (slug.includes("merge-two") || slug.includes("median-two") || slug.includes("inversion") || slug.includes("reverse-pairs")) return "merge";
  if (slug.includes("partition")) return "partition";
  if (slug.includes("sort") || slug.includes("sorting") || slug.includes("comparator") || slug.includes("radix") || slug.includes("bucket") || slug.includes("heap")) return "sort";
  if (slug.includes("search") || slug.includes("bound") || slug.includes("occurrence") || slug.includes("ceil") || slug.includes("floor") || slug.includes("peak") || slug.includes("rotated") || slug.includes("insert") || slug.includes("element") || slug.includes("matrix") || slug.includes("ones")) return "search";
  return "concept";
}

function codeForLesson(kind: LessonKind, slug: string) {
  if (slug.includes("rotated")) return ["low = 0, high = n - 1", "mid = low + (high-low)/2", "if left half is sorted", "    keep the half containing target", "else keep the sorted/right candidate half"];
  if (slug.includes("peak")) return ["mid = low + (high-low)/2", "if arr[mid] < arr[mid+1]", "    low = mid + 1", "else high = mid", "low is a peak index"];
  if (slug.includes("matrix")) return ["treat matrix as sorted 1D array", "mid = low + (high-low)/2", "row = mid / cols, col = mid % cols", "compare matrix[row][col] with target"];
  if (slug.includes("row-with-max-ones")) return ["start from top-right cell", "if cell is 1, move left", "if cell is 0, move down", "row with most ones is recorded"];
  if (slug.includes("sqrt") || slug.includes("nth-root")) return ["low = 1, high = x", "mid = low + (high-low)/2", "power = mid^n", "if power <= x, store mid and move right", "else move left"];
  if (slug.includes("heap-sort")) return ["build max heap", "swap heap root with last item", "shrink heap size", "heapify the root"];
  if (slug.includes("quick-sort")) return ["choose pivot", "partition around pivot", "pivot reaches final position", "sort left and right partitions"];
  if (slug.includes("counting-sort")) return ["count frequency of every value", "prefix counts become final slots", "place values into output", "copy output back"];
  if (slug.includes("radix-sort")) return ["sort by ones digit", "sort by tens digit", "sort by next digit", "array is sorted after all digits"];
  if (slug.includes("bucket-sort")) return ["create buckets", "drop each value into a bucket", "sort each bucket", "concatenate buckets"];
  if (slug.includes("shell-sort")) return ["choose a large gap", "gap-insertion-sort the array", "shrink gap", "finish with gap = 1"];
  if (slug.includes("merge-sort")) return ["divide array into halves", "sort left half", "sort right half", "merge sorted halves"];
  return codeForKind(kind, slug);
}

function codeForKind(kind: LessonKind, slug: string) {
  if (kind === "answer") {
    return [
      "int low = minimumPossible();",
      "int high = maximumPossible();",
      "while (low <= high) {",
      "    int mid = low + (high - low) / 2;",
      "    if (can(mid)) ans = mid, high = mid - 1;",
      "    else low = mid + 1;",
      "}",
    ];
  }
  if (kind === "selection") {
    return [
      "choose pivot",
      "partition smaller | pivot | larger",
      "if pivot index is k, stop",
      "if k is left, search left partition",
      "else search right partition",
    ];
  }
  if (kind === "merge") {
    return [
      "split input into sorted runs",
      "compare the front of each run",
      "move the smaller value into output",
      "copy remaining values",
      "return merged result",
    ];
  }
  if (kind === "partition") {
    return [
      "low = 0, mid = 0, high = n - 1",
      "if arr[mid] belongs left: swap low, mid",
      "if arr[mid] belongs middle: mid++",
      "if arr[mid] belongs right: swap mid, high",
      "repeat until mid > high",
    ];
  }
  if (kind === "sort") {
    if (slug.includes("selection")) {
      return ["for i from 0 to n-1", "    minIndex = i", "    scan j for smaller value", "    swap arr[i], arr[minIndex]"];
    }
    if (slug.includes("insertion")) {
      return ["for i from 1 to n-1", "    key = arr[i]", "    shift larger values right", "    place key in its sorted slot"];
    }
    if (slug.includes("merge")) {
      return ["divide array into halves", "sort left half", "sort right half", "merge two sorted halves"];
    }
    if (slug.includes("quick")) {
      return ["choose pivot", "move smaller values left", "move larger values right", "recursively sort partitions"];
    }
    if (slug.includes("heap")) {
      return ["build max heap", "swap root with last item", "shrink heap", "heapify root"];
    }
    return ["for each pass", "    compare neighboring values", "    swap if out of order", "    lock the largest suffix"];
  }
  return [
    "prepare the search space",
    "inspect the current candidate",
    "discard impossible positions",
    "continue until answer is found",
  ];
}

function profileForLesson(lessonId: string, title?: string): LessonProfile {
  const kind = kindFromSlug(lessonId);
  const displayTitle = title || titleFromSlug(lessonId);
  const isSearch = kind === "search";
  const isSort = kind === "sort" || kind === "partition";

  const definition = isSearch
    ? "Searching narrows a candidate space until the target position, boundary, or proof of absence is known."
    : isSort
      ? "Sorting transforms an unordered array into a predictable order while exposing comparisons, swaps, and locked regions."
      : kind === "answer"
        ? "Binary search on answer tests a possible answer, then keeps the half that can still contain the optimum."
        : kind === "merge"
          ? "Merge-based techniques combine already ordered pieces while tracking cross-boundary decisions."
          : "This lesson focuses on the pattern behind the topic and the state changes that make it work.";

  return {
    title: displayTitle,
    kind,
    definition,
    time: isSearch ? "O(log N) or O(N)" : kind === "answer" ? "O(N log range)" : isSort ? "O(N log N) / O(N^2)" : "Pattern dependent",
    space: kind === "merge" ? "O(N)" : "O(1) to O(N)",
    points: [
      "Edit the array, then replay the trace from the beginning.",
      "Drag numbers to create your own input order.",
      "Each step shows active indices, ranges, variables, and the matching code line.",
      "Use next or autoplay to watch the algorithm state evolve one decision at a time.",
    ],
    code: codeForLesson(kind, lessonId),
    defaultArray: isSearch || kind === "answer" ? SORTED_ARRAY : BASE_ARRAY,
    target: isSearch ? 42 : kind === "answer" ? 120 : 23,
  };
}

function makeInitialStep(array: number[], message: string, line = 0): Step {
  return { label: "Start", message, array: [...array], active: [], done: [], line, vars: { n: array.length }, result: null };
}

function makePeakSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [makeInitialStep(arr, "Find any peak where neighbors are not larger.")];
  let low = 0;
  let high = arr.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const rising = arr[mid] < arr[mid + 1];
    steps.push({
      label: "Slope check",
      message: rising ? `${arr[mid]} < ${arr[mid + 1]}, so a peak exists to the right.` : `${arr[mid]} >= ${arr[mid + 1]}, so keep the left side including mid.`,
      array: [...arr],
      active: [mid, mid + 1],
      done: [],
      range: [low, high],
      line: rising ? 2 : 3,
      vars: { low, mid, high },
    });
    if (rising) low = mid + 1;
    else high = mid;
  }
  steps.push({ label: "Peak", message: `Index ${low} is a peak candidate.`, array: [...arr], active: [low], done: [low], line: 4, vars: { peakIndex: low }, result: low });
  return steps;
}

function makeRotatedSearchSteps(input: number[], target: number, slug: string): Step[] {
  const base = [...input].sort((a, b) => a - b);
  const pivot = Math.min(3, Math.max(1, Math.floor(base.length / 2)));
  const arr = slug.includes("min-in-rotated") ? [...base.slice(pivot), ...base.slice(0, pivot)] : [...base.slice(pivot), ...base.slice(0, pivot)];
  const steps: Step[] = [makeInitialStep(arr, slug.includes("min-in-rotated") ? "Find the rotation point, which is the minimum value." : `Search target ${target} inside a rotated sorted array.`)];
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const isMinLesson = slug.includes("min-in-rotated");
    steps.push({
      label: isMinLesson ? "Minimum probe" : "Rotated probe",
      message: isMinLesson
        ? `Compare arr[mid] = ${arr[mid]} with arr[high] = ${arr[high]}.`
        : `mid = ${mid}. Decide which half is normally sorted before discarding a side.`,
      array: [...arr],
      active: [low, mid, high],
      done: [],
      range: [low, high],
      line: isMinLesson ? 1 : 2,
      vars: { low, mid, high, target },
      result: null,
    });
    if (isMinLesson) {
      if (arr[mid] > arr[high]) low = mid + 1;
      else high = mid;
      if (low === high) break;
      continue;
    }
    if (arr[mid] === target) {
      steps.push({ label: "Found", message: `Found ${target} at index ${mid}.`, array: [...arr], active: [mid], done: [mid], line: 4, vars: { answer: mid }, result: mid });
      return steps;
    }
    if (arr[low] <= arr[mid]) {
      if (arr[low] <= target && target < arr[mid]) high = mid - 1;
      else low = mid + 1;
    } else if (arr[mid] < target && target <= arr[high]) low = mid + 1;
    else high = mid - 1;
  }
  const answer = slug.includes("min-in-rotated") ? low : -1;
  steps.push({ label: "Answer", message: slug.includes("min-in-rotated") ? `Minimum is ${arr[low]} at index ${low}.` : "Target was not found.", array: [...arr], active: answer >= 0 ? [answer] : [], done: answer >= 0 ? [answer] : [], line: 4, vars: { answer }, result: answer });
  return steps;
}

function makeMatrixSearchSteps(input: number[], target: number): Step[] {
  const values = [...input].sort((a, b) => a - b).slice(0, 9);
  while (values.length < 9) values.push(values.length * 7 + 3);
  const steps: Step[] = [makeInitialStep(values, "Treat the 3x3 matrix as one sorted row-major array.")];
  let low = 0;
  let high = values.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const row = Math.floor(mid / 3);
    const col = mid % 3;
    steps.push({
      label: "Matrix probe",
      message: `mid ${mid} maps to matrix[${row}][${col}] = ${values[mid]}.`,
      array: [...values],
      active: [mid],
      done: [],
      range: [low, high],
      line: 2,
      vars: { low, mid, high, row, col, target },
      result: values[mid] === target ? mid : null,
    });
    if (values[mid] === target) break;
    if (values[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return steps;
}

function makeRowWithMaxOnesSteps(): Step[] {
  const rows = [0, 0, 1, 0, 1, 1, 1, 1, 1];
  const steps: Step[] = [makeInitialStep(rows, "Scan a sorted binary matrix from the top-right corner.")];
  let row = 0;
  let col = 2;
  let best = -1;
  while (row < 3 && col >= 0) {
    const index = row * 3 + col;
    const one = rows[index] === 1;
    steps.push({ label: "Corner walk", message: one ? `matrix[${row}][${col}] is 1, record row ${row} and move left.` : `matrix[${row}][${col}] is 0, move down.`, array: [...rows], active: [index], done: [], line: one ? 1 : 2, vars: { row, col, best }, result: best });
    if (one) {
      best = row;
      col--;
    } else {
      row++;
    }
  }
  steps.push({ label: "Best row", message: `Row ${best} has the maximum number of ones.`, array: [...rows], active: best >= 0 ? [best * 3] : [], done: [], line: 3, vars: { best }, result: best });
  return steps;
}

function makeSingleElementSteps(): Step[] {
  const arr = [3, 3, 7, 7, 11, 18, 18, 24, 24];
  const steps: Step[] = [makeInitialStep(arr, "Pairs occupy even-odd positions before the single value.")];
  let low = 0;
  let high = arr.length - 1;
  while (low < high) {
    let mid = Math.floor((low + high) / 2);
    if (mid % 2 === 1) mid--;
    const paired = arr[mid] === arr[mid + 1];
    steps.push({ label: "Pair probe", message: paired ? `Pair starts at ${mid}; single is to the right.` : `Pair is broken at ${mid}; single is at or left of mid.`, array: [...arr], active: [mid, mid + 1], done: [], range: [low, high], line: paired ? 2 : 3, vars: { low, mid, high }, result: null });
    if (paired) low = mid + 2;
    else high = mid;
  }
  steps.push({ label: "Single", message: `Single element is ${arr[low]}.`, array: [...arr], active: [low], done: [low], line: 4, vars: { index: low }, result: arr[low] });
  return steps;
}

function makeCountOccurrencesSteps(input: number[], target: number): Step[] {
  const arr = [...input, target, target].sort((a, b) => a - b);
  const first = arr.indexOf(target);
  const last = arr.lastIndexOf(target);
  return [
    makeInitialStep(arr, `Find first and last occurrence of ${target}.`),
    { label: "Lower bound", message: `First position with value >= ${target} is ${first}.`, array: [...arr], active: [first], done: [], line: 1, vars: { first, target }, result: first },
    { label: "Upper bound", message: `Last matching position is ${last}.`, array: [...arr], active: [last], done: [], line: 2, vars: { last, target }, result: last },
    { label: "Count", message: `Occurrence count is ${last - first + 1}.`, array: [...arr], active: Array.from({ length: last - first + 1 }, (_, i) => first + i), done: [], line: 3, vars: { count: last - first + 1 }, result: last - first + 1 },
  ];
}

function makeSearchSteps(input: number[], target: number, slug: string): Step[] {
  if (slug.includes("peak")) return makePeakSteps(input);
  if (slug.includes("rotated")) return makeRotatedSearchSteps(input, target, slug);
  if (slug.includes("matrix")) return makeMatrixSearchSteps(input, target);
  if (slug.includes("row-with-max-ones")) return makeRowWithMaxOnesSteps();
  if (slug.includes("single-element")) return makeSingleElementSteps();
  if (slug.includes("count-occurrences")) return makeCountOccurrencesSteps(input, target);
  const sorted = slug.includes("descending") ? [...input].sort((a, b) => b - a) : [...input].sort((a, b) => a - b);
  const steps: Step[] = [makeInitialStep(sorted, `Search starts with target ${target}.`)];

  if (slug.includes("linear")) {
    for (let i = 0; i < sorted.length; i++) {
      steps.push({
        label: "Scan",
        message: `Check index ${i}: ${sorted[i]} ${sorted[i] === target ? "matches" : "does not match"} ${target}.`,
        array: [...sorted],
        active: [i],
        done: sorted.slice(0, i).map((_, index) => index),
        line: sorted[i] === target ? 2 : 1,
        vars: { i, target },
        result: sorted[i] === target ? i : null,
      });
      if (sorted[i] === target) break;
    }
  } else {
    let low = 0;
    let high = sorted.length - 1;
    let answer = -1;
    const findFirst = slug.includes("first") || slug.includes("lower");
    const findLast = slug.includes("last") || slug.includes("upper");
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const value = sorted[mid];
      const match = value === target;
      steps.push({
        label: "Probe",
        message: `mid = ${mid}, value = ${value}. ${match ? "Record candidate." : value < target ? "Move right." : "Move left."}`,
        array: [...sorted],
        active: [mid],
        done: [],
        range: [low, high],
        line: 3,
        vars: { low, mid, high, target },
        result: answer >= 0 ? answer : null,
      });
      if (match) {
        answer = mid;
        if (findFirst) high = mid - 1;
        else if (findLast) low = mid + 1;
        else break;
      } else if ((value < target && !slug.includes("descending")) || (value > target && slug.includes("descending"))) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    if (slug.includes("insert") || slug.includes("lower")) answer = low;
    if (slug.includes("upper")) answer = low;
    if (slug.includes("floor")) answer = high;
    if (slug.includes("ceil")) answer = low < sorted.length ? low : -1;
    steps.push({
      label: "Answer",
      message: answer >= 0 ? `Final answer index is ${answer}.` : "Target is absent in the candidate space.",
      array: [...sorted],
      active: answer >= 0 && answer < sorted.length ? [answer] : [],
      done: sorted.map((_, i) => i),
      line: 4,
      vars: { answer },
      result: answer,
    });
  }

  return steps;
}

function makeBubbleLikeSteps(input: number[], slug: string): Step[] {
  if (slug.includes("quick-sort")) return makeQuickSortSteps(input);
  if (slug.includes("heap-sort")) return makeHeapSortSteps(input);
  if (slug.includes("counting-sort")) return makeCountingSortSteps(input);
  if (slug.includes("radix-sort")) return makeRadixSortSteps(input);
  if (slug.includes("bucket-sort")) return makeBucketSortSteps(input);
  if (slug.includes("shell-sort")) return makeShellSortSteps(input);
  if (slug.includes("merge-sort")) return makeMergeSortSteps(input);
  if (slug.includes("stable") || slug.includes("stability") || slug.includes("comparator") || slug.includes("partial-sort") || slug.includes("stl-sort")) return makeLibrarySortSteps(input, slug);
  const arr = [...input];
  const steps: Step[] = [makeInitialStep(arr, "Start with an unsorted array.")];

  if (slug.includes("selection")) {
    for (let i = 0; i < arr.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < arr.length; j++) {
        steps.push({ label: "Find min", message: `Compare current min ${arr[min]} with ${arr[j]}.`, array: [...arr], active: [min, j], done: arr.slice(0, i).map((_, index) => index), line: 2, vars: { i, j, min } });
        if (arr[j] < arr[min]) min = j;
      }
      [arr[i], arr[min]] = [arr[min], arr[i]];
      steps.push({ label: "Place", message: `Place ${arr[i]} at sorted index ${i}.`, array: [...arr], active: [i, min], done: arr.slice(0, i + 1).map((_, index) => index), line: 3, vars: { i, min } });
    }
  } else if (slug.includes("insertion")) {
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      steps.push({ label: "Pick key", message: `Pick key ${key} from index ${i}.`, array: [...arr], active: [i], done: arr.slice(0, i).map((_, index) => index), line: 1, vars: { i, key } });
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        steps.push({ label: "Shift", message: `Shift ${arr[j]} one slot to the right.`, array: [...arr], active: [j, j + 1], done: [], line: 2, vars: { j, key } });
        j--;
      }
      arr[j + 1] = key;
      steps.push({ label: "Insert", message: `Insert ${key} at index ${j + 1}.`, array: [...arr], active: [j + 1], done: arr.slice(0, i + 1).map((_, index) => index), line: 3, vars: { position: j + 1, key } });
    }
  } else {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        steps.push({ label: "Compare", message: `Compare ${arr[j]} and ${arr[j + 1]}.`, array: [...arr], active: [j, j + 1], done: arr.slice(arr.length - i).map((_, index) => arr.length - i + index), line: 1, vars: { pass: i + 1, j } });
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({ label: "Swap", message: `Swap to get ${arr[j]} before ${arr[j + 1]}.`, array: [...arr], active: [j, j + 1], done: [], line: 2, vars: { swapped: "yes" } });
        }
      }
    }
  }

  steps.push({ label: "Sorted", message: "The array is sorted in ascending order.", array: [...arr], active: [], done: arr.map((_, i) => i), line: 3, vars: { status: "sorted" } });
  return steps.slice(0, 80);
}

function makeQuickSortSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [makeInitialStep(arr, "Quick sort partitions around a pivot.")];
  const quick = (low: number, high: number) => {
    if (low >= high) return;
    const pivot = arr[high];
    let i = low;
    steps.push({ label: "Choose pivot", message: `Use ${pivot} at index ${high} as pivot.`, array: [...arr], active: [high], done: [], range: [low, high], pivot: high, line: 0, vars: { low, high, pivot } });
    for (let j = low; j < high; j++) {
      steps.push({ label: "Partition", message: `${arr[j]} ${arr[j] <= pivot ? "belongs left of" : "stays right of"} pivot ${pivot}.`, array: [...arr], active: [i, j, high], done: [], range: [low, high], pivot: high, line: 1, vars: { i, j, pivot } });
      if (arr[j] <= pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }
    [arr[i], arr[high]] = [arr[high], arr[i]];
    steps.push({ label: "Pivot fixed", message: `Pivot ${pivot} is fixed at index ${i}.`, array: [...arr], active: [i], done: [i], range: [low, high], pivot: i, line: 2, vars: { pivotIndex: i } });
    quick(low, i - 1);
    quick(i + 1, high);
  };
  quick(0, arr.length - 1);
  steps.push({ label: "Sorted", message: "All partitions are sorted.", array: [...arr], active: [], done: arr.map((_, i) => i), line: 3, vars: { status: "sorted" } });
  return steps.slice(0, 90);
}

function makeHeapSortSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [makeInitialStep(arr, "Heap sort first builds a max heap.")];
  const heapify = (size: number, root: number) => {
    let largest = root;
    const left = root * 2 + 1;
    const right = root * 2 + 2;
    if (left < size && arr[left] > arr[largest]) largest = left;
    if (right < size && arr[right] > arr[largest]) largest = right;
    steps.push({ label: "Heapify", message: `Heapify root ${root}; largest candidate is ${largest}.`, array: [...arr], active: [root, left, right].filter((i) => i < size), done: arr.slice(size).map((_, i) => size + i), range: [0, size - 1], line: 3, vars: { size, root, largest } });
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      heapify(size, largest);
    }
  };
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) heapify(arr.length, i);
  for (let end = arr.length - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    steps.push({ label: "Extract max", message: `Move max value ${arr[end]} to final index ${end}.`, array: [...arr], active: [0, end], done: arr.slice(end).map((_, i) => end + i), range: [0, end], line: 1, vars: { heapSize: end } });
    heapify(end, 0);
  }
  steps.push({ label: "Sorted", message: "Heap is exhausted; array is sorted.", array: [...arr], active: [], done: arr.map((_, i) => i), line: 3, vars: { status: "sorted" } });
  return steps.slice(0, 90);
}

function makeCountingSortSteps(input: number[]): Step[] {
  const arr = input.map((value) => value % 10);
  const steps: Step[] = [makeInitialStep(arr, "Counting sort counts each key before writing output.")];
  const counts = Array(10).fill(0);
  arr.forEach((value, index) => {
    counts[value]++;
    steps.push({ label: "Count", message: `Increment count[${value}] to ${counts[value]}.`, array: [...counts], active: [value], done: [], line: 0, vars: { index, value, count: counts[value] } });
  });
  const output: number[] = [];
  counts.forEach((count, value) => {
    for (let repeat = 0; repeat < count; repeat++) {
      output.push(value);
      steps.push({ label: "Write", message: `Write ${value} into output.`, array: [...output, ...Array(arr.length - output.length).fill(0)], active: [output.length - 1], done: output.map((_, i) => i), line: 2, vars: { value, outputSize: output.length } });
    }
  });
  steps.push({ label: "Sorted", message: "Output is sorted by counted keys.", array: [...output], active: [], done: output.map((_, i) => i), line: 3, vars: { status: "sorted" } });
  return steps;
}

function makeRadixSortSteps(input: number[]): Step[] {
  let arr = [...input];
  const steps: Step[] = [makeInitialStep(arr, "Radix sort processes one digit at a time.")];
  for (const exp of [1, 10, 100]) {
    arr = [...arr].sort((a, b) => Math.floor(a / exp) % 10 - Math.floor(b / exp) % 10);
    steps.push({ label: "Digit pass", message: `Stable sort by ${exp === 1 ? "ones" : exp === 10 ? "tens" : "hundreds"} digit.`, array: [...arr], active: arr.map((_, i) => i), done: [], line: exp === 1 ? 0 : exp === 10 ? 1 : 2, vars: { digitPlace: exp } });
    if (Math.max(...arr) < exp * 10) break;
  }
  steps.push({ label: "Sorted", message: "All significant digits have been processed.", array: [...arr].sort((a, b) => a - b), active: [], done: arr.map((_, i) => i), line: 3, vars: { status: "sorted" } });
  return steps;
}

function makeBucketSortSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [makeInitialStep(arr, "Bucket sort spreads values into value ranges.")];
  const buckets: number[][] = [[], [], []];
  const max = Math.max(...arr, 1);
  arr.forEach((value, index) => {
    const bucket = Math.min(2, Math.floor((value / (max + 1)) * 3));
    buckets[bucket].push(value);
    steps.push({ label: "Bucket", message: `Place ${value} into bucket ${bucket}.`, array: [...arr], active: [index], done: [], line: 1, vars: { value, bucket } });
  });
  const output = buckets.flatMap((bucket, bucketIndex) => {
    bucket.sort((a, b) => a - b);
    steps.push({ label: "Sort bucket", message: `Sort bucket ${bucketIndex}: ${bucket.join(", ")}.`, array: [...bucket], active: bucket.map((_, i) => i), done: [], line: 2, vars: { bucket: bucketIndex, size: bucket.length } });
    return bucket;
  });
  steps.push({ label: "Concatenate", message: "Concatenate buckets in order.", array: output, active: [], done: output.map((_, i) => i), line: 3, vars: { status: "sorted" } });
  return steps;
}

function makeShellSortSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [makeInitialStep(arr, "Shell sort performs insertion sort over shrinking gaps.")];
  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < arr.length; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        steps.push({ label: "Gap shift", message: `With gap ${gap}, shift ${arr[j]} from ${j - gap} to ${j}.`, array: [...arr], active: [j - gap, j], done: [], line: 1, vars: { gap, i, j } });
        j -= gap;
      }
      arr[j] = temp;
      steps.push({ label: "Gap insert", message: `Insert ${temp} at index ${j} for gap ${gap}.`, array: [...arr], active: [j], done: [], line: 2, vars: { gap, i, j } });
    }
  }
  steps.push({ label: "Sorted", message: "Gap 1 pass completed.", array: [...arr], active: [], done: arr.map((_, i) => i), line: 3, vars: { status: "sorted" } });
  return steps.slice(0, 90);
}

function makeMergeSortSteps(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [makeInitialStep(arr, "Merge sort divides, sorts, and merges ranges.")];
  const mergeSort = (low: number, high: number) => {
    if (low >= high) return;
    const mid = Math.floor((low + high) / 2);
    steps.push({ label: "Divide", message: `Split range [${low}, ${high}] at ${mid}.`, array: [...arr], active: [mid], done: [], range: [low, high], line: 0, vars: { low, mid, high } });
    mergeSort(low, mid);
    mergeSort(mid + 1, high);
    const merged = [...arr.slice(low, mid + 1), ...arr.slice(mid + 1, high + 1)].sort((a, b) => a - b);
    for (let i = 0; i < merged.length; i++) arr[low + i] = merged[i];
    steps.push({ label: "Merge", message: `Merge range [${low}, ${high}] into sorted order.`, array: [...arr], active: Array.from({ length: high - low + 1 }, (_, i) => low + i), done: [], range: [low, high], line: 3, vars: { low, high, size: high - low + 1 } });
  };
  mergeSort(0, arr.length - 1);
  steps.push({ label: "Sorted", message: "The top-level merge is complete.", array: [...arr], active: [], done: arr.map((_, i) => i), line: 3, vars: { status: "sorted" } });
  return steps.slice(0, 90);
}

function makeLibrarySortSteps(input: number[], slug: string): Step[] {
  const arr = [...input];
  const steps: Step[] = [makeInitialStep(arr, "Prepare the data and comparison rule.")];
  const decorated = arr.map((value, index) => ({ value, index }));
  steps.push({ label: "Compare rule", message: slug.includes("comparator") ? "Use the custom comparator to decide ordering." : slug.includes("stable") ? "Preserve original order when keys tie." : "Use the library sort operation for the requested range.", array: [...arr], active: arr.map((_, i) => i), done: [], line: 0, vars: { items: arr.length } });
  decorated.sort((a, b) => a.value - b.value || a.index - b.index);
  const sorted = decorated.map((item) => item.value);
  steps.push({ label: "Reorder", message: "Move elements into comparator order.", array: sorted, active: sorted.map((_, i) => i), done: [], line: 1, vars: { stable: slug.includes("stable") || slug.includes("stability") ? "yes" : "depends" } });
  steps.push({ label: "Result", message: slug.includes("partial") ? "Only the requested prefix is guaranteed sorted." : "The selected range is sorted.", array: sorted, active: [], done: sorted.map((_, i) => i), line: 3, vars: { status: "done" } });
  return steps;
}

function makePartitionSteps(input: number[]): Step[] {
  const arr = input.map((value) => value % 3);
  const steps: Step[] = [makeInitialStep(arr, "Normalize values into 0, 1, and 2 buckets.")];
  let low = 0;
  let mid = 0;
  let high = arr.length - 1;
  while (mid <= high) {
    steps.push({ label: "Classify", message: `Inspect arr[${mid}] = ${arr[mid]}.`, array: [...arr], active: [low, mid, high], done: [], range: [low, high], line: 0, vars: { low, mid, high } });
    if (arr[mid] === 0) {
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      low++;
      mid++;
    } else if (arr[mid] === 1) {
      mid++;
    } else {
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      high--;
    }
    steps.push({ label: "Move", message: "Update the three-way partition pointers.", array: [...arr], active: [low, mid, high].filter((i) => i >= 0 && i < arr.length), done: [], range: [low, high], line: 2, vars: { low, mid, high } });
  }
  steps.push({ label: "Partitioned", message: "All 0s, 1s, and 2s are grouped.", array: [...arr], active: [], done: arr.map((_, i) => i), line: 4, vars: { status: "done" } });
  return steps;
}

function makeAnswerSteps(input: number[], target: number): Step[] {
  const arr = [...input].sort((a, b) => a - b);
  const steps: Step[] = [makeInitialStep(arr, `Find the smallest capacity that can cover total demand near ${target}.`)];
  let low = Math.max(...arr);
  let high = arr.reduce((sum, value) => sum + value, 0);
  let answer = high;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    let groups = 1;
    let current = 0;
    for (const value of arr) {
      if (current + value > mid) {
        groups++;
        current = 0;
      }
      current += value;
    }
    const feasible = groups <= 3;
    steps.push({
      label: "Test answer",
      message: `Try ${mid}. It needs ${groups} group${groups === 1 ? "" : "s"}, so it is ${feasible ? "feasible" : "too small"}.`,
      array: [...arr],
      active: [],
      done: [],
      range: [low, high],
      line: feasible ? 4 : 5,
      vars: { low, mid, high, groups, answer },
      result: feasible ? mid : answer,
    });
    if (feasible) {
      answer = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  steps.push({ label: "Minimum feasible", message: `Smallest feasible answer is ${answer}.`, array: [...arr], active: [], done: arr.map((_, i) => i), line: 6, vars: { answer }, result: answer });
  return steps;
}

function makeRootSearchSteps(target: number, slug: string): Step[] {
  const degree = slug.includes("nth-root") ? 3 : 2;
  const value = target > 1 ? target : 120;
  const visual = Array.from({ length: 10 }, (_, i) => i + 1);
  const steps: Step[] = [makeInitialStep(visual, `Binary search the integer ${degree === 2 ? "square root" : "cube root"} of ${value}.`)];
  let low = 1;
  let high = value;
  let answer = 1;
  while (low <= high && steps.length < 24) {
    const mid = Math.floor((low + high) / 2);
    const power = Math.pow(mid, degree);
    steps.push({
      label: "Power check",
      message: `${mid}^${degree} = ${power}. ${power <= value ? "It fits, try bigger." : "Too large, move left."}`,
      array: visual,
      active: [Math.min(visual.length - 1, Math.max(0, mid - 1))],
      done: [],
      range: [Math.max(0, low - 1), Math.min(visual.length - 1, high - 1)],
      line: power <= value ? 3 : 4,
      vars: { low, mid, high, power, value },
      result: answer,
    });
    if (power <= value) {
      answer = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  steps.push({ label: "Root", message: `Integer answer is ${answer}.`, array: visual, active: [Math.min(answer - 1, visual.length - 1)], done: [], line: 4, vars: { answer }, result: answer });
  return steps;
}

function makeQuickSelectSteps(input: number[], slug: string): Step[] {
  const arr = [...input];
  const wantLargest = slug.includes("largest");
  const k = Math.min(3, arr.length);
  const targetIndex = wantLargest ? arr.length - k : k - 1;
  const steps: Step[] = [makeInitialStep(arr, `Quickselect looks for the ${k}${wantLargest ? "rd largest" : "rd smallest"} value without fully sorting.`)];
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const pivot = arr[high];
    let store = low;
    steps.push({ label: "Choose pivot", message: `Pivot is ${pivot}. Partition only the active range.`, array: [...arr], active: [high], done: [], range: [low, high], pivot: high, line: 0, vars: { low, high, k, targetIndex } });
    for (let scan = low; scan < high; scan++) {
      if (arr[scan] <= pivot) {
        [arr[store], arr[scan]] = [arr[scan], arr[store]];
        store++;
      }
      steps.push({ label: "Partition", message: `Scan index ${scan}; store boundary is ${store}.`, array: [...arr], active: [scan, store, high], done: [], range: [low, high], pivot: high, line: 1, vars: { scan, store, pivot } });
    }
    [arr[store], arr[high]] = [arr[high], arr[store]];
    steps.push({ label: "Pivot rank", message: `Pivot lands at ${store}; compare with target index ${targetIndex}.`, array: [...arr], active: [store], done: [store], range: [low, high], pivot: store, line: 2, vars: { pivotIndex: store, targetIndex }, result: arr[store] });
    if (store === targetIndex) {
      steps.push({ label: "Selected", message: `Answer is ${arr[store]}.`, array: [...arr], active: [store], done: [store], line: 2, vars: { answer: arr[store] }, result: arr[store] });
      return steps;
    }
    if (targetIndex < store) high = store - 1;
    else low = store + 1;
  }
  return steps;
}

function makeMergeSteps(input: number[]): Step[] {
  const left = [...input.slice(0, Math.ceil(input.length / 2))].sort((a, b) => a - b);
  const right = [...input.slice(Math.ceil(input.length / 2))].sort((a, b) => a - b);
  const output: number[] = [];
  const steps: Step[] = [makeInitialStep([...left, ...right], "Two sorted runs are ready to merge.")];
  let i = 0;
  let j = 0;
  while (i < left.length || j < right.length) {
    const takeLeft = j >= right.length || (i < left.length && left[i] <= right[j]);
    const value = takeLeft ? left[i++] : right[j++];
    output.push(value);
    steps.push({
      label: "Merge",
      message: `Move ${value} into the output line.`,
      array: [...output, ...Array(input.length - output.length).fill(0)],
      active: [output.length - 1],
      done: output.map((_, index) => index),
      line: takeLeft ? 2 : 3,
      vars: { leftIndex: i, rightIndex: j, output: output.length },
      result: output.join(", "),
    });
  }
  steps.push({ label: "Merged", message: "Merged output is sorted.", array: [...output], active: [], done: output.map((_, index) => index), line: 4, vars: { status: "merged" } });
  return steps;
}

function buildSteps(profile: LessonProfile, array: number[], target: number, lessonId: string): Step[] {
  if (profile.kind === "search" || profile.kind === "concept") return makeSearchSteps(array, target, lessonId);
  if (lessonId.includes("sqrt") || lessonId.includes("nth-root")) return makeRootSearchSteps(target, lessonId);
  if (profile.kind === "answer") return makeAnswerSteps(array, target);
  if (profile.kind === "selection") return makeQuickSelectSteps(array, lessonId);
  if (profile.kind === "partition") return makePartitionSteps(array);
  if (lessonId === "merge-sort") return makeMergeSortSteps(array);
  if (profile.kind === "merge" || lessonId.includes("merge")) return makeMergeSteps(array);
  return makeBubbleLikeSteps(array, lessonId);
}

function clampArray(values: number[]) {
  return values.slice(0, 10).map((value) => Math.max(0, Math.min(999, Math.trunc(value))));
}

export default function SearchingSortingLessonLab({ lessonId, title }: LessonProps) {
  const profile = useMemo(() => profileForLesson(lessonId, title), [lessonId, title]);
  const [array, setArray] = useState<number[]>(profile.defaultArray);
  const [target, setTarget] = useState(profile.target);
  const [valueInput, setValueInput] = useState("31");
  const [indexInput, setIndexInput] = useState("0");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const steps = useMemo(() => buildSteps(profile, array, target, lessonId), [array, lessonId, profile, target]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || makeInitialStep(array, "Ready.");

  const resetTrace = useCallback(() => {
    setStepIndex(0);
    setPlaying(false);
  }, []);

  const mutateArray = useCallback((nextArray: number[]) => {
    setArray(clampArray(nextArray));
    resetTrace();
  }, [resetTrace]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 800);
    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  const addValue = () => {
    const value = Number(valueInput);
    const index = Number(indexInput);
    if (!Number.isFinite(value)) return;
    const insertAt = Number.isFinite(index) ? Math.max(0, Math.min(array.length, Math.trunc(index))) : array.length;
    mutateArray([...array.slice(0, insertAt), value, ...array.slice(insertAt)]);
  };

  const editValue = () => {
    const value = Number(valueInput);
    const index = Number(indexInput);
    if (!Number.isFinite(value) || !Number.isFinite(index)) return;
    const at = Math.max(0, Math.min(array.length - 1, Math.trunc(index)));
    mutateArray(array.map((item, i) => (i === at ? value : item)));
  };

  const deleteValue = () => {
    const index = Number(indexInput);
    if (!Number.isFinite(index)) return;
    const at = Math.max(0, Math.min(array.length - 1, Math.trunc(index)));
    mutateArray(array.filter((_, i) => i !== at));
  };

  const randomize = () => {
    mutateArray(Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 5));
  };

  const sortNow = () => {
    mutateArray([...array].sort((a, b) => a - b));
  };

  const onDropItem = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...array];
    const [moving] = next.splice(dragIndex, 1);
    next.splice(index, 0, moving);
    mutateArray(next);
    setDragIndex(null);
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.shell}>
          <div style={styles.eyebrow}>Searching & Sorting</div>
          <h1 style={styles.h1}>{profile.title}</h1>
          <p style={styles.intro}>{profile.definition}</p>
          <div style={styles.badgeRow}>
            <div style={styles.badge}><div style={styles.label}>Time</div><div style={styles.value}>{profile.time}</div></div>
            <div style={styles.badge}><div style={styles.label}>Space</div><div style={styles.value}>{profile.space}</div></div>
            <div style={styles.badge}><div style={styles.label}>Trace Steps</div><div style={styles.value}>{steps.length}</div></div>
          </div>
        </div>
      </section>

      <section style={styles.body}>
        <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={styles.panel}>
            <div style={styles.label}>Array Controls</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              <input aria-label="Value" value={valueInput} onChange={(event) => setValueInput(event.target.value)} style={styles.input} />
              <input aria-label="Index" value={indexInput} onChange={(event) => setIndexInput(event.target.value)} style={styles.input} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
              <button title="Insert" onClick={addValue} style={styles.iconButton}><Plus size={16} /></button>
              <button title="Edit" onClick={editValue} style={styles.iconButton}><Pencil size={16} /></button>
              <button title="Delete" onClick={deleteValue} style={styles.iconButton}><Trash2 size={16} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
              <button onClick={randomize} style={styles.button}><Shuffle size={15} /> Random</button>
              <button onClick={sortNow} style={styles.button}><ArrowDownUp size={15} /> Sort</button>
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.label}>Target / Answer</div>
            <input
              aria-label="Target"
              value={target}
              onChange={(event) => {
                setTarget(Number(event.target.value));
                resetTrace();
              }}
              type="number"
              style={{ ...styles.input, marginTop: 12 }}
            />
            <div style={{ marginTop: 14, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
              {step.result === null || step.result === undefined ? "No answer locked yet." : `Current result: ${step.result}`}
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.label}>Playback</div>
            <p style={{ minHeight: 62, margin: "12px 0 16px", color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.55 }}>{step.message}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button title="Reset" onClick={resetTrace} style={styles.iconButton}><RotateCcw size={16} /></button>
              <button title="Previous" onClick={() => setStepIndex((current) => Math.max(0, current - 1))} style={styles.iconButton}><ChevronLeft size={16} /></button>
              <button title={playing ? "Pause" : "Play"} onClick={() => setPlaying((current) => !current)} style={{ ...styles.iconButton, background: "var(--accent-vibrant)", color: "var(--bg-primary)" }}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
              <button title="Next" onClick={() => setStepIndex((current) => Math.min(steps.length - 1, current + 1))} style={styles.iconButton}><ChevronRight size={16} /></button>
            </div>
            <div style={{ height: 6, marginTop: 16, borderRadius: 99, background: "var(--bg-primary)", overflow: "hidden", border: "1px solid var(--border-color)" }}>
              <div style={{ width: `${((stepIndex + 1) / Math.max(steps.length, 1)) * 100}%`, height: "100%", background: "var(--accent-vibrant)" }} />
            </div>
          </div>
        </aside>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div style={{ ...styles.card, padding: 18 }}>
            <div style={styles.label}>Interactive Array</div>
            <div style={{ display: "flex", gap: 10, alignItems: "end", minHeight: 190, marginTop: 18, overflowX: "auto", paddingBottom: 8 }}>
              {step.array.map((value, index) => {
                const maxValue = Math.max(...step.array, 1);
                const isActive = step.active.includes(index);
                const isDone = step.done.includes(index);
                const inRange = step.range ? index >= step.range[0] && index <= step.range[1] : true;
                return (
                  <div
                    key={`${index}-${value}`}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => onDropItem(index)}
                    title="Drag to reorder"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 54, cursor: "grab", opacity: inRange ? 1 : 0.34 }}
                  >
                    <div
                      style={{
                        height: 48 + (value / maxValue) * 96,
                        width: 48,
                        borderRadius: 6,
                        border: `2px solid ${isActive ? "var(--accent-vibrant)" : "var(--border-color)"}`,
                        background: isDone ? "var(--accent-soft)" : "var(--bg-elevated)",
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        transition: "height 180ms ease, border-color 180ms ease",
                      }}
                    >
                      {value}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 800 }}>[{index}]</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 380px)", gap: 16 }}>
            <div style={{ ...styles.card, padding: 18 }}>
              <div style={styles.label}>Step Timeline</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 310, overflowY: "auto", marginTop: 14 }}>
                {steps.map((item, index) => (
                  <button
                    key={`${item.label}-${index}`}
                    onClick={() => {
                      setStepIndex(index);
                      setPlaying(false);
                    }}
                    style={{
                      textAlign: "left",
                      borderRadius: 6,
                      border: "1px solid var(--border-color)",
                      background: index === stepIndex ? "var(--accent-soft)" : "var(--bg-primary)",
                      color: "var(--text-primary)",
                      padding: "10px 12px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, fontWeight: 900 }}>
                      <span>{index + 1}. {item.label}</span>
                      <span>line {item.line + 1}</span>
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 4, lineHeight: 1.45 }}>{item.message}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...styles.card, padding: 18 }}>
              <div style={styles.label}>Code + State</div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                {profile.code.map((line, index) => (
                  <div
                    key={line}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "24px 1fr",
                      gap: 8,
                      padding: "6px 8px",
                      borderRadius: 6,
                      background: index === step.line ? "var(--accent-soft)" : "transparent",
                      fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>{index + 1}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, borderTop: "1px solid var(--border-color)", paddingTop: 14, display: "grid", gap: 8 }}>
                {Object.entries(step.vars).map(([key, value]) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                    <span style={{ color: "var(--text-secondary)", fontWeight: 800 }}>{key}</span>
                    <span style={{ fontWeight: 900 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, padding: 18 }}>
            <div style={styles.label}>What To Watch</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 14 }}>
              {profile.points.map((point) => (
                <div key={point} style={{ border: "1px solid var(--border-color)", borderRadius: 6, padding: 12, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.55 }}>
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
