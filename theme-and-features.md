# Bellman‑Ford‑Style Theme & Feature Specification

## 🎨 Visual Theme

| Token | Light Value | Dark Value |
|-------|-------------|------------|
| `--bg` | `#f7f9fc` | `#0a0d14` |
| `--panel` | `#ffffff` | `#111827` |
| `--panel2` | `#edf2f7` | `#172033` |
| `--border` | `#d7deea` | `#2b3447` |
| `--text` | `#172033` | `#e5e7eb` |
| `--muted` | `#526174` | `#98a2b3` |
| `--blue` | `#285bd6` | `#4f7ef8` |
| `--green` | `#087f5b` | `#35c486` |
| `--amber` | `#b76705` | `#f5a623` |
| `--red` | `#c92a2a` | `#ef4444` |

All UI components reference these CSS variables via Tailwind‑compatible utilities (`bg-primary`, `border-primary`, etc.) ensuring a single source of truth for colours and smooth light/dark switching via the `data-theme` attribute on the `<main>` element.

### Core Layout
- **Hero Section** – large gradient heading, description, complexity tags, primary‑action button.
- **Detailed Guide** – responsive grid of `guide‑card` articles (mechanism, priority queue, relaxation, etc.).
- **Workspace** – two‑column layout (`340px` panel column + graph canvas) that collapses to a single column below 900 px.
- **Floating Panels** – draggable panels for *Priority Queue*, *Distances*, and *Code Tracker* with `cursor: grab` / `grabbing` feedback.

## 📄 General Lesson Page UI/UX (Bellman‑Ford Inspired)

- **Header / Hero** – prominent gradient title, short description, complexity tags, and a “Start Simulation” button.
- **TheorySection** – concise 100‑word academic overview, time/space complexity, and key‑point list; placed directly below the hero.
- **Guide Cards** – responsive grid of cards linking to deeper articles, each with an icon, short summary, and “Learn More” CTA.
- **Workspace** – two‑column layout: left column holds the interactive `SimulationCanvas` (graph, array, tree, etc.); right column contains the floating panels group.
- **Floating Panels** – three panels (Data View, Code Tracker, Controls) that are draggable, resizable, snap‑to‑grid, and maintain Z‑index ordering. Panels persist their position/size via `localStorage`.
- **Playback Controls** – unified control bar (Prev, Play/Pause, Next, Reset, speed slider) located in the Controls panel; keyboard shortcuts and touch gestures are supported.
- **Responsive Design** – below 900 px the workspace collapses to a single column; panels stack vertically and expand to full width, while the canvas scales to fit.
- **Accessibility** – all interactive elements have `aria-label`s, focus outlines, and meet WCAG AA contrast ratios. Screen‑reader friendly descriptions are provided for panels.
- **Theming** – colors driven by CSS variables (`--bg`, `--panel`, etc.) with a light/dark toggle that updates the `data‑theme` attribute instantly.

## ⚙️ Interactive Features (Bellman‑Ford Simulation)

- **Step‑by‑step playback**
  - Controls: Prev, Next, Play/Pause, Reset, and a speed slider (100‑2000 ms).
  - Playback state (`stepIndex`, `playing`, `speed`) is stored in React `useState` and persisted in `localStorage` so the user can resume after a page reload.
- **CodeTracker panel**
  - Receives an array of code strings; the active line is highlighted via `activeLine={step.line}`.
  - Supports line‑specific tool‑tips describing the current algorithmic operation.
- **Priority‑Queue panel**
  - Shows the current min‑heap entries as a list of node IDs with distances.
  - Updates in real‑time after each `extract‑min` and `relax` step.
- **Distances panel**
  - Renders a table of all node distances, colour‑coded (`visited`, `current`) and updated each step.
  - Clicking a distance row highlights the corresponding node in the SVG.
- **Graph editing**
  - **Node creation**: click on empty canvas space → new node at cursor position.
  - **Edge creation**: Shift‑drag from a source node to a target node.
  - **Weight editing**: double‑click an edge label to open an inline `<input>`.
  - **Deletion**: right‑click on a node or edge to open a context menu.
- **Draggable panels**
  - Each panel header is a drag handle; dragging updates `pqPos`, `distPos`, and `codePos` state.
  - Positions are saved to `localStorage` and restored on mount.
  - Panels snap to a 20 px grid to keep alignment tidy.
  - Clicking a panel brings it to the front by updating a `zIndex` value.
- **Resizable panels**
  - Bottom‑right corner handle allows users to resize panels; width/height stored in state.
  - Minimum size constraints prevent collapse; maximum size limited by viewport dimensions.
- **Keyboard shortcuts**
  - Arrow keys nudge the focused panel by 1 px.
  - `Ctrl+Z` / `Ctrl+Y` undo/redo panel moves and resizes.
  - Space / Enter toggles Play/Pause.
- **Touch support**
  - Pointer events are polyfilled; gestures work on mobile and tablet browsers.
  - Drag handles have a larger hit‑area for finger interaction.
- **State persistence**
  - All UI state (panel positions & sizes, current step, graph structure) is serialised to `localStorage`.
  - On component mount, the saved state is loaded, providing a seamless continuation experience.
- **Export & share**
  - “Export” button serialises the entire simulation (graph nodes/edges, panel layout, current step) to JSON.
  - Users can copy the JSON to the clipboard or download it as a `.json` file.
- **Dark/Light theme toggle**
  - A toggle button swaps the `data‑theme` attribute between `light` and `dark`.
  - CSS variables automatically change, instantly updating the UI without a page reload.
- **Responsive scaling**
  - Media query (`@media (max‑width: 900px)`) collapses the two‑column workspace into a single column.
  - Panels become full‑width, stacked vertically, and the SVG canvas scales to fit the viewport.
- **Accessibility**
  - All interactive elements have `aria-label`s and are keyboard‑navigable.
  - Focus outlines are visible; colour contrast meets WCAG AA standards.
- **Performance optimisations**
  - Rendering of nodes/edges uses `React.memo` to avoid unnecessary re‑renders.
  - Large graphs are throttled on pointer move events (`requestAnimationFrame`) to keep UI smooth.

| Feature | Purpose |
|---------|---------|
| **Step‑by‑step playback** | Users navigate algorithm steps with Prev/Next buttons, Play/Pause, and a speed slider. |
| **CodeTracker panel** | Shows pseudo‑code lines, highlights the active line (`activeLine={step.line}`). |
| **Priority‑Queue panel** | Visualises the min‑heap content at each iteration (`step.pq`). |
| **Distances panel** | Lists current tentative distances for every node, colour‑coded for visited/current nodes. |
| **Graph editing** | Click to add nodes, Shift‑drag to create edges, double‑click to edit weight, right‑click context menu to delete. |
| **Speech synthesis** | Optional narration of step explanations (`isSpeechEnabled`). |
| **Responsive UI** | CSS‑grid and media queries adapt layout for tablets and phones. |
| **Visual status cues** | Nodes receive classes `source`, `reached`, `current`, `selected`; edges receive `active` / `selected` for hover/selection. |
| **Theming via CSS variables** | Guarantees consistent colour usage across all graph simulations (Bellman‑Ford, Dijkstra, etc.). |

## 📦 Component List
- `TheorySection` – standard wrapper for theory content (definition, complexity, key points).  
- `CodeTracker` – receives an array of code strings and highlights the current line.  
- `SimulationSkeleton` – placeholder loading component used while the graph is being initialised.  
- `FloatingPanel` (custom implementation) – used for the three draggable panels; each panel contains a header with a drag‑handle.  
- `GraphCanvas` – SVG rendering of nodes, edges, and weight labels; supports pointer events for interaction.  

## 🛠️ How to Apply This Theme to a New Simulation
1. **Import the CSS variables** – ensure the `style jsx` block from any existing graph file (e.g., `bellman-ford-algorithm.tsx`) is copied into the new component.  
2. **Reuse the layout structure** – copy the `<section className="hero">`, `<section className="detailed-guide">`, and `<section id="simulator" className="simulator">` blocks.  
3. **Plug in your algorithm logic** – expose a `steps` array that follows the same shape (`type`, `dist`, `prev`, `pq`, `line`, etc.) and reuse the playback hooks (`stepIndex`, `playing`, `speed`).  
4. **Add the three floating panels** – use the same state variables (`pqPos`, `distPos`, `codePos`) and drag‑handlers (`startPanelDrag`, `handleMove`).  
5. **Update the TheorySection** – provide a concise 100‑word description, time/space complexity, and key‑point list for the new algorithm.

---
*This document lives alongside the graph simulations and serves as a single source of truth for UI/UX consistency across the curriculum.*

## 💡 Extending Theme & Features to Other DSA Topics

### Arrays
- Use the same hero layout with an introductory description, time/space complexity tags (`O(1)` access, `O(N)` insertion/deletion), and a “Try Interactive Simulator” button.
- Detailed guide articles: **Indexing**, **Dynamic Resizing**, **Common Operations** (push/pop, slice, search).
- Floating panels: **Array Snapshot** (visual representation of current elements) and **Operation Log** (show code steps like `arr[i] = x`).

### Linked Lists
- Hero section describes pointer‑based structure, complexity (`O(N)` search, `O(1)` insert/delete at head).
- Guide cards: **Node Structure**, **Insertion**, **Deletion**, **Traversal**, **Reversal**.
- Panels: **Node List** (shows nodes and links), **Code Tracker** for pointer manipulation steps.

### Trees (Binary, AVL, Red‑Black)
- Hero explains hierarchical nature, `O(log N)` search/insert/delete for balanced trees.
- Guide articles: **Tree Traversals**, **Balancing Rotations**, **Node Coloring** (for RB).
- Panels: **Tree Diagram** (draggable), **Rotations Visualizer**, **Stack Trace** for recursion.

### Hashing
- Hero covers hash function, collisions, load factor.
- Guide cards: **Separate Chaining**, **Open Addressing**, **Rehashing**, **Hash Table Operations**.
- Panels: **Bucket View** (show bucket contents), **Collision Map**, **Resize Animation**.

### Sorting Algorithms
- Hero with `O(N log N)` average case.
- Guide cards: **Merge**, **Quick**, **Heap**, **Stability**.
- Panels: **Array Visualizer**, **Pivot Tracker**, **Heap Tree**.

### Dynamic Programming
- Hero emphasizing overlapping sub‑problems and optimal substructure.
- Guide cards: **Memoization**, **Tabulation**, **State Transition Diagram**.
- Panels: **DP Table**, **State Graph**, **Back‑trace Path**.

### Graph Algorithms (other than shortest path)
- Bellman‑Ford pattern can be reused for **DFS**, **BFS**, **Kruskal**, **Prim**, **Topological Sort** with appropriate panels (stack/queue, forest, MST edges).

### UI/UX Consistency Checklist
- Always use CSS variables for colours.
- Keep padding `px-12 py-24`‑style.
- Include `TheorySection` component.
- Provide three floating panels (data view, code, controls).
- Enable speech synthesis and speed control.
- **Draggable panels** – each panel can be moved by dragging the header; positions are stored in state (`pqPos`, `distPos`, `codePos`) and persist across steps.
- **Resizable panels** – users can resize panels via a bottom‑right handle; dimensions (`width`, `height`) are saved in state to allow custom layouts.
- **Snap‑to‑grid** – panels snap to a 20 px grid when dragged, keeping alignment tidy.
- **Z‑index management** – clicking a panel brings it to the front (`zIndex` state), ensuring overlapping panels are usable.
- **Keyboard shortcuts** – arrow keys nudge selected panel by 1 px; `Ctrl+Z` / `Ctrl+Y` undo‑redo panel moves and size changes.
- **Touch support** – pointer events are polyfilled for touch devices, enabling drag gestures on mobiles/tablets.
- **State persistence** – panel positions, sizes, and the current step are saved to `localStorage` so the simulation restores on page reload.
- **Export & share** – a “Export” button serialises the current graph, panel layout, and step index to JSON, which can be copied or downloaded.
- **Dark/Light toggle** – a theme switch toggles the `data‑theme` attribute, instantly applying the CSS‑variable palette.
- **Responsive scaling** – when viewport width drops below 900 px panels collapse into a single column; panel widths become 100 % with vertical stacking.


---

*Add or adapt these ideas when creating new simulation files to maintain a cohesive learning experience across the entire DSA curriculum.*

## 📚 Extending the Bellman‑Ford Simulation Blueprint

### Dynamic Programming (DP) Simulations
- **Core analogy**: Treat each DP state as a node in a directed acyclic graph (DAG); edges represent state transitions.
- **Visualization**: Use the same SVG canvas to render a layered DAG where each layer is a DP stage (e.g., `i` index). Nodes display the current sub‑problem value.
- **Panels**:
  - *State Table* – a floating panel that shows the DP table (2‑D matrix) with live updates.
  - *Transition List* – similar to the Priority‑Queue panel, but lists possible transitions from the current state.
- **Step generation**: `dpSteps` returns an array of steps containing `state`, `value`, `prevState`, `transitionInfo`, and `line` for highlighting pseudo‑code.
- **Interactivity**: Users can edit base cases directly in the State Table, triggering a recomputation of subsequent steps.
- **Playback**: Mirrors Bellman‑Ford’s step‑by‑step controls; the “Relax” concept becomes “Update DP cell”.

### Hashing Simulations
- **Analogy**: Model the hash table as a set of buckets (vertical stacks). Each bucket is a mini‑panel that can be expanded.
- **Visualization**: Use SVG rectangles for buckets; arrows depict chaining or probing sequences.
- **Panels**:
  - *Bucket View* – floating panel that shows the contents of each bucket; updates after each insertion/deletion.
  - *Hash Function* – a panel displaying the current hash function formula and its output for a given key.
- **Steps**: `hashingSteps` produce actions like `insert`, `search`, `delete`, each with `key`, `hash`, `bucketIndex`, `collisionType`, and `line`.
- **Interactivity**: Users can input custom keys and values, toggle between chaining and open addressing, and watch how collisions are resolved.
- **Playback**: Mirrors Bellman‑Ford’s “extract‑min” with “probe” or “traverse chain” actions.

### Linked List Simulations
- **Analogy**: Nodes are like graph vertices with a single outgoing edge (the `next` pointer).
- **Visualization**: Render a horizontal chain of node circles with arrow connectors.
- **Panels**:
  - *Pointer Tracker* – shows the `head`, `tail`, and any temporary pointers (`prev`, `curr`).
  - *Operation Log* – logs each pointer reassignment (e.g., `prev.next = curr.next`).
- **Steps**: `linkedListSteps` produce actions (`traverse`, `insert`, `delete`, `reverse`) containing `nodeId`, `pointerChanges`, and `line`.
- **Interactivity**: Click to add a new node, drag to reorder, double‑click a node to edit its value.
- **Playback**: Follows Bellman‑Ford’s step model; each pointer update is a “relaxation” of the list structure.

### Stack & Queue Simulations
- **Analogy**: Represent a stack as a vertical column and a queue as a horizontal line with front/back markers.
- **Visualization**: Use SVG rectangles stacked for stack; for queue, show a conveyor‑belt style layout.
- **Panels**:
  - *Data View* – shows the current contents of the stack or queue.
  - *Operation Log* – records `push`, `pop`, `enqueue`, `dequeue` actions with timestamps.
- **Steps**: `stackSteps`/`queueSteps` emit `type` (`push`, `pop`, etc.), the element involved, and `line` for code highlighting.
- **Interactivity**: Users can push arbitrary values via an input box, pop/dequeue with a button, and see the visual removal.
- **Playback**: Mirrors the “Priority‑Queue panel” – the stack/queue panel updates in real time.

### Recursion & Backtracking Simulations
- **Analogy**: The call stack is visualized like the stack panel, but each frame includes the function name and parameters.
- **Visualization**: Render a vertical stack of frames; clicking a frame highlights the corresponding part of the source code.
- **Panels**:
  - *Call Stack* – shows active recursion frames with variable values.
  - *Decision Tree* – for backtracking problems, display a tree of explored branches.
- **Steps**: `recursionSteps` produce `enter`, `exit`, `branch`, `prune` actions, each carrying `function`, `args`, `returnValue`, and `line`.
- **Interactivity**: Users can modify input parameters before starting, and optionally step into a specific recursive call.
- **Playback**: Uses the same controls; “extract‑min” becomes “enter recursion”, “relax” becomes “return value”, and “negative cycle detection” maps to “prune branch”.

---

*These guidelines reuse the Bellman‑Ford UI skeleton—hero, detailed guide, workspace, and floating panels—while adapting the step model, visual metaphors, and panel contents to the semantics of each new DSA topic.*
