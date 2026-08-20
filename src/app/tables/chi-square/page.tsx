import { Suspense } from "react";
import ChiSquareTablePage from "./ChiSquareTablePage";

export default function ChiSquareTableRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <ChiSquareTablePage />
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
