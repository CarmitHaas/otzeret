# אוצרת — Visual Redesign Direction

**Deliverable for the implementer. Everything here is exact: hexes, font names, px/rem, CSS technique.**
Target: static site, no build step, one stylesheet of CSS custom properties, Hebrew RTL, 390px phone first, light + dark + a third "sun" theme, A4 print keepsake.

---

## 0. The diagnosis in one paragraph

The concept is excellent and should not be touched. The *material* is the problem. `#F2F3EF` gallery white + `#1A1F2B` navy ink + `#6E7480` slate + hairlines is the palette of an institution talking *about* someone else's objects. Nothing in it belongs to the girl holding the phone. Add to that: photos are used as scrim-darkened backgrounds instead of as objects, every empty state is a dashed rectangle (7 different uses of `1.5px dashed`), every locked state is `filter: grayscale(1)` (which reads "broken", not "not yet"), the museum wall is a 3-across 106px contact sheet at 390px, and the smallest text is `.68rem` (10.9px). The fix is not "add colour for girls". The fix is to change what the app is *made of*: from a painted gallery wall to a warm album page with real photographic prints on it.

---

## 1. Research — what actually reads as 2026 to a 13-to-18-year-old

I separated durable patterns from memes. **Rule I applied: anything I borrow must be a 40-to-100-year-old physical reference that a trend re-surfaced, not a 6-month internet shape.** That's what stops it dating before the trip ends.

### Real patterns (use)

**1. Scrapbook revival / "collected over time" is the dominant 2026 journaling aesthetic.** Layered paper, torn edges, washi tape, ticket stubs, overlapping ephemera, deliberate imperfection; explicitly framed as a reaction against optimised minimal design ([CoraCreaCrafts 2026 sticker & journaling guide](https://coracreacrafts.com/blogs/inspiration-nook/2026-sticker-trends-journaling-guide), [Dark Moon Paper — 2026 journal trends](https://www.darkmoonpaper.com/blog/planner-topics/ugly-cute-stickers-maximalist-collage-and-other-2026-journal-trends/), [Moshi Moshi — journaling trends 2026](https://www.moshimoshiuk.com/journaling-trends-2026-self-care-aesthetics/)). **This is the single closest cultural neighbour to what אוצרת already is.** A trip scrapbook *is* the vernacular form of a personal museum. The app is currently the institutional form of the same thing; move it two steps toward the vernacular and it becomes inviting without losing the idea.
  - Caveat that matters: the same sources describe the trend as *maximalist collage*. Maximalism in the **chrome** would be a disaster (see the anti-brief). Take the materials, not the density.

**2. Digicam / photo-dump: harsh flash, grain, warm cast, feeling over fidelity.** Gen Z actively prefers blown-out flash, grain and washed colour; Instagram's AI "Flash" filter went viral in May 2026; phone makers now ship Digicam/Instant-Film/light-leak modes as first-class camera styles ([DIYPhotography on Gen Z lo-fi](https://www.diyphotography.net/gen-z-photography-trends/), [Croma — digicams are the new iPhones for Gen Z](https://www.croma.com/unboxed/how-digicams-are-the-new-iphones-for-gen-z), [Daily Flash Byte — Instagram flash filter 2026](https://dailyflashbyte.com/articles/instagram-flash-filter-ai-trend-2026/)).
  - **This is the most load-bearing finding in the whole brief.** You have 86 Wikimedia photographs of inconsistent quality, resolution and aspect ratio. In a crisp-minimal design, inconsistency looks like a bug. In a grain-and-warm-cast design, inconsistency looks like *film*. The photo treatment in §5.2 is what turns your worst asset into an aesthetic.

**3. Tactile / material UI is back, carefully.** Grain overlays, embossed states, shadows that imply a pressable surface — described as sitting between flat minimalism and old skeuomorphism, "borrowing the tactile suggestion without the contrast catastrophes of neumorphism" ([Launchpad — UI design trends 2026](https://launchpad-design.co.uk/best-ui-design-trends-2026/), [Medium — tactile maximalism 2026](https://medium.com/@Rythmuxdesigner/tactile-maximalism-why-2026-s-hottest-design-trend-feels-like-you-can-touch-the-screen-ab9fa8f3b5e3)). Note the explicit warning about neumorphism and contrast — I am *not* recommending neumorphism.

**4. "Perfectly imperfect": visible human touch, wobbly line, risograph/marker texture, screen-print misregistration, "slightly sunburnt" analogue.** Two of Fontfabric's ten 2026 trends are exactly this, plus a third on zine/collage/grain systems ([Fontfabric — 10 design & typography trends for 2026](https://www.fontfabric.com/blog/10-design-trends-shaping-the-visual-typographic-landscape-in-2026/)). Their framing is useful: reference the analogue *process*, don't copy a vintage look.

**5. Typographic maximalism — type as the hero, not a neutral carrier** (same Fontfabric source). Concretely for us: the day's title and the wall-text quote should be *big*. Currently the hero h1 is 2rem and sits on top of a photo at 82% scrim. It should be 2.25rem, on paper, unobstructed.

**6. Pinterest Predicts 2026** (21 trends from 80bn searches; 67% Gen Z-driven; Pinterest reports 88% of its predictions over six years have materialised — [Pinterest Newsroom](https://newsroom.pinterest.com/news/pinterest-predicts-nonconformity-self-preservation-and-escapism-drive-21-trends-for-2026/), [Campaign Asia summary](https://www.campaignasia.com/article/pinterest-predicts-the-biggest-gen-z-trends-of-2026/bht17d4oaffu1qooc7i1scs8wc)). Three of its themes land directly on this product: **"curate-don't-copy"** (the entire premise of אוצרת — good, the concept is already on-trend), **making pen pals / analogue correspondence** (your sealed-envelope-and-letter mechanic is culturally current, lean in), and **explorer-coded** styling (messenger satchels, field notes, maps). Signature colours called out: **cool blue and khaki** — which is why the Paris blue and the ochre south in §4 are not arbitrary.

**7. Pantone's Colour of the Year 2026 is "Cloud Dancer", an off-white** — the first white ever chosen, framed as calm and anti-overstimulation ([Pantone](https://www.pantone.com/color-of-the-year/2026), [TIME](https://time.com/7338176/pantone-color-of-the-year-2026/)). Useful as permission: **an off-white ground is not the problem here, the *temperature* is.** Keep a pale ground; make it warm, and put saturated colour and photographs on it.

### Passing memes (do not use)

- Chrome/Y2K metallics, holographic and iridescent fills, neon-on-black, "glitchy glam". They appear in every 2026 trend listicle ([G2](https://learn.g2.com/graphic-design-trends), [Jukebox](https://www.jukeboxprint.com/blog/20-of-the-biggest-graphic-design-trends-for-2026)) and they will look like a specific season of the internet by next summer. They also destroy photographs.
- Full glassmorphism / claymorphism surfaces. Contrast-hostile, and they fight the paper metaphor.
- AI-gradient blobs, bento grids, sticker-spam, "ugly-cute" mascots.
- Anything that needs to be *explained* as a reference. A 14-year-old will not read a bento grid as a gift.

### Accessibility floor (this is a hard floor, not a nice-to-have)

They will use this **outdoors, in September Mediterranean and London daylight, walking**.

- **Contrast.** WCAG 4.5:1 body / 3:1 large text is the legal minimum; 7:1 is AAA. Sunlight readability research puts the *effective* floor higher — a display needs to hold roughly **5:1 or better to stay readable in sun** ([WebAbility — WCAG contrast guide 2026](https://www.webability.io/blog/color-contrast-for-accessibility), [BOIA — accessible colours in mobile apps](https://www.boia.org/blog/accessibility-tips-using-accessible-colors-in-mobile-apps)). Every text token in §4 is ≥ 4.5:1 on *every* surface it can sit on, and body ink is 14.1:1. Anything below is decorative only and is labelled as such.
- **Text size.** NN/g's teen research (100 teens, 210 sites, 30 apps, three rounds over 13 years) recommends **18–19px body and generous touch targets** for 13–17s ([NN/g — UX design for teenagers](https://www.nngroup.com/reports/teenagers-on-the-web/), [NN/g — teenager's UX](https://www.nngroup.com/articles/usability-of-websites-for-teenagers/), [LogRocket — 14 principles for designing for teenagers](https://blog.logrocket.com/ux-design/14-principles-designing-products-for-teenagers/)). The scale in §5 sets body at **18px**. Current `.68rem` (10.9px) frame captions and `.72rem` (11.5px) credits are below the floor and must go.
- **Hebrew specifics.** Hebrew wants a **larger size and more line-height than Latin — ~1.7 for body** — and **never letter-spacing**, which materially damages Hebrew legibility; Hebrew also has no true italic (never fake one) ([ConveyThis — RTL design strategies](https://www.conveythis.com/blog/7-pro-strategies-for-rtl-design), [Smartling — RTL localisation](https://www.smartling.com/blog/translate-rtl-languages)). Latin runs (place names, times, credits) must stay `dir="ltr"` + `unicode-bidi: isolate` — the existing `.latin` class is correct, apply it everywhere.
- **Practical sunlight rules I'm imposing:** no text under 15px anywhere; no font-weight below 400 for Hebrew; no text over a photograph unless it sits on a solid plate; no opacity-based text colours (use a real token); a one-tap **sun theme** in the top bar (§4.3).

---

## 2. Hebrew font verification — the complete list

Source of truth: `https://fonts.google.com/metadata/fonts` fetched 2026-09-16 (1,946 families; note `https://fonts.googleapis.com/metadata/fonts` returns 404 — use the `fonts.google.com` host). **62 families include the `hebrew` subset.** All 62, with the weights Google actually serves:

### Text-capable (the ones worth considering)

| Family | Category | Weights served | Variable axes | Latin? |
|---|---|---|---|---|
| **Assistant** | Sans | 200,300,400,500,600,700,800 | `wght 200–800` | latin + latin-ext |
| **Heebo** | Sans | 100–900 | `wght 100–900` | latin + latin-ext |
| **Rubik** | Sans | 300–900 + italics | `wght 300–900` | latin + latin-ext |
| **Open Sans** | Sans | 300–800 + italics | `wdth 75–100`, `wght 300–800` | yes |
| **Google Sans** | Sans | 400–700 + italics | `GRAD`,`opsz`,`wght` | yes |
| **Arimo** | Sans | 400–700 + italics | `wght 400–700` | yes |
| **Noto Sans Hebrew** | Sans | 100–900 | `wdth 62.5–100`, `wght 100–900` | yes |
| **IBM Plex Sans Hebrew** | Sans | 100–700 | — | yes |
| **Miriam Libre** | Sans | 400,500,600,700 | `wght 400–700` | yes |
| **Alef** | Sans | 400,700 | — | latin only (no latin-ext) |
| **Varela Round** | Sans | 400 | — | yes |
| **Secular One** | Sans | 400 | — | yes |
| **Lunasima** | Sans | 400,700 | — | yes |
| **Fredoka** | Sans/rounded | 300–700 | `wdth 75–125`, `wght 300–700` | yes |
| **M PLUS Rounded 1c** | Sans | 100,300,400,500,700,800,900 | — | yes |
| **M PLUS 1p** | Sans | 100,300,400,500,700,800,900 | — | yes |
| **Frank Ruhl Libre** | Serif | 300–900 | `wght 300–900` | yes |
| **Noto Serif Hebrew** | Serif | 100–900 | `wdth 62.5–100`, `wght 100–900` | yes |
| **Noto Rashi Hebrew** | Serif | 100–900 | `wght 100–900` | yes |
| **David Libre** | Serif | 400,500,700 | — | yes |
| **Bellefair** | Serif | 400 | — | yes |
| **Bona Nova** | Serif | 400,700,400i | — | yes |
| **Bona Nova SC** | Serif | 400,700,400i | — | yes |
| **Libertinus Serif** | Serif | 400,600,700 + italics | — | yes |
| **Cardo** | Serif | 400,700,400i | — | yes |
| **Tinos** | Serif | 400,700 + italics | — | yes |
| **Suez One** | Serif/display | **400 only** | — | yes |
| **Cousine** | Mono | 400,700 + italics | — | yes |
| **Cascadia Code** | Mono-ish | 200–700 + italics | `wght 200–700` | yes |
| **Cascadia Mono** | Mono-ish | 200–700 + italics | `wght 200–700` | yes |

### Display / handwriting with Hebrew

| Family | Category | Weights | Notes |
|---|---|---|---|
| **Karantina** | Display | 300,400,700 | condensed poster face, excellent Hebrew |
| **Amatic SC** | Handwriting | 400,700 | tall condensed hand |
| **Playpen Sans Hebrew** | Handwriting | 100–800, `wght` variable | *current*; modelled on children's handwriting |
| **Gveret Levin** | Handwriting | 400 | casual marker hand; latin (no latin-ext) |
| **Solitreo** | Handwriting | 400 | Sephardic cursive; beautiful, low legibility |
| **Handjet** | Display | 100–900, `ELGR`,`ELSH`,`wght` | dot-matrix / LED, variable element shape |
| **Rubik Doodle Shadow / Doodle Triangles / Marker Hatch / Spray Paint / Dirt / Glitch / Glitch Pop / Bubbles / Burned / Vinyl / Puddles / Beastly / Gemstones / Microbe / 80s Fade / Broken Fax / Pixels / Maps / Maze / Storm / Lines / Iso / Scribble / Moonrocks / Wet Paint / Distressed** | Display | 400 | 26 novelty display cuts, all Hebrew-capable |

That's the full 62. (The Rubik novelty family is a genuinely unusual asset — Hebrew display faces with personality are rare — but see the anti-brief: **one word, never a sentence**.)

### Recommended stack

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Assistant:wght@400..800&family=Suez+One&family=Karantina:wght@700&family=Gveret+Levin&family=Instrument+Serif:ital@0;1&family=Doto:wght@400..700&display=swap">
```

**Verified live: HTTP 200, 17.1 KB of CSS, four `U+0590–05FF` Hebrew unicode-range blocks returned** (Assistant, Suez One, Karantina, Gveret Levin).

| Role | Family | Hebrew? | Why |
|---|---|---|---|
| **Display / titles** | **Suez One** 400 | **HEBREW ✓** | A Hebrew-*first* display face (Michal Sahar) with warmth and weight. Frank Ruhl Libre is a newspaper face — it is why the app reads adult and cold. Suez One reads *printed*, not *published*. Single weight 400 is fine: it is only used at 24px+. |
| **UI / body** | **Assistant** 400/600/700 (variable 200–800) | **HEBREW ✓** | Humanist, high-legibility Hebrew, variable so weight changes cost nothing. Warmer and less mechanical than Rubik (which is also the most over-used Hebrew webfont in Israel — it reads generic). |
| **Her handwriting** | **Gveret Levin** 400 | **HEBREW ✓** | A real casual Hebrew hand. **Demote Playpen Sans Hebrew to fallback**: it is literally derived from children's handwriting, which is the exact infantilising risk with an 18-year-old. Gveret Levin reads like a person, not a child. |
| **Accent / tickets, wing tags, stamps** | **Karantina** 700 | **HEBREW ✓** | Condensed, poster-ish; used only for 1–3 word labels. |
| **Latin place names** | **Instrument Serif** 400/400i | **LATIN-ONLY — fallback for Latin runs** | "Rue Montorgueil", "Sainte-Chapelle" set in a contrasting elegant serif italic is the single cheapest piece of charm in the app. Never used for Hebrew; always inside `.latin`. |
| **Numerals, times, dates, stamps** | **Doto** 400–700 variable | **LATIN-ONLY — numerals only** | Dot-matrix. Used for the digicam date stamp, exhibit numbers, counts, times. Numerals are ASCII so there's no Hebrew gap. |

```css
--font-display: 'Suez One', 'Frank Ruhl Libre', 'David Libre', serif;
--font-body:    'Assistant', 'Heebo', 'Rubik', -apple-system, 'Segoe UI', Arial, sans-serif;
--font-hand:    'Gveret Levin', 'Playpen Sans Hebrew', cursive;
--font-accent:  'Karantina', 'Suez One', 'Assistant', sans-serif;
--font-latin:   'Instrument Serif', 'Bona Nova', Georgia, serif;   /* Latin-only */
--font-num:     'Doto', ui-monospace, 'Cousine', monospace;        /* Latin-only */
```

Hebrew rules, non-negotiable: `letter-spacing: 0` on every Hebrew element (allowed only on Latin uppercase pills, max `.02em`); no `font-style: italic` on Hebrew; no weight < 400 on Hebrew; `line-height: 1.7` on body.

---

## 3. The direction

# נייר ופלאש — **Paper & Flash**

> **Thesis: keep the museum's mind, change its body.** The gallery wall becomes a warm album page; every photograph becomes a physical print with a white mat, a flash bloom and grain; and the red thread stops being a UI line and becomes a stitch with a shadow. The container stays grown-up so the 18-year-old isn't embarrassed; everything *she* makes is warm, crooked and in her own handwriting so the 13-year-old feels ownership.

Three sentences of what changes on screen: **(1)** the ground goes from cool grey-white to warm paper and every photo gets the same print finish, so 86 mismatched Wikimedia images become one album; **(2)** text comes off the photographs and onto the paper, at 18px, so it survives sunlight; **(3)** the museum wall goes from a 3-across contact sheet to a 2-across wall with a skyline of different-sized frames, real nails and a sagging stitched thread.

---

## 4. Palette

Six core roles + four wings + one secondary, in three themes. Every ratio below was computed, not estimated.

### 4.1 Light (default) — "album page"

```css
:root{
  --paper:    #F7F2E9;  /* warm ground, replaces #F2F3EF */
  --paper-2:  #EFE7D9;  /* recessed: worktables, wall-text plates, inputs */
  --card:     #FFFCF6;  /* raised paper: cards, labels, letters, rows */
  --ink:      #2A211C;  /* warm near-black, replaces navy #1A1F2B */
  --ink-2:    #4E413A;  /* secondary text */
  --muted:    #6E5F55;  /* captions, meta, credits */
  --line:     #E4DACA;  /* decorative hairline ONLY */
  --line-2:   #CFC1AC;  /* structural edge, still decorative — never the only signal */
  --thread:   #C0241E;  /* the red thread — the one accent, text-safe */
  --thread-soft:#F6DED4;/* halo / tint */
  --ok:       #2F6B4A;
  --paris:    #2E5E8C;  /* zinc roofs & rain */
  --london:   #2C6B4E;  /* park & bottle-glass green */
  --disney:   #A83C7E;  /* castle at dusk — plum-magenta, not bubblegum */
  --south:    #A05A05;  /* Cap Canaille ochre */
  --south-2:  #0E7C80;  /* calanque teal — decoration only, never a wing ID */
}
```

**Contrast, light theme** (`paper #F7F2E9` / `card #FFFCF6` / `paper-2 #EFE7D9`):

| Token | Hex | on paper | on card | on paper-2 | white on it |
|---|---|---|---|---|---|
| `--ink` | `#2A211C` | **14.13** | 15.39 | 12.83 | 15.76 |
| `--ink-2` | `#4E413A` | **8.80** | 9.58 | 7.99 | 9.81 |
| `--muted` | `#6E5F55` | **5.49** | 5.98 | 4.98 | 6.12 |
| `--thread` | `#C0241E` | **5.36** | 5.84 | 4.87 | 5.98 |
| `--paris` | `#2E5E8C` | **6.08** | 6.62 | 5.52 | 6.78 |
| `--london` | `#2C6B4E` | **5.67** | 6.18 | 5.15 | 6.32 |
| `--disney` | `#A83C7E` | **5.21** | 5.68 | 4.73 | 5.81 |
| `--south` | `#A05A05` | **4.76** | 5.18 | 4.32 | 5.30 |
| `--south-2` | `#0E7C80` | 4.47 | 4.87 | 4.06 | 4.98 |
| `--ok` | `#2F6B4A` | 5.67 | 6.17 | 5.15 | 6.32 |

Everything that carries text clears 4.5:1 on paper and on card. `--south` and `--south-2` fall to 4.32/4.06 on `--paper-2`: **rule — wing colours are never used as text on `--paper-2`**; on a recessed surface a wing appears only as a 3–4px bar or a dot. `--line` (1.24) and `--line-2` (1.59) are below 3:1 and are therefore **decorative only — never the sole carrier of a state**.

**Wing separation** (ΔE76, incl. the thread red, which must not be mistaken for a wing):
paris–london 48.8 · paris–disney 54.4 · paris–south 86.7 · paris–thread 95.3 · london–disney 82.6 · london–south 66.8 · london–thread 93.3 · disney–south 72.4 · disney–thread 58.5 · **south–thread 37.0 (the minimum)**. All comfortably above the ~20 "clearly a different colour" threshold. Note the set spans the wheel deliberately — blue / green / magenta / ochre — so it survives as a set and reads as a *map legend*, not a mood board. The old `--london: #8C3B2E` (brick) was only ΔE ≈ 22 from the thread red and had to move; Victorian brick and the red thread were competing for the same slot.

**Colour-vision check (simulated, Viénot):** under deuteranopia `--south` and `--thread` collapse to ΔE 1.9; under protanopia `--paris` and `--disney` collapse to ΔE 4.8. This is unavoidable with a five-colour set on warm paper. **Therefore: a wing is never identified by colour alone.** Every wing carries its Hebrew name plus a fixed 16px glyph — Paris = a pyramid/triangle, London = an arch, Disney = a star, La Ciotat = a wave. The colour is reinforcement, never the signal.

### 4.2 Dark — "the album on a table at night"

```css
:root[data-theme="dark"], @media (prefers-color-scheme: dark) :root:not([data-theme="light"]){
  --paper:   #17130F;  --paper-2: #211B15;  --card: #2A231C;
  --ink:     #F5ECDE;  --ink-2:   #DDD0BE;  --muted:#ACA093;
  --line:    #392F25;  --line-2:  #4C4033;
  --thread:  #F4644A;  --thread-soft:#4A241C;
  --ok:      #6FC58F;
  --paris:   #8FBDE6;  --london: #7ACCA2;  --disney: #F294C6;
  --south:   #EDA34E;  --south-2:#56D2CC;
  --print-mat: #F1E7D6;   /* prints KEEP a light mat in dark mode — see §5.2 */
}
```

| Token | Hex | on paper `#17130F` | on card `#2A231C` | on paper-2 `#211B15` |
|---|---|---|---|---|
| `--ink` | `#F5ECDE` | **15.78** | 13.23 | 14.55 |
| `--ink-2` | `#DDD0BE` | **12.18** | 10.21 | 11.23 |
| `--muted` | `#ACA093` | **7.22** | 6.05 | 6.66 |
| `--thread` | `#F4644A` | **5.96** | 4.99 | 5.49 |
| `--paris` | `#8FBDE6` | 9.32 | 7.81 | 8.59 |
| `--london` | `#7ACCA2` | 9.67 | 8.10 | 8.92 |
| `--disney` | `#F294C6` | 8.65 | 7.25 | 7.97 |
| `--south` | `#EDA34E` | 8.75 | 7.34 | 8.07 |

Dark wing separation holds: paris–london 48.4 · disney–south 68.4 · south–thread 41.9 (minimum). The dark ground is warm (`#17130F`, a brown-black) rather than the current blue-black `#1B1D22` — the photographs are warm-cast, and a blue-black ground makes them look green.

### 4.3 Sun — a third theme, and the highest-value accessibility feature here

They will be reading this on a phone, outdoors, in September, while walking. Add `[data-theme="sun"]` and a **one-tap toggle in the top bar** (not buried in settings), and map `prefers-contrast: more` to it automatically.

```css
:root[data-theme="sun"], @media (prefers-contrast: more){ :root{
  --paper:#FFFFFF; --paper-2:#F2EFE9; --card:#FFFFFF;
  --ink:#12100D; --ink-2:#2B2621; --muted:#3A322A;
  --line:#B9AC98; --line-2:#8E8272;
  --thread:#9E1B12; --thread-soft:#FBE3DE;
  --paris:#1E4668; --london:#1D4E37; --disney:#7E2A5D; --south:#6E3E03;
  --grain:none; --laid:none; --photo-wash:none;
  --sh-1:none; --sh-2:none; --sh-3:0 0 0 1px var(--line-2);
  --hair: 1.5px;                /* all 1px borders become 1.5px */
}}
```
`#12100D` on white = **18.99:1**; `--muted #3A322A` = **12.58:1**; `--thread #9E1B12` = **8.02:1** (and 8.02:1 for white-on-thread). Texture, washes and shadows all switch off — in direct sun, grain is noise.

### 4.4 Wing tinting without new tokens

Never hard-code tints. Derive at runtime:

```css
[data-wing="paris"]{--wing:var(--paris)} [data-wing="london"]{--wing:var(--london)}
[data-wing="disney"]{--wing:var(--disney)} [data-wing="south"]{--wing:var(--south)}
[data-wing="travel"]{--wing:var(--muted)}

--wing-tint:   color-mix(in srgb, var(--wing) 12%, var(--card));
--wing-tint-2: color-mix(in srgb, var(--wing) 22%, var(--card));
--wing-edge:   color-mix(in srgb, var(--wing) 55%, var(--line-2));
```

---

## 5. Type & material

### 5.1 Type scale (root 16px)

```css
--t-micro: .9375rem;  /* 15px — credits, stamps, legal. NOTHING is smaller. */
--t-cap:   1rem;      /* 16px — captions, meta, tab labels */
--t-body:  1.125rem;  /* 18px — body, row names, buttons (NN/g teen floor) */
--t-lead:  1.25rem;   /* 20px — wall text, letters, secret-drawer facts */
--t-h3:    1.5rem;    /* 24px */
--t-h2:    1.875rem;  /* 30px */
--t-h1:    2.25rem;   /* 36px */
--t-cover: 2.875rem;  /* 46px — onboarding + catalogue cover */
--lh-tight:1.2;  --lh-snug:1.45;  --lh-body:1.7;
```

Usage: `h1/h2/h3` + wall text + facts → **Suez One 400**, `line-height: var(--lh-tight)` (1.15 for `--t-cover`). Body, rows, buttons, forms, tabs → **Assistant**: 400 body, 600 for names/labels/buttons, 700 for emphasis. Her words (exhibit title, her note, letters, the words-mission textarea) → **Gveret Levin 400** at one step *up* from the surrounding size (a hand face runs small). Wing tags, ticket bits, the "bound" stamp → **Karantina 700**, `letter-spacing: 0`. Latin place names → **Instrument Serif 400 italic** inside `.latin`. All times, dates, counts, exhibit numbers → **Doto 500–600** with `font-variant-numeric: tabular-nums`, inside `.num`/`.latin`.

The current Bellefair cover face is dropped — Suez One at `--t-cover` does that job with more warmth and one fewer request.

### 5.2 What the "paper" is now — and the photo treatment

**The ground** is three cheap stacked layers on `body`:

```css
--grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .22 0 0 0 0 .14 0 0 0 0 .06 0 0 0 .055 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
--laid: repeating-linear-gradient(0deg, rgba(96,62,30,.016) 0 1px, transparent 1px 3px);

body{ background: var(--grain), var(--laid), var(--paper); }
body::before{ content:""; position:fixed; inset:0; z-index:-1; pointer-events:none;
  background: radial-gradient(130% 70% at 50% -10%, rgba(255,241,219,.55), transparent 62%); }
```

The existing grain SVG is kept — only the `feColorMatrix` changes, from neutral black at `.07` alpha to **warm brown at `.055`**. (Do not use `background-attachment: fixed`; it is broken/janky in iOS Safari. The fixed `::before` layer above is the safe equivalent.)

**Every photograph in the app goes through one class.** This is the mechanism that makes 86 inconsistent Wikimedia images look like one album:

```css
.print{ position:relative; background:var(--print-mat,#FFFDF7); padding:var(--print-mat-w,6px);
  border-radius:var(--r-print); box-shadow:var(--sh-2); isolation:isolate; }
.print img{ display:block; width:100%; height:100%; object-fit:cover; object-position:50% 42%;
  border-radius:1px; filter:saturate(1.08) contrast(1.05) brightness(1.02); }
/* warm wash + shared grain — this is what unifies them */
.print::after{ content:""; position:absolute; inset:var(--print-mat-w,6px); border-radius:1px;
  pointer-events:none; opacity:.55; mix-blend-mode:multiply;
  background: linear-gradient(0deg, rgba(122,66,24,.16), rgba(122,66,24,.16)), var(--grain); }
/* flash bloom + print edge + corner darkening */
.print::before{ content:""; position:absolute; inset:var(--print-mat-w,6px); border-radius:1px;
  pointer-events:none; z-index:1;
  background: radial-gradient(115% 85% at 50% 36%, rgba(255,233,198,.22), transparent 58%);
  mix-blend-mode:screen;
  box-shadow: inset 0 0 0 1px rgba(60,38,20,.14), inset 0 0 44px rgba(60,38,20,.14); }
```

Four supporting rules:

1. **Fixed aspect per slot** (`aspect-ratio` + `object-fit:cover`), so source ratios stop mattering. Hero `5/4`; stop sheet `3/2`; wall frames cycle `1/1`, `4/5`, `5/4`; stop-row thumb `1/1`; catalogue `3/2`. `object-position: 50% 42%` because architecture photos put their subject above the middle.
2. **A bad photo gets a bigger mat.** This is literally what a museum does with a small print. One JS hook: on `load`, `if (img.naturalWidth < 900) img.closest('.print').classList.add('print--matted')`, where `.print--matted{--print-mat-w:18px}`. A soft 700px JPEG inside an 18px mat reads as *deliberate*; edge-to-edge it reads as *low-res*.
3. **Prints keep a light mat in dark mode** (`--print-mat:#F1E7D6`). A dark-on-dark photo card is the fastest way to make a photo app look dead at night.
4. **Never put required text on a photo.** One exception each: the wing tag pill (solid fill) and the decorative date stamp (`aria-hidden`).

**Tape** — the one journaling gesture, rationed:

```css
.tape{position:relative}
.tape::before{content:"";position:absolute;z-index:3;inline-size:92px;block-size:26px;
  inset-block-start:-11px; inset-inline-start:18px; transform:rotate(-2.5deg);
  background: linear-gradient(135deg, rgba(255,255,255,.55), rgba(255,255,255,.16)),
              color-mix(in srgb, var(--wing, var(--thread)) 32%, #FFF6E6);
  box-shadow:0 1px 2px rgba(60,38,20,.18); opacity:.92;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 7px,#000 calc(100% - 7px),transparent 100%);
          mask-image:linear-gradient(90deg,transparent 0,#000 7px,#000 calc(100% - 7px),transparent 100%);}
```
**Rule: at most one piece of tape per screen, and only on something *she* made or received** — the day card, a hung exhibit, the hero photo. Never on navigation, buttons or system messages. Tape on chrome is where scrapbook becomes sticker soup.

**The thread is now thread**, not a line. Every red-thread stroke is *two* SVG paths: a shadow path (`stroke:rgba(60,38,20,.18); stroke-width:4.5; transform:translate(0,2px)`) under a stitch path (`stroke:var(--thread); stroke-width:2.5; stroke-dasharray:10 6; stroke-linecap:round`). And it **sags**: draw nail-to-nail as a quadratic with the control point 14px *below* the midpoint. Two lines of SVG for the biggest single perceptual upgrade in the app.

### 5.3 Edges, radii, shadows

```css
--r-print: 2px;   /* photographic prints, labels, letters, stamps — paper has square corners */
--r-xs: 6px;      /* small chips, seals-adjacent */
--r: 12px;        /* rows, cards, inputs, buttons */
--r-lg: 18px;     /* panels, sheets */
--r-xl: 24px;     /* the mission worktable, bind CTA */
--r-pill: 999px;  /* wing tags, badges */
/* Rule: nothing gets a radius between 3px and 5px. Paper is 2, UI is 12+. */

--sh-1: 0 1px 1px rgba(60,38,20,.07);
--sh-2: 0 1px 2px rgba(60,38,20,.08), 0 8px 18px -10px rgba(60,38,20,.24);
--sh-3: 0 2px 4px rgba(60,38,20,.10), 0 18px 34px -14px rgba(60,38,20,.30);
/* dark: same geometry, rgba(0,0,0,.45/.55) + inset 0 1px 0 rgba(255,236,205,.06) top highlight */
```

Shadows are **brown, never black** — black shadows on warm paper look like dirt. Raised things (cards, prints, rows) get `--sh-2`; the worktable and inputs are *recessed* and get `inset 0 1px 0 rgba(255,255,255,.7)` with **no** outer shadow. That inset/outset split is what carries "this is a surface you read" vs "this is a surface you work on", and it replaces the current dashed-border system.

**Torn edges**, used in exactly two places (catalogue cover top, opened letter top):
```css
--deckle: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='10' preserveAspectRatio='none'%3E%3Cpath d='M0 10V4q10-3 20 0t20 1 20-3 20 2 20-1 20 1v6z' fill='%23000'/%3E%3C/svg%3E");
.torn-top{ -webkit-mask-image:var(--deckle), linear-gradient(#000,#000);
  -webkit-mask-size:120px 10px, 100% calc(100% - 9px);
  -webkit-mask-position:top left, bottom left; -webkit-mask-repeat:repeat-x, no-repeat;
  mask-image:var(--deckle), linear-gradient(#000,#000);
  mask-size:120px 10px, 100% calc(100% - 9px);
  mask-position:top left, bottom left; mask-repeat:repeat-x, no-repeat; }
```
Two uses only. A third makes it a gimmick.

---

## 6. Component direction

### 6.1 Today hero
Today: 4:3 photo, 82%-black scrim, all text burned onto the image. That is the worst-performing element in sunlight and the reason the photos look muddy.

New: a **5:4 `.print` with `.tape`, rotated `-0.6deg`**, sitting on the paper with `--sh-2`. Above it, one meta line: wing glyph + wing name (Karantina 700, `--wing`) + `·` + date (Doto, `--muted`, `--t-cap`). **Below it, on the paper**: `h1` in Suez One at `--t-h1` (36px) `line-height:1.15` `text-wrap:balance`, then the sub at `--t-body` in `--ink-2`. Over the photo only two things: the **wing tag pill** top-inline-start (solid `--wing`, white text, `--t-micro`/600, `--r-pill`, 6px 12px — 5.3–6.8:1 verified) and a **digicam date stamp** bottom-inline-end in Doto 600 `--t-micro`, colour `#FFB23F`, `text-shadow:0 0 6px rgba(255,120,0,.5)`, `aria-hidden="true"`. That stamp is the one pure-2026 flourish and it costs nothing.
If a title over the photo is insisted on, it must sit on a solid plate: `background:rgba(36,27,20,.78); backdrop-filter:blur(6px)` → measured **16.0:1** for `#FFF8EC`.
Locked/future day: **no `grayscale(1)`**. Use `filter:saturate(.45) brightness(1.06)` + a `--paper-2` veil at 55% — faded, not broken.

### 6.2 Card of the day
Kill the `♦` glyph and the dashed red stripe (playing-card kitsch fighting the museum idea). The card is a **small printed card**: `--card`, `--r-xs`, `box-shadow: inset 0 0 0 1px var(--line-2), inset 0 0 0 5px var(--card), var(--sh-2)` (a ruled card edge, no dashes), 20px padding, one `.tape` at top-inline-start, text in Suez One `--t-lead` / 1.45. The eyebrow ("קלף היום") in Karantina 700 `--t-micro` `--thread`. A 26px thread-red **knot** SVG overlaps the top-inline-end corner and is where the timeline thread visually enters.
Undrawn state is **not** a dashed ghost — it's a **face-down card**: `--paper-2`, same size, a 45° `repeating-linear-gradient` in `color-mix(in srgb,var(--thread) 10%, transparent)` at 6px/12px, and a centred 52px thread-red button "שלפי קלף".

### 6.3 Stop list rows
72px tall, `grid-template-columns: 56px 1fr 30px`, gap 14px, `--card`, `--r`, 1px `--line`, `--sh-1`.
- Column 1 is now a **56×56 `.print` thumbnail** of the place (`--print-mat-w:3px`, `--r-print`) — the day becomes visual.
- Column 2: time in Doto 600 `--t-cap` tabular (`.latin`, so `08:30` doesn't flip) + name in Assistant 600 `--t-body` + Latin place in Instrument Serif italic `--t-cap` `--muted` inside `.latin`.
- Column 3: state. Done = a **stitched ×** (two 2.5px thread-red strokes, `stroke-linecap:round`, drawn as inline SVG), not a filled circle-check — a check in a red disc is a productivity app. Todo = an 11px open ring in `--line-2` *plus* the row's inline-start 3px `--wing` bar at 30% opacity; done raises that bar to 100%.
- A 2px dotted `--line-2` vertical connector runs behind the thumbnails between rows so the day reads as a route.

### 6.4 Stop sheet
Order: back link → `3/2 .print` (full width to the 16px gutter) → credit at `--t-micro` `--muted` (up from 11.5px) → meta row (wing glyph + wing name + time, Doto for the time) → `h1` Suez One `--t-h2` → Latin subtitle Instrument Serif italic `--t-lead` `--ink-2` in `.latin` → **the hook** → mission choices.
**The hook** stops being two hairlines. It becomes a **wall-text plate**: `--paper-2`, `--r`, 18px 20px, `border-inline-start:4px solid var(--thread)`, text in Suez One `--t-lead`/1.6, with a decorative `”` in `--thread` at 3.25rem, `position:absolute; inset-block-start:-10px; inset-inline-end:14px; opacity:.2`. One quote mark, not two.
Locked hall notice: `--paper-2` row, lock glyph, `--muted`, `--t-cap` — no dashes, no grayscale.

### 6.5 Mission choice cards
The choice is the fun part; today all five look identical (a grey circle). Give each mission its **own 44px glyph drawn in inline SVG at `stroke-width:1.8` in `--wing`**:
- photo → four corner brackets (a viewfinder)
- blind-contour sketch → a single continuous wandering line
- words → three ruled lines, the last one short
- colour → a 3-stop gradient chip of `--wing`
- find-it → six dots, one circled in `--thread`

Card: `--card`, `--r-lg`, 1px `--line`, 16px, `grid-template-columns:44px 1fr`, title Assistant 600 `--t-body`, prompt `--muted` `--t-cap`, plus a **time cost** chip in Doto `--t-micro` (`דקה` / `3 דקות`). Teens abandon fast (NN/g); naming the cost raises completion. `:active` → 2px `--thread` ring + `translateY(1px)`.

### 6.6 Mission panel — the worktable
Must feel different from every reading surface: `--paper-2` ground, `--r-xl`, `inset 0 1px 0 rgba(255,255,255,.7)`, **no outer shadow**, 18px padding.
- **Photo drop**: not a dashed box — an **empty print**. A `5/4` `--print-mat` mat with a `--paper-2` centre, a 34px camera glyph in `--muted`, and a 52px `--thread` button "צלמי". Once filled it becomes a real `.print` with all the treatment in §5.2, so the preview already looks like the exhibit.
- **Sketch canvas**: `#FFFDF7` + `--laid` under the strokes, 1px `--line-2` edge, `--r-xs`. Pen swatches become physical nibs: 34px circles with `inset 0 -2px 3px rgba(60,38,20,.25)`. The blind-contour veil is `--paper-2` at 96% with the instruction in Suez One `--t-lead` (it currently is — keep).
- **Words**: `textarea` set in **Gveret Levin at `--t-lead`** on ruled lines (`repeating-linear-gradient(0deg, transparent 0 33px, var(--line) 33px 34px)`, `line-height:34px`). Typing in the handwriting face is the highest-delight-per-byte detail available. Counter in Doto tabular `--muted`.
- **Colour**: the 72px native swatch stays; add the picked colour's hex in Doto and a one-word name field in Gveret Levin.
- **Find-it**: checkboxes become 26px `--thread`-accented boxes on `--card` rows at 52px height.

### 6.7 Museum wall
Structurally the biggest change. At 390px, `repeat(3,1fr)` gives ~106px frames with 6px borders — a contact sheet.

- **Two columns** ≤ 480px (`repeat(2,1fr)`, `gap: 18px 14px`), three columns ≥ 481px.
- **A skyline instead of a grid**: cycle aspect ratios so the wall has rhythm without a masonry library —
  `.frame:nth-child(3n+1){aspect-ratio:1}` `.frame:nth-child(3n+2){aspect-ratio:4/5}` `.frame:nth-child(3n){aspect-ratio:5/4}`.
- **A hung exhibit** = `.print` with `--print-mat-w:8px`, plus `outline:2px solid var(--line-2); outline-offset:0`, `--sh-2`, and a deterministic tilt (`:nth-child(odd){--tilt:-1.1deg}` / `even{--tilt:1.1deg}`) — no random JS tilt.
- **A nail** above each frame: an 8px circle, `background:radial-gradient(circle at 35% 30%, #EAD6A6, #8A6A34)`, `box-shadow:0 1px 1px rgba(60,38,20,.35)`. The thread passes **through the nails**.
- **The thread**: two paths (§5.2), sagging, `stroke-dasharray:10 6`. It currently runs straight between frame centres; sag is the whole difference between "connector" and "thread".
- **Empty slot**: not dashed. A **pencil outline on the wall** — `1px solid var(--line-2)` at 55% opacity with `inset 0 0 0 4px var(--paper)`, plus the ghost photo at `opacity:.14; filter:saturate(.3) sepia(.25)` — **warm-faded, never `grayscale(1)`**. Caption in `--muted` `--t-micro` (15px, up from 10.9px).
- **Locked hall**: keeps colour. `.hall.locked .frames{opacity:.5}` plus a `--paper-2` lock row. Drop `filter:grayscale(1)` from `.thumb` too.
- **Hall header**: 44px round `.print` thumb + hall name in Suez One `--t-h3` + count in Doto (`5/12`) + a **3px `--wing` rule** spanning the header width. That rule is what makes each wing feel like a *room*.

### 6.8 Exhibit label card
The best idea in the app — make it physical, and keep it the one formally restrained element (the museum voice lives here).
`--card`, **`--r-print` (2px — labels are square)**, 1px `--line-2`, `--sh-1`, 18px 20px. The number moves into a 26px `--paper-2` disc overlapping the top-inline-start edge, set in Doto 600 `--t-micro`. Two 6px `--thread` dots pin the top corners. Title in **Gveret Levin `--t-h3`** (her hand), note in Assistant `--t-body`, then a 1px `--line` rule, then meta in `--t-cap` `--muted` with the Latin place in Instrument Serif italic inside `.latin`.

### 6.9 Secret drawer
Closed: a 56px `--paper-2` slab, `--r`, with a **brass pull** — a 36×10px `--r-pill` bar, `linear-gradient(180deg,#E8CD90,#B5904A)`, `box-shadow:0 1px 0 rgba(60,38,20,.35)` — plus "מגירה סודית" in Assistant 600 `--t-body` and a `--muted` hint.
Open: replace the `max-height` hack with `grid-template-rows: 0fr → 1fr` (see §7). The contents arrive on **different paper**: `--card` with `.torn-top`, 18px, fact in Suez One `--t-lead`/1.6, opening word marked in `--thread`, and a "כבר ידעת?" kicker in Gveret Levin `--t-cap` `--muted`.

### 6.10 Envelopes and the opened letter
Kill the airmail `border-image: repeating-linear-gradient(...red/white/blue...)` — it's kitsch and it fights the thread red.
**Envelope row**: `--card`, `--r-xs`, 84px tall, with a real **flap** — `::before{clip-path:polygon(0 0,50% 58%,100% 0)}` filled `color-mix(in srgb, var(--paper-2) 90%, var(--wing))`, 1px `--line-2` edge. The **wax seal** sits at the flap tip: 40px circle, `radial-gradient(circle at 34% 30%, #E2564A, #9E1B12 72%)`, `inset 0 1px 0 rgba(255,255,255,.35)`, her emblem letter in Suez One white.
States: *sealed* → flap at 60%, seal in `--line-2`, plus a text line "נפתח ב-21.9" (a lock icon alone is not enough); *ready* → wax seal + 6px `--thread-soft` halo + a 3s breathing scale (reduced-motion: off); *opened* → flap `rotateX(170deg)` from `transform-origin: top`, seal replaced by a broken ring.
**Opened letter**: `--card`, `--r-print`, `.torn-top`, 24px 22px, with **two fold creases** at 33% and 66% —
`linear-gradient(180deg, transparent 49.55%, rgba(60,38,20,.10) 49.7%, rgba(255,255,255,.55) 50.3%, transparent 50.5%)` — that one gradient is what sells "this was folded inside an envelope". Text in Gveret Levin `--t-lead`/1.75. The "from the past" block: `--paper-2`, `--r`, 2px `--thread` inline-start rule, her old words in Gveret Levin.

### 6.11 Red-thread timeline
The line becomes an inline SVG thread down the page: a 2.5px path with a gentle wobble (amplitude 4px, period 120px), `stroke-dasharray:10 6`, over its shadow path. Each fragment node is a **knot**: 11px `--thread` circle + 3px `--paper` ring + 1px `--thread` outer ring. Locked = open ring, no fill. Fragment title Suez One `--t-h3`; text `--t-lead`/1.65; add the wing glyph + place line above the title in `--t-cap` `--muted`. Locked fragments keep `--muted` at `--t-body` (currently they drop to `.9375rem` — 15px is the floor, don't go under).

### 6.12 Catalogue / keepsake
**Screen**: pages are album spreads — `--card`, `--r-print`, 24px, `--sh-2`, each wing section opening with a 3px `--wing` rule and the wing name in Karantina 700. The cover swaps the 4-up mosaic for a **stack of three prints** (rotated `-4deg / 2deg / -1deg`, overlapping 14px, each a real `.print`) — a pile of photos, not a grid. Title Suez One `--t-cover`, dates in Doto. `.torn-top` on the cover page. The bind CTA stays `--thread`, 52px tall, `--r-xl`.
**Print (A4)** — the keepsake must not carry the screen's texture:
```css
@page{ size:A4; margin:16mm 14mm; }
@media print{
  :root{ --paper:#FFFFFF; --paper-2:#FFFFFF; --card:#FFFFFF;
         --ink:#1A1512; --ink-2:#3A322A; --muted:#55493F;
         --line:#D8CCB8; --line-2:#B7A891; --thread:#A8281A;
         --grain:none; --laid:none; --sh-1:none; --sh-2:none; --sh-3:none; }
  body::before{ display:none }
  .print::after, .print::before{ display:none }      /* full photographic fidelity on paper */
  .print img{ filter:none; max-height:120mm }
  .print{ padding:0; border:0.5pt solid var(--line-2) }
  .tabs,.topbar,.toast,.nudge,.bind-cta{ display:none !important }
  .catalogue .item{ break-inside:avoid }
  .catalogue .wing-open{ break-before:page }
  body{ font-size:10.5pt; line-height:1.6 }
  h1{font-size:20pt} h2{font-size:15pt} .label-card .ltitle{font-size:12pt} .lmeta{font-size:8.5pt}
  .wing-band,.chip .c,.swatch{ -webkit-print-color-adjust:exact; print-color-adjust:exact }
}
```
Rule: colour-force **only** the wing bands and colour swatches (they *are* the content). Everything else prints as ink on white — cheaper, sharper, and a warm-tinted A4 page bands badly on a home printer.

### 6.13 Bottom tab bar
Height 62px + safe area. Background `color-mix(in srgb, var(--paper) 88%, transparent)` + `backdrop-filter: blur(14px) saturate(1.2)` (behind `@media (prefers-reduced-transparency: no-preference)`; solid `--paper` otherwise). 1px `--line` top hairline.
**Remove the 3px red bar at the top edge** — it reads as a browser tab. Active state becomes a **28×28 `--r-xs` pill behind the icon** in `color-mix(in srgb, var(--thread) 12%, transparent)` with the icon in `--thread` and the label in `--ink` 600. Inactive icon/label `--muted` (5.49:1 ✓). Labels go 12px → **`--t-micro` 15px**; icons 24px; each tab ≥ 48×48. Badge: 8px `--thread` dot with a 2px `--paper` ring at `top:10px`.

---

## 7. Motion — four moments, nothing else

No parallax, no scroll-driven animation, no confetti. They are walking, outdoors, on battery.

1. **Drawing the day's card** (420ms, `cubic-bezier(.2,.9,.25,1)`): face-down card `rotateY(-96deg) translateY(10px) → 0/0` with `perspective:900px`; the tape does `scaleX(.6) → 1` from `transform-origin: center` at 120ms delay. Replaces the current `flip` keyframe (which starts at `opacity:0` and pops).
2. **Hanging an exhibit** (three beats, ~1.1s total): frame `scale(.94) rotate(0) → scale(1) rotate(var(--tilt))` 260ms `cubic-bezier(.34,1.4,.5,1)` — the slight overshoot is the bounce on the nail; then at +160ms the thread stitches from the *previous* nail (`stroke-dashoffset: len → 0`, 700ms `ease-out` — keep the existing `stitch` keyframe, just anchor it to the previous exhibit); then the new nail dot `scale(0)→1`, 160ms.
3. **Opening the secret drawer** (320ms, `cubic-bezier(.2,.8,.2,1)`): `grid-template-rows: 0fr → 1fr` on a `display:grid` wrapper with `.inner{min-height:0;overflow:hidden}` — replaces `max-height: 0 → 1200px`, which currently makes the easing wrong for every fact length. The brass pull `translateY(0→2px)`; the fact fades up `translateY(6px)→0` at 120ms delay.
4. **Breaking a seal** (≤ 700ms): seal `scale(1)→scale(1.12) rotate(-8deg)` 140ms, then `scale(0); opacity:0` 180ms; flap `rotateX(0→170deg)` 320ms `transform-origin:top`; letter `translateY(-14px) scaleY(.96) → 0/1` 380ms.

```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{ animation-duration:.001ms!important; animation-iteration-count:1!important;
                        transition-duration:.12s!important; }
  .daycard.flip{animation:none}
  .wall svg.thread-svg path.new{animation:none;stroke-dashoffset:0}
  .env.ready .seal{animation:none}
}
```
Under reduced motion every moment collapses to a 120ms opacity fade and the end state renders immediately. The thread must render *complete* — it carries meaning.

---

## 8. Keep / kill

### Keep (the concept is loved — none of this is the problem)
The whole curator metaphor and its Hebrew vocabulary (אוצרת · מוצג · אגף · אולם · תווית · חוט אדום · קטלוג · לכרוך). The red thread as the **single** accent. The numbered label card. The wall-text quote. Sealed envelopes and letters. The 4-tab IA and the emblem picker. No scores, no comparison, no leaderboard — ever. The A4 catalogue and "binding" as the ending. The `feTurbulence` grain SVG (warm it, keep it). The `[data-wing]` → `--wing` token architecture and `color-mix` tinting — it's the right pattern, it just needs more colours flowing through it. The dual `prefers-color-scheme` + `[data-theme]` definitions. The `.latin` / `.num` bidi isolation. Every existing `prefers-reduced-motion` guard. **Frank Ruhl Libre — in the printed catalogue only**, where a newspaper serif is genuinely the right voice.

### Kill
- The cool grey ground `#F2F3EF` and navy ink `#1A1F2B`. Both go warm.
- `--london: #8C3B2E` — it was ΔE ≈ 22 from the thread red; two things can't both be "the red one".
- The `♦` playing-card glyph and the dashed red stripe on `.daycard`.
- The airmail `border-image` stripe on `.env.ready` / `.letter`.
- **Dashed borders as the universal empty-state signal** (7 uses). Replace with: matted empty prints, pencil outlines, face-down cards, recessed worktables.
- **`filter: grayscale(1)`** on every locked/ghost thing (5 uses). Warm-fade instead.
- `repeat(3,1fr)` frames at phone width.
- `.72rem` credits, `.68rem` frame captions, `.75rem` tab labels — all below the sunlight/teen floor.
- The 82% black scrim on hero photos; text comes off the photograph entirely.
- `max-height` drawer transition → `grid-template-rows`.
- Playpen Sans Hebrew as the *primary* hand (demote to fallback). Rubik as the UI face. Bellefair as the cover face.
- `opacity:.55` / `.8` used as a state on `.hall.locked` / `.env.sealed` — states need a real token plus a text label.
- The filled red circle-check on stop rows — it's a productivity app tell.

---

## 9. Two alternates

**גלריית לילה — Night Gallery.** Dark-first, not dark-optional. Ground `#141019`, surfaces `#1E1826`, and every exhibit is *spotlit*: each `.print` carries a `radial-gradient(120% 90% at 50% -20%, rgba(255,240,215,.14), transparent 60%)` and a warm `--sh-3`, so the photographs glow out of near-blackness the way objects do in a real museum at night. Type goes higher-contrast and slightly more editorial (Suez One for titles, Noto Serif Hebrew 300–500 for wall text), the wing colours become jewel-saturated (`#5B8FD6`, `#4FBF8B`, `#E778B8`, `#F09A3C`), and the red thread becomes the only warm light in the frame. It is the most *flattering* environment for mediocre photography and the most obviously grown-up of the three — an 18-year-old would screenshot it. Rejected as the main direction for one reason: it is the wrong app for a phone held at arm's length in Provençal midday sun, and daylight is when they'll actually use it.

**ספח — Ticket Stub.** A transit-ephemera system: the whole app is made of things you keep in a pocket. Stops are perforated tickets (`repeating-radial-gradient` punch holes down one edge), the day card is a boarding pass with a tear-off stub, exhibit numbers are printed like seat allocations in Doto, wings are colour-coded like metro lines with a real line-diagram replacing the red thread on the timeline, and envelopes become par-avion telegrams. It is the most *fun* of the three, lands squarely on Pinterest's "explorer-coded" and "making pen pals" themes, and would make the printed catalogue extraordinary. Rejected because the museum metaphor and the transit metaphor fight for the same slot — you would end up deleting the curator idea the client loves — and because perforations, punches and stubs are a lot of decorative CSS to maintain across 12 components with no build step.

---

## 10. Anti-brief — what would make this fail

1. **Pink by default.** The fastest way to tell three specific girls that nobody thought about them specifically. Disney's wing is magenta because a castle at dusk is magenta, not because the audience is female. There is no pink in the chrome.
2. **Infantilising.** Rounded-everything, Fredoka, a mascot, confetti bursts, "יש!! כל הכבוד!!", bouncing emoji. **The 18-year-old is the ceiling: if she wouldn't screenshot a screen, it's wrong.** The 13-year-old is not served by making it younger; she's served by making it *hers* (her handwriting, her colour, her crooked photo inside a serious frame).
3. **Sticker soup.** The 2026 scrapbook trend is real, but it belongs to **her content, never to the chrome**. One tape per screen. One accent colour. One texture. Chrome quiet, content loud. A journaling *app* that looks like a finished journal page leaves her nothing to do.
4. **Low contrast as an aesthetic.** Cream on cream, 60%-opacity text, text over photographs, hairlines carrying meaning. They are outdoors, in daylight, walking, on a 390px screen. Every token in §4 is measured; anything below 3:1 is decorative and labelled as such; the sun theme exists precisely because this failure mode is invisible in a dark office.
5. **Trend-chasing that dates by March.** No chrome/Y2K, no holographic, no neon-on-black, no glassmorphism panels, no bento grid, no AI-gradient blobs. Everything borrowed here — grain, warm paper, white print mats, tape, folds, a stitched thread, a dot-matrix date stamp — references physical objects that are 40 to 100 years old. Those don't expire; they just come back.
6. **Gamification creep.** No streaks, no XP, no badges, no percentage complete, no "3/5". The `5/12` on a hall header is a *collection count*, not a score, and **no screen may ever show one sister's count beside another's**. This is the product's core promise; a well-meaning progress bar breaks it.
7. **Novelty display type in running text.** Karantina and the 26 Rubik novelty cuts are one-word tools. A Hebrew sentence in Rubik Doodle is unreadable, and unreadable is the most childish thing a design can be.
8. **Emoji as interface.** The emblem picker is the sanctioned place for emoji. Everywhere else they render differently on every device, break RTL line-layout, and read as a kids' app.
9. **Treating "teen girls" as one person.** 13 and 18 are five years apart, and the parents play too. The resolution is not a compromise aesthetic — it's *material seriousness plus personal warmth*: a grown-up container (paper, prints, letterpress, a real museum label) holding something unmistakably hers.
10. **Dark mode as an afterthought.** The photographs are the app. A dark theme that dims the photos or drops their white mats kills the product at exactly the hour they'll sit down to do the day's exhibit.

---

## 11. Do these three first

1. **Swap the token block** (§4.1 + §4.2 + §4.3) and the font link + five `--font-*` variables (§2). One paste each. This alone moves the app from "museum wall label" to "warm album" before a single component is touched.
2. **Add `.print` and apply it to every `<img>`** (§5.2), including the ≥900px mat hook. This is what makes 86 inconsistent Wikimedia photographs look like one object, and it's the difference the client will actually see.
3. **Rebuild the museum wall**: 2 columns at phone width, cycled aspect ratios, nails, and the sagging two-path stitched thread (§6.7). It's the screen the whole product is named after, and right now it's the weakest one.

Then: the Today hero (text off the photo), the tab bar, and the sun theme toggle.
