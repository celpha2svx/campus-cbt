import { Question, QuestionProgress, QuestionProgressMap } from "./types";

const STORAGE_KEY = "campus-cbt-progress-v1";
const EMPTY_PROGRESS: QuestionProgressMap = {};

let cachedRaw: string | null | undefined;
let cachedProgress: QuestionProgressMap = EMPTY_PROGRESS;

type RecordAttemptInput = {
  question: Question;
  selectedOption?: string;
  answeredAt?: Date;
};

export function getProgressMap(): QuestionProgressMap {
  if (typeof window === "undefined") return EMPTY_PROGRESS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedProgress;

    cachedRaw = raw;
    if (!raw) return EMPTY_PROGRESS;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY_PROGRESS;

    cachedProgress = parsed as QuestionProgressMap;
    return cachedProgress;
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function recordQuestionAttempt({
  question,
  selectedOption,
  answeredAt = new Date(),
}: RecordAttemptInput): QuestionProgressMap {
  const progress = getProgressMap();
  const previous = progress[question.id] || createEmptyProgress(question.id);
  const isCorrect = selectedOption === question.correct_option;
  const nextReviewAt = isCorrect ? undefined : addDays(answeredAt, 1).toISOString();

  const next: QuestionProgress = {
    ...previous,
    attempts: previous.attempts + 1,
    correct_attempts: previous.correct_attempts + (isCorrect ? 1 : 0),
    last_answered_at: answeredAt.toISOString(),
    last_selected_option: selectedOption,
    bookmarked: previous.bookmarked,
    needs_review: !isCorrect || previous.needs_review,
    next_review_at: nextReviewAt,
  };

  return saveProgressMap({
    ...progress,
    [question.id]: next,
  });
}

export function recordPracticeSession(
  questions: Question[],
  answers: Record<string, string>
): QuestionProgressMap {
  const answeredAt = new Date();
  let progress = getProgressMap();

  for (const question of questions) {
    const previous = progress[question.id] || createEmptyProgress(question.id);
    const selectedOption = answers[question.id];
    const isCorrect = selectedOption === question.correct_option;
    const nextReviewAt = isCorrect ? undefined : addDays(answeredAt, 1).toISOString();

    progress = {
      ...progress,
      [question.id]: {
        ...previous,
        attempts: previous.attempts + 1,
        correct_attempts: previous.correct_attempts + (isCorrect ? 1 : 0),
        last_answered_at: answeredAt.toISOString(),
        last_selected_option: selectedOption,
        bookmarked: previous.bookmarked,
        needs_review: !isCorrect || previous.needs_review,
        next_review_at: nextReviewAt,
      },
    };
  }

  return saveProgressMap(progress);
}

export function toggleBookmark(questionId: string): QuestionProgressMap {
  const progress = getProgressMap();
  const previous = progress[questionId] || createEmptyProgress(questionId);

  return saveProgressMap({
    ...progress,
    [questionId]: {
      ...previous,
      bookmarked: !previous.bookmarked,
    },
  });
}

export function setNeedsReview(
  questionId: string,
  needsReview: boolean
): QuestionProgressMap {
  const progress = getProgressMap();
  const previous = progress[questionId] || createEmptyProgress(questionId);

  return saveProgressMap({
    ...progress,
    [questionId]: {
      ...previous,
      needs_review: needsReview,
      next_review_at: needsReview
        ? previous.next_review_at || addDays(new Date(), 1).toISOString()
        : undefined,
    },
  });
}

export function clearQuestionProgress(questionId: string): QuestionProgressMap {
  const progress = getProgressMap();
  const rest = { ...progress };
  delete rest[questionId];

  return saveProgressMap(rest);
}

function saveProgressMap(progress: QuestionProgressMap): QuestionProgressMap {
  if (typeof window === "undefined") return progress;

  const raw = JSON.stringify(progress);
  cachedRaw = raw;
  cachedProgress = progress;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event("campus-cbt-progress-updated"));

  return progress;
}

function createEmptyProgress(questionId: string): QuestionProgress {
  return {
    question_id: questionId,
    attempts: 0,
    correct_attempts: 0,
    bookmarked: false,
    needs_review: false,
  };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
