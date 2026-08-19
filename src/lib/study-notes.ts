import studyNotesData from "../../data/study-notes.json";

export type StudyNote = {
  id: string;
  course: string;
  topic: string;
  sub_topic: string;
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
  return notes
    .filter((note) => note.course === course && note.topic === topic)
    .sort((a, b) => a.sub_topic.localeCompare(b.sub_topic));
}

export function getStudyNoteBySubTopic(
  course: string,
  topic: string,
  subTopic: string
): StudyNote | undefined {
  return notes.find(
    (note) =>
      note.course === course &&
      note.topic === topic &&
      note.sub_topic === subTopic
  );
}

export function getTopicsWithNotes(course: string): string[] {
  return Array.from(
    new Set(
      notes.filter((note) => note.course === course).map((note) => note.topic)
    )
  );
}

export function getSubTopicsWithNotes(course: string, topic: string): string[] {
  return Array.from(
    new Set(
      notes
        .filter((note) => note.course === course && note.topic === topic)
        .map((note) => note.sub_topic)
    )
  );
}
