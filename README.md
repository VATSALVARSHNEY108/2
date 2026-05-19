# O(1) - Interactive DSA Learning Platform

![Group Anagrams Mockup](C:\Users\VATSAL VARSHNEY\.gemini\antigravity\brain\912565d2-ffcf-4cab-a802-26c2d8fba7c9\group_anagrams_mockup_1778849955079.png)

## Overview
**O(1)** is a premium, high-fidelity interactive platform designed to teach Data Structures and Algorithms (DSA) through immersive, deterministic simulations. The platform provides a "SimulationStudio" environment where users can visualize complex algorithms step-by-step, monitor performance complexity in real-time, and trace code execution.

## 🚀 Key Features
- **SimulationStudio Architecture**: A unified, full-page simulation framework for high-fidelity interactive lessons.
- **Deterministic Playback**: Step-by-step navigation (Next/Prev) with variable speed controls and auto-play.
- **Complexity Monitors**: Integrated trackers for Time and Space complexity (e.g., O(N), O(log N)).
- **Code Tracers**: Synchronized code highlighting that maps visual steps to implementation logic.
- **Dynamic Content Registry**: A filesystem-based loading system that automatically indexes lessons and topics.
- **Premium Aesthetics**: High-contrast dark mode design using Syne typography, Framer Motion animations, and custom CSS variables.

## 🛠️ Technology Stack
### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with native CSS variables
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks (useCallback, useMemo, useEffect)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Server**: Uvicorn with hot-reload

## 📂 Project Structure
```text
O(1)/
├── app/                  # Next.js App Router (Routes & Layouts)
├── components/           # Reusable UI Components (SimulationStudio, etc.)
├── content/              # Algorithm Lesson Files
│   ├── dsa/
│   │   ├── arrays/      # Standardized Array Simulations
│   │   └── strings/     # Standardized String Simulations (Latest Update)
│   └── ...
├── lib/                  # Core Utilities & Content Registry
├── backend/              # FastAPI Python Backend
├── styles/               # Global CSS & Tailwind Theme Definitions
└── package.json          # Dependency & Script Manager
```

## 📝 Recent Updates: Strings Curriculum Standardization
We have recently completed the standardization of the **Strings** module, migrating 15+ complex algorithms to the `SimulationStudio` architecture:
- **Pattern Matching**: KMP (strStr), Shortest Palindrome, Longest Happy Prefix.
- **Sliding Window**: Longest Repeating Char Replacement, Longest Substring No Repeat.
- **Stack Algorithms**: Basic Calculator II, Simplify Path, Valid Parentheses.
- **Optimization**: Largest Number, Reorganize String, Longest Happy String.
- **Spatial Mapping**: ZigZag Conversion.

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- Python 3.9+

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd O(1)
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install backend dependencies (optional, for backend features):
   ```bash
   pip install -r backend/requirements.txt
   ```

### Running Locally
To start both the frontend and backend concurrently:
```bash
npm run dev:all
```
The site will be available at [http://localhost:3000](http://localhost:3000).

## 🎨 Visual Style
The platform adheres to the **CoreCode Repository Guidelines**:
- **Contrast**: High-contrast black-and-white/indigo theme.
- **Variables**: Strictly uses `--bg-primary`, `--text-secondary`, and other defined tokens.
- **Density**: High-density spacing (`px-12 py-24`) for professional layout.

---
*Built with ❤️ for learners by Antigravity.*
