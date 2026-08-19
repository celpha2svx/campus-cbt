const fs = require('fs');
const path = require('path');

const QUESTIONS_PATH = path.join(__dirname, '..', 'src', 'data', 'questions.json');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function main() {
  const questions = loadJson(QUESTIONS_PATH);
  const errors = [];
  const seenIds = new Set();

  if (!Array.isArray(questions)) {
    errors.push('questions.json is not an array');
  }

  const topicSet = new Set();
  const subTopicByTopic = new Map();

  for (const q of questions) {
    if (!q.id) errors.push('question missing id');
    if (seenIds.has(q.id)) errors.push(`duplicate id: ${q.id}`);
    seenIds.add(q.id);

    if (!q.course) errors.push(`${q.id}: missing course`);
    if (!q.topic) errors.push(`${q.id}: missing topic`);
    if (!q.sub_topic) errors.push(`${q.id}: missing sub_topic`);

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`${q.id}: expected exactly 4 options`);
    } else {
      q.options.forEach((opt, i) => {
        const expected = ['A', 'B', 'C', 'D'][i];
        if (opt.key !== expected) {
          errors.push(`${q.id}: option ${i} key should be ${expected}, got ${opt.key}`);
        }
        if (typeof opt.text !== 'string' || opt.text.length === 0) {
          errors.push(`${q.id}: option ${i} empty text`);
        }
      });
    }

    if (!['A', 'B', 'C', 'D'].includes(q.correct_option)) {
      errors.push(`${q.id}: invalid correct_option ${q.correct_option}`);
    }

    if (typeof q.explanation !== 'string' || q.explanation.length < 5) {
      errors.push(`${q.id}: explanation missing or too short`);
    }

    if (typeof q.is_verified !== 'boolean') {
      errors.push(`${q.id}: is_verified must be boolean`);
    }

    if (!Array.isArray(q.tags)) {
      errors.push(`${q.id}: tags must be array`);
    }

    topicSet.add(q.topic);
    if (!subTopicByTopic.has(q.topic)) subTopicByTopic.set(q.topic, new Set());
    subTopicByTopic.get(q.topic).add(q.sub_topic);
  }

  const verified = questions.filter((q) => q.is_verified).length;
  console.log(`questions: ${questions.length} (verified: ${verified})`);
  console.log(`topics: ${topicSet.size}`);

  for (const [topic, subs] of subTopicByTopic.entries()) {
    console.log(`  ${topic}: ${subs.size} sub-topics`);
  }

  if (errors.length > 0) {
    console.error('\nData errors:');
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
  }

  console.log('\nData OK.');
}

if (require.main === module) main();
