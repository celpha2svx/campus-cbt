"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Home, ChevronLeft } from "lucide-react";
import { getAllTopics, getQuestions } from "@/lib/questions";
import { getTopicsWithNotes, getStudyNotesByTopic } from "@/lib/study-notes";
import {
  getFlashcardTopics,
  getFlashcardsForCourse,
} from "@/lib/flashcards";
import ProgressDashboard from "@/components/ProgressDashboard";
import { cn } from "@/lib/utils";

type Tab = "topics" | "flashcards" | "questions";

export function StudyHub() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SOC202";
  const initialTopic = searchParams.get("topic") || "";
  const [tab, setTab] = useState<Tab>(initialTopic ? "topics" : "topics");
  const [topic, setTopic] = useState<string | null>(initialTopic || null);

  const allQuestions = useMemo(
    () => getQuestions({ course, verifiedOnly: false, shuffle: false }),
    [course]
  );
  const allTopics = useMemo(() => getAllTopics(course), [course]);
  const topicsWithNotes = useMemo(() => getTopicsWithNotes(course), [course]);
  const flashcardTopics = useMemo(() => getFlashcardTopics(course), [course]);
  const flashcardCount = useMemo(
    () => getFlashcardsForCourse(course).length,
    [course]
  );

  if (topic) {
    return (
      <TopicView
        course={course}
        topic={topic}
        onBack={() => setTopic(null)}
      />
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <Header course={course} label="Study" />

      <section className="max-w-xl mx-auto px-5 pt-6">
        <h1 className="font-serif text-2xl font-medium leading-tight mb-2">
          {course} · Study Mode
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          Read notes, drill flashcards, or work through the questions one at a
          time.
        </p>

        <ProgressDashboard allQuestions={allQuestions} />

        <div className="grid grid-cols-3 gap-1.5 mb-6">
          <TabButton active={tab === "topics"} onClick={() => setTab("topics")}>
            Topics
          </TabButton>
          <TabButton
            active={tab === "flashcards"}
            onClick={() => setTab("flashcards")}
          >
            Flashcards
          </TabButton>
          <TabButton
            active={tab === "questions"}
            onClick={() => setTab("questions")}
          >
            Questions
          </TabButton>
        </div>

        {tab === "topics" && (
          <Section>
            <SectionHeader
              title="Topics"
              subtitle={`${allTopics.length} topic${allTopics.length === 1 ? "" : "s"} in ${course}`}
            />
            {allTopics.length === 0 ? (
              <EmptyHint message="No topics found yet." />
            ) : (
              <ul className="space-y-2">
                {allTopics.map((t) => {
                  const count = getQuestions({
                    course,
                    topic: t,
                    verifiedOnly: false,
                    shuffle: false,
                  }).length;
                  const hasNotes = topicsWithNotes.includes(t);
                  return (
                    <li key={t}>
                      <button
                        onClick={() => setTopic(t)}
                        className="w-full bg-white border border-line rounded-sm px-4 py-3 flex items-center justify-between hover:border-ink-soft transition-colors text-left"
                      >
                        <div className="min-w-0">
                          <p className="font-serif text-sm font-medium leading-tight">
                            {t}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mt-1">
                            {count} question{count === 1 ? "" : "s"}
                            {hasNotes ? " . Notes" : ""}
                          </p>
                        </div>
                        <ChevronRight size={15} className="text-ink-soft" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        )}

        {tab === "flashcards" && (
          <Section>
            <SectionHeader
              title="Flashcards"
              subtitle={`${flashcardCount} curated card${flashcardCount === 1 ? "" : "s"}`}
            />
            {flashcardCount === 0 ? (
              <EmptyHint message="No flashcards yet. Add curated Q→A pairs to data/flashcards.json." />
            ) : (
              <Link
                href={`/flashcards?course=${course}`}
                className="block bg-white border border-line rounded-sm px-4 py-4 hover:border-ink-soft transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-serif text-sm font-medium leading-tight">
                      Open flashcard deck
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mt-1">
                      Tap to flip, swipe for next
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-ink-soft" />
                </div>
              </Link>
            )}
            {flashcardTopics.length > 0 && (
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                Available in: {flashcardTopics.join(" · ")}
              </p>
            )}
          </Section>
        )}

        {tab === "questions" && (
          <Section>
            <SectionHeader
              title="Questions"
              subtitle={`${allQuestions.length} question${allQuestions.length === 1 ? "" : "s"} · ${allQuestions.filter((q) => q.is_verified).length} verified`}
            />
            {allQuestions.length === 0 ? (
              <EmptyHint message="No questions available." />
            ) : (
              <ul className="space-y-2">
                {allQuestions.map((q, idx) => (
                  <li key={q.id}>
                    <Link
                      href={`/study/${q.id}?course=${course}`}
                      className="block bg-white border border-line rounded-sm px-4 py-3 hover:border-ink-soft transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-[10px] text-ink-soft pt-1 w-8 shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm leading-snug line-clamp-2">
                            {q.question_text}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mt-1">
                            {q.topic} · {q.sub_topic}
                            {!q.is_verified && " · unverified"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}
      </section>
    </main>
  );
}

function TopicView({
  course,
  topic,
  onBack,
}: {
  course: string;
  topic: string;
  onBack: () => void;
}) {
  const notes = useMemo(() => getStudyNotesByTopic(course, topic), [course, topic]);
  const topicQuestions = useMemo(
    () =>
      getQuestions({
        course,
        topic,
        verifiedOnly: false,
        shuffle: false,
      }),
    [course, topic]
  );

  return (
    <main className="min-h-screen pb-16">
      <Header course={course} label={topic} />

      <section className="max-w-xl mx-auto px-5 pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-soft hover:text-ink mb-4"
        >
          <ChevronLeft size={13} />
          Back to study
        </button>

        <h1 className="font-serif text-2xl font-medium leading-tight mb-1">
          {topic}
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          {topicQuestions.length} question
          {topicQuestions.length === 1 ? "" : "s"} in this topic.
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
                    Notes
                  </p>
                </div>
                <div className="px-5 py-5">
                  <h2 className="font-serif text-lg font-medium mb-2">
                    {note.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-ink whitespace-pre-line">
                    {note.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-line rounded-sm px-5 py-6 mb-8 text-center">
            <p className="text-sm text-ink-soft leading-relaxed">
              No notes for this topic yet. Jump straight to the questions below.
            </p>
          </div>
        )}

        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-3">
          Questions
        </h2>

        <ul className="space-y-2">
          {topicQuestions.map((q, idx) => (
            <li key={q.id}>
              <Link
                href={`/study/${q.id}?course=${course}`}
                className="block bg-white border border-line rounded-sm px-4 py-3 hover:border-ink-soft transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-ink-soft pt-1 w-8 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-snug line-clamp-2 min-w-0">
                    {q.question_text}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

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

function Section({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="font-serif text-lg font-medium">{title}</h2>
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mt-1">
        {subtitle}
      </p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 border rounded-sm font-mono text-[11px] font-semibold uppercase tracking-wide transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-ink-soft hover:border-ink-soft"
      )}
    >
      {children}
    </button>
  );
}

function EmptyHint({ message }: { message: string }) {
  return (
    <div className="bg-white border border-line rounded-sm px-5 py-6 text-center">
      <p className="text-sm text-ink-soft leading-relaxed">{message}</p>
    </div>
  );
}

export default StudyHub;
