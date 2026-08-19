import { Suspense } from "react";
import TopicsList from "./TopicsList";

export default function TopicsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TopicsList />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">
        Loading topics...
      </p>
    </div>
  );
}
