"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

export function ZTablePage() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SSC202";

  const rows = [];
  for (let z = 0; z <= 3.0; z += 0.1) {
    const rounded = Math.round(z * 10) / 10;
    const cols = [];
    for (let c = 0; c < 10; c++) {
      const value = rounded + c * 0.01;
      const lookupRow = Math.round(rounded * 10);
      cols.push({ value, probability: Z_TABLE[lookupRow]?.[c] ?? 0 });
    }
    rows.push({ z: rounded.toFixed(1), cols });
  }

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
              {course} . Z Table
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-5 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-wide text-gold mb-2">
          Reference table
        </p>
        <h1 className="font-serif text-2xl font-medium leading-tight mb-2">
          Standard Normal (Z) Table
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          Cumulative probability P(0 ≤ Z ≤ z) for z between 0 and 3.0. For negative
          z, use symmetry. For two-tailed critical values, see below the table.
        </p>

        <div className="overflow-x-auto border border-line rounded-sm bg-white">
          <table className="font-mono text-[11px] w-full">
            <thead>
              <tr className="bg-paper-alt border-b border-line">
                <th className="px-2 py-2 text-left font-semibold">z</th>
                {Array.from({ length: 10 }, (_, i) => (
                  <th key={i} className="px-2 py-2 text-center font-semibold">
                    {i.toString().padStart(2, "0")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.z} className="border-b border-line">
                  <td className="px-2 py-1.5 font-semibold bg-paper-alt">
                    {row.z}
                  </td>
                  {row.cols.map((col, i) => (
                    <td key={i} className="px-2 py-1.5 text-center tabular-nums">
                      {col.probability.toFixed(4)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-serif text-lg font-medium mt-8 mb-3">
          Common critical values
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-line rounded-sm overflow-hidden">
            <div className="bg-paper-alt px-4 py-2 border-b border-dashed border-line">
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
                One-tailed (α)
              </p>
            </div>
            <table className="font-mono text-[11px] w-full">
              <tbody>
                {Object.entries(Z_CRITICAL).map(([alpha, z]) => (
                  <tr key={alpha} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-2">α = {alpha}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{z}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-line rounded-sm overflow-hidden">
            <div className="bg-paper-alt px-4 py-2 border-b border-dashed border-line">
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
                Two-tailed (α)
              </p>
            </div>
            <table className="font-mono text-[11px] w-full">
              <tbody>
                {Object.entries(Z_TWO_TAILED_CRITICAL).map(([alpha, z]) => (
                  <tr key={alpha} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-2">α = {alpha}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{z}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

import { Z_TABLE, Z_CRITICAL, Z_TWO_TAILED_CRITICAL } from "@/lib/tables/z";

export default ZTablePage;
