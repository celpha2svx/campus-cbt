import { Suspense } from "react";
import SubTopicDrill from "./SubTopicDrill";

export default function StudyPracticePage() {
  return (
    <Suspense fallback={<Loading />}>
      <SubTopicDrill />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">
        Loading drill...
      </p>
    </div>
  );
}
