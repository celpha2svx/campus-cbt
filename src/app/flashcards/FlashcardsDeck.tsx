"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Home, RotateCcw, Shuffle } from "lucide-react";
import {
  getFlashcardsByTopic,
  getFlashcardsForCourse,
  getFlashcardTopics,
} from "@/lib/flashcards";
import { cn } from "@/lib/utils";

export function FlashcardsDeck() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SOC202";
  const topicParam = searchParams.get("topic");

  const topics = useMemo(() => getFlashcardTopics(course), [course]);
  const [topic, setTopic] = useState<string>(topicParam || "all");
  const [seed, setSeed] = useState(0);

  const deck = useMemo(
    () => initialDeckIds(course, topic, seed),
    [course, topic, seed]
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [lastDeckKey, setLastDeckKey] = useState<string>(deckKey(course, topic, seed));

  if (lastDeckKey !== deckKey(course, topic, seed)) {
    setLastDeckKey(deckKey(course, topic, seed));
    setIndex(0);
    setFlipped(false);
  }

  const currentId = deck[index];
  const current = useMemo(() => {
    if (!currentId) return null;
    return (topic === "all"
      ? getFlashcardsForCourse(course)
      : getFlashcardsByTopic(course, topic)
    ).find((c) => c.id === currentId);
  }, [course, topic, currentId]);

  function reshuffle() {
    setSeed((s) => s + 1);
  }

  function changeTopic(next: string) {
    setTopic(next);
    setIndex(0);
    setFlipped(false);
  }

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1) % deck.length);
  }

  function prev() {
    setFlipped(false);
    setIndex((i) => (i - 1 + deck.length) % deck.length);
  }

  if (deck.length === 0 || !current) {
    return (
      <main className="min-h-screen pb-16">
        <Header course={course} label="Flashcards" />
        <section className="max-w-xl mx-auto px-5 pt-8">
          <div className="bg-white border border-line rounded-sm px-5 py-8 text-center">
            <p className="font-serif text-lg font-medium mb-2">
              No flashcards for this topic yet.
            </p>
            <p className="text-sm text-ink-soft leading-relaxed mb-5">
              Flashcards are generated from questions and curated entries. Pick
              another topic.
            </p>
            <Link
              href="/"
              className="font-mono text-xs underline underline-offset-2"
            >
              Back home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <Header course={course} label="Flashcards" />

      <section className="max-w-xl mx-auto px-5 pt-6">
        <div className="mb-5 flex items-center gap-2">
          <label
            htmlFor="topic"
            className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft"
          >
            Topic
          </label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => changeTopic(e.target.value)}
            className="flex-1 border border-line bg-paper px-3 py-2 text-sm rounded-sm outline-none focus:border-ink"
          >
            <option value="all">All {course} topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setFlipped((f) => !f)}
          className={cn(
            "w-full bg-white border border-line rounded-sm overflow-hidden text-left transition-colors",
            flipped ? "border-ink" : "hover:border-ink-soft"
          )}
        >
          <div className="bg-paper-alt px-4 py-2.5 flex items-center justify-between border-b border-dashed border-line">
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
              {current.topic}
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-wide text-ink-soft">
              {flipped ? "Tap for question" : "Tap for answer"}
            </span>
          </div>

          <div className="px-5 py-8 min-h-[180px] flex items-center">
            <p className="font-serif text-lg leading-snug whitespace-pre-line w-full">
              {flipped ? current.back : current.front}
            </p>
          </div>
        </button>

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={prev}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-4 py-2.5 border border-line rounded-sm hover:border-ink-soft transition-colors"
          >
            <ChevronLeft size={15} />
            Prev
          </button>
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            {index + 1} / {deck.length}
          </span>
          <button
            onClick={next}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-4 py-2.5 bg-ink text-paper rounded-sm hover:bg-ink-soft transition-colors"
          >
            Next
            <ChevronRight size={15} />
          </button>
        </div>

        <button
          onClick={reshuffle}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 border border-line bg-white py-2.5 rounded-sm font-mono text-xs font-semibold uppercase tracking-wide hover:border-ink-soft transition-colors"
        >
          <Shuffle size={14} />
          Shuffle deck
          <RotateCcw size={13} />
        </button>
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

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function initialDeckIds(course: string, topic: string, seed: number): string[] {
  const cards =
    topic === "all"
      ? getFlashcardsForCourse(course)
      : getFlashcardsByTopic(course, topic);
  const shuffled = shuffle(cards.map((c) => c.id));
  return seed === 0 ? shuffled : shuffle(shuffled);
}

function deckKey(course: string, topic: string, seed: number): string {
  return `${course}|${topic}|${seed}`;
}

export default FlashcardsDeck;
