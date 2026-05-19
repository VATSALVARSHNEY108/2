"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  Award, 
  Star, 
  ExternalLink, 
  Code, 
  Code2,
  Globe, 
  Briefcase,
  Settings,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight
} from "lucide-react";

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

export default function ProfilePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const stats = [
    { label: "Lessons Mastered", value: "124", icon: <Zap size={20} />, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Learning Streak", value: "14 Days", icon: <Flame size={20} />, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Engineering XP", value: "12,450", icon: <TrendingUp size={20} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Certifications", value: "8", icon: <ShieldCheck size={20} />, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const recentActivity = [
    { type: "Lesson Completed", title: "Minimum Window Substring", category: "Arrays & Hashing", time: "2 hours ago", xp: "+250 XP" },
    { type: "Achievement Earned", title: "Graph Master", category: "Algorithms", time: "Yesterday", xp: "+500 XP" },
    { type: "Module Started", title: "Advanced Dynamic Programming", category: "System Design", time: "2 days ago", xp: "" },
  ];

  const achievements = [
    { name: "Achievement 1", description: "to be declare", icon: "🏆", rarity: "Common" },
    { name: "Achievement 2", description: "to be declare", icon: "⭐", rarity: "Common" },
    { name: "Achievement 3", description: "to be declare", icon: "🏅", rarity: "Common" },
    { name: "Achievement 4", description: "to be declare", icon: "🎖️", rarity: "Common" },
  ];

  return (
    <div className="relative min-h-screen selection:bg-indigo-500 selection:text-white pb-24" ref={containerRef}>
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[130px]" />
      </div>

      <div className="section-container pt-32">
        {/* Profile Hero Section */}
        <motion.section 
          style={{ opacity, scale }}
          className="mb-20"
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-16">
            <div className="relative group">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-[3.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 shadow-2xl transform transition-transform duration-700 group-hover:scale-105 group-hover:rotate-3">
                <div className="w-full h-full rounded-[3.3rem] bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden border-4 border-[var(--bg-primary)]">
                  <img 
                    src="/profile_photo.jpg" 
                    alt="Vatsal Varshney"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-3xl bg-indigo-500 border-4 border-[var(--bg-primary)] flex items-center justify-center text-white shadow-xl animate-bounce-slow">
                <Trophy size={28} />
              </div>
            </div>

            <div className="flex-grow text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                <span className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              
              <h1 className="display-heading text-6xl md:text-8xl mb-6 leading-none flex flex-wrap items-center gap-6">
                Vatsal Varshney<span className="text-indigo-500">.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-medium max-w-2xl mb-8 leading-relaxed">
                just a normal guy
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-[var(--text-muted)] text-sm font-bold">
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-indigo-500" />
                  India
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar size={16} className="text-indigo-500" />
                  Joined May 2024
                </div>
                <div className="flex items-center gap-2.5">
                  <Code size={16} className="hover:text-indigo-500 cursor-pointer transition-colors" />
                  <Globe size={16} className="hover:text-indigo-500 cursor-pointer transition-colors" />
                  <Briefcase size={16} className="hover:text-indigo-500 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-4">
              <button className="px-8 py-4 rounded-2xl bg-[var(--text-primary)] text-[var(--bg-primary)] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                Edit Profile
              </button>
              <button className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-indigo-500 transition-all hover:border-indigo-500/50">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Left Column: Stats & Progress */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <SpotlightCard className="!p-8 h-full">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-premium`}>
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em]">
                      {stat.label}
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Layers size={20} />
                  </div>
                  <h2 className="display-heading text-3xl">Recent Activity</h2>
                </div>
                <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline">
                  View Full History
                </button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <motion.div 
                    key={activity.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="premium-card !p-6 md:!p-8 group hover:border-indigo-500/30 transition-all duration-500">
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                            {activity.type.includes("Lesson") ? <Target size={20} /> : <Award size={20} />}
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                              {activity.type}
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1 group-hover:translate-x-1 transition-transform">
                              {activity.title}
                            </h3>
                            <div className="text-xs text-[var(--text-muted)] font-medium">
                              {activity.category} • {activity.time}
                            </div>
                          </div>
                        </div>
                        {activity.xp && (
                          <div className="px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-xs font-black">
                            {activity.xp}
                          </div>
                        )}
                        <div className="hidden sm:flex w-10 h-10 rounded-full bg-[var(--bg-primary)] items-center justify-center text-[var(--text-muted)] opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Achievements & Skills */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Achievement Gallery */}
            <SpotlightCard className="!p-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Star size={20} />
                </div>
                <h2 className="display-heading text-2xl">Elite Badges</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {achievements.map((ach) => (
                  <div 
                    key={ach.name}
                    className="group/ach p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-indigo-500/30 transition-all text-center cursor-help relative"
                    title={ach.description}
                  >
                    <div className="text-4xl mb-4 group-hover/ach:scale-125 group-hover/ach:-rotate-6 transition-transform duration-500">
                      {ach.icon}
                    </div>
                    <div className="text-[11px] font-black text-[var(--text-primary)] mb-1 leading-tight">
                      {ach.name}
                    </div>
                    <div className={`text-[8px] font-black uppercase tracking-widest ${
                      ach.rarity === "Legendary" ? "text-orange-500" : 
                      ach.rarity === "Epic" ? "text-purple-500" : 
                      ach.rarity === "Rare" ? "text-indigo-500" : "text-[var(--text-muted)]"
                    }`}>
                      {ach.rarity}
                    </div>
                    
                    {/* Tooltip-like effect on hover */}
                    <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover/ach:opacity-5 rounded-3xl transition-opacity" />
                  </div>
                ))}
              </div>

              <button className="w-full mt-10 py-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-indigo-500 hover:border-indigo-500/30 font-black text-[10px] uppercase tracking-widest transition-all">
                View All 42 Achievements
              </button>
            </SpotlightCard>

            {/* Skills Progress */}
            <SpotlightCard className="!p-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Code2 size={20} />
                </div>
                <h2 className="display-heading text-2xl">Mastered Skills</h2>
              </div>

              <div className="space-y-8">
                {[
                  { skill: "Data Structures", level: 92, color: "bg-indigo-500" },
                  { skill: "System Design", level: 78, color: "bg-purple-500" },
                  { skill: "Algorithms", level: 85, color: "bg-emerald-500" },
                  { skill: "Backend Engineering", level: 65, color: "bg-amber-500" },
                ].map((skill) => (
                  <div key={skill.skill}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">{skill.skill}</span>
                      <span className="text-xs font-black text-indigo-500">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full ${skill.color} shadow-[0_0_10px_rgba(99,102,241,0.3)]`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>

          </div>
        </div>
      </div>
    </div>
  );
}
