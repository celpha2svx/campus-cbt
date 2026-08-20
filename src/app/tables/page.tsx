import { Suspense } from "react";
import TablesIndex from "./TablesIndex";

export default function TablesRoute() {
  return (
    <Suspense fallback={<Loading />}>
      <TablesIndex />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">
        Loading tables...
      </p>
    </div>
  );
}
