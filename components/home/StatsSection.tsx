"use client";
import { motion } from "framer-motion";

export default function StatsSection() {
  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="stat-card"
        >
          <div className="text-7xl font-black mb-4 text-[var(--text-primary)]" style={{ fontFamily: "'Outfit', sans-serif" }}>120+</div>
          <div className="section-label !mb-0">Interactive Modules</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="stat-card"
        >
          <div className="text-7xl font-black mb-4 text-[var(--text-primary)]" style={{ fontFamily: "'Outfit', sans-serif" }}>60FPS</div>
          <div className="section-label !mb-0">Smooth Visualizations</div>
        </motion.div>
      </div>
    </section>
  );
}
