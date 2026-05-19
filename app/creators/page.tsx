"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, Code, Sparkles, User, Eye } from "lucide-react";
import Link from "next/link";

import Image from "next/image";

const creators = [
  {
    name: "Vatsal Varshney",
    role: "Developer",
    bio: "A polymath developer specializing in AI/ML, Cyber Security, and Web Development. Competitive programmer at heart, architecting the next frontier of interactive computer science education.",
    image: "https://unavatar.io/linkedin/vatsal-varshney108",
    links: {
      linkedin: "https://linkedin.com/in/vatsal-varshney108",
      github: "https://github.com/vatsalvarshney108",
      email: "mailto:vatsalvarshney108@gmail.com"
    },
    skills: ["AI & ML", "Cyber Security", "Web Development", "Competitive Programming", "Next.js", "Python"]
  },
  {
    name: "Vidya Prajapati",
    role: "UI/UX & Content Engineer",
    bio: "Creative engineer focused on crafting intuitive user experiences and high-quality educational content. Passionate about blending aesthetics with functional clarity.",
    image: "https://unavatar.io/linkedin/vidya-prajapati-5b4363325",
    links: {
      linkedin: "https://www.linkedin.com/in/vidya-prajapati-5b4363325/",
      github: "https://github.com/vidya404",
      email: "mailto:vidyaprajapati@example.com"
    },
    skills: ["UI/UX Design", "React", "Next.js", "Content Architecture", "Frontend Development"]
  }
];

export default function CreatorsPage() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const toggleReveal = (name: string) => {
    setRevealed(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--text-primary)] selection:text-[var(--bg-primary)] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic mb-6">
              The <span className="text-outline">Architects</span>
            </h1>
            <p className="text-xl text-[var(--text-muted)] font-medium max-w-2xl mx-auto leading-relaxed">
              Meet the minds behind CoreCode. Crafting the future of interactive computer science education.
            </p>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 gap-32">
          {creators.map((creator, idx) => (
            <motion.div
              key={creator.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-16 md:gap-24"
            >
              {/* Profile Image */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-[var(--accent-glow)] rounded-[2.5rem] blur-2xl group-hover:bg-[var(--accent-soft)] transition-all duration-500" />
                <div 
                  onClick={() => toggleReveal(creator.name)}
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2rem] overflow-hidden border border-[var(--border-color)] group-hover:border-[var(--text-primary)]/30 transition-all duration-500 bg-[var(--bg-secondary)] cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    {!revealed[creator.name] ? (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[var(--bg-secondary)]"
                      >
                        <div className="w-20 h-20 rounded-full bg-[var(--text-primary)]/5 flex items-center justify-center border border-[var(--border-color)]">
                          <Eye size={32} className="text-[var(--text-muted)] animate-pulse" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Click to identify</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="image"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={creator.image}
                          alt={creator.name}
                          fill
                          className="object-cover transition-all duration-700"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-8 text-center md:text-left">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest text-indigo-500">
                      {creator.role}
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
                    {creator.name}
                  </h2>
                  <p className="text-xl text-[var(--text-secondary)] leading-relaxed font-medium">
                    {creator.bio}
                  </p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {creator.skills.map(skill => (
                    <span key={skill} className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]/20 transition-all cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                  <Link href={creator.links.linkedin} target="_blank" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </Link>
                  <Link href={creator.links.github} target="_blank" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                  </Link>
                  <Link href={creator.links.email} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <Mail size={24} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-40 pt-20 border-t border-[var(--border-color)] flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-2 text-[var(--text-muted)] font-bold text-sm uppercase tracking-[0.3em]">
            Built with <Heart size={14} className="text-red-500 fill-red-500" /> for the community
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">
              <Code size={12} /> Version 4.0.0
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">
              <Sparkles size={12} /> Premium Edition
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .text-outline {
          -webkit-text-stroke: 1.5px var(--text-primary);
          color: transparent;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .text-outline:hover {
          color: var(--text-primary);
          filter: drop-shadow(0 0 15px var(--accent-glow));
        }
      `}</style>
    </div>
  );
}

