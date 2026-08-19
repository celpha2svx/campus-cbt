import Link from "next/link";
import { ArrowRight, BookMarked, ClipboardList, Play } from "lucide-react";
import { getCourseSummaries } from "@/lib/courses";
import { SiteFooter } from "@/components/SiteFooter";

export default function HomePage() {
  const courses = getCourseSummaries();
  const liveCourses = courses.filter((c) => c.available);
  const totalQuestions = liveCourses.reduce((sum, c) => sum + c.verifiedCount, 0);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-line">
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between">
          <span className="font-mono text-xs font-bold tracking-widest uppercase">
            Campus<span className="text-gold">.</span>CBT
          </span>
          <span className="font-mono text-[10px] text-gold uppercase tracking-widest font-semibold">
            CBT Prep Made Easy
          </span>
        </div>
      </header>

      <section className="max-w-xl mx-auto px-5 pt-12 pb-10 w-full">
        <h1 className="font-serif text-3xl sm:text-4xl font-medium leading-tight mb-3">
          Practice smart. Pass easily.
        </h1>
        <p className="text-ink-soft leading-relaxed mb-8">
          Pick a course, drill real past questions, and focus on the ones you
          miss.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-10">
          <SummaryStat
            icon={<Play size={16} />}
            value={liveCourses.length}
            label={pluralize(liveCourses.length, "Live course", "Live courses")}
          />
          <SummaryStat
            icon={<ClipboardList size={16} />}
            value={totalQuestions}
            label={pluralize(totalQuestions, "Verified past question", "Verified past questions")}
          />
        </div>

        <h2 className="font-mono text-xs font-semibold text-ink-soft uppercase tracking-widest mb-4">
          Choose your course
        </h2>

        <div className="flex flex-col gap-4">
          {courses.map((course) => (
            <article
              key={course.id}
              className={`bg-white border border-line rounded-sm overflow-hidden ${
                !course.available ? "opacity-60" : ""
              }`}
            >
              <div className="bg-paper-alt px-4 py-2.5 flex items-center justify-between border-b border-dashed border-line">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                  {course.code}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                  {course.available
                    ? `${course.verifiedCount} verified of ${course.totalCount}`
                    : "Coming soon"}
                </span>
              </div>

              <div className="px-4 pt-4 pb-4">
                <h3 className="font-serif text-lg font-medium mb-1">
                  {course.fullName}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-4">
                  {course.description}
                </p>

                {course.available ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href={`/study?course=${course.id}`}
                      className="text-center font-mono text-xs font-semibold uppercase tracking-wide bg-ink text-paper py-2.5 rounded-sm hover:bg-ink-soft transition-colors"
                    >
                      Study Mode
                    </Link>
                    <Link
                      href={`/practice?course=${course.id}`}
                      className="text-center font-mono text-xs font-semibold uppercase tracking-wide border border-ink text-ink py-2.5 rounded-sm hover:bg-paper-alt transition-colors"
                    >
                      Practice Mode
                    </Link>
                    <Link
                      href={`/review?course=${course.id}`}
                      className="col-span-2 inline-flex items-center justify-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide border border-line text-ink-soft py-2.5 rounded-sm hover:border-ink-soft hover:text-ink transition-colors"
                    >
                      <BookMarked size={13} />
                      Review weak areas
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full font-mono text-xs font-semibold uppercase tracking-wide border border-line text-ink-soft py-2.5 rounded-sm cursor-not-allowed"
                  >
                    Coming soon
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function SummaryStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-paper-alt border border-line rounded-sm px-3 py-3 text-center">
      <div className="text-gold flex items-center justify-center mb-1.5">{icon}</div>
      <p className="font-serif text-xl font-medium leading-none">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft mt-1">
        {label}
      </p>
    </div>
  );
}

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}
