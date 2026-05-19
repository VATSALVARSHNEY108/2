# CoreCode Platform Documentation

## 1. Overview & Vision
CoreCode is a premium engineering education platform designed for deep immersion into Data Structures, Algorithms, and Core Engineering. It utilizes a **notebook‑style, dark-first UI** centered around the signature **Flashlight Effect** which creates a focused, high-contrast learning environment.

---

## 2. Architectural Philosophy

### Content-Driven Routing
The platform utilizes a **Zero-Config Content System**.
- **Source of Truth**: The `content/` directory.
- **Auto-Discovery**: `lib/content-registry.ts` reads the filesystem to generate metadata, ordering, and labels without manual route hardcoding.
- **Dynamic Imports**: Lessons are loaded via `import()` in `LessonLoader.tsx` only when visited, ensuring the main bundle remains lightweight.

### Tech Stack Details
- **Frontend**: Next.js 15 (React 19, App Router)
- **Styling**: Tailwind CSS 4.0 + Native CSS Variables
- **Motion**: Framer Motion (Optimized for 60fps)
- **AI**: Google Gemini Flash via Python RAG Backend
- **State**: `next-themes` for system-aware light/dark modes.

---

## 3. Visual Design System

### The Flashlight (Spotlight) Effect
Implemented in `components/BackgroundEffect.tsx`, this effect uses five distinct layers to create depth.

| Layer | Component | Function | Detail |
| :--- | :--- | :--- | :--- |
| **Layer 1** | Base | Static Background | `/bg.jpg` with `blur-[16px]` at full opacity. |
| **Layer 2** | Focus | Clear Mask | `/bg.jpg` (unblurred) revealed via `WebkitMaskImage` radial gradient at cursor. |
| **Layer 3** | Mask | Global Vignette | `radial-gradient` centered at cursor: `transparent 0%` to `bg-primary 100%`. |
| **Layer 4** | Grid | Technical Overlay | Dot grid (`32px`) and Line grid (`128px`) at `0.02` opacity. |
| **Layer 5** | Noise | Film Grain | SVG Fractal Noise `mix-blend-overlay` at `0.02` opacity. |

**Physics**: Mouse tracking is powered by `framer-motion`'s `useSpring` with `{ stiffness: 200, damping: 15 }` for a snappy, weightless response.

### CSS Variables (Design Tokens)
Defined in `app/styles/dark.css` and `app/styles/light.css`.

#### Dark Mode (Default)
- `--bg-primary`: `#000000` (Pitch black)
- `--bg-secondary`: `#0a0a0a` (Elevation 1)
- `--bg-elevated`: `#111111` (Elevation 2)
- `--text-primary`: `#ffffff` (High contrast)
- `--text-secondary`: `#a1a1aa` (Muted Zinc)
- `--border-color`: `rgba(255, 255, 255, 0.1)`
- `--accent-vibrant`: `#ffffff`

---

## 4. Component Encyclopedia

### Navigation & Identity
- **`Navbar`**: Glassmorphic top bar (`backdrop-blur-xl`) with dynamic breadcrumbs. Uses `Home`, `ChevronRight` icons.
- **`ThemeToggle`**: Complex SVG-animated switch with clouds, stars, and moon/sun states.
- **`BrandLogo`**: Minimalist SVG branding.

### Visualization & Interaction
- **`SimulationStudio`**: The primary lesson layout.
  - **Left Panel**: Main Canvas with `p-12` padding and dot-grid background.
  - **Floating Controls**: `onReset`, `onTogglePlay`, `onStepBackward/Forward`. Includes a speed slider (`100ms` - `2000ms`).
  - **Right Panel**: Tabbed interface (`Explanation`, `Complexity`, `Code`, `Notes`).
- **`AIBot`**: Floating chat interface (`z-[1005]`) connected to the FastAPI backend.
- **`ArrayRenderer`**: Maps data to `motion.div` blocks with `layout` prop for automatic repositioning animations.

---

## 5. Backend & AI Integration

### Python RAG Engine (`/backend`)
- **FastAPI**: Serves the `/chat` and `/ingest` endpoints.
- **Knowledge Base**: `backend/data/knowledge_base.json` stores extracted text from all `.tsx` lessons.
- **Ingestion Logic**: `extract_text_from_tsx` uses regex to pull `<h1>`, `className="description"`, and `<h2>` content for indexing.
- **Search**: Scikit-learn `TfidfVectorizer` + `cosine_similarity` finds the top 3 relevant sections for any query.

---

## 6. Content Authoring Guide

### Lesson Template
Lessons are authored in TSX and stored in `content/[subject]/[topic]/[lesson].tsx`. They typically use `SimulationStudio` or `MinimalSimulationStudio`.

---

## 7. Development & DevOps

### Local Setup
1. `npm install`
2. `python -m venv venv` && `pip install -r backend/requirements.txt`
3. Run `start.bat` (Windows) to launch both servers.

### Utility Scripts
- `standardize_padding.py`: Regex-based layout correction.
- `theme_ify.py`: Automated Tailwind -> CSS Variable migration.
- `ingest.py`: Rebuilds the AI knowledge base from the latest content.

---

## 8. Performance & Optimization
- **Mask Performance**: Uses `WebkitMaskImage` for hardware-accelerated spotlight rendering.
- **Lazy Loading**: `LessonLoader` defers simulation bundle loading until the user navigates to the route.
- **Registry Caching**: `lib/content-registry.ts` utilizes targeted filesystem reads for single subjects to avoid full-tree scans.

---

## 9. Accessibility
- **Reduced Motion**: Spring physics can be disabled via a global flag if `prefers-reduced-motion` is detected.
- **Aria Roles**: `aria-hidden` on all decorative background layers.

---

## 10. File-by-File Technical Reference

### App Routes (`app/`)
| File | Description |
| :--- | :--- |
| `layout.tsx` | Global layout. Initializes fonts, `Providers`, `Navbar`, `Footer`, `AIBot`, and the `BackgroundEffect`. |
| `page.tsx` | Home page. Features the typewriter effect, counter statistics, and the core discipline grid. |
| `globals.css` | Entry point for Tailwind 4.0 and all modular CSS imports. |
| `learn/[subject]/page.tsx` | Lists topics within a subject using the `TopicExplorer` component. |
| `learn/[subject]/[topic]/page.tsx` | Lists lessons within a topic using the `LessonList` component. |
| `learn/[subject]/[topic]/[lesson]/page.tsx` | The lesson container. Passes lesson metadata to `LessonLoader`. |
| `curriculum/page.tsx` | High-level curriculum overview listing all available subjects. |
| `api/content/route.ts` | Server-side API endpoint providing the full subject tree to the client. |

### Core Components (`components/`)
| File | Description |
| :--- | :--- |
| `BackgroundEffect.tsx` | The Flashlight engine. Manages mouse state and 5-layer radial masking. |
| `Navbar.tsx` | Interactive navigation bar with search modal trigger and glassmorphism. |
| `AIBot.tsx` | Floating AI assistant chat interface with RAG integration. |
| `SimulationStudio.tsx` | Main interactive layout for lessons. Manages tabs and playback controls. |
| `LessonLoader.tsx` | Handles dynamic `import()` of lesson files and navigation breadcrumbs. |
| `TopicExplorer.tsx` | Animated vertical learning path with magnetic nodes and scroll-linked progress. |
| `LessonList.tsx` | Grid of lesson cards within a topic. |
| `Magnetic.tsx` | Framer Motion wrapper providing magnetic attraction effects to child elements. |
| `ThemeToggle.tsx` | Complex SVG-animated switch for dark/light mode transition. |

### Utilities & Types (`lib/`)
| File | Description |
| :--- | :--- |
| `content-registry.ts` | The bridge between the filesystem and the app. Handles sorting and formatting. |
| `content-types.ts` | TypeScript interfaces for Subjects, Topics, and Lessons. |
| `useProgress.ts` | Client-side hook for tracking lesson completion via `localStorage`. |

### Backend (`backend/`)
| File | Description |
| :--- | :--- |
| `main.py` | FastAPI application. Defines the `/chat` endpoint for AI interaction. |
| `rag_utils.py` | Core RAG logic. Handles context retrieval using TF-IDF and similarity scoring. |
| `ingest.py` | Standalone script to walk the filesystem and index content into JSON. |

---

*Last Updated: 2026-05-14 by Antigravity Engineering*
