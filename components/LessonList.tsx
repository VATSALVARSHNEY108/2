"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { PlayCircle, Clock, ArrowRight, BookOpen, Sparkles, Layers } from "lucide-react";
import { Lesson } from "@/lib/content-types";
import { useProgress } from "@/lib/useProgress";
import { useRef, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
};

function LessonCard({ lesson, subjectId, topicId, index }: { lesson: Lesson, subjectId: string, topicId: string, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { isCompleted, toggleLesson } = useProgress();
  const completed = isCompleted(lesson.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLesson(lesson.id);
  };

  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/curriculum/${subjectId}/${topicId}/${lesson.id}`}
        className="group relative block"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={cardRef}
          className={`premium-card !p-0 !rounded-[2rem] overflow-hidden transition-all duration-500 group-hover:border-indigo-500/40 group-hover:translate-x-2 shadow-2xl ${completed ? "border-emerald-500/30" : ""
            }`}
        >
          {/* Spotlight Effect */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.08), transparent 40%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8">
            <div className="flex items-center gap-6">
              {/* Index/Icon Box */}
              <div className="relative flex-shrink-0">
                <div className={`w-16 h-16 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center transition-all duration-500 shadow-premium ${completed ? "bg-emerald-500 text-white border-emerald-400" : "text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 group-hover:rotate-6"
                  }`}>
                  {completed ? <CheckCircle2 size={28} /> : <PlayCircle size={28} className="group-hover:scale-110 transition-transform" />}
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-black text-[var(--text-muted)] group-hover:text-indigo-500 group-hover:border-indigo-500/30 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              <div>
                <h3 className={`display-heading text-xl md:text-2xl mb-2 transition-colors ${completed ? "text-emerald-500/80" : "group-hover:text-indigo-500"
                  }`}>
                  {lesson.name}
                </h3>
                <div className="flex flex-wrap items-center gap-5 text-[var(--text-secondary)] text-xs font-bold tracking-tight">
                  <span className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-colors ${completed ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-emerald-500/5 border-emerald-500/10 text-emerald-500"
                    }`}>
                    <BookOpen size={14} />
                    {completed ? "MASTERED" : "INTERACTIVE LAB"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleToggle}
                className={`p-3 rounded-xl border transition-all active:scale-90 ${completed
                  ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20"
                  : "bg-[var(--text-primary)]/5 border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-emerald-500 hover:border-emerald-500/30"
                  }`}
                title={completed ? "Mark as Incomplete" : "Mark as Complete"}
              >
                {completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
              <div className="px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold text-[10px] uppercase tracking-widest group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-500">
                {completed ? "Review Lab" : "Enter Lab"}
              </div>
            </div>
          </div>

          {/* Animated progress bar on hover */}
          <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-1000 ease-out opacity-40 ${completed
            ? "w-full from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            : "w-0 group-hover:w-full from-indigo-500 via-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            }`} />
        </div>
      </Link>
    </motion.div>
  );
}

export default function LessonList({ lessons, subjectId, topicId }: { lessons: Lesson[], subjectId: string, topicId: string }) {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-40 border-2 border-dashed border-[var(--border-subtle)] rounded-[3rem] bg-[var(--bg-elevated)]/20 backdrop-blur-xl">
        <div className="w-24 h-24 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-5xl shadow-premium animate-float">
          📝
        </div>
        <h3 className="display-heading text-3xl mb-4">Laboratory Under Maintenance</h3>
        <p className="text-lg text-[var(--text-secondary)] font-medium max-w-md mx-auto">
          Our engineering team is currently crafting the interactive simulations for this topic. Check back soon for the full experience.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid gap-6"
    >
      {lessons.map((lesson, i) => (
        <LessonCard key={lesson.id} lesson={lesson} subjectId={subjectId} topicId={topicId} index={i} />
      ))}
    </motion.div>
  );
}
