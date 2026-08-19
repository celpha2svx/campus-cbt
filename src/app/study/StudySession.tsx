"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getQuestions } from "@/lib/questions";
import { recordQuestionAttempt, setNeedsReview, toggleBookmark } from "@/lib/progress";
import { useProgressMap } from "@/lib/use-progress";
import { QuestionCard } from "@/components/QuestionCard";

export function StudySession() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SOC202";

  const [questions] = useState(() => getQuestions({ course, shuffle: true }));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    Array(questions.length).fill(null)
  );
  const progress = useProgressMap();

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="text-ink-soft">No questions available for {course} yet.</p>
        <Link href="/" className="font-mono text-xs underline underline-offset-2">
          Back home
        </Link>
      </div>
    );
  }

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const correctCount = answers.filter((answer) => answer === true).length;

  function handleSelect(key: string) {
    if (revealed) return;
    setSelected(key);
    setRevealed(true);
    const isCorrect = key === current.correct_option;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = isCorrect;
      return next;
    });
    recordQuestionAttempt({ question: current, selectedOption: key });
  }

  function goTo(newIndex: number) {
    setIndex(newIndex);
    setSelected(null);
    setRevealed(false);
  }

  return (
    <main className="min-h-screen pb-16">
      <header className="border-b border-line sticky top-0 bg-paper z-10">
        <div className="max-w-xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-mono text-[11px] text-ink-soft hover:text-ink">
              Home
            </Link>
            <span className="text-line">|</span>
            <span className="font-mono text-[11px] uppercase tracking-wide">{course} . Study</span>
          </div>
          <span className="font-mono text-[11px] text-ink-soft">
            {index + 1} / {questions.length}
          </span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-5 pt-8">
        <QuestionCard
          question={current}
          questionNumber={index + 1}
          totalQuestions={questions.length}
          selectedKey={selected}
          revealed={revealed}
          onSelect={handleSelect}
          bookmarked={Boolean(progress[current.id]?.bookmarked)}
          needsReview={Boolean(progress[current.id]?.needs_review)}
          onToggleBookmark={() => toggleBookmark(current.id)}
          onToggleReview={() =>
            setNeedsReview(current.id, !progress[current.id]?.needs_review)
          }
        />

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="font-mono text-xs uppercase tracking-wide px-4 py-2.5 border border-line rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink-soft transition-colors"
          >
            Previous
          </button>

          {revealed && (
            <button
              onClick={() => goTo(index + 1)}
              disabled={isLast}
              className="font-mono text-xs uppercase tracking-wide px-6 py-2.5 bg-ink text-paper rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ink-soft transition-colors"
            >
              {isLast ? "Finished" : "Next question"}
            </button>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-line">
          <div className="h-[3px] bg-line rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gold transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[10.5px] text-ink-soft">
            <span>{answeredCount} answered</span>
            <span>{correctCount} correct</span>
          </div>
        </div>
      </div>
    </main>
  );
}
