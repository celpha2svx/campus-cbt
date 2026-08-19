# Campus CBT Product Plan

## Objective

Campus CBT should help coursemates prepare for SOC202 and SSC202 with two connected study loops:

1. Learn fast from course material through short summaries, key ideas, examples, and flashcards.
2. Practise like the real exam through CBT-style questions, timed sessions, explanations, review lists, and progress tracking.

The app should feel mobile-first, simple enough for students to use during busy weeks, and serious enough to show exactly where they are weak before the exam.

## Current App Snapshot

- Stack: Next.js 16.3.1, React 19, Tailwind CSS 4, local JSON data.
- Existing routes: `/` and `/study`.
- Existing content: SOC202 question bank in `src/data/questions.json`.
- Current SOC202 bank: 199 questions, 162 verified, all with explanations, all with 4 options.
- Existing question metadata: course, topic, sub-topic, difficulty, source, year, tags, verification.
- Missing route: `/practice` is linked from the course card but does not exist yet.
- Content gap: past questions exist, but normal study material has not been converted into summaries, lesson cards, or flashcards.

## Product Principles

- Students should always know what to do next.
- Every wrong answer should become a learning moment.
- The first version should work without login, database, or payment.
- Analytics should start local-first, then move to Supabase/Firebase when group features are needed.
- Content structure matters as much as UI because weak-area practice depends on good topic tagging.

## MVP 1: Private Study Tool

Goal: Make the current app useful immediately for SOC202 practice.

- Keep `/study` as learning mode with instant feedback after each question.
- Add `/practice` for exam-style timed practice.
- Add a session result screen with score, missed questions, unanswered questions, and topic breakdown.
- Add topic filtering before starting a session.
- Add question count selection: 10, 20, 40, or all.
- Add local progress storage using `localStorage`.
- Fix visible text encoding issues in the UI.

Success means a student can open the app, pick SOC202, choose study or practice, answer questions, and see what topics need revision.

## MVP 2: Learning Material Mode

Goal: Add fast revision from course material, not just past questions.

- Add `src/data/study-notes.json` for material-based notes.
- Add topic pages that show short summaries, key terms, likely exam points, and linked questions.
- Add flashcards for definitions, scholars, theories, research terms, and welfare concepts.
- Link every note to a course, topic, source material, and optional page reference.
- Link questions to relevant notes using `note_ids` or matching topic/sub-topic.

Success means a student can revise a topic quickly before answering questions from that same topic.

## MVP 3: Review And Weak Areas

Goal: Turn mistakes into a personal revision system.

- Add "Review later" and "I still do not understand" actions.
- Store incorrect questions and bookmarked questions locally.
- Add `/review` for weak questions and saved questions.
- Add basic spaced review dates: same day, 1 day, 3 days, 7 days.
- Add topic mastery labels: weak, improving, strong.

Success means the app can recommend what the student should practise next.

## MVP 4: Group Version

Goal: Support coursemates as a class group.

- Add user accounts when needed.
- Move data and progress to Supabase or Firebase.
- Add anonymous leaderboard by course.
- Add friend challenge mode using the same question set.
- Add admin tools for importing, verifying, tagging, and improving questions.
- Add discussion or feedback field per question for corrections.

Success means the app can support many students without manually editing JSON forever.

## Question Data Shape

The current shape is good. These fields should be kept:

```ts
type Question = {
  id: string;
  course: "SOC202" | "SSC202";
  topic: string;
  sub_topic: string;
  question_text: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correct_option: "A" | "B" | "C" | "D";
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  source: string;
  year: string;
  is_verified: boolean;
  tags: string[];
};
```

Useful additions for the next import cycle:

```ts
type QuestionEnhancements = {
  type: "mcq" | "true_false";
  note_ids: string[];
  exam_hint?: string;
  why_wrong?: Record<"A" | "B" | "C" | "D", string>;
  review_priority?: "normal" | "high";
};
```

## Study Note Data Shape

Study notes should be short and exam-focused. They should not copy the whole PDF into the app.

```ts
type StudyNote = {
  id: string;
  course: "SOC202" | "SSC202";
  topic: string;
  sub_topic: string;
  title: string;
  summary: string;
  key_points: string[];
  exam_traps: string[];
  source: {
    material: string;
    page?: string;
  };
  linked_question_ids: string[];
  tags: string[];
};
```

## Flashcard Data Shape

```ts
type Flashcard = {
  id: string;
  course: "SOC202" | "SSC202";
  topic: string;
  front: string;
  back: string;
  source_note_id?: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
};
```

## Local Progress Data Shape

This can live in `localStorage` during the early version.

```ts
type LocalQuestionProgress = {
  question_id: string;
  attempts: number;
  correct_attempts: number;
  last_answered_at: string;
  last_selected_option?: string;
  bookmarked: boolean;
  needs_review: boolean;
  next_review_at?: string;
};
```

## Suggested Route Map

- `/`: course selection and dashboard preview.
- `/study?course=SOC202`: instant feedback learning mode.
- `/practice?course=SOC202`: timed CBT mode.
- `/results`: session summary and topic breakdown.
- `/topics?course=SOC202`: study notes by topic.
- `/flashcards?course=SOC202`: flashcard revision.
- `/review?course=SOC202`: weak areas, bookmarks, and spaced review.
- `/admin/import`: later route for adding questions and study notes.

## Content Workflow

1. Import past questions into JSON.
2. Verify answers and explanations.
3. Extract course material topic by topic.
4. Convert each topic into short study notes.
5. Create flashcards from definitions, scholars, theories, and repeated exam concepts.
6. Link notes and flashcards back to question topics.
7. Use analytics from missed questions to improve weak explanations.

## Next Coding Steps

1. Fix UI text encoding issues.
2. Add `/practice` route with timer, answer navigation, auto-submit, and results.
3. Add shared quiz session logic so study and practice do not duplicate too much code.
4. Add local progress utilities.
5. Add `study-notes.json` and `flashcards.json` with a few SOC202 sample entries.
6. Add a topic study page that links notes to existing questions.

## Decisions To Make Later

- Real exam duration for SOC202 and SSC202.
- Whether students should see explanations immediately in practice mode or only after submit.
- Whether group features need login from the beginning.
- Whether progress should stay on-device or sync online.
- Whether content import should be done manually, semi-automatically, or through an admin page.
