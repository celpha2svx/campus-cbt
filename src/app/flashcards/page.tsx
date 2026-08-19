import { Suspense } from "react";
import FlashcardsDeck from "./FlashcardsDeck";

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FlashcardsDeck />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">
        Loading flashcards...
      </p>
    </div>
  );
}
