"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { 
  BookOpen, 
  Flame, 
  ChevronRight, 
  Trophy, 
  Target, 
  Zap, 
  Layers, 
  Sparkles, 
  ArrowRight 
} from "lucide-react";
import { Subject } from "@/lib/content-types";
import { useProgress } from "@/lib/useProgress";

// Helper for glassmorphism cards with spotlight
function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`premium-card relative group/card !rounded-[2.5rem] overflow-hidden ${className}`}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.08), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface DashboardClientProps {
  subjects: Subject[];
}

export default function DashboardClient({ subjects }: DashboardClientProps) {
  const { completedLessons } = useProgress();
  const totalTopics = subjects.reduce((a, s) => a + s.topics.length, 0);
  const totalLessons = subjects.reduce((a, s) => a + s.topics.reduce((ta, t) => ta + t.lessons.length, 0), 0);

  const stats = [
    { label: "Lessons Completed", value: completedLessons.length, icon: <Trophy size={20} />, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Total Curriculum", value: totalLessons, icon: <Target size={20} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Mastery Level", value: `${Math.round((completedLessons.length / (totalLessons || 1)) * 100)}%`, icon: <Zap size={20} />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] selection:bg-indigo-500 selection:text-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
      
      <div className="relative z-10 section-container pt-32 pb-24">

        {/* Header */}
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-500 text-[10px] font-black tracking-[0.2em] uppercase mb-8 shadow-sm backdrop-blur-sm"
          >
            <Sparkles size={14} className="animate-pulse" />
            Learning Overview
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="display-heading text-6xl md:text-8xl mb-6 tracking-tighter"
          >
            Your Progress<span className="text-indigo-500">.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[var(--text-secondary)] font-medium max-w-2xl"
          >
            Welcome back to your high-performance engineering environment. 
            Track your mastery and maintain your learning velocity.
          </motion.p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-24">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <SpotlightCard className="!p-8">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-premium`}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-[var(--text-primary)] mb-2 tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Active Topics */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-12 border-b border-[var(--border-subtle)] pb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Layers size={20} />
                </div>
                <h2 className="display-heading text-4xl">Active Tracks</h2>
              </div>
              <Link href="/curriculum" className="text-[10px] font-black text-indigo-500 hover:underline uppercase tracking-widest flex items-center gap-2 group">
                Browse All
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid gap-6">
              {subjects.map((subject, i) => {
                const lessonCount = subject.topics.reduce((a: number, t: any) => a + t.lessons.length, 0);
                return (
                  <motion.div 
                    key={subject.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Link href={`/curriculum/${subject.id}`} className="group block">
                      <SpotlightCard className="!p-6 md:!p-8 group-hover:translate-x-2 transition-all duration-500 group-hover:border-indigo-500/30">
                        <div className="flex items-center gap-8">
                          <div className="w-20 h-20 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-5xl shadow-premium group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 group-hover:border-indigo-500/20 backdrop-blur-xl">
                            {subject.icon}
                          </div>
                          <div className="flex-grow">
                            <h3 className="display-heading text-2xl mb-2 group-hover:text-indigo-500 transition-colors">
                              {subject.name}
                            </h3>
                            <div className="flex items-center gap-5 text-[var(--text-muted)] text-xs font-bold tracking-tight">
                              <span className="flex items-center gap-2">
                                <Target size={14} className="text-indigo-500" />
                                {subject.topics.length} TOPICS
                              </span>
                              <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
                              <span className="flex items-center gap-2">
                                <Zap size={14} className="text-amber-500" />
                                {lessonCount} LABS
                              </span>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-indigo-500 group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                            <ChevronRight size={22} />
                          </div>
                        </div>
                      </SpotlightCard>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Goal & Achievements */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Daily Goal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="relative p-10 rounded-[3rem] bg-[var(--text-primary)] text-[var(--bg-primary)] overflow-hidden shadow-2xl group">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -z-0 pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                      <Zap size={28} />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-1">Daily Target</div>
                      <div className="text-4xl font-black tracking-tight">85%</div>
                    </div>
                  </div>

                  <h3 className="display-heading text-3xl mb-4 leading-tight">Turbocharge<br />Your Progress.</h3>
                  <p className="opacity-60 text-sm font-medium mb-10 leading-relaxed">
                    You're just 2 laboratory sessions away from hitting your daily engineering milestone.
                  </p>

                  <button className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/20">
                    Resume Mastery
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Achievements Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <SpotlightCard className="!p-8">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Trophy size={20} />
                  </div>
                  <h2 className="display-heading text-2xl">Milestones</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { emoji: "🔥", label: "7-Day Streak", desc: "Learning without breaks" },
                    { emoji: "📚", label: "Fast Reader", desc: "Top 5% reading speed" },
                  ].map((ach) => (
                    <div key={ach.label} className="flex items-center gap-5 p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-indigo-500/20 transition-all group/ach">
                      <div className="text-3xl group-hover/ach:scale-110 group-hover/ach:-rotate-6 transition-transform">
                        {ach.emoji}
                      </div>
                      <div>
                        <div className="text-sm font-black text-[var(--text-primary)] mb-1 leading-none">{ach.label}</div>
                        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tight">{ach.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
