"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Pencil, Play, Plus, RotateCcw, Shuffle, Trash2 } from "lucide-react";

type SimKind =
  | "table"
  | "chaining"
  | "linear"
  | "quadratic"
  | "double"
  | "rehash"
  | "frequency"
  | "set"
  | "pair"
  | "subarray"
  | "rolling"
  | "cache"
  | "compression"
  | "bitmask"
  | "stl"
  | "concept";

type Bucket = {
  index: number;
  values: string[];
};

type Step = {
  label: string;
  message: string;
  buckets: Bucket[];
  activeBuckets: number[];
  activeKeys: string[];
  line: number;
  vars: Record<string, string | number>;
  result?: string | number | null;
};

type Profile = {
  title: string;
  kind: SimKind;
  definition: string;
  time: string;
  space: string;
  code: string[];
  defaultItems: string[];
  target: string;
};

const TABLE_SIZE = 7;
const DEFAULT_NUMBERS = ["12", "44", "19", "33", "26", "50", "17"];
const DEFAULT_WORDS = ["tea", "eat", "tan", "ate", "nat", "bat"];
const DEFAULT_TEXT = ["a", "b", "r", "a", "c", "a", "d", "a", "b"];

const styles = {
  page: { minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" },
  hero: { padding: "92px 48px 42px", borderBottom: "1px solid var(--border-color)" },
  shell: { maxWidth: 1280, margin: "0 auto" },
  eyebrow: { fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.16em", color: "var(--text-secondary)" },
  h1: { margin: "16px 0", fontSize: "clamp(38px, 7vw, 72px)", lineHeight: 1, fontWeight: 900, letterSpacing: 0 },
  intro: { maxWidth: 850, color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.7 },
  body: { maxWidth: 1280, margin: "0 auto", padding: "34px 32px 90px", display: "grid", gridTemplateColumns: "minmax(260px, 340px) minmax(0, 1fr)", gap: 24 },
  panel: { background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8, padding: 18 },
  card: { background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8 },
  label: { fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "var(--text-secondary)" },
  input: { width: "100%", height: 36, borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", padding: "0 10px", outline: "none", fontWeight: 700 },
  button: { height: 36, borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 12px", cursor: "pointer", fontWeight: 800, fontSize: 12 },
  iconButton: { width: 36, height: 36, borderRadius: 6, border: "1px solid var(--border-color)", background: "var(--bg-elevated)", color: "var(--text-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
};

function titleFromSlug(slug: string) {
  return slug.split("-").map((part) => {
    if (["stl", "lru"].includes(part)) return part.toUpperCase();
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join(" ");
}

function kindFromSlug(slug: string): SimKind {
  if (slug.includes("practice-patterns") || slug.includes("time-complexity") || slug.includes("greedy-problems") || slug.includes("binary-search-problems")) return "concept";
  if (slug.includes("separate-chaining") || slug.includes("collision-resolution") || slug.includes("collision-in") || slug.includes("hash-collision")) return "chaining";
  if (slug.includes("linear-probing") || slug.includes("open-addressing")) return "linear";
  if (slug.includes("quadratic-probing")) return "quadratic";
  if (slug.includes("double-hashing") && !slug.includes("strings")) return "double";
  if (slug.includes("rehashing") || slug.includes("load-factor")) return "rehash";
  if (slug.includes("frequency") || slug.includes("counting-frequencies") || slug.includes("first-non-repeating") || slug.includes("character-hashing") || slug.includes("integer-hashing")) return "frequency";
  if (slug.includes("hashset") || slug.includes("set-vs") || slug.includes("duplicate") || slug.includes("longest-consecutive") || slug.includes("multiset")) return "set";
  if (slug.includes("two-sum") || slug.includes("three-sum") || slug.includes("pair") || slug.includes("anagrams")) return "pair";
  if (slug.includes("subarray") || slug.includes("prefix-sum") || slug.includes("longest-subarray") || slug.includes("sliding-window")) return "subarray";
  if (slug.includes("string-hashing") || slug.includes("rolling") || slug.includes("rabin") || slug.includes("pattern") || slug.includes("prefix-hashing") || slug.includes("double-hashing-strings")) return "rolling";
  if (slug.includes("cache") || slug.includes("caching") || slug.includes("lru")) return "cache";
  if (slug.includes("coordinate-compression")) return "compression";
  if (slug.includes("bitmask")) return "bitmask";
  if (slug.includes("stl") || slug.includes("unordered") || slug.includes("ordered") || slug.includes("hashmap") || slug.includes("iterating")) return "stl";
  if (slug.includes("hash-table") || slug.includes("hash-function") || slug.includes("direct-addressing") || slug.includes("bucket") || slug.includes("custom-hash") || slug.includes("good-hash") || slug.includes("need-for") || slug.includes("introduction")) return "table";
  return "concept";
}

function codeForKind(kind: SimKind) {
  const code: Record<SimKind, string[]> = {
    table: ["hash = hashFunction(key)", "index = hash % tableSize", "place key in table[index]", "lookup repeats the same mapping"],
    chaining: ["index = hash(key) % m", "if bucket has values, collision happens", "append key to bucket chain", "search scans only that chain"],
    linear: ["index = hash(key) % m", "while table[index] is full", "    index = (index + 1) % m", "insert key at free slot"],
    quadratic: ["index = hash(key) % m", "for i = 0..m-1", "    probe = (index + i*i) % m", "insert at first free slot"],
    double: ["h1 = key % m", "h2 = 1 + key % (m - 1)", "probe = (h1 + i*h2) % m", "insert at first free slot"],
    rehash: ["if loadFactor > threshold", "create larger table", "recompute hash for every key", "move keys into new table"],
    frequency: ["for each value", "    freq[value]++", "query freq or first position", "use counts to answer"],
    set: ["for each value", "    if seen contains value, report match", "    insert value into seen", "set gives expected O(1) membership"],
    pair: ["for each value x", "    need = target - x", "    if need exists, answer found", "    store x in map"],
    subarray: ["prefix += value", "need = prefix - k", "answer += count[need]", "count[prefix]++"],
    rolling: ["hash = hash * base + char", "slide window by removing old char", "compare pattern hash", "verify matching window"],
    cache: ["get(key): move node to front", "put(key): update or insert", "if capacity exceeded, evict tail", "hash map points to list nodes"],
    compression: ["copy and sort unique values", "rank = lower_bound(unique, value)", "replace value by rank", "use rank as compact key"],
    bitmask: ["mask = 0", "toggle bit for each property", "use mask as hash key", "match equal masks"],
    stl: ["choose map/set container", "insert or update key", "find/count/erase in container", "iterate key-value pairs"],
    concept: ["identify key", "hash key into compact state", "store state in table", "answer query from stored state"],
  };
  return code[kind];
}

function profileForLesson(lessonId: string, title?: string): Profile {
  const kind = kindFromSlug(lessonId);
  const isString = lessonId.includes("string") || lessonId.includes("anagram") || lessonId.includes("rabin") || lessonId.includes("pattern");
  const target = kind === "pair" ? "50" : kind === "subarray" ? "10" : kind === "rolling" ? "abra" : "33";
  return {
    title: title || titleFromSlug(lessonId),
    kind,
    definition: definitionFor(kind, lessonId),
    time: timeFor(kind),
    space: kind === "table" ? "O(M + N)" : "O(N)",
    code: codeForKind(kind),
    defaultItems: kind === "rolling" ? DEFAULT_TEXT : isString ? DEFAULT_WORDS : DEFAULT_NUMBERS,
    target,
  };
}

function definitionFor(kind: SimKind, slug: string) {
  if (kind === "rolling") return "Rolling hashing turns substrings into comparable numeric fingerprints and updates them in constant time while sliding.";
  if (kind === "subarray") return "Prefix hashing stores previous prefix states so subarray sums and window patterns can be answered immediately.";
  if (kind === "pair") return "Pair-problem hashing stores complements, groups, or signatures so matching items are found without nested loops.";
  if (kind === "cache") return "Caching combines a hash map with recency ordering so lookups are fast and eviction is predictable.";
  if (kind === "chaining" || kind === "linear" || kind === "quadratic" || kind === "double") return "Collision handling decides what happens when multiple keys map to the same bucket.";
  if (slug.includes("time-complexity")) return "Hashing is expected constant time when hash distribution and load factor stay healthy.";
  return "Hashing maps a key into a compact table index or signature for fast insert, lookup, counting, grouping, and matching.";
}

function timeFor(kind: SimKind) {
  if (kind === "rolling") return "O(N + M)";
  if (kind === "subarray" || kind === "pair" || kind === "frequency" || kind === "set") return "O(N) expected";
  if (kind === "compression") return "O(N log N)";
  if (kind === "rehash") return "O(N) rebuild";
  return "O(1) expected";
}

function emptyBuckets(size = TABLE_SIZE): Bucket[] {
  return Array.from({ length: size }, (_, index) => ({ index, values: [] }));
}

function numericHash(item: string, size: number) {
  const number = Number(item);
  if (Number.isFinite(number)) return Math.abs(Math.trunc(number)) % size;
  return item.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % size;
}

function cloneBuckets(buckets: Bucket[]) {
  return buckets.map((bucket) => ({ index: bucket.index, values: [...bucket.values] }));
}

function step(label: string, message: string, buckets: Bucket[], activeBuckets: number[], activeKeys: string[], line: number, vars: Record<string, string | number>, result: string | number | null = null): Step {
  return { label, message, buckets: cloneBuckets(buckets), activeBuckets, activeKeys, line, vars, result };
}

function buildTableSteps(items: string[], profile: Profile): Step[] {
  if (profile.kind === "chaining") return buildChainingSteps(items);
  if (profile.kind === "linear" || profile.kind === "quadratic" || profile.kind === "double") return buildOpenAddressSteps(items, profile.kind);
  if (profile.kind === "rehash") return buildRehashSteps(items);
  const buckets = emptyBuckets();
  const steps = [step("Start", "Start with an empty hash table.", buckets, [], [], 0, { tableSize: TABLE_SIZE })];
  items.forEach((item) => {
    const index = numericHash(item, TABLE_SIZE);
    steps.push(step("Hash", `hash(${item}) maps to bucket ${index}.`, buckets, [index], [item], 1, { key: item, index }));
    buckets[index].values = [item];
    steps.push(step("Place", `Store ${item} in direct bucket ${index}.`, buckets, [index], [item], 2, { key: item, index }));
  });
  return steps;
}

function buildChainingSteps(items: string[]) {
  const buckets = emptyBuckets(5);
  const steps = [step("Start", "Each bucket can hold a chain of colliding keys.", buckets, [], [], 0, { tableSize: 5 })];
  items.forEach((item) => {
    const index = numericHash(item, 5);
    const collision = buckets[index].values.length > 0;
    steps.push(step("Hash", `${item} maps to bucket ${index}${collision ? ", causing a collision" : ""}.`, buckets, [index], [item], collision ? 1 : 0, { key: item, index, chainLength: buckets[index].values.length }));
    buckets[index].values.push(item);
    steps.push(step("Chain", `Append ${item} to bucket ${index}'s chain.`, buckets, [index], [item], 2, { key: item, index, chainLength: buckets[index].values.length }));
  });
  return steps;
}

function buildOpenAddressSteps(items: string[], kind: SimKind) {
  const size = 7;
  const buckets = emptyBuckets(size);
  const steps = [step("Start", "Open addressing stores every key directly in the table.", buckets, [], [], 0, { tableSize: size })];
  items.forEach((item) => {
    const key = Math.abs(Number(item)) || item.length * 11;
    const h1 = key % size;
    const h2 = 1 + (key % (size - 1));
    for (let i = 0; i < size; i++) {
      const probe = kind === "linear" ? (h1 + i) % size : kind === "quadratic" ? (h1 + i * i) % size : (h1 + i * h2) % size;
      const occupied = buckets[probe].values.length > 0;
      steps.push(step("Probe", `${item} probes slot ${probe}${occupied ? ", but it is occupied" : " and it is free"}.`, buckets, [probe], [item], occupied ? 1 : 2, { key: item, probe, attempt: i, h1, h2 }));
      if (!occupied) {
        buckets[probe].values = [item];
        steps.push(step("Insert", `Insert ${item} at slot ${probe}.`, buckets, [probe], [item], 3, { key: item, slot: probe }));
        break;
      }
    }
  });
  return steps;
}

function buildRehashSteps(items: string[]) {
  const buckets = emptyBuckets(4);
  const steps = [step("Start", "Track load factor while inserting keys.", buckets, [], [], 0, { tableSize: 4, loadFactor: 0 })];
  let count = 0;
  items.forEach((item) => {
    const index = numericHash(item, buckets.length);
    buckets[index].values.push(item);
    count++;
    const load = count / buckets.length;
    steps.push(step("Insert", `Insert ${item}. Load factor is ${load.toFixed(2)}.`, buckets, [index], [item], load > 0.75 ? 0 : 2, { key: item, loadFactor: load.toFixed(2), tableSize: buckets.length }));
    if (load > 0.75) {
      const moved = buckets.flatMap((bucket) => bucket.values);
      const larger = emptyBuckets(buckets.length * 2);
      steps.push(step("Grow", "Load factor crossed the threshold, so allocate a larger table.", larger, [], [], 1, { oldSize: buckets.length, newSize: larger.length }));
      moved.forEach((key) => {
        const nextIndex = numericHash(key, larger.length);
        larger[nextIndex].values.push(key);
        steps.push(step("Rehash", `Move ${key} to new bucket ${nextIndex}.`, larger, [nextIndex], [key], 2, { key, newIndex: nextIndex }));
      });
      buckets.splice(0, buckets.length, ...larger);
    }
  });
  return steps;
}

function buildFrequencySteps(items: string[], profile: Profile) {
  const buckets = emptyBuckets(8);
  const counts = new Map<string, number>();
  const steps = [step("Start", "Build a frequency table.", buckets, [], [], 0, { distinct: 0 })];
  const source = profile.defaultItems === DEFAULT_WORDS ? items.join("").split("") : items;
  source.forEach((item, position) => {
    const index = numericHash(item, buckets.length);
    counts.set(item, (counts.get(item) || 0) + 1);
    buckets[index].values = Array.from(counts.entries()).filter(([key]) => numericHash(key, buckets.length) === index).map(([key, value]) => `${key}:${value}`);
    steps.push(step("Count", `Read ${item} at position ${position}; freq[${item}] = ${counts.get(item)}.`, buckets, [index], [item], 1, { item, position, count: counts.get(item) || 0 }));
  });
  const firstUnique = source.find((item) => counts.get(item) === 1) || "none";
  steps.push(step("Query", `First non-repeating key is ${firstUnique}.`, buckets, firstUnique === "none" ? [] : [numericHash(firstUnique, buckets.length)], [firstUnique], 2, { answer: firstUnique }, firstUnique));
  return steps;
}

function buildSetSteps(items: string[], profile: Profile) {
  const buckets = emptyBuckets();
  const seen = new Set<string>();
  const steps = [step("Start", "Use a set for membership checks.", buckets, [], [], 0, { seen: 0 })];
  for (const item of items) {
    const index = numericHash(item, TABLE_SIZE);
    const exists = seen.has(item);
    steps.push(step("Check", exists ? `${item} is already present.` : `${item} is not present yet.`, buckets, [index], [item], exists ? 1 : 2, { key: item, exists: exists ? "yes" : "no" }, exists ? item : null));
    if (!exists) {
      seen.add(item);
      buckets[index].values.push(item);
      steps.push(step("Insert", `Insert ${item} into the set.`, buckets, [index], [item], 2, { size: seen.size }));
    }
  }
  if (profile.title.toLowerCase().includes("longest")) {
    steps.push(step("Sequence", "For each number, start a streak only when value - 1 is absent.", buckets, [], [], 3, { bestStreak: longestConsecutive(items) }, longestConsecutive(items)));
  }
  return steps;
}

function longestConsecutive(items: string[]) {
  const nums = items.map(Number).filter(Number.isFinite);
  const set = new Set(nums);
  let best = 0;
  nums.forEach((num) => {
    if (!set.has(num - 1)) {
      let current = num;
      while (set.has(current)) current++;
      best = Math.max(best, current - num);
    }
  });
  return best;
}

function buildPairSteps(items: string[], target: string, profile: Profile) {
  if (profile.title.toLowerCase().includes("anagram")) return buildAnagramSteps(items);
  const buckets = emptyBuckets();
  const map = new Map<string, string>();
  const steps = [step("Start", `Store complements while looking for target ${target}.`, buckets, [], [], 0, { target })];
  const targetNumber = Number(target) || 50;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const need = String(targetNumber - (Number(item) || 0));
    const needIndex = numericHash(need, TABLE_SIZE);
    steps.push(step("Need", `For ${item}, need ${need}.`, buckets, [needIndex], [item, need], 1, { i, x: item, need }));
    if (map.has(need)) {
      steps.push(step("Found", `${need} was already stored, so (${need}, ${item}) is a pair.`, buckets, [needIndex], [need, item], 2, { first: need, second: item }, `${need},${item}`));
      return steps;
    }
    const index = numericHash(item, TABLE_SIZE);
    map.set(item, String(i));
    buckets[index].values.push(`${item}@${i}`);
    steps.push(step("Store", `Store ${item} for future complements.`, buckets, [index], [item], 3, { stored: item, index: i }));
  }
  return steps;
}

function buildAnagramSteps(items: string[]) {
  const buckets = emptyBuckets();
  const groups = new Map<string, string[]>();
  const steps = [step("Start", "Group words by sorted-character signature.", buckets, [], [], 0, { words: items.length })];
  items.forEach((word) => {
    const signature = word.split("").sort().join("");
    const index = numericHash(signature, TABLE_SIZE);
    const group = groups.get(signature) || [];
    group.push(word);
    groups.set(signature, group);
    buckets[index].values = Array.from(groups.entries()).filter(([key]) => numericHash(key, TABLE_SIZE) === index).map(([key, value]) => `${key}: ${value.join("/")}`);
    steps.push(step("Signature", `${word} has signature ${signature}.`, buckets, [index], [word], 1, { word, signature, groupSize: group.length }));
  });
  return steps;
}

function buildSubarraySteps(items: string[], target: string) {
  const nums = items.map((item) => Number(item) || 0);
  const k = Number(target) || 10;
  const buckets = emptyBuckets(9);
  const counts = new Map<number, number>([[0, 1]]);
  buckets[0].values.push("0:1");
  const steps = [step("Start", `Count subarrays with sum ${k} using prefix sums.`, buckets, [0], ["0"], 0, { prefix: 0, k })];
  let prefix = 0;
  let answer = 0;
  nums.forEach((value, i) => {
    prefix += value;
    const need = prefix - k;
    answer += counts.get(need) || 0;
    steps.push(step("Query", `prefix=${prefix}. Need previous prefix ${need}.`, buckets, [numericHash(String(need), buckets.length)], [String(need)], 1, { i, value, prefix, need, answer }, answer));
    counts.set(prefix, (counts.get(prefix) || 0) + 1);
    const index = numericHash(String(prefix), buckets.length);
    buckets[index].values = Array.from(counts.entries()).filter(([key]) => numericHash(String(key), buckets.length) === index).map(([key, count]) => `${key}:${count}`);
    steps.push(step("Store", `Store prefix ${prefix}.`, buckets, [index], [String(prefix)], 3, { prefix, count: counts.get(prefix) || 0, answer }, answer));
  });
  return steps;
}

function buildRollingSteps(items: string[], target: string) {
  const text = items.join("");
  const pattern = target || "abra";
  const buckets = emptyBuckets(10);
  const steps = [step("Start", `Search pattern "${pattern}" in "${text}" using rolling hash.`, buckets, [], [], 0, { pattern })];
  const base = 31;
  const mod = 101;
  const hashString = (value: string) => value.split("").reduce((hash, char) => (hash * base + char.charCodeAt(0)) % mod, 0);
  const patternHash = hashString(pattern);
  for (let i = 0; i + pattern.length <= text.length; i++) {
    const window = text.slice(i, i + pattern.length);
    const hash = hashString(window);
    const index = hash % buckets.length;
    buckets[index].values = [`${window}:${hash}`];
    const match = hash === patternHash && window === pattern;
    steps.push(step("Window", `Window "${window}" has hash ${hash}${match ? " and matches" : ""}.`, buckets, [index], [window], match ? 2 : 1, { i, hash, patternHash }, match ? i : null));
  }
  return steps;
}

function buildCacheSteps(items: string[]) {
  const buckets = emptyBuckets(5);
  const recent: string[] = [];
  const capacity = 3;
  const steps = [step("Start", "LRU cache uses a hash map plus recency order.", buckets, [], [], 0, { capacity })];
  items.forEach((item) => {
    const existing = recent.indexOf(item);
    if (existing >= 0) recent.splice(existing, 1);
    recent.unshift(item);
    let evicted = "none";
    if (recent.length > capacity) evicted = recent.pop() || "none";
    buckets.forEach((bucket) => { bucket.values = []; });
    recent.forEach((key) => buckets[numericHash(key, buckets.length)].values.push(key));
    steps.push(step(existing >= 0 ? "Get/refresh" : "Put", evicted === "none" ? `Move ${item} to most recent.` : `Insert ${item} and evict ${evicted}.`, buckets, [numericHash(item, buckets.length)], [item], evicted === "none" ? 1 : 2, { recent: recent.join(" -> "), evicted }));
  });
  return steps;
}

function buildCompressionSteps(items: string[]) {
  const values = items.map((item) => Number(item) || 0);
  const unique = [...new Set(values)].sort((a, b) => a - b);
  const buckets = emptyBuckets(unique.length || 1);
  const steps = [step("Sort unique", `Unique sorted values: ${unique.join(", ")}.`, buckets, [], [], 0, { unique: unique.length })];
  values.forEach((value) => {
    const rank = unique.indexOf(value);
    buckets[rank].values.push(`${value}->${rank}`);
    steps.push(step("Rank", `${value} compresses to rank ${rank}.`, buckets, [rank], [String(value)], 1, { value, rank }, rank));
  });
  return steps;
}

function buildBitmaskSteps(items: string[]) {
  const buckets = emptyBuckets(8);
  const steps = [step("Start", "Toggle bits to create a compact hash key.", buckets, [], [], 0, { mask: 0 })];
  let mask = 0;
  items.join("").split("").slice(0, 10).forEach((char) => {
    const bit = char.charCodeAt(0) % 5;
    mask ^= 1 << bit;
    const index = mask % buckets.length;
    buckets[index].values = [`mask ${mask}`];
    steps.push(step("Toggle", `Read ${char}; toggle bit ${bit}; mask becomes ${mask}.`, buckets, [index], [char], 1, { char, bit, mask }, mask));
  });
  return steps;
}

function buildStlSteps(items: string[], profile: Profile) {
  const buckets = emptyBuckets();
  const steps = [step("Start", "Model unordered_map / unordered_set operations.", buckets, [], [], 0, { container: profile.title })];
  items.forEach((item, i) => {
    const index = numericHash(item, TABLE_SIZE);
    const old = buckets[index].values.find((value) => value.startsWith(`${item}:`));
    if (old) {
      const count = Number(old.split(":")[1]) + 1;
      buckets[index].values = buckets[index].values.map((value) => value.startsWith(`${item}:`) ? `${item}:${count}` : value);
    } else {
      buckets[index].values.push(`${item}:1`);
    }
    steps.push(step("Container op", `Insert/update key ${item}.`, buckets, [index], [item], 1, { i, key: item, bucket: index }));
  });
  steps.push(step("Iterate", "Iterate through stored key-value pairs.", buckets, buckets.map((bucket) => bucket.index), [], 3, { buckets: buckets.length }));
  return steps;
}

function buildSteps(profile: Profile, items: string[], target: string) {
  if (["table", "chaining", "linear", "quadratic", "double", "rehash", "concept"].includes(profile.kind)) return buildTableSteps(items, profile);
  if (profile.kind === "frequency") return buildFrequencySteps(items, profile);
  if (profile.kind === "set") return buildSetSteps(items, profile);
  if (profile.kind === "pair") return buildPairSteps(items, target, profile);
  if (profile.kind === "subarray") return buildSubarraySteps(items, target);
  if (profile.kind === "rolling") return buildRollingSteps(items, target);
  if (profile.kind === "cache") return buildCacheSteps(items);
  if (profile.kind === "compression") return buildCompressionSteps(items);
  if (profile.kind === "bitmask") return buildBitmaskSteps(items);
  return buildStlSteps(items, profile);
}

function clampItems(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean).slice(0, 10);
}

export function getHashingSimulationKind(lessonId: string) {
  return kindFromSlug(lessonId);
}

export default function HashingLessonLab({ lessonId, title }: { lessonId: string; title?: string }) {
  const profile = useMemo(() => profileForLesson(lessonId, title), [lessonId, title]);
  const [items, setItems] = useState(profile.defaultItems);
  const [target, setTarget] = useState(profile.target);
  const [valueInput, setValueInput] = useState("21");
  const [indexInput, setIndexInput] = useState("0");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const steps = useMemo(() => buildSteps(profile, items, target), [items, profile, target]);
  const current = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  const resetTrace = useCallback(() => {
    setStepIndex(0);
    setPlaying(false);
  }, []);

  const mutateItems = useCallback((nextItems: string[]) => {
    setItems(clampItems(nextItems));
    resetTrace();
  }, [resetTrace]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStepIndex((index) => {
        if (index >= steps.length - 1) {
          setPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, 820);
    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  const insertItem = () => {
    const index = Math.max(0, Math.min(items.length, Number(indexInput) || 0));
    mutateItems([...items.slice(0, index), valueInput, ...items.slice(index)]);
  };

  const editItem = () => {
    const index = Math.max(0, Math.min(items.length - 1, Number(indexInput) || 0));
    mutateItems(items.map((item, i) => (i === index ? valueInput : item)));
  };

  const deleteItem = () => {
    const index = Math.max(0, Math.min(items.length - 1, Number(indexInput) || 0));
    mutateItems(items.filter((_, i) => i !== index));
  };

  const randomize = () => mutateItems(Array.from({ length: 7 }, () => String(Math.floor(Math.random() * 80) + 5)));

  const onDropItem = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...items];
    const [moving] = next.splice(dragIndex, 1);
    next.splice(index, 0, moving);
    mutateItems(next);
    setDragIndex(null);
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.shell}>
          <div style={styles.eyebrow}>Hashing</div>
          <h1 style={styles.h1}>{profile.title}</h1>
          <p style={styles.intro}>{profile.definition}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
            {[["Kind", profile.kind], ["Time", profile.time], ["Space", profile.space], ["Steps", steps.length]].map(([label, value]) => (
              <div key={label} style={{ ...styles.panel, minWidth: 145, padding: "12px 16px" }}>
                <div style={styles.label}>{label}</div>
                <div style={{ marginTop: 4, fontSize: 18, fontWeight: 900 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.body}>
        <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={styles.panel}>
            <div style={styles.label}>Keys</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              <input aria-label="Value" value={valueInput} onChange={(event) => setValueInput(event.target.value)} style={styles.input} />
              <input aria-label="Index" value={indexInput} onChange={(event) => setIndexInput(event.target.value)} style={styles.input} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
              <button title="Insert" onClick={insertItem} style={styles.iconButton}><Plus size={16} /></button>
              <button title="Edit" onClick={editItem} style={styles.iconButton}><Pencil size={16} /></button>
              <button title="Delete" onClick={deleteItem} style={styles.iconButton}><Trash2 size={16} /></button>
            </div>
            <button onClick={randomize} style={{ ...styles.button, width: "100%", marginTop: 10 }}><Shuffle size={15} /> Random Numbers</button>
          </div>

          <div style={styles.panel}>
            <div style={styles.label}>Target / Pattern</div>
            <input value={target} onChange={(event) => { setTarget(event.target.value); resetTrace(); }} style={{ ...styles.input, marginTop: 12 }} />
            <div style={{ marginTop: 12, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.55 }}>
              {current.result === null || current.result === undefined ? "No result locked yet." : `Current result: ${current.result}`}
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.label}>Playback</div>
            <p style={{ minHeight: 68, margin: "12px 0 16px", color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.55 }}>{current.message}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button title="Reset" onClick={resetTrace} style={styles.iconButton}><RotateCcw size={16} /></button>
              <button title="Previous" onClick={() => setStepIndex((index) => Math.max(0, index - 1))} style={styles.iconButton}><ChevronLeft size={16} /></button>
              <button title={playing ? "Pause" : "Play"} onClick={() => setPlaying((value) => !value)} style={{ ...styles.iconButton, background: "var(--accent-vibrant)", color: "var(--bg-primary)" }}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
              <button title="Next" onClick={() => setStepIndex((index) => Math.min(steps.length - 1, index + 1))} style={styles.iconButton}><ChevronRight size={16} /></button>
            </div>
          </div>
        </aside>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div style={{ ...styles.card, padding: 18 }}>
            <div style={styles.label}>Input Keys</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              {items.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => onDropItem(index)}
                  style={{ border: "1px solid var(--border-color)", background: current.activeKeys.includes(item) ? "var(--accent-soft)" : "var(--bg-primary)", borderRadius: 6, padding: "10px 12px", cursor: "grab", fontWeight: 900, minWidth: 56, textAlign: "center" }}
                  title="Drag to reorder"
                >
                  {item}
                  <div style={{ color: "var(--text-secondary)", fontSize: 10, marginTop: 4 }}>[{index}]</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...styles.card, padding: 18 }}>
            <div style={styles.label}>Hash Table / State</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(128px, 1fr))", gap: 10, marginTop: 14 }}>
              {current.buckets.map((bucket) => (
                <div key={bucket.index} style={{ border: `2px solid ${current.activeBuckets.includes(bucket.index) ? "var(--accent-vibrant)" : "var(--border-color)"}`, borderRadius: 8, background: "var(--bg-primary)", minHeight: 104, overflow: "hidden" }}>
                  <div style={{ borderBottom: "1px solid var(--border-color)", padding: "8px 10px", fontSize: 11, fontWeight: 900, color: "var(--text-secondary)" }}>bucket {bucket.index}</div>
                  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                    {bucket.values.length === 0 ? <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>empty</span> : bucket.values.map((value, i) => (
                      <span key={`${value}-${i}`} style={{ border: "1px solid var(--border-color)", borderRadius: 6, padding: "5px 7px", fontSize: 12, fontWeight: 800, background: current.activeKeys.some((key) => value.includes(key)) ? "var(--accent-soft)" : "var(--bg-secondary)" }}>{value}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 380px)", gap: 16 }}>
            <div style={{ ...styles.card, padding: 18 }}>
              <div style={styles.label}>Step Timeline</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 330, overflowY: "auto", marginTop: 14 }}>
                {steps.map((item, index) => (
                  <button key={`${item.label}-${index}`} onClick={() => { setStepIndex(index); setPlaying(false); }} style={{ textAlign: "left", borderRadius: 6, border: "1px solid var(--border-color)", background: index === stepIndex ? "var(--accent-soft)" : "var(--bg-primary)", color: "var(--text-primary)", padding: "10px 12px", cursor: "pointer" }}>
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
              <div style={styles.label}>Code + Variables</div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                {profile.code.map((line, index) => (
                  <div key={line} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 8, padding: "6px 8px", borderRadius: 6, background: index === current.line ? "var(--accent-soft)" : "transparent", fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", fontSize: 12 }}>
                    <span style={{ color: "var(--text-secondary)" }}>{index + 1}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, borderTop: "1px solid var(--border-color)", paddingTop: 14, display: "grid", gap: 8 }}>
                {Object.entries(current.vars).map(([key, value]) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                    <span style={{ color: "var(--text-secondary)", fontWeight: 800 }}>{key}</span>
                    <span style={{ fontWeight: 900 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
