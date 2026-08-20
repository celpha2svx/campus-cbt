"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { CHI_SQUARE_CRITICAL } from "@/lib/tables/chi-square";

export function ChiSquareTablePage() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SSC202";

  const dfRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 40, 50, 60, 80, 100];
  const alphas = ["0.10", "0.05", "0.025", "0.01", "0.005", "0.001"];

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
              {course} . Chi-Square
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-5 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-wide text-gold mb-2">
          Reference table
        </p>
        <h1 className="font-serif text-2xl font-medium leading-tight mb-2">
          Chi-Square (χ²) Critical Values
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          Use for the chi-square test of independence. For an r × c contingency table,
          df = (r − 1)(c − 1).
        </p>

        <div className="overflow-x-auto border border-line rounded-sm bg-white">
          <table className="font-mono text-[11px] w-full">
            <thead>
              <tr className="bg-paper-alt border-b border-line">
                <th className="px-3 py-2 text-left font-semibold">df</th>
                {alphas.map((a) => (
                  <th key={a} className="px-3 py-2 text-center font-semibold">
                    α = {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dfRows.map((df) => (
                <tr key={df} className="border-b border-line last:border-b-0">
                  <td className="px-3 py-1.5 font-semibold bg-paper-alt">{df}</td>
                  {alphas.map((a) => (
                    <td key={a} className="px-3 py-1.5 text-center tabular-nums">
                      {CHI_SQUARE_CRITICAL[df]?.[a]?.toFixed(3) ?? "—"}
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

export default ChiSquareTablePage;
