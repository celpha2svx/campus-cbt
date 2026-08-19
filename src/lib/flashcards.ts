import flashcardsData from "../../data/flashcards.json";

export type Flashcard = {
  id: string;
  course: string;
  topic: string;
  front: string;
  back: string;
  tags?: string[];
};

const cards = flashcardsData as Flashcard[];

export function getFlashcardsForCourse(course: string): Flashcard[] {
  return cards.filter((card) => card.course === course);
}

export function getFlashcardsByTopic(
  course: string,
  topic: string
): Flashcard[] {
  return cards.filter(
    (card) => card.course === course && card.topic === topic
  );
}

export function getFlashcardTopics(course: string): string[] {
  return Array.from(
    new Set(
      cards.filter((card) => card.course === course).map((card) => card.topic)
    )
  );
}
