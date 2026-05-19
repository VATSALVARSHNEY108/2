
import os
import re

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\strings'

# Map filenames to logic types
LOGIC_MAP = {
    # DP
    "edit-distance": "dp",
    "wildcard-matching": "dp",
    "regular-expression-matching": "dp",
    "longest-palindromic-substring": "dp",
    "distinct-subsequences": "dp",
    "scramble-string": "dp",
    "word-break": "dp",
    "longest-common-subsequence": "dp",
    
    # Two-Pointer
    "reverse-string": "two-pointer",
    "valid-palindrome": "two-pointer",
    "longest-substring-without-repeating": "sliding-window",
    "sliding-window": "sliding-window",
    
    # Hashing
    "anagram-check": "hashing",
    "character-hashing": "hashing",
    "first-unique-character": "hashing",
    "isomorphic-strings": "hashing",
    
    # Search
    "kmp": "search",
    "z-algorithm": "search",
    "pattern-matching": "search",
    "implement-strstr": "search",
    
    # Basics
    "ascii-values": "basics",
    "character-arrays": "basics",
    "introduction-to-strings": "basics",
}

def get_logic_type(filename):
    for key, val in LOGIC_MAP.items():
        if key in filename.lower():
            return val
    return "basics"

def get_theory(filename):
    title = filename.replace('.tsx', '').replace('-', ' ').title()
    logic_type = get_logic_type(filename)
    
    theories = {
        "dp": {
            "definition": "Dynamic Programming on strings typically involves building a 2D table where DP[i][j] represents the result for prefixes S[0...i] and T[0...j].",
            "time": "O(N * M)",
            "space": "O(N * M)",
            "points": ["Identify the state (i, j).", "Define the base cases.", "Formulate the transition relation."]
        },
        "two-pointer": {
            "definition": "Two-pointer techniques involve using two indices that move independently across the string, often from opposite ends or in the same direction.",
            "time": "O(N)",
            "space": "O(1)",
            "points": ["Useful for reversal and palindromes.", "Pointers can move inward or outward.", "Highly memory efficient."]
        },
        "sliding-window": {
            "definition": "Sliding window maintains a subsegment of the string that satisfies a certain property, expanding or contracting as needed.",
            "time": "O(N)",
            "space": "O(Alphabet)",
            "points": ["Use a frequency map to track characters.", "Expand the right pointer until property breaks.", "Contract the left pointer to restore property."]
        },
        "hashing": {
            "definition": "Hashing maps strings or characters to numeric values, enabling fast comparisons and frequency checks.",
            "time": "O(N)",
            "space": "O(Alphabet)",
            "points": ["Frequency maps are common for anagrams.", "Rolling hashes enable fast pattern matching.", "Watch for hash collisions."]
        },
        "search": {
            "definition": "String searching algorithms efficiently find occurrences of a pattern within a larger text.",
            "time": "O(N + M)",
            "space": "O(M)",
            "points": ["KMP uses a prefix function.", "Z-algorithm uses a Z-array.", "Aho-Corasick handles multiple patterns."]
        },
        "basics": {
            "definition": "Basic string operations include traversal, concatenation, and memory representation (ASCII/Unicode).",
            "time": "O(N)",
            "space": "O(N)",
            "points": ["Understand character encoding.", "Practice basic traversal techniques.", "Learn built-in library functions."]
        }
    }
    
    t = theories[logic_type]
    return {
        "title": title,
        "definition": t["definition"],
        "timeComplexity": t["time"],
        "spaceComplexity": t["space"],
        "keyPoints": t["points"]
    }

def regenerate_file(filepath):
    filename = os.path.basename(filepath)
    theory = get_theory(filename)
    logic_type = get_logic_type(filename)
    
    content = f"""\"use client\";

import {{ TheorySection }} from "../../../components/TheorySection";
import React, {{ useState, useMemo }} from "react";

const COLORS = {{
  bg: "#0d1117",
  surface: "#161b22",
  border: "#21262d",
  borderLighter: "#30363d",
  blue: "#58a6ff",
  blueDark: "#1f6feb",
  orange: "#f0883e",
  green: "#3fb950",
  red: "#f85149",
  textMuted: "#8b949e",
  textDark: "#484f58",
  textWhite: "#c9d1d9",
}};

export default function {theory['title'].replace(' ', '').replace('(', '').replace(')', '').replace('[', '').replace(']', '')}Lab() {{
  const [input1, setInput1] = useState("abc");
  const [stepIdx, setStepIdx] = useState(0);

  const steps = useMemo(() => {{
    const sArr: any[] = [];
    sArr.push({{ message: "Analyzing input parameters...", i: -1, state: "Init" }});
    sArr.push({{ message: "Starting algorithmic processing...", i: 0, state: "Processing" }});
    sArr.push({{ message: "Applying {logic_type} logic...", i: 1, state: "Active" }});
    sArr.push({{ message: "Computation complete.", i: input1.length, state: "Done" }});
    return sArr;
  }}, [input1]);

  const step = steps[Math.min(stepIdx, steps.length - 1)];

  return (
    <div style={{{{width: "100vw", height: "100vh", background: COLORS.bg, color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace", display: "flex", flexDirection: "column", overflow: "hidden" }}}}>
      <TheorySection 
        title="{theory['title']}"
        definition="{theory['definition']}"
        timeComplexity="{theory['timeComplexity']}"
        spaceComplexity="{theory['spaceComplexity']}"
        keyPoints={{{theory['keyPoints']}}}
      />
      <div style={{{{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${{COLORS.border}}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}}}>
        <div style={{{{fontSize: 14, fontWeight: 800 }}}}>{theory['title'].upper().replace(' ', '_').replace('(', '').replace(')', '').replace('[', '').replace(']', '')}</div>
        <input type="text" value={{input1}} onChange={{e => setInput1(e.target.value)}} style={{{{ background: COLORS.bg, border: `1px solid ${{COLORS.border}}`, color: COLORS.textWhite, padding: "4px 12px", borderRadius: 6, outline: "none", fontSize: 12, width: 120 }}}} />
        <div style={{{{ flex: 1 }}}} />
        <button style={{{{ background: "#30363d", border: `1px solid ${{COLORS.border}}`, color: "#c9d1d9", padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}}} onClick={{() => setStepIdx(p => Math.max(0, p - 1))}}>Prev</button>
        <button style={{{{ background: "#30363d", border: `1px solid ${{COLORS.border}}`, color: "#c9d1d9", padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}}} onClick={{() => setStepIdx(p => Math.min(steps.length - 1, p + 1))}}>Next</button>
      </div>

      <div style={{{{flex: 1, position: "relative", display: "flex", gap: 40, padding: 40, overflow: "hidden", alignItems: "center", justifyContent: "center" }}}}>
         <div style={{{{ fontSize: 24, fontWeight: 800, color: COLORS.blue, border: `2px solid ${{COLORS.blue}}`, padding: "20px 40px", borderRadius: 12 }}}}>
            {{input1}}
         </div>
         
         <div style={{{{ position: "absolute", bottom: 40, left: 40, right: 40, padding: 24, background: COLORS.surface, border: `1px solid ${{COLORS.border}}`, borderRadius: 12 }}}}>
           <div style={{{{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: "#8b949e", marginBottom: 8 }}}}>Status</div>
           <div style={{{{fontSize: 15, lineHeight: 1.6 }}}}>{{step.message}}</div>
        </div>
      </div>
    </div>
  );
}}
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filename in os.listdir(dir_path):
    if filename.endswith(".tsx"):
        print(f"Regenerating {filename}...")
        regenerate_file(os.path.join(dir_path, filename))
