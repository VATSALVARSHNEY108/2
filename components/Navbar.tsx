"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Search, User, Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import dynamic from "next/dynamic";
const SearchModal = dynamic(() => import("./SearchModal"), { ssr: false });
import React, { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Explore" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/notes", label: "Notes" },
  { href: "/playground", label: "Playground" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <>
      <nav
        className="nav-blur left-0 right-0"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo className="w-8 h-8 transition-transform group-hover:rotate-12" />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-black tracking-tighter text-[var(--text-primary)] leading-none">
                CoreCode
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${active
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-[var(--accent-soft)] rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all group"
            >
              <Search size={16} className="group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest">Search</span>
              <kbd className="hidden lg:flex items-center h-5 px-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[10px] opacity-60 text-[var(--text-primary)]">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/creators"
              className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all font-bold text-[10px] uppercase tracking-widest"
            >
              Creators
            </Link>

            <ThemeToggle />

            <button
              onClick={() => {
                window.location.href = '/do-not-click.html';
              }}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-[9px] uppercase tracking-widest animate-pulse hover:animate-none group relative overflow-hidden"
            >
              <span className="relative z-10">Don't Click</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>


            <Link
              href="/profile"
              className="hidden sm:flex w-9 h-9 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
            >
              <User size={18} />
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] transition-all"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-[calc(100%+1px)] left-0 right-0 p-4 bg-[var(--bg-primary)] border-b border-[var(--border-color)] shadow-2xl z-[110]"
            >
              <div className="flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${pathname === link.href
                        ? "bg-[var(--accent-soft)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/creators"
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${pathname === "/creators"
                      ? "bg-[var(--accent-soft)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                    }`}
                >
                  Creators
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
