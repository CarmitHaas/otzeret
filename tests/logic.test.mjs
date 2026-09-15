import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const L = require('../js/logic.js');

const halls = [
  { id: 'd16', date: '2026-09-16' },
  { id: 'd17', date: '2026-09-17' },
  { id: 'd18', date: '2026-09-18' },
  { id: 'd29', date: '2026-09-29' },
];

test('dayKey uses local calendar date', () => {
  assert.equal(L.dayKey(new Date(2026, 8, 17, 23, 59)), '2026-09-17');
  assert.equal(L.dayKey(new Date(2026, 8, 18, 0, 0)), '2026-09-18');
});

test('parseNowOverride reads ?now= and ignores junk', () => {
  const d = L.parseNowOverride('?now=2026-09-18T10:30');
  assert.equal(d.getFullYear(), 2026);
  assert.equal(d.getMonth(), 8);
  assert.equal(d.getDate(), 18);
  assert.equal(d.getHours(), 10);
  assert.equal(L.parseNowOverride('?now=garbage'), null);
  assert.equal(L.parseNowOverride(''), null);
  assert.equal(L.parseNowOverride('?now=2026-09-18').getHours(), 0);
});

test('hall opens at local midnight of its date and stays open', () => {
  const hall = { id: 'd17', date: '2026-09-17' };
  assert.equal(L.hallStatus(hall, new Date(2026, 8, 16, 23, 59), {}), 'locked');
  assert.equal(L.hallStatus(hall, new Date(2026, 8, 17, 0, 0), {}), 'open');
  assert.equal(L.hallStatus(hall, new Date(2026, 8, 25, 12, 0), {}), 'open');
  assert.equal(L.hallStatus(hall, new Date(2026, 8, 1), { openAll: true }), 'open');
});

test('currentHallId picks today, else nearest previous, else first', () => {
  assert.equal(L.currentHallId(halls, new Date(2026, 8, 17, 9)), 'd17');
  assert.equal(L.currentHallId(halls, new Date(2026, 8, 20, 9)), 'd18'); // gap → previous
  assert.equal(L.currentHallId(halls, new Date(2026, 8, 1)), 'd16');      // before trip
  assert.equal(L.currentHallId(halls, new Date(2026, 9, 5)), 'd29');      // after trip
});

test('envelope status: sealed → ready → opened', () => {
  const env = { id: 'e1', openAt: '2026-09-16T20:00' };
  assert.equal(L.envelopeStatus(env, new Date(2026, 8, 16, 19, 59), {}), 'sealed');
  assert.equal(L.envelopeStatus(env, new Date(2026, 8, 16, 20, 0), {}), 'ready');
  assert.equal(L.envelopeStatus(env, new Date(2026, 8, 16, 20, 0), { e1: { openedAt: 'x' } }), 'opened');
  assert.equal(L.envelopeStatus(env, new Date(2026, 8, 1), {}, { openAll: true }), 'ready');
});

test('thread fragments unlock by exhibit count, last one only when bound', () => {
  const thresholds = [1, 4, 7];
  assert.equal(L.threadUnlocked(0, thresholds, false), 0);
  assert.equal(L.threadUnlocked(1, thresholds, false), 1);
  assert.equal(L.threadUnlocked(5, thresholds, false), 2);
  assert.equal(L.threadUnlocked(50, thresholds, false), 3);
  assert.equal(L.threadUnlocked(50, thresholds, true), 4);
  assert.equal(L.threadUnlocked(0, thresholds, true), 4); // binding reveals everything
});

test('pickCard avoids drawn cards and reshuffles when exhausted', () => {
  const deck = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const rng = () => 0; // always first candidate
  assert.equal(L.pickCard(deck, ['a', 'b'], rng).id, 'c');
  assert.equal(L.pickCard(deck, ['a', 'b', 'c'], rng).id, 'a');
  assert.equal(L.pickCard([], [], rng), null);
});

test('mergeProfiles keeps newer exhibits and unions envelopes', () => {
  const local = {
    p1: { name: 'נועה', exhibits: { s1: { doneAt: '2026-09-17T10:00' } }, envelopes: { e1: { openedAt: 'a' } } },
  };
  const incoming = {
    p1: { name: 'נועה', exhibits: { s1: { doneAt: '2026-09-17T12:00' }, s2: { doneAt: '2026-09-18T10:00' } }, envelopes: { e2: { openedAt: 'b' } } },
    p2: { name: 'שירה', exhibits: {}, envelopes: {} },
  };
  const merged = L.mergeProfiles(local, incoming);
  assert.equal(merged.p1.exhibits.s1.doneAt, '2026-09-17T12:00');
  assert.ok(merged.p1.exhibits.s2);
  assert.deepEqual(Object.keys(merged.p1.envelopes).sort(), ['e1', 'e2']);
  assert.ok(merged.p2);
  const m2 = L.mergeProfiles({ p1: { little: { a: true } } }, { p1: { little: { b: true } } });
  assert.deepEqual(Object.keys(m2.p1.little).sort(), ['a', 'b']);
});

test('hebrewDate formats day and month', () => {
  assert.equal(L.hebrewDate(new Date(2026, 8, 17)), 'יום חמישי, 17 בספטמבר');
  assert.equal(L.hebrewDate('2026-09-22'), 'יום שלישי, 22 בספטמבר');
});

test('exhibitOrder sorts by completion time', () => {
  const ex = { b: { doneAt: '2026-09-18T10:00' }, a: { doneAt: '2026-09-17T10:00' } };
  assert.deepEqual(L.exhibitOrder(ex), ['a', 'b']);
});
