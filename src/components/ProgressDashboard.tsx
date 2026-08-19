"use client";

import React, { useMemo } from "react";
import { useProgressMap } from "@/lib/use-progress";
import { Question } from "@/lib/types";

export function ProgressDashboard({ allQuestions }: { allQuestions: Question[] }) {
  const progress = useProgressMap();

  const stats = useMemo(() => {
    const total = allQuestions.length;
    let answered = 0;
    let attempts = 0;
    let correct = 0;
    let weak = 0;
    let bookmarked = 0;

    for (const q of allQuestions) {
      const p = progress[q.id];
      if (p?.last_answered_at) answered++;
      attempts += p?.attempts || 0;
      correct += p?.correct_attempts || 0;
      if (p?.needs_review) weak++;
      if (p?.bookmarked) bookmarked++;
    }

    const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
    return { total, answered, attempts, correct, accuracy, weak, bookmarked };
  }, [allQuestions, progress]);

  return (
    <div className="bg-white border border-line rounded-sm overflow-hidden mb-5">
      <div className="bg-paper-alt px-4 py-3 border-b border-dashed border-line">
        <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink-soft">
          Progress Overview
        </p>
      </div>

      <div className="px-5 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-paper-alt border border-line rounded-sm px-3 py-3 text-center">
            <p className="font-mono text-[10px] uppercase text-ink-soft">Answered</p>
            <p className="font-serif text-2xl font-medium">{stats.answered}</p>
            <p className="text-[11px] text-ink-soft">of {stats.total}</p>
          </div>

          <div className="bg-paper-alt border border-line rounded-sm px-3 py-3 text-center">
            <p className="font-mono text-[10px] uppercase text-ink-soft">Accuracy</p>
            <p className="font-serif text-2xl font-medium">{stats.accuracy}%</p>
            <p className="text-[11px] text-ink-soft">based on attempts</p>
          </div>

          <div className="bg-paper-alt border border-line rounded-sm px-3 py-3 text-center">
            <p className="font-mono text-[10px] uppercase text-ink-soft">Attempts</p>
            <p className="font-serif text-2xl font-medium">{stats.attempts}</p>
            <p className="text-[11px] text-ink-soft">total tries</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-paper-alt border border-line rounded-sm px-3 py-3 text-center">
            <p className="font-mono text-[10px] uppercase text-ink-soft">Weak</p>
            <p className="font-serif text-2xl font-medium text-incorrect">{stats.weak}</p>
            <p className="text-[11px] text-ink-soft">needs review</p>
          </div>

          <div className="bg-paper-alt border border-line rounded-sm px-3 py-3 text-center">
            <p className="font-mono text-[10px] uppercase text-ink-soft">Saved</p>
            <p className="font-serif text-2xl font-medium">{stats.bookmarked}</p>
            <p className="text-[11px] text-ink-soft">bookmarked</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressDashboard;
