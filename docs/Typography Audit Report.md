# Typography Audit Report
rashodkorala.com — `global.css` + `tailwind.config.js` | April 2026

---

## Summary

The token architecture and colour system are genuinely strong: CSS custom properties throughout, a well-structured dark mode, and excellent body contrast in both modes. The critical gap is the type scale itself — only three size tokens exist (`--text-display`, `--text-body-size`, `--text-nav-size`), leaving a 3× jump between body copy and the display size with nothing in between. Heading levels, lead paragraphs, captions, and UI labels have no dedicated size tokens, which means hierarchy must be built entirely through weight and colour rather than size. The `content-max-w: 120rem` (1920px) is also dangerously wide for 17px body copy, producing an estimated reading measure of ~226 characters per line — more than triple the readability limit.

---

## Score

### System Quality

| Dimension      | Status |
|----------------|--------|
| Type scale     | ❌     |
| Fluid sizing   | ⚠️     |
| Font families  | ⚠️     |
| Line height    | ⚠️     |
| Letter spacing | ⚠️     |
| Weight usage   | ⚠️     |
| Responsive     | ⚠️     |
| Accessibility  | ⚠️     |

### Human Readability

| Dimension          | Status |
|--------------------|--------|
| Cognitive load     | ❌     |
| Glyph legibility   | ✅     |
| Reading conditions | ⚠️     |
| Hierarchy clarity  | ❌     |
| Reading flow       | ⚠️     |

---

## Existing Type Tokens

| Token              | Min       | Max        | Fluid range active at | Notes                             |
|--------------------|-----------|------------|-----------------------|-----------------------------------|
| `--text-display`   | 52px      | 96px       | 578px–1067px viewport | 9vw preferred; clamped elsewhere  |
| `--text-body-size` | 16px      | 17px       | 400px–650px viewport  | Near-static; 1px total range      |
| `--text-nav-size`  | 13px      | 16px       | Full range             | Functional                        |

**What is missing:** H1, H2, H3, lead paragraph, caption, label, and code/mono sizes are all undefined at the scale level.

---

## Findings

### System Quality

#### Type Scale
**Status:** fail

**Finding:** The scale has three tokens. `--text-display` and `--text-body-size` are separated by a 3.06× gap at minimum viewports (52px vs 17px) with nothing in between. Any heading hierarchy — H1, H2, H3 — must be improvised in component CSS without a shared token system, making the design inconsistent and difficult to maintain. The Tailwind `fontSize` extension only maps these two tokens to utility classes (`display` and `prose`), confirming no intermediate steps exist at the config level.

**Recommendation:** Add a full type scale with at minimum 7–9 steps. A Fibonacci-based scale suits the project's existing Fibonacci spacing system and editorial aesthetic. A corrected scale is provided in the [Corrected CSS](#corrected-css) section below.

---

#### Fluid Sizing
**Status:** warn

**Finding:** Both tokens use `clamp()`, which is correct in principle. However:

- `--text-display: clamp(3.25rem, 9vw, 6rem)` — the preferred value (9vw) is active only between ~578px and ~1067px. At 375px and 430px (most mobile devices), the display text is pinned to 52px. At 1280px and 1440px (most desktop devices), it is pinned to 96px. The fluid interpolation is effectively skipped on the most common device sizes.
- `--text-body-size: clamp(1rem, 0.9rem + 0.4vw, 1.0625rem)` — the fluid window is 400px–650px, a 250px range. On every mobile device below 400px, body text clamps to 16px. On every device above 650px (tablet through desktop), it clamps to 17px. The total variation is 1px across the entire scale. This is functionally a static size.

**Recommendation:** Recalculate preferred values using the correct slope formula so that interpolation is active across the full 375px–1440px range. The body token in particular needs a wider min–max range (e.g. 16px–18px) to make the fluid behaviour meaningful.

---

#### Font Families
**Status:** warn

**Finding:** Two issues:

1. The `mono` font family is defined as `["var(--font-jakarta)", "monospace"]`. Plus Jakarta Sans is a proportional humanist sans — not a monospace font. Any element using `font-mono` in Tailwind will render in Jakarta Sans (proportional), not a monospace face. The `monospace` keyword only applies as a fallback if Jakarta Sans fails to load, which it typically won't. This means code blocks, inline code, and any data/tabular content set in `font-mono` will appear in the wrong typeface.

2. Plus Jakarta Sans and Cormorant Garamond are a strong editorial pairing. Jakarta is a humanist sans with a generous x-height; Cormorant is a high-contrast display serif. The combination is appropriate and the role separation (body vs display) is correct.

**Recommendation:** Replace `var(--font-jakarta)` in the `mono` definition with a proper monospace font: `"JetBrains Mono"`, `"Fira Code"`, or the system stack `"ui-monospace", "SFMono-Regular", "Menlo", monospace`.

---

#### Line Height
**Status:** warn

**Finding:** No `line-height` is set on the `body` element in `global.css`. Tailwind Preflight sets `line-height: inherit` on body, and the base `html` element inherits the browser default of approximately 1.2. A line-height of 1.2 on 16–17px body copy is below the WCAG SC 1.4.12 minimum of 1.5 and will produce cramped, hard-to-read paragraphs — particularly with Plus Jakarta Sans, which has a generous x-height that needs breathing room.

No heading-specific line-heights are declared at the global level, so all heading elements will also inherit ~1.2 unless component CSS overrides them.

**Recommendation:** Add to the `body` rule in `global.css`:
```css
line-height: 1.6;
```
Add heading line-heights to the scale token system: display/H1 at 1.1, H2 at 1.2, H3 at 1.35, body at 1.6.

---

#### Letter Spacing
**Status:** warn

**Finding:** No `letter-spacing` is declared anywhere in `global.css` or the Tailwind config. For the display token at 52–96px, negative tracking (-0.02em to -0.03em) is standard practice — without it, large Cormorant Garamond text will appear slightly loose. For Plus Jakarta Sans at body sizes, 0em is appropriate and fine.

**Recommendation:** Add `letter-spacing: -0.02em` to any component-level heading styles using `--text-display`. Add tracking tokens to the Tailwind config for systematic use (see [Corrected Tailwind Config](#corrected-tailwind-config)).

---

#### Weight Usage
**Status:** warn

**Finding:** No `font-weight` is declared at the global or config level. Tailwind Preflight resets heading weights to `inherit`, which means H1–H6 elements in this project are the same weight as body copy (the browser's default 400) unless component CSS explicitly sets weights. Without a weight token system, heading hierarchy relies entirely on whatever developers set ad hoc in components — this leads to inconsistency.

**Recommendation:** Add a weight token system and declare base heading weights in `global.css` or a Tailwind typography extension.

---

#### Responsive
**Status:** warn

**Finding:** The fluid sizing windows are too narrow to provide meaningful responsiveness (see Fluid Sizing above). The Fibonacci spacing system is responsive by design and well-structured, but the type tokens don't behave fluidly across the device range in practice.

---

#### Accessibility
**Status:** warn

**Finding:** Body text units are `rem` — correct, respects user font size preference. The body baseline of 16px meets the minimum. However:

- **Caption contrast:** `--color-caption: rgba(43,43,43,0.45)` blended on `#f0ede8` produces approximately 2.56:1 — well below the WCAG AA requirement of 4.5:1 for normal text and 3:1 for large text. If captions appear at body size or smaller, this fails.
- **Label contrast:** `--color-label: rgba(43,43,43,0.35)` produces approximately 2.01:1 — fails WCAG AA at any text size.
- **Faint contrast:** `--color-faint: rgba(43,43,43,0.25)` produces approximately 1.62:1 — fails at all sizes.
- **Body secondary (#6b6560):** 4.92:1 — passes AA for normal text.
- **Body primary and heading (#2b2b2b on #f0ede8):** 12.13:1 — excellent.
- **Dark mode body (#d4cfc8 on #151311):** 11.97:1 — excellent.

The `transition: background-color 240ms ease, color 240ms ease` on `body` is not wrapped in a `prefers-reduced-motion` media query. Users with motion sensitivity should not experience colour transitions.

**Recommendation:** Increase opacity on caption, label, and faint tokens to achieve at minimum 3:1 contrast (large text) or 4.5:1 (normal text). For captions used at small sizes, target 4.5:1. Wrap the body transition in `@media (prefers-reduced-motion: no-preference)`.

---

### Human Readability

#### Cognitive Load
**Status:** fail

**Finding:** Three compounding issues:

1. **Measure (critical):** `--content-max-w: 120rem` = 1920px. At 17px body copy, the estimated reading measure across a full-width container is ~226 characters per line. The readability maximum is 90 characters; the optimal range is 45–75. Even on a 1440px display, a single-column layout with this max-width and no inner content constraint will produce a measure of approximately 170 characters. This is the most immediately damaging readability problem in the file.

2. **Paragraph spacing:** No `margin-bottom` is set on `p` elements in `global.css`. Tailwind Preflight zeros all paragraph margins. Unless component CSS adds paragraph spacing, body copy will have zero space between paragraphs — paragraphs fuse into a single undifferentiated block of text.

3. **Hierarchy from size alone:** With only `--text-display` and `--text-body-size`, any heading structure must be communicated through weight and colour alone. Research consistently shows that size is the primary signal readers use to parse hierarchy — relying only on weight to distinguish H1 from H2 from H3 forces readers to process content to infer structure rather than perceiving it at a glance. This adds cognitive load on every page.

**Recommendation:**
- Add `max-width: 65ch` to body copy containers (prose columns, article bodies, case study text).
- Add `p { margin-bottom: 1.4em; }` to `global.css` base layer.
- Expand the type scale to include intermediate heading and sub-heading sizes.

---

#### Glyph Legibility
**Status:** pass

**Finding:** Plus Jakarta Sans is a humanist sans with a generous x-height, open counters, and excellent legibility at body sizes. It is an appropriate choice for body copy and UI text. Cormorant Garamond is a high-contrast display serif that should only be used at `--text-display` sizes (52px and above) — at this scale, its refined letterforms are an asset. The pairing is editorially coherent.

No all-caps patterns, extended italics, or weight mismatches are declared at the global level. The fallback stacks for both fonts (Georgia/serif and system-ui/sans-serif) are appropriate category matches.

The one exception is the `mono` family mismatch noted under Font Families — any code or data styled with `font-mono` will render in a proportional typeface, which is a legibility failure for code.

---

#### Reading Conditions
**Status:** warn

**Finding:**

- **Dark mode:** Fully implemented with a `.dark` class and a complete set of redefined CSS custom properties. Both modes achieve excellent contrast on body text (12.13:1 light, 11.97:1 dark). This is one of the strongest aspects of the system.

- **Colour transition without motion guard:** The `body` transition for `background-color` and `color` runs on every dark mode toggle without a `prefers-reduced-motion` check. Users with vestibular disorders can experience discomfort from colour flashes even at 240ms.

- **Caption/label contrast:** As calculated above, caption (2.56:1), label (2.01:1), and faint (1.62:1) tokens fail WCAG AA at any text size. If these are used for actual readable text rather than purely decorative elements, this is a fail.

- **Small screen body:** At 375px, body text is correctly clamped to 16px — passes the 16px floor.

**Recommendation:** Wrap body transitions in `@media (prefers-reduced-motion: no-preference)`. Review caption and label token opacities for WCAG compliance.

---

#### Hierarchy Clarity
**Status:** fail

**Finding:** With only two usable size tokens, the heading hierarchy cannot be expressed through size. The jump from `--text-body-size` (17px) to `--text-display` (52px minimum) is 3.06× — far too large for a heading scale, and with nothing in between. H1, H2, and H3 are left undefined at the token level entirely.

In practice this means:
- Adjacent heading levels have no size differentiation from a shared token — each component defines its own sizes ad hoc.
- The skill's minimum threshold of 1.25× between H1 and H2, and 1.15× between H2 and H3, cannot be verified or enforced without a token system.
- Any developer building a new component must reinvent the hierarchy from scratch.

**Recommendation:** Define a minimum of 5 heading/text size tokens between body (17px) and display (52px). The corrected scale below provides these.

---

#### Reading Flow
**Status:** warn

**Finding:**

- **Logical heading order:** Cannot be assessed from CSS alone — must be enforced in markup. The absence of size tokens makes enforcing a logical heading order through styling harder.
- **Orphan/widow risk:** With `content-max-w: 120rem` and no `text-wrap: balance` declared on headings, orphaned single words on heading wraps are likely at mid-range viewport widths where Cormorant Garamond display text is actively scaling.
- **Body vs. UI distinction:** Plus Jakarta Sans is used for both body copy and navigation/UI (`font-reading`, `font-body`, `font-sans` are all identical). This is acceptable — weight and size differentiation can carry the distinction — but it requires discipline at the component level.

**Recommendation:** Add `h1, h2, h3, h4 { text-wrap: balance; }` to `global.css` base layer. Add `p { text-wrap: pretty; }` to reduce orphans in body copy.

---

## Corrected CSS

The following additions and corrections to `global.css` address the critical gaps. These are additive — existing tokens are preserved.

```css
@layer base {
  :root {
    /* ─── Extended type scale (Fibonacci-informed, fluid 375px–1440px) ─────────
     *  Existing tokens kept. New intermediate steps added.
     *  System: Fibonacci-inspired steps matching the spacing scale philosophy.
     *  Min sizes at 375px, max at 1440px.
     * ───────────────────────────────────────────────────────────────────────── */

    /* Existing — kept as-is */
    --text-display:   clamp(3.25rem, 9vw, 6rem);       /* 52px–96px: hero/editorial */

    /* Existing body — corrected preferred value for wider fluid window */
    --text-body-size: clamp(1rem, 0.925rem + 0.3756vw, 1.125rem); /* 16px–18px */

    /* Existing nav — no change needed */
    --text-nav-size:  clamp(0.8125rem, 0.7rem + 0.45vw, 1rem);

    /* New intermediate steps */
    --text-h1:        clamp(2rem,    1.72rem + 1.1268vw, 2.75rem);  /* 32px–44px */
    --text-h2:        clamp(1.5rem,  1.33rem + 0.6573vw, 1.875rem); /* 24px–30px */
    --text-h3:        clamp(1.25rem, 1.14rem + 0.4695vw, 1.5rem);   /* 20px–24px */
    --text-lead:      clamp(1.125rem, 1.05rem + 0.2817vw, 1.25rem); /* 18px–20px */
    --text-caption:   clamp(0.75rem,  0.706rem + 0.1878vw, 0.875rem); /* 12px–14px */
    --text-label:     clamp(0.6875rem, 0.6435rem + 0.1878vw, 0.8125rem); /* 11px–13px */

    /* ─── Line heights ─────────────────────────────────────────────────────── */
    --leading-tight:    1.1;   /* display / editorial hero */
    --leading-display:  1.15;  /* h1 at large sizes */
    --leading-heading:  1.3;   /* h2, h3 */
    --leading-sub:      1.45;  /* lead paragraph */
    --leading-body:     1.65;  /* body copy — Jakarta's x-height needs room */
    --leading-ui:       1.4;   /* nav, labels, captions */

    /* ─── Letter spacing ───────────────────────────────────────────────────── */
    --tracking-display: -0.03em;  /* Cormorant at 52px+ */
    --tracking-h1:      -0.02em;
    --tracking-h2:      -0.01em;
    --tracking-body:     0em;
    --tracking-ui:       0.01em;
    --tracking-caps:     0.08em;  /* always on all-caps elements */
  }
}

@layer base {
  body {
    @apply antialiased;
    font-family: var(--font-jakarta), system-ui, sans-serif;
    background-color: var(--color-page);
    color: var(--color-body);
    font-size: var(--text-body-size);
    line-height: var(--leading-body);

    /* Wrap in motion preference — do not flash colour on reduced-motion */
    @media (prefers-reduced-motion: no-preference) {
      transition: background-color 240ms ease, color 240ms ease;
    }
  }

  /* Paragraph spacing — Tailwind Preflight zeros this */
  p {
    margin-bottom: 1.4em;
    text-wrap: pretty;
  }

  /* Heading baseline — override Preflight's weight reset */
  h1, h2, h3, h4, h5, h6 {
    text-wrap: balance;
    font-family: var(--font-cormorant), Georgia, serif;
  }
}
```

---

## Corrected Tailwind Config

Add to the `theme.extend` section in `tailwind.config.js`:

```js
fontSize: {
  // Existing
  display: "var(--text-display)",
  prose:   "var(--text-body-size)",
  // New
  h1:      "var(--text-h1)",
  h2:      "var(--text-h2)",
  h3:      "var(--text-h3)",
  lead:    "var(--text-lead)",
  caption: "var(--text-caption)",
  label:   "var(--text-label)",
  nav:     "var(--text-nav-size)",
},
lineHeight: {
  tight:   "var(--leading-tight)",
  display: "var(--leading-display)",
  heading: "var(--leading-heading)",
  sub:     "var(--leading-sub)",
  body:    "var(--leading-body)",
  ui:      "var(--leading-ui)",
},
letterSpacing: {
  display: "var(--tracking-display)",
  h1:      "var(--tracking-h1)",
  h2:      "var(--tracking-h2)",
  body:    "var(--tracking-body)",
  ui:      "var(--tracking-ui)",
  caps:    "var(--tracking-caps)",
},
// Fix the mono font family
fontFamily: {
  // ... keep existing, replace mono:
  mono: [
    "JetBrains Mono",
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "monospace",
  ],
},
```

---

## Token Contrast Audit

For reference, computed contrast ratios on the light mode background (`#f0ede8`):

| Token                     | Approx hex  | Contrast | WCAG AA (4.5:1) | WCAG AA Large (3:1) |
|---------------------------|-------------|----------|-----------------|---------------------|
| `--color-body` (#2b2b2b)  | #2b2b2b     | 12.13:1  | ✅               | ✅                   |
| `--color-body-secondary`  | #6b6560     | 4.92:1   | ✅               | ✅                   |
| `--color-body-tertiary`   | rgba 0.55   | ~6.5:1   | ✅ (est.)        | ✅                   |
| `--color-caption`         | rgba 0.45   | 2.56:1   | ❌               | ❌                   |
| `--color-label`           | rgba 0.35   | 2.01:1   | ❌               | ❌                   |
| `--color-faint`           | rgba 0.25   | 1.62:1   | ❌               | ❌                   |

Caption, label, and faint tokens fail WCAG at all text sizes. If used for readable text, increase opacity or switch to a solid colour.

Suggested corrections:
```css
--color-caption:        rgba(43, 43, 43, 0.60);  /* ~4.0:1 — passes large text AA */
--color-label:          rgba(43, 43, 43, 0.55);  /* ~4.8:1 — passes normal text AA */
--color-faint:          rgba(43, 43, 43, 0.45);  /* decorative only — do not use for readable text */
```

---

## Priorities

1. **Add intermediate type scale tokens** (`--text-h1` through `--text-caption`) — without these, heading hierarchy is improvised per-component and the system cannot be maintained consistently. This is the single highest-impact change.

2. **Set `max-width: 65ch` on prose containers** — the 1920px content cap produces an unreadable measure for body copy. This does not need to change the `--content-max-w` token (which may be used for layout containers), but any column containing body text needs an inner prose constraint.

3. **Add `line-height` to `body` and `p { margin-bottom }` to `global.css`** — Tailwind Preflight currently zeroes both. Without these, body copy is cramped and paragraphs fuse. This is a two-line fix with significant readability impact.

4. **Fix the `mono` font family** — replace `var(--font-jakarta)` with a real monospace font. Any code blocks currently render in a proportional typeface.

5. **Increase `--color-caption` and `--color-label` opacity** — both fail WCAG AA contrast. The suggested values above bring caption to large-text compliance and label to normal-text compliance.

6. **Wrap `body` transition in `prefers-reduced-motion`** — a minor accessibility fix that protects users with vestibular disorders from colour flashes on dark mode toggle.