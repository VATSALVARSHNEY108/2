import { getTopicFromFS, getSubjectFromFS, getSubjectsFromFS } from "@/lib/content-registry";
import { notFound } from "next/navigation";
import LessonList from "@/components/LessonList";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search } from "lucide-react";

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const subjects = await getSubjectsFromFS();
  return subjects.flatMap((subject) =>
    subject.topics.map((topic) => ({
      subject: subject.id,
      topic: topic.id,
    }))
  );
}

export default async function TopicPage({ params }: { params: Promise<{ subject: string; topic: string }> }) {
  const { subject: subjectId, topic: topicId } = await params;
  const topic = await getTopicFromFS(subjectId, topicId);
  const subject = await getSubjectFromFS(subjectId);

  if (!topic || !subject) {
    notFound();
  }

  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30">
      <div className="relative z-10 section-container pt-32 pb-24">
        {/* Navigation */}
        <Link 
          href={`/curriculum/${subjectId}`} 
          className="inline-flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-12 uppercase tracking-[0.3em] group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          {subject.name}
        </Link>

        {/* Header */}
        <header className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--text-primary)]/5 border border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-black tracking-widest uppercase mb-8 shadow-sm">
            <BookOpen size={12} className="text-indigo-500" />
            {topic.name}
          </div>
          <h1 className="display-heading text-6xl md:text-8xl mb-8">
            Select a <br />
            <span className="opacity-30">Lab.</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed font-medium max-w-2xl">
            {topic.description || "Dive into specialized modules designed for deep comprehension."}
          </p>
        </header>

        {/* Lessons List */}
        <LessonList subjectId={subject.id} topicId={topic.id} lessons={topic.lessons} />
      </div>
    </div>
  );
}
