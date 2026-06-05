---
name: html-to-image CSS limitations
description: CSS properties that silently break html-to-image PNG export, and safe alternatives.
---

## Rule
Never use `backdropFilter` (or `backdrop-filter`) in any element captured by `html-to-image`. It silently fails — the element renders as fully transparent, producing a blank or near-blank PNG.

**Why:** html-to-image works by serializing DOM to SVG and drawing onto a Canvas. `backdropFilter` requires compositing against the pixels behind the element, which the Canvas capture pipeline cannot reproduce. No error is thrown; the element simply disappears.

## How to apply
- Replace any `backdropFilter: "blur(...)"` / `backdropFilter: "brightness(...)"` with a solid semi-transparent background color (e.g. `background: "rgba(0,0,0,0.55)"`).
- All primary card content (flags, names, score, "predicted by") must be in the **normal document flex flow**, not exclusively `position: absolute`. Absolute positioning is safe only for purely decorative elements (glows, pitch arcs, color blocks that contain no text).
- The `toPng` call should target the inner 1080×1080 card div directly (via `cardRef`), not the scaled wrapper.

## Project context (PredictionCard / goalcard artifact)
- Card preview is a 1080×1080 div scaled via `transform: scale(0.3333)` inside a 360×360 wrapper.
- `cardRef` is attached to the inner 1080×1080 div.
- `toPng` options: `{ pixelRatio: 3, width: 1080, height: 1080, cacheBust: true }`.
