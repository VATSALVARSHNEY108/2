"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";

export default function FooterCTA() {
  return (
    <section className="relative z-10 py-48 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-10" style={{ fontFamily: "'Outfit', sans-serif" }}> Ready to start your journey? </h2>
        <Magnetic>
          <Link href="/curriculum" className="btn-primary inline-flex !px-16 !py-8 !text-2xl">
            Get Started Now
          </Link>
        </Magnetic>
      </motion.div>
    </section>
  );
}
