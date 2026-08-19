const fs = require('fs');
const path = require('path');

const QUESTIONS_PATH = path.join(__dirname, '..', 'src', 'data', 'questions.json');
const FLASH_PATH = path.join(__dirname, '..', 'data', 'flashcards.json');

function loadJson(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function saveJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function questionToFlashcard(q) {
  const optionsText = q.options.map(o => `${o.key}: ${o.text}`).join(' | ');
  const front = q.question_text.replace(/\s+/g, ' ').trim();
  const back = `${q.explanation}\n\nOptions: ${optionsText}`;

  return {
    id: `fc-${q.id}`,
    course: q.course,
    topic: q.topic,
    front,
    back,
    tags: q.tags || [],
  };
}

function main() {
  const questions = loadJson(QUESTIONS_PATH);
  if (!questions) {
    console.error('Could not read questions.json');
    process.exit(2);
  }

  const existing = loadJson(FLASH_PATH) || [];
  const existingIds = new Set(existing.map(f => f.id));

  const generated = [];
  for (const q of questions) {
    const fc = questionToFlashcard(q);
    if (!existingIds.has(fc.id)) {
      generated.push(fc);
    }
  }

  const merged = existing.concat(generated);
  saveJson(FLASH_PATH, merged);

  console.log(`Generated ${generated.length} new flashcards. Total now: ${merged.length}`);
}

if (require.main === module) main();
