"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Bold, Italic, Underline, List, Search, FolderPlus, FilePlus,
  ChevronRight, ChevronDown, Trash2, Sparkles, PenTool, 
  StickyNote, X, RotateCcw, Moon, Sun, AlignLeft, Hash,
  BookOpen, Feather
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

/* ── Types ── */
const STICKERS = ["⭐","🔥","💡","✅","📌","🎯","🏆","🚀","🎉","⚡","🌊","🌸","🍀","🦋","📝","🔖","💫","🌿","🎨","🔮"];

const DEFAULT_FOLDERS = [
  {
    id: "f1", name: "Personal", icon: "🌿", expanded: true,
    files: [
      { id: "n1", name: "Morning Thoughts", content: '<h2>Morning Thoughts</h2><p>Start with intention. What matters most today?</p><p>Take a deep breath and write freely. This space is yours.</p>' },
      { id: "n2", name: "Book Notes", content: '<h2>Book Notes</h2><p>Currently reading: <strong>The Design of Everyday Things</strong></p><p>Key insight: Good design is invisible. Bad design screams.</p>' },
    ]
  },
  {
    id: "f2", name: "Work", icon: "💼", expanded: false,
    files: [
      { id: "n3", name: "Project Ideas", content: '<h2>Project Ideas</h2><p>Capture every spark before it fades.</p>' },
    ]
  },
];

const STORAGE_KEY = "beautiful_notes_v1";

/* ── DrawingBoard ── */
function DrawingBoard({ onSave, onClose, isDark }: { onSave: (data: string) => void; onClose: () => void; isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#2d1b69");
  const [size, setSize] = useState(3);
  const isDrawing = useRef(false);
  const bgColor = isDark ? "#1a1814" : "#faf8f3";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [bgColor]);

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return [src.clientX - rect.left, src.clientY - rect.top];
  };

  const startDraw = (e: any) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const [x, y] = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const [x, y] = getPos(e, canvas);
    ctx.lineWidth = tool === "eraser" ? size * 6 : size;
    ctx.strokeStyle = tool === "eraser" ? bgColor : color;
    ctx.lineTo(x, y); ctx.stroke();
  };

  const stopDraw = () => { isDrawing.current = false; };
  
  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const colors = isDark 
    ? ["#e8d5b0", "#c4a882", "#8b9dc3", "#a8c5a0", "#c49bc4", "#c4706a", "#6a8fb0"]
    : ["#2d1b69", "#8b4513", "#1a5276", "#1e6b3c", "#7d3c98", "#c0392b", "#2c3e50"];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="fixed inset-0 z-[100] flex items-center justify-center p-8"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex flex-col rounded-3xl overflow-hidden w-full max-w-5xl shadow-2xl" style={{
        background: isDark ? "#1a1814" : "#faf8f3",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.1)",
        maxHeight: "90vh"
      }}>
        <div className="flex items-center justify-between px-8 py-5" style={{
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)"
        }}>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: isDark ? "#c4a882" : "#8b4513", fontFamily: "'Georgia', serif", letterSpacing: "0.05em" }}>
              <Feather size={16} /> Sketch
            </span>
            <div className="flex rounded-xl overflow-hidden" style={{ border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)" }}>
              {["pen","eraser"].map(t => (
                <button key={t} onClick={() => setTool(t)} className="px-4 py-2 text-xs font-medium capitalize transition-all"
                  style={{ background: tool === t ? (isDark ? "#c4a882" : "#8b4513") : "transparent", color: tool === t ? (isDark ? "#1a1814" : "#faf8f3") : (isDark ? "#c4a882" : "#8b4513") }}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              {colors.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{
                  width: 22, height: 22, borderRadius: "50%", background: c,
                  border: color === c ? `3px solid ${isDark ? "#c4a882" : "#8b4513"}` : "2px solid transparent",
                  transform: color === c ? "scale(1.15)" : "scale(1)", transition: "all 0.15s"
                }} />
              ))}
            </div>
            <input type="range" min={1} max={12} value={size} onChange={e => setSize(+e.target.value)} style={{ width: 80 }} />
            <button onClick={clear} style={{ color: isDark ? "#888" : "#aaa", padding: 4 }}><RotateCcw size={16} /></button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { const d = canvasRef.current?.toDataURL("image/png"); if(d) onSave(d); onClose(); }}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: isDark ? "#c4a882" : "#8b4513", color: isDark ? "#1a1814" : "#faf8f3" }}>
              Insert
            </button>
            <button onClick={onClose} style={{ color: isDark ? "#888" : "#aaa", padding: 8 }}><X size={20} /></button>
          </div>
        </div>
        <canvas ref={canvasRef} width={1800} height={1200} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
          style={{ width: "100%", flex: 1, cursor: "crosshair", display: "block" }} />
      </div>
    </motion.div>
  );
}

/* ── Main ── */
export default function NotePad() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  
  const [folders, setFolders] = useState(DEFAULT_FOLDERS);
  const [activeId, setActiveId] = useState("n1");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showStickers, setShowStickers] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setFolders(p.folders || DEFAULT_FOLDERS);
        setActiveId(p.activeId || "n1");
      } catch(e) {}
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify({ folders, activeId }));
  }, [folders, activeId, mounted]);

  const allFiles = folders.flatMap(f => f.files);
  const currentNote = allFiles.find(n => n.id === activeId);

  const onInput = useCallback(() => {
    if (!editorRef.current || !activeId) return;
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.innerText || "";
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setFolders(prev => prev.map(f => ({ ...f, files: f.files.map(n => n.id === activeId ? { ...n, content: html } : n) })));
  }, [activeId]);

  useEffect(() => {
    if (!editorRef.current || !currentNote) return;
    if (editorRef.current.innerHTML !== currentNote.content) {
      editorRef.current.innerHTML = currentNote.content || "";
      const text = editorRef.current.innerText || "";
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    }
  }, [activeId, currentNote]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    if (savedRange.current) {
      const sel = window.getSelection();
      if (sel) { sel.removeAllRanges(); sel.addRange(savedRange.current); }
    }
  };

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(cmd, false, val);
    onInput();
  };

  const createNote = (folderId: string) => {
    const n = { id: Date.now().toString(), name: "Untitled Note", content: "" };
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, files: [n, ...f.files], expanded: true } : f));
    setActiveId(n.id);
  };

  const createFolder = () => {
    const f = { id: Date.now().toString(), name: "New Collection", icon: "📁", expanded: true, files: [] };
    setFolders(prev => [...prev, f]);
  };

  const deleteNote = (id: string) => {
    if (!confirm("Delete this note?")) return;
    setFolders(prev => prev.map(f => ({ ...f, files: f.files.filter(n => n.id !== id) })));
    if (activeId === id) setActiveId("");
  };

  const deleteFolder = (id: string) => {
    if (!confirm("Delete this folder and all its notes?")) return;
    setFolders(prev => prev.filter(f => f.id !== id));
  };

  const renameFolder = (id: string, name: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name } : f));
  };

  const handleAI = async () => {
    if (!currentNote || isSummarizing) return;
    setIsSummarizing(true);
    try {
      const text = editorRef.current?.innerText || "";
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `Summarize these notes concisely in 2-3 sentences, capturing the key ideas:\n\n${text}` }]
        })
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Could not summarize.";
      exec("insertHTML", `<div class="ai-summary"><span class="ai-label">✦ AI Summary</span><p>${reply}</p></div>`);
    } catch(e) { console.error(e); } finally { setIsSummarizing(false); }
  };

  if (!mounted) return null;

  const bg = isDark ? "#0f0e0c" : "#faf8f3";
  const bgSide = isDark ? "#151410" : "#f3f0e8";
  const bgCard = isDark ? "#1c1a16" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textPrimary = isDark ? "#e8d5b0" : "#2c1810";
  const textSecondary = isDark ? "#9e8c70" : "#8b7355";
  const accent = isDark ? "#c4a882" : "#8b4513";
  const accentSoft = isDark ? "rgba(196,168,130,0.1)" : "rgba(139,69,19,0.07)";

  return (
    <div style={{ display: "flex", height: "calc(100vh - 80px)", background: bg, color: textPrimary, fontFamily: "'Georgia', serif", overflow: "hidden", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; }
        .note-editor { outline: none; }
        .note-editor:empty:before { content: attr(data-placeholder); color: ${textSecondary}; opacity: 0.5; pointer-events: none; font-style: italic; }
        .note-editor h1, .note-editor h2 { font-family: 'Georgia', serif; font-weight: normal; letter-spacing: -0.02em; }
        .note-editor h2 { font-size: 1.6rem; color: ${textPrimary}; margin: 0 0 1.2rem; }
        .note-editor p { margin: 0 0 1rem; line-height: 1.85; color: ${isDark ? "#c4b89e" : "#4a3728"}; }
        .note-editor strong { color: ${textPrimary}; font-weight: 600; }
        .note-editor em { font-style: italic; }
        .note-editor ul { padding-left: 1.5rem; margin: 0 0 1rem; }
        .note-editor li { line-height: 1.85; margin-bottom: 0.3rem; color: ${isDark ? "#c4b89e" : "#4a3728"}; }
        .ai-summary { background: ${accentSoft}; border-left: 3px solid ${accent}; border-radius: 0 12px 12px 0; padding: 1.25rem 1.5rem; margin: 1.5rem 0; }
        .ai-label { display: block; font-size: 0.7rem; font-family: 'Georgia', serif; letter-spacing: 0.12em; text-transform: uppercase; color: ${accent}; margin-bottom: 0.6rem; font-weight: bold; }
        .ai-summary p { color: ${textSecondary}; margin: 0; font-size: 0.95rem; }
        .sketch-img { max-width: 100%; border-radius: 16px; border: 1px solid ${border}; margin: 1.5rem 0; display: block; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; } 
        ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 10px; }
        .sidebar-note:hover { background: ${accentSoft}; }
        .folder-name-input { background: transparent; border: none; outline: none; font-size: 0.7rem; font-family: 'Georgia', serif; letter-spacing: 0.12em; text-transform: uppercase; color: ${textSecondary}; font-weight: bold; width: 100%; cursor: text; }
        .folder-name-input:focus { color: ${accent}; }
        .toolbar-btn { background: none; border: none; cursor: pointer; padding: 8px 10px; border-radius: 8px; color: ${textSecondary}; transition: all 0.15s; display: flex; align-items: center; gap: 4px; }
        .toolbar-btn:hover { background: ${accentSoft}; color: ${accent}; }
        .toolbar-btn.active { background: ${accentSoft}; color: ${accent}; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .note-title-input { background: transparent; border: none; outline: none; font-family: 'Georgia', serif; font-size: clamp(1.8rem, 4vw, 3rem); font-weight: normal; color: ${textPrimary}; width: 100%; letter-spacing: -0.03em; line-height: 1.2; }
        .note-title-input::placeholder { color: ${textSecondary}; opacity: 0.4; }
      `}</style>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        style={{ background: bgSide, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0, zIndex: 20 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <div style={{ padding: "24px 20px 16px", flexShrink: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BookOpen size={18} style={{ color: accent }} />
              <span style={{ fontFamily: "'Georgia', serif", fontSize: "1.1rem", color: textPrimary, letterSpacing: "-0.02em" }}>Notes</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setTheme(isDark ? "light" : "dark")} className="toolbar-btn" style={{ padding: 6 }}>
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              <button onClick={createFolder} className="toolbar-btn" style={{ padding: 6 }} title="New folder">
                <FolderPlus size={15} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: textSecondary, pointerEvents: "none" }} />
            <input
              type="text" placeholder="Search notes…" value={searchQ} onChange={e => setSearchQ(e.target.value)}
              style={{ width: "100%", paddingLeft: 34, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 10, background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${border}`, fontSize: "0.8rem", color: textPrimary, outline: "none", fontFamily: "'Georgia', serif" }}
            />
          </div>
        </div>

        {/* Folders */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 24px" }}>
          {folders
            .map(f => ({ ...f, files: f.files.filter(n => n.name.toLowerCase().includes(searchQ.toLowerCase())) }))
            .filter(f => f.files.length > 0 || searchQ === "")
            .map(folder => (
              <div key={folder.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", marginBottom: 4 }} className="group/folder">
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                    <button onClick={() => setFolders(prev => prev.map(f => f.id === folder.id ? { ...f, expanded: !f.expanded } : f))} style={{ background: "none", border: "none", cursor: "pointer", color: textSecondary, padding: 0, display: "flex" }}>
                      {folder.expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </button>
                    <span style={{ fontSize: "0.7rem" }}>{folder.icon}</span>
                    <input
                      className="folder-name-input"
                      value={folder.name}
                      onChange={e => renameFolder(folder.id, e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 2, opacity: 0 }} className="folder-actions">
                    <button onClick={() => createNote(folder.id)} style={{ background: "none", border: "none", cursor: "pointer", color: textSecondary, padding: 3 }}><FilePlus size={12} /></button>
                    <button onClick={() => deleteFolder(folder.id)} style={{ background: "none", border: "none", cursor: "pointer", color: textSecondary, padding: 3 }}><Trash2 size={12} /></button>
                  </div>
                </div>

                <AnimatePresence>
                  {folder.expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                      {folder.files.map(file => (
                        <div key={file.id} style={{ position: "relative" }} className="file-row">
                          <button
                            onClick={() => setActiveId(file.id)}
                            className="sidebar-note"
                            style={{
                              width: "100%", background: activeId === file.id ? accentSoft : "transparent",
                              border: "none", cursor: "pointer", textAlign: "left",
                              padding: "9px 28px 9px 28px", borderRadius: 10, display: "flex", alignItems: "center", gap: 8,
                              transition: "all 0.15s",
                              borderLeft: activeId === file.id ? `2px solid ${accent}` : "2px solid transparent",
                            }}
                          >
                            <StickyNote size={13} style={{ color: activeId === file.id ? accent : textSecondary, flexShrink: 0 }} />
                            <span style={{ fontSize: "0.85rem", fontFamily: "'Georgia', serif", color: activeId === file.id ? accent : textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.4, letterSpacing: "0.01em" }}>
                              {file.name}
                            </span>
                          </button>
                          <button onClick={() => deleteNote(file.id)} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: textSecondary, padding: 4, opacity: 0, transition: "opacity 0.15s" }} className="delete-btn">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
        </div>

        {/* Profile */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: accentSoft, border: `1px solid ${accent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: accent, fontWeight: 600, flexShrink: 0 }}>VV</div>
            <div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: textPrimary, letterSpacing: "0.01em" }}>Vatsal Varshney</p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: textSecondary }}>{allFiles.length} notes</p>
            </div>
          </div>
        </div>

        <style>{`
          .folder-actions { display: none !important; }
          .group\/folder:hover .folder-actions { display: flex !important; opacity: 1 !important; }
          .file-row:hover .delete-btn { opacity: 1 !important; }
        `}</style>
      </motion.aside>

      {/* Main Editor */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {/* Toolbar */}
        <div style={{
          padding: "12px 28px", borderBottom: `1px solid ${border}`,
          display: "flex", alignItems: "center", gap: 4, background: isDark ? "rgba(15,14,12,0.9)" : "rgba(250,248,243,0.9)",
          backdropFilter: "blur(12px)", zIndex: 10, flexShrink: 0
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toolbar-btn" title="Toggle sidebar">
            <AlignLeft size={17} />
          </button>
          <div style={{ width: 1, height: 22, background: border, margin: "0 6px" }} />
          <button onMouseDown={e => { e.preventDefault(); exec("bold"); }} className="toolbar-btn"><Bold size={15} /></button>
          <button onMouseDown={e => { e.preventDefault(); exec("italic"); }} className="toolbar-btn"><Italic size={15} /></button>
          <button onMouseDown={e => { e.preventDefault(); exec("underline"); }} className="toolbar-btn"><Underline size={15} /></button>
          <button onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }} className="toolbar-btn"><List size={15} /></button>
          <button onMouseDown={e => { e.preventDefault(); exec("formatBlock", "h2"); }} className="toolbar-btn"><Hash size={15} /></button>
          <div style={{ width: 1, height: 22, background: border, margin: "0 6px" }} />
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowStickers(!showStickers)} className={`toolbar-btn ${showStickers ? "active" : ""}`}>
              <span style={{ fontSize: 14 }}>✦</span>
              <span style={{ fontSize: "0.72rem", letterSpacing: "0.06em", fontFamily: "'Georgia', serif" }}>Stickers</span>
            </button>
            <AnimatePresence>
              {showStickers && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: bgCard, border: `1px solid ${border}`, borderRadius: 16, padding: 12, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, zIndex: 50, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", width: 200 }}>
                  {STICKERS.map(s => (
                    <button key={s} onClick={() => { exec("insertHTML", `<span style="font-size:1.4em;margin:0 2px">${s}</span>`); setShowStickers(false); }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, fontSize: "1.1rem", transition: "all 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = accentSoft}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "none"}>
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => setShowDrawing(true)} className="toolbar-btn">
            <PenTool size={15} />
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.06em", fontFamily: "'Georgia', serif" }}>Sketch</span>
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={handleAI} disabled={isSummarizing} className="toolbar-btn"
            style={{ padding: "8px 16px", background: accentSoft, color: accent, borderRadius: 10, fontSize: "0.75rem", fontFamily: "'Georgia', serif", letterSpacing: "0.05em", opacity: isSummarizing ? 0.6 : 1 }}>
            <Sparkles size={14} />
            {isSummarizing ? "Thinking…" : "Summarise"}
          </button>
        </div>

        {/* Editor Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "48px 10vw" }}>
          <AnimatePresence mode="wait">
            {currentNote ? (
              <motion.div key={activeId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }} style={{ maxWidth: 700, margin: "0 auto" }}>
                <input
                  value={currentNote.name}
                  onChange={e => setFolders(prev => prev.map(f => ({ ...f, files: f.files.map(n => n.id === activeId ? { ...n, name: e.target.value } : n) })))}
                  className="note-title-input"
                  placeholder="Untitled"
                  style={{ display: "block", marginBottom: 8 }}
                />
                <div style={{ width: 48, height: 2, background: accent, borderRadius: 2, marginBottom: 32, opacity: 0.6 }} />
                <div
                  ref={editorRef} contentEditable onInput={onInput} onMouseUp={saveSelection} onKeyUp={saveSelection}
                  className="note-editor" data-placeholder="Begin writing…"
                  style={{ minHeight: 400, fontSize: "1.05rem", lineHeight: 1.85, color: isDark ? "#c4b89e" : "#4a3728" }}
                />
              </motion.div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", textAlign: "center", gap: 16 }}>
                <div style={{ fontSize: "3rem", opacity: 0.2 }}>📝</div>
                <p style={{ color: textSecondary, fontStyle: "italic", fontSize: "1.1rem", opacity: 0.6 }}>Select a note or create a new one</p>
                <button onClick={() => folders[0] && createNote(folders[0].id)}
                  style={{ padding: "10px 24px", background: accentSoft, color: accent, border: `1px solid ${accent}40`, borderRadius: 10, cursor: "pointer", fontSize: "0.85rem", fontFamily: "'Georgia', serif" }}>
                  New Note
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Bar */}
        <div style={{ padding: "10px 28px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: isDark ? "rgba(15,14,12,0.9)" : "rgba(250,248,243,0.9)", backdropFilter: "blur(12px)", flexShrink: 0 }}>
          <span style={{ fontSize: "0.72rem", color: textSecondary, fontFamily: "'Georgia', serif", letterSpacing: "0.05em" }}>
            {currentNote ? `${currentNote.name}` : "No note selected"}
          </span>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <span style={{ fontSize: "0.72rem", color: textSecondary, fontFamily: "'Georgia', serif", letterSpacing: "0.05em" }}>
              {wordCount} words
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, opacity: 0.8 }} />
              <span style={{ fontSize: "0.72rem", color: textSecondary, fontFamily: "'Georgia', serif", letterSpacing: "0.05em" }}>Saved</span>
            </div>
          </div>
        </div>
      </main>

      {showDrawing && (
        <DrawingBoard isDark={isDark} onClose={() => setShowDrawing(false)} onSave={data => exec("insertHTML", `<img src="${data}" class="sketch-img" />`)} />
      )}

      {/* Ambient bg */}
      <div style={{ position: "fixed", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: isDark ? "rgba(196,168,130,0.03)" : "rgba(139,69,19,0.04)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />
    </div>
  );
}