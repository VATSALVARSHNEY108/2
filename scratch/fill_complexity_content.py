import os
import re

directory = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\time-space-complexity"

COMPLEXITY_DATA = {
    "amortized": {
        "title": "Amortized Complexity",
        "desc": "Analysis that averages the time of an operation over a long sequence of operations, accounting for occasional 'expensive' steps like dynamic array resizing.",
        "highlights": [
            ("Average Focus", "Look at the cost of a series of operations rather than a single isolated one.", "Clock"),
            ("Expensive Steps", "Some operations (like push back with resize) are rare but costly.", "Zap"),
            ("Guaranteed Perf", "Ensures that over N operations, the total time remains predictable.", "ShieldCheck")
        ],
        "logic": ["Push element to array", "Check if array is full", "If full: double the capacity", "Copy elements to new array", "Add new element", "Final amortized cost: O(1)"]
    },
    "auxiliary": {
        "title": "Auxiliary Space",
        "desc": "Extra space or temporary space used by an algorithm, excluding the space taken by inputs. Crucial for measuring true algorithm memory overhead.",
        "highlights": [
            ("Extra Memory", "Focuses only on the temporary variables and recursion stack used.", "Database"),
            ("Input Isolation", "Space used by input itself is ignored to analyze algorithm efficiency.", "Target"),
            ("Recursion Stack", "Important for recursive algorithms where stack frames consume space.", "Layers")
        ],
        "logic": ["Initialize input array", "Declare temp variables", "Call recursive function", "Track depth of stack", "Deallocate variables", "Measure total temporary space"]
    },
    "big-o": {
        "title": "Big O Notation",
        "desc": "Formal mathematical notation that describes the upper bound of an algorithm's complexity, focusing on the worst-case scenario as input size grows.",
        "highlights": [
            ("Worst Case", "Represents the maximum time an algorithm can take for any input.", "AlertTriangle"),
            ("Upper Bound", "Mathematical 'ceiling' that the algorithm's runtime will never exceed.", "TrendingUp"),
            ("Asymptotic", "Focuses on growth rate (N) while ignoring constant factors.", "Activity")
        ],
        "logic": ["Analyze nested loop count", "Identify dominant term", "Drop constant multipliers", "Drop lower-order terms", "Express as O(N^k)"]
    },
    "big-omega": {
        "title": "Big Omega Notation",
        "desc": "Describes the lower bound of an algorithm's growth rate. It represents the 'best-case' scenario or the minimum resource consumption for an input.",
        "highlights": [
            ("Lower Bound", "The theoretical minimum time an algorithm needs to complete.", "ArrowDown"),
            ("Best Case", "Usually occurs when the input is already in the target state.", "Zap"),
            ("Performance Floor", "Guarantees that the algorithm won't be faster than this bound.", "Shield")
        ],
        "logic": ["Find best-case input", "Measure execution steps", "Identify growth function", "Verify lower bound", "Express as Ω(f(N))"]
    },
    "big-theta": {
        "title": "Big Theta Notation",
        "desc": "Provides a tight bound on the growth rate, meaning the algorithm's complexity is sandwiched between a lower and upper bound of the same order.",
        "highlights": [
            ("Tight Bound", "Means the Big O and Big Omega orders are the same.", "Lock"),
            ("Exact Growth", "Gives the most accurate representation of an algorithm's performance.", "Target"),
            ("Sandwich Effect", "Algorithm growth is bounded both above and below by f(N).", "Activity")
        ],
        "logic": ["Verify Big O = f(N)", "Verify Big Omega = f(N)", "Check constants c1, c2", "Confirm tight bound", "Express as Θ(f(N))"]
    },
    "constant-time": {
        "title": "O(1) // Constant Time",
        "desc": "The algorithm's performance is independent of input size. No matter how large N gets, the time taken remains exactly the same.",
        "highlights": [
            ("Size Invariant", "Execution time does not change as input grows from 1 to 1 billion.", "Clock"),
            ("Direct Access", "Array indexing and hash table lookups are classic examples.", "Zap"),
            ("Maximum Speed", "The holy grail of algorithmic performance.", "Sparkles")
        ],
        "logic": ["Receive input array", "Access element at index 0", "Perform fixed math operation", "Return result", "Operations: 1"]
    },
    "linear-time": {
        "title": "O(N) // Linear Time",
        "desc": "Execution time grows proportionally with input size. If input doubles, the time taken also doubles. Common in single-pass traversals.",
        "highlights": [
            ("Direct Growth", "Linear relationship between input size and processing time.", "TrendingUp"),
            ("Single Pass", "Typical of 'for' loops that visit every element once.", "Repeat"),
            ("Efficiency", "Generally considered highly efficient for large datasets.", "Check")
        ],
        "logic": ["Iterate from 0 to N", "Process current element", "Increment counter", "Loop finishes at N", "Total ops: N"]
    },
    "quadratic-time": {
        "title": "O(N²) // Quadratic Time",
        "desc": "Execution time grows as the square of input size. Often seen in algorithms with nested loops over the same dataset.",
        "highlights": [
            ("Steep Growth", "Small increases in input lead to significant time jumps.", "Activity"),
            ("Nested Loops", "Typically 'for i in N' containing 'for j in N'.", "Layers"),
            ("Limit", "Unsuitable for extremely large datasets (N > 10,000).", "AlertCircle")
        ],
        "logic": ["Outer loop: 0 to N", "Inner loop: 0 to N", "Compare elements [i][j]", "Ops: N * N", "Result: O(N²)"]
    },
    "logarithmic-time": {
        "title": "O(log N) // Logarithmic Time",
        "desc": "Execution time increases slowly as input grows. This usually occurs in algorithms that divide the problem space in half at each step.",
        "highlights": [
            ("Fast Search", "Extremely efficient for very large datasets.", "Zap"),
            ("Divide & Conquer", "Divide search space by 2 in every iteration.", "Minimize"),
            ("Inverse Power", "Base-2 logarithm growth rate.", "Activity")
        ],
        "logic": ["Initialize low=0, high=N", "Calculate mid", "Discard half of space", "Repeat until found", "Steps: log2(N)"]
    },
    "exponential-time": {
        "title": "O(2^N) // Exponential Time",
        "desc": "Execution time doubles with every addition to the input size. Extremely slow and usually restricted to small N.",
        "highlights": [
            ("Explosive Growth", "Time grows incredibly fast even for tiny N.", "Activity"),
            ("All Subsets", "Generating all possible subsets of a set takes 2^N.", "Layers"),
            ("Unfeasible", "Avoid in production unless N is very small (< 30).", "XCircle")
        ],
        "logic": ["Recurse with N-1", "Recurse with N-2", "Combine results", "Ops: 2^N", "Example: Fibonacci"]
    }
}

DEFAULT_LOGIC = ["Analyze input size N", "Count basic operations", "Identify dominant loops", "Estimate growth rate", "Drop constants", "Express in Big-O notation"]

def get_data(filename):
    for key, data in COMPLEXITY_DATA.items():
        if key in filename:
            return data
    return None

def update_file(filepath):
    filename = os.path.basename(filepath)
    data = get_data(filename)
    lesson_title = data['title'] if data else filename.replace('.tsx', '').replace('-', ' ').title()
    description = data['desc'] if data else "Understanding the efficiency and scalability of algorithms as input size grows."
    logic = data['logic'] if data else DEFAULT_LOGIC
    highlights = data['highlights'] if data else [
        ("Time Complexity", "Measures how time scales with input size.", "Clock"),
        ("Space Complexity", "Measures how memory scales with input size.", "Database"),
        ("Asymptotic Analysis", "Focuses on large-scale growth rates.", "TrendingUp")
    ]

    lucide_imports = ["Clock", "Zap", "Target", "Activity", "ShieldCheck", "Sparkles", "Database", "Layers", "TrendingUp", "AlertTriangle", "ArrowDown", "Shield", "Lock", "Repeat", "AlertCircle", "Minimize", "XCircle"]
    
    template = f"""\"use client\";
import React from "react";
import {{ {", ".join(lucide_imports)} }} from "lucide-react";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function {lesson_title.replace(' ', '').replace('//', '').replace('(', '').replace(')', '').replace('O(N)', 'Linear').replace('O(1)', 'Constant').replace('O(N²)', 'Quadratic')}Lesson() {{
  const highlights = [
    {{ 
      title: "{highlights[0][0]}", 
      desc: "{highlights[0][1]}",
      icon: <{highlights[0][2]} size={{18}} className="text-amber-500" />,
      bg: "rgba(245, 158, 11, 0.05)"
    }},
    {{ 
      title: "{highlights[1][0]}", 
      desc: "{highlights[1][1]}",
      icon: <{highlights[1][2]} size={{18}} className="text-indigo-500" />,
      bg: "rgba(99, 102, 241, 0.05)"
    }},
    {{ 
      title: "{highlights[2][0]}", 
      desc: "{highlights[2][1]}",
      icon: <{highlights[2][2]} size={{18}} className="text-emerald-500" />,
      bg: "rgba(16, 185, 129, 0.05)"
    }}
  ];

  return (
    <div style={{{{ fontVariantNumeric: "tabular-nums", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}}}>
      <div style={{{{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}}}>
        <span style={{{{ 
          display: "inline-block", 
          background: "rgba(139,92,246,0.1)", 
          color: "#8b5cf6", 
          border: "1px solid rgba(139,92,246,0.2)", 
          padding: "4px 12px", 
          borderRadius: 100, 
          fontSize: 10, 
          fontFamily: "'Syne', sans-serif", 
          fontWeight: 800, 
          letterSpacing: "0.1em", 
          textTransform: "uppercase" 
        }}}}>
          Complexity Analysis
        </span>
      </div>

      <h2 style={{{{ 
        fontFamily: "'Syne', sans-serif", 
        fontWeight: 800, 
        fontSize: 32, 
        letterSpacing: "-0.04em", 
        marginBottom: 12,
        lineHeight: 1.1
      }}}}>
        {lesson_title.split('//')[0].strip()} <span style={{{{ color: "#8b5cf6" }}}}>{lesson_title.split('//')[1].strip() if '//' in lesson_title else ""}</span>
      </h2>
      
      <p style={{{{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 600, marginBottom: 32 }}}}>
        {description}
      </p>

      <div style={{{{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}}}>
        {{highlights.map((h, i) => (
          <div key={{i}} style={{{{ 
            background: "var(--accent-soft)", 
            border: "1px solid var(--border-subtle)", 
            borderRadius: 16, 
            padding: 24,
            transition: "all 0.3s ease"
          }}}}>
            <div style={{{{ 
              width: 40, 
              height: 40, 
              borderRadius: 12, 
              background: h.bg, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              marginBottom: 16 
            }}}}>
              {{h.icon}}
            </div>
            <h4 style={{{{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8 }}}}>{{h.title}}</h4>
            <p style={{{{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}}}>{{h.desc}}</p>
          </div>
        ))}}
      </div>

      <MinimalSimulationStudio 
        type="complexity"
        title="{lesson_title.split('//')[0].strip()}"
        code={{[{', '.join(f'"{l}"' for l in logic)}]}}
      />

      <div style={{{{ 
        background: "rgba(139,92,246,0.05)", 
        border: "1px solid rgba(139,92,246,0.1)", 
        borderRadius: 20, 
        padding: 24,
        marginTop: 32
      }}}}>
        <div style={{{{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}}}>
          <Sparkles size={{16}} className="text-indigo-400" />
          <span style={{{{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.05em" }}}}>
            The Core Principle
          </span>
        </div>
        
        <p style={{{{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8 }}}}>
          Algorithmic analysis allows us to predict performance without hardware bias. By focusing on Big-O, 
          we ensure our solutions remain scalable as data grows exponentially.
        </p>
      </div>
    </div>
  );
}}
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(template)
    print(f"Generated {filename}")

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        update_file(os.path.join(directory, filename))
