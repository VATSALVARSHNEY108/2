import os
import re

directory = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\problem-solving-basics"

LESSON_LOGIC = {
    "ad-hoc": [
        "Read unconventional problem constraints",
        "Look for specific math properties",
        "Identify if it's a 'just do it' problem",
        "Handle edge cases (0, 1, negatives)",
        "Implement custom logic",
        "Verify against sample inputs"
    ],
    "array-manipulation": [
        "Initialize result array/variables",
        "Traverse through array elements",
        "Apply transformation logic",
        "Update pointers or counters",
        "Check boundary conditions",
        "Return modified array/result"
    ],
    "backtracking": [
        "Define state and base case",
        "Explore current decision",
        "Recurse into subproblem",
        "Backtrack: undo the decision",
        "Try next possible option",
        "Collect results from branches"
    ],
    "basic-mathematics": [
        "Identify the mathematical formula",
        "Check for integer overflow",
        "Apply modular arithmetic if needed",
        "Optimize calculation using math properties",
        "Handle division by zero or negatives",
        "Return the computed value"
    ],
    "best-average-worst": [
        "Identify worst-case input scenario",
        "Calculate total operations for worst-case",
        "Analyze best-case shortcut scenarios",
        "Derive average case based on distribution",
        "Express as Big-O, Omega, and Theta",
        "Select algorithm based on constraints"
    ],
    "binary-number": [
        "Convert decimal to binary representation",
        "Perform bitwise operations (AND, OR, XOR)",
        "Apply bit-shifting logic",
        "Check parity or set-bit count",
        "Handle negative numbers (2's complement)",
        "Convert back or return bit property"
    ],
    "binary-search": [
        "Define search space [low, high]",
        "Calculate mid-point safely",
        "Compare mid with target value",
        "If match: return mid index",
        "If target < mid: reduce high to mid-1",
        "If target > mid: increase low to mid+1",
        "Repeat until space is empty"
    ],
    "bit-manipulation": [
        "Identify bitmask requirements",
        "Isolate target bits using masking",
        "Modify bits (set, clear, toggle)",
        "Use bitwise identities for optimization",
        "Handle sign bit considerations",
        "Verify output bit-pattern"
    ],
    "breaking-problems": [
        "Analyze main problem complexity",
        "Identify independent sub-tasks",
        "Define inputs/outputs for each sub-task",
        "Solve sub-problems individually",
        "Combine results into main solution",
        "Verify end-to-end integration"
    ],
    "brute-force": [
        "Generate all possible candidates",
        "Check if candidate satisfies constraints",
        "If valid, update optimal solution",
        "Continue until search space exhausted",
        "Handle 'time limit exceeded' warnings",
        "Use as baseline for optimization"
    ],
    "code-readability": [
        "Use descriptive variable names",
        "Decompose logic into functions",
        "Add comments for non-obvious logic",
        "Maintain consistent indentation",
        "Avoid deeply nested loops",
        "Refactor complex boolean expressions"
    ],
    "competitive-programming": [
        "Read input quickly (Fast I/O)",
        "Analyze Time Limit and Memory Limit",
        "Pick most efficient data structure",
        "Implement optimized algorithm",
        "Test against large constraints",
        "Submit and check for TLE/MLE/WA"
    ],
    "constructive": [
        "Analyze required output properties",
        "Identify small patterns for base cases",
        "Build a general construction logic",
        "Prove the construction works for all N",
        "Handle parity or special constraints",
        "Implement the construction directly"
    ],
    "debugging": [
        "Reproduce the bug with failing test",
        "Dry run the logic on paper",
        "Insert print/log statements",
        "Use a debugger to trace variables",
        "Isolate the faulty code segment",
        "Fix and verify against all tests"
    ],
    "divide-and-conquer": [
        "Divide problem into smaller subproblems",
        "Conquer subproblems recursively",
        "Define base cases for recursion",
        "Combine subproblem solutions",
        "Analyze recurrence relation",
        "Verify overall complexity"
    ],
    "dry-run": [
        "Take a small, valid input",
        "List all variables and their values",
        "Follow code line by line",
        "Update variable states in each step",
        "Verify output against expected result",
        "Identify logical flaws in flow"
    ],
    "edge-case": [
        "Check minimum constraints (e.g., N=0, N=1)",
        "Check maximum constraints (e.g., N=10^9)",
        "Handle empty inputs or null states",
        "Handle duplicates or all-identical inputs",
        "Test with negative or zero values",
        "Ensure no overflow or underflow"
    ],
    "factors-and-multiples": [
        "Find divisors of N using sqrt(N) loop",
        "Identify prime factorization",
        "Calculate LCM/GCD for set of numbers",
        "Apply Sieve for multiple numbers",
        "Handle divisibility rule logic",
        "Return factor count or properties"
    ],
    "flowcharts": [
        "Start/End node initialization",
        "Identify decision points (diamonds)",
        "Map process steps (rectangles)",
        "Trace input/output flow (parallelograms)",
        "Connect nodes with directed arrows",
        "Validate logic flow for all paths"
    ],
    "frequency-counting": [
        "Initialize frequency map/array",
        "Iterate through input collection",
        "Increment count for each element",
        "Query map for specific counts",
        "Find mode or most frequent item",
        "Return counts or frequency distribution"
    ],
    "gcd-and-lcm": [
        "Apply Euclidean Algorithm for GCD",
        "Use GCD(a, b) = GCD(b, a % b)",
        "Base Case: if b is 0, return a",
        "Calculate LCM using (a * b) / GCD(a, b)",
        "Handle zero inputs cautiously",
        "Return computed GCD and LCM"
    ],
    "greedy": [
        "Identify local optimal choice",
        "Verify if local choice leads to global",
        "Sort data based on greedy criterion",
        "Iteratively pick best available option",
        "Update remaining requirements",
        "Return the accumulated result"
    ],
    "hashing": [
        "Select appropriate hash function",
        "Map keys to table indices",
        "Handle collisions (chaining/probing)",
        "Perform O(1) average lookups",
        "Manage load factor and resizing",
        "Return stored value or existence"
    ],
    "implementation": [
        "Translate problem logic to code",
        "Handle multi-step requirements",
        "Maintain clean state variables",
        "Manage input/output formatting",
        "Test with various sample cases",
        "Optimize implementation details"
    ],
    "input-optimization": [
        "Use fast scan/read methods",
        "Avoid unnecessary memory allocations",
        "Optimize data reading loop",
        "Check for large input bottlenecks",
        "Use buffered input streams",
        "Minimize overhead in pre-processing"
    ],
    "input-output": [
        "Analyze input format and types",
        "Parse structured input strings",
        "Format output as per requirements",
        "Handle trailing spaces or newlines",
        "Verify precision for floating points",
        "Process multiple test cases efficiently"
    ],
    "iterative": [
        "Define loop initialization",
        "Set termination condition",
        "Update loop variables per step",
        "Maintain loop invariants",
        "Translate recursive logic to iterative",
        "Optimize for memory (avoid stack)"
    ],
    "logical": [
        "Verify premises and conclusions",
        "Apply boolean logic (AND, OR, NOT)",
        "Draw truth tables for complex conditions",
        "Eliminate impossible scenarios",
        "Deduce solution from available facts",
        "Verify consistency of logic flow"
    ],
    "mathematical-observation": [
        "Solve small cases manually",
        "Write down result sequence",
        "Look for arithmetic/geometric trends",
        "Formulate a conjecture (hypothesis)",
        "Prove the conjecture using induction",
        "Implement optimized math formula"
    ],
    "matrix-traversal": [
        "Define row and column boundaries",
        "Pick traversal path (Row, Col, Spiral)",
        "Iterate through 2D array cells",
        "Handle boundary checks (out of bounds)",
        "Maintain current cell coordinates",
        "Process or collect cell values"
    ],
    "modular-arithmetic": [
        "Apply (A+B)%M = (A%M + B%M)%M",
        "Apply (A*B)%M = (A%M * B%M)%M",
        "Handle negative results: (A-B+M)%M",
        "Calculate modular inverse if needed",
        "Use big powers (Binary Exponentiation)",
        "Avoid intermediate overflow"
    ],
    "number-properties": [
        "Identify parity (Even/Odd)",
        "Check for Prime/Composite status",
        "Analyze digit-level properties",
        "Check for Perfect Square/Cube",
        "Apply Number Theory theorems",
        "Return specific property flags"
    ],
    "optimization": [
        "Identify bottleneck in current code",
        "Reduce time complexity (O(N^2) to O(N))",
        "Reduce space complexity",
        "Apply caching or memoization",
        "Eliminate redundant computations",
        "Measure performance improvements"
    ],
    "optimized-approach": [
        "Think beyond the brute force",
        "Identify data structure improvements",
        "Apply divide and conquer or DP",
        "Use pre-computation or prefix sums",
        "Trade space for time where possible",
        "Select best-fit algorithm for constraints"
    ],
    "overflow": [
        "Identify variables nearing limit",
        "Use 'long long' instead of 'int'",
        "Apply modular arithmetic early",
        "Check intermediate product results",
        "Handle potential negative overflows",
        "Verify against largest test cases"
    ],
    "pattern-recognition": [
        "Identify recurring sequences",
        "Map input to known algorithmic patterns",
        "Look for symmetries in the problem",
        "Simplify the problem to 1D/2D",
        "Use drawing or tabular visualization",
        "Match pattern to optimal solution"
    ],
    "practice-strategy": [
        "Solve problems in increasing difficulty",
        "Focus on weak topics systematically",
        "Upsolve problems from contests",
        "Time yourself during practice",
        "Read editorial after attempting",
        "Maintain a coding journal/notes"
    ],
    "prefix-sum": [
        "Initialize prefix sum array (P[0]=0)",
        "P[i] = P[i-1] + arr[i-1]",
        "Calculate Range Sum: P[R+1] - P[L]",
        "Use for O(1) query performance",
        "Extend to 2D matrices if needed",
        "Handle 0-based or 1-based indexing"
    ],
    "prime-numbers": [
        "Check primality using sqrt(N)",
        "Apply Sieve of Eratosthenes",
        "Perform Prime Factorization",
        "Count primes in a range",
        "Apply Goldbach or prime properties",
        "Generate prime sequences"
    ],
    "problem-solving-patterns": [
        "Identify pattern (Two Pointers, Window)",
        "Apply standardized template for pattern",
        "Adjust template for specific constraints",
        "Optimize common sub-tasks",
        "Handle common edge cases for pattern",
        "Verify against known sample cases"
    ],
    "problem-understanding": [
        "Read problem statement twice",
        "Underline key constraints and types",
        "Trace sample input to sample output",
        "Clarify ambiguous requirements",
        "Identify hidden assumptions",
        "Summarize problem in one sentence"
    ],
    "pseudocode": [
        "Write logic in high-level language",
        "Ignore syntax specific to C++/Java",
        "Focus on control flow and data",
        "Maintain logical indentation",
        "Define inputs and expected outputs",
        "Verify logic before actual coding"
    ],
    "recursive": [
        "Identify recursive sub-structure",
        "Define the Base Case(s)",
        "Express solution as Recurrence",
        "Trace recursion tree/stack",
        "Optimize with memoization if needed",
        "Ensure progress toward base case"
    ],
    "searching": [
        "Identify if data is sorted",
        "Apply Linear Search for unsorted",
        "Apply Binary Search for sorted/monotonic",
        "Implement Ternary Search for unimodal",
        "Handle 'element not found' case",
        "Return index or existence flag"
    ],
    "simulation": [
        "Initialize world/state state",
        "Implement rules of simulation",
        "Loop through time steps or events",
        "Update state based on interactions",
        "Check for termination conditions",
        "Collect final simulation metrics"
    ],
    "sliding-window": [
        "Initialize window [left, right]",
        "Expand window by moving right",
        "Update window state (sum, count)",
        "Contract window by moving left",
        "Maintain optimal window property",
        "Return best window result"
    ],
    "sorting": [
        "Choose appropriate sort (Merge, Quick)",
        "Define custom comparison logic",
        "Sort elements in desired order",
        "Handle stability requirements",
        "Optimize for nearly sorted data",
        "Verify sorted property at end"
    ],
    "stl-basics": [
        "Identify required STL container",
        "Use Vector for dynamic arrays",
        "Use Map/Set for lookups",
        "Apply STL algorithms (sort, search)",
        "Manage iterators correctly",
        "Optimize with reserve/unordered"
    ],
    "string-manipulation": [
        "Handle character encoding/ASCII",
        "Traverse or reverse string data",
        "Perform pattern matching or splits",
        "Modify strings (replace, concat)",
        "Handle whitespace and case sensitivity",
        "Return modified string or result"
    ],
    "test-case": [
        "Generate random small test cases",
        "Generate corner cases manually",
        "Use a script for large test cases",
        "Compare brute force vs optimized output",
        "Verify constraints compliance",
        "Identify failing patterns"
    ],
    "two-pointer": [
        "Initialize left and right pointers",
        "Move pointers toward each other",
        "Or move both in same direction",
        "Check condition at each step",
        "Update result based on pointers",
        "Stop when pointers meet/cross"
    ],
}

def get_logic(filename):
    for key, logic in LESSON_LOGIC.items():
        if key in filename:
            return logic
    return [
        "Analyze Problem Constraints",
        "Initialize State Variables",
        "Process Input Sequence",
        "Apply Algorithmic Logic",
        "Handle Boundary Conditions",
        "Verify Final Result"
    ]

def update_file(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has custom MinimalSimulationStudio
    if 'code={[' in content and 'title="' in content:
        print(f"Skipping {filename} - already customized.")
        return

    logic = get_logic(filename)
    title = filename.replace('.tsx', '').replace('-', ' ').title()
    
    code_str = 'code={[' + ',\n          '.join(f'"{line}"' for line in logic) + '\n        ]}'
    replacement = f'<MinimalSimulationStudio \n        title="{title}"\n        {code_str}\n      />'
    
    # Handle both <MinimalSimulationStudio /> and <MinimalSimulationStudio type="..." />
    pattern = r'<MinimalSimulationStudio\s*(type="[^"]*")?\s*/>'
    
    match = re.search(pattern, content)
    if match:
        type_attr = match.group(1)
        if type_attr:
            # If it's a complexity type, we keep it as is or merge?
            # User said "all simulations", and I've updated the component to handle both.
            # But ComplexityPlotter doesn't use 'code'. 
            # So I'll only update non-complexity ones or add code anyway.
            if 'complexity' in type_attr:
                print(f"Skipping {filename} - it is a complexity plotter.")
                return
        
        new_content = re.sub(pattern, replacement, content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        update_file(os.path.join(directory, filename))
