"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Home, Search } from "lucide-react";
import { getAllTopics, getQuestions, getSubTopics } from "@/lib/questions";
import { getTopicsWithNotes, getStudyNotesByTopic } from "@/lib/study-notes";

export function TopicsList() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SOC202";

  const allTopics = useMemo(() => getAllTopics(course), [course]);
  const topicsWithNotes = useMemo(() => getTopicsWithNotes(course), [course]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  if (selectedTopic) {
    return (
      <TopicDetail
        course={course}
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <Header course={course} label="Topics" />

      <section className="max-w-xl mx-auto px-5 pt-8">
        <div className="bg-white border border-line rounded-sm overflow-hidden mb-5">
          <div className="bg-paper-alt px-4 py-3 border-b border-dashed border-line">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              Topics
            </p>
          </div>
          <div className="px-5 py-5">
            <h1 className="font-serif text-2xl font-medium leading-tight mb-2">
              What do you want to revise?
            </h1>
            <p className="text-sm leading-relaxed text-ink-soft">
              Pick a topic to read the short notes and jump straight into the
              questions for that topic.
            </p>
          </div>
        </div>

        {allTopics.length === 0 ? (
          <EmptyState message={`No topics found for ${course} yet.`} />
        ) : (
          <div className="space-y-2.5">
            {allTopics.map((topic) => {
              const noteCount = topicsWithNotes.includes(topic) ? 1 : 0;
              const questionCount = getQuestions({
                course,
                topic,
                verifiedOnly: false,
                shuffle: false,
              }).length;
              const hasNotes = noteCount > 0;

              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className="w-full bg-white border border-line rounded-sm px-4 py-3.5 flex items-center justify-between hover:border-ink-soft transition-colors text-left"
                >
                  <div className="min-w-0">
                    <p className="font-serif text-base font-medium leading-tight">
                      {topic}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mt-1">
                      {questionCount} question{questionCount === 1 ? "" : "s"}
                      {hasNotes ? " . Notes available" : ""}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-ink-soft" />
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function TopicDetail({
  course,
  topic,
  onBack,
}: {
  course: string;
  topic: string;
  onBack: () => void;
}) {
  const notes = useMemo(() => getStudyNotesByTopic(course, topic), [course, topic]);
  const subTopics = useMemo(() => getSubTopics(topic), [topic]);
  const subTopicCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const sub of subTopics) {
      counts.set(
        sub,
        getQuestions({
          course,
          topic,
          sub_topic: sub,
          verifiedOnly: false,
          shuffle: false,
        }).length
      );
    }
    return counts;
  }, [course, topic, subTopics]);

  return (
    <main className="min-h-screen pb-16">
      <Header course={course} label={topic} />

      <section className="max-w-xl mx-auto px-5 pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-soft hover:text-ink mb-4"
        >
          <ChevronLeft size={13} />
          All topics
        </button>

        <h1 className="font-serif text-2xl font-medium leading-tight mb-2">
          {topic}
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          Short notes first, then jump into practice for this topic.
        </p>

        {notes.length > 0 ? (
          <div className="space-y-4 mb-8">
            {notes.map((note) => (
              <article
                key={note.id}
                className="bg-white border border-line rounded-sm overflow-hidden"
              >
                <div className="bg-paper-alt px-4 py-2.5 border-b border-dashed border-line">
                  <p className="font-mono text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
                    Note
                  </p>
                </div>
                <div className="px-5 py-5">
                  <h2 className="font-serif text-lg font-medium mb-2">
                    {note.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-ink whitespace-pre-line">
                    {note.content}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] uppercase tracking-wide bg-paper-alt border border-line text-ink-soft px-2 py-1 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-line rounded-sm px-5 py-6 text-center mb-8">
            <p className="text-sm text-ink-soft leading-relaxed">
              No notes yet for this topic. Jump straight into the questions
              below — your wrong answers will surface in Review.
            </p>
          </div>
        )}

        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-3">
          Sub-topics
        </h2>

        <div className="space-y-2.5">
          {subTopics.map((sub) => {
            const count = subTopicCounts.get(sub) || 0;
            return (
              <Link
                key={sub}
                href={`/practice?course=${course}&topic=${encodeURIComponent(topic)}`}
                className="flex items-center justify-between bg-white border border-line rounded-sm px-4 py-3 hover:border-ink-soft transition-colors"
              >
                <span className="font-serif text-sm leading-tight">{sub}</span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                  {count} q
                </span>
              </Link>
            );
          })}
        </div>

        <Link
          href={`/practice?course=${course}&topic=${encodeURIComponent(topic)}`}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-ink text-paper py-3 rounded-sm font-mono text-xs font-semibold uppercase tracking-wide hover:bg-ink-soft transition-colors"
        >
          Practice this topic
          <ChevronRight size={15} />
        </Link>
      </section>
    </main>
  );
}

function Header({ course, label }: { course: string; label: string }) {
  return (
    <header className="border-b border-line sticky top-0 bg-paper z-10">
      <div className="max-w-xl mx-auto px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-soft hover:text-ink"
          >
            <Home size={13} />
            Home
          </Link>
          <span className="text-line">|</span>
          <span className="font-mono text-[11px] uppercase tracking-wide">
            {course} . {label}
          </span>
        </div>
      </div>
    </header>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white border border-line rounded-sm px-5 py-8 text-center">
      <Search size={24} className="mx-auto text-gold mb-3" />
      <p className="text-sm text-ink-soft leading-relaxed">{message}</p>
    </div>
  );
}

export default TopicsList;
