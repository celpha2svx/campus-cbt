"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Home, ChevronLeft } from "lucide-react";
import { getAllTopics } from "@/lib/questions";
import {
  getStudyNotesByTopic,
  getTopicsWithNotes,
} from "@/lib/study-notes";
import {
  getFlashcardTopics,
  getFlashcardsForCourse,
} from "@/lib/flashcards";
import { cn } from "@/lib/utils";

type View =
  | { kind: "hub" }
  | { kind: "topic"; topic: string }
  | { kind: "subtopic"; topic: string; subTopic: string };

type Tab = "topics" | "flashcards";

export function StudyHub() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SOC202";
  const initialTopic = searchParams.get("topic");
  const initialSubTopic = searchParams.get("sub_topic");

  const [view, setView] = useState<View>(
    initialTopic && initialSubTopic
      ? { kind: "subtopic", topic: initialTopic, subTopic: initialSubTopic }
      : initialTopic
        ? { kind: "topic", topic: initialTopic }
        : { kind: "hub" }
  );
  const [tab, setTab] = useState<Tab>("topics");

  if (view.kind === "subtopic") {
    return (
      <SubTopicView
        course={course}
        topic={view.topic}
        subTopic={view.subTopic}
        onBack={() => setView({ kind: "topic", topic: view.topic })}
      />
    );
  }

  if (view.kind === "topic") {
    return (
      <TopicView
        course={course}
        topic={view.topic}
        onBack={() => setView({ kind: "hub" })}
        onPickSubTopic={(subTopic) =>
          setView({ kind: "subtopic", topic: view.topic, subTopic })
        }
      />
    );
  }

  return (
    <HubView
      course={course}
      tab={tab}
      onTabChange={setTab}
      onPickTopic={(topic) => setView({ kind: "topic", topic })}
    />
  );
}

function HubView({
  course,
  tab,
  onTabChange,
  onPickTopic,
}: {
  course: string;
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onPickTopic: (t: string) => void;
}) {
  const allTopics = useMemo(() => getAllTopics(course), [course]);
  const topicsWithNotes = useMemo(() => getTopicsWithNotes(course), [course]);
  const flashcardTopics = useMemo(() => getFlashcardTopics(course), [course]);
  const flashcardCount = useMemo(
    () => getFlashcardsForCourse(course).length,
    [course]
  );

  return (
    <main className="min-h-screen pb-16">
      <Header course={course} label="Study" />

      <section className="max-w-xl mx-auto px-5 pt-6">
        <h1 className="font-serif text-2xl font-medium leading-tight mb-2">
          {course} · Study Mode
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          Learn from notes first, then drill questions on what you just read.
        </p>

        <div className="grid grid-cols-2 gap-1.5 mb-6">
          <TabButton active={tab === "topics"} onClick={() => onTabChange("topics")}>
            Topics
          </TabButton>
          <TabButton
            active={tab === "flashcards"}
            onClick={() => onTabChange("flashcards")}
          >
            Flashcards
          </TabButton>
        </div>

        {tab === "topics" && (
          <>
            <SectionHeader
              title="Topics"
              subtitle={`${allTopics.length} topic${allTopics.length === 1 ? "" : "s"} · pick one to read notes and drill questions`}
            />
            <ul className="space-y-2">
              {allTopics.map((t) => {
                const hasNotes = topicsWithNotes.includes(t);
                return (
                  <li key={t}>
                    <button
                      onClick={() => onPickTopic(t)}
                      className="w-full bg-white border border-line rounded-sm px-4 py-3 flex items-center justify-between hover:border-ink-soft transition-colors text-left"
                    >
                      <div className="min-w-0">
                        <p className="font-serif text-sm font-medium leading-tight">
                          {t}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mt-1">
                          {hasNotes ? "Notes available" : "No notes yet"}
                        </p>
                      </div>
                      <ChevronRight size={15} className="text-ink-soft" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {tab === "flashcards" && (
          <>
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
          </>
        )}
      </section>
    </main>
  );
}

function TopicView({
  course,
  topic,
  onBack,
  onPickSubTopic,
}: {
  course: string;
  topic: string;
  onBack: () => void;
  onPickSubTopic: (subTopic: string) => void;
}) {
  const notes = useMemo(() => getStudyNotesByTopic(course, topic), [course, topic]);

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

        <h1 className="font-serif text-2xl font-medium leading-tight mb-1">
          {topic}
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          {notes.length} sub-topic{notes.length === 1 ? "" : "s"} to read.
        </p>

        {notes.length === 0 ? (
          <EmptyHint message="No notes for this topic yet." />
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li key={note.id}>
                <button
                  onClick={() => onPickSubTopic(note.sub_topic)}
                  className="w-full bg-white border border-line rounded-sm px-4 py-3 flex items-center justify-between hover:border-ink-soft transition-colors text-left"
                >
                  <p className="font-serif text-sm font-medium leading-tight min-w-0 pr-3">
                    {note.sub_topic}
                  </p>
                  <ChevronRight size={15} className="text-ink-soft" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function SubTopicView({
  course,
  topic,
  subTopic,
  onBack,
}: {
  course: string;
  topic: string;
  subTopic: string;
  onBack: () => void;
}) {
  const note = useMemo(
    () =>
      getStudyNotesByTopic(course, topic).find((n) => n.sub_topic === subTopic),
    [course, topic, subTopic]
  );

  if (!note) {
    return (
      <main className="min-h-screen pb-16">
        <Header course={course} label={subTopic} />
        <section className="max-w-xl mx-auto px-5 pt-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-soft hover:text-ink mb-4"
          >
            <ChevronLeft size={13} />
            Back
          </button>
          <EmptyHint message="Note not found." />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <Header course={course} label={note.sub_topic} />

      <section className="max-w-xl mx-auto px-5 pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-soft hover:text-ink mb-4"
        >
          <ChevronLeft size={13} />
          {topic}
        </button>

        <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-gold mb-2">
          {topic}
        </p>
        <h1 className="font-serif text-2xl font-medium leading-tight mb-4">
          {note.sub_topic}
        </h1>

        <article className="bg-white border border-line rounded-sm overflow-hidden mb-6">
          <div className="bg-paper-alt px-4 py-2.5 border-b border-dashed border-line">
            <p className="font-mono text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
              {note.title}
            </p>
          </div>
          <div className="px-5 py-5">
            <p className="text-sm leading-relaxed text-ink whitespace-pre-line">
              {note.content}
            </p>
            {note.tags && note.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
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

        <Link
          href={`/study/practice?course=${course}&topic=${encodeURIComponent(topic)}&sub_topic=${encodeURIComponent(subTopic)}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-ink text-paper py-3 rounded-sm font-mono text-xs font-semibold uppercase tracking-wide hover:bg-ink-soft transition-colors"
        >
          Drill this sub-topic
          <ChevronRight size={15} />
        </Link>

        <p className="mt-3 text-xs text-ink-soft text-center">
          Untimed. Go at your own pace.
        </p>
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
