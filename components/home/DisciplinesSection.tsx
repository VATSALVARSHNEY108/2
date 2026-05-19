"use client";
import Link from "next/link";
import { ArrowUpRight, Code, Brain, Cpu, Zap } from "lucide-react";

const subjects = [
  { id: "dsa", name: "Data Structures", description: "Master algorithms through visualized logic and real-time complexity analysis.", icon: <Code size={24} />, chapters: 13 },
  { id: "artificial-intelligence", name: "Intelligence", description: "Explore neural networks and machine learning with interactive node visualizations.", icon: <Brain size={24} />, chapters: 16 },
];

export default function DisciplinesSection() {
  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <span className="section-label">Laboratory Access</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[var(--text-primary)] mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>Core Disciplines</h2>
          <div className="w-24 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {subjects.map((subject, i) => (
            <Link key={subject.id} href={`/curriculum/${subject.id}`} className="discipline-card group">
              <div className="absolute top-10 right-10 text-xs font-black opacity-10 tabular-nums">0{i + 1}</div>
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] group-hover:text-indigo-500 group-hover:scale-110 transition-all duration-500 mb-10">
                {subject.icon}
              </div>
              <h3 className="text-3xl font-black tracking-tight text-[var(--text-primary)] mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>{subject.name}</h3>
              <p className="text-[var(--text-secondary)] font-medium leading-relaxed mb-12 opacity-80">{subject.description}</p>
              <div className="mt-auto pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">{subject.chapters} Chapters</span>
                <div className="w-10 h-10 rounded-full bg-indigo-500/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
