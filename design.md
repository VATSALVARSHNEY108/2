# CoreCode Interactive Lesson Design

Use the Bellman-Ford lesson as the reference standard for new simulation lessons. The goal is a beautiful, high-clarity learning page where the definition, complexity, algorithm behavior, and interactive controls all feel like one polished product.

## Visual Theme

The default visual language is high-contrast black and white with carefully limited accent colors. Use CSS variables from the global theme instead of generic Tailwind colors.

Core surfaces:
- Page background: `var(--bg-primary)`
- Card and panel background: `var(--bg-secondary)` or `var(--bg-elevated)`
- Primary text: `var(--text-primary)`
- Secondary text: `var(--text-secondary)`
- Borders: `var(--border-color)` or `var(--border-subtle)`
- Primary accent: `var(--accent-vibrant)`
- Soft accent fill: `var(--accent-soft)`

Lessons may use algorithm-specific semantic accents only where they explain state:
- Blue or primary accent for active/current state
- Green for completed/reached/valid state
- Amber for selected, warning, or recently changed state
- Red for error, invalid state, or negative-cycle style alerts

The UI should work in both light and dark mode. Every major surface, text color, border, canvas grid, control, badge, and simulation state must remain readable in both modes.

## Page Structure

Each full simulation lesson should include:

1. Hero section
   - Topic eyebrow, such as `Graph Algorithms - SSSP`
   - Large lesson title
   - Clear definition in 2-4 lines
   - Time and space complexity tags
   - Primary action that jumps to the simulator

2. Concept guide
   - 3-4 short explanation cards
   - Cover why the algorithm exists, the core operation, edge cases, and performance
   - Keep text readable and practical, not textbook-heavy

3. Interactive simulator
   - Left control/status column
   - Large visual workspace
   - Step-by-step playback
   - Live state panels
   - Code tracker or pseudocode highlighter

## Educational Content Requirements

Every lesson should include:
- Definition of the topic or algorithm
- Why it is used
- Time complexity
- Space complexity
- Important edge cases
- Step-by-step explanation tied to the simulation state
- Pseudocode or code-tracking panel when the lesson is algorithmic

Complexity should be shown near the top of the page in compact tags:
- Time: example `O(V x E)`
- Space: example `O(V)`

The simulator should reinforce these values by showing the actual data being processed, such as distances, pointers, stacks, queues, arrays, or visited states.

## Simulation UX

The simulation should feel alive and directly manipulable.

Expected interaction features:
- Play, pause, previous step, next step, and reset
- Speed control slider
- Current-step explanation
- Highlighted active operation
- Visual state changes for selected, current, completed, warning, and error states
- Editable inputs where useful
- Clear empty, disabled, and invalid states

For graph-style simulations, support:
- Click background to add a node
- Drag nodes to reposition them
- Shift-drag or source-target selection to connect nodes
- Select and remove nodes or edges
- Right-click delete where appropriate
- Double-click edge weight or label to edit
- Source selector when the algorithm needs a start node

For non-graph lessons, use the same principle:
- Arrays should allow item editing/reordering when useful
- Linked lists should allow node dragging or pointer manipulation where useful
- Trees should allow node placement, insertion, deletion, and traversal playback
- Stack/queue lessons should show push/pop/enqueue/dequeue as animated state changes

## Draggable Panels

Simulation panels should be movable and resizable when they may cover the visualization.

Good draggable panels:
- Distance table
- Pointer table
- Current pass or iteration info
- Pseudocode tracker
- Memory/state inspector
- Explanation panel

Panel behavior:
- Header acts as the drag handle
- Cursor changes to grab/grabbing
- Panels include a resize handle in the bottom-right corner
- Cursor changes to resize when hovering the resize handle
- Resizing should support width and height where useful
- Panels must enforce minimum sizes so text, controls, and code lines do not collapse
- Panels should avoid growing beyond the visible simulation workspace
- Panels have translucent or elevated backgrounds
- Panels use blur/shadow lightly for separation
- Panel text remains readable in light and dark mode
- Panel positions stay inside the visible simulation area when possible
- Resized dimensions should remain stable during playback and step changes

## Canvas And Workspace

The main workspace should be the visual center of the lesson.

Style expectations:
- Large bordered simulation area
- Subtle grid or structured background when it helps placement
- Stable dimensions so controls do not jump
- Nodes, edges, labels, and state badges should not overlap badly
- Active elements should animate or glow subtly
- Hit areas should be larger than visible strokes for easy selection

Avoid making the simulator feel like a small card preview. It should feel like the main tool on the page.

## Controls

Controls should be compact, clear, and close to the simulation.

Use:
- Icon buttons for playback and reset
- Inputs/selects for editable values
- Sliders for speed
- Buttons for concrete commands such as add, join, remove, and reset
- Disabled states when an action is unavailable

Controls should use the lesson theme variables and avoid generic color utilities like `bg-blue-500`.

## Motion And Feedback

Animations should explain state, not decorate randomly.

Use motion for:
- Active edge/node/current pointer
- Newly relaxed or updated value
- Completed/reached state
- Playback step transitions
- Hover and focus feedback

Keep transitions short and calm, usually around `0.2s` to `0.3s`.

## Accessibility And Readability

The lesson must be readable and usable in both modes.

Requirements:
- Strong contrast for text and controls
- Visible focus/hover states
- No text overlap on mobile or desktop
- Responsive layout that stacks simulator controls above the canvas on smaller screens
- Buttons and interactive targets large enough to click comfortably
- Text labels for important values, not color alone

## Linked List Lesson Direction

Linked-list lessons should follow the same Bellman-Ford quality level.

For linked-list simulations:
- Show nodes as connected blocks with visible `data` and `next`/`prev` pointers
- Animate pointer changes during insertion, deletion, reversal, merge, cycle detection, and traversal
- Let users drag nodes or rearrange the workspace when useful
- Include a live pointer/state panel showing values like `head`, `tail`, `current`, `prev`, `slow`, `fast`, or `carry`
- Include a code tracker for algorithmic lessons
- Include definition, time complexity, and space complexity in the hero
- Support light and dark mode with the same variables

The result should look like a finished interactive teaching tool, not a placeholder page.

## Topic-Wise Simulation Plan

All DSA topics should share the same page quality as the Bellman-Ford lesson, but the simulator must match the concept being taught. Do not reuse graph visuals for every topic. Reuse the experience pattern: strong hero, definition, complexity, guide cards, interactive workspace, live state panels, draggable panels, playback, and code tracking.

### C++ Fundamentals

Purpose: teach syntax, memory, control flow, functions, OOP, and STL behavior with executable mental models.

UI direction:
- Code editor-style simulator with highlighted active line
- Output console panel
- Memory/state inspector panel
- Variable table showing name, type, value, and scope
- Stack frame panel for functions and recursion
- Step, run, reset, and speed controls

Best simulations:
- Variables and data types: memory cells update as assignments run
- Pointers: address arrows between variables and heap blocks
- Functions: call stack grows and shrinks
- Loops: iteration counter and condition result panel
- STL containers: visual vector, map, set, stack, queue, and priority queue operations

### Time And Space Complexity

Purpose: make growth rates visible instead of abstract.

UI direction:
- Graph/chart workspace with input size on x-axis and operations/memory on y-axis
- Complexity comparison controls
- Live operation counter
- Table of `n`, `n log n`, `n^2`, `2^n`, and `n!`
- Draggable code tracker panel showing which line dominates runtime

Best simulations:
- Loop counters for single, nested, and sequential loops
- Recursion tree expansion
- Memory bars for auxiliary space
- Compare brute force vs optimized approach side by side

### Arrays

Purpose: teach contiguous memory, indexing, traversal, updates, and array problem patterns.

UI direction:
- Horizontal indexed cells as the main canvas
- Pointer markers above or below cells
- Editable array values
- Active, compared, swapped, fixed, and answer states
- Live variables panel for `i`, `j`, `left`, `right`, `sum`, `max`, `window`

Best simulations:
- Traversal and searching: moving index pointer
- Two pointers: left/right markers converge
- Sliding window: shaded active range with sum/frequency panel
- Prefix sum: second row builds cumulative values
- Kadane's algorithm: current sum vs best sum tracker
- Sorting basics: compare and swap animation

### Strings

Purpose: teach character sequences, pattern matching, hashing, and substring windows.

UI direction:
- Character cells with indices
- Pattern row and text row alignment
- Highlight matched, mismatched, skipped, and active windows
- Frequency table or hash panel where needed
- Code tracker tied to pointer movement

Best simulations:
- Palindrome checks: two pointers moving inward
- KMP: prefix table construction and fallback jumps
- Rabin-Karp: rolling hash panel
- Sliding window: character frequency map updates
- Anagram/grouping: sorted key or hash bucket visualization

### Searching And Sorting

Purpose: reveal comparison, partitioning, ordering, and search-space reduction.

UI direction:
- Array bars or cells as the primary visual
- Range markers for low, mid, high
- Comparison counter and swap counter
- Recursion stack panel for divide-and-conquer sorts
- Playback controls with active line tracking

Best simulations:
- Binary search: active search interval shrinks
- Bubble/selection/insertion sort: compare and swap states
- Merge sort: split tree and merge workspace
- Quick sort: pivot, partition zone, and recursion panel
- Heap sort: array plus tree representation

### Hashing

Purpose: show how keys become indices and how collisions are handled.

UI direction:
- Hash table buckets as the main canvas
- Key input with hash function animation
- Bucket chains or probing trail
- Load factor panel
- Collision-resolution mode selector

Best simulations:
- Direct addressing: key maps directly to slot
- Hash map/set: insert, search, delete
- Separate chaining: linked chains inside buckets
- Linear/quadratic probing: probe sequence highlights
- Rehashing: table expands and keys redistribute
- Frequency map: counts update as array/string scans
- Rolling hash: prefix hash and substring hash panels

### Recursion And Backtracking

Purpose: make call stacks, branching, choices, and undo steps visible.

UI direction:
- Recursion tree as the main workspace
- Call stack panel
- Local variables panel per active frame
- Choice board for backtracking problems
- Highlight choose, explore, unchoose states

Best simulations:
- Basic recursion: call and return flow
- Factorial/fibonacci: call tree with return values
- Subsets/permutations/combinations: decision tree
- N-Queens: board with attack lines and backtracking
- Maze/path problems: grid with visited and backtracked cells
- Sudoku: candidate placement and undo animation

### Linked List

Purpose: teach pointer structure and pointer manipulation.

UI direction:
- Nodes as draggable blocks with `data` and pointer fields
- Arrows for `next`, `prev`, random, or child pointers
- Pointer labels for `head`, `tail`, `current`, `prev`, `slow`, `fast`
- Live pointer table and code tracker
- Animation for rewiring links

Best simulations:
- Traversal/search: current pointer moves node by node
- Insert/delete: new node appears and arrows rewire in stages
- Reverse: `prev`, `curr`, `next` pointer dance
- Cycle detection: slow/fast pointers move at different speeds
- Merge lists: two source lists combine into result list
- Add two numbers: carry panel and digit-by-digit result list
- LRU using DLL: cache map plus doubly linked order

### Stack And Queue

Purpose: teach LIFO/FIFO behavior and operational constraints.

UI direction:
- Stack as vertical blocks with top pointer
- Queue as horizontal lane with front/rear pointers
- Operation input panel
- Overflow/underflow state
- Live operation log

Best simulations:
- Stack push/pop/peek: top marker updates
- Queue enqueue/dequeue: front and rear move
- Circular queue: ring buffer with wraparound
- Deque: operations at both ends
- Monotonic stack/queue: removed elements animate out
- Expression evaluation: token stream, operator stack, output/value stack
- BFS/DFS support lessons: stack/queue connects to traversal state

### Trees

Purpose: teach hierarchy, traversal, search, balancing, and tree-based structures.

UI direction:
- Tree canvas with draggable/rebalanced nodes
- Traversal order panel
- Queue/stack panel for BFS/DFS
- Highlight current node, visited nodes, and active path
- Code tracker for recursive or iterative traversal

Best simulations:
- Binary tree basics: parent/child/leaf labels
- Traversals: preorder, inorder, postorder, level order
- BST search/insert/delete: path highlights and structural updates
- AVL/Red-black basics: rotations and balance/color panels
- Heap: array and tree views side by side
- Trie: character path expansion
- Segment/Fenwick tree: range query and update highlights

### Graphs

Purpose: teach nodes, edges, traversal, paths, connectivity, and graph algorithms.

UI direction:
- Bellman-Ford is the reference quality
- Draggable nodes and editable edges
- Directed/undirected and weighted/unweighted modes when useful
- Algorithm state panels: distance, parent, visited, queue, stack, component, indegree
- Code tracker and current-step narration

Best simulations:
- BFS/DFS: frontier panel and visited set
- Dijkstra/Bellman-Ford: distance table and edge relaxation
- Floyd-Warshall: matrix update view
- Topological sort: indegree table and queue
- MST: chosen/rejected edge states
- DSU: parent/rank forest panel
- SCC/bridges/articulation: discovery/low-link table

### Dynamic Programming

Purpose: show how repeated subproblems become stored answers.

UI direction:
- DP table/grid as the main workspace
- Recursion tree or state graph when teaching memoization
- Transition formula panel
- Active cell, dependency cells, and updated answer states
- Space optimization view when applicable

Best simulations:
- Fibonacci: recursion tree collapses into memo table
- 1D DP: active index and previous dependencies
- Grid DP: cell dependencies from top/left/diagonal
- Knapsack: item-row and capacity-column grid
- Subsequence/string DP: two-axis table with matched characters
- LIS: current element, candidate previous elements, dp array
- Partition DP: interval split markers
- Bitmask DP: mask grid and selected-set panel

## Build Order

Recommended rollout:

1. Create one reusable lesson shell based on the Bellman-Ford structure.
2. Build shared UI primitives: hero, complexity tags, guide cards, simulator frame, playback controls, draggable panel, code tracker wrapper, state table.
3. Convert one lesson per topic first as a reference page.
4. Use those reference pages as templates for the remaining lessons in the same topic.
5. Verify every reference page in light and dark mode.
6. Check mobile layout for each simulator type.
7. Fill remaining lessons topic by topic, keeping the concept-specific simulator honest.

## Topic Reference Lessons

Use these as first examples for each topic:
- C++ Fundamentals: variables, loops, functions, pointers
- Time And Space Complexity: complexity of loops, recursion complexity, brute force vs optimized
- Arrays: two pointers, sliding window, Kadane's algorithm
- Strings: palindrome, KMP, Rabin-Karp, sliding window
- Searching And Sorting: binary search, merge sort, quick sort
- Hashing: hash table, collision resolution, frequency map
- Recursion And Backtracking: recursion basics, subsets, N-Queens
- Linked List: add two numbers, reverse linked list, detect loop
- Stack And Queue: stack using array/list, queue, monotonic stack, expression evaluation
- Trees: traversal basics, BST, heap, trie
- Graphs: Bellman-Ford, BFS, Dijkstra, topological sort
- Dynamic Programming: fibonacci, grid paths, knapsack, LCS

## Acceptance Checklist

Before marking a lesson complete:
- It has a definition in the hero.
- It has time and space complexity tags.
- It has a concept guide.
- It has a real interactive simulation, not static text only.
- It has playback or step controls when the concept is algorithmic.
- It has at least one live state panel.
- It uses draggable panels when overlays can cover the canvas.
- It supports light and dark mode.
- It uses CSS variables, not random Tailwind color utilities.
- It works on desktop and mobile without text overlap.
- It teaches the actual topic concept, not a copied graph UI.
