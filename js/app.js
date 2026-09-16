/* אוצרת — app: routing, views, mission flows, envelopes, red thread, catalogue. */
(function () {
  'use strict';
  const C = window.OTZ_CONTENT;
  const L = window.OTZ_LOGIC;
  const S = window.OTZ_STORE;
  const VERSION = '1.0.0';

  // ---------- time (with ?now= preview override) ----------
  let nowOverride = null;
  try {
    const fromUrl = L.parseNowOverride(location.search);
    if (fromUrl) { nowOverride = fromUrl; sessionStorage.setItem('otz.now', fromUrl.toISOString()); }
    else { const s = sessionStorage.getItem('otz.now'); if (s) nowOverride = new Date(s); }
    if (/[?&]now=off/.test(location.search)) { nowOverride = null; sessionStorage.removeItem('otz.now'); }
  } catch (e) { /* ignore */ }
  const now = () => nowOverride ? new Date(nowOverride.getTime()) : new Date();

  // ---------- state ----------
  let state = S.load();
  const view = document.getElementById('view');
  const toastEl = document.getElementById('toast');
  const brand = document.getElementById('brand');
  const P = () => state.profiles[state.activeProfile] || null;
  const save = () => { if (!S.save(state)) showBanner = true; };
  let showBanner = false;

  // ---------- helpers ----------
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const latin = (s) => s ? `<span class="latin">${esc(s)}</span>` : '';
  const hallById = (id) => C.halls.find((h) => h.id === id);
  const stopById = (id) => C.stops.find((s) => s.id === id);
  const stopsOfHall = (hid) => C.stops.filter((s) => s.hall === hid).sort((a, b) => ((a.order || 0) - (b.order || 0)) || String(a.time || '').localeCompare(String(b.time || '')));
  const wingOf = (stop) => stop.wing || (hallById(stop.hall) || {}).wing || 'travel';
  const wingName = (id) => ((C.wings.find((w) => w.id === id) || {}).name) || '';
  const sortedHalls = () => [...C.halls].sort((a, b) => (a.date < b.date ? -1 : 1));
  const settings = () => (P() && P().settings) || {};
  const exhibitsCount = () => Object.keys((P() || {}).exhibits || {}).length;
  const threadCount = () => L.threadUnlocked(exhibitsCount(), C.thresholds, !!(P() && P().boundAt));
  const mediaKey = (sid) => `${state.activeProfile}:${sid}`;
  const TYPE_NAMES = { photo: 'צילום', sketch: 'רישום', words: 'מילים', color: 'צבע', find: 'חיפוש' };

  const ICONS = {
    today: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    museum: '<svg viewBox="0 0 24 24"><path d="M3 10l9-6 9 6"/><path d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9"/><path d="M3 19h18M4 22h16"/></svg>',
    envelope: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 0-3 3z"/><path d="M4 4v16a3 3 0 0 1 3-3h11"/><path d="M9 9h5M9 13h5"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    photo: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    sketch: '<svg viewBox="0 0 24 24"><path d="M4 20l4-1L19 8a2 2 0 0 0-3-3L5 16z"/><path d="M14 6l3 3"/></svg>',
    words: '<svg viewBox="0 0 24 24"><path d="M5 5h14M12 5v14M8 19h8"/></svg>',
    color: '<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>',
    find: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>',
    print: '<svg viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><rect x="6" y="14" width="12" height="7"/></svg>',
    thread: '<svg viewBox="0 0 24 24"><path d="M4 20c4-8 8 4 12-4s4-8 4-8"/><circle cx="4" cy="20" r="1.5"/></svg>',
    little: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M5.2 18.8l1.6-1.6M17.2 6.8l1.6-1.6"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>',
    stitchcheck: '<svg viewBox="0 0 24 24" style="stroke-dasharray:3.2 2.4"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    knot: '<svg viewBox="0 0 24 24"><path d="M7 17c5-2 3-8 8-10" stroke-width="2.4"/><circle cx="8.5" cy="14.5" r="3" stroke-width="2.4"/></svg>',
    // mission glyphs
    g_photo: '<svg viewBox="0 0 24 24"><path d="M3 8V4h4M21 8V4h-4M3 16v4h4M21 16v4h-4"/><circle cx="12" cy="12" r="3.4"/></svg>',
    g_sketch: '<svg viewBox="0 0 24 24"><path d="M4 16c3-6 5 3 8-3s4 4 8 1"/></svg>',
    g_words: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h8"/></svg>',
    g_color: '<svg viewBox="0 0 24 24"><rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M8.5 6v12M14 6v12"/></svg>',
    g_find: '<svg viewBox="0 0 24 24"><circle cx="6" cy="7" r="1.1"/><circle cx="12" cy="6" r="1.1"/><circle cx="18" cy="8" r="1.1"/><circle cx="7" cy="17" r="1.1"/><circle cx="17" cy="17" r="1.1"/><circle cx="12" cy="12.5" r="3.6" stroke-width="2.2"/></svg>',
    // wing glyphs
    w_paris: '<svg viewBox="0 0 24 24"><path d="M12 3L20 20H4z"/></svg>',
    w_london: '<svg viewBox="0 0 24 24"><path d="M4 20V11a8 8 0 0 1 16 0v9"/></svg>',
    w_disney: '<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z"/></svg>',
    w_south: '<svg viewBox="0 0 24 24"><path d="M2 9c3-3 5 3 8 0s5-3 8 0 4 0 4 0M2 16c3-3 5 3 8 0s5-3 8 0 4 0 4 0"/></svg>',
    w_travel: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>',
  };
  const ico = (n) => ICONS[n] || '';

  // ---------- photos (Wikimedia Commons, see js/credits.js) ----------
  const CREDITS = window.OTZ_CREDITS || [];
  const IMG_IDS = new Set(CREDITS.map((c) => c.id));
  const imgFor = (id) => IMG_IDS.has(id) ? `img/${id}.jpg` : null;
  const creditFor = (id) => CREDITS.find((c) => c.id === id);
  const creditLine = (id) => { const c = creditFor(id); return c ? `<p class="credit">תצלום: ${esc(c.artist || 'ויקישיתוף')} · <a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.license)}</a></p>` : ''; };
  let justDrew = false;
  const wingGlyph = (w) => `<span class="wing-glyph">${ico('w_' + (w || 'travel'))}</span>`;
  const wingLine = (w) => `${wingGlyph(w)}<span class="wing-name">${esc(wingName(w))}</span>`;
  const stampDate = (d) => { const x = L.parseLocal(d) || new Date(d); const z = (n) => String(n).padStart(2, '0'); return `${z(x.getDate())} ${z(x.getMonth() + 1)} '${String(x.getFullYear()).slice(2)}`; };
  const COST = { photo: 'דקה', sketch: '3 דקות', words: '3 דקות', color: 'דקה', find: '5 דקות' };
  /** A small or soft photo gets a bigger mat, the way a museum mats a small print. */
  function matSmallImages(root) {
    (root || view).querySelectorAll('.print > img').forEach((img) => {
      const check = () => { if (img.naturalWidth && img.naturalWidth < 620) img.parentElement.classList.add('print--matted'); };
      if (img.complete) check(); else img.addEventListener('load', check, { once: true });
    });
  }

  // ---------- voice (את / אתה) ----------
  const voice = () => (P() && P().voice) || 'f';
  const V = (t) => (t == null ? t : window.OTZ_VOICE.apply(String(t), voice()));
  const vs = (st) => Object.assign({}, st, { hook: V(st.hook), secret: V(st.secret), ask: V(st.ask), little: V(st.little) });
  const vm = (m) => Object.assign({}, m, { title: V(m.title), prompt: V(m.prompt), placeholder: V(m.placeholder), noteLabel: V(m.noteLabel), notePlaceholder: V(m.notePlaceholder), namePlaceholder: V(m.namePlaceholder), defaultTitle: V(m.defaultTitle), items: (m.items || []).map(V) });
  const ve = (e) => Object.assign({}, e, { body: V(e.body), revealLabel: V(e.revealLabel), prompt: e.prompt ? Object.assign({}, e.prompt, { label: V(e.prompt.label), placeholder: V(e.prompt.placeholder), hint: V(e.prompt.hint) }) : null });

  // ---------- toast ----------
  let toastTimer = null;
  function toast(html, ms) {
    toastEl.innerHTML = V(html); toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, ms || 3600);
  }

  // ---------- theme ----------
  function applyTheme() {
    const t = state.theme || 'auto';
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    const btn = document.getElementById('sunBtn');
    if (btn) { btn.innerHTML = ico('sun'); btn.setAttribute('aria-pressed', t === 'sun'); }
  }
  function toggleSun() {
    if ((state.theme || 'auto') === 'sun') state.theme = state.themeBase || 'auto';
    else { state.themeBase = state.theme || 'auto'; state.theme = 'sun'; }
    save(); applyTheme(); render();
  }

  // ---------- routing ----------
  function go(hash) { location.hash = hash; }
  function parseRoute() {
    const h = (location.hash || '#/').replace(/^#/, '');
    const [path, q] = h.split('?');
    const parts = path.split('/').filter(Boolean);
    const query = {};
    (q || '').split('&').forEach((kv) => { if (!kv) return; const [k, v] = kv.split('='); query[k] = decodeURIComponent(v || '1'); });
    return { parts, query };
  }
  function setTab(name) {
    document.querySelectorAll('#tabs a').forEach((a) => {
      if (a.dataset.tab === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    // envelope badge
    const envTab = document.querySelector('#tabs a[data-tab="envelopes"]');
    const old = envTab.querySelector('.badge'); if (old) old.remove();
    if (P() && C.envelopes.some((e) => L.envelopeStatus(e, now(), P().envelopes, settings()) === 'ready')) {
      const b = document.createElement('span'); b.className = 'badge'; envTab.appendChild(b);
    }
  }
  let lastHash = null;
  const scrollFor = new Map();
  function render() {
    const hash = location.hash || '#/';
    const sameScreen = hash === lastHash;
    const heldScroll = window.scrollY;
    if (!sameScreen && lastHash !== null) scrollFor.set(lastHash, window.scrollY);
    applyTheme();
    document.getElementById('settingsBtn').innerHTML = ico('gear');
    document.querySelectorAll('.tab-ico').forEach((el) => { el.innerHTML = ico(el.dataset.ico); });
    const { parts, query } = parseRoute();
    document.body.classList.toggle('onboarding', !P());
    if (!P()) { setTab(''); return renderOnboarding(); }
    brand.innerHTML = `אוצרת <small>${esc(P().emblem)} ${esc(P().name)}</small>`;
    const head = parts[0] || '';
    if (head === '') { setTab('today'); renderToday(); }
    else if (head === 'museum') { setTab('museum'); renderMuseum(); }
    else if (head === 'stop' && parts[1] && parts[2] === 'm' && parts[3]) { setTab('today'); renderMission(parts[1], parts[3]); }
    else if (head === 'stop' && parts[1]) { setTab('today'); renderStop(parts[1], query); }
    else if (head === 'envelopes') { setTab('envelopes'); renderEnvelopes(); }
    else if (head === 'envelope' && parts[1]) { setTab('envelopes'); renderEnvelope(parts[1]); }
    else if (head === 'thread') { setTab('museum'); renderThread(); }
    else if (head === 'catalogue') { setTab('catalogue'); renderCatalogue(); }
    else if (head === 'settings') { setTab(''); renderSettings(); }
    else if (head === 'credits') { setTab(''); renderCredits(); }
    else { setTab('today'); renderToday(); }
    matSmallImages();
    // Re-rendering the same screen (a toggle, a saved note) must not throw you back to the top.
    // Returning to a screen you were already on puts you back where you were.
    const target = sameScreen ? heldScroll : (scrollFor.get(hash) || 0);
    lastHash = hash;
    window.scrollTo(0, target);
    if (target > 0) requestAnimationFrame(() => window.scrollTo(0, target));
  }
  window.addEventListener('hashchange', render);
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('#sunBtn')) toggleSun(); });

  const bannerHtml = () => (showBanner || !S.storageOk) ? `<div class="banner">${V('הדפדפן לא מאפשר לשמור פה. המוזיאון יעבוד, אבל לא יישמר אחרי סגירה. נסי לפתוח לא בחלון פרטי.')}</div>` : '';
  const backLink = (href, text) => `<a class="back" href="${href}">${ico('back')}<span>${esc(text)}</span></a>`;

  // ---------- onboarding ----------
  const EMBLEMS = ['🖼️', '🗝️', '🔭', '🧭', '🪞', '🕯️', '🎭', '🐚', '🪶', '🧵'];
  function renderOnboarding(st0) {
    const st = st0 || { name: '', emblem: EMBLEMS[0], voice: 'f' };
    const T = (t) => window.OTZ_VOICE.apply(t, st.voice);
    const strip = ['d17', 'd21', 'd23', 'd26'].some((h) => imgFor('hall-' + h)) ? `<div class="strip">${[['d17', 'paris'], ['d21', 'london'], ['d23', 'disney'], ['d26', 'south']].map(([h, w]) => imgFor('hall-' + h) ? `<div data-wing="${w}"><span class="print photo-fx"><img src="${imgFor('hall-' + h)}" alt=""></span><span class="bar"></span></div>` : '').join('')}</div>` : '';
    view.innerHTML = `
      <section class="onboard stack-lg">
        ${strip}
        <div>
          <p class="eyebrow">${esc(C.trip.title)} · ${esc(C.trip.datesLabel)}</p>
          <h1>לפני שהיו מוזיאונים, היו חדרי פלאות.</h1>
          <p class="lede">${T('אנשים אספו בחדר אחד את מה שהפליא אותם: קונכייה, מפה, אבן, ציור קטן. הלובר התחיל כאוסף של מלך. המוזיאון הבריטי התחיל כ־71,000 חפצים של רופא אחד.')}<br>${T('בטיול הזה את האוצרת. כל מקום שנעצור בו יכול להפוך למוצג במוזיאון שלך, אם תסתכלי עליו באמת ותעשי ממנו משהו קטן. בסוף מדפיסים קטלוג.')}</p>
        </div>
        <div class="field">
          <label>איך לפנות אליך?</label>
          <div class="row voice-toggle" id="obVoice"><button type="button" class="btn secondary" data-v="f" aria-pressed="${st.voice === 'f'}">את</button><button type="button" class="btn secondary" data-v="m" aria-pressed="${st.voice === 'm'}">אתה</button></div>
        </div>
        <div class="field">
          <label for="obName">${T('איך קוראים לאוצרת?')}</label>
          <input class="input" id="obName" maxlength="24" autocomplete="off" placeholder="השם שלך" value="${esc(st.name)}">
        </div>
        <div class="field">
          <label>סמל למוזיאון</label>
          <div class="emblems" id="obEmblems">${EMBLEMS.map((e) => `<button type="button" data-e="${e}" aria-pressed="${e === st.emblem}">${e}</button>`).join('')}</div>
        </div>
        <button class="btn thread block" id="obGo">לפתוח את המוזיאון</button>
        <p class="hint">הכל נשמר רק בטלפון הזה. אין ניקוד, אין תחרות. כמה מוזיאונים במשפחה יהיו שונים לגמרי, וזה הרעיון.</p>
      </section>`;
    view.querySelector('#obVoice').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      st.voice = b.dataset.v; st.name = view.querySelector('#obName').value; renderOnboarding(st);
    });
    view.querySelector('#obEmblems').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      st.emblem = b.dataset.e;
      view.querySelectorAll('#obEmblems button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    });
    view.querySelector('#obGo').addEventListener('click', () => {
      const name = view.querySelector('#obName').value.trim();
      if (!name) { view.querySelector('#obName').focus(); toast('רק השם, ואנחנו בפנים.'); return; }
      const prof = S.newProfile(name, st.emblem); prof.voice = st.voice;
      state.profiles[prof.id] = prof; state.activeProfile = prof.id; save();
      go('#/'); render();
    });
  }

  // ---------- today ----------
  function currentHall() { return hallById(L.currentHallId(C.halls, now())); }
  function renderToday() {
    const p = P();
    const hall = currentHall();
    const stops = stopsOfHall(hall.id);
    const dk = L.dayKey(now());
    const cardState = p.cards[dk];
    const card = cardState ? C.cards.find((c) => c.id === cardState.cardId) : null;
    const nextEnv = C.envelopes
      .map((e) => ({ e, st: L.envelopeStatus(e, now(), p.envelopes, settings()) }))
      .filter((x) => x.st !== 'opened')
      .sort((a, b) => (a.e.openAt < b.e.openAt ? -1 : 1))[0];
    const tc = threadCount();
    const seenThread = p.seenThread || 0;
    const doneToday = Object.values(p.exhibits).filter((e) => e.doneAt && L.dayKey(new Date(e.doneAt)) === dk).length;
    const backedUpToday = !!(p.lastBackupAt && L.dayKey(new Date(p.lastBackupAt)) === dk);
    const nudge = now().getHours() >= 19 && doneToday > 0 && !backedUpToday;
    const beforeTrip = dk < C.trip.start;
    const afterTrip = dk > C.trip.end;

    view.innerHTML = `
      ${bannerHtml()}
      <section class="hero" data-wing="${esc(hall.wing)}">
        <p class="meta-line">${wingLine(hall.wing)}<span aria-hidden="true">·</span><span>${esc(L.hebrewDate(now()))}</span>${hall.date !== dk ? `<span aria-hidden="true">·</span><span>אולם ${esc(hall.label || L.shortDate(hall.date))}</span>` : ''}</p>
        ${imgFor('hall-' + hall.id) ? `<figure class="print photo-fx photo-slot"><img src="${imgFor('hall-' + hall.id)}" alt=""><span class="stamp" aria-hidden="true">${esc(stampDate(hall.date))}</span></figure>` : ''}
        <h1>${esc(hall.title)}</h1>
        ${hall.sub ? `<p class="sub">${esc(hall.sub)}</p>` : ''}
      </section>
      ${beforeTrip ? `<div class="banner">הטיול מתחיל ב־${esc(L.shortDate(C.trip.start))}. עד אז אפשר להסתכל במוזיאון הריק, לפתוח את ההגדרות, ולתת שם. האולמות נפתחים לפי הימים.</div>` : ''}
      ${afterTrip ? `<div class="banner">הטיול נגמר, המוזיאון פתוח לתמיד. הזמן <a href="#/catalogue">לכרוך את הקטלוג</a>.</div>` : ''}
      <section class="daycard ${card ? '' : 'undrawn'} ${justDrew ? 'flip' : ''}" id="daycard">
        ${card ? `<span class="knot" aria-hidden="true">${ico('knot')}</span>` : ''}
        <p class="eyebrow">קלף היום</p>
        ${card ? `<p class="text">${esc(V(card.text))}</p>
          <div class="actions">${cardState.redrawn ? `<span class="hint">זה הקלף. מחר יש חדש.</span>` : `<button class="btn ghost" id="redraw">להחליף פעם אחת</button>`}</div>`
        : `<p class="text muted">מגבלה יצירתית אחת לכל היום. שולפים קלף בבוקר, והעין מתחילה לחפש.</p>
          <div class="actions"><button class="btn secondary" id="draw">לשלוף קלף</button></div>`}
      </section>
      ${nudge ? `<section class="nudge" id="nudge"><p><strong>לשמור את היום?</strong><br><span class="small">${doneToday === 1 ? 'מוצג חדש אחד' : doneToday + ' מוצגים חדשים'} על הקיר. קובץ גיבוי אחד לדרייב, לוואטסאפ או לתיקיית הקבצים, וזה שמור גם אם הטלפון נעלם.</span></p><button class="btn secondary" id="nudgeShare">${ico('download')} לשמור / לשתף</button></section>` : ''}
      <div class="section-title"><h2>הכרטיסים של היום</h2></div>
      ${stops.length ? `<div class="stoplist">${stops.map((s) => stopItem(s)).join('')}</div>` : `<div class="empty">אין תחנות רשומות ליום הזה.</div>`}
      ${nextEnv ? `<div class="section-title"><h2>מעטפות</h2></div>
        <a class="env ${nextEnv.st}" href="${nextEnv.st === 'ready' ? `#/envelope/${nextEnv.e.id}` : '#/envelopes'}">
          <span class="seal">${esc(nextEnv.e.seal || '✉')}</span>
          <span><span class="etitle">${nextEnv.st === 'ready' ? V('מעטפה מחכה לך: ') : 'המעטפה הבאה: '}${esc(nextEnv.e.title)}</span><span class="ewhen">${nextEnv.st === 'ready' ? 'אפשר לפתוח' : esc(L.countdown(now(), nextEnv.e.openAt)) + (nextEnv.e.where ? ' · ' + esc(nextEnv.e.where) : '')}</span></span>
          <span class="arrow">${ico('back')}</span>
        </a>` : ''}
      ${tc > 0 ? `<div class="section-title"><h2>החוט האדום</h2></div>
        <a class="env ${tc > seenThread ? 'ready' : 'opened'}" href="#/thread">
          <span class="seal">${tc}</span>
          <span><span class="etitle">${tc > seenThread ? 'נפתח קטע חדש בסיפור' : `${tc} מתוך ${C.thresholds.length + 1} קטעים פתוחים`}</span><span class="ewhen">סיפור אחד שעובר דרך כל הטיול</span></span>
          <span class="arrow">${ico('back')}</span>
        </a>` : ''}`;

    const nb = view.querySelector('#nudgeShare');
    if (nb) nb.addEventListener('click', exportBackup);
    const drawBtn = view.querySelector('#draw');
    if (drawBtn) drawBtn.addEventListener('click', () => {
      const drawn = Object.values(p.cards).map((c) => c.cardId);
      const c = L.pickCard(C.cards, drawn);
      if (!c) return;
      p.cards[dk] = { cardId: c.id, redrawn: false }; save(); justDrew = true; render(); justDrew = false;
    });
    const redraw = view.querySelector('#redraw');
    if (redraw) redraw.addEventListener('click', () => {
      const drawn = Object.values(p.cards).map((c) => c.cardId);
      const c = L.pickCard(C.cards, drawn);
      p.cards[dk] = { cardId: c.id, redrawn: true }; save(); justDrew = true; render(); justDrew = false;
    });
  }

  function stopItem(s) {
    const ex = P().exhibits[s.id];
    const img = imgFor(s.id);
    return `<a class="stopitem ${ex ? 'done' : ''}" href="#/stop/${esc(s.id)}" data-wing="${esc(wingOf(s))}">
      ${img ? `<span class="thumb print photo-fx"><img src="${img}" alt="" loading="lazy"></span>` : `<span class="thumb blank">${ico('pin')}</span>`}
      <span class="mid">
        <span class="time ${s.time ? '' : 'when'}">${esc(s.time || s.when || '')}</span>
        <span class="name">${esc(s.name)}</span>
        <span class="place latin">${esc(s.place)}</span>
      </span>
      <span class="state">${ex ? ico('stitchcheck') : '<span class="ring"></span>'}</span>
    </a>`;
  }

  // ---------- museum wall ----------
  function renderMuseum() {
    const p = P();
    const halls = sortedHalls();
    const count = exhibitsCount();
    view.innerHTML = `
      ${bannerHtml()}
      <section class="hero museum">
        <p class="date">${esc(C.trip.datesLabel)}</p>
        <h1>המוזיאון של ${esc(p.name)}</h1>
        <p class="sub">${count === 0 ? 'הקירות עדיין ריקים. כל מוצג שתתלי יתחבר לקודמו בחוט אדום.' : count === 1 ? 'מוצג אחד על הקיר. החוט מתחיל.' : `${count} מוצגים על הקירות.`}</p>
      </section>
      <div class="row between" style="margin-bottom:14px">
        <a class="btn secondary" href="#/thread">${ico('thread')} החוט האדום</a>
        <a class="btn ghost" href="#/catalogue">${ico('book')} הקטלוג</a>
      </div>
      <div class="wall" id="wall">
        <svg class="thread-svg" aria-hidden="true"></svg>
        ${halls.map((h) => hallBlock(h)).join('')}
      </div>`;
    fillThumbs();
    requestAnimationFrame(() => drawThread(false));
  }

  function hallBlock(h) {
    const st = L.hallStatus(h, now(), settings());
    const stops = stopsOfHall(h.id);
    const done = stops.filter((s) => P().exhibits[s.id]).length;
    return `<section class="hall ${st}" data-wing="${esc(h.wing)}">
      <div class="hall-head">
        <div class="line">
          <div class="hall-title">${imgFor('hall-' + h.id) ? `<span class="thumb print photo-fx ${st === 'locked' ? 'faded' : ''}"><img src="${imgFor('hall-' + h.id)}" alt="" loading="lazy"></span>` : ''}<h2>${esc(h.title)}</h2></div>
          <span class="meta">${wingLine(h.wing)}<br><span class="num">${done}/${stops.length}</span> · <span class="num">${esc(h.label || L.shortDate(h.date))}</span></span>
        </div>
        <div class="wing-rule"></div>
      </div>
      ${st === 'locked' ? `<div class="lock">${ico('lock')}<span>נפתח ב${esc(L.hebrewDate(h.date))}. ${esc(h.tease || '')}</span></div>` :
        `<div class="frames">${stops.map((s) => frame(s)).join('')}</div>`}
    </section>`;
  }

  function frame(s) {
    const ex = P().exhibits[s.id];
    const ghost = imgFor(s.id) ? `<img class="ghost" src="${imgFor(s.id)}" alt="" loading="lazy">` : '';
    if (!ex) return `<a class="frame" href="#/stop/${esc(s.id)}">${ghost}<span class="fname">${esc(s.name)}</span></a>`;
    let inner = '';
    if (ex.type === 'photo' || ex.type === 'sketch') inner = `<img alt="" data-media="${esc(s.id)}"><span class="fname">${esc(ex.title || s.name)}</span>`;
    else if (ex.type === 'color') inner = `<span class="swatch" style="background:${esc(ex.color)}"></span><span class="fname">${esc(ex.colorName || ex.title || s.name)}</span>`;
    else if (ex.type === 'find') inner = `<span class="ftext">✓</span><span class="fname">${esc(ex.title || s.name)}</span>`;
    else inner = `<span class="ftext">${esc((ex.text || ex.title || '').slice(0, 90))}</span>`;
    return `<a class="frame hung ${esc(ex.type)}" href="#/stop/${esc(s.id)}" data-stop="${esc(s.id)}"><span class="nail"></span>${inner}</a>`;
  }

  async function fillThumbs() {
    const imgs = [...view.querySelectorAll('img[data-media]')];
    await Promise.all(imgs.map(async (img) => {
      const url = await S.mediaGet(mediaKey(img.dataset.media));
      if (url) img.src = url;
    }));
    matSmallImages();
  }

  function drawThread(animateLast) {
    const wall = document.getElementById('wall'); if (!wall) return;
    const svg = wall.querySelector('svg.thread-svg'); if (!svg) return;
    const frames = [...wall.querySelectorAll('.frame.hung')];
    const wr = wall.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${Math.round(wr.width)} ${Math.round(wr.height)}`);
    svg.setAttribute('width', wr.width); svg.setAttribute('height', wr.height);
    if (frames.length < 2) { svg.innerHTML = ''; return; }
    // nail-to-nail, with the thread sagging between them
    const pts = frames.map((f) => { const r = f.getBoundingClientRect(); return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top - 8 }; });
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2 + 14 + Math.min(26, Math.abs(b.x - a.x) * 0.12);
      d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    svg.innerHTML = `<path class="shade" d="${d}"></path><path class="stitch ${animateLast ? 'new' : ''}" d="${d}"></path>`;
  }
  window.addEventListener('resize', () => drawThread(false));

  // ---------- stop sheet ----------
  function renderStop(sid, query) {
    const s0 = stopById(sid);
    if (!s0) { view.innerHTML = `<div class="empty">אין תחנה כזאת.</div>`; return; }
    const s = vs(s0);
    const hall = hallById(s.hall);
    const st = L.hallStatus(hall, now(), settings());
    const ex = P().exhibits[s.id];
    const wing = wingOf(s);
    const littleDone = !!(P().little && P().little[s.id]);
    const head = `
      ${backLink(query && query.from === 'museum' ? '#/museum' : '#/', 'חזרה')}
      <header class="sheet-head" data-wing="${esc(wing)}">
        ${imgFor(s.id) ? `<figure class="sheet-photo print photo-fx ${st === 'locked' ? 'faded' : ''}"><img src="${imgFor(s.id)}" alt="${esc(s.name)}"></figure>${creditLine(s.id)}` : ''}
        <p class="meta-line">${wingLine(wing)}<span aria-hidden="true">·</span><span>${esc(L.hebrewDate(hall.date))}</span>${s.time ? `<span aria-hidden="true">·</span><span class="num">${esc(s.time)}</span>` : s.when ? `<span aria-hidden="true">·</span><span>${esc(s.when)}</span>` : ''}</p>
        <h1>${esc(s.name)}</h1>
        <p class="place latin">${esc(s.place)}</p>
      </header>
      <div class="hook"><p class="wall-text">${esc(s.hook)}</p></div>`;

    if (st === 'locked') {
      view.innerHTML = `${head}<div class="lock" style="margin-top:18px;display:flex;gap:8px;align-items:center;color:var(--muted)">${ico('lock')}<span>האולם הזה נפתח ב${esc(L.hebrewDate(hall.date))}. הכרטיס מחכה.</span></div>`;
      return;
    }

    if (!ex) {
      view.innerHTML = `${head}
        <div class="section-title"><h2>לתלות מוצג</h2></div>
        <p class="small muted">${V('בוחרת אחת. אין נכון ולא נכון, יש מה שמתאים לך עכשיו.')}</p>
        <div class="choices" data-wing="${esc(wing)}">${(s.missions || []).map(vm).map((m) => `
          <button class="choice" data-m="${esc(m.id)}">
            <span class="glyph">${ico('g_' + m.type)}</span>
            <span><span class="ctitle">${esc(m.title)}</span><span class="cprompt">${esc(m.prompt)}</span>${COST[m.type] ? `<span class="cost">${esc(COST[m.type])}</span>` : ''}</span>
          </button>`).join('')}</div>
        ${littleBlock(s, littleDone)}`;
      view.querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => go(`#/stop/${s.id}/m/${b.dataset.m}`)));
      bindLittle(s);
      return;
    }

    // done view
    const order = L.exhibitOrder(P().exhibits);
    const no = order.indexOf(s.id) + 1;
    const isNew = query && query.new;
    view.innerHTML = `${head}
      <section class="exhibit">
        ${mediaBlock(s, ex)}
        <div class="label-card">
          <span class="no">מוצג ${String(no).padStart(2, '0')}</span>
          <p class="ltitle">${esc(ex.title || s.name)}</p>
          ${ex.note ? `<p class="lnote">${esc(ex.note)}</p>` : ''}
          <p class="lmeta">${esc(TYPE_NAMES[ex.type] || '')} · ${latin(s.place)} · ${esc(L.hebrewDate(hall.date))}</p>
        </div>
      </section>
      <section class="drawer ${isNew ? '' : 'open'}" id="drawer">
        <button class="knob" aria-expanded="${isNew ? 'false' : 'true'}"><span class="handle"></span><span class="ktext">המגירה הסודית</span><span class="khint">${isNew ? 'למשוך' : ''}</span></button>
        <div class="inner"><div class="content"><div class="sheet torn-top">
          <p>${esc(s.secret)}</p>
          ${s.ask ? `<p class="ask">${esc(s.ask)}</p>` : ''}
        </div></div></div>
      </section>
      ${littleBlock(s, littleDone)}
      <div class="row" style="margin-top:22px">
        <a class="btn secondary" href="#/museum">${ico('museum')} לקיר</a>
        <button class="btn ghost" id="redo">להחליף את המוצג</button>
      </div>`;
    fillThumbs();
    const drawer = view.querySelector('#drawer');
    drawer.querySelector('.knob').addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      drawer.querySelector('.knob').setAttribute('aria-expanded', open);
      const hint = drawer.querySelector('.khint'); if (hint) hint.textContent = '';
    });
    if (isNew) setTimeout(() => { drawer.classList.add('open'); drawer.querySelector('.knob').setAttribute('aria-expanded', 'true'); const h = drawer.querySelector('.khint'); if (h) h.textContent = ''; }, 700);
    view.querySelector('#redo').addEventListener('click', async () => {
      if (!confirm('להוריד את המוצג הזה מהקיר ולבחור מחדש? המוצג הנוכחי יימחק.')) return;
      delete P().exhibits[s.id]; await S.mediaDel(mediaKey(s.id)); save(); render();
    });
    bindLittle(s);
  }

  function littleBlock(s, done) {
    if (!s.little) return '';
    return `<div class="little ${done ? 'done' : ''}" id="little">
      <span><span class="l-title">${ico('little')} ${V('להיות המדריכה של הקטן')}</span><br><span class="small">${esc(s.little)}</span></span>
      <button class="btn secondary" id="littleBtn">${done ? 'עשינו ✓' : 'עשינו'}</button>
    </div>`;
  }
  function bindLittle(s) {
    const b = view.querySelector('#littleBtn'); if (!b) return;
    b.addEventListener('click', () => {
      P().little = P().little || {};
      if (P().little[s.id]) delete P().little[s.id]; else P().little[s.id] = true;
      save(); render();
    });
  }

  function mediaBlock(s, ex) {
    if (ex.type === 'photo') return `<div class="media print photo-fx"><img alt="${esc(ex.title || s.name)}" data-media="${esc(s.id)}"></div>`;
    if (ex.type === 'sketch') return `<div class="media print"><img alt="${esc(ex.title || s.name)}" data-media="${esc(s.id)}"></div>`;
    if (ex.type === 'color') return `<div class="media color"><span class="swatch" style="background:${esc(ex.color)}"></span></div>`;
    if (ex.type === 'find') return `<div class="media find"><ul style="margin:0;padding-inline-start:20px">${(ex.found || []).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>${ex.text ? `<p style="margin-top:10px">${esc(ex.text)}</p>` : ''}</div>`;
    return `<div class="media words"><p>${esc(ex.text)}</p></div>`;
  }

  // ---------- mission panel ----------
  function renderMission(sid, mid) {
    const s0 = stopById(sid); if (!s0) return renderStop(sid);
    const m0 = (s0.missions || []).find((x) => x.id === mid); if (!m0) return renderStop(sid);
    const s = vs(s0); const m = vm(m0);
    if (P().exhibits[s.id]) return renderStop(sid);
    const wing = wingOf(s);
    let pendingImage = null; let pad = null;
    view.innerHTML = `
      ${backLink(`#/stop/${esc(s.id)}`, s.name)}
      <header class="sheet-head wing-band" data-wing="${esc(wing)}">
        <p class="eyebrow"><span class="wing-dot"></span>${esc(TYPE_NAMES[m.type])} · ${esc(s.name)}</p>
        <h1 style="font-size:1.5rem">${esc(m.title)}</h1>
      </header>
      <section class="panel">
        <p class="pprompt">${esc(m.prompt)}</p>
        <div class="body" id="mbody"></div>
      </section>
      <section class="panel" style="margin-top:12px">
        <p class="ptitle">כרטיס המוצג</p>
        <div class="body">
          <div class="field"><label for="exTitle">שם המוצג</label><input class="input" id="exTitle" maxlength="60" value="${esc(m.defaultTitle || s.name)}"></div>
          <div class="field"><label for="exNote">שורה אחת מתחת (לא חובה)</label><input class="input" id="exNote" maxlength="140" placeholder="${esc(m.notePlaceholder || 'מה ראית שאף אחד אחר לא ראה?')}"></div>
        </div>
      </section>
      <div class="row" style="margin-top:16px">
        <button class="btn thread" id="hang">לתלות על הקיר</button>
        <a class="btn ghost" href="#/stop/${esc(s.id)}">חזרה לבחירה</a>
      </div>`;
    const body = view.querySelector('#mbody');

    if (m.type === 'photo') {
      body.innerHTML = `<label class="photo-drop" id="drop">
          <span class="inner-mat"></span>
          <span class="drop-label">${ico('g_photo')}<span class="fake-btn">לצלם</span><span class="hint">נשמרת בטלפון הזה בלבד.</span></span>
          <input type="file" accept="image/*" id="file">
        </label>`;
      view.querySelector('#file').addEventListener('change', async (e) => {
        const f = e.target.files && e.target.files[0]; if (!f) return;
        try {
          pendingImage = await S.compressImage(f, 1280, 0.82);
          const drop = view.querySelector('#drop');
          drop.classList.add('print', 'photo-fx');
          drop.innerHTML = `<img src="${pendingImage}" alt=""><input type="file" accept="image/*" id="file2">`;
          view.querySelector('#file2').addEventListener('change', (ev) => { e.target.files = ev.target.files; e.target.dispatchEvent(new Event('change')); });
        } catch (err) { toast('לא הצלחתי לקרוא את התמונה. אפשר לנסות שוב או לבחור מילים במקום.'); }
      });
    } else if (m.type === 'sketch') {
      body.innerHTML = `
        <div class="sketch-tools">
          <span class="group">
            <button class="pen" data-c="#1B1B1F" style="background:#1B1B1F" aria-pressed="true" aria-label="שחור"></button>
            <button class="pen" data-c="#C8102E" style="background:#C8102E" aria-pressed="false" aria-label="אדום"></button>
            <button class="pen" data-c="#1F5FC4" style="background:#1F5FC4" aria-pressed="false" aria-label="כחול"></button>
            <button class="pen" data-c="#0F7A4E" style="background:#0F7A4E" aria-pressed="false" aria-label="ירוק"></button>
          </span>
          <span class="group">
            <button class="w" data-w="2" aria-pressed="false" aria-label="דק"><i style="width:14px;height:2px"></i></button>
            <button class="w" data-w="4" aria-pressed="true" aria-label="בינוני"><i style="width:14px;height:4px"></i></button>
            <button class="w" data-w="9" aria-pressed="false" aria-label="עבה"><i style="width:14px;height:8px"></i></button>
          </span>
          <span class="group end">
            <button class="btn ghost" id="undo">בטל</button>
            <button class="btn ghost" id="clear">נקה</button>
          </span>
        </div>
        <div class="sketch-wrap" id="pad"></div>
        ${m.blind ? `<label class="toggle" style="border:0"><span>מצב עיוור: המסך מכוסה בזמן שאת מציירת</span><input type="checkbox" id="blind" checked></label>` : ''}`;
      pad = OTZ_SKETCH.create(view.querySelector('#pad'), { blind: !!m.blind, width: 4 });
      view.querySelectorAll('.pen').forEach((b) => b.addEventListener('click', () => { pad.setColor(b.dataset.c); view.querySelectorAll('.pen').forEach((x) => x.setAttribute('aria-pressed', x === b)); }));
      view.querySelectorAll('.w').forEach((b) => b.addEventListener('click', () => { pad.setWidth(+b.dataset.w); view.querySelectorAll('.w').forEach((x) => x.setAttribute('aria-pressed', x === b)); }));
      view.querySelector('#undo').addEventListener('click', () => pad.undo());
      view.querySelector('#clear').addEventListener('click', () => pad.clear());
      const blind = view.querySelector('#blind'); if (blind) blind.addEventListener('change', () => pad.setBlind(blind.checked));
    } else if (m.type === 'words') {
      body.innerHTML = `<div class="field"><textarea class="input ruled" id="words" maxlength="600" placeholder="${esc(m.placeholder || V('כותבת פה'))}" rows="4"></textarea><div class="count" id="wc"></div></div>`;
      const ta = view.querySelector('#words'); const wc = view.querySelector('#wc');
      const upd = () => { const words = ta.value.trim().split(/\s+/).filter(Boolean).length; wc.textContent = m.wordLimit ? `${words} / ${m.wordLimit} מילים` : `${words} מילים`; };
      ta.addEventListener('input', upd); upd();
    } else if (m.type === 'color') {
      const presets = m.presets || ['#5B6B7F', '#C4122F', '#E8D9A0', '#2A8C82', '#1F3A5F', '#D98BA3', '#8C3B2E', '#F2E9D8'];
      body.innerHTML = `
        <div class="color-pick">
          <input type="color" id="colorIn" value="${esc(presets[0])}" aria-label="בחירת צבע">
          <div class="field"><label for="colorName">${V('איך את קוראת לצבע הזה?')}</label><input class="input hand" id="colorName" maxlength="40" placeholder="${esc(m.namePlaceholder || 'למשל: כחול של שלט רחוב אחרי גשם')}"><span class="hexout" id="hexout"></span></div>
        </div>
        <div class="swatches">${presets.map((c) => `<button type="button" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div>
        <p class="hint">אפשר לכוון בגלגל הצבעים עד שזה בדיוק הצבע שראית. השם חשוב יותר מהדיוק.</p>`;
      const ci = view.querySelector('#colorIn'), hx = view.querySelector('#hexout');
      const showHex = () => { hx.textContent = ci.value.toUpperCase(); };
      ci.addEventListener('input', showHex); showHex();
      view.querySelectorAll('.swatches button').forEach((b) => b.addEventListener('click', () => { ci.value = b.dataset.c; showHex(); }));
    } else if (m.type === 'find') {
      body.innerHTML = `<div class="checks">${(m.items || []).map((it, i) => `<label class="check"><input type="checkbox" data-i="${i}"><span>${esc(it)}</span></label>`).join('')}</div>
        <div class="field"><label for="findNote">${esc(m.noteLabel || 'מה גילית בדרך?')}</label><textarea class="input" id="findNote" maxlength="400" style="min-height:80px" placeholder="${esc(m.placeholder || '')}"></textarea></div>`;
    }

    view.querySelector('#hang').addEventListener('click', async () => {
      const title = view.querySelector('#exTitle').value.trim() || s.name;
      const note = view.querySelector('#exNote').value.trim();
      const ex = { doneAt: now().toISOString(), missionId: m.id, type: m.type, title, note };
      if (m.type === 'photo') {
        if (!pendingImage) { toast('קודם תמונה, אחר כך תולים.'); return; }
        await S.mediaPut(mediaKey(s.id), pendingImage); ex.hasImage = true;
      } else if (m.type === 'sketch') {
        if (pad.isEmpty()) { toast('הדף עדיין לבן. קו אחד מספיק.'); return; }
        await S.mediaPut(mediaKey(s.id), pad.toDataURL()); ex.hasImage = true;
      } else if (m.type === 'words') {
        const t = view.querySelector('#words').value.trim();
        if (!t) { toast('מילה אחת לפחות.'); return; }
        ex.text = t;
      } else if (m.type === 'color') {
        ex.color = view.querySelector('#colorIn').value;
        ex.colorName = view.querySelector('#colorName').value.trim();
        if (!ex.colorName) { toast('תני לצבע שם. זה מה שיישאר.'); return; }
      } else if (m.type === 'find') {
        const found = [...view.querySelectorAll('.checks input:checked')].map((i) => m.items[+i.dataset.i]);
        const note = view.querySelector('#findNote').value.trim();
        if (found.length === 0 && !note) { toast('סמני מה מצאת, או כתבי מה קרה במקום.'); return; }
        ex.found = found; ex.text = note;
      }
      const before = threadCount();
      P().exhibits[s.id] = ex; save();
      const after = threadCount();
      if (after > before) setTimeout(() => toast(`נפתח קטע חדש ב<a href="#/thread">חוט האדום</a>`, 5000), 1200);
      go(`#/stop/${s.id}?new=1`);
    });
  }

  // ---------- envelopes ----------
  function renderEnvelopes() {
    const p = P();
    const list = [...C.envelopes].sort((a, b) => (a.openAt < b.openAt ? -1 : 1));
    view.innerHTML = `
      <section class="hero">
        <p class="date">${list.length} מעטפות לאורך הטיול</p>
        <h1>מעטפות חתומות</h1>
        <p class="sub">כל אחת נפתחת ברגע מסוים בטיול. לא לפני. חלקן זוכרות מה כתבת קודם.</p>
      </section>
      <div class="envlist">${list.map((e) => {
        const st = L.envelopeStatus(e, now(), p.envelopes, settings());
        const when = st === 'sealed' ? `נפתחת ${esc(L.countdown(now(), e.openAt))}, ${esc(L.shortDate(e.openAt))}${e.where ? ' · ' + esc(e.where) : ''}` : st === 'ready' ? V('מחכה לך. אפשר לפתוח.') : `נפתחה · ${esc(L.hebrewDate(e.openAt))}`;
        const inner = `<span class="seal">${esc(e.seal || '✉')}</span><span><span class="etitle">${esc(e.title)}</span><span class="ewhen">${when}</span></span><span class="arrow">${st === 'sealed' ? ico('lock') : ico('back')}</span>`;
        return st === 'sealed' ? `<button class="env sealed" data-e="${esc(e.id)}" style="text-align:start">${inner}</button>` : `<a class="env ${st}" href="#/envelope/${esc(e.id)}">${inner}</a>`;
      }).join('')}</div>`;
    view.querySelectorAll('button.env.sealed').forEach((b) => b.addEventListener('click', () => {
      const e = C.envelopes.find((x) => x.id === b.dataset.e);
      toast(`חתומה עדיין. נפתחת ${esc(L.countdown(now(), e.openAt))}${e.where ? ', ' + esc(e.where) : ''}.`);
    }));
  }

  function renderEnvelope(eid) {
    const p = P();
    const e0 = C.envelopes.find((x) => x.id === eid);
    if (!e0) return renderEnvelopes();
    const e = ve(e0);
    const st = L.envelopeStatus(e, now(), p.envelopes, settings());
    if (st === 'sealed') { go('#/envelopes'); return; }
    if (st === 'ready') { p.envelopes[e.id] = { openedAt: now().toISOString() }; save(); }
    const saved = e.prompt ? (p.notes[e.prompt.key] || '') : '';
    const revealed = e.reveals ? p.notes[e.reveals] : null;
    view.innerHTML = `
      ${backLink('#/envelopes', 'מעטפות')}
      <header class="sheet-head">
        <p class="eyebrow">${esc(L.hebrewDate(e.openAt))}${e.where ? ` · ${esc(e.where)}` : ''}</p>
        <h1>${esc(e.title)}</h1>
      </header>
      <section class="letter torn-top">
        ${e.body.split('\n\n').map((para) => `<p class="ltext">${esc(para)}</p>`).join('')}
        ${e.reveals ? `<div class="from-past"><p class="fp-eyebrow">${esc(e.revealLabel || 'מה שכתבת אז:')}</p><p class="fp-text">${revealed ? esc(revealed) : '(לא כתבת אז. גם זה בסדר. אפשר לכתוב עכשיו מה היית כותבת.)'}</p></div>` : ''}
      </section>
      ${e.prompt ? `<section class="panel" style="margin-top:14px">
        <p class="ptitle">${esc(e.prompt.label)}</p>
        <div class="body">
          <textarea class="input" id="envText" maxlength="800" placeholder="${esc(e.prompt.placeholder || '')}">${esc(saved)}</textarea>
          <button class="btn" id="envSave">${saved ? 'לעדכן' : 'לשמור במעטפה'}</button>
          ${e.prompt.hint ? `<p class="hint">${esc(e.prompt.hint)}</p>` : ''}
        </div>
      </section>` : ''}`;
    const btn = view.querySelector('#envSave');
    if (btn) btn.addEventListener('click', () => {
      const t = view.querySelector('#envText').value.trim();
      p.notes[e.prompt.key] = t; p.envelopes[e.id] = Object.assign({}, p.envelopes[e.id], { openedAt: (p.envelopes[e.id] || {}).openedAt || now().toISOString(), answeredAt: now().toISOString() });
      save(); toast('נשמר במעטפה.');
    });
  }

  // ---------- red thread ----------
  function renderThread() {
    const p = P();
    const n = threadCount();
    p.seenThread = n; save();
    const count = exhibitsCount();
    view.innerHTML = `
      ${backLink('#/museum', 'המוזיאון')}
      <section class="hero">
        <p class="date">סיפור אחד, ${C.thread.length} קטעים</p>
        <h1>החוט האדום</h1>
        <p class="sub">כל כמה מוצגים שנתלים על הקיר נפתח קטע. הקטע האחרון נפתח כשכורכים את הקטלוג.</p>
      </section>
      <div class="threadline">${C.thread.map((f, i) => {
        const open = i < n;
        if (open) return `<article class="fragment"><h3>${esc(V(f.title))}</h3><p class="ftext">${esc(V(f.text))}</p></article>`;
        const isFinal = i === C.thread.length - 1;
        const need = isFinal ? null : C.thresholds[i] - count;
        return `<article class="fragment locked"><h3>${esc(f.title)}</h3><p class="ftext">${isFinal ? 'נפתח כשכורכים את הקטלוג.' : need > 0 ? `נפתח אחרי עוד ${need} ${need === 1 ? 'מוצג' : 'מוצגים'}.` : 'נפתח בקרוב.'}</p></article>`;
      }).join('')}</div>`;
  }

  // ---------- catalogue ----------
  function renderCatalogue() {
    const p = P();
    const order = L.exhibitOrder(p.exhibits);
    const colors = order.map((id) => p.exhibits[id]).filter((e) => e.type === 'color');
    const n = threadCount();
    const halls = sortedHalls();
    const notes = C.envelopes.filter((e) => e.prompt && p.notes[e.prompt.key]);
    view.innerHTML = `
      <div class="row between no-print">
        <div>
          <p class="eyebrow">המזכרת</p>
          <h1 style="font-size:1.5rem">הקטלוג</h1>
        </div>
        <div class="row">
          <button class="btn thread" id="keep">${ico('download')} לשמור / לשתף</button>
          <button class="btn secondary" id="print">${ico('print')} להדפיס / PDF</button>
          <button class="btn ghost" id="export">גיבוי</button>
        </div>
      </div>
      ${order.length === 0 ? `<div class="empty" style="margin-top:16px">הקטלוג מתמלא מהקיר. אחרי המוצג הראשון הוא יתחיל להיראות כמו ספר.</div>` : ''}
      ${!p.boundAt ? `<div class="bind-cta no-print">
        <p><strong>לכרוך את הקטלוג</strong><br><span class="small muted">כריכה סוגרת את התערוכה: פותחת את הקטע האחרון של החוט האדום ומוסיפה חותמת לשער. אפשר להמשיך לתלות מוצגים גם אחרי.</span></p>
        <button class="btn thread" id="bind">לכרוך</button>
      </div>` : ''}
      <section class="catalogue" id="catalogue">
        <div class="page cover torn-top">
          <div class="stack-photos" id="mosaic">${mosaicImgs(order, p)}</div>
          <div class="em">${esc(p.emblem)}</div>
          <p class="eyebrow">קטלוג התערוכה</p>
          <h1>המוזיאון של ${esc(p.name)}</h1>
          <p class="dates">${esc(C.trip.title)}<br>${esc(C.trip.datesLabel)}</p>
          <p class="count">${order.length} ${order.length === 1 ? 'מוצג' : 'מוצגים'} · ${colors.length ? `${colors.length === 1 ? 'צבע אחד' : colors.length + ' צבעים'} · ` : ''}${n === 1 ? 'קטע חוט אחד' : n + ' קטעי חוט'}</p>
          ${p.boundAt ? `<p style="margin-top:20px"><span class="bound-stamp">נכרך ${esc(L.shortDate(new Date(p.boundAt)))}</span></p>` : ''}
        </div>
        <div class="page">
          <h2>תוכנית המוזיאון</h2>
          <div class="plan">${C.wings.map((w) => {
            const hs = halls.filter((h) => h.wing === w.id);
            const cnt = hs.reduce((a, h) => a + stopsOfHall(h.id).filter((s) => p.exhibits[s.id]).length, 0);
            const hi = hs.map((h) => imgFor('hall-' + h.id)).find(Boolean);
            return `<div class="wing" data-wing="${esc(w.id)}"><span>${hi ? `<span class="print photo-fx"><img src="${hi}" alt="" loading="lazy"></span>` : '<span class="wing-dot"></span>'}<strong>${esc(w.name)}</strong><br><span class="halls">${hs.map((h) => esc(h.title)).join(' · ')}</span></span><span class="num">${cnt}</span></div>`;
          }).join('')}</div>
        </div>
        ${order.length ? `<div class="page">
          <h2>המוצגים</h2>
          ${order.map((id, i) => {
            const ex = p.exhibits[id]; const s = stopById(id) || { name: id, place: '', hall: '' }; const h = hallById(s.hall) || {};
            return `<article class="item">
              <p class="no">מוצג ${String(i + 1).padStart(2, '0')} · ${esc(TYPE_NAMES[ex.type] || '')}</p>
              ${mediaBlock(s, ex)}
              <p class="ltitle">${esc(ex.title || s.name)}</p>
              ${ex.note ? `<p>${esc(ex.note)}</p>` : ''}
              <p class="lmeta">${esc(s.name)} · ${latin(s.place)} · ${h.date ? esc(L.hebrewDate(h.date)) : ''}</p>
            </article>`;
          }).join('')}
        </div>` : ''}
        ${colors.length ? `<div class="page">
          <h2>הפלטה של הטיול</h2>
          <p class="small muted">הצבעים שבחרת, בשמות שנתת להם.</p>
          <div class="palette">${colors.map((c) => `<div class="chip"><div class="c" style="background:${esc(c.color)}"></div><div class="n">${esc(c.colorName || c.title)}<small>${esc(c.color)}</small></div></div>`).join('')}</div>
        </div>` : ''}
        ${notes.length ? `<div class="page">
          <h2>מהמעטפות</h2>
          ${notes.map((e) => `<article class="item"><p class="no">${esc(e.title)} · ${esc(L.hebrewDate(e.openAt))}</p><p class="ltitle" style="font-weight:700">${esc(V(e.prompt.label))}</p><p class="hand" style="white-space:pre-wrap;font-size:1.15rem">${esc(p.notes[e.prompt.key])}</p></article>`).join('')}
        </div>` : ''}
        ${n > 0 ? `<div class="page">
          <h2>החוט האדום</h2>
          <div class="threadline" style="margin-top:12px">${C.thread.slice(0, n).map((f) => `<article class="fragment"><h3>${esc(V(f.title))}</h3><p class="ftext">${esc(V(f.text))}</p></article>`).join('')}</div>
        </div>` : ''}
        <div class="page cover">
          <p class="eyebrow">${esc(C.trip.datesLabel)}</p>
          <h2>${p.boundAt ? esc(C.closing.bound) : esc(C.closing.open)}</h2>
          <p class="dates" style="margin-top:14px">${esc(C.closing.line)}</p>
        </div>
      </section>`;
    fillThumbs();
    view.querySelector('#print').addEventListener('click', () => window.print());
    view.querySelector('#keep').addEventListener('click', exportKeepsake);
    view.querySelector('#export').addEventListener('click', exportBackup);
    const bind = view.querySelector('#bind');
    if (bind) bind.addEventListener('click', () => {
      if (!confirm('לכרוך את הקטלוג? זה פותח את הקטע האחרון של החוט האדום. אפשר להמשיך להוסיף מוצגים אחר כך.')) return;
      p.boundAt = now().toISOString(); save(); render();
      setTimeout(() => toast(`נכרך. <a href="#/thread">הקטע האחרון של החוט פתוח</a>.`, 5000), 300);
    });
  }

  function mosaicImgs(order, p) {
    const own = order.filter((id) => p.exhibits[id].hasImage).slice(0, 3).map((id) => `<span class="print photo-fx"><img alt="" data-media="${esc(id)}"></span>`);
    const halls = ['d17', 'd21', 'd26'].map((h) => imgFor('hall-' + h)).filter(Boolean).map((src) => `<span class="print photo-fx"><img alt="" src="${src}"></span>`);
    return own.concat(halls).slice(0, 3).join('');
  }

  function renderCredits() {
    view.innerHTML = `
      ${backLink('#/settings', 'הגדרות')}
      <section class="hero"><p class="date">${CREDITS.length} תצלומים</p><h1>תצלומים ורשיונות</h1><p class="sub">התמונות של המקומות באפליקציה מגיעות מוויקישיתוף, ברשיונות חופשיים. התמונות שלך נשארות שלך.</p></section>
      <div class="credits-list">${CREDITS.map((c) => `<div class="row" style="display:flex;gap:12px;align-items:center"><span class="print photo-fx"><img src="img/${esc(c.id)}.jpg" alt="" loading="lazy"></span><span><strong>${esc(c.title)}</strong><br>${esc(c.artist || 'ויקישיתוף')} · <a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.license)}</a></span></div>`).join('')}</div>`;
  }

  // ---------- saving outside the phone: share sheet (Drive, WhatsApp, Files) or download ----------
  async function shareBlob(blob, filename, title) {
    let file = null;
    try { file = new File([blob], filename, { type: blob.type }); } catch (e) { file = null; }
    if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title }); return 'shared'; } catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return 'downloaded';
  }
  function markBackup(result) {
    if (result === 'cancelled') return;
    P().lastBackupAt = now().toISOString(); save();
    toast(result === 'shared' ? 'נשלח. אם בחרת דרייב או קבצים, זה שמור שם.' : 'הקובץ ירד. שמרי אותו בדרייב או שלחי לעצמך.');
  }
  async function exportBackup() {
    try {
      const json = await S.exportProfile(state, state.activeProfile);
      const name = (P().name || 'museum').replace(/\s+/g, '_');
      const r = await shareBlob(new Blob([json], { type: 'application/json' }), `otzeret-backup-${name}-${L.dayKey(now())}.json`, `גיבוי המוזיאון של ${P().name}`);
      markBackup(r);
      if (r !== 'cancelled') render();
    } catch (e) { toast('הייצוא נכשל. נסי שוב מדפדפן אחר.'); }
  }
  async function toDataUrl(url) {
    try {
      const b = await (await fetch(url)).blob();
      return await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => res(null); fr.readAsDataURL(b); });
    } catch (e) { return null; }
  }
  async function buildKeepsake() {
    const cat = document.getElementById('catalogue'); if (!cat) return null;
    const clone = cat.cloneNode(true);
    for (const img of clone.querySelectorAll('img')) {
      const src = img.getAttribute('src') || '';
      if (!src) { img.remove(); continue; }
      if (!src.startsWith('data:')) { const d = await toDataUrl(src); if (d) img.setAttribute('src', d); else img.remove(); }
    }
    let css = '', pcss = '';
    try { css = await (await fetch('css/app.css')).text(); pcss = await (await fetch('css/print.css')).text(); } catch (e) { /* fonts and layout fall back to defaults */ }
    const p = P();
    const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc('המוזיאון של ' + p.name)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;800&family=Gveret+Levin&family=Doto:wght@500;600&display=swap">
<style>${css}\n@media print{${pcss}}\nbody{padding:16px 16px 40px}.view{padding:0}</style></head>
<body><main class="view"><p class="eyebrow" style="text-align:center;margin-bottom:10px">אוצרת · ${esc(C.trip.title)} · ${esc(C.trip.datesLabel)}</p>${clone.outerHTML}<p class="hint" style="text-align:center;margin-top:24px">קובץ עצמאי. נפתח בכל דפדפן, ומודפס ל־PDF מתפריט ההדפסה.</p></main></body></html>`;
    return new Blob([html], { type: 'text/html' });
  }
  async function exportKeepsake() {
    try {
      toast('מכינה את הקובץ…', 2500);
      const blob = await buildKeepsake(); if (!blob) return;
      const name = (P().name || 'museum').replace(/\s+/g, '_');
      const r = await shareBlob(blob, `otzeret-${name}-${L.dayKey(now())}.html`, `המוזיאון של ${P().name}`);
      markBackup(r);
    } catch (e) { toast('לא הצלחתי להכין את הקובץ. אפשר להדפיס ל־PDF במקום.'); }
  }
  window.OTZ_DEBUG = { buildKeepsake, shareBlob };

  // ---------- settings ----------
  function renderSettings() {
    const p = P();
    view.innerHTML = `
      ${backLink('#/', 'חזרה')}
      <section class="hero"><h1>הגדרות</h1></section>
      <div class="stack-lg">
        <section class="panel">
          <p class="ptitle">${V('האוצרת')}</p>
          <div class="body">
            <div class="field"><label for="sName">שם</label><input class="input" id="sName" maxlength="24" value="${esc(p.name)}"></div>
            <div class="field"><label>איך לפנות</label><div class="row voice-toggle" id="sVoice"><button type="button" class="btn secondary" data-v="f" aria-pressed="${p.voice !== 'm'}">את</button><button type="button" class="btn secondary" data-v="m" aria-pressed="${p.voice === 'm'}">אתה</button></div></div>
            <div class="field"><label>סמל</label><div class="emblems" id="sEmblems">${EMBLEMS.map((e) => `<button type="button" data-e="${e}" aria-pressed="${e === p.emblem}">${e}</button>`).join('')}</div></div>
            <button class="btn" id="sSave">לשמור</button>
          </div>
        </section>
        <section class="panel">
          <p class="ptitle">מוזיאונים בטלפון הזה</p>
          <div class="body">
            <div class="profiles">${Object.values(state.profiles).map((pr) => `<div class="profile-row ${pr.id === p.id ? 'active' : ''}"><span class="em">${esc(pr.emblem)}</span><span style="flex:1">${esc(pr.name)} <span class="muted small">· ${Object.keys(pr.exhibits || {}).length} מוצגים</span></span>${pr.id === p.id ? '<span class="small muted">פעיל</span>' : `<button class="btn secondary" data-switch="${esc(pr.id)}" style="min-height:36px;padding:6px 12px">להחליף</button>`}</div>`).join('')}</div>
            <button class="btn secondary" id="addProfile">להוסיף מוזיאון נוסף</button>
            <p class="hint">אם האחיות משתפות טלפון, לכל אחת מוזיאון נפרד. בטלפון נפרד, כל אחת פותחת את הקישור אצלה.</p>
          </div>
        </section>
        <section class="panel">
          <p class="ptitle">תצוגה</p>
          <div class="body">
            <div class="field"><label for="theme">מראה</label>
              <select class="input" id="theme"><option value="auto" ${(state.theme || 'auto') === 'auto' ? 'selected' : ''}>לפי המכשיר</option><option value="light" ${state.theme === 'light' ? 'selected' : ''}>בהיר</option><option value="dark" ${state.theme === 'dark' ? 'selected' : ''}>כהה</option><option value="sun" ${state.theme === 'sun' ? 'selected' : ''}>שמש (ניגודיות גבוהה)</option></select></div>
          </div>
        </section>
        <section class="panel">
          <p class="ptitle">להורים</p>
          <div class="body">
            <label class="toggle"><span>לפתוח את כל האולמות והמעטפות עכשיו<br><span class="hint">בלי לחכות לתאריכים. טוב לבדיקה, מקלקל את ההפתעה.</span></span><input type="checkbox" id="openAll" ${p.settings.openAll ? 'checked' : ''}></label>
            <div class="field"><label for="previewDate">להציג את האפליקציה כאילו עכשיו:</label>
              <div class="row"><input class="input" type="datetime-local" id="previewDate" value="${nowOverride ? esc(toLocalInput(nowOverride)) : ''}" style="flex:1"><button class="btn secondary" id="previewGo">להציג</button>${nowOverride ? '<button class="btn ghost" id="previewOff">לבטל</button>' : ''}</div>
              <p class="hint">${nowOverride ? `כרגע מוצג כאילו עכשיו ${esc(L.hebrewDate(nowOverride))}, ${esc(nowOverride.getHours().toString().padStart(2, '0'))}:${esc(nowOverride.getMinutes().toString().padStart(2, '0'))}. תקף ללשונית הזאת בלבד.` : 'להצצה לאולם של יום אחר. תקף ללשונית הזאת בלבד.'}</p>
            </div>
          </div>
        </section>
        <section class="panel">
          <p class="ptitle">גיבוי</p>
          <div class="body">
            <div class="row"><button class="btn secondary" id="export">${ico('download')} לשמור / לשתף קובץ גיבוי</button>
            <label class="btn ghost">לייבא גיבוי<input type="file" accept="application/json,.json" id="import" hidden></label></div>
            <p class="hint">${V('הקובץ כולל את התמונות והרישומים של המוזיאון הפעיל. בטלפון הוא נשלח לדרייב, לוואטסאפ או לתיקיית הקבצים. שמרי אותו לפני שמחליפים טלפון.')}${p.lastBackupAt ? ` גיבוי אחרון: ${esc(L.hebrewDate(new Date(p.lastBackupAt)))}.` : ''}</p>
            <button class="btn ghost danger" id="reset">למחוק את המוזיאון הזה</button>
          </div>
        </section>
        <p class="hint">אוצרת ${esc(VERSION)} · הכל נשמר בטלפון בלבד, בלי שרת. <a href="#/credits">תצלומים ורשיונות</a></p>
      </div>`;
    let emblem = p.emblem;
    view.querySelector('#sEmblems').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; emblem = b.dataset.e; view.querySelectorAll('#sEmblems button').forEach((x) => x.setAttribute('aria-pressed', x === b)); });
    view.querySelector('#sVoice').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; p.voice = b.dataset.v; save(); render(); });
    view.querySelector('#sSave').addEventListener('click', () => { p.name = view.querySelector('#sName').value.trim() || p.name; p.emblem = emblem; save(); toast('נשמר.'); render(); });
    view.querySelectorAll('[data-switch]').forEach((b) => b.addEventListener('click', () => { state.activeProfile = b.dataset.switch; save(); render(); }));
    view.querySelector('#addProfile').addEventListener('click', () => { state.activeProfile = null; save(); go('#/'); render(); });
    view.querySelector('#theme').addEventListener('change', (e) => { state.theme = e.target.value; state.themeBase = e.target.value === 'sun' ? (state.themeBase || 'auto') : e.target.value; save(); applyTheme(); render(); });
    view.querySelector('#openAll').addEventListener('change', (e) => { p.settings.openAll = e.target.checked; save(); toast(e.target.checked ? 'הכל פתוח.' : 'חזרנו לתאריכים.'); });
    view.querySelector('#previewGo').addEventListener('click', () => {
      const v = view.querySelector('#previewDate').value; if (!v) return;
      const d = L.parseLocal(v.replace('T', 'T').slice(0, 16)); if (!d) return;
      nowOverride = d; try { sessionStorage.setItem('otz.now', d.toISOString()); } catch (err) { /* ignore */ }
      toast('מוצג כאילו זה ' + esc(L.hebrewDate(d))); render();
    });
    const off = view.querySelector('#previewOff');
    if (off) off.addEventListener('click', () => { nowOverride = null; try { sessionStorage.removeItem('otz.now'); } catch (err) { /* ignore */ } render(); });
    view.querySelector('#export').addEventListener('click', exportBackup);
    view.querySelector('#import').addEventListener('change', async (e) => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      try {
        const data = S.parseImport(await f.text());
        state.profiles = L.mergeProfiles(state.profiles, data.profiles);
        for (const [k, v] of Object.entries(data.media || {})) await S.mediaPut(k, v);
        const first = Object.keys(data.profiles)[0]; if (first) state.activeProfile = first;
        save(); toast('הגיבוי נטען.'); render();
      } catch (err) { toast('זה לא קובץ גיבוי של אוצרת.'); }
    });
    view.querySelector('#reset').addEventListener('click', async () => {
      if (!confirm(`למחוק את המוזיאון של ${p.name} מהטלפון הזה? אין דרך חזרה בלי קובץ גיבוי.`)) return;
      const media = await S.mediaAll(p.id + ':'); for (const k of Object.keys(media)) await S.mediaDel(k);
      delete state.profiles[p.id];
      state.activeProfile = Object.keys(state.profiles)[0] || null; save(); go('#/'); render();
    });
  }
  function toLocalInput(d) { const z = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`; }

  // ---------- service worker ----------
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { /* offline support unavailable */ }); });
  }

  render();
})();
