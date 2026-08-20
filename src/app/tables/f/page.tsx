import { Suspense } from "react";
import FTablePage from "./FTablePage";

export default function FTableRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <FTablePage />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">
        Loading table...
      </p>
    </div>
  );
}
