import { Course, Question } from "./types";
import { getQuestions } from "./questions";

const COURSE_CATALOG: Array<Omit<Course, "questionCount">> = [
  {
    id: "SOC202",
    code: "SOC 202",
    fullName: "Introduction to Sociology II",
    description: "Research methods, sociological theories, social problems, and welfare.",
    available: true,
  },
  {
    id: "SSC202",
    code: "SSC 202",
    fullName: "Coming soon",
    description: "This course will be available soon.",
    available: false,
  },
];

export function getCourses(): Course[] {
  return COURSE_CATALOG.map((course) => ({
    ...course,
    questionCount: course.available
      ? getQuestions({ course: course.id }).length
      : 0,
  }));
}

export function getCourse(courseId: string): Course | undefined {
  return getCourses().find((course) => course.id === courseId);
}

export type CourseSummary = {
  id: string;
  code: string;
  fullName: string;
  description: string;
  available: boolean;
  verifiedCount: number;
  totalCount: number;
};

export function getCourseSummaries(): CourseSummary[] {
  const all = getQuestions({ verifiedOnly: false });
  return COURSE_CATALOG.map((course) => {
    const matching = all.filter((q: Question) => q.course === course.id);
    const verified = matching.filter((q) => q.is_verified).length;
    return {
      id: course.id,
      code: course.code,
      fullName: course.fullName,
      description: course.description,
      available: course.available,
      verifiedCount: verified,
      totalCount: matching.length,
    };
  });
}
