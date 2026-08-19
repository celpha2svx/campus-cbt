const fs = require('fs');
const path = require('path');

const FLASH_PATH = path.join(__dirname, '..', 'data', 'flashcards.json');

function loadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.error('Could not read', p, err.message);
    process.exit(2);
  }
}

function main() {
  const cards = loadJson(FLASH_PATH);
  if (!Array.isArray(cards)) {
    console.error('flashcards.json is not an array');
    process.exit(1);
  }

  const errors = [];
  const seen = new Set();

  for (const card of cards) {
    if (!card.id) errors.push('missing id');
    if (seen.has(card.id)) errors.push(`duplicate id: ${card.id}`);
    seen.add(card.id);

    if (!card.course) errors.push(`${card.id}: missing course`);
    if (!card.topic) errors.push(`${card.id}: missing topic`);
    if (!card.front || typeof card.front !== 'string') {
      errors.push(`${card.id}: missing front`);
    }
    if (!card.back || typeof card.back !== 'string') {
      errors.push(`${card.id}: missing back`);
    }
    if (card.back && /Options: A:/.test(card.back)) {
      errors.push(`${card.id}: back contains option list - this is a question card, not a flashcard`);
    }
  }

  if (errors.length > 0) {
    console.error('flashcards.json has issues:');
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
  }

  console.log(`flashcards.json OK (${cards.length} curated card${cards.length === 1 ? '' : 's'}).`);
}

if (require.main === module) main();
