import { getSubjectFromFS, getSubjectsFromFS } from "@/lib/content-registry";
import { notFound } from "next/navigation";
import TopicExplorer from "@/components/TopicExplorer";
import Link from "next/link";
import { ArrowLeft, Sparkles, Layout } from "lucide-react";

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const subjects = await getSubjectsFromFS();
  return subjects.map((s) => ({ subject: s.id }));
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectId } = await params;
  const subject = await getSubjectFromFS(subjectId);

  if (!subject) {
    return (
      <div className="p-24 text-center text-[var(--text-primary)]">
        <h2 className="text-2xl font-bold mb-4">Subject Not Found</h2>
        <p className="text-[var(--text-secondary)]">The requested subject could not be loaded. Please check the curriculum configuration.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30">
      <div className="relative z-10 section-container pt-32 pb-24">
        {/* Navigation */}
        <Link 
          href="/curriculum" 
          className="inline-flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-12 uppercase tracking-[0.3em] group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Curriculum
        </Link>

        {/* Header */}
        <header className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--text-primary)]/5 border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black tracking-widest uppercase mb-8 shadow-sm">
            <Layout size={12} className="text-indigo-500" />
            {subject.name}
          </div>
          <h1 className="display-heading text-6xl md:text-8xl mb-8">
            Explore <br />
            <span className="opacity-30">Topics.</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed font-medium max-w-xl">
            {subject.description}
          </p>
        </header>

        {/* Topics Grid */}
        <TopicExplorer subjectId={subject.id} topics={subject.topics} />
      </div>
    </div>
  );
}
