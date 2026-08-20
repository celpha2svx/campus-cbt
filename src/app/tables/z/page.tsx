import { Suspense } from "react";
import ZTablePage from "./ZTablePage";

export default function ZTableRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <ZTablePage />
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
