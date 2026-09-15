# אוצרת · Otzeret

A private, non-competitive trip game for three sisters (18, 14, 13) on a family trip to Paris, London, Disneyland Paris and La Ciotat, 16–29 September 2026. Hebrew, right-to-left, phone-first, works offline, no server.

**The idea.** Before there were museums there were cabinets of wonders. Each girl is the curator of her own museum. Every stop on the trip can become an exhibit once she does one small looking-or-making task (a constrained photo, a blind-contour sketch, a five-word poem, a named colour, a hunt). A red thread stitches her exhibits together on the museum wall, sealed envelopes open at set moments of the trip (first night, 75 m under the Channel, the train home), a serialized story unlocks as exhibits accumulate, and at the end she prints her museum's catalogue as the keepsake.

Nothing is scored. Each museum is hers alone and is stored only on her phone.

## Run it

It is a static site. Open `index.html` through any web server (not `file://`, because of the service worker):

```bash
python3 -m http.server 8000
# then http://localhost:8000
```

### Publish on GitHub Pages

1. Push this folder to a repository (for example `otzeret`).
2. Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.
3. Open `https://<user>.github.io/otzeret/` on each girl's phone and use *Add to Home Screen*. The app then works offline and behaves like an installed app.

All paths are relative, so a sub-path deployment works without changes.

## For the parents

- **Preview any day** by opening the app with `?now=2026-09-18T10:00` (or from Settings → *להורים*). This is per browser tab and does not change the girls' devices.
- **Open everything** with the toggle in Settings → *להורים* (kills the surprise, useful for testing).
- **Backup**: Settings → *גיבוי* exports one JSON file with photos and sketches. Import merges it on another device.
- **Catalogue**: the *הקטלוג* tab → *להדפיס / PDF* prints an A4 booklet from the phone (Share → Print → Save as PDF).

## Editing content

Everything the girls read lives in four data files, plain JavaScript objects with template-string text:

| File | Contents |
|---|---|
| `js/content.js` | trip dates, wings, halls (days), envelopes, cards of the day, the red thread, thresholds |
| `js/content-paris.js` | Paris stops (16–19 Sept) plus the Eurostar and the first London evening |
| `js/content-london.js` | London stops (20–22 Sept) |
| `js/content-south.js` | Disneyland Paris, the train south, La Ciotat, Cassis, home |

A stop looks like this:

```js
{ id: `sens`, hall: `d17`, time: `17:35`, name: `כדור התותח`, place: `Hôtel de Sens, Rue du Figuier`,
  hook: `...two lines read on the spot...`,
  missions: [
    { id: `m1`, type: `find`,   title: `...`, prompt: `...`, items: [`...`, `...`], noteLabel: `...` },
    { id: `m2`, type: `sketch`, title: `...`, prompt: `...`, blind: true },
  ],
  secret: `...revealed after the exhibit is hung...`,
  ask: `...optional personal question...`,
  little: `...optional mission for the 3-year-old...` }
```

Mission types: `photo`, `sketch` (optional `blind: true`), `words` (optional `wordLimit`, `placeholder`), `color` (optional `presets`), `find` (`items`, optional `noteLabel`). A stop may override its wing with `wing: 'london'` and, in a multi-day hall, use `when: 'שבת'` and `order: 2` instead of `time`.

Halls open at local midnight of their `date`. A hall can span several days (`label: '26–28.9'`); it stays open once its date has passed.

**After changing any file, bump `VERSION` in `sw.js`** so installed phones pick up the new content on their next launch.

## Architecture

- `index.html`, `css/app.css`, `css/print.css`: shell, tokens, components, catalogue print layout.
- `js/logic.js`: pure functions (unlock rules, envelope timing, thread thresholds, merge). Tested with `node --test tests/logic.test.mjs`.
- `js/store.js`: profiles and state in `localStorage`, photos and sketches in IndexedDB, export/import, image compression.
- `js/sketch.js`: finger sketch pad with a blind-contour mode.
- `js/app.js`: hash routing, views, mission flows, red thread stitching, envelopes, catalogue, settings.
- `sw.js`, `manifest.webmanifest`, `icons/`: installable, offline. Core files are network-first with a 3 s timeout and cache fallback; icons cache-first.

Design notes are in `docs/superpowers/specs/`. Facts in the content were checked in September 2026 against official sources where possible; a few remain marked in the research notes as unverified.

## Privacy

No analytics, no server, no accounts. Everything stays in the browser storage of the phone it was written on. The export file is the only copy that ever leaves the device, and only when someone presses the button.
