import os
import re

files_to_refactor = [
    "backtracking-on-arrays.tsx",
    "backtracking-on-grids.tsx",
    "backtracking-on-strings.tsx",
    "backtracking-template.tsx",
    "base-case.tsx",
    "binary-search-recursion.tsx",
    "branch-and-bound-basics.tsx",
    "call-stack.tsx",
    "combination-sum-ii.tsx"
]

base_dir = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\recursion-backtracking"

style_block = """      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: Arial, sans-serif; }
        .page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), radial-gradient(circle at 90% 80%, #35c48608, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .hero h1 { margin: 16px 0; font-size: clamp(48px, 9vw, 92px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 2px 10px rgba(0,0,0,0.1)); }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px 0 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }
        .actions, .editor, .controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input, select { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 0 12px; }
        button.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 14%, transparent); }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; transition: all 0.3s; box-shadow: 0 4px 14px 0 rgba(79,126,248,0.39); }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,126,248,0.5); filter: brightness(1.1); }
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; margin-bottom: 80px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; transition: transform 0.3s, border-color 0.3s; }
        .guide-card:hover { transform: translateY(-4px); border-color: var(--blue); }
        .guide-card h2 { font-size: 18px; margin: 0 0 16px 0; color: var(--text); }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { background: linear-gradient(135deg, var(--panel), var(--panel2)); border-bottom: 4px solid var(--blue); }
        .simulator { padding: 60px 0 100px; margin-top: 40px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5); }
        aside { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
        .simulation-data { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
        .data-group h3 { font-size: 11px; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; margin-bottom: 8px; }
        .stack-viz, .visited-viz { display: flex; flex-wrap: wrap; gap: 6px; }
        .stack-viz { flex-direction: column; align-items: flex-start; max-height: 200px; overflow-y: auto; border-left: 2px solid var(--border); padding-left: 10px; }
        .stack-item { background: var(--blue); color: white; padding: 4px 12px; border-radius: 6px; font-family: monospace; font-weight: 700; font-size: 12px; animation: slideInStack 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 4px; border: 1px solid rgba(0,0,0,0.1); }
        .visited-item { border: 1px solid var(--border); color: var(--muted); padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 12px; transition: all 0.3s; }
        .visited-item.active { background: color-mix(in srgb, var(--green) 15%, transparent); border-color: var(--green); color: var(--green); font-weight: 700; }
        .distances { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; }
        .distances span { border: 1px solid var(--border); border-radius: 6px; padding: 5px 8px; color: var(--muted); background: var(--panel2); font-family: monospace; transition: all 0.3s; }
        .distances span.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 10%, transparent); }
        .empty-msg { font-size: 12px; color: var(--muted); font-style: italic; }
        @keyframes slideInStack { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .counter { font-family: monospace; }
        svg { width: 100%; min-height: 560px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 8px; }
        marker path { fill: var(--muted); }
        .edge { fill: none; transition: all 0.3s; }
        .edge.active { filter: drop-shadow(0 0 8px var(--blue)); }
        .edge.selected { filter: drop-shadow(0 0 8px var(--red)); }
        .node { cursor: grab; transition: all 0.3s; }
        .node circle { transition: all 0.3s; }
        .node.current circle { filter: drop-shadow(0 0 10px var(--blue)); }
        .node.current text { fill: white; }
        text { fill: var(--text); font-size: 12px; text-anchor: middle; font-weight: 700; user-select: none; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        .movable-panel { cursor: grab; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); overflow: visible; }
        .movable-panel:active { cursor: grabbing; }
        .movable-panel > div { resize: both; overflow: auto; min-width: 140px; min-height: 110px; max-width: 620px; max-height: 430px; }
        .panel-container { background: color-mix(in srgb, var(--panel) 85%, transparent); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
        .panel-header { background: var(--panel2); padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; cursor: grab; user-select: none; border-bottom: 1px solid var(--border); }
        .panel-header span { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; }
        .drag-handle { color: var(--muted); opacity: 0.5; }
        .panel-content { padding: 10px; flex: 1; overflow-y: auto; }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
        @media (max-width: 620px) { svg { min-height: 430px; } }
      `}</style>
"""

# Let's perform high-quality search and replacements to make all pages beautifully Graph UI reference styled!
print("Starting premium visual refactoring...")
