"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { Layers, ArrowUpRight, Sparkles, Zap, GraduationCap } from "lucide-react";
import { Subject } from "@/lib/content-types";
import { useRef, useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
};

function CourseCard({ subject, index }: { subject: Subject, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // For Tilt
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);

    // For Spotlight
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const lessonCount = subject.topics.reduce((a, t) => a + t.lessons.length, 0);

  return (
    <motion.div 
      variants={itemVariants} 
      className="group h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1500 }}
    >
      <Link 
        href={`/curriculum/${subject.id}`} 
        className="block h-full"
      >
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY }}
          className="relative h-full p-1 border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 rounded-[3rem] overflow-hidden transition-all duration-700 hover:border-indigo-500/50 hover:bg-indigo-500/[0.03] shadow-2xl hover:shadow-indigo-500/10 active:scale-[0.98]"
        >
          {/* Spotlight Glow */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
            style={{
              background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />
          
          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 p-10 md:p-12">
            {/* Visual Side */}
            <div className="flex-shrink-0">
              <div className="relative w-28 h-28 rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-6xl shadow-premium group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 group-hover:shadow-indigo-500/30 group-hover:border-indigo-500/20 backdrop-blur-xl">
                {subject.icon}
                <div className="absolute inset-0 rounded-[2rem] bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors" />
                <div className="absolute -inset-1 rounded-[2.1rem] border border-indigo-500/0 group-hover:border-indigo-500/20 transition-all duration-700" />
              </div>
            </div>

            {/* Content Side */}
            <div className="flex-grow flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black tracking-[0.3em] text-indigo-500 uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  Unit {String(index + 1).padStart(2, '0')}
                </span>
                <div className="h-px flex-grow bg-gradient-to-r from-[var(--border-subtle)] to-transparent" />
              </div>

              <h3 className="display-heading text-4xl md:text-5xl mb-6 leading-tight group-hover:text-indigo-500 transition-colors duration-500">
                {subject.name}
              </h3>
              
              <p className="text-[var(--text-secondary)] text-lg mb-10 leading-relaxed font-medium line-clamp-2 group-hover:text-[var(--text-primary)] transition-colors">
                {subject.description}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] shadow-sm backdrop-blur-md group-hover:border-indigo-500/20 group-hover:bg-indigo-500/5 transition-all duration-500">
                  <Layers size={18} className="text-indigo-500" />
                  <span className="text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    {subject.topics.length} Sections
                  </span>
                </div>
                
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] shadow-sm backdrop-blur-md group-hover:border-amber-500/20 group-hover:bg-amber-500/5 transition-all duration-500">
                  <Zap size={18} className="text-amber-500" />
                  <span className="text-[12px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    {lessonCount} Labs
                  </span>
                </div>
              </div>
            </div>

            {/* Corner Action */}
            <div className="absolute top-10 right-10 w-16 h-16 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
              <ArrowUpRight size={28} />
            </div>
          </div>

          {/* Progress-like decorative bar */}
          <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 group-hover:w-full transition-all duration-1000 ease-out opacity-60 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function CoursesList({ subjects }: { subjects: Subject[] }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 xl:grid-cols-2 gap-12"
    >
      {subjects.map((subject, i) => (
        <CourseCard key={subject.id} subject={subject} index={i} />
      ))}
    </motion.div>
  );
}

