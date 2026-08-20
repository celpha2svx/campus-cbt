"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

const TABLES = [
  {
    slug: "z",
    title: "Standard Normal (Z) Table",
    description: "Cumulative probabilities and common critical values for the standard normal distribution.",
  },
  {
    slug: "t",
    title: "Student's t Critical Values",
    description: "Use for small samples when the population standard deviation is unknown.",
  },
  {
    slug: "chi-square",
    title: "Chi-Square (χ²) Critical Values",
    description: "Use for the chi-square test of independence and goodness-of-fit tests.",
  },
  {
    slug: "f",
    title: "F Critical Values",
    description: "Use for F-tests and ANOVA. α = 0.05 and 0.01 tables included.",
  },
];

export function TablesIndex() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "SSC202";

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
              {course} . Tables
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-xl mx-auto px-5 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-wide text-gold mb-2">
          Reference tables
        </p>
        <h1 className="font-serif text-2xl font-medium leading-tight mb-2">
          Statistical tables
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          Open the table you need. On a question that requires a table lookup, the
          hint will tell you which one.
        </p>

        <div className="space-y-2.5">
          {TABLES.map((t) => (
            <Link
              key={t.slug}
              href={`/tables/${t.slug}?course=${course}`}
              className="block bg-white border border-line rounded-sm px-4 py-3 hover:border-ink-soft transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-serif text-base font-medium leading-tight">
                    {t.title}
                  </p>
                  <p className="text-sm text-ink-soft leading-snug mt-1">
                    {t.description}
                  </p>
                </div>
                <ChevronRight size={16} className="text-ink-soft shrink-0" />
              </div>
            </Link>
          ))}
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

export default TablesIndex;
