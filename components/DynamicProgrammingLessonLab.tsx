"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { CodeTracker } from "./CodeTracker";

type GenericProfile = {
  title: string;
  topic: string;
  pattern: string;
  definition: string;
  time: string;
  space: string;
  points: string[];
  code: string[];
  values: number[];
};

type GenericStep = {
  label: string;
  message: string;
  line: number;
  active: number[];
  done: number[];
  vars: Record<string, string | number>;
};

type SpecialKind =
  | "intro"
  | "comparison"
  | "overlap"
  | "optimal"
  | "memo"
  | "tabulation"
  | "space"
  | "state"
  | "transition"
  | "base";

type SpecialStep = {
  label: string;
  message: string;
  line: number;
  vars: Record<string, string | number>;
  state: Record<string, unknown>;
};

type SpecialProfile = Omit<GenericProfile, "values"> & {
  simulation: SpecialKind;
  steps: SpecialStep[];
};

const styles = {
  page: { minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" },
  hero: { padding: "96px 48px 42px", borderBottom: "1px solid var(--border-color)" },
  shell: { maxWidth: 1280, margin: "0 auto" },
  eyebrow: { fontSize: 12, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--text-secondary)" },
  h1: { margin: "16px 0", fontSize: "clamp(40px, 7vw, 74px)", lineHeight: 1, fontWeight: 900, letterSpacing: 0 },
  intro: { maxWidth: 880, color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.7 },
  badgeRow: { display: "flex", flexWrap: "wrap" as const, gap: 12, marginTop: 26 },
  badge: { border: "1px solid var(--border-color)", background: "var(--bg-secondary)", padding: "12px 16px", borderRadius: 8, minWidth: 148 },
  label: { fontSize: 10, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "var(--text-secondary)" },
  value: { marginTop: 4, fontSize: 18, fontWeight: 900 },
  body: { maxWidth: 1280, margin: "0 auto", padding: "36px 32px 96px", display: "grid", gridTemplateColumns: "minmax(270px, 340px) minmax(0, 1fr)", gap: 24 },
  panel: { background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8, padding: 18 },
  button: { width: 36, height: 36, borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => {
      const lower = part.toLowerCase();
      if (["dp", "lis", "lcs", "tsp", "dag", "sos"].includes(lower)) return lower.toUpperCase();
      if (["i", "ii", "iii", "iv"].includes(lower)) return lower.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function profileForLesson(lessonId: string, title?: string): GenericProfile {
  const name = title ?? titleFromSlug(lessonId);

  return {
    title: name,
    topic: "Dynamic Programming",
    pattern: lessonId.includes("grid") ? "Grid DP" : lessonId.includes("stock") ? "State Machine DP" : lessonId.includes("string") ? "String DP" : "State Transition DP",
    definition: `${name} uses dynamic programming to store smaller answers and reuse them instead of recomputing the same work.`,
    time: "Depends on states and transitions",
    space: "Depends on stored states",
    points: [
      "Define the exact state meaning first.",
      "Write the transition from smaller solved states.",
      "Only optimize space after the recurrence is correct.",
    ],
    code: [
      "dp[0] = base;",
      "for (int i = 1; i < n; i++) {",
      "  dp[i] = transition(previous states);",
      "}",
      "return answer;",
    ],
    values: [1, 2, 3, 5, 8, 13],
  };
}

function buildGenericSteps(profile: GenericProfile): GenericStep[] {
  return [
    { label: "Define state", message: "Choose what one DP state represents.", line: 0, active: [0], done: [], vars: { pattern: profile.pattern } },
    { label: "Seed base case", message: "Place the known starting answer first.", line: 0, active: [0, 1], done: [0], vars: { base: profile.values[0] } },
    ...profile.values.slice(1).map((value, index) => ({
      label: `Compute dp[${index + 1}]`,
      message: `Use earlier answers to compute dp[${index + 1}] = ${value}.`,
      line: Math.min(2, profile.code.length - 1),
      active: [index, index + 1],
      done: Array.from({ length: index + 1 }, (_, i) => i),
      vars: { i: index + 1, value },
    })),
    { label: "Answer", message: "The final state now contains the answer.", line: profile.code.length - 1, active: [profile.values.length - 1], done: profile.values.map((_, i) => i), vars: { answer: profile.values[profile.values.length - 1] } },
  ];
}

function card(title: string, value: React.ReactNode, active = false) {
  return (
    <div style={{ border: `1px solid ${active ? "var(--text-primary)" : "var(--border-color)"}`, background: active ? "var(--accent-soft)" : "var(--bg-primary)", borderRadius: 8, padding: 14 }}>
      <div style={{ ...styles.label, letterSpacing: 0 }}>{title}</div>
      <div style={{ marginTop: 8 }}>{value}</div>
    </div>
  );
}

function specialForLesson(lessonId: string, title?: string): SpecialProfile | null {
  const name = title ?? titleFromSlug(lessonId);

  const shared = {
    topic: "DP Fundamentals",
    time: "O(states x transitions)",
    space: "O(states)",
  };

  const scenarios: Record<string, SpecialProfile> = {
    "introduction-to-dp": {
      ...shared,
      title: name,
      pattern: "Recognize, Reuse, Store",
      definition: "This lesson introduces DP by showing how a recursive problem explodes into repeated calls, then shrinks once those smaller answers are stored.",
      points: ["See the repetition first.", "Store repeated subproblems once.", "DP is reused recursion, not magic."],
      code: ["solve(n)", "if (base) return", "solve(n-1) + solve(n-2)", "store solved states"],
      simulation: "intro",
      steps: [
        { label: "Start recursive", message: "We begin with a recursive question such as Fibonacci.", line: 0, vars: { n: 6 }, state: { calls: 1, unique: 1, saved: 0, solved: ["f(6)"] } },
        { label: "Calls branch", message: "The recursion tree expands quickly even though only a few unique states exist.", line: 2, vars: { calls: 9 }, state: { calls: 9, unique: 4, saved: 0, solved: ["f(6)", "f(5)", "f(4)", "f(3)"] } },
        { label: "Overlap appears", message: "States such as f(3) and f(2) appear again. This is the DP signal.", line: 2, vars: { repeated: "f(3), f(2)" }, state: { calls: 15, unique: 6, saved: 0, solved: ["f(6)", "f(5)", "f(4)", "f(3)", "f(2)", "f(1)"] } },
        { label: "Store answers", message: "Caching those states converts future repeated calls into lookups.", line: 3, vars: { answer: 8 }, state: { calls: 15, unique: 7, saved: 8, solved: ["f(0)", "f(1)", "f(2)", "f(3)", "f(4)", "f(5)", "f(6)"] } },
      ],
    },
    "recursion-vs-dp": {
      ...shared,
      title: name,
      pattern: "Same Recurrence, Different Cost",
      definition: "This simulation compares one recurrence under pure recursion versus dynamic programming so the work difference is visible state by state.",
      points: ["The formula can stay the same.", "Execution strategy is what changes.", "DP solves each state once."],
      code: ["rec(n)", "rec(n-1) + rec(n-2)", "dp[i] = dp[i-1] + dp[i-2]"],
      simulation: "comparison",
      steps: [
        { label: "Same formula", message: "Both methods answer the same recurrence.", line: 0, vars: { n: 6 }, state: { labels: ["f6", "f5", "f4", "f3", "f2", "f1", "f0"], rec: [1, 1, 2, 3, 5, 3, 2], dp: [1, 1, 1, 1, 1, 1, 1], active: 0 } },
        { label: "Recursion repeats", message: "Middle states are recomputed several times in recursion.", line: 1, vars: { recursiveCalls: 17 }, state: { labels: ["f6", "f5", "f4", "f3", "f2", "f1", "f0"], rec: [1, 1, 2, 3, 5, 3, 2], dp: [1, 1, 1, 1, 1, 1, 1], active: 4 } },
        { label: "DP solves once", message: "DP still visits needed states, but only once each.", line: 2, vars: { dpSolves: 7 }, state: { labels: ["f6", "f5", "f4", "f3", "f2", "f1", "f0"], rec: [1, 1, 2, 3, 5, 3, 2], dp: [1, 1, 1, 1, 1, 1, 1], active: 6 } },
      ],
    },
    "overlapping-subproblems": {
      ...shared,
      title: name,
      pattern: "Repeated Recursive States",
      definition: "Overlapping subproblems means the same recursive state appears in multiple branches of the call tree.",
      points: ["Repeated parameters are the clue.", "No overlap means weak DP benefit.", "Memoization targets exactly these repeats."],
      code: ["solve(5)", "solve(4), solve(3)", "solve(3) repeats", "solve(2) repeats"],
      simulation: "overlap",
      steps: [
        { label: "Expand tree", message: "A recursive call tree exposes repeated states.", line: 0, vars: { root: "solve(5)" }, state: { nodes: ["5", "4", "3a", "2a", "3b", "2b", "1"], active: ["5"], repeated: [] } },
        { label: "First repeat", message: "solve(3) appears in two different branches.", line: 2, vars: { repeated: "solve(3)" }, state: { nodes: ["5", "4", "3a", "2a", "3b", "2b", "1"], active: ["3a", "3b"], repeated: ["3"] } },
        { label: "More repeats", message: "solve(2) is repeated too, so the wasted work compounds.", line: 3, vars: { repeated: "solve(2)" }, state: { nodes: ["5", "4", "3a", "2a", "3b", "2b", "1"], active: ["2a", "2b"], repeated: ["3", "2"] } },
      ],
    },
    "optimal-substructure": {
      ...shared,
      title: name,
      pattern: "Best from Smaller Bests",
      definition: "Optimal substructure means the best answer for a bigger state can be built from best answers to smaller states.",
      points: ["Transitions combine smaller optima.", "Legal predecessors matter.", "The global optimum must decompose cleanly."],
      code: ["dp[i] = cost + min(dp[i-1], dp[i-2])", "pick best parent", "store new optimum"],
      simulation: "optimal",
      steps: [
        { label: "Known smaller optima", message: "Suppose dp[3] and dp[4] are already optimal.", line: 0, vars: { "dp[3]": 4, "dp[4]": 6 }, state: { left: 4, right: 6, extra: 2, result: "?" } },
        { label: "Compare parents", message: "The current state only needs legal predecessor answers.", line: 1, vars: { extra: 2 }, state: { left: 4, right: 6, extra: 2, result: "?" } },
        { label: "Build new optimum", message: "Take the better smaller optimum and add the transition cost.", line: 2, vars: { "dp[5]": 6 }, state: { left: 4, right: 6, extra: 2, result: 6 } },
      ],
    },
    memoization: {
      ...shared,
      title: name,
      pattern: "Top-Down Cache",
      definition: "Memoization preserves recursion but saves solved states the first time they are computed.",
      points: ["Check the cache before branching.", "Store solved states on the way back.", "Future visits become O(1) hits."],
      code: ["if (memo[n] != -1) return memo[n]", "memo[n] = solve(n-1) + solve(n-2]", "return memo[n]"],
      simulation: "memo",
      steps: [
        { label: "Empty memo", message: "Start top-down with unknown cache entries.", line: 0, vars: { query: "solve(6)" }, state: { cache: ["-", "-", "-", "-", "-", "-", "-"], active: 6, hits: 0 } },
        { label: "Fill states", message: "Solved recursive states get written into the cache.", line: 1, vars: { filled: "memo[2], memo[3], memo[4]" }, state: { cache: ["-", "-", 1, 2, 3, "-", "-"], active: 4, hits: 0 } },
        { label: "Use cache hit", message: "A repeated request returns instantly from memo.", line: 0, vars: { hits: 1 }, state: { cache: ["-", "-", 1, 2, 3, "-", "-"], active: 4, hits: 1 } },
        { label: "Memo complete", message: "The cache now holds every relevant solved state.", line: 2, vars: { answer: 8 }, state: { cache: [0, 1, 1, 2, 3, 5, 8], active: 6, hits: 2 } },
      ],
    },
    tabulation: {
      ...shared,
      title: name,
      pattern: "Bottom-Up Table",
      definition: "Tabulation solves states in dependency order so every transition reads already-filled answers.",
      points: ["Seed the table first.", "Fill in a valid order.", "No recursion stack is needed."],
      code: ["dp[0] = 0", "dp[1] = 1", "for i = 2..n", "dp[i] = dp[i-1] + dp[i-2]"],
      simulation: "tabulation",
      steps: [
        { label: "Seed table", message: "Known base answers go into the table first.", line: 0, vars: { "dp[0]": 0, "dp[1]": 1 }, state: { values: [0, 1, null, null, null, null], active: [0, 1] } },
        { label: "Fill forward", message: "Each next state reads from the left where answers already exist.", line: 2, vars: { i: 2 }, state: { values: [0, 1, 1, null, null, null], active: [2] } },
        { label: "Table grows", message: "The dependency order keeps the computation valid.", line: 3, vars: { i: 4 }, state: { values: [0, 1, 1, 2, 3, null], active: [4] } },
        { label: "Answer ready", message: "The final table cell now stores the answer.", line: 3, vars: { answer: 5 }, state: { values: [0, 1, 1, 2, 3, 5], active: [5] } },
      ],
    },
    "space-optimization": {
      ...shared,
      title: name,
      pattern: "Rolling Window DP",
      definition: "If a recurrence depends only on a few recent states, the full table can be compressed into a tiny moving window.",
      points: ["Compression does not change the recurrence.", "Keep only future-needed states.", "Optimize after correctness."],
      code: ["prev2 = 0", "prev1 = 1", "curr = prev1 + prev2", "shift window"],
      simulation: "space",
      steps: [
        { label: "Window setup", message: "Keep only the states the next transition needs.", line: 0, vars: { prev2: 0, prev1: 1 }, state: { prev2: 0, prev1: 1, curr: "-", i: 1 } },
        { label: "Compute current", message: "The new answer comes from the rolling window.", line: 2, vars: { i: 2 }, state: { prev2: 0, prev1: 1, curr: 1, i: 2 } },
        { label: "Shift forward", message: "Slide the window so it matches the next state.", line: 3, vars: { nextPrev2: 1, nextPrev1: 1 }, state: { prev2: 1, prev1: 1, curr: 1, i: 2 } },
        { label: "Compact answer", message: "Space drops while the recurrence stays correct.", line: 3, vars: { answer: 8 }, state: { prev2: 5, prev1: 8, curr: 8, i: 6 } },
      ],
    },
    "state-definition": {
      ...shared,
      title: name,
      pattern: "Pick the Right State",
      definition: "A DP becomes workable only when the state meaning is exact enough to drive transitions and base cases.",
      points: ["Bad states create bad transitions.", "The state must be sufficient, not vague.", "Extra dimensions appear only when information is missing."],
      code: ["Bad: dp[i] = useful answer", "Good: dp[i] = min cost to reach i", "Need more info? add a dimension"],
      simulation: "state",
      steps: [
        { label: "Too vague", message: "A vague state does not tell you how to transition.", line: 0, vars: { verdict: "bad state" }, state: { cards: [{ text: "dp[i] = useful answer", active: true, good: false }, { text: "dp[i] = min cost to reach i", active: false, good: false }, { text: "dp[day][holding]", active: false, good: false }] } },
        { label: "Precise state", message: "Now the state meaning is exact and transition-ready.", line: 1, vars: { verdict: "good 1D state" }, state: { cards: [{ text: "dp[i] = useful answer", active: false, good: false }, { text: "dp[i] = min cost to reach i", active: true, good: true }, { text: "dp[day][holding]", active: false, good: false }] } },
        { label: "Add dimension when needed", message: "Some problems need more information than one index can hold.", line: 2, vars: { extraDimension: "holding" }, state: { cards: [{ text: "dp[i] = useful answer", active: false, good: false }, { text: "dp[i] = min cost to reach i", active: false, good: true }, { text: "dp[day][holding]", active: true, good: true }] } },
      ],
    },
    "transition-relation": {
      ...shared,
      title: name,
      pattern: "Write the Recurrence",
      definition: "The transition relation is the exact rule that computes one state from smaller solved states.",
      points: ["List legal predecessors.", "Apply the combine rule.", "Store the new state."],
      code: ["dp[i] = min(dp[i-1] + c1, dp[i-2] + c2)", "store answer"],
      simulation: "transition",
      steps: [
        { label: "Target state", message: "Focus on one state and list valid incoming sources.", line: 0, vars: { target: "dp[5]" }, state: { target: "dp[5]", sources: [{ label: "dp[4] + 3", value: 10, chosen: false }, { label: "dp[3] + 2", value: 8, chosen: false }] } },
        { label: "Compare sources", message: "The recurrence checks all valid smaller states for this problem.", line: 0, vars: { candidates: 2 }, state: { target: "dp[5]", sources: [{ label: "dp[4] + 3", value: 10, chosen: false }, { label: "dp[3] + 2", value: 8, chosen: false }] } },
        { label: "Store best result", message: "The chosen transition becomes the new state value.", line: 1, vars: { "dp[5]": 8 }, state: { target: "dp[5]", sources: [{ label: "dp[4] + 3", value: 10, chosen: false }, { label: "dp[3] + 2", value: 8, chosen: true }] } },
      ],
    },
    "base-cases": {
      ...shared,
      title: name,
      pattern: "Seed Known Answers",
      definition: "Base cases anchor the DP. Without them, no later transition has a trustworthy starting point.",
      points: ["Base cases are direct answers.", "Wrong seeds poison the whole table.", "Always test the smallest inputs first."],
      code: ["dp[0] = 1", "dp[1] = 1", "fill later states"],
      simulation: "base",
      steps: [
        { label: "Unknown table", message: "Before seeding, every state is unresolved.", line: 0, vars: { status: "uninitialized" }, state: { values: [null, null, null, null, null, null], seeded: [] } },
        { label: "First base case", message: "The smallest direct answer enters the table.", line: 0, vars: { "dp[0]": 1 }, state: { values: [1, null, null, null, null, null], seeded: [0] } },
        { label: "Second base case", message: "Now the recurrence has enough footing to start.", line: 1, vars: { "dp[1]": 1 }, state: { values: [1, 1, null, null, null, null], seeded: [0, 1] } },
        { label: "Derived states", message: "Larger states now grow from those seeded answers.", line: 2, vars: { answer: 8 }, state: { values: [1, 1, 2, 3, 5, 8], seeded: [0, 1] } },
      ],
    },
  };

  return scenarios[lessonId] ?? null;
}

function renderSpecial(profile: SpecialProfile, step: SpecialStep) {
  const state = step.state;

  if (profile.simulation === "intro") {
    const data = state as { calls: number; unique: number; saved: number; solved: string[] };
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginTop: 18 }}>
          {card("Recursive Calls", <div style={{ fontSize: 28, fontWeight: 900 }}>{data.calls}</div>, true)}
          {card("Unique States", <div style={{ fontSize: 28, fontWeight: 900 }}>{data.unique}</div>)}
          {card("Saved Calls", <div style={{ fontSize: 28, fontWeight: 900 }}>{data.saved}</div>)}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
          {data.solved.map((item) => (
            <React.Fragment key={item}>{card(item, <div style={{ height: 8 }} />, false)}</React.Fragment>
          ))}
        </div>
      </>
    );
  }

  if (profile.simulation === "comparison") {
    const data = state as { labels: string[]; rec: number[]; dp: number[]; active: number };
    return (
      <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
        {data.labels.map((label, index) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr", gap: 12, alignItems: "center" }}>
            <div style={{ fontWeight: 900 }}>{label}</div>
            {card("Rec", <div style={{ fontSize: 22, fontWeight: 900 }}>{data.rec[index]}</div>, index === data.active)}
            {card("DP", <div style={{ fontSize: 22, fontWeight: 900 }}>{data.dp[index]}</div>)}
          </div>
        ))}
      </div>
    );
  }

  if (profile.simulation === "overlap") {
    const data = state as { nodes: string[]; active: string[]; repeated: string[] };
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
        {data.nodes.map((node) => (
          <React.Fragment key={node}>
            {card(node, <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{data.repeated.includes(node.replace(/[ab]/g, "")) ? "repeat" : "unique"}</div>, data.active.includes(node))}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (profile.simulation === "optimal") {
    const data = state as { left: number; right: number; extra: number; result: number | string };
    return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginTop: 18 }}>{card("dp[3]", <div style={{ fontSize: 28, fontWeight: 900 }}>{data.left}</div>)}{card("dp[4]", <div style={{ fontSize: 28, fontWeight: 900 }}>{data.right}</div>)}{card("extra cost", <div style={{ fontSize: 28, fontWeight: 900 }}>+{data.extra}</div>)}{card("dp[5]", <div style={{ fontSize: 28, fontWeight: 900 }}>{String(data.result)}</div>, true)}</div>;
  }

  if (profile.simulation === "memo") {
    const data = state as { cache: Array<number | string>; active: number; hits: number };
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))", gap: 10, marginTop: 18 }}>
          {data.cache.map((value, index) => (
            <React.Fragment key={`memo-${index}`}>
              {card(`memo[${index}]`, <div style={{ fontSize: 24, fontWeight: 900 }}>{String(value)}</div>, index === data.active)}
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: 18 }}>{card("Cache Hits", <div style={{ fontSize: 28, fontWeight: 900 }}>{data.hits}</div>, data.hits > 0)}</div>
      </>
    );
  }

  if (profile.simulation === "tabulation" || profile.simulation === "base") {
    const data = state as { values: Array<number | null>; active?: number[]; seeded?: number[] };
    return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))", gap: 10, marginTop: 18 }}>{data.values.map((value, index) => card(`dp[${index}]`, <div style={{ fontSize: 24, fontWeight: 900 }}>{value ?? "·"}</div>, (data.active ?? data.seeded ?? []).includes(index)))}</div>;
  }

  if (profile.simulation === "space") {
    const data = state as { prev2: number | string; prev1: number | string; curr: number | string; i: number };
    return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginTop: 18 }}>{card("prev2", <div style={{ fontSize: 28, fontWeight: 900 }}>{String(data.prev2)}</div>)}{card("prev1", <div style={{ fontSize: 28, fontWeight: 900 }}>{String(data.prev1)}</div>, true)}{card("curr", <div style={{ fontSize: 28, fontWeight: 900 }}>{String(data.curr)}</div>)}{card("i", <div style={{ fontSize: 28, fontWeight: 900 }}>{data.i}</div>)}</div>;
  }

  if (profile.simulation === "state") {
    const data = state as { cards: Array<{ text: string; active: boolean; good: boolean }> };
    return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginTop: 18 }}>{data.cards.map((item) => card(item.text, <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.good ? "sufficient state" : "insufficient state"}</div>, item.active))}</div>;
  }

  const data = state as { target: string; sources: Array<{ label: string; value: number; chosen: boolean }> };
  return (
    <>
      <div style={{ marginTop: 18 }}>{card("Target", <div style={{ fontSize: 28, fontWeight: 900 }}>{data.target}</div>, true)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 18 }}>
        {data.sources.map((source) => card(source.label, <div style={{ fontSize: 28, fontWeight: 900 }}>{source.value}</div>, source.chosen))}
      </div>
    </>
  );
}

export default function DynamicProgrammingLessonLab({ lessonId, title }: { lessonId: string; title?: string }) {
  const special = useMemo(() => specialForLesson(lessonId, title), [lessonId, title]);
  const generic = useMemo(() => profileForLesson(lessonId, title), [lessonId, title]);
  const [inputValue, setInputValue] = useState("");
  const [customValues, setCustomValues] = useState<number[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
    if (!special) {
      setInputValue(generic.values.join(", "));
      setCustomValues(generic.values);
    }
  }, [lessonId, generic, special]);

  const dynamicProfile = useMemo(
    () => ({ ...generic, values: customValues.length > 0 ? customValues : generic.values }),
    [generic, customValues],
  );

  const steps = useMemo(
    () => (special ? special.steps : buildGenericSteps(dynamicProfile)),
    [special, dynamicProfile],
  );

  useEffect(() => {
    if (!playing || stepIndex >= steps.length - 1) return;
    const timer = window.setTimeout(() => {
      const next = Math.min(steps.length - 1, stepIndex + 1);
      setStepIndex(next);
      if (next >= steps.length - 1) setPlaying(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [playing, stepIndex, steps.length]);

  const step = steps[Math.min(stepIndex, steps.length - 1)] as GenericStep | SpecialStep;
  const profile = special ?? dynamicProfile;

  const applyGenericInput = () => {
    const parsed = inputValue.split(",").map((value) => parseInt(value.trim(), 10)).filter((value) => !Number.isNaN(value));
    if (parsed.length > 0) {
      setCustomValues(parsed);
      setStepIndex(0);
      setPlaying(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.shell}>
          <div style={styles.eyebrow}>Dynamic Programming</div>
          <h1 style={styles.h1}>{profile.title}</h1>
          <p style={styles.intro}>{profile.definition}</p>
          <div style={styles.badgeRow}>
            <div style={styles.badge}><div style={styles.label}>Topic</div><div style={styles.value}>{profile.topic}</div></div>
            <div style={styles.badge}><div style={styles.label}>Pattern</div><div style={styles.value}>{profile.pattern}</div></div>
            <div style={styles.badge}><div style={styles.label}>Time</div><div style={styles.value}>{profile.time}</div></div>
            <div style={styles.badge}><div style={styles.label}>Space</div><div style={styles.value}>{profile.space}</div></div>
          </div>
        </div>
      </section>

      <section style={styles.body}>
        <aside style={{ display: "grid", gap: 16, alignContent: "start" }}>
          <div style={styles.panel}>
            <div style={styles.label}>Current step</div>
            <h2 style={{ margin: "10px 0", fontSize: 20 }}>{step.label}</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, minHeight: 88 }}>{step.message}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button title="Reset" style={styles.button} onClick={() => { setStepIndex(0); setPlaying(false); }}><RotateCcw size={16} /></button>
              <button title={playing ? "Pause" : "Play"} style={{ ...styles.button, background: "var(--text-primary)", color: "var(--bg-primary)" }} onClick={() => setPlaying((value) => !value)}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
              <button title="Previous" style={styles.button} onClick={() => setStepIndex((value) => Math.max(0, value - 1))}><ChevronLeft size={16} /></button>
              <button title="Next" style={styles.button} onClick={() => setStepIndex((value) => Math.min(steps.length - 1, value + 1))}><ChevronRight size={16} /></button>
            </div>
          </div>
          <div style={styles.panel}>
            <div style={styles.label}>Definition</div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}>{profile.definition}</p>
          </div>
          <div style={styles.panel}>
            <div style={styles.label}>How to think</div>
            {profile.points.map((point) => <p key={point} style={{ color: "var(--text-secondary)", lineHeight: 1.55, margin: "10px 0 0" }}>{point}</p>)}
          </div>
        </aside>

        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ ...styles.panel, minHeight: 360 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={styles.label}>Simulation</div>
              {!special ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="e.g. 1, 2, 3, 5, 8"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 6, padding: "6px 12px", color: "var(--text-primary)", fontSize: 12, outline: "none", width: 160 }}
                  />
                  <button onClick={applyGenericInput} style={{ background: "var(--text-primary)", color: "var(--bg-primary)", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Apply
                  </button>
                </div>
              ) : null}
            </div>

            {special ? (
              <>
                {renderSpecial(special, step as SpecialStep)}
                <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
                  {Object.entries((step as SpecialStep).vars).map(([key, value]) => (
                    <div key={key} style={{ border: "1px solid var(--border-color)", borderRadius: 8, padding: 12, background: "var(--bg-primary)" }}>
                      <div style={styles.label}>{key}</div>
                      <div style={styles.value}>{String(value)}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))", gap: 10, marginTop: 18 }}>
                  {dynamicProfile.values.map((value, index) => (
                    <div key={index} style={{ border: `2px solid ${(step as GenericStep).active.includes(index) ? "var(--text-primary)" : "var(--border-color)"}`, background: (step as GenericStep).done.includes(index) ? "var(--accent-soft)" : "var(--bg-primary)", borderRadius: 8, padding: "14px 10px", textAlign: "center" }}>
                      <div style={{ ...styles.label, letterSpacing: 0 }}>dp[{index}]</div>
                      <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
                  {Object.entries((step as GenericStep).vars).map(([key, value]) => (
                    <div key={key} style={{ border: "1px solid var(--border-color)", borderRadius: 8, padding: 12, background: "var(--bg-primary)" }}>
                      <div style={styles.label}>{key}</div>
                      <div style={styles.value}>{String(value)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div style={{ height: 280 }}>
            <CodeTracker code={profile.code} activeLine={step.line} />
          </div>
        </div>
      </section>
    </main>
  );
}
