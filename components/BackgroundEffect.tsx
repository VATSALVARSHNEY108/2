"use client";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";

import Image from "next/image";

export default function BackgroundEffect() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const width = window.innerWidth || 1;
        const height = window.innerHeight || 1;
        
        const xPercent = (clientX / width) * 100;
        const yPercent = (clientY / height) * 100;

        const doc = document.documentElement;
        doc.style.setProperty('--mouse-x', `${clientX}px`);
        doc.style.setProperty('--mouse-y', `${clientY}px`);
        doc.style.setProperty('--mouse-x-pc', `${xPercent}%`);
        doc.style.setProperty('--mouse-y-pc', `${yPercent}%`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!mounted) return null;

  const isDark = theme !== "light";
  const bg = isDark ? 'rgba(5, 5, 6, 1)' : 'rgba(255, 255, 255, 1)';

  return (
    <>
      {/* LAYER 1: Base Blurred Background */}
      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none bg-[var(--bg-primary)]">
        <Image
          src="/bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover blur-[16px] opacity-100"
          style={{ userSelect: "none" }}
        />
      </div>

      {/* LAYER 2: Clear Focus Area (CSS Variable Powered) */}
      <div 
        className="fixed inset-0 z-[2] overflow-hidden pointer-events-none"
        style={{ 
          WebkitMaskImage: `radial-gradient(circle 87px at var(--mouse-x) var(--mouse-y), black 0%, black 37px, transparent 100%)`,
          maskImage: `radial-gradient(circle 87px at var(--mouse-x) var(--mouse-y), black 0%, black 37px, transparent 100%)`,
          willChange: "mask-image, -webkit-mask-image",
          backfaceVisibility: "hidden"
        }}
      >
        <Image
          src="/bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ userSelect: "none" }}
        />
      </div>

      {/* LAYER 3: Main Mask (CSS Variable Powered) */}
      <div
        className="fixed inset-0 z-[3] pointer-events-none"
        style={{ 
          background: `radial-gradient(circle 100px at var(--mouse-x) var(--mouse-y), transparent 0%, ${bg} 100%)`,
          willChange: "background",
          backfaceVisibility: "hidden"
        }}
      />

      {/* LAYER 4: Technical Grid & Static Noise */}
      <div className="fixed inset-0 z-[4] pointer-events-none overflow-hidden">
        {/* Dot Grid Layer */}
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(var(--text-primary) 0.5px, transparent 0.5px)`,
            backgroundSize: '32px 32px'
          }}
        />
        {/* Optional: Subtle Line Grid for structure */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--text-primary) 1px, transparent 1px),
              linear-gradient(to bottom, var(--text-primary) 1px, transparent 1px)
            `,
            backgroundSize: '128px 128px'
          }}
        />
        {/* Simple static noise */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} 
        />
      </div>
    </>
  );
}
