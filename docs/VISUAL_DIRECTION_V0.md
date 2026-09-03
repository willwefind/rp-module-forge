# Visual Direction V0 · Color Research Note

Status: **design research / not a normative engineering spec**  
Last updated: 2026-09-03

This note records the first visual direction for RP Module Forge after the V0.1 Core migration. It intentionally does **not** change the current Web App styling yet.

The Core product should remain visually portable across world packs. Ancient China may contribute presentation accents and themed surfaces, but it must not turn the entire product shell into one permanent “ancient parchment” skin.

## 1. Reference workflow

Use palette sites for different jobs instead of copying a four-color card directly into CSS.

### Color Hunt — mood discovery

https://colorhunt.co/

Useful for quickly browsing hand-picked combinations and tags such as Dark, Vintage, Gold, Earth, Night, Coffee, Cream, and Warm.

Use it to answer:

- Does the palette feel archival, theatrical, technical, soft, severe, or playful?
- Which hue relationships are worth exploring?
- Which combinations should be rejected before implementation?

Do **not** treat a Color Hunt card as a finished UI token system.

### Happy Hues — colors in context

https://www.happyhues.co/

Happy Hues is useful because it shows palette colors assigned to actual design roles such as background, headline, sub-headline, card background, buttons, illustration strokes, and highlights.

Use it to answer:

- Which color deserves large surface area?
- Which color survives as body text?
- Which saturated color should remain a small accent?
- Does the palette still work after leaving the swatch card?

### Realtime Colors — product-role simulation

https://www.realtimecolors.com/

Realtime Colors explicitly separates text, background, primary, secondary, and accent roles and previews them on a real website layout.

Use it before accepting a palette for implementation.

## 2. Direction: modern archive, not “brown ancient website”

The current preferred direction is:

**ink-black product structure + warm paper reading surfaces + restrained cinnabar action color + quiet tea-brown support + sparse brass accent**

Ancient China should feel like opening a well-maintained night archive: lacquer, paper, seals, marginalia, metal fittings, and precise records.

Avoid:

- full-screen yellow-brown parchment textures;
- fake calligraphy as the main UI font;
- gold text everywhere;
- low-contrast “aged paper” body copy;
- using red to decorate every heading;
- making the Core shell impossible to reskin for another world pack.

## 3. Candidate palette A · 夜档 / Night Archive

| Role | Token idea | Hex | Intended use |
| --- | --- | --- | --- |
| Text / deep ink | `ink-950` | `#171311` | primary text, dark shell, strong borders |
| Paper | `paper-050` | `#F7F0E4` | main reading surface, cards, long-form content |
| Cinnabar | `cinnabar-600` | `#8E2E24` | primary actions, selected states, seals, critical emphasis |
| Tea brown | `tea-600` | `#5E5147` | secondary controls, quiet structure, metadata |
| Brass | `brass-500` | `#B18A4B` | sparse highlights, active markers, decorative hardware cues |

Initial contrast checks using the WCAG relative-luminance formula:

- `#171311` on `#F7F0E4` ≈ **16.30:1**;
- white on `#8E2E24` ≈ **8.18:1**;
- `#171311` on `#B18A4B` ≈ **5.81:1**;
- `#F7F0E4` on `#8E2E24` ≈ **7.22:1**.

These combinations clear WCAG AA contrast for normal text, but component-level states still require testing in the actual UI.

## 4. Token ownership

The Core should own semantic roles, for example:

```text
--surface-app
--surface-panel
--surface-raised
--text-primary
--text-muted
--border-subtle
--action-primary
--action-secondary
--accent-pack
--status-warning
--status-danger
--status-success
```

A world pack may provide values for pack-facing tokens such as:

```text
--accent-pack
--accent-pack-muted
--surface-pack-lore
--border-pack-lore
```

It should **not** redefine evidence reliability, warning, error, or accessibility semantics merely for atmosphere.

## 5. Ancient China visual motifs worth exploring later

Use as subtle structure, not as decorative cosplay:

- seal / cinnabar marks for confirmed selection or signed-off state;
- narrow brass rules or hardware-like separators;
- paper-white reading panels inside a darker application frame;
- ledger-like alignment for evidence and manifest views;
- marginal notes for maintainer / Traveler Forum annotations;
- restrained lattice or register geometry in empty states and section dividers;
- different surface treatment for raw forum threads versus curated runtime notes.

## 6. What happens next

Before changing production CSS:

1. reproduce Candidate A in Realtime Colors or an equivalent contextual preview;
2. compare at least two alternate palettes rather than polishing the first idea;
3. test core surfaces separately from Ancient China pack surfaces;
4. check focus, hover, disabled, warning, error, selected, and evidence-state contrast;
5. only then convert the chosen direction into design tokens.

The existing Concept V0 HTML remains historical interaction evidence, not a color specification.
