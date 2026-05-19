import { notFound } from "next/navigation";
import { getSubjectFromFS, getSubjectsFromFS } from "@/lib/content-registry";
import LessonLoader from "@/components/LessonLoader";

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const subjects = await getSubjectsFromFS();
  return subjects.flatMap((subject) =>
    subject.topics.flatMap((topic) =>
      topic.lessons.map((lesson) => ({
        subject: subject.id,
        topic: topic.id,
        lesson: lesson.id,
      }))
    )
  );
}

async function loadLessonComponent(subject: string, topic: string, lesson: string) {
  if (subject === 'dsa') {
    switch (topic) {
      case 'arrays': return await import(`@/content/dsa/arrays/${lesson}`);
      case 'cpp-fundamentals': return await import(`@/content/dsa/cpp-fundamentals/${lesson}`);
      case 'dynamic-programming': return await import(`@/content/dsa/dynamic-programming/${lesson}`);
      case 'graphs': return await import(`@/content/dsa/graphs/${lesson}`);
      case 'hashing': return await import(`@/content/dsa/hashing/${lesson}`);
      case 'linked-list': return await import(`@/content/dsa/linked-list/${lesson}`);
      case 'problem-solving-basics': return await import(`@/content/dsa/problem-solving-basics/${lesson}`);
      case 'recursion-backtracking': return await import(`@/content/dsa/recursion-backtracking/${lesson}`);
      case 'searching-sorting': return await import(`@/content/dsa/searching-sorting/${lesson}`);
      case 'stack-queue': return await import(`@/content/dsa/stack-queue/${lesson}`);
      case 'strings': return await import(`@/content/dsa/strings/${lesson}`);
      case 'time-space-complexity': return await import(`@/content/dsa/time-space-complexity/${lesson}`);
      case 'trees': return await import(`@/content/dsa/trees/${lesson}`);
    }
  } else if (subject === 'artificial-intelligence') {
    switch (topic) {
      case 'advanced-research': return await import(`@/content/artificial-intelligence/advanced-research/${lesson}`);
      case 'agentic-ai': return await import(`@/content/artificial-intelligence/agentic-ai/${lesson}`);
      case 'ai-foundations': return await import(`@/content/artificial-intelligence/ai-foundations/${lesson}`);
      case 'computer-vision': return await import(`@/content/artificial-intelligence/computer-vision/${lesson}`);
      case 'deep-learning': return await import(`@/content/artificial-intelligence/deep-learning/${lesson}`);
      case 'deep-reinforcement-learning': return await import(`@/content/artificial-intelligence/deep-reinforcement-learning/${lesson}`);
      case 'fine-tuning-adaptation': return await import(`@/content/artificial-intelligence/fine-tuning-adaptation/${lesson}`);
      case 'generative-ai': return await import(`@/content/artificial-intelligence/generative-ai/${lesson}`);
      case 'machine-learning': return await import(`@/content/artificial-intelligence/machine-learning/${lesson}`);
      case 'mlops': return await import(`@/content/artificial-intelligence/mlops/${lesson}`);
      case 'multimodal-ai': return await import(`@/content/artificial-intelligence/multimodal-ai/${lesson}`);
      case 'neural-networks': return await import(`@/content/artificial-intelligence/neural-networks/${lesson}`);
      case 'nlp': return await import(`@/content/artificial-intelligence/nlp/${lesson}`);
      case 'rag-memory': return await import(`@/content/artificial-intelligence/rag-memory/${lesson}`);
      case 'reinforcement-learning': return await import(`@/content/artificial-intelligence/reinforcement-learning/${lesson}`);
      case 'transformers': return await import(`@/content/artificial-intelligence/transformers/${lesson}`);
    }
  }
  return await import(`@/content/${subject}/${topic}/${lesson}`);
}

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ subject: string; topic: string; lesson: string }> 
}) {
  const { subject: subjectId, topic: topicId, lesson: lessonId } = await params;
  
  const subjectData = await getSubjectFromFS(subjectId);
  if (!subjectData) notFound();

  const topicData = subjectData.topics.find(t => t.id.toLowerCase() === topicId.toLowerCase());
  if (!topicData) notFound();

  const lessonIdx = topicData.lessons.findIndex(l => l.id.toLowerCase() === lessonId.toLowerCase());
  if (lessonIdx === -1) notFound();

  const lessonData = topicData.lessons[lessonIdx];
  const prevLesson = lessonIdx > 0 ? topicData.lessons[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < topicData.lessons.length - 1 ? topicData.lessons[lessonIdx + 1] : null;

  let Component = null;
  try {
    const mod = await loadLessonComponent(subjectData.id, topicData.id, lessonData.id);
    Component = mod.default;
  } catch (err) {
    console.error("Failed to load lesson component:", err);
    return (
      <div className="p-24 flex flex-col items-center text-center text-white">
        <h2 className="text-xl font-bold mb-2">Lesson Load Failed</h2>
        <p>Could not load lesson "{lessonData.id}".</p>
      </div>
    );
  }

  return (
    <LessonLoader 
      subjectId={subjectData.id}
      topicId={topicData.id}
      lessonId={lessonData.id} 
      lessonName={lessonData.name}
      subjectName={subjectData.name}
      topicName={topicData.name}
      prevLesson={prevLesson ? { id: prevLesson.id, name: prevLesson.name } : null}
      nextLesson={nextLesson ? { id: nextLesson.id, name: nextLesson.name } : null}
    >
      <Component />
    </LessonLoader>
  );
}
