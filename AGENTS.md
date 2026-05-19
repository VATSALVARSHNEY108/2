<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# CoreCode Repository Guidelines

## 1. Content System
- **DO NOT** hardcode lesson routes. The platform uses a filesystem-based registry.
- **ALWAYS** check `lib/content-registry.ts` when adding or renaming lessons to update `LESSON_ORDER` or `TOPIC_LABELS`.
- Lessons are located in `content/[subject]/[topic]/[lesson].tsx`.

## 2. Visual Style
- The site uses a **high-contrast black-and-white** theme by default.
- **DO NOT** use generic Tailwind colors (e.g., `bg-blue-500`). Use CSS variables like `var(--bg-primary)`, `var(--text-secondary)`, etc.
- Standard padding for lesson content is usually `px-12 py-24` or similar high-density spacing.
- The "Spotlight" effect is global; do not attempt to re-implement it in individual components.

## 3. Styling & Tailwind 4
- The project uses **Tailwind 4** with `@import "tailwindcss";`.
- Design tokens are defined in `app/styles/`.
- Use the `@theme` block in `app/styles/theme.css` to map CSS variables to Tailwind utilities.

## 4. Performance
- Use `SimulationSkeleton` for lesson loading states.
- Keep lesson components focused. Heavy simulations should be optimized for client-side rendering.

## 5. Metadata
- Subject icons and descriptions are in `lib/content-registry.ts` -> `SUBJECT_META`.
- If you add a new subject folder, you **must** add it to `SUBJECT_META` for it to appear on the UI.
