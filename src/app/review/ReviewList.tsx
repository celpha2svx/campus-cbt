"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookMarked, ClipboardList, Home, RefreshCw } from "lucide-react";
import { QuestionCard } from "@/components/QuestionCard";
import ProgressDashboard from "@/components/ProgressDashboard";
import { getQuestions } from "@/lib/questions";
import { setNeedsReview, toggleBookmark } from "@/lib/progress";
import { useProgressMap } from "@/lib/use-progress";
import { cn } from "@/lib/utils";

type ReviewFilter = "needs-review" | "bookmarked" | "all";

export function ReviewList() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SOC202";
  const [filter, setFilter] = useState<ReviewFilter>("needs-review");
  const progress = useProgressMap();

  const allQuestions = useMemo(
    () => getQuestions({ course, verifiedOnly: false, shuffle: false }),
    [course]
  );
  const reviewQuestions = useMemo(() => {
    return allQuestions
      .filter((question) => {
        const saved = progress[question.id];
        if (!saved) return false;
        if (filter === "needs-review") return saved.needs_review;
        if (filter === "bookmarked") return saved.bookmarked;
        return saved.needs_review || saved.bookmarked;
      })
      .sort((a, b) => {
        const aProgress = progress[a.id];
        const bProgress = progress[b.id];
        return getTime(bProgress?.last_answered_at) - getTime(aProgress?.last_answered_at);
      });
  }, [allQuestions, filter, progress]);

  const reviewCount = allQuestions.filter((question) => progress[question.id]?.needs_review).length;
  const bookmarkCount = allQuestions.filter((question) => progress[question.id]?.bookmarked).length;

  return (
    <main className="min-h-screen pb-16">
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
              {course} . Review
            </span>
          </div>
        </div>
      </header>

      <section className="max-w-xl mx-auto px-5 pt-8">
        <ProgressDashboard allQuestions={allQuestions} />

        <div className="bg-white border border-line rounded-sm overflow-hidden mb-5">
          <div className="bg-paper-alt px-4 py-3 border-b border-dashed border-line">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              Weak Area Review
            </p>
          </div>

          <div className="px-5 py-6">
            <h1 className="font-serif text-2xl font-medium leading-tight mb-2">
              Revisit what needs another look.
            </h1>
            <p className="text-sm leading-relaxed text-ink-soft mb-5">
              Questions you miss, skip, bookmark, or mark as confusing stay here on this
              device.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <ReviewStat icon={<ClipboardList size={16} />} label="Need review" value={reviewCount} />
              <ReviewStat icon={<BookMarked size={16} />} label="Bookmarked" value={bookmarkCount} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <FilterButton
                active={filter === "needs-review"}
                onClick={() => setFilter("needs-review")}
              >
                Weak
              </FilterButton>
              <FilterButton
                active={filter === "bookmarked"}
                onClick={() => setFilter("bookmarked")}
              >
                Saved
              </FilterButton>
              <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                All
              </FilterButton>
            </div>
          </div>
        </div>

        {reviewQuestions.length === 0 ? (
          <div className="bg-white border border-line rounded-sm px-5 py-8 text-center">
            <RefreshCw size={24} className="mx-auto text-gold mb-3" />
            <p className="font-serif text-lg font-medium mb-2">Nothing here yet.</p>
            <p className="text-sm text-ink-soft leading-relaxed mb-5">
              Finish a practice session or mark questions during study mode, then your weak
              areas will appear here.
            </p>
            <Link
              href={`/practice?course=${course}`}
              className="inline-flex items-center justify-center bg-ink text-paper px-5 py-2.5 rounded-sm font-mono text-xs font-semibold uppercase tracking-wide hover:bg-ink-soft transition-colors"
            >
              Start practice
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {reviewQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                questionNumber={index + 1}
                totalQuestions={reviewQuestions.length}
                selectedKey={progress[question.id]?.last_selected_option || null}
                revealed={true}
                onSelect={() => undefined}
                bookmarked={Boolean(progress[question.id]?.bookmarked)}
                needsReview={Boolean(progress[question.id]?.needs_review)}
                onToggleBookmark={() => toggleBookmark(question.id)}
                onToggleReview={() =>
                  setNeedsReview(question.id, !progress[question.id]?.needs_review)
                }
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ReviewStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-paper-alt border border-line rounded-sm px-3 py-3">
      <div className="text-gold mb-2">{icon}</div>
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mb-1">
        {label}
      </p>
      <p className="font-serif text-2xl font-medium">{value}</p>
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-2.5 border rounded-sm font-mono text-xs font-semibold uppercase tracking-wide transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-ink-soft hover:border-ink-soft"
      )}
    >
      {children}
    </button>
  );
}

function getTime(value?: string) {
  if (!value) return 0;
  return new Date(value).getTime();
}
