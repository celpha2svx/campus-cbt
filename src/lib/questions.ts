import questionsData from "@/data/questions.json";
import studyNotesSoc from "../../data/study-notes.json";
import studyNotesSsc from "../../data/study-notes-ssc202.json";
import { Question } from "./types";

const allQuestions = questionsData as Question[];

const noteTopicsByCourse: Record<string, string[]> = {
  SOC202: Array.from(
    new Set((studyNotesSoc as { topic: string }[]).map((n) => n.topic))
  ),
  SSC202: Array.from(
    new Set((studyNotesSsc as { topic: string }[]).map((n) => n.topic))
  ),
};

const noteSubTopicsByCourseAndTopic: Record<string, Record<string, string[]>> = {
  SOC202: buildSubTopicMap(studyNotesSoc),
  SSC202: buildSubTopicMap(studyNotesSsc),
};

function buildSubTopicMap(notes: unknown): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const n of notes as { topic: string; sub_topic: string }[]) {
    if (!map[n.topic]) map[n.topic] = [];
    if (!map[n.topic].includes(n.sub_topic)) map[n.topic].push(n.sub_topic);
  }
  return map;
}

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

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Topics come from notes (the syllabus outline) merged with question bank topics,
// so empty banks still show the official outline.
export function getAllTopics(course?: string): string[] {
  const noteTopics = course ? noteTopicsByCourse[course] ?? [] : [];
  const bankTopics = course
    ? allQuestions.filter((q) => q.course === course)
    : allQuestions;
  const bankTopicNames = Array.from(new Set(bankTopics.map((q) => q.topic)));
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const t of noteTopics) {
    if (!seen.has(t)) {
      seen.add(t);
      merged.push(t);
    }
  }
  for (const t of bankTopicNames) {
    if (!seen.has(t)) {
      seen.add(t);
      merged.push(t);
    }
  }
  return merged;
}

export function getSubTopics(topic: string, course?: string): string[] {
  const noteSubs =
    course && noteSubTopicsByCourseAndTopic[course]?.[topic]
      ? noteSubTopicsByCourseAndTopic[course][topic]
      : [];
  const bankSubs = course
    ? allQuestions
        .filter((q) => q.course === course && q.topic === topic)
        .map((q) => q.sub_topic)
    : allQuestions.filter((q) => q.topic === topic).map((q) => q.sub_topic);
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const s of noteSubs) {
    if (!seen.has(s)) {
      seen.add(s);
      merged.push(s);
    }
  }
  for (const s of bankSubs) {
    if (!seen.has(s)) {
      seen.add(s);
      merged.push(s);
    }
  }
  return merged;
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id);
}
