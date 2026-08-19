"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { QuestionCard } from "@/components/QuestionCard";
import { getQuestions } from "@/lib/questions";

export function SubTopicDrill() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SOC202";
  const topic = searchParams.get("topic") || "";
  const subTopic = searchParams.get("sub_topic") || "";

  const questions = useMemo(
    () =>
      getQuestions({
        course,
        topic,
        sub_topic: subTopic || undefined,
        verifiedOnly: false,
        shuffle: true,
      }),
    [course, topic, subTopic]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  if (questions.length === 0) {
    return (
      <main className="min-h-screen pb-16">
        <Header course={course} label={subTopic || topic} />
        <section className="max-w-xl mx-auto px-5 pt-8">
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.history.back();
            }}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-soft hover:text-ink mb-4"
          >
            <ChevronLeft size={13} />
            Back to notes
          </button>
          <div className="bg-white border border-line rounded-sm px-5 py-8 text-center">
            <p className="font-serif text-lg font-medium mb-2">
              No questions for this sub-topic yet.
            </p>
            <p className="text-sm text-ink-soft leading-relaxed">
              Come back after more past questions are added under this sub-topic.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const current = questions[index];
  const answeredCount = questions.filter((_, i) => i < index || revealed).length;
  const isLast = index === questions.length - 1;

  function handleSelect(key: string) {
    if (revealed) return;
    setSelected(key);
    setRevealed(true);
  }

  function goNext() {
    if (isLast) return;
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function goPrev() {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setSelected(null);
    setRevealed(false);
  }

  return (
    <main className="min-h-screen pb-16">
      <Header course={course} label={`Drill: ${subTopic || topic}`} />

      <section className="max-w-xl mx-auto px-5 pt-6">
        <Link
          href={`/study?course=${course}&topic=${encodeURIComponent(topic)}&sub_topic=${encodeURIComponent(subTopic)}`}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-soft hover:text-ink mb-4"
        >
          <ChevronLeft size={13} />
          Back to note
        </Link>

        <div className="mb-5 bg-white border border-line rounded-sm px-4 py-3 flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            Untimed · {subTopic || topic}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            {index + 1} / {questions.length}
          </p>
        </div>

        <QuestionCard
          question={current}
          questionNumber={index + 1}
          totalQuestions={questions.length}
          selectedKey={selected}
          revealed={revealed}
          onSelect={handleSelect}
        />

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-4 py-2.5 border border-line rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink-soft transition-colors"
          >
            <ChevronLeft size={15} />
            Previous
          </button>

          {revealed && !isLast && (
            <button
              onClick={goNext}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-6 py-2.5 bg-ink text-paper rounded-sm hover:bg-ink-soft transition-colors"
            >
              Next question
              <ChevronRight size={15} />
            </button>
          )}

          {revealed && isLast && (
            <span className="font-mono text-xs uppercase tracking-wide text-correct">
              Finished
            </span>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-line">
          <div className="h-[3px] bg-line rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gold transition-all duration-300"
              style={{
                width: `${(Math.min(answeredCount, questions.length) / questions.length) * 100}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[10.5px] text-ink-soft">
            <span>{Math.min(answeredCount, questions.length)} answered</span>
            <span>{questions.length} total</span>
          </div>
        </div>
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

export default SubTopicDrill;
