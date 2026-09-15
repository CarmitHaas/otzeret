import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const V = require('../js/voice.js');

test('feminine voice is untouched', () => {
  assert.equal(V.apply('תסתכלי על הקירות', 'f'), 'תסתכלי על הקירות');
});
test('masculine voice rewrites verified verbs and phrases', () => {
  assert.equal(V.apply('תסתכלי על הקירות, לא על החנויות.', 'm'), 'תסתכל על הקירות, לא על החנויות.');
  assert.equal(V.apply('את עומדת על נקודת האפס.', 'm'), 'אתה עומד על נקודת האפס.');
  assert.equal(V.apply('היום מצלמת רק דלתות.', 'm'), 'היום מצלם רק דלתות.');
  assert.equal(V.apply('פרצוף של האחות שלך רק ממשולשים.', 'm'), 'פרצוף של אחת הבנות רק ממשולשים.');
  assert.equal(V.apply('בטיול הזה את האוצרת.', 'm'), 'בטיול הזה אתה האוצר.');
});
test('the object marker את is never touched', () => {
  assert.equal(V.apply('מצאתי את הכדור ואת התאריך.', 'm'), 'מצאתי את הכדור ואת התאריך.');
  assert.equal(V.apply('לצייר את מה שרואים', 'm'), 'לצייר את מה שרואים');
});
test('past tense and neutral words stay as they are', () => {
  assert.equal(V.apply('מה ראית שאף אחד אחר לא ראה? היית בפריז.', 'm'), 'מה ראית שאף אחד אחר לא ראה? היית בפריז.');
  assert.equal(V.apply('התערוכה עדיין פתוחה. שורה אחת.', 'm'), 'התערוכה עדיין פתוחה. שורה אחת.');
});
test('every mapped word or phrase actually occurs in the content or UI', () => {
  const fs = require('node:fs');
  const src = ['js/content.js', 'js/content-paris.js', 'js/content-london.js', 'js/content-south.js', 'js/app.js'].map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const unused = [];
  for (const [f] of V.PHRASES) if (!src.includes(f)) unused.push(f);
  for (const w of Object.keys(V.WORDS)) if (!new RegExp('(^|[^\\u0590-\\u05FF])' + w + '([^\\u0590-\\u05FF]|$)').test(src)) unused.push(w);
  assert.deepEqual(unused, []);
});
