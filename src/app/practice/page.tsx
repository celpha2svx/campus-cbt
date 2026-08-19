import { Suspense } from "react";
import { PracticeSession } from "./PracticeSession";

export default function PracticePage() {
  return (
    <Suspense fallback={<Loading />}>
      <PracticeSession />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">
        Loading practice...
      </p>
    </div>
  );
}
