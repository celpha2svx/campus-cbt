import { Suspense } from "react";
import StudyQuestionView from "./StudyQuestionView";

export default function StudyQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <StudyQuestionView params={params} />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">
        Loading question...
      </p>
    </div>
  );
}
