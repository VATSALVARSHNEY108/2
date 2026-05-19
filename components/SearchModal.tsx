"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command, ArrowRight, BookOpen, Zap, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  title: string;
  href: string;
  subject: string;
  type: "lesson" | "subject";
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  const cachedContent = useRef<any>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchContent = async () => {
      setIsLoading(true);
      try {
        let subjects;
        if (cachedContent.current) {
          subjects = cachedContent.current;
        } else {
          const res = await fetch("/api/content");
          subjects = await res.json();
          cachedContent.current = subjects;
        }
        
        const matches: SearchResult[] = [];
        
        subjects.forEach((sub: any) => {
          if (sub.name.toLowerCase().includes(query.toLowerCase())) {
            matches.push({ title: sub.name, href: `/curriculum/${sub.id}`, subject: sub.name, type: "subject" });
          }
          sub.topics.forEach((topic: any) => {
            topic.lessons.forEach((lesson: any) => {
              if (lesson.name.toLowerCase().includes(query.toLowerCase())) {
                matches.push({ 
                  title: lesson.name, 
                  href: `/curriculum/${sub.id}/${topic.id}/${lesson.id}`, 
                  subject: sub.name,
                  type: "lesson"
                });
              }
            });
          });
        });

        setResults(matches.slice(0, 8));
        setSelectedIndex(0);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(searchContent, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
    } else if (e.key === "Enter" && results.length > 0) {
      router.push(results[selectedIndex].href);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [results, selectedIndex, router, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[1100] px-4"
          >
            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="relative flex items-center border-b border-[var(--border-color)] p-6 bg-[var(--bg-secondary)]">
                <Search className="absolute left-8 text-[var(--text-muted)]" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search curriculum..."
                  className="w-full bg-transparent pl-12 pr-12 text-xl font-bold outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                />
                <div className="absolute right-8 flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--text-primary)]/5 border border-[var(--border-color)] text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest shadow-sm">
                  ESC
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
                {!query && (
                  <div className="p-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--text-primary)]/5 flex items-center justify-center mx-auto text-[var(--text-primary)] border border-[var(--border-color)]">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">Quick Search</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-2">Start typing to explore the curriculum.</p>
                    </div>
                  </div>
                )}

                {query && results.length === 0 && !isLoading && (
                  <div className="p-12 text-center text-[var(--text-muted)]">
                    <p className="text-sm font-bold">No results found for "{query}"</p>
                  </div>
                )}

                <div className="space-y-1">
                  {results.map((result, index) => (
                    <button
                      key={result.href}
                      onClick={() => { router.push(result.href); onClose(); }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                        index === selectedIndex 
                          ? "bg-[var(--text-primary)]/5 border border-[var(--border-color)]" 
                          : "border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--text-primary)]/5 border border-[var(--border-color)] text-[var(--text-primary)]`}>
                          {result.type === "subject" ? <BookOpen size={18} /> : <Zap size={18} />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[var(--text-primary)]">{result.title}</h4>
                          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{result.subject}</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className={`transition-all text-[var(--text-primary)] ${index === selectedIndex ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] p-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                    <span className="px-1.5 py-0.5 rounded bg-[var(--text-primary)]/5 border border-[var(--border-color)]">↑↓</span>
                    Navigate
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                    <span className="px-1.5 py-0.5 rounded bg-[var(--text-primary)]/5 border border-[var(--border-color)]">ENTER</span>
                    Select
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Command size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Search</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
