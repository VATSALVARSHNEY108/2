"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { CodeTracker } from "./CodeTracker";

type Step = {
  label: string;
  message: string;
  line: number;
  depth: number;
  activePath: string[];
  choices: string[];
};

type Profile = {
  title: string;
  topic: string;
  pattern: string;
  definition: string;
  time: string;
  space: string;
  points: string[];
  code: string[];
  choices: string[];
};

type TopicKind = "mechanics" | "linear" | "divide" | "tree" | "fundamentals" | "generation" | "constraint" | "dp";

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
  return slug.split("-").map((part) => {
    const lower = part.toLowerCase();
    if (["dp", "ip"].includes(lower)) return lower.toUpperCase();
    if (["ii", "iii", "iv"].includes(lower)) return lower.toUpperCase();
    if (lower === "n") return "N";
    if (lower === "m") return "M";
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(" ");
}

const LESSON_TOPIC: Record<string, TopicKind> = {
  "introduction-to-recursion": "mechanics",
  "recursive-thinking": "mechanics",
  "base-case": "mechanics",
  "recursive-case": "mechanics",
  "recursive-function-calls": "mechanics",
  "call-stack": "mechanics",
  "stack-overflow": "mechanics",
  "dry-run-recursion": "mechanics",
  "tail-recursion": "mechanics",
  "head-recursion": "mechanics",
  "indirect-recursion": "mechanics",
  "nested-recursion": "mechanics",
  "parameterized-recursion": "mechanics",
  "functional-recursion": "mechanics",
  "recurrence-relation-basics": "mechanics",
  "time-complexity-recursion": "mechanics",
  "space-complexity-recursion": "mechanics",
  "recursion-tree-method": "mechanics",
  "multiple-recursion-calls": "tree",
  "tree-recursion": "tree",
  "recursive-pattern-problems": "mechanics",
  "practice-patterns-recursion": "mechanics",

  "print-numbers": "linear",
  "sum-of-n-numbers": "linear",
  factorial: "linear",
  fibonacci: "tree",
  "power-calculation": "divide",
  "reverse-array-recursion": "linear",
  "reverse-string-recursion": "linear",
  "palindrome-check-recursion": "linear",
  "binary-search-recursion": "divide",
  "recursion-on-arrays": "linear",
  "recursion-on-strings": "linear",

  "backtracking-introduction": "fundamentals",
  "recursion-vs-backtracking": "fundamentals",
  "backtracking-template": "fundamentals",
  "decision-tree-visualization": "fundamentals",
  "state-space-tree": "fundamentals",
  "undo-backtrack-step": "fundamentals",
  "constraint-checking": "fundamentals",
  "branch-and-bound-basics": "fundamentals",
  "backtracking-on-arrays": "fundamentals",
  "backtracking-on-strings": "fundamentals",
  "backtracking-on-grids": "fundamentals",
  "practice-patterns-backtracking": "fundamentals",

  "subsequence-problems": "generation",
  "generate-all-subsequences": "generation",
  "generate-all-subsets": "generation",
  "generate-power-set": "generation",
  "pick-not-pick": "generation",
  "generate-all-permutations": "generation",
  "permutations-duplicates": "generation",
  "combination-sum": "generation",
  "combination-sum-ii": "generation",
  "subset-sum-recursion": "generation",
  "letter-combinations": "generation",
  "generate-parentheses": "generation",
  "partition-problems": "generation",
  "palindrome-partitioning-recursion": "generation",
  "restore-ip-addresses": "generation",
  "expression-add-operators": "generation",

  "n-queens": "constraint",
  "rat-in-a-maze": "constraint",
  "sudoku-solver": "constraint",
  "word-search": "constraint",
  "m-coloring": "constraint",
  "knights-tour": "constraint",
  "maze-solving": "constraint",

  "memoization-basics": "dp",
  "recursive-dp-intro": "dp",
};

const LESSON_FOCUS: Record<string, string> = {
  "base-case": "the stopping condition that prevents infinite recursion",
  "recursive-case": "the part of the function that shrinks the problem and calls itself",
  "call-stack": "the stack of active function frames created by nested calls",
  "stack-overflow": "what happens when recursion depth grows beyond available stack memory",
  "tail-recursion": "a call shape where the recursive call is the final action",
  "head-recursion": "a call shape where recursion happens before the current frame does its work",
  "tree-recursion": "a recursion shape where each call creates multiple child calls",
  "recurrence-relation-basics": "writing T(n) equations that describe recursive runtime",
  "recursion-tree-method": "expanding recursive calls level by level to estimate work",
  "dry-run-recursion": "tracing call creation, base cases, and returns by hand",
  fibonacci: "the classic overlapping tree-recursion example",
  "binary-search-recursion": "halving the search range until the target or empty range is found",
  "backtracking-template": "the standard choose, explore, undo structure",
  "decision-tree-visualization": "seeing every choice as a branch in the search tree",
  "state-space-tree": "the complete search space of partial and complete decisions",
  "undo-backtrack-step": "restoring mutable state before trying a sibling branch",
  "constraint-checking": "rejecting invalid choices before deeper recursion",
  "branch-and-bound-basics": "pruning branches that cannot beat the current best answer",
  "pick-not-pick": "the two-choice include/exclude pattern",
  "generate-parentheses": "building only prefixes where open and close counts stay valid",
  "n-queens": "placing one queen per row while blocking columns and diagonals",
  "rat-in-a-maze": "moving through open cells while marking and unmarking the path",
  "sudoku-solver": "filling empty cells with digits that satisfy row, column, and box rules",
  "word-search": "walking adjacent cells while preventing reuse in the same path",
  "m-coloring": "assigning graph colors so adjacent vertices differ",
  "memoization-basics": "caching recursive answers by state",
  "recursive-dp-intro": "turning repeated recursion into top-down dynamic programming",
};

function profileForLesson(lessonId: string, title?: string): Profile {
  const name = title ?? titleFromSlug(lessonId);
  const topic = LESSON_TOPIC[lessonId] ?? "mechanics";
  const focus = LESSON_FOCUS[lessonId] ?? `the core idea behind ${name}`;

  if (topic === "constraint") {
    return {
      title: name,
      topic: "Constraint Problems",
      pattern: "Constraint Backtracking",
      definition: `${name} is a constraint backtracking lesson about ${focus}. It explores one valid move at a time, rejects illegal states early, and undoes moves before trying alternatives.`,
      time: "Exponential, pruned by constraints",
      space: "O(depth)",
      points: ["Represent the board, grid, or graph state.", "Check constraints before the recursive call.", "Undo the move so the next branch starts clean."],
      code: ["bool solve(state) {", "  if (isComplete(state)) return true;", "  for (choice : choices(state)) {", "    if (!isValid(choice)) continue;", "    apply(choice);", "    if (solve(nextState)) return true;", "    undo(choice);", "  }", "  return false;", "}"],
      choices: ["candidate", "valid?", "place", "undo"],
    };
  }

  if (topic === "generation") {
    return {
      title: name,
      topic: "Generation Problems",
      pattern: "Choice Tree Backtracking",
      definition: `${name} is a generation lesson about ${focus}. It walks a decision tree, builds a partial answer, records complete valid answers, then backtracks to explore siblings.`,
      time: "O(branches^depth)",
      space: "O(depth + output)",
      points: ["Each recursion level owns one index, slot, or partition boundary.", "Add a choice before recursing.", "Remove that choice after returning."],
      code: ["void backtrack(index, path) {", "  if (index == n) { save(path); return; }", "  for (choice : options(index)) {", "    path.push(choice);", "    backtrack(nextIndex, path);", "    path.pop();", "  }", "}"],
      choices: ["choose", "append", "record", "pop"],
    };
  }

  if (topic === "fundamentals") {
    return {
      title: name,
      topic: "Backtracking Fundamentals",
      pattern: "Choose Explore Undo",
      definition: `${name} explains ${focus}. The key idea is to mutate a partial state, recursively explore from it, and restore it before the next option.`,
      time: "Depends on branching",
      space: "O(depth)",
      points: ["Write the base case before the loop.", "Choose only valid options.", "Undo every mutation made before the recursive call."],
      code: ["void backtrack(state) {", "  if (isAnswer(state)) { save(state); return; }", "  for (choice : choices) {", "    if (!allowed(choice, state)) continue;", "    apply(choice, state);", "    backtrack(state);", "    undo(choice, state);", "  }", "}"],
      choices: ["state", "choice", "explore", "undo"],
    };
  }

  if (topic === "linear" || topic === "divide" || topic === "tree") {
    const isTree = topic === "tree";
    const isDivide = topic === "divide";
    return {
      title: name,
      topic: isTree ? "Multiple Call Recursion" : isDivide ? "Divide Recursion" : "Linear Recursion",
      pattern: isTree ? "Tree Recursion" : isDivide ? "Divide and Shrink" : "One Smaller Problem",
      definition: `${name} is a recursion problem about ${focus}. It reduces the input, reaches a base case, and uses return values or side effects to build the answer.`,
      time: lessonId === "fibonacci" ? "O(2^N) naive" : isDivide ? "O(log N) or O(log exponent)" : "O(N)",
      space: isTree ? "O(height)" : "O(recursion depth)",
      points: ["Define the base case for the smallest valid input.", "Make every call move closer to the base case.", "Combine the smaller answer with the current frame's work."],
      code: isTree
        ? ["int solve(n) {", "  if (n <= 1) return n;", "  int left = solve(n - 1);", "  int right = solve(n - 2);", "  return combine(left, right);", "}"]
        : ["Result solve(input) {", "  if (baseCase(input)) return baseAnswer;", "  Result smaller = solve(reducedInput);", "  return combine(input, smaller);", "}"],
      choices: isTree ? ["call left", "call right", "base", "merge"] : ["current", "smaller", "base", "return"],
    };
  }

  if (topic === "dp") {
    return {
      title: name,
      topic: "Recursive DP",
      pattern: "Memoized Recursion",
      definition: `${name} connects recursion to dynamic programming by caching answers for repeated states instead of recomputing the same subtree.`,
      time: "O(unique states x transition cost)",
      space: "O(unique states + depth)",
      points: ["Name the state clearly.", "Return cached values before expanding calls.", "Store the computed result before returning."],
      code: ["int solve(state) {", "  if (base(state)) return value;", "  if (memo.has(state)) return memo[state];", "  int ans = best(next states);", "  return memo[state] = ans;", "}"],
      choices: ["state", "cache hit", "compute", "store"],
    };
  }

  return {
    title: name,
    topic: "Recursion Mechanics",
    pattern: "Call Stack Reasoning",
    definition: `${name} focuses on ${focus}. It explains how recursive calls are created, stopped, returned, and analyzed.`,
    time: "Depends on recurrence",
    space: "O(max call depth)",
    points: ["Every active call owns a stack frame.", "Base cases stop new frames from being created.", "A recurrence describes the number of calls and work per call."],
    code: ["void call(depth) {", "  if (depth == 0) return;", "  beforeRecursiveCall();", "  call(depth - 1);", "  afterRecursiveCall();", "}"],
    choices: ["enter", "frame", "base", "return"],
  };
}

function buildSteps(profile: Profile): Step[] {
  const c = profile.choices;
  return [
    { label: "Frame 0", message: `Start the ${profile.topic} lesson by identifying the state and the stopping condition.`, line: 0, depth: 0, activePath: ["initial state"], choices: c },
    { label: "Make progress", message: `Apply the ${profile.pattern} rule to move from the current state to the next smaller or deeper state.`, line: Math.min(2, profile.code.length - 1), depth: 1, activePath: ["initial state", c[0] || "enter"], choices: c },
    { label: "Recursive step", message: "The next call now owns its own frame and repeats the same logic with updated state.", line: Math.min(4, profile.code.length - 1), depth: 2, activePath: ["initial state", c[0] || "enter", c[1] || "frame"], choices: c },
    { label: "Stop or prune", message: "A base case, answer condition, cache hit, or invalid constraint stops this branch from expanding further.", line: Math.min(1, profile.code.length - 1), depth: 3, activePath: ["initial state", c[0] || "enter", c[1] || "frame", c[2] || "base"], choices: c },
    { label: "Return or undo", message: "Return the result, store it, or undo the choice so the previous frame can continue correctly.", line: Math.max(0, profile.code.length - 2), depth: 1, activePath: ["initial state", c[3] || "return"], choices: c },
  ];
}

export default function RecursionBacktrackingLessonLab({ lessonId, title }: { lessonId: string; title?: string }) {
  const profile = useMemo(() => profileForLesson(lessonId, title), [lessonId, title]);
  const [inputValue, setInputValue] = useState("");
  const [customChoices, setCustomChoices] = useState<string[]>([]);

  useEffect(() => {
    if (profile && profile.choices) {
      setInputValue(profile.choices.join(", "));
      setCustomChoices(profile.choices);
    }
  }, [profile]);

  const dynamicProfile = useMemo(() => ({
    ...profile,
    choices: customChoices.length > 0 ? customChoices : (profile?.choices || [])
  }), [profile, customChoices]);

  const steps = useMemo(() => buildSteps(dynamicProfile), [dynamicProfile]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || { label: "No Step", message: "", activePath: [], depth: 0, choices: [], line: 0 };

  useEffect(() => {
    if (!playing) return;
    if (stepIndex >= steps.length - 1) return;
    const timer = window.setTimeout(() => {
      const nextStep = Math.min(steps.length - 1, stepIndex + 1);
      setStepIndex(nextStep);
      if (nextStep >= steps.length - 1) setPlaying(false);
    }, 850);
    return () => window.clearTimeout(timer);
  }, [playing, stepIndex, steps.length]);

  const handleApplyCustomInput = () => {
    const parsed = inputValue
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);
    if (parsed.length > 0) {
      setCustomChoices(parsed);
      setStepIndex(0);
      setPlaying(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.shell}>
          <div style={styles.eyebrow}>Recursion & Backtracking</div>
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
            <div style={styles.label}>Checklist</div>
            {profile.points.map((point) => <p key={point} style={{ color: "var(--text-secondary)", lineHeight: 1.55, margin: "10px 0 0" }}>{point}</p>)}
          </div>
        </aside>

        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ ...styles.panel, minHeight: 360, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={styles.label}>Call tree simulation</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g. choose, explore, backtrack"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 6,
                    padding: "6px 12px",
                    color: "var(--text-primary)",
                    fontSize: 12,
                    outline: "none",
                    width: 180
                  }}
                />
                <button
                  onClick={handleApplyCustomInput}
                  style={{
                    background: "var(--text-primary)",
                    color: "var(--bg-primary)",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
            <div style={{ marginTop: 24, display: "grid", gap: 18 }}>
              {step.activePath.map((node, index) => (
                <div key={`${node}-${index}`} style={{ marginLeft: index * 42, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 8, border: `2px solid ${index === step.depth ? "var(--text-primary)" : "var(--border-color)"}`, background: index < step.depth ? "var(--accent-soft)" : "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{index}</div>
                  <div>
                    <div style={{ fontWeight: 900 }}>{node}</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>depth {index}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
              {step.choices.map((choice, index) => (
                <div key={`${choice}-${index}`} style={{ border: "1px solid var(--border-color)", borderRadius: 8, background: step.activePath.includes(choice) ? "var(--accent-soft)" : "var(--bg-primary)", padding: 12 }}>
                  <div style={styles.label}>choice</div>
                  <div style={styles.value}>{choice}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 300 }}>
            <CodeTracker code={profile.code} activeLine={step.line} />
          </div>
        </div>
      </section>
    </main>
  );
}
