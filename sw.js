/* אוצרת — offline cache. Bump VERSION when files change. */
const VERSION = 'otzeret-v1.4.0';
let IMGS = [];
try { importScripts('./js/credits.js'); IMGS = (self.OTZ_CREDITS || []).map((c) => './img/' + c.id + '.jpg'); } catch (e) { IMGS = []; }
const FONTS = 'otzeret-fonts';
const PRECACHE = [
  './', './index.html', './manifest.webmanifest',
  './css/app.css', './css/print.css',
  './js/logic.js', './js/store.js', './js/content.js', './js/content-paris.js', './js/content-london.js', './js/content-south.js', './js/credits.js', './js/voice.js', './js/sketch.js', './js/app.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(async (c) => {
    // 'reload' so an update is never seeded from a stale copy in the browser's HTTP cache.
    const fresh = (u) => { try { return new Request(u, { cache: 'reload' }); } catch (err) { return u; } };
    await Promise.all(PRECACHE.map(async (u) => { try { const r = await fetch(fresh(u)); if (r && r.ok) await c.put(u, r); } catch (err) { /* offline install */ } }));
    // Photos: best effort, one at a time so a missing file never breaks install.
    for (const u of IMGS) { try { await c.add(u); } catch (err) { /* skip */ } }
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== FONTS).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then((v) => { clearTimeout(t); resolve(v); }, (err) => { clearTimeout(t); reject(err); });
  });
}
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Google Fonts: cache as we go; opaque responses are fine.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(async (c) => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      try { const res = await fetch(e.request); c.put(e.request, res.clone()); return res; } catch (err) { return Response.error(); }
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  const isCore = /\.(html|css|js|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');
  if (isCore) {
    // Network first (so content fixes arrive on the next launch), cache fallback when offline or slow.
    // cache: 'reload' bypasses the browser's HTTP cache, so an update always wins over a stale copy.
    let req = e.request;
    try { req = new Request(e.request, { cache: 'reload' }); } catch (err) { req = e.request; }
    e.respondWith(withTimeout(fetch(req), 3000).then((res) => {
      if (res && res.ok) caches.open(VERSION).then((c) => c.put(e.request, res.clone()));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))));
    return;
  }
  // Icons and other static files: cache first.
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
    if (res && res.ok) caches.open(VERSION).then((c) => c.put(e.request, res.clone()));
    return res;
  })));
});
