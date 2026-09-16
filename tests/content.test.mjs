/* Content QA: every day of the trip resolves, every card is complete, every image exists.
   Run: node --test tests/content.test.mjs */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

globalThis.window = globalThis.window || {};
globalThis.self = globalThis.self || globalThis;
const L = require('../js/logic.js');
require('../js/content.js');
require('../js/content-paris.js');
require('../js/content-london.js');
require('../js/content-south.js');
require('../js/credits.js');
const C = globalThis.window.OTZ_CONTENT;
const CREDITS = globalThis.self.OTZ_CREDITS || [];

const hallIds = new Set(C.halls.map((h) => h.id));
const stopIds = C.stops.map((s) => s.id);

test('every stop has a unique id and belongs to a real hall', () => {
  assert.equal(new Set(stopIds).size, stopIds.length, 'duplicate stop id');
  for (const s of C.stops) assert.ok(hallIds.has(s.hall), `${s.id}: unknown hall ${s.hall}`);
});

test('every stop is complete: name, place, hook, secret, missions', () => {
  for (const s of C.stops) {
    for (const k of ['name', 'place', 'hook', 'secret']) {
      assert.ok(typeof s[k] === 'string' && s[k].trim().length > 0, `${s.id}: missing ${k}`);
    }
    assert.ok(Array.isArray(s.missions) && s.missions.length >= 2, `${s.id}: needs at least two missions`);
    assert.ok(s.time || s.when, `${s.id}: needs a time or a day label`);
  }
});

test('every mission is valid for its type', () => {
  const types = new Set(['photo', 'sketch', 'words', 'color', 'find']);
  for (const s of C.stops) {
    const ids = s.missions.map((m) => m.id);
    assert.equal(new Set(ids).size, ids.length, `${s.id}: duplicate mission id`);
    for (const m of s.missions) {
      assert.ok(types.has(m.type), `${s.id}/${m.id}: unknown type ${m.type}`);
      assert.ok(m.title && m.prompt, `${s.id}/${m.id}: missing title or prompt`);
      if (m.type === 'find') {
        assert.ok(Array.isArray(m.items) && m.items.length > 0, `${s.id}/${m.id}: find needs items`);
      }
      if (m.type === 'color' && m.presets) {
        for (const c of m.presets) assert.match(c, /^#[0-9A-Fa-f]{6}$/, `${s.id}/${m.id}: bad preset ${c}`);
      }
    }
  }
});

test('every day of the trip lands on a hall that has stops', () => {
  const start = L.parseLocal(C.trip.start), end = L.parseLocal(C.trip.end);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const at = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 10, 0);
    const hid = L.currentHallId(C.halls, at);
    assert.ok(hallIds.has(hid), `${L.dayKey(at)}: no hall`);
    const stops = C.stops.filter((s) => s.hall === hid);
    assert.ok(stops.length > 0, `${L.dayKey(at)}: hall ${hid} has no stops`);
  }
});

test('halls are in order, dated inside the trip, and all reachable', () => {
  const used = new Set(C.stops.map((s) => s.hall));
  for (const h of C.halls) {
    assert.ok(L.parseLocal(h.date), `${h.id}: bad date`);
    assert.ok(h.date >= C.trip.start && h.date <= C.trip.end, `${h.id}: date outside the trip`);
    assert.ok(used.has(h.id), `${h.id}: hall has no stops`);
    assert.ok(h.title && h.wing, `${h.id}: missing title or wing`);
  }
});

test('envelopes: ordered seals, valid dates, prompts and reveals line up', () => {
  const byTime = [...C.envelopes].sort((a, b) => (a.openAt < b.openAt ? -1 : 1));
  const keys = new Set();
  for (const e of byTime) {
    assert.ok(L.parseLocal(e.openAt), `${e.id}: bad openAt`);
    assert.ok(e.title && e.body, `${e.id}: missing title or body`);
    if (e.prompt) {
      assert.ok(e.prompt.key && e.prompt.label, `${e.id}: incomplete prompt`);
      assert.ok(!keys.has(e.prompt.key), `${e.id}: duplicate prompt key ${e.prompt.key}`);
      keys.add(e.prompt.key);
    }
  }
  // a reveal must refer to a prompt that is written EARLIER in the trip
  for (const e of C.envelopes) {
    if (!e.reveals) continue;
    const src = C.envelopes.find((x) => x.prompt && x.prompt.key === e.reveals);
    assert.ok(src, `${e.id}: reveals unknown key ${e.reveals}`);
    assert.ok(src.openAt < e.openAt, `${e.id}: reveals ${e.reveals} before it is written`);
  }
  const seals = byTime.map((e) => Number(e.seal));
  assert.deepEqual(seals, seals.slice().sort((a, b) => a - b), 'seal numbers are out of order');
});

test('the red thread has one more fragment than it has thresholds', () => {
  assert.equal(C.thread.length, C.thresholds.length + 1);
  for (const f of C.thread) assert.ok(f.title && f.text, 'fragment missing title or text');
  const asc = C.thresholds.slice().sort((a, b) => a - b);
  assert.deepEqual(C.thresholds, asc, 'thresholds must ascend');
  assert.ok(C.thresholds[C.thresholds.length - 1] <= C.stops.length, 'last threshold is unreachable');
});

test('cards of the day are unique', () => {
  const ids = C.cards.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const c of C.cards) assert.ok(c.text && c.text.length > 8, `${c.id}: text too short`);
});

test('every credited image file exists, and every credit maps to a stop or a hall', () => {
  const known = new Set([...stopIds, ...C.halls.map((h) => 'hall-' + h.id)]);
  for (const c of CREDITS) {
    assert.ok(known.has(c.id), `credit ${c.id} matches no stop or hall`);
    assert.ok(fs.existsSync(`img/${c.id}.jpg`), `missing file img/${c.id}.jpg`);
    assert.ok(c.license && c.page, `${c.id}: missing licence or source page`);
  }
});

test('no image file is orphaned', () => {
  const credited = new Set(CREDITS.map((c) => c.id));
  for (const f of fs.readdirSync('img')) {
    assert.ok(credited.has(f.replace(/\.jpg$/, '')), `img/${f} has no credit entry`);
  }
});

test('the service worker precaches every script the page loads', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const sw = fs.readFileSync('sw.js', 'utf8');
  const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
  for (const src of srcs) assert.ok(sw.includes(src), `sw.js does not precache ${src}`);
  for (const href of [...html.matchAll(/<link rel="stylesheet" href="(css\/[^"]+)"/g)].map((m) => m[1])) {
    assert.ok(sw.includes(href), `sw.js does not precache ${href}`);
  }
});
