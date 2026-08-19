const fs = require('fs');
const path = require('path');

const QUESTIONS_PATH = path.join(__dirname, '..', 'src', 'data', 'questions.json');
const OUT_DIR = path.join(__dirname, '..', 'data', 'revision_cards_by_topic');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function firstSentence(text) {
  if (!text) return '';
  const match = text.trim().match(/([^.!?]+[.!?])/);
  return match ? match[0].trim() : text.trim();
}

function truncate(text, n=120) {
  if (text.length <= n) return text;
  return text.slice(0, n).trim().replace(/[,;]$/,'') + '...';
}

function main() {
  const questions = loadJson(QUESTIONS_PATH);
  const byTopic = {};

  for (const q of questions) {
    const topic = q.topic || 'Misc';
    const front = truncate(q.question_text.replace(/\s+/g,' '), 120);
    const back = firstSentence(q.explanation).replace(/\s+/g,' ');
    const card = {
      id: `rc-${q.id}`,
      course: q.course,
      topic,
      front,
      back,
      tags: q.tags || [],
    };

    if (!byTopic[topic]) byTopic[topic] = [];
    byTopic[topic].push(card);
  }

  ensureDir(OUT_DIR);
  let total = 0;
  for (const [topic, cards] of Object.entries(byTopic)) {
    const safeName = topic.replace(/[\\/:*?"<>|]/g, '-').toLowerCase().replace(/\s+/g,'-');
    const outPath = path.join(OUT_DIR, `${safeName}.json`);
    fs.writeFileSync(outPath, JSON.stringify(cards, null, 2) + '\n', 'utf8');
    total += cards.length;
  }

  console.log(`Wrote ${total} revision cards across ${Object.keys(byTopic).length} topics.`);
}

if (require.main === module) main();
