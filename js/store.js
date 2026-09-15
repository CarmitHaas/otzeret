/* Storage for אוצרת: state in localStorage, media (photos, sketches) in IndexedDB. Everything is wrapped so the app still runs when storage is blocked. */
(function (root) {
  'use strict';
  const KEY = 'otzeret.v1';
  const DB_NAME = 'otzeret-media';
  const DB_STORE = 'media';

  let memoryState = null;
  const memoryMedia = new Map();
  let storageOk = true;

  function defaultState() {
    return { version: 1, activeProfile: null, profiles: {} };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return memoryState || defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.profiles) return defaultState();
      return parsed;
    } catch (e) {
      storageOk = false;
      return memoryState || defaultState();
    }
  }

  function save(state) {
    memoryState = state;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      storageOk = true;
    } catch (e) {
      storageOk = false;
    }
    return storageOk;
  }

  function newProfile(name, emblem) {
    const id = 'p_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
    return {
      id, name: (name || '').trim() || 'אוצרת', emblem: emblem || '🖼️',
      createdAt: new Date().toISOString(),
      settings: { openAll: false },
      exhibits: {}, envelopes: {}, cards: {}, notes: {}, boundAt: null,
    };
  }

  // ---------- IndexedDB media ----------
  let dbPromise = null;
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve) => {
      try {
        if (!root.indexedDB) return resolve(null);
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => { req.result.createObjectStore(DB_STORE); };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
        req.onblocked = () => resolve(null);
      } catch (e) { resolve(null); }
    });
    return dbPromise;
  }

  async function mediaPut(key, dataUrl) {
    memoryMedia.set(key, dataUrl);
    const db = await openDb();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(DB_STORE, 'readwrite');
        tx.objectStore(DB_STORE).put(dataUrl, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) { resolve(false); }
    });
  }

  async function mediaGet(key) {
    if (memoryMedia.has(key)) return memoryMedia.get(key);
    const db = await openDb();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(DB_STORE, 'readonly');
        const req = tx.objectStore(DB_STORE).get(key);
        req.onsuccess = () => { if (req.result) memoryMedia.set(key, req.result); resolve(req.result || null); };
        req.onerror = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  }

  async function mediaDel(key) {
    memoryMedia.delete(key);
    const db = await openDb();
    if (!db) return;
    try { db.transaction(DB_STORE, 'readwrite').objectStore(DB_STORE).delete(key); } catch (e) { /* ignore */ }
  }

  async function mediaAll(prefix) {
    const out = {};
    const db = await openDb();
    if (db) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(DB_STORE, 'readonly');
          const req = tx.objectStore(DB_STORE).openCursor();
          req.onsuccess = () => {
            const cur = req.result;
            if (!cur) return resolve();
            if (!prefix || String(cur.key).startsWith(prefix)) out[cur.key] = cur.value;
            cur.continue();
          };
          req.onerror = () => resolve();
        } catch (e) { resolve(); }
      });
    }
    for (const [k, v] of memoryMedia) if (!prefix || k.startsWith(prefix)) out[k] = v;
    return out;
  }

  // ---------- export / import ----------
  async function exportProfile(state, pid) {
    const prof = state.profiles[pid];
    const media = await mediaAll(pid + ':');
    return JSON.stringify({ app: 'otzeret', version: 1, exportedAt: new Date().toISOString(), profiles: { [pid]: prof }, media }, null, 0);
  }

  function parseImport(text) {
    const data = JSON.parse(text);
    if (!data || data.app !== 'otzeret' || !data.profiles) throw new Error('not an otzeret file');
    return data;
  }

  // ---------- image compression ----------
  function compressImage(file, maxSide, quality) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, (maxSide || 1280) / Math.max(img.naturalWidth, img.naturalHeight));
          const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(url);
          resolve(c.toDataURL('image/jpeg', quality || 0.82));
        } catch (e) { reject(e); }
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image load failed')); };
      img.src = url;
    });
  }

  root.OTZ_STORE = { load, save, newProfile, defaultState, mediaPut, mediaGet, mediaDel, mediaAll, exportProfile, parseImport, compressImage, get storageOk() { return storageOk; } };
})(window);
