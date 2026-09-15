# אוצרת (Otzeret, "Curator") — design spec

Date: 2026-09-15. Trip: Paris, London, Disneyland Paris, La Ciotat, 16–29 Sept 2026.
Players: three sisters (18, 14, 13). Parents read the separate Hebrew trip book aloud;
the 3-year-old brother gets his own tiny missions the girls can run for him.

## The one-line pitch

Before there were museums there were *Wunderkammern*, cabinets of wonders that one
person collected. The Louvre started as a king's collection, the British Museum as
Dr Sloane's 71,000 objects. On this trip each girl builds her own museum: every stop
can become an exhibit once she looks at it properly and makes something small.
At the end she prints her museum's catalogue.

## Design constraints (from the brief)

- Not competitive. No scores, no leaderboards, no comparison between sisters.
  Progress is "how many exhibits hang in my museum" and it is only hers to see.
- Personal: each girl plays on her own phone (profiles supported on one device too).
- Fun, engaging, surprising: secret drawers, sealed envelopes that open at moments
  on the trip, a red thread story revealed in fragments.
- Keepsake: a printable exhibition catalogue (PDF via browser print) of everything
  she collected, plus JSON export for safekeeping.
- Hebrew, RTL, phone-first, works offline (PWA), publishable on GitHub Pages with
  no build step. Real art and history content, teen register (not childish).

## Mechanic

1. **Halls and wings.** The museum has four wings (Paris, London, Disney, the South)
   and a hall per day. A hall opens on its date (device time) and stays open after,
   so she can fill it in that evening. Future halls show as locked with a teaser.
   Parents can switch on "open everything" in settings, or preview a day with
   `?now=2026-09-18T10:00`.
2. **Exhibits.** Every stop is a wall label: place, time, a two-line hook, and
   2–3 mission choices. She picks one. Mission types:
   - 📸 photo with a constraint (from the floor, only shadows, one detail)
   - ✏️ sketch on an in-app canvas (blind contour, triangles only, one line)
   - 📝 words (a museum label, a 5-word poem, an overheard sentence, a question)
   - 🎨 colour (pick the place's colour, name it like a paint chip)
   - 🔎 find (a hunt with a note: the cannonball, the Hebrew tile, a straight line)
   Completing a mission hangs the exhibit, stitches the red thread to it, and
   opens the **secret drawer**: one surprising fact or a personal prompt.
   She also writes the exhibit's label (title + one line), like a real museum.
3. **Card of the day.** Each morning she draws one creative constraint for the
   whole day (e.g. "today only doors", "collect three French words"). One redraw.
4. **Envelopes.** About ten sealed envelopes open at moments: first night in Paris,
   before the Eiffel sparkle, 75 m under the Channel, the train home, the last
   morning. Some read back what she wrote earlier (first-night wish → Eurostar home;
   message in a bottle → last morning).
5. **The red thread.** A story in eight fragments, unlocked as exhibits accumulate
   and finished when she binds the catalogue. It follows one idea across the trip:
   people who had no money and only colour (Montmartre 1907, Neal's Yard 1976,
   59 Rivoli 1999, Camden, Shoreditch), the summer of 1907 (Picasso in the
   Bateau-Lavoir, Braque painting La Ciotat, pétanque invented in La Ciotat),
   and the Lumières' train arriving at the very station she will arrive at.
6. **The catalogue.** Cover, floor plan of her museum, each exhibit with image,
   label, place and date, her colour palette of the trip, her envelope notes, the
   full red thread, closing page. Print stylesheet with page breaks.

## Visual identity

- Museum catalogue meets sketchbook. Gallery-white ground (#F2F3EF), inky navy-black
  text (#1A1F2B), slate captions (#6E7480), hairline rules (#D8DAD3).
- The **red thread** (#C4122F) is the single bold element: an SVG thread stitched
  between hung exhibits on the museum wall. It grows as she collects.
- Wings are tinted by material, not flag: Paris zinc-roof blue-grey (#5B6B7F),
  London brick (#8C3B2E), Disney castle pink (#C96A8E), the South Fauvist
  orange (#D9642A) with calanque teal (#2A8C82) as its secondary.
- Type: Frank Ruhl Libre (display, labels, exhibit numbers) + Rubik (body, UI).
  Google Fonts with system fallbacks; cached by the service worker.
- Dark theme: same tokens redefined (charcoal ground, paper text), thread unchanged.
- Motion: one orchestrated moment per exhibit (drawer slides open, thread stitches).
  Reduced motion respected.

## Architecture (no build step)

```
index.html            shell, tabs, templates
css/app.css           tokens, layout, components, dark theme
css/print.css         catalogue print layout
js/content.js         all trip content (stops, missions, secrets, envelopes, cards, thread)
js/logic.js           pure functions: unlock rules, thread fragments, day resolution (unit-tested)
js/store.js           profiles + state in localStorage, images in IndexedDB, export/import
js/sketch.js          canvas sketch pad
js/app.js             views, routing (hash), mission flows, catalogue rendering
sw.js, manifest.webmanifest, icons/
tests/logic.test.mjs  node --test
```

State: `otzeret.v1` in localStorage: `{ profiles: {id: {name, emblem, exhibits, envelopes, cards, settings}}, activeProfile }`.
Images: IndexedDB `otzeret-media`, key `${profileId}:${stopId}`, JPEG data URL ≤ 1280 px.
Export: one JSON file including images (base64). Import merges by profile.

## Error handling

- localStorage/IndexedDB unavailable → app still renders; a banner says progress
  will not be saved on this device.
- Camera denied / file too big → the photo mission falls back to "describe it in words".
- Date in the past for all halls (after the trip) → everything open, catalogue promoted.

## Testing

- `node --test tests/` for logic.js (unlock rules, envelope timing, fragment thresholds,
  export/import round trip of the state shape).
- Playwright walkthrough at 390 px: onboarding → today's hall → complete one mission of
  each type → secret drawer → envelope locked/unlocked with `?now=` → catalogue view.

## Build plan

1. content.js skeleton + logic.js with tests (TDD).
2. store.js (profiles, state, IndexedDB media, export/import).
3. index.html + app.css shell: museum wall, halls, exhibit sheet, tabs, dark theme.
4. Mission flows incl. sketch.js and photo compression; secret drawer; thread stitching.
5. Envelopes, card of the day, red thread view.
6. Catalogue + print.css.
7. PWA (sw.js, manifest, icons), README, GitHub Pages instructions.
8. Fill content for all ~45 stops (Paris, London from the trip book; Disney and the
   South from research), verify facts against research notes.
9. Playwright walkthrough, screenshots, fixes. Publish preview artifact.
