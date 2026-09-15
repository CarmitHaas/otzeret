/* Pure logic for אוצרת. No DOM, no storage. Works in the browser (global OTZ_LOGIC) and in node (module.exports). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.OTZ_LOGIC = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const pad = (n) => String(n).padStart(2, '0');

  /** Local calendar date as YYYY-MM-DD. */
  function dayKey(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  /** Parse 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm' as LOCAL time (Date.parse would treat date-only as UTC). */
  function parseLocal(s) {
    if (typeof s !== 'string') return null;
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?$/);
    if (!m) return null;
    const d = new Date(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }

  /** ?now=2026-09-18T10:30 lets parents preview a day. */
  function parseNowOverride(search) {
    if (!search) return null;
    const m = String(search).match(/[?&]now=([^&]+)/);
    if (!m) return null;
    return parseLocal(decodeURIComponent(m[1]));
  }

  function hallStatus(hall, now, settings) {
    if (settings && settings.openAll) return 'open';
    const opens = parseLocal(hall.date);
    return now.getTime() >= opens.getTime() ? 'open' : 'locked';
  }

  /** Today's hall; if today has none, the nearest previous one; before the trip the first. */
  function currentHallId(halls, now) {
    const today = dayKey(now);
    const sorted = [...halls].sort((a, b) => (a.date < b.date ? -1 : 1));
    let pick = null;
    for (const h of sorted) {
      if (h.date <= today) pick = h;
    }
    return (pick || sorted[0]).id;
  }

  function envelopeStatus(env, now, opened, settings) {
    if (opened && opened[env.id] && opened[env.id].openedAt) return 'opened';
    if (settings && settings.openAll) return 'ready';
    const at = parseLocal(env.openAt);
    return now.getTime() >= at.getTime() ? 'ready' : 'sealed';
  }

  /** Number of red-thread fragments visible. thresholds.length fragments + 1 final (binding). */
  function threadUnlocked(exhibitCount, thresholds, bound) {
    if (bound) return thresholds.length + 1;
    let n = 0;
    for (const t of thresholds) if (exhibitCount >= t) n++;
    return n;
  }

  function pickCard(deck, drawnIds, rng) {
    if (!deck || deck.length === 0) return null;
    const drawn = new Set(drawnIds || []);
    let pool = deck.filter((c) => !drawn.has(c.id));
    if (pool.length === 0) pool = deck.slice();
    const r = typeof rng === 'function' ? rng() : Math.random();
    return pool[Math.min(pool.length - 1, Math.floor(r * pool.length))];
  }

  /** Merge imported profiles into local ones: newer exhibit wins, envelopes/cards union, names from incoming. */
  function mergeProfiles(local, incoming) {
    const out = JSON.parse(JSON.stringify(local || {}));
    for (const [pid, prof] of Object.entries(incoming || {})) {
      if (!out[pid]) { out[pid] = JSON.parse(JSON.stringify(prof)); continue; }
      const dst = out[pid];
      dst.name = prof.name || dst.name;
      dst.emblem = prof.emblem || dst.emblem;
      dst.exhibits = dst.exhibits || {};
      for (const [sid, ex] of Object.entries(prof.exhibits || {})) {
        const cur = dst.exhibits[sid];
        if (!cur || String(ex.doneAt || '') > String(cur.doneAt || '')) dst.exhibits[sid] = ex;
      }
      dst.envelopes = Object.assign({}, prof.envelopes || {}, dst.envelopes || {});
      dst.cards = Object.assign({}, prof.cards || {}, dst.cards || {});
      dst.notes = Object.assign({}, prof.notes || {}, dst.notes || {});
      dst.little = Object.assign({}, prof.little || {}, dst.little || {});
      if (prof.boundAt && !dst.boundAt) dst.boundAt = prof.boundAt;
    }
    return out;
  }

  const DAYS = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'];
  const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

  function hebrewDate(d) {
    const date = d instanceof Date ? d : parseLocal(d);
    return `${DAYS[date.getDay()]}, ${date.getDate()} ב${MONTHS[date.getMonth()]}`;
  }

  function shortDate(d) {
    const date = d instanceof Date ? d : parseLocal(d);
    return `${date.getDate()}.${date.getMonth() + 1}`;
  }

  function exhibitOrder(exhibits) {
    return Object.entries(exhibits || {})
      .sort((a, b) => String(a[1].doneAt) < String(b[1].doneAt) ? -1 : 1)
      .map(([id]) => id);
  }

  /** Human countdown to a moment, in Hebrew. */
  function countdown(now, targetStr) {
    const t = parseLocal(targetStr);
    let ms = t.getTime() - now.getTime();
    if (ms <= 0) return 'עכשיו';
    const mins = Math.round(ms / 60000);
    if (mins < 60) return `בעוד ${mins} דק׳`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 36) return `בעוד ${hrs} שעות`;
    const days = Math.round(hrs / 24);
    return `בעוד ${days} ימים`;
  }

  return { dayKey, parseLocal, parseNowOverride, hallStatus, currentHallId, envelopeStatus, threadUnlocked, pickCard, mergeProfiles, hebrewDate, shortDate, exhibitOrder, countdown, DAYS, MONTHS };
});
