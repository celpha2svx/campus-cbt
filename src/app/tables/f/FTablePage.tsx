"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { F_CRITICAL_05, F_CRITICAL_01 } from "@/lib/tables/f";

export function FTablePage() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SSC202";
  const [alpha, setAlpha] = useState<"0.05" | "0.01">("0.05");

  const table = alpha === "0.05" ? F_CRITICAL_05 : F_CRITICAL_01;
  const dfRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 60, 100];
  const dfCols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 60, 100];

  return (
    <main className="min-h-screen pb-16">
      <header className="border-b border-line sticky top-0 bg-paper z-10">
        <div className="max-w-xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-soft hover:text-ink"
            >
              <Home size={13} />
              Home
            </Link>
            <span className="text-line">|</span>
            <Link
              href={`/study?course=${course}`}
              className="font-mono text-[11px] uppercase tracking-wide hover:underline underline-offset-2"
            >
              {course} . F Table
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-5 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-wide text-gold mb-2">
          Reference table
        </p>
        <h1 className="font-serif text-2xl font-medium leading-tight mb-2">
          F Critical Values
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          Use for F-tests and ANOVA. Rows = df₁ (numerator), columns = df₂
          (denominator).
        </p>

        <div className="grid grid-cols-2 gap-1.5 mb-4 max-w-xs">
          <button
            onClick={() => setAlpha("0.05")}
            className={`py-2 border rounded-sm font-mono text-[11px] font-semibold uppercase tracking-wide transition-colors ${
              alpha === "0.05"
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-soft hover:border-ink-soft"
            }`}
          >
            α = 0.05
          </button>
          <button
            onClick={() => setAlpha("0.01")}
            className={`py-2 border rounded-sm font-mono text-[11px] font-semibold uppercase tracking-wide transition-colors ${
              alpha === "0.01"
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-soft hover:border-ink-soft"
            }`}
          >
            α = 0.01
          </button>
        </div>

        <div className="overflow-x-auto border border-line rounded-sm bg-white">
          <table className="font-mono text-[11px] w-full">
            <thead>
              <tr className="bg-paper-alt border-b border-line">
                <th className="px-2 py-2 text-left font-semibold">df₁\df₂</th>
                {dfCols.map((df2) => (
                  <th key={df2} className="px-2 py-2 text-center font-semibold">
                    {df2}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dfRows.map((df1) => (
                <tr key={df1} className="border-b border-line last:border-b-0">
                  <td className="px-2 py-1.5 font-semibold bg-paper-alt">{df1}</td>
                  {dfCols.map((df2) => (
                    <td key={df2} className="px-2 py-1.5 text-center tabular-nums">
                      {table[df1]?.[df2]?.toFixed(2) ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link
          href={`/study?course=${course}`}
          className="mt-8 inline-flex items-center gap-1 font-mono text-xs text-ink-soft hover:text-ink"
        >
          <ChevronLeft size={13} />
          Back to {course} study
        </Link>
      </section>
    </main>
  );
}

export default FTablePage;
