import Link from "next/link";
import { getSubjectsFromFS } from "@/lib/content-registry";
import { ChevronRight, Layers, FileText, ArrowLeft, Sparkles } from "lucide-react";
import CoursesList from "@/components/CoursesList";

export const dynamic = 'force-static';

export default async function CoursesPage() {
  const subjects = await getSubjectsFromFS();



  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30">
      <div className="relative z-10 section-container pt-32 pb-24">
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-12 uppercase tracking-[0.3em] group">
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Home
        </Link>

        {/* Header */}
        <header className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--text-primary)]/5 border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black tracking-widest uppercase mb-8 shadow-sm">
            <Sparkles size={12} className="text-indigo-500" />
            Active Curriculum
          </div>
          <h1 className="display-heading text-6xl md:text-8xl mb-8">
            Choose Your <br />
            <span className="opacity-30">Discipline.</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed font-medium max-w-xl">
            A structured, interactive laboratory for mastering engineering fundamentals. 
            Select a path to begin your exploration.
          </p>
        </header>

        {/* Grid */}
        <CoursesList subjects={subjects} />

        {subjects.length === 0 && (
          <div className="text-center py-40 border border-dashed border-[var(--border-color)] rounded-[3rem] bg-[var(--bg-secondary)]/50">
            <div className="w-20 h-20 bg-[var(--bg-elevated)] rounded-3xl flex items-center justify-center mx-auto mb-8 text-4xl shadow-premium">
              📂
            </div>
            <h3 className="display-heading text-3xl mb-4">No Courses Yet</h3>
            <p className="text-[var(--text-secondary)] font-medium">
              Initialize the repository to see content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
