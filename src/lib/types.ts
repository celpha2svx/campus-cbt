export type Option = {
  key: string;
  text: string;
};

export type Question = {
  id: string;
  course: string;
  topic: string;
  sub_topic: string;
  question_text: string;
  options: Option[];
  correct_option: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  source: string;
  year: string;
  is_verified: boolean;
  tags: string[];
};

export type QuizMode = "study" | "practice";

export type Course = {
  id: string;
  code: string;
  fullName: string;
  description: string;
  available: boolean;
  questionCount: number;
};

export type QuestionProgress = {
  question_id: string;
  attempts: number;
  correct_attempts: number;
  last_answered_at?: string;
  last_selected_option?: string;
  bookmarked: boolean;
  needs_review: boolean;
  next_review_at?: string;
};

export type QuestionProgressMap = Record<string, QuestionProgress>;
