import studyNotesData from "../../data/study-notes.json";
import studyNotesDataSsc from "../../data/study-notes-ssc202.json";

export type StudyNote = {
  id: string;
  course: string;
  topic: string;
  sub_topic: string;
  title: string;
  content: string;
  tags?: string[];
};

const notesByCourse: Record<string, StudyNote[]> = {
  SOC202: studyNotesData as StudyNote[],
  SSC202: studyNotesDataSsc as StudyNote[],
};

function notesForCourse(course: string): StudyNote[] {
  return notesByCourse[course] ?? [];
}

export function getStudyNotesForCourse(course: string): StudyNote[] {
  return notesForCourse(course);
}

export function getStudyNotesByTopic(
  course: string,
  topic: string
): StudyNote[] {
  return notesForCourse(course)
    .filter((note) => note.topic === topic)
    .sort((a, b) => a.sub_topic.localeCompare(b.sub_topic));
}

export function getStudyNoteBySubTopic(
  course: string,
  topic: string,
  subTopic: string
): StudyNote | undefined {
  return notesForCourse(course).find(
    (note) =>
      note.topic === topic && note.sub_topic === subTopic
  );
}

export function getTopicsWithNotes(course: string): string[] {
  return Array.from(
    new Set(notesForCourse(course).map((note) => note.topic))
  );
}

export function getSubTopicsWithNotes(course: string, topic: string): string[] {
  return Array.from(
    new Set(
      notesForCourse(course)
        .filter((note) => note.topic === topic)
        .map((note) => note.sub_topic)
    )
  );
}
