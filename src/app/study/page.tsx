import { Suspense } from "react";
import { StudySession } from "./StudySession";

export default function StudyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <StudySession />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">
        Loading questions…
      </p>
    </div>
  );
}