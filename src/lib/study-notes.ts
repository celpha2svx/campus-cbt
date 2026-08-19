import studyNotesData from "../../data/study-notes.json";

export type StudyNote = {
  id: string;
  course: string;
  topic: string;
  title: string;
  content: string;
  tags?: string[];
};

const notes = studyNotesData as StudyNote[];

export function getStudyNotesForCourse(course: string): StudyNote[] {
  return notes.filter((note) => note.course === course);
}

export function getStudyNotesByTopic(
  course: string,
  topic: string
): StudyNote[] {
  return notes.filter(
    (note) => note.course === course && note.topic === topic
  );
}

export function getTopicsWithNotes(course: string): string[] {
  return Array.from(
    new Set(
      notes.filter((note) => note.course === course).map((note) => note.topic)
    )
  );
}
