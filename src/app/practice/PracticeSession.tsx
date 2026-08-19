"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Home,
  ListChecks,
  RotateCcw,
  Send,
} from "lucide-react";
import { QuestionCard } from "@/components/QuestionCard";
import { getAllTopics, getQuestions } from "@/lib/questions";
import {
  recordPracticeSession,
  setNeedsReview,
  toggleBookmark,
} from "@/lib/progress";
import { Question } from "@/lib/types";
import { useProgressMap } from "@/lib/use-progress";
import { cn } from "@/lib/utils";

const QUESTION_COUNTS = [10, 20, 40] as const;
const DURATIONS = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
] as const;

type SessionState = "setup" | "active" | "submitted";

type TopicStats = {
  topic: string;
  total: number;
  correct: number;
  unanswered: number;
};

export function PracticeSession() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SOC202";
  const initialTopic = searchParams.get("topic") || "all";
  const topics = useMemo(() => getAllTopics(course), [course]);

  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [sessionState, setSessionState] = useState<SessionState>("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);
  const [sessionRecorded, setSessionRecorded] = useState(false);
  const progress = useProgressMap();

  const current = questions[index];
  const answeredCount = questions.filter((question) => answers[question.id]).length;
  const correctCount = questions.filter(
    (question) => answers[question.id] === question.correct_option
  ).length;
  const unansweredCount = questions.length - answeredCount;
  const missedCount = questions.length - correctCount - unansweredCount;
  const scorePercent =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const topicStats = useMemo(
    () => buildTopicStats(questions, answers),
    [answers, questions]
  );
  const handleTimeExpired = useEffectEvent(() => {
    submitSession();
  });

  useEffect(() => {
    if (sessionState !== "active") return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          handleTimeExpired();
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [sessionState]);

  function startSession() {
    const pool = getQuestions({
      course,
      topic: selectedTopic === "all" ? undefined : selectedTopic,
      limit: questionCount,
      shuffle: true,
    });

    setQuestions(pool);
    setAnswers({});
    setIndex(0);
    setRemainingSeconds(durationMinutes * 60);
    setSessionRecorded(false);
    setSessionState("active");
  }

  function chooseAnswer(key: string) {
    if (!current || sessionState !== "active") return;

    setAnswers((prev) => ({
      ...prev,
      [current.id]: key,
    }));
  }

  function restart() {
    setSessionState("setup");
    setQuestions([]);
    setAnswers({});
    setIndex(0);
    setRemainingSeconds(durationMinutes * 60);
    setSessionRecorded(false);
  }

  function submitSession() {
    if (!sessionRecorded) {
      recordPracticeSession(questions, answers);
      setSessionRecorded(true);
    }

    setSessionState("submitted");
  }

  if (sessionState === "setup") {
    return (
      <main className="min-h-screen pb-16">
        <PracticeHeader course={course} label="Setup" />

        <section className="max-w-xl mx-auto px-5 pt-8">
          <div className="bg-white border border-line rounded-sm overflow-hidden">
            <div className="bg-paper-alt px-4 py-3 border-b border-dashed border-line">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                Practice Mode
              </p>
            </div>

            <div className="px-5 py-6">
              <h1 className="font-serif text-2xl font-medium leading-tight mb-2">
                Set up your CBT practice.
              </h1>
              <p className="text-sm leading-relaxed text-ink-soft mb-6">
                Answers and explanations stay hidden until you submit, just like a real exam
                review.
              </p>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="topic"
                    className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft"
                  >
                    Topic
                  </label>
                  <select
                    id="topic"
                    value={selectedTopic}
                    onChange={(event) => setSelectedTopic(event.target.value)}
                    className="mt-2 w-full border border-line bg-paper px-3 py-3 text-sm rounded-sm outline-none focus:border-ink"
                  >
                    <option value="all">All {course} topics</option>
                    {topics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <OptionGroup label="Questions">
                  {QUESTION_COUNTS.map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={cn(
                        "flex-1 px-3 py-2.5 border rounded-sm font-mono text-xs font-semibold uppercase tracking-wide transition-colors",
                        questionCount === count
                          ? "border-ink bg-ink text-paper"
                          : "border-line hover:border-ink-soft"
                      )}
                    >
                      {count}
                    </button>
                  ))}
                </OptionGroup>

                <OptionGroup label="Time">
                  {DURATIONS.map((duration) => (
                    <button
                      key={duration.minutes}
                      onClick={() => setDurationMinutes(duration.minutes)}
                      className={cn(
                        "flex-1 px-3 py-2.5 border rounded-sm font-mono text-xs font-semibold uppercase tracking-wide transition-colors",
                        durationMinutes === duration.minutes
                          ? "border-ink bg-ink text-paper"
                          : "border-line hover:border-ink-soft"
                      )}
                    >
                      {duration.label}
                    </button>
                  ))}
                </OptionGroup>
              </div>

              <button
                onClick={startSession}
                className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-ink text-paper py-3 rounded-sm font-mono text-xs font-semibold uppercase tracking-wide hover:bg-ink-soft transition-colors"
              >
                <Clock3 size={16} />
                Start practice
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="text-ink-soft">No verified questions available for this setup yet.</p>
        <button
          onClick={restart}
          className="font-mono text-xs underline underline-offset-2"
        >
          Change setup
        </button>
      </div>
    );
  }

  if (sessionState === "submitted") {
    return (
      <main className="min-h-screen pb-16">
        <PracticeHeader course={course} label="Results" />

        <section className="max-w-xl mx-auto px-5 pt-8">
          <div className="bg-white border border-line rounded-sm overflow-hidden">
            <div className="bg-paper-alt px-4 py-3 border-b border-dashed border-line flex items-center justify-between">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                Session complete
              </p>
              <p className="font-mono text-[11px] text-ink-soft">
                {formatTime(durationMinutes * 60 - remainingSeconds)} used
              </p>
            </div>

            <div className="px-5 py-6">
              <p className="font-mono text-[11px] font-semibold text-gold uppercase tracking-wide mb-2">
                Score
              </p>
              <div className="flex items-end gap-3 mb-5">
                <span className="font-serif text-5xl font-medium">{scorePercent}%</span>
                <span className="text-sm text-ink-soft pb-2">
                  {correctCount} correct out of {questions.length}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <ResultStat label="Answered" value={answeredCount} />
                <ResultStat label="Missed" value={missedCount} />
                <ResultStat label="Blank" value={unansweredCount} />
              </div>

              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-3">
                Topic breakdown
              </h2>
              <div className="space-y-2.5">
                {topicStats.map((stat) => (
                  <div key={stat.topic} className="border border-line rounded-sm px-3 py-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-sm font-medium leading-tight">{stat.topic}</p>
                      <p className="font-mono text-[11px] text-ink-soft">
                        {stat.correct}/{stat.total}
                      </p>
                    </div>
                    <div className="h-[3px] bg-line overflow-hidden rounded-full">
                      <div
                        className="h-full bg-gold"
                        style={{ width: `${(stat.correct / stat.total) * 100}%` }}
                      />
                    </div>
                    {stat.unanswered > 0 && (
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-incorrect">
                        {stat.unanswered} unanswered
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2.5">
            <button
              onClick={restart}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-ink text-ink py-2.5 rounded-sm font-mono text-xs font-semibold uppercase tracking-wide hover:bg-paper-alt transition-colors"
            >
              <RotateCcw size={15} />
              New setup
            </button>
            <a
              href="#answer-review"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-ink text-paper py-2.5 rounded-sm font-mono text-xs font-semibold uppercase tracking-wide hover:bg-ink-soft transition-colors"
            >
              <ListChecks size={15} />
              Review
            </a>
          </div>

          <div id="answer-review" className="mt-8 space-y-5">
            {questions.map((question, questionIndex) => (
              <QuestionCard
                key={question.id}
                question={question}
                questionNumber={questionIndex + 1}
                totalQuestions={questions.length}
                selectedKey={answers[question.id] || null}
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
        </section>
      </main>
    );
  }

  if (sessionState === "active" && !current) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <p className="text-ink-soft">Preparing questions…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <PracticeHeader course={course} label="Practice" />

      <section className="max-w-xl mx-auto px-5 pt-5">
        <div className="mb-5 bg-white border border-line rounded-sm px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide">
            <Clock3 size={15} className="text-gold" />
            <span className={remainingSeconds <= 60 ? "text-incorrect" : "text-ink-soft"}>
              {formatTime(remainingSeconds)}
            </span>
          </div>
          <div className="font-mono text-[11px] text-ink-soft uppercase tracking-wide">
            {answeredCount}/{questions.length} answered
          </div>
        </div>

        <QuestionCard
          question={current}
          questionNumber={index + 1}
          totalQuestions={questions.length}
          selectedKey={answers[current.id] || null}
          revealed={false}
          onSelect={chooseAnswer}
        />

        <div className="grid grid-cols-5 gap-2 mt-5">
          {questions.map((question, questionIndex) => (
            <button
              key={question.id}
              onClick={() => setIndex(questionIndex)}
              className={cn(
                "h-9 border rounded-sm font-mono text-[11px] font-semibold transition-colors",
                questionIndex === index && "border-ink bg-ink text-paper",
                questionIndex !== index &&
                  answers[question.id] &&
                  "border-correct bg-correct-bg text-correct",
                questionIndex !== index &&
                  !answers[question.id] &&
                  "border-line text-ink-soft hover:border-ink-soft"
              )}
              aria-label={`Go to question ${questionIndex + 1}`}
            >
              {questionIndex + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setIndex((currentIndex) => Math.max(currentIndex - 1, 0))}
            disabled={index === 0}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-4 py-2.5 border border-line rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-ink-soft transition-colors"
          >
            <ChevronLeft size={15} />
            Previous
          </button>

          {index === questions.length - 1 ? (
            <button
              onClick={submitSession}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide px-5 py-2.5 bg-ink text-paper rounded-sm hover:bg-ink-soft transition-colors"
            >
              <Send size={15} />
              Submit
            </button>
          ) : (
            <button
              onClick={() =>
                setIndex((currentIndex) => Math.min(currentIndex + 1, questions.length - 1))
              }
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-4 py-2.5 bg-ink text-paper rounded-sm hover:bg-ink-soft transition-colors"
            >
              Next
              <ChevronRight size={15} />
            </button>
          )}
        </div>

        <button
          onClick={submitSession}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 border border-line bg-white py-2.5 rounded-sm font-mono text-xs font-semibold uppercase tracking-wide hover:border-ink-soft transition-colors"
        >
          <CheckCircle2 size={15} />
          Submit and review
        </button>
      </section>
    </main>
  );
}

function PracticeHeader({ course, label }: { course: string; label: string }) {
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

function OptionGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-2">
        {label}
      </p>
      <div className="flex gap-2.5">{children}</div>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper-alt border border-line rounded-sm px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mb-1">
        {label}
      </p>
      <p className="font-serif text-2xl font-medium">{value}</p>
    </div>
  );
}

function buildTopicStats(
  questions: Question[],
  answers: Record<string, string>
): TopicStats[] {
  const stats = new Map<string, TopicStats>();

  for (const question of questions) {
    const existing =
      stats.get(question.topic) ||
      {
        topic: question.topic,
        total: 0,
        correct: 0,
        unanswered: 0,
      };

    const selected = answers[question.id];
    existing.total += 1;
    existing.correct += selected === question.correct_option ? 1 : 0;
    existing.unanswered += selected ? 0 : 1;
    stats.set(question.topic, existing);
  }

  return Array.from(stats.values()).sort((a, b) => a.topic.localeCompare(b.topic));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
