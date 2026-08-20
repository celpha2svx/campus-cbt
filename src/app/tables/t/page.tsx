import { Suspense } from "react";
import TTablePage from "./TTablePage";

export default function TTableRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <TTablePage />
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
