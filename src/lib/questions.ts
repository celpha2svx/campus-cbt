import questionsData from "@/data/questions.json";
import { Question } from "./types";

const allQuestions = questionsData as Question[];

type GetQuestionsOptions = {
  course?: string;
  topic?: string;
  sub_topic?: string;
  verifiedOnly?: boolean;
  limit?: number;
  shuffle?: boolean;
};

export function getQuestions(options?: GetQuestionsOptions): Question[] {
  let result = [...allQuestions];

  if (options?.course) {
    result = result.filter((q) => q.course === options.course);
  }
  if (options?.topic) {
    result = result.filter((q) => q.topic === options.topic);
  }
  if (options?.sub_topic) {
    result = result.filter((q) => q.sub_topic === options.sub_topic);
  }
  // Default to verified-only unless explicitly told not to —
  // unreviewed questions shouldn't reach students by accident.
  if (options?.verifiedOnly !== false) {
    result = result.filter((q) => q.is_verified);
  }

  if (options?.shuffle !== false) {
    result = shuffle(result);
  }

  if (options?.limit) {
    result = result.slice(0, options.limit);
  }

  return result;
}

// Fisher-Yates — the array.sort(() => Math.random() - 0.5) trick is
// biased and gets worse the bigger the array gets, so worth doing right
// now rather than fixing it later once 199 becomes 1000.
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getAllTopics(course?: string): string[] {
  const pool = course ? allQuestions.filter((q) => q.course === course) : allQuestions;
  return Array.from(new Set(pool.map((q) => q.topic)));
}

export function getSubTopics(topic: string): string[] {
  return Array.from(
    new Set(allQuestions.filter((q) => q.topic === topic).map((q) => q.sub_topic))
  );
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id);
}