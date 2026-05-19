"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import { FileText, ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";
import { Topic } from "@/lib/content-types";
import { useRef, useState, useEffect } from "react";
import Magnetic from "./Magnetic";

interface TopicExplorerProps {
  topics: Topic[];
  subjectId: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

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
      className={`premium-card relative group/card !rounded-[3rem] overflow-hidden ${className}`}
      style={{
        "--mouse-x": `${mousePosition.x}px`,
        "--mouse-y": `${mousePosition.y}px`,
      } as any}
    >
      {/* Spotlight Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.08), transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--text-primary)]/[0.03] to-transparent pointer-events-none" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function TopicExplorer({ topics, subjectId }: TopicExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative" ref={containerRef}>
      {/* Dynamic Learning Path Line */}
      <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 hidden sm:block">
        {/* Background Line */}
        <div className="absolute inset-0 w-px bg-indigo-500/10 left-1/2 -translate-x-1/2" />
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent origin-top rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          style={{ height: "100%", scaleY: pathLength }}
        />

        {/* Traveling Particle */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--text-primary)] rounded-full shadow-[0_0_20px_var(--text-primary),0_0_40px_rgba(99,102,241,0.8)] z-20"
          style={{ 
            top: useTransform(pathLength, [0, 1], ["0%", "100%"]),
            opacity: useTransform(pathLength, [0, 0.05, 0.95, 1], [0, 1, 1, 0])
          }}
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-8 relative z-10"
      >
        {topics.map((topic, i) => (
          <motion.div key={topic.id} variants={itemVariants} className="group/item">
            <Link
              href={`/curriculum/${subjectId}/${topic.id}`}
              className="relative flex flex-col sm:flex-row gap-8 md:gap-14 items-start md:items-center"
            >
              {/* Magnetic Node */}
              <div className="flex-shrink-0 relative z-20">
                <Magnetic>
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--border-subtle)] group-hover/item:border-indigo-500/50 flex items-center justify-center transition-all duration-700 shadow-2xl relative backdrop-blur-xl overflow-hidden">
                     {/* Glass effect */}
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-700" />
                     
                     <span className="text-xl md:text-3xl font-black text-[var(--text-primary)] opacity-20 group-hover/item:opacity-100 transition-all duration-700 tabular-nums">
                       {String(i + 1).padStart(2, '0')}
                     </span>
                     
                     {/* Internal Pulse */}
                     <div className="absolute inset-2 rounded-full border border-indigo-500/0 group-hover/item:border-indigo-500/20 group-hover/item:scale-110 transition-all duration-700" />
                  </div>
                </Magnetic>
                
                {/* Outer Glow */}
                <div className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover/item:bg-indigo-500/5 blur-xl transition-all duration-700 -z-10" />
              </div>

              {/* Topic Card */}
              <div className="flex-grow w-full">
                <SpotlightCard className="!p-1 !rounded-[2.5rem] group-hover/item:translate-x-2 transition-transform duration-700">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-6">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "auto" }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                               <Sparkles size={12} className="animate-pulse" />
                               Interactive Lab
                            </div>
                          </motion.div>
                          
                          <div className="h-px w-12 bg-gradient-to-r from-indigo-500/20 to-transparent" />
                        </div>
                        
                        <h3 className="display-heading text-2xl md:text-3xl mb-4 group-hover/item:text-indigo-500 transition-colors duration-500">
                          {topic.name}
                        </h3>

                        {topic.description && (
                          <p className="text-[var(--text-secondary)] text-[14px] leading-relaxed mb-6 line-clamp-2 max-w-2xl">
                            {topic.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-8">
                          <div className="flex items-center gap-2.5 text-[var(--text-secondary)] font-semibold text-[13px] tracking-tight group-hover/item:text-[var(--text-primary)] transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/5 flex items-center justify-center text-indigo-500 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all duration-500">
                              <FileText size={14} />
                            </div>
                            <span>{topic.lessons.length} Engineering Lessons</span>
                          </div>
                          
                          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[var(--border-subtle)]" />
                          
                          <div className="flex items-center gap-2.5 text-[var(--text-secondary)] font-semibold text-[13px] tracking-tight group-hover/item:text-[var(--text-primary)] transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/5 flex items-center justify-center text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all duration-500">
                              <CheckCircle2 size={14} />
                            </div>
                            <span>Certification Enabled</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-6">
                         <div className="hidden lg:flex flex-col items-end">
                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">Track Status</span>
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-indigo-500/20 animate-pulse" />
                               <span className="text-[13px] font-bold text-[var(--text-primary)]">Ready for Launch</span>
                            </div>
                         </div>
                         
                         <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover/item:bg-indigo-500 group-hover/item:text-white group-hover/item:border-indigo-400 transition-all duration-700 group-hover/item:scale-110 group-hover/item:rotate-12 group-hover/item:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                           <ArrowRight size={22} className="group-hover/item:translate-x-1 transition-transform" />
                         </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Progress Bar */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-0 group-hover/item:w-full transition-all duration-1000 ease-in-out opacity-50" />
                </SpotlightCard>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

