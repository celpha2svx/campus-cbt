"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, ChevronLeft, CircleHelp, Home } from "lucide-react";
import { getQuestionById } from "@/lib/questions";
import {
  recordQuestionAttempt,
  setNeedsReview,
  toggleBookmark,
} from "@/lib/progress";
import { useProgressMap } from "@/lib/use-progress";
import { cn } from "@/lib/utils";

export function StudyQuestionView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SOC202";
  const question = getQuestionById(id);
  const progress = useProgressMap();

  const [selected, setSelected] = useState<string | null>(null);
  const revealed = selected !== null;

  if (!question) {
    return (
      <main className="min-h-screen pb-16">
        <Header course={course} label="Question" />
        <section className="max-w-xl mx-auto px-5 pt-8">
          <div className="bg-white border border-line rounded-sm px-5 py-8 text-center">
            <p className="font-serif text-lg font-medium mb-2">
              Question not found.
            </p>
            <Link
              href={`/study?course=${course}`}
              className="font-mono text-xs underline underline-offset-2"
            >
              Back to study
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const saved = progress[question.id];
  const isCorrect = selected === question.correct_option;

  function handleSelect(key: string) {
    if (revealed) return;
    setSelected(key);
    recordQuestionAttempt({ question: question!, selectedOption: key });
  }

  return (
    <main className="min-h-screen pb-16">
      <Header course={course} label={question.topic} />

      <section className="max-w-xl mx-auto px-5 pt-6">
        <Link
          href={`/study?course=${course}`}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-soft hover:text-ink mb-4"
        >
          <ChevronLeft size={13} />
          Back to study
        </Link>

        <div className="bg-white border border-line rounded-sm overflow-hidden">
          <div className="bg-paper-alt px-4 py-2.5 flex items-center justify-between border-b border-dashed border-line">
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wide text-ink-soft">
              {question.topic}
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-wide text-ink-soft">
              {question.sub_topic}
            </span>
          </div>

          <div className="px-5 pt-6 pb-5">
            <p className="font-mono text-[11px] font-semibold text-gold mb-2.5">
              QUESTION
            </p>
            <p className="font-serif text-lg font-medium leading-snug mb-6">
              {question.question_text}
            </p>

            <div className="flex flex-col gap-2.5">
              {question.options.map((opt) => {
                const isSelected = selected === opt.key;
                const isCorrectOption = opt.key === question.correct_option;

                let state: "idle" | "pending" | "correct" | "incorrect" | "dim" =
                  "idle";
                if (revealed) {
                  if (isCorrectOption) state = "correct";
                  else if (isSelected) state = "incorrect";
                  else state = "dim";
                } else if (isSelected) {
                  state = "pending";
                }

                return (
                  <button
                    key={opt.key}
                    disabled={revealed}
                    onClick={() => handleSelect(opt.key)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-3 border rounded-sm text-left font-serif text-[15px] transition-colors",
                      state === "idle" && "border-line hover:border-ink-soft",
                      state === "pending" && "border-ink bg-paper-alt",
                      state === "correct" && "border-correct bg-correct-bg",
                      state === "incorrect" && "border-incorrect bg-incorrect-bg",
                      state === "dim" && "border-line opacity-40"
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-[22px] h-[22px] min-w-[22px] rounded-full border font-mono text-[10px] font-semibold",
                        state === "idle" && "border-ink-soft text-ink-soft",
                        state === "pending" && "border-ink bg-ink text-paper",
                        state === "correct" &&
                          "border-correct bg-correct text-paper",
                        state === "incorrect" &&
                          "border-incorrect bg-incorrect text-paper",
                        state === "dim" && "border-line text-ink-soft"
                      )}
                    >
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className="mt-4 px-4 py-3.5 bg-paper-alt border-l-2 border-gold rounded-sm">
                <p
                  className={cn(
                    "font-mono text-[11px] font-bold uppercase tracking-wide mb-1",
                    isCorrect ? "text-correct" : "text-incorrect"
                  )}
                >
                  {isCorrect ? "Correct" : "Incorrect"} · Answer:{" "}
                  {question.correct_option}
                </p>
                <p className="text-sm leading-relaxed text-ink mt-1">
                  {question.explanation}
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => toggleBookmark(question.id)}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 border px-3 py-2 rounded-sm font-mono text-[10px] font-semibold uppercase tracking-wide transition-colors",
                      saved?.bookmarked
                        ? "border-gold bg-white text-ink"
                        : "border-line bg-white text-ink-soft hover:border-ink-soft"
                    )}
                  >
                    <Bookmark size={14} />
                    {saved?.bookmarked ? "Bookmarked" : "Bookmark"}
                  </button>
                  <button
                    onClick={() =>
                      setNeedsReview(question.id, !saved?.needs_review)
                    }
                    className={cn(
                      "inline-flex items-center justify-center gap-2 border px-3 py-2 rounded-sm font-mono text-[10px] font-semibold uppercase tracking-wide transition-colors",
                      saved?.needs_review
                        ? "border-incorrect bg-white text-incorrect"
                        : "border-line bg-white text-ink-soft hover:border-ink-soft"
                    )}
                  >
                    <CircleHelp size={14} />
                    {saved?.needs_review
                      ? "In review list"
                      : "Still need review"}
                  </button>
                </div>
              </div>
            )}
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

export default StudyQuestionView;
