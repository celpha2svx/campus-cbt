import { Suspense } from "react";
import { ReviewList } from "./ReviewList";

export default function ReviewPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ReviewList />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">
        Loading review list...
      </p>
    </div>
  );
}
