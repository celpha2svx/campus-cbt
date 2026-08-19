"use client";

import { Bookmark, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Question } from "@/lib/types";

type QuestionCardProps = {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedKey: string | null;
  revealed: boolean;
  onSelect: (key: string) => void;
  bookmarked?: boolean;
  needsReview?: boolean;
  onToggleBookmark?: () => void;
  onToggleReview?: () => void;
};

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedKey,
  revealed,
  onSelect,
  bookmarked = false,
  needsReview = false,
  onToggleBookmark,
  onToggleReview,
}: QuestionCardProps) {
  const resultLabel =
    selectedKey === null
      ? "Unanswered"
      : selectedKey === question.correct_option
        ? "Correct"
        : "Incorrect";
  const resultClass =
    selectedKey === null
      ? "text-ink-soft"
      : selectedKey === question.correct_option
        ? "text-correct"
        : "text-incorrect";

  return (
    <div className="bg-white border border-line rounded-sm overflow-hidden">
      <div className="bg-paper-alt px-4 py-2.5 flex items-center justify-between border-b border-dashed border-line">
        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wide text-ink-soft">
          {question.topic}
        </span>
        <span className="font-mono text-[10.5px] text-ink-soft">{question.sub_topic}</span>
      </div>

      <div className="px-5 pt-6 pb-5">
        <p className="font-mono text-[11px] font-semibold text-gold mb-2.5">
          QUESTION {String(questionNumber).padStart(2, "0")} OF {totalQuestions}
        </p>
        <p className="font-serif text-lg font-medium leading-snug mb-6">
          {question.question_text}
        </p>

        <div className="flex flex-col gap-2.5">
          {question.options.map((opt) => {
            const isSelected = selectedKey === opt.key;
            const isCorrect = opt.key === question.correct_option;

            let state: "idle" | "pending" | "correct" | "incorrect" | "dim" = "idle";
            if (revealed) {
              if (isCorrect) state = "correct";
              else if (isSelected) state = "incorrect";
              else state = "dim";
            } else if (isSelected) {
              state = "pending";
            }

            return (
              <button
                key={opt.key}
                disabled={revealed}
                onClick={() => onSelect(opt.key)}
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
                    "flex items-center justify-center w-[22px] h-[22px] min-w-[22px] rounded-full border font-mono text-[10px] font-semibold transition-colors",
                    state === "idle" && "border-ink-soft text-ink-soft",
                    state === "pending" && "border-ink bg-ink text-paper",
                    state === "correct" && "border-correct bg-correct text-paper",
                    state === "incorrect" && "border-incorrect bg-incorrect text-paper",
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
                resultClass
              )}
            >
              {resultLabel}
            </p>
            <p className="text-sm leading-relaxed text-ink">{question.explanation}</p>

            {(onToggleBookmark || onToggleReview) && (
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                {onToggleBookmark && (
                  <button
                    onClick={onToggleBookmark}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 border px-3 py-2 rounded-sm font-mono text-[10px] font-semibold uppercase tracking-wide transition-colors",
                      bookmarked
                        ? "border-gold bg-white text-ink"
                        : "border-line bg-white text-ink-soft hover:border-ink-soft"
                    )}
                  >
                    <Bookmark size={14} />
                    {bookmarked ? "Bookmarked" : "Bookmark"}
                  </button>
                )}

                {onToggleReview && (
                  <button
                    onClick={onToggleReview}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 border px-3 py-2 rounded-sm font-mono text-[10px] font-semibold uppercase tracking-wide transition-colors",
                      needsReview
                        ? "border-incorrect bg-white text-incorrect"
                        : "border-line bg-white text-ink-soft hover:border-ink-soft"
                    )}
                  >
                    <CircleHelp size={14} />
                    {needsReview ? "In review list" : "Still need review"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
