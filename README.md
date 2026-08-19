# Campus CBT

Practice past questions, learn from short study notes, and drill flashcards — built for campus courses.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Static JSON content (no database, no auth)

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Course selection and progress snapshot |
| `/study?course=SOC202` | Instant-feedback learning mode |
| `/practice?course=SOC202` | Timed CBT practice mode |
| `/review?course=SOC202` | Weak areas and bookmarks |
| `/topics?course=SOC202` | Study notes by topic |
| `/flashcards?course=SOC202` | Flashcard revision |

Progress (bookmarks, weak areas, attempt counts) lives in `localStorage` per device.

## Scripts

```
npm run dev            # start dev server
npm run build          # production build
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm run check:data     # validate questions.json shape
npm run verify         # lint + typecheck + data check + build
npm run generate:flashcards   # rebuild data/flashcards.json from questions
npm run generate:revisions    # rebuild data/revision_cards_by_topic/
```

## Content

- `src/data/questions.json` — the source of truth (SOC202: 199 questions, 162 verified)
- `data/study-notes.json` — short study notes per topic
- `data/flashcards.json` — generated from questions + curated entries
- `data/revision_cards_by_topic/` — generated revision cards grouped by topic

`study-notes.json` is hand-written. `flashcards.json` and `revision_cards_by_topic/` are produced by the `generate:*` scripts and are regenerated during CI.

## Deploy

The app is a standard Next.js project — drop it on Vercel, Cloudflare Pages, or run it behind any Node host.

## Adding a new course

1. Add questions to `src/data/questions.json` following the existing shape (`id`, `course`, `topic`, `sub_topic`, `options[]`, `correct_option`, `explanation`, `is_verified`, etc.).
2. Add a course entry in `src/app/page.tsx`.
3. Add study notes to `data/study-notes.json` if you have them.
4. Run `npm run check:data` to confirm the bank is valid.
