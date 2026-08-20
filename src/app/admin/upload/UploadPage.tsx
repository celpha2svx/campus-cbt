"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Home, Upload } from "lucide-react";

type RawQuestion = {
  id?: string;
  course?: string;
  topic?: string;
  sub_topic?: string;
  question_text?: string;
  options?: { key?: string; text?: string }[];
  correct_option?: string;
  explanation?: string;
  difficulty?: string;
  source?: string;
  year?: string;
  is_verified?: boolean;
  tags?: string[];
};

type ValidQuestion = {
  id: string;
  course: string;
  topic: string;
  sub_topic: string;
  question_text: string;
  options: { key: string; text: string }[];
  correct_option: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  source: string;
  year: string;
  is_verified: boolean;
  tags: string[];
};

const VALID_KEYS = new Set(["A", "B", "C", "D"]);

function validate(raw: RawQuestion): string[] {
  const errs: string[] = [];
  if (!raw.id) errs.push("missing id");
  if (!raw.course) errs.push("missing course");
  if (!raw.topic) errs.push("missing topic");
  if (!raw.sub_topic) errs.push("missing sub_topic");
  if (!raw.question_text) errs.push("missing question_text");
  if (!Array.isArray(raw.options) || raw.options.length !== 4) {
    errs.push("options must be an array of 4");
  } else {
    raw.options.forEach((opt, i) => {
      const expected = ["A", "B", "C", "D"][i];
      if (opt.key !== expected) {
        errs.push(`option ${i} key should be ${expected}, got ${opt.key}`);
      }
      if (!opt.text || String(opt.text).length === 0) {
        errs.push(`option ${i} empty text`);
      }
    });
  }
  if (!raw.correct_option || !VALID_KEYS.has(raw.correct_option)) {
    errs.push(`invalid correct_option ${raw.correct_option}`);
  }
  if (!raw.explanation) errs.push("missing explanation");
  return errs;
}

export function UploadPage() {
  const [rawJson, setRawJson] = useState("");
  const [merged, setMerged] = useState<ValidQuestion[] | null>(null);
  const [report, setReport] = useState<{
    valid: number;
    invalid: number;
    duplicates: number;
    errors: { id: string; errs: string[] }[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch (e) {
      setReport({ valid: 0, invalid: 0, duplicates: 0, errors: [{ id: "(parse)", errs: [(e as Error).message] }] });
      setMerged(null);
      return;
    }

    if (!Array.isArray(parsed)) {
      setReport({ valid: 0, invalid: 0, duplicates: 0, errors: [{ id: "(root)", errs: ["JSON must be an array"] }] });
      setMerged(null);
      return;
    }

    const existing = await fetch("/api/existing-ids").catch(() => null);
    let existingIds = new Set<string>();
    if (existing && existing.ok) {
      const data = (await existing.json()) as { ids: string[] };
      existingIds = new Set(data.ids);
    }

    const valid: ValidQuestion[] = [];
    const errors: { id: string; errs: string[] }[] = [];
    let duplicates = 0;

    for (const item of parsed as RawQuestion[]) {
      const errs = validate(item);
      if (errs.length > 0) {
        errors.push({ id: item.id ?? "(no id)", errs });
        continue;
      }
      if (existingIds.has(item.id!)) {
        duplicates++;
        continue;
      }
      valid.push({
        id: item.id!,
        course: item.course!,
        topic: item.topic!,
        sub_topic: item.sub_topic!,
        question_text: item.question_text!,
        options: item.options!.map((o) => ({ key: o.key!, text: o.text! })),
        correct_option: item.correct_option!,
        explanation: item.explanation!,
        difficulty: (item.difficulty as "easy" | "medium" | "hard") ?? "medium",
        source: item.source ?? "Imported",
        year: item.year ?? "",
        is_verified: item.is_verified ?? false,
        tags: item.tags ?? [],
      });
    }

    setReport({
      valid: valid.length,
      invalid: errors.length,
      duplicates,
      errors,
    });
    setMerged(valid);
  }

  function downloadMerged() {
    if (!merged) return;
    const blob = new Blob([JSON.stringify(merged, null, 2) + "\n"], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions-merged.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function copyMerged() {
    if (!merged) return;
    await navigator.clipboard.writeText(JSON.stringify(merged, null, 2) + "\n");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="min-h-screen pb-16">
      <header className="border-b border-line">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-soft hover:text-ink"
          >
            <Home size={13} />
            Home
          </Link>
          <span className="font-mono text-[10px] text-gold uppercase tracking-widest font-semibold">
            Admin
          </span>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-5 pt-8">
        <p className="font-mono text-[11px] uppercase tracking-wide text-gold mb-2">
          Upload past questions
        </p>
        <h1 className="font-serif text-2xl font-medium leading-tight mb-3">
          Add past questions to the bank
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          Paste JSON in the same shape as <code className="font-mono text-[12px] bg-paper-alt px-1 py-0.5 rounded-sm">src/data/questions.json</code>. The tool validates each item, dedupes against the live bank, and lets you download the merged set. Drop the file into the repo and commit.
        </p>

        <div className="bg-white border border-line rounded-sm overflow-hidden mb-4">
          <div className="bg-paper-alt px-4 py-2.5 border-b border-dashed border-line">
            <p className="font-mono text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
              Paste JSON array of questions
            </p>
          </div>
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            placeholder='[{"id":"ssc-202-001","course":"SSC202","topic":"...","sub_topic":"...","question_text":"...","options":[{"key":"A","text":"..."},...],"correct_option":"A","explanation":"...","difficulty":"medium","source":"SSC202 PQ","year":"2024","is_verified":false,"tags":[]}]'
            className="w-full font-mono text-[12px] p-4 outline-none min-h-[260px] resize-y"
            spellCheck={false}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full inline-flex items-center justify-center gap-2 bg-ink text-paper py-3 rounded-sm font-mono text-xs font-semibold uppercase tracking-wide hover:bg-ink-soft transition-colors"
        >
          <Upload size={15} />
          Validate and merge
        </button>

        {report && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label="Valid"
                value={report.valid}
                tone={report.valid > 0 ? "good" : "neutral"}
              />
              <StatCard
                label="Duplicates"
                value={report.duplicates}
                tone="neutral"
              />
              <StatCard
                label="Invalid"
                value={report.invalid}
                tone={report.invalid > 0 ? "bad" : "good"}
              />
            </div>

            {report.errors.length > 0 && (
              <div className="bg-incorrect-bg border-l-2 border-incorrect rounded-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={15} className="text-incorrect" />
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-incorrect">
                    {report.errors.length} item(s) failed validation
                  </p>
                </div>
                <ul className="space-y-2 text-xs">
                  {report.errors.slice(0, 30).map((e, i) => (
                    <li key={i}>
                      <span className="font-mono font-semibold">{e.id}</span>:{" "}
                      {e.errs.join("; ")}
                    </li>
                  ))}
                  {report.errors.length > 30 && (
                    <li className="font-mono text-ink-soft">
                      …and {report.errors.length - 30} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            {merged && merged.length > 0 && (
              <div className="bg-correct-bg border-l-2 border-correct rounded-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={15} className="text-correct" />
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-correct">
                    {merged.length} new questions ready to merge
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={downloadMerged}
                    className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-3 py-2 rounded-sm font-mono text-[11px] font-semibold uppercase tracking-wide hover:bg-ink-soft transition-colors"
                  >
                    Download JSON
                  </button>
                  <button
                    onClick={copyMerged}
                    className="inline-flex items-center justify-center gap-2 border border-ink text-ink px-3 py-2 rounded-sm font-mono text-[11px] font-semibold uppercase tracking-wide hover:bg-paper transition-colors"
                  >
                    {copied ? "Copied" : "Copy JSON"}
                  </button>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mt-3">
                  Drop the file at src/data/questions.json (or append its contents) and commit.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "good" | "bad" | "neutral";
}) {
  const color =
    tone === "good"
      ? "border-correct bg-correct-bg text-correct"
      : tone === "bad"
        ? "border-incorrect bg-incorrect-bg text-incorrect"
        : "border-line bg-paper-alt text-ink";

  return (
    <div className={`border rounded-sm px-3 py-3 text-center ${color}`}>
      <p className="font-mono text-[10px] uppercase tracking-wide">{label}</p>
      <p className="font-serif text-2xl font-medium">{value}</p>
    </div>
  );
}

export default UploadPage;
