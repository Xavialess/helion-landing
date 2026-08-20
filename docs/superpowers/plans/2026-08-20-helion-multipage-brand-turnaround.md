# Helion Multi-Page Brand Turnaround Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single-file Helion landing page into a 4-page static site (abstract home + 3 scrollytelling portfolio routes) with a dark-first, pill-button, kinetic-stat, original-SVG-illustration visual system.

**Architecture:** Plain static HTML/CSS/JS, no build step, no framework. Shared design tokens/base styles/JS utilities live in `assets/`, consumed identically by all 4 HTML pages. Self-hosted GSAP + ScrollTrigger (downloaded once into `assets/vendor/`) drives the pinned scrollytelling sequence on the Sensórica page only; every other animation is plain CSS keyframes + IntersectionObserver, matching the existing codebase's zero-dependency style.

**Tech Stack:** HTML5, vanilla CSS (custom properties), vanilla ES modules, GSAP 3 + ScrollTrigger (self-hosted, script-tag only — no npm), Node's built-in `node:test` for the one piece of pure logic worth unit-testing (kinetic counter math). No package.json, no bundler.

## Global Constraints

- No fabricated client logos, testimonials, "trusted by N" claims, or invented performance stats (e.g. "40% faster"). Stats are either true-by-definition (spec: "0 plantillas genéricas", "100% código tuyo") or real numbers the user supplies later.
- No stock icons, no AI-generated images, no photography (none exists yet) — all illustrations are original hand-built inline SVG in the site's own line-art vocabulary (circles = nodes, thin lines = connections, ellipses = orbits).
- Keep all 3 existing font families (Space Grotesk, Space Mono, Archivo 900) exactly as-is; add Fraunces (italic) only for accent words inside headlines.
- Keep existing light-section tokens (`--cream: #F2EDE3`, `--ink: #111111`, `--red: #E8560C`) unchanged — dark sections are additive, not a recolor of the whole site.
- No build tooling (no Astro/Vite/webpack/npm). Nav and footer markup is intentionally duplicated across the 4 HTML files rather than templated — see spec's "Multi-page without a build step" section.
- Every animation (counters, illustrations, scrollytelling pin) must degrade cleanly under `prefers-reduced-motion: reduce` — counters resolve instantly, illustrations stop animating, ScrollTrigger pinning is disabled via `gsap.matchMedia()`.
- Reference spec: `docs/superpowers/specs/2026-08-20-helion-multipage-brand-turnaround-design.md`

---

## Task 1: Design tokens

**Files:**
- Create: `assets/css/tokens.css`
- Modify: none yet (wired into pages in later tasks)

**Interfaces:**
- Produces: CSS custom properties on `:root` — `--cream`, `--ink`, `--ink-dark`, `--paper`, `--red`, `--red-glow`, `--gray`, `--gray-on-dark`, `--fh`, `--fm`, `--fa`, `--fs`, `--radius-pill`, `--radius-sm`, `--dur-fast`, `--dur-normal`, `--ease-out-expo`, `--space-section`. All later tasks consume these by name — do not rename any of them.

- [ ] **Step 1: Create `assets/css/tokens.css`**

```css
:root {
  --cream: #F2EDE3;
  --ink: #111111;
  --ink-dark: #0C0D0B;
  --paper: #F5F3EC;
  --red: #E8560C;
  --red-glow: #FF7A40;
  --gray: #767676;
  --gray-on-dark: rgba(245, 243, 236, .55);

  --fh: 'Space Grotesk', sans-serif;
  --fm: 'Space Mono', monospace;
  --fa: 'Archivo', sans-serif;
  --fs: 'Fraunces', serif;

  --radius-pill: 999px;
  --radius-sm: 8px;

  --dur-fast: 150ms;
  --dur-normal: 300ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  --space-section: clamp(4rem, 3rem + 5vw, 8rem);
}
```

- [ ] **Step 2: Verify the file is syntactically valid CSS**

Run: `node -e "require('fs').readFileSync('assets/css/tokens.css','utf8').match(/--[a-z-]+:/g).length && console.log('tokens ok')"`
Expected: `tokens ok`

- [ ] **Step 3: Commit**

```bash
git add assets/css/tokens.css
git commit -m "feat: add shared design tokens for brand turnaround"
```

---

## Task 2: Base shared styles (reset, buttons, nav, footer, ticker, reveal, accent type)

**Files:**
- Create: `assets/css/base.css`

**Interfaces:**
- Consumes: tokens from Task 1 (`--ink-dark`, `--paper`, `--red`, `--red-glow`, `--radius-pill`, etc.)
- Produces: reusable classes every page will use — `.btn-pill`, `.btn-pill--solid`, `.btn-pill--outline`, `.eyebrow`, `.accent`, `.rv`/`.rv.in` (reveal-on-scroll, same contract as the existing site: opacity 0 → 1, translateY(24px) → 0), `.sidenav`, `.mobile-nav`, `footer`, `.ticker`/`.ticker-track`/`.t-i`/`.t-sep`. Later page tasks rely on these exact class names.

- [ ] **Step 1: Create `assets/css/base.css`**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--cream);
  color: var(--ink);
  font-family: var(--fh);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

:focus-visible { outline: 2px solid var(--red); outline-offset: 3px; }

a { color: inherit; }

/* ── EYEBROW / ACCENT TYPE ── */
.eyebrow {
  font-family: var(--fm); font-size: 10px; font-weight: 700;
  letter-spacing: .12em; text-transform: uppercase;
  display: flex; align-items: center; gap: 8px;
}
.eyebrow::before { content: ''; width: 16px; height: 1.5px; background: currentColor; }

.accent {
  font-family: var(--fs); font-style: italic; font-weight: 400;
  color: var(--red);
}
.on-dark .accent { color: var(--red-glow); }

/* ── PILL BUTTONS ── */
.btn-pill {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 28px; border-radius: var(--radius-pill);
  font-family: var(--fm); font-size: 12px; font-weight: 700;
  letter-spacing: .06em; text-transform: uppercase;
  text-decoration: none; border: 1.5px solid transparent;
  transition: transform var(--dur-fast) var(--ease-out-expo),
              box-shadow var(--dur-fast) var(--ease-out-expo),
              background var(--dur-fast), color var(--dur-fast);
}
.btn-pill:hover { transform: scale(1.02); }

.btn-pill--solid { background: var(--red); color: var(--paper); }
.btn-pill--solid:hover { box-shadow: 0 0 24px rgba(232, 86, 12, .45); }
.on-dark .btn-pill--solid { background: var(--red-glow); color: var(--ink-dark); }
.on-dark .btn-pill--solid:hover { box-shadow: 0 0 24px rgba(255, 122, 64, .4); }

.btn-pill--outline { border-color: var(--ink); color: var(--ink); }
.btn-pill--outline:hover { background: var(--ink); color: var(--cream); }
.on-dark .btn-pill--outline { border-color: rgba(245, 243, 236, .35); color: var(--paper); }
.on-dark .btn-pill--outline:hover { background: var(--paper); color: var(--ink-dark); }

/* ── REVEAL ON SCROLL ── */
.rv { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
.rv.in { opacity: 1; transform: none; }
.d1 { transition-delay: .1s } .d2 { transition-delay: .2s } .d3 { transition-delay: .3s }

/* ── SIDE NAV (dark) ── */
.sidenav {
  position: fixed; top: 0; left: 0; bottom: 0; width: 200px;
  border-right: 1px solid rgba(245, 243, 236, .1);
  display: flex; flex-direction: column;
  padding: 32px 24px;
  background: var(--ink-dark); color: var(--paper);
  z-index: 200;
}
.logo-link {
  display: flex; align-items: center; gap: 9px;
  text-decoration: none; color: var(--paper);
  margin-bottom: 56px; line-height: 1;
}
.logo-mark { width: 32px; height: 32px; flex-shrink: 0; display: block; }
.logo-word { font-family: var(--fa); font-weight: 900; font-size: 17px; letter-spacing: -0.01em; color: currentColor; }
.side-links { list-style: none; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.side-links a {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--fm); font-size: 11px; letter-spacing: .06em;
  text-transform: uppercase; color: var(--gray-on-dark);
  text-decoration: none; padding: 7px 0;
  border-bottom: 1px solid transparent;
  transition: color var(--dur-fast), border-color var(--dur-fast);
}
.side-links a:hover, .side-links a[aria-current="page"] { color: var(--paper); border-color: var(--paper); }
.side-links a .n { color: var(--red-glow); font-size: 9px; }

main { margin-left: 200px; }

/* ── MOBILE NAV ── */
.mobile-nav { display: none; }
@media (max-width: 900px) {
  .sidenav { display: none; }
  main { margin-left: 0; }
  .mobile-nav {
    display: flex !important;
    position: sticky; top: 0; z-index: 200;
    border-bottom: 1px solid rgba(245, 243, 236, .1);
    background: var(--ink-dark); color: var(--paper);
    padding: 16px 24px; justify-content: space-between; align-items: center;
  }
}

/* ── TICKER (cream) ── */
.ticker { border-bottom: 1px solid rgba(17, 17, 17, .12); padding: 13px 0; overflow: hidden; background: var(--cream); }
.ticker-track { display: flex; width: max-content; animation: ticker 28s linear infinite; }
.ticker-track:hover { animation-play-state: paused; }
.t-i {
  display: flex; align-items: center; gap: 20px; padding: 0 20px;
  font-family: var(--fm); font-size: 10px; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase;
  color: var(--ink); white-space: nowrap;
}
.t-sep { color: var(--red); }
@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }

/* ── FOOTER (dark) ── */
footer { background: var(--ink-dark); color: var(--paper); border-top: 1px solid rgba(245, 243, 236, .1); padding: 48px 56px 32px; }
.ft-row { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; margin-bottom: 40px; }
.ft-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; color: var(--paper); margin-bottom: 14px; line-height: 1; }
.ft-logo .logo-mark { width: 30px; height: 30px; }
.ft-logo .logo-word { font-size: 19px; }
.ft-brand p { font-size: 13px; color: var(--gray-on-dark); line-height: 1.7; max-width: 280px; }
.ft-col h5 { font-family: var(--fm); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(245, 243, 236, .4); margin-bottom: 20px; }
.ft-col ul { list-style: none; display: flex; flex-direction: column; gap: 11px; }
.ft-col a { font-size: 13px; color: var(--gray-on-dark); text-decoration: none; transition: color var(--dur-fast); }
.ft-col a:hover { color: var(--paper); }
.ft-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid rgba(245, 243, 236, .1); font-family: var(--fm); font-size: 10px; letter-spacing: .05em; color: rgba(245, 243, 236, .3); text-transform: uppercase; }

@media (max-width: 900px) {
  .ft-row { grid-template-columns: 1fr; }
  footer { padding: 48px 24px 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none; }
  .rv { transition: none; opacity: 1; transform: none; }
}
```

- [ ] **Step 2: Verify the file parses (basic brace-balance check)**

Run: `node -e "const c=require('fs').readFileSync('assets/css/base.css','utf8'); const o=(c.match(/{/g)||[]).length, cl=(c.match(/}/g)||[]).length; if(o!==cl) throw new Error('brace mismatch '+o+' vs '+cl); console.log('base.css ok')"`
Expected: `base.css ok`

- [ ] **Step 3: Commit**

```bash
git add assets/css/base.css
git commit -m "feat: add dark-first base styles, pill buttons, nav/footer/ticker restyle"
```

---

## Task 3: Kinetic counter — pure math + DOM wiring, with unit test

**Files:**
- Create: `assets/js/counter-math.mjs`
- Create: `test/counter-math.test.mjs`
- Create: `assets/js/main.js`

**Interfaces:**
- Produces (`counter-math.mjs`): `export function easeOutExpo(t)` (t in [0,1], returns eased [0,1]); `export function counterValueAt(elapsedMs, durationMs, target)` → number, the displayed value at a given elapsed time (uses `easeOutExpo`, clamps to `target` once `elapsedMs >= durationMs`).
- Produces (`main.js`): `export function initRevealOnScroll()`, `export function initKineticCounters()` — both called from each page's bootstrap script (wired in Task 8). `initKineticCounters` looks for `[data-counter-target]` elements, reads the target from that attribute, and animates the element's `textContent` using `counterValueAt` inside a `requestAnimationFrame` loop, gated by `IntersectionObserver` (fires once) and skipped (jumps straight to target) when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true.

- [ ] **Step 1: Write the failing test**

Create `test/counter-math.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { easeOutExpo, counterValueAt } from '../assets/js/counter-math.mjs';

test('easeOutExpo returns 0 at t=0 and 1 at t=1', () => {
  assert.equal(easeOutExpo(0), 0);
  assert.equal(easeOutExpo(1), 1);
});

test('easeOutExpo is monotonically increasing', () => {
  let prev = -Infinity;
  for (let t = 0; t <= 1; t += 0.1) {
    const v = easeOutExpo(t);
    assert.ok(v >= prev, `value at t=${t} (${v}) should be >= previous (${prev})`);
    prev = v;
  }
});

test('counterValueAt returns 0 at elapsed=0', () => {
  assert.equal(counterValueAt(0, 1000, 100), 0);
});

test('counterValueAt returns target once elapsed >= duration', () => {
  assert.equal(counterValueAt(1000, 1000, 100), 100);
  assert.equal(counterValueAt(5000, 1000, 100), 100);
});

test('counterValueAt is between 0 and target mid-animation', () => {
  const v = counterValueAt(500, 1000, 100);
  assert.ok(v > 0 && v < 100, `expected 0 < v < 100, got ${v}`);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/counter-math.test.mjs`
Expected: FAIL — `Cannot find module '../assets/js/counter-math.mjs'`

- [ ] **Step 3: Write minimal implementation**

Create `assets/js/counter-math.mjs`:

```js
export function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function counterValueAt(elapsedMs, durationMs, target) {
  if (elapsedMs >= durationMs) return target;
  const t = Math.max(0, elapsedMs) / durationMs;
  return Math.round(easeOutExpo(t) * target);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/counter-math.test.mjs`
Expected: PASS (5 tests, 0 failures)

- [ ] **Step 5: Create `assets/js/main.js` (DOM wiring — reveal-on-scroll + kinetic counters)**

```js
import { counterValueAt } from './counter-math.mjs';

export function initRevealOnScroll() {
  const targets = document.querySelectorAll('.rv');
  if (!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  targets.forEach((el) => io.observe(el));
}

export function initKineticCounters() {
  const nodes = document.querySelectorAll('[data-counter-target]');
  if (!nodes.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const target = Number(el.getAttribute('data-counter-target'));
    const suffix = el.getAttribute('data-counter-suffix') || '';
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      el.textContent = counterValueAt(elapsed, duration, target) + suffix;
      if (elapsed < duration) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .5 });
  nodes.forEach((el) => io.observe(el));
}

export function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

export function bootstrapCommon() {
  initRevealOnScroll();
  initKineticCounters();
  initSmoothAnchors();
}
```

- [ ] **Step 6: Commit**

```bash
git add assets/js/counter-math.mjs test/counter-math.test.mjs assets/js/main.js
git commit -m "feat: add kinetic counter math (tested) and shared page bootstrap"
```

---

## Task 4: Illustration module — network (business systems / ERP-CRM motif)

**Files:**
- Create: `assets/js/illustrations/network.js`
- Create: `assets/css/illustrations.css`

**Interfaces:**
- Consumes: `--red`, `--red-glow` tokens (module reads them via CSS, not JS)
- Produces: `export function mountNetwork(container, { onDark = false } = {})` — clears `container`, appends an inline `<svg class="ill ill-network">` (hub node + 4 satellite nodes + connecting lines), viewBox `0 0 220 150`. Adds class `ill--on-dark` when `onDark` is true (selects `--red-glow` instead of `--red` via CSS). Used identically by Home (small teaser size) and the Web & Plataformas page (large size) — sizing is controlled by the caller via CSS on `container`, not by the module.

- [ ] **Step 1: Create `assets/css/illustrations.css`**

```css
.ill { width: 100%; height: 100%; display: block; }
.ill-network .node { fill: var(--red); }
.ill-network.ill--on-dark .node { fill: var(--red-glow); }
.ill-network .link { stroke: var(--red); stroke-width: 1; opacity: .45; }
.ill-network.ill--on-dark .link { stroke: var(--red-glow); }
.ill-network .node--hub { animation: ill-pulse 2.4s ease-in-out infinite; }
.ill-network .node--sat { animation: ill-pulse 2.4s ease-in-out infinite; }
.ill-network .node--sat:nth-child(7) { animation-delay: .3s; }
.ill-network .node--sat:nth-child(8) { animation-delay: .6s; }
.ill-network .node--sat:nth-child(9) { animation-delay: .9s; }

@keyframes ill-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

@media (prefers-reduced-motion: reduce) {
  .ill-network .node--hub, .ill-network .node--sat { animation: none; opacity: 1; }
}
```

- [ ] **Step 2: Create `assets/js/illustrations/network.js`**

```js
const NODES = [
  { x: 40, y: 30 }, { x: 180, y: 20 }, { x: 30, y: 120 }, { x: 190, y: 110 },
];
const HUB = { x: 110, y: 75 };

export function mountNetwork(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 150');
  svg.setAttribute('class', 'ill ill-network' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  NODES.forEach((n) => {
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('class', 'link');
    line.setAttribute('x1', HUB.x); line.setAttribute('y1', HUB.y);
    line.setAttribute('x2', n.x); line.setAttribute('y2', n.y);
    svg.appendChild(line);
  });

  const hub = document.createElementNS(ns, 'circle');
  hub.setAttribute('class', 'node node--hub');
  hub.setAttribute('cx', HUB.x); hub.setAttribute('cy', HUB.y); hub.setAttribute('r', 7);
  svg.appendChild(hub);

  NODES.forEach((n) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('class', 'node node--sat');
    c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', 4);
    svg.appendChild(c);
  });

  container.appendChild(svg);
  return svg;
}
```

- [ ] **Step 3: Create a browser preview harness (this is how all 4 illustration modules get verified — Node has no real DOM, so this is a real page, not a mock)**

Create `test/illustrations-preview.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Illustration preview harness</title>
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/illustrations.css">
  <style>
    body { display: flex; flex-wrap: wrap; gap: 24px; padding: 24px; background: #fff; }
    .box { width: 220px; height: 150px; border: 1px solid #ccc; }
    .box.dark { background: var(--ink-dark); }
  </style>
</head>
<body>
  <div class="box" id="network-light"></div>
  <div class="box dark" id="network-dark"></div>
  <script type="module">
    import { mountNetwork } from '../assets/js/illustrations/network.js';
    mountNetwork(document.getElementById('network-light'), { onDark: false });
    mountNetwork(document.getElementById('network-dark'), { onDark: true });
  </script>
</body>
</html>
```

- [ ] **Step 4: Open the harness in the browser and verify visually**

Open `test/illustrations-preview.html` directly in the browser (file:// URL, no server needed since it's plain static files with relative paths).
Expected: two 220×150 boxes, each showing a hub-and-spoke network (1 large center node, 4 smaller nodes, connecting lines) — orange on the white box, brighter orange on the dark box. The nodes should be gently pulsing (unless the OS has reduced-motion enabled, in which case they're static).

- [ ] **Step 5: Commit**

```bash
git add assets/js/illustrations/network.js assets/css/illustrations.css test/illustrations-preview.html
git commit -m "feat: add network illustration module with browser preview harness"
```

---

## Task 5: Illustration module — orbit (AI agents motif)

**Files:**
- Create: `assets/js/illustrations/orbit.js`
- Modify: `assets/css/illustrations.css`
- Modify: `test/illustrations-preview.html`

**Interfaces:**
- Consumes: same tokens as Task 4; reuses the `.ill--on-dark` modifier convention.
- Produces: `export function mountOrbit(container, { onDark = false } = {})` — same call contract as `mountNetwork`, appends `<svg class="ill ill-orbit">` (center node + 3 rotating orbit rings + orbiting particles), viewBox `0 0 180 150`.

- [ ] **Step 1: Add orbit styles to `assets/css/illustrations.css`**

```css
.ill-orbit .core { fill: var(--red); }
.ill-orbit.ill--on-dark .core { fill: var(--red-glow); }
.ill-orbit .ring { stroke: var(--red); stroke-width: 1; fill: none; opacity: .4; }
.ill-orbit.ill--on-dark .ring { stroke: var(--red-glow); }
.ill-orbit .particle { fill: var(--red); }
.ill-orbit.ill--on-dark .particle { fill: var(--red-glow); }
.ill-orbit .ring-group {
  transform-box: fill-box; transform-origin: center;
  animation: ill-rotate 14s linear infinite;
}
.ill-orbit .ring-group:nth-child(2) { animation-duration: 20s; animation-direction: reverse; }
.ill-orbit .ring-group:nth-child(3) { animation-duration: 26s; }

@keyframes ill-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .ill-orbit .ring-group { animation: none; }
}
```

- [ ] **Step 2: Create `assets/js/illustrations/orbit.js`**

```js
const RING_ROTATIONS = [0, 60, 120];

export function mountOrbit(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 180 150');
  svg.setAttribute('class', 'ill ill-orbit' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  RING_ROTATIONS.forEach((deg) => {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('class', 'ring-group');
    const ellipse = document.createElementNS(ns, 'ellipse');
    ellipse.setAttribute('class', 'ring');
    ellipse.setAttribute('cx', 90); ellipse.setAttribute('cy', 75);
    ellipse.setAttribute('rx', 70); ellipse.setAttribute('ry', 26);
    ellipse.setAttribute('transform', `rotate(${deg} 90 75)`);
    g.appendChild(ellipse);
    const particle = document.createElementNS(ns, 'circle');
    particle.setAttribute('class', 'particle');
    particle.setAttribute('r', 3.5);
    const rad = (deg * Math.PI) / 180;
    particle.setAttribute('cx', 90 + 70 * Math.cos(rad));
    particle.setAttribute('cy', 75 + 26 * Math.sin(rad));
    g.appendChild(particle);
    svg.appendChild(g);
  });

  const core = document.createElementNS(ns, 'circle');
  core.setAttribute('class', 'core');
  core.setAttribute('cx', 90); core.setAttribute('cy', 75); core.setAttribute('r', 9);
  svg.appendChild(core);

  container.appendChild(svg);
  return svg;
}
```

- [ ] **Step 3: Extend `test/illustrations-preview.html`** — add two more boxes and a second import, right after the existing `network-dark` box and inside the same `<script type="module">` block:

```html
  <div class="box" id="orbit-light"></div>
  <div class="box dark" id="orbit-dark"></div>
```

```js
    import { mountOrbit } from '../assets/js/illustrations/orbit.js';
    mountOrbit(document.getElementById('orbit-light'), { onDark: false });
    mountOrbit(document.getElementById('orbit-dark'), { onDark: true });
```

- [ ] **Step 4: Open the harness in the browser and verify visually**

Expected: two new boxes showing a center node with 3 rotating elliptical orbit rings, each with one particle dot, all three rings rotating at different speeds (one reversed).

- [ ] **Step 5: Commit**

```bash
git add assets/js/illustrations/orbit.js assets/css/illustrations.css test/illustrations-preview.html
git commit -m "feat: add orbit illustration module"
```

---

## Task 6: Illustration module — device (hardware/sensor motif)

**Files:**
- Create: `assets/js/illustrations/device.js`
- Modify: `assets/css/illustrations.css`
- Modify: `test/illustrations-preview.html`

**Interfaces:**
- Produces: `export function mountDevice(container, { onDark = false } = {})` — appends `<svg class="ill ill-device">` (a rounded device rectangle + 3 concentric signal arcs pulsing outward), viewBox `0 0 160 150`.

- [ ] **Step 1: Add device styles to `assets/css/illustrations.css`**

```css
.ill-device .body { stroke: var(--red); stroke-width: 1.5; fill: none; }
.ill-device.ill--on-dark .body { stroke: var(--red-glow); }
.ill-device .led { fill: var(--red); }
.ill-device.ill--on-dark .led { fill: var(--red-glow); }
.ill-device .wave { stroke: var(--red); stroke-width: 1; fill: none; opacity: 0; animation: ill-wave 2.4s ease-out infinite; }
.ill-device.ill--on-dark .wave { stroke: var(--red-glow); }
.ill-device .wave:nth-child(3) { animation-delay: 0s; }
.ill-device .wave:nth-child(4) { animation-delay: .6s; }
.ill-device .wave:nth-child(5) { animation-delay: 1.2s; }

@keyframes ill-wave {
  0% { opacity: .6; transform: scale(.85); }
  100% { opacity: 0; transform: scale(1.15); }
}

@media (prefers-reduced-motion: reduce) {
  .ill-device .wave { animation: none; opacity: .25; }
}
```

- [ ] **Step 2: Create `assets/js/illustrations/device.js`**

```js
export function mountDevice(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 160 150');
  svg.setAttribute('class', 'ill ill-device' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  const body = document.createElementNS(ns, 'rect');
  body.setAttribute('class', 'body');
  body.setAttribute('x', 55); body.setAttribute('y', 55);
  body.setAttribute('width', 50); body.setAttribute('height', 40);
  body.setAttribute('rx', 6);
  svg.appendChild(body);

  const led = document.createElementNS(ns, 'circle');
  led.setAttribute('class', 'led');
  led.setAttribute('cx', 80); led.setAttribute('cy', 75); led.setAttribute('r', 4);
  svg.appendChild(led);

  [18, 30, 42].forEach((r) => {
    const arc = document.createElementNS(ns, 'circle');
    arc.setAttribute('class', 'wave');
    arc.setAttribute('cx', 80); arc.setAttribute('cy', 75); arc.setAttribute('r', r);
    svg.appendChild(arc);
  });

  container.appendChild(svg);
  return svg;
}
```

- [ ] **Step 3: Extend `test/illustrations-preview.html`** — add two more boxes inside `<body>`, right after the `orbit-dark` box:

```html
  <div class="box" id="device-light"></div>
  <div class="box dark" id="device-dark"></div>
```

And add the matching import/calls inside the existing `<script type="module">` block:

```js
    import { mountDevice } from '../assets/js/illustrations/device.js';
    mountDevice(document.getElementById('device-light'), { onDark: false });
    mountDevice(document.getElementById('device-dark'), { onDark: true });
```

- [ ] **Step 4: Open the harness in the browser and verify visually**

Expected: a rounded rectangle "device" body with a center LED dot and 3 concentric circles pulsing outward from it like a signal/heartbeat.

- [ ] **Step 5: Commit**

```bash
git add assets/js/illustrations/device.js assets/css/illustrations.css test/illustrations-preview.html
git commit -m "feat: add device illustration module"
```

---

## Task 7: Illustration module — dashboard (management platform motif)

**Files:**
- Create: `assets/js/illustrations/dashboard.js`
- Modify: `assets/css/illustrations.css`
- Modify: `test/illustrations-preview.html`

**Interfaces:**
- Produces: `export function mountDashboard(container, { onDark = false } = {})` — appends `<svg class="ill ill-dashboard">` (a monitor-frame rect + 4 animated bar-chart bars + a drawn line-graph path), viewBox `0 0 200 150`.

- [ ] **Step 1: Add dashboard styles to `assets/css/illustrations.css`**

```css
.ill-dashboard .frame { stroke: var(--red); stroke-width: 1.5; fill: none; }
.ill-dashboard.ill--on-dark .frame { stroke: var(--red-glow); }
.ill-dashboard .bar { fill: var(--red); opacity: .55; animation: ill-bar 2.6s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom; }
.ill-dashboard.ill--on-dark .bar { fill: var(--red-glow); }
.ill-dashboard .bar:nth-child(3) { animation-delay: .3s; }
.ill-dashboard .bar:nth-child(4) { animation-delay: .6s; }
.ill-dashboard .bar:nth-child(5) { animation-delay: .9s; }
.ill-dashboard .line { stroke: var(--red); stroke-width: 1.5; fill: none; stroke-dasharray: 120; stroke-dashoffset: 120; animation: ill-draw 3s ease-in-out infinite; }
.ill-dashboard.ill--on-dark .line { stroke: var(--red-glow); }

@keyframes ill-bar {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(.6); }
}
@keyframes ill-draw {
  0% { stroke-dashoffset: 120; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -120; }
}

@media (prefers-reduced-motion: reduce) {
  .ill-dashboard .bar { animation: none; }
  .ill-dashboard .line { animation: none; stroke-dashoffset: 0; }
}
```

- [ ] **Step 2: Create `assets/js/illustrations/dashboard.js`**

```js
const BARS = [
  { x: 40, h: 30 }, { x: 65, h: 50 }, { x: 90, h: 22 }, { x: 115, h: 40 },
];

export function mountDashboard(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 200 150');
  svg.setAttribute('class', 'ill ill-dashboard' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  const frame = document.createElementNS(ns, 'rect');
  frame.setAttribute('class', 'frame');
  frame.setAttribute('x', 20); frame.setAttribute('y', 20);
  frame.setAttribute('width', 160); frame.setAttribute('height', 110);
  frame.setAttribute('rx', 4);
  svg.appendChild(frame);

  const floor = 115;
  BARS.forEach((b) => {
    const bar = document.createElementNS(ns, 'rect');
    bar.setAttribute('class', 'bar');
    bar.setAttribute('x', b.x); bar.setAttribute('width', 14);
    bar.setAttribute('y', floor - b.h); bar.setAttribute('height', b.h);
    svg.appendChild(bar);
  });

  const line = document.createElementNS(ns, 'path');
  line.setAttribute('class', 'line');
  line.setAttribute('d', 'M35,50 L65,65 L90,40 L115,55 L145,35');
  svg.appendChild(line);

  container.appendChild(svg);
  return svg;
}
```

- [ ] **Step 3: Extend `test/illustrations-preview.html`** — add two more boxes inside `<body>`, right after the `device-dark` box:

```html
  <div class="box" id="dashboard-light"></div>
  <div class="box dark" id="dashboard-dark"></div>
```

And add the matching import/calls inside the existing `<script type="module">` block:

```js
    import { mountDashboard } from '../assets/js/illustrations/dashboard.js';
    mountDashboard(document.getElementById('dashboard-light'), { onDark: false });
    mountDashboard(document.getElementById('dashboard-dark'), { onDark: true });
```

- [ ] **Step 4: Open the harness in the browser and verify visually**

Expected: a monitor-frame rectangle containing 4 bars pulsing up/down at staggered delays and a zig-zag line-graph path that draws and redraws in a loop.

- [ ] **Step 5: Commit**

```bash
git add assets/js/illustrations/dashboard.js assets/css/illustrations.css test/illustrations-preview.html
git commit -m "feat: add dashboard illustration module — completes the 4-illustration system"
```

---

## Task 8: Canonical `<head>` fragment (reference for all pages)

**Files:**
- No new files — this task documents the exact `<head>` snippet every page (Tasks 9, 12, 13, 14) must include verbatim, so it only needs to be gotten right once.

- [ ] **Step 1: Record the canonical head fragment used by every page**

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/illustrations.css">
```

Each page additionally links its own page-specific stylesheet (`home.css` or `portfolio.css`) right after `illustrations.css`, and loads its bootstrap script as `type="module"` before `</body>`.

- [ ] **Step 2: No commit** — this is a reference block consumed by Tasks 9, 12, 13, 14. Proceed directly to Task 9.

---

## Task 9: Home page (`index.html`)

**Files:**
- Create: `index.html`
- Create: `assets/css/home.css`

**Interfaces:**
- Consumes: `assets/css/{tokens,base,illustrations,home}.css`, `assets/js/main.js` (`bootstrapCommon`), `assets/js/illustrations/{network,orbit,device}.js`.
- Produces: the live Home page other tasks link to (`/`, referenced by nav in Tasks 12–14).

- [ ] **Step 1: Create `assets/css/home.css`**

```css
.hero { min-height: 100dvh; background: var(--ink-dark); color: var(--paper); display: grid; grid-template-rows: 1fr auto; padding: 60px 56px 40px; }
.hero-tag { color: var(--red-glow); margin-bottom: 28px; }
.hero-h1 { font-size: clamp(3.5rem, 8vw, 8rem); font-weight: 700; line-height: .97; letter-spacing: -.04em; max-width: 900px; }
.hero-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: end; border-top: 1px solid rgba(245,243,236,.12); padding-top: 28px; margin-top: 60px; }
.hero-sub { font-size: 15px; line-height: 1.75; color: var(--gray-on-dark); max-width: 360px; }
.hero-actions { display: flex; gap: 12px; justify-content: flex-end; }

.section-pad { padding: var(--space-section) 56px; }
.sec-h2 { font-size: clamp(2rem, 3.5vw, 3.8rem); font-weight: 700; line-height: 1.05; letter-spacing: -.03em; }

.fields { background: var(--ink-dark); color: var(--paper); }
.fields-head { max-width: 640px; margin-bottom: 56px; }
.fields-head p { color: var(--gray-on-dark); font-size: 15px; line-height: 1.8; margin-top: 16px; }
.fields-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.field-card { border: 1px solid rgba(245,243,236,.1); border-radius: 16px; padding: 28px; display: flex; flex-direction: column; gap: 18px; text-decoration: none; color: inherit; transition: border-color var(--dur-normal), transform var(--dur-normal); }
.field-card:hover { border-color: var(--red-glow); transform: translateY(-4px); }
.field-card .ill-box { height: 130px; }
.field-card h3 { font-size: 20px; font-weight: 700; letter-spacing: -.01em; }
.field-card p { font-size: 13px; color: var(--gray-on-dark); line-height: 1.7; }
.field-card .go { font-family: var(--fm); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--red-glow); margin-top: auto; }

.range { background: var(--cream); }
.range-row { display: grid; grid-template-columns: 1.3fr 1fr; gap: 32px; margin-top: 28px; }
.range-chips { display: flex; flex-direction: column; gap: 10px; }
.range-chip { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border: 1px solid rgba(17,17,17,.14); border-radius: var(--radius-pill); }
.range-chip h5 { font-size: 13px; font-weight: 700; }
.range-chip p { font-size: 11px; color: var(--gray); }
.range-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-self: start; }
.range-stat .n { font-size: 34px; font-weight: 800; letter-spacing: -.02em; color: var(--red); }
.range-stat .l { font-size: 11px; color: var(--gray); margin-top: 6px; max-width: 150px; line-height: 1.5; }

.process { background: var(--ink-dark); color: var(--paper); }
.steps-list { list-style: none; margin-top: 40px; }
.step-li { display: grid; grid-template-columns: 56px 1fr; gap: 24px; padding: 28px 0; border-bottom: 1px solid rgba(245,243,236,.1); }
.step-li:first-child { border-top: 1px solid rgba(245,243,236,.1); }
.step-num { font-family: var(--fm); font-size: 11px; color: var(--red-glow); padding-top: 4px; }
.step-li h4 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.step-li p { font-size: 13px; color: var(--gray-on-dark); line-height: 1.75; }

.cta { padding: 100px 56px; display: grid; grid-template-columns: 1fr auto; gap: 60px; align-items: center; background: var(--red); }
.cta h2 { font-size: clamp(2.5rem, 5vw, 6rem); font-weight: 700; letter-spacing: -.04em; line-height: .97; color: var(--paper); }
.cta-right { display: flex; flex-direction: column; gap: 14px; }

@media (max-width: 900px) {
  .hero, .section-pad, .cta { padding: 60px 24px; }
  .hero-bottom { grid-template-columns: 1fr; }
  .hero-actions { justify-content: flex-start; }
  .fields-grid { grid-template-columns: 1fr; }
  .range-row { grid-template-columns: 1fr; }
  .cta { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Helion — Tecnología que transforma tu empresa</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="stylesheet" href="assets/css/tokens.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/illustrations.css">
  <link rel="stylesheet" href="assets/css/home.css">
</head>
<body>

<nav class="mobile-nav" aria-label="Navegación">
  <a href="/" class="logo-link" style="margin:0" aria-label="Helion">
    <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="43" y="6" width="14" height="18" fill="currentColor"/>
      <rect x="43" y="76" width="14" height="18" fill="currentColor"/>
      <rect x="6" y="43" width="18" height="14" fill="currentColor"/>
      <rect x="76" y="43" width="18" height="14" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
      <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
    </svg>
    <span class="logo-word">HELION</span>
  </a>
  <a href="#contacto" class="btn-pill btn-pill--solid on-dark" style="padding:10px 18px;font-size:11px">Hablemos →</a>
</nav>

<nav class="sidenav" aria-label="Navegación principal">
  <a href="/" class="logo-link" aria-label="Helion">
    <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="43" y="6" width="14" height="18" fill="currentColor"/>
      <rect x="43" y="76" width="14" height="18" fill="currentColor"/>
      <rect x="6" y="43" width="18" height="14" fill="currentColor"/>
      <rect x="76" y="43" width="18" height="14" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
      <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
    </svg>
    <span class="logo-word">HELION</span>
  </a>
  <ul class="side-links" role="list">
    <li><a href="/" aria-current="page"><span class="n">00</span> Inicio</a></li>
    <li><a href="web-plataformas.html"><span class="n">01</span> Web &amp; Plataformas</a></li>
    <li><a href="inteligencia-artificial.html"><span class="n">02</span> Inteligencia Artificial</a></li>
    <li><a href="sensorica-iot.html"><span class="n">03</span> Sensórica &amp; IoT</a></li>
  </ul>
  <a href="#contacto" class="btn-pill btn-pill--solid on-dark">Hablemos →</a>
</nav>

<main>

<section class="hero on-dark" aria-labelledby="h1">
  <div>
    <div class="eyebrow hero-tag">Ecuador · Tecnología</div>
    <h1 class="hero-h1" id="h1">
      Tu empresa,<br>
      <span class="accent">pensada</span> de nuevo<br>
      en software.
    </h1>
  </div>
  <div class="hero-bottom">
    <p class="hero-sub">Software a medida, IA aplicada y tecnología de hardware para empresas que no se conforman con plantillas genéricas.</p>
    <div class="hero-actions">
      <a href="#campos" class="btn-pill btn-pill--outline on-dark">Ver campos de trabajo</a>
      <a href="#contacto" class="btn-pill btn-pill--solid on-dark">Iniciar proyecto →</a>
    </div>
  </div>
</section>

<div class="ticker" aria-hidden="true">
  <div class="ticker-track">
    <div class="t-i">ERP <span class="t-sep">✦</span></div>
    <div class="t-i">CRM <span class="t-sep">✦</span></div>
    <div class="t-i">Apps Móviles <span class="t-sep">✦</span></div>
    <div class="t-i">Agentes IA <span class="t-sep">✦</span></div>
    <div class="t-i">Chatbots <span class="t-sep">✦</span></div>
    <div class="t-i">Sensórica <span class="t-sep">✦</span></div>
    <div class="t-i">IoT <span class="t-sep">✦</span></div>
    <div class="t-i">Web &amp; SaaS <span class="t-sep">✦</span></div>
    <div class="t-i">Consultoría Tech <span class="t-sep">✦</span></div>
    <div class="t-i">ERP <span class="t-sep">✦</span></div>
    <div class="t-i">CRM <span class="t-sep">✦</span></div>
    <div class="t-i">Apps Móviles <span class="t-sep">✦</span></div>
    <div class="t-i">Agentes IA <span class="t-sep">✦</span></div>
    <div class="t-i">Chatbots <span class="t-sep">✦</span></div>
    <div class="t-i">Sensórica <span class="t-sep">✦</span></div>
    <div class="t-i">IoT <span class="t-sep">✦</span></div>
    <div class="t-i">Web &amp; SaaS <span class="t-sep">✦</span></div>
    <div class="t-i">Consultoría Tech <span class="t-sep">✦</span></div>
  </div>
</div>

<section class="fields section-pad on-dark" id="campos" aria-labelledby="fields-h">
  <div class="fields-head">
    <div class="eyebrow rv">Campos de trabajo</div>
    <h2 class="sec-h2 rv" id="fields-h">Tres formas de construir<br>tu ventaja.</h2>
    <p class="rv">Elige el campo que más se acerca a lo que necesitas — cada uno tiene su propio espacio con todo el detalle.</p>
  </div>
  <div class="fields-grid">
    <a href="web-plataformas.html" class="field-card rv">
      <div class="ill-box" id="ill-network"></div>
      <h3>Web &amp; Plataformas</h3>
      <p>ERPs, CRMs, sistemas a medida, apps móviles y plataformas web — con IA integrada.</p>
      <span class="go">Explorar →</span>
    </a>
    <a href="inteligencia-artificial.html" class="field-card rv d1">
      <div class="ill-box" id="ill-orbit"></div>
      <h3>Inteligencia Artificial</h3>
      <p>Agentes dedicados, chatbots, analizadores internos e integraciones IA.</p>
      <span class="go">Explorar →</span>
    </a>
    <a href="sensorica-iot.html" class="field-card rv d2">
      <div class="ill-box" id="ill-device"></div>
      <h3>Sensórica &amp; IoT</h3>
      <p>Hardware, plataforma de gestión e IA predictiva, de punta a punta.</p>
      <span class="go">Explorar →</span>
    </a>
  </div>
</section>

<section class="range section-pad" aria-labelledby="range-h">
  <div class="eyebrow rv">Más allá de los tres campos</div>
  <h2 class="sec-h2 rv" id="range-h">Si es software, hardware o <span class="accent">inteligencia</span>, probablemente lo construimos.</h2>
  <div class="range-row">
    <div class="range-chips rv">
      <div class="range-chip"><div><h5>Consultoría Tecnológica</h5><p>Auditamos y diseñamos tu hoja de ruta.</p></div></div>
    </div>
    <div class="range-stats rv d1">
      <div class="range-stat"><div class="n" data-counter-target="0">0</div><div class="l">plantillas genéricas — todo a medida</div></div>
      <div class="range-stat"><div class="n" data-counter-target="100" data-counter-suffix="%">0%</div><div class="l">del código es tuyo, siempre</div></div>
      <div class="range-stat"><div class="n" data-counter-target="1">0</div><div class="l">equipo, sin intermediarios ni subcontratos</div></div>
      <div class="range-stat"><div class="n">24/7</div><div class="l">soporte tras el despliegue</div></div>
    </div>
  </div>
</section>

<section class="process section-pad on-dark" id="proceso" aria-labelledby="proc-h">
  <div class="eyebrow rv">Cómo trabajamos</div>
  <h2 class="sec-h2 rv" id="proc-h">Del problema<br>al sistema.</h2>
  <ul class="steps-list rv" role="list">
    <li class="step-li"><span class="step-num">01</span><div><h4>Diagnóstico</h4><p>Escuchamos, preguntamos y mapeamos tu operación antes de escribir una sola línea de código.</p></div></li>
    <li class="step-li"><span class="step-num">02</span><div><h4>Diseño</h4><p>Arquitectura, flujos y prototipos — contigo, no para ti.</p></div></li>
    <li class="step-li"><span class="step-num">03</span><div><h4>Desarrollo</h4><p>Iteraciones cortas, demos frecuentes y código que puedes mantener.</p></div></li>
    <li class="step-li"><span class="step-num">04</span><div><h4>Despliegue &amp; Soporte</h4><p>Lanzamos, monitoreamos y permanecemos.</p></div></li>
  </ul>
</section>

<section class="cta" id="contacto" aria-labelledby="cta-h">
  <div><h2 class="rv" id="cta-h">¿Listo para<br>desarrollar <span class="accent" style="color:var(--ink)">algo real?</span></h2></div>
  <div class="cta-right rv">
    <a href="mailto:hola@helion.ec" class="btn-pill btn-pill--outline" style="border-color:var(--paper);color:var(--paper)">Escribir ahora →</a>
    <a href="#campos" class="btn-pill btn-pill--outline" style="border-color:var(--paper);color:var(--paper)">Ver campos de trabajo</a>
  </div>
</section>

<footer>
  <div class="ft-row">
    <div class="ft-brand">
      <a href="/" class="ft-logo" aria-label="Helion">
        <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="43" y="6" width="14" height="18" fill="currentColor"/>
          <rect x="43" y="76" width="14" height="18" fill="currentColor"/>
          <rect x="6" y="43" width="18" height="14" fill="currentColor"/>
          <rect x="76" y="43" width="18" height="14" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
          <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
        </svg>
        <span class="logo-word">HELION</span>
      </a>
      <p>Software a medida, IA aplicada y tecnología de hardware para empresas en Ecuador y el mundo.</p>
    </div>
    <div class="ft-col">
      <h5>Campos</h5>
      <ul>
        <li><a href="web-plataformas.html">Web &amp; Plataformas</a></li>
        <li><a href="inteligencia-artificial.html">Inteligencia Artificial</a></li>
        <li><a href="sensorica-iot.html">Sensórica &amp; IoT</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Empresa</h5>
      <ul>
        <li><a href="#proceso">Cómo trabajamos</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bottom">
    <span>© 2026 Helion Technology. Ecuador.</span>
    <span>DESARROLLADO CON PRECISIÓN.</span>
  </div>
</footer>

</main>

<script type="module">
  import { bootstrapCommon } from './assets/js/main.js';
  import { mountNetwork } from './assets/js/illustrations/network.js';
  import { mountOrbit } from './assets/js/illustrations/orbit.js';
  import { mountDevice } from './assets/js/illustrations/device.js';

  bootstrapCommon();
  mountNetwork(document.getElementById('ill-network'), { onDark: true });
  mountOrbit(document.getElementById('ill-orbit'), { onDark: true });
  mountDevice(document.getElementById('ill-device'), { onDark: true });
</script>
</body>
</html>
```

- [ ] **Step 3: Verify in the browser**

Open `index.html` directly (file:// URL). Verify: dark hero renders with the Fraunces-italic "pensada" accent word, ticker scrolls, the 3 field cards show their illustrations and link out (links 404 until Tasks 12–14 exist — expected at this point), the range/stats section's counters animate up on scroll, process and CTA sections render, footer is dark. Check the browser console for JS errors (should be none besides the expected 404s on click-through).

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/home.css
git commit -m "feat: rebuild home page as abstract fields-of-work landing"
```

---

## Task 10: Shared portfolio layout (`portfolio.css`)

**Files:**
- Create: `assets/css/portfolio.css`

**Interfaces:**
- Consumes: tokens from Task 1, `.eyebrow`/`.accent`/`.btn-pill`/`.rv` from Task 2.
- Produces: classes consumed by Tasks 12, 13, 14 — `.portfolio-hero`, `.capability-grid`/`.capability-card`, `.integration-band`, `.portfolio-cta`/`.portfolio-cta-right`, and the scrollytelling layout classes `.acts-section`, `.acts-layout`, `.acts-progress-track`/`.acts-progress-fill`, `.acts-copy`/`.act`, `.acts-visual`.

- [ ] **Step 1: Create `assets/css/portfolio.css`**

```css
.portfolio-hero { background: var(--ink-dark); color: var(--paper); padding: 100px 56px 60px; }
.portfolio-hero h1 { font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 700; letter-spacing: -.03em; line-height: 1.02; margin-top: 14px; max-width: 760px; }
.portfolio-hero p { font-size: 15px; color: var(--gray-on-dark); line-height: 1.8; max-width: 460px; margin-top: 18px; }

.capability-grid { padding: var(--space-section) 56px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; background: var(--cream); }
.capability-card { border: 1px solid rgba(17,17,17,.12); border-radius: 16px; padding: 30px; display: flex; flex-direction: column; gap: 18px; }
.capability-card .ill-box { height: 150px; }
.capability-card h3 { font-size: 20px; font-weight: 700; }
.capability-card p { font-size: 13px; color: var(--gray); line-height: 1.7; }

.integration-band { padding: var(--space-section) 56px; background: var(--ink-dark); color: var(--paper); display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
.integration-band .ill-box { height: 220px; }
.integration-band h2 { font-size: clamp(1.8rem, 3vw, 3rem); font-weight: 700; letter-spacing: -.02em; line-height: 1.08; }
.integration-band p { font-size: 14px; color: var(--gray-on-dark); line-height: 1.8; margin-top: 16px; max-width: 420px; }
.integration-band .links { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }

.portfolio-cta { padding: 100px 56px; display: grid; grid-template-columns: 1fr auto; gap: 60px; align-items: center; background: var(--red); }
.portfolio-cta h2 { font-size: clamp(2.2rem, 4.5vw, 5rem); font-weight: 700; letter-spacing: -.03em; line-height: .98; color: var(--paper); }
.portfolio-cta-right { display: flex; flex-direction: column; gap: 14px; }

/* Scrollytelling (Sensórica page only) */
.acts-section { background: var(--ink-dark); color: var(--paper); padding: 40px 56px var(--space-section); }
.acts-layout { display: grid; grid-template-columns: 40px 1fr 1fr; gap: 32px; }
.acts-progress-track { background: rgba(245,243,236,.1); border-radius: 2px; position: relative; height: 100%; }
.acts-progress-fill { position: absolute; top: 0; left: 0; right: 0; height: 0%; background: var(--red-glow); border-radius: 2px; transition: height .1s linear; }
.acts-copy .act { min-height: 70vh; display: flex; flex-direction: column; justify-content: center; padding: 24px 0; }
.acts-copy .act h3 { font-size: clamp(1.4rem, 2.4vw, 2.2rem); font-weight: 700; letter-spacing: -.02em; line-height: 1.1; margin-top: 10px; }
.acts-copy .act p { font-size: 13px; color: var(--gray-on-dark); line-height: 1.8; margin-top: 12px; max-width: 380px; }
.acts-visual { position: sticky; top: 80px; height: 70vh; display: flex; align-items: center; justify-content: center; }
.acts-visual .ill-box { width: 100%; height: 340px; }

@media (max-width: 900px) {
  .portfolio-hero, .capability-grid, .integration-band, .portfolio-cta, .acts-section { padding-left: 24px; padding-right: 24px; }
  .capability-grid { grid-template-columns: 1fr; }
  .integration-band { grid-template-columns: 1fr; }
  .portfolio-cta { grid-template-columns: 1fr; }
  .acts-layout { grid-template-columns: 24px 1fr; }
  .acts-visual { display: none; }
}
```

Note: `.acts-visual` is hidden below 900px — a pinned/sticky illustration panel next to scrolling copy doesn't translate to small screens, so mobile gets the act copy only, full width. This is a deliberate simplification, not an oversight.

- [ ] **Step 2: Commit**

```bash
git add assets/css/portfolio.css
git commit -m "feat: add shared portfolio-page layout styles"
```

---

## Task 11: GSAP + ScrollTrigger (self-hosted) and the scrollytelling controller

**Files:**
- Create: `assets/vendor/gsap.min.js`
- Create: `assets/vendor/ScrollTrigger.min.js`
- Create: `assets/js/scrollytelling.js`

**Interfaces:**
- Consumes: `assets/js/illustrations/{device,dashboard,orbit}.js` (`mountDevice`, `mountDashboard`, `mountOrbit`).
- Produces: `export function initScrollytelling(options)` — called from `sensorica-iot.html` (Task 14) after the vendor scripts and illustration modules are loaded. Reads DOM structure: a `.acts-section` containing `.acts-progress-fill`, one or more `.act[data-illustration="device|dashboard|orbit"]` elements, and a `#acts-illustration` mount target.

- [ ] **Step 1: Download GSAP + ScrollTrigger into `assets/vendor/`**

```bash
mkdir -p assets/vendor
curl -sL -o assets/vendor/gsap.min.js https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
curl -sL -o assets/vendor/ScrollTrigger.min.js https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
```

- [ ] **Step 2: Verify both files downloaded and are non-trivial in size**

Run: `wc -c assets/vendor/gsap.min.js assets/vendor/ScrollTrigger.min.js`
Expected: both files well over 10000 bytes (a failed/empty download would be near 0 bytes or contain an HTML error page — if either file's content starts with `<`, the download failed and must be retried).

- [ ] **Step 3: Create `assets/js/scrollytelling.js`**

```js
import { mountDevice } from './illustrations/device.js';
import { mountDashboard } from './illustrations/dashboard.js';
import { mountOrbit } from './illustrations/orbit.js';

const ILLUSTRATION_MOUNTERS = { device: mountDevice, dashboard: mountDashboard, orbit: mountOrbit };

export function initScrollytelling({
  sectionSelector = '.acts-section',
  actSelector = '.act',
  progressSelector = '.acts-progress-fill',
  illustrationTarget = '#acts-illustration',
} = {}) {
  const section = document.querySelector(sectionSelector);
  if (!section || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  const acts = Array.from(section.querySelectorAll(actSelector));
  const progressFill = section.querySelector(progressSelector);
  const illustrationEl = section.querySelector(illustrationTarget);
  if (!acts.length || !progressFill || !illustrationEl) return;

  let currentIllustration = null;
  const showIllustration = (name) => {
    if (currentIllustration === name) return;
    currentIllustration = name;
    const mount = ILLUSTRATION_MOUNTERS[name];
    if (mount) mount(illustrationEl, { onDark: true });
  };
  showIllustration(acts[0].dataset.illustration);

  const mm = window.gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    acts.forEach((act) => {
      window.ScrollTrigger.create({
        trigger: act,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => showIllustration(act.dataset.illustration),
        onEnterBack: () => showIllustration(act.dataset.illustration),
      });
    });

    const progressTrigger = window.ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { progressFill.style.height = (self.progress * 100) + '%'; },
    });

    return () => { progressTrigger.kill(); };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    progressFill.style.height = '100%';
  });
}
```

Design note: the sticky visual panel is pinned with plain CSS `position: sticky` (`.acts-visual` in `portfolio.css`, Task 10), not GSAP's `pin: true` — simpler and avoids layout-recalculation edge cases. GSAP/ScrollTrigger here is used only for two things: detecting which act is in view (to swap the illustration) and scrubbing the progress-line fill. `gsap.matchMedia()` is what makes the reduced-motion fallback (Global Constraints) work — under `prefers-reduced-motion: reduce`, no ScrollTrigger instances are created at all.

- [ ] **Step 4: Commit**

```bash
git add assets/vendor/gsap.min.js assets/vendor/ScrollTrigger.min.js assets/js/scrollytelling.js
git commit -m "feat: self-host GSAP/ScrollTrigger, add scrollytelling controller"
```

---

## Task 12: Web & Plataformas page (`web-plataformas.html`)

**Files:**
- Create: `web-plataformas.html`

**Interfaces:**
- Consumes: the Task 8 head fragment + `assets/css/portfolio.css` (Task 10), `assets/js/main.js` (`bootstrapCommon`), `assets/js/illustrations/{network,orbit}.js`.

- [ ] **Step 1: Create `web-plataformas.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web &amp; Plataformas — Helion</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="stylesheet" href="assets/css/tokens.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/illustrations.css">
  <link rel="stylesheet" href="assets/css/portfolio.css">
</head>
<body>

<nav class="mobile-nav" aria-label="Navegación">
  <a href="/" class="logo-link" style="margin:0" aria-label="Helion">
    <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="43" y="6" width="14" height="18" fill="currentColor"/><rect x="43" y="76" width="14" height="18" fill="currentColor"/>
      <rect x="6" y="43" width="18" height="14" fill="currentColor"/><rect x="76" y="43" width="18" height="14" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
      <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
    </svg>
    <span class="logo-word">HELION</span>
  </a>
  <a href="index.html#contacto" class="btn-pill btn-pill--solid on-dark" style="padding:10px 18px;font-size:11px">Hablemos →</a>
</nav>

<nav class="sidenav" aria-label="Navegación principal">
  <a href="/" class="logo-link" aria-label="Helion">
    <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="43" y="6" width="14" height="18" fill="currentColor"/><rect x="43" y="76" width="14" height="18" fill="currentColor"/>
      <rect x="6" y="43" width="18" height="14" fill="currentColor"/><rect x="76" y="43" width="18" height="14" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
      <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
    </svg>
    <span class="logo-word">HELION</span>
  </a>
  <ul class="side-links" role="list">
    <li><a href="/"><span class="n">00</span> Inicio</a></li>
    <li><a href="web-plataformas.html" aria-current="page"><span class="n">01</span> Web &amp; Plataformas</a></li>
    <li><a href="inteligencia-artificial.html"><span class="n">02</span> Inteligencia Artificial</a></li>
    <li><a href="sensorica-iot.html"><span class="n">03</span> Sensórica &amp; IoT</a></li>
  </ul>
  <a href="index.html#contacto" class="btn-pill btn-pill--solid on-dark">Hablemos →</a>
</nav>

<main>

<section class="portfolio-hero on-dark">
  <div class="eyebrow rv">Web &amp; Plataformas</div>
  <h1 class="rv">Sistemas que se <span class="accent">ajustan</span><br>a tu operación.</h1>
  <p class="rv">ERPs, CRMs, sistemas a medida, apps móviles y plataformas web — construidos para tu proceso exacto, no para uno genérico.</p>
</section>

<section class="capability-grid">
  <div class="capability-card rv"><div class="ill-box" id="cap-erp"></div><h3>ERP</h3><p>Un panel para toda la operación: inventario, finanzas, procesos internos, sin hojas sueltas.</p></div>
  <div class="capability-card rv d1"><div class="ill-box" id="cap-crm"></div><h3>CRM</h3><p>Ventas y clientes siempre a la vista, con el flujo comercial que tu equipo realmente sigue.</p></div>
  <div class="capability-card rv d2"><div class="ill-box" id="cap-custom"></div><h3>Sistemas a Medida</h3><p>Plataformas construidas exactamente para tu proceso — 100% tuyas, sin licencias que te aten.</p></div>
  <div class="capability-card rv d3"><div class="ill-box" id="cap-mobile"></div><h3>Apps Móviles &amp; Web</h3><p>iOS, Android, SaaS, e-commerce y portales — donde tu equipo y tus clientes ya están.</p></div>
</section>

<section class="integration-band">
  <div class="ill-box rv" id="cap-ai"></div>
  <div class="rv d1">
    <div class="eyebrow">La IA, integrada</div>
    <h2>No es un extra — <span class="accent">está adentro</span>.</h2>
    <p>Copilotos dentro de tu ERP, analítica embebida en tu CRM, automatización en cada flujo. La misma inteligencia que usamos en <a href="inteligencia-artificial.html" style="color:var(--red-glow)">Inteligencia Artificial</a> vive dentro de lo que construimos aquí.</p>
    <div class="links">
      <a href="inteligencia-artificial.html" class="btn-pill btn-pill--outline on-dark">Ver soluciones IA →</a>
    </div>
  </div>
</section>

<section class="portfolio-cta">
  <div><h2 class="rv">¿Construimos tu<br>próxima plataforma?</h2></div>
  <div class="portfolio-cta-right rv">
    <a href="mailto:hola@helion.ec" class="btn-pill btn-pill--outline" style="border-color:var(--paper);color:var(--paper)">Escribir ahora →</a>
    <a href="index.html" class="btn-pill btn-pill--outline" style="border-color:var(--paper);color:var(--paper)">Volver al inicio</a>
  </div>
</section>

<footer>
  <div class="ft-row">
    <div class="ft-brand">
      <a href="/" class="ft-logo" aria-label="Helion">
        <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="43" y="6" width="14" height="18" fill="currentColor"/><rect x="43" y="76" width="14" height="18" fill="currentColor"/>
          <rect x="6" y="43" width="18" height="14" fill="currentColor"/><rect x="76" y="43" width="18" height="14" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
          <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
        </svg>
        <span class="logo-word">HELION</span>
      </a>
      <p>Software a medida, IA aplicada y tecnología de hardware para empresas en Ecuador y el mundo.</p>
    </div>
    <div class="ft-col">
      <h5>Campos</h5>
      <ul>
        <li><a href="web-plataformas.html">Web &amp; Plataformas</a></li>
        <li><a href="inteligencia-artificial.html">Inteligencia Artificial</a></li>
        <li><a href="sensorica-iot.html">Sensórica &amp; IoT</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Empresa</h5>
      <ul>
        <li><a href="index.html#proceso">Cómo trabajamos</a></li>
        <li><a href="index.html#contacto">Contacto</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bottom">
    <span>© 2026 Helion Technology. Ecuador.</span>
    <span>DESARROLLADO CON PRECISIÓN.</span>
  </div>
</footer>

</main>

<script type="module">
  import { bootstrapCommon } from './assets/js/main.js';
  import { mountNetwork } from './assets/js/illustrations/network.js';
  import { mountOrbit } from './assets/js/illustrations/orbit.js';

  bootstrapCommon();
  mountNetwork(document.getElementById('cap-erp'), { onDark: false });
  mountNetwork(document.getElementById('cap-crm'), { onDark: false });
  mountNetwork(document.getElementById('cap-custom'), { onDark: false });
  mountNetwork(document.getElementById('cap-mobile'), { onDark: false });
  mountOrbit(document.getElementById('cap-ai'), { onDark: true });
</script>
</body>
</html>
```

- [ ] **Step 2: Verify in the browser**

Open `web-plataformas.html` directly. Verify: dark portfolio hero, 4 capability cards each show a network illustration on the cream background, the AI-integration band is dark with an orbit illustration and links to `inteligencia-artificial.html`, CTA and footer render, sidenav shows "Web & Plataformas" as the current page (bold/highlighted). Check console for errors.

- [ ] **Step 3: Commit**

```bash
git add web-plataformas.html
git commit -m "feat: add Web & Plataformas portfolio page"
```

---

## Task 13: Inteligencia Artificial page (`inteligencia-artificial.html`)

**Files:**
- Create: `inteligencia-artificial.html`

**Interfaces:**
- Consumes: same as Task 12 (Task 8 head fragment + `portfolio.css`, `main.js`, `illustrations/{orbit,network}.js`).

- [ ] **Step 1: Create `inteligencia-artificial.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inteligencia Artificial — Helion</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="stylesheet" href="assets/css/tokens.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/illustrations.css">
  <link rel="stylesheet" href="assets/css/portfolio.css">
</head>
<body>

<nav class="mobile-nav" aria-label="Navegación">
  <a href="/" class="logo-link" style="margin:0" aria-label="Helion">
    <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="43" y="6" width="14" height="18" fill="currentColor"/><rect x="43" y="76" width="14" height="18" fill="currentColor"/>
      <rect x="6" y="43" width="18" height="14" fill="currentColor"/><rect x="76" y="43" width="18" height="14" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
      <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
    </svg>
    <span class="logo-word">HELION</span>
  </a>
  <a href="index.html#contacto" class="btn-pill btn-pill--solid on-dark" style="padding:10px 18px;font-size:11px">Hablemos →</a>
</nav>

<nav class="sidenav" aria-label="Navegación principal">
  <a href="/" class="logo-link" aria-label="Helion">
    <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="43" y="6" width="14" height="18" fill="currentColor"/><rect x="43" y="76" width="14" height="18" fill="currentColor"/>
      <rect x="6" y="43" width="18" height="14" fill="currentColor"/><rect x="76" y="43" width="18" height="14" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
      <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
    </svg>
    <span class="logo-word">HELION</span>
  </a>
  <ul class="side-links" role="list">
    <li><a href="/"><span class="n">00</span> Inicio</a></li>
    <li><a href="web-plataformas.html"><span class="n">01</span> Web &amp; Plataformas</a></li>
    <li><a href="inteligencia-artificial.html" aria-current="page"><span class="n">02</span> Inteligencia Artificial</a></li>
    <li><a href="sensorica-iot.html"><span class="n">03</span> Sensórica &amp; IoT</a></li>
  </ul>
  <a href="index.html#contacto" class="btn-pill btn-pill--solid on-dark">Hablemos →</a>
</nav>

<main>

<section class="portfolio-hero on-dark">
  <div class="eyebrow rv">Inteligencia Artificial</div>
  <h1 class="rv">Agentes que <span class="accent">trabajan</span><br>cada rol.</h1>
  <p class="rv">Un catálogo de soluciones IA — desde un agente dedicado a un solo rol hasta un motor de análisis que vive dentro de tu operación.</p>
</section>

<section class="capability-grid">
  <div class="capability-card rv"><div class="ill-box" id="cap-agents"></div><h3>Agentes Dedicados</h3><p>Un agente, un rol, 24/7 — ventas, soporte, operaciones, lo que tu equipo necesite cubrir.</p></div>
  <div class="capability-card rv d1"><div class="ill-box" id="cap-chat"></div><h3>Chatbots &amp; Atención al Cliente</h3><p>Respuestas reales entrenadas en tu negocio, no respuestas genéricas ni esperas.</p></div>
  <div class="capability-card rv d2"><div class="ill-box" id="cap-analyzers"></div><h3>Analizadores Internos</h3><p>IA que lee tus datos internos y convierte el ruido en decisiones.</p></div>
  <div class="capability-card rv d3"><div class="ill-box" id="cap-integrations"></div><h3>Integraciones IA</h3><p>La misma inteligencia conectada a tu ERP, CRM y apps existentes.</p></div>
</section>

<section class="integration-band">
  <div class="ill-box rv" id="cap-everywhere"></div>
  <div class="rv d1">
    <div class="eyebrow">En todo lo que construimos</div>
    <h2>La IA no vive en <span class="accent">una sola página</span>.</h2>
    <p>Este catálogo es el motor — pero corre dentro de las plataformas de <a href="web-plataformas.html" style="color:var(--red-glow)">Web &amp; Plataformas</a> y de los sistemas de <a href="sensorica-iot.html" style="color:var(--red-glow)">Sensórica &amp; IoT</a> también.</p>
    <div class="links">
      <a href="web-plataformas.html" class="btn-pill btn-pill--outline on-dark">Ver Web &amp; Plataformas →</a>
      <a href="sensorica-iot.html" class="btn-pill btn-pill--outline on-dark">Ver Sensórica &amp; IoT →</a>
    </div>
  </div>
</section>

<section class="portfolio-cta">
  <div><h2 class="rv">¿Qué rol de tu<br>empresa automatizamos?</h2></div>
  <div class="portfolio-cta-right rv">
    <a href="mailto:hola@helion.ec" class="btn-pill btn-pill--outline" style="border-color:var(--paper);color:var(--paper)">Escribir ahora →</a>
    <a href="index.html" class="btn-pill btn-pill--outline" style="border-color:var(--paper);color:var(--paper)">Volver al inicio</a>
  </div>
</section>

<footer>
  <div class="ft-row">
    <div class="ft-brand">
      <a href="/" class="ft-logo" aria-label="Helion">
        <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="43" y="6" width="14" height="18" fill="currentColor"/><rect x="43" y="76" width="14" height="18" fill="currentColor"/>
          <rect x="6" y="43" width="18" height="14" fill="currentColor"/><rect x="76" y="43" width="18" height="14" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
          <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
        </svg>
        <span class="logo-word">HELION</span>
      </a>
      <p>Software a medida, IA aplicada y tecnología de hardware para empresas en Ecuador y el mundo.</p>
    </div>
    <div class="ft-col">
      <h5>Campos</h5>
      <ul>
        <li><a href="web-plataformas.html">Web &amp; Plataformas</a></li>
        <li><a href="inteligencia-artificial.html">Inteligencia Artificial</a></li>
        <li><a href="sensorica-iot.html">Sensórica &amp; IoT</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Empresa</h5>
      <ul>
        <li><a href="index.html#proceso">Cómo trabajamos</a></li>
        <li><a href="index.html#contacto">Contacto</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bottom">
    <span>© 2026 Helion Technology. Ecuador.</span>
    <span>DESARROLLADO CON PRECISIÓN.</span>
  </div>
</footer>

</main>

<script type="module">
  import { bootstrapCommon } from './assets/js/main.js';
  import { mountOrbit } from './assets/js/illustrations/orbit.js';
  import { mountNetwork } from './assets/js/illustrations/network.js';

  bootstrapCommon();
  mountOrbit(document.getElementById('cap-agents'), { onDark: false });
  mountOrbit(document.getElementById('cap-chat'), { onDark: false });
  mountOrbit(document.getElementById('cap-analyzers'), { onDark: false });
  mountOrbit(document.getElementById('cap-integrations'), { onDark: false });
  mountNetwork(document.getElementById('cap-everywhere'), { onDark: true });
</script>
</body>
</html>
```

- [ ] **Step 2: Verify in the browser**

Open `inteligencia-artificial.html` directly. Verify: dark portfolio hero, 4 capability cards each show an orbit illustration on cream, the "integration everywhere" band is dark with a network illustration and links to both other routes, sidenav highlights "Inteligencia Artificial" as current.

- [ ] **Step 3: Commit**

```bash
git add inteligencia-artificial.html
git commit -m "feat: add Inteligencia Artificial portfolio page"
```

---

## Task 14: Sensórica & IoT page (`sensorica-iot.html`) — scrollytelling flagship

**Files:**
- Create: `sensorica-iot.html`

**Interfaces:**
- Consumes: Task 8 head fragment + `portfolio.css`, `main.js`, `assets/vendor/{gsap,ScrollTrigger}.min.js`, `assets/js/scrollytelling.js` (`initScrollytelling`).

- [ ] **Step 1: Create `sensorica-iot.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sensórica &amp; IoT — Helion</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="stylesheet" href="assets/css/tokens.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/illustrations.css">
  <link rel="stylesheet" href="assets/css/portfolio.css">
</head>
<body>

<nav class="mobile-nav" aria-label="Navegación">
  <a href="/" class="logo-link" style="margin:0" aria-label="Helion">
    <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="43" y="6" width="14" height="18" fill="currentColor"/><rect x="43" y="76" width="14" height="18" fill="currentColor"/>
      <rect x="6" y="43" width="18" height="14" fill="currentColor"/><rect x="76" y="43" width="18" height="14" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
      <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
    </svg>
    <span class="logo-word">HELION</span>
  </a>
  <a href="index.html#contacto" class="btn-pill btn-pill--solid on-dark" style="padding:10px 18px;font-size:11px">Hablemos →</a>
</nav>

<nav class="sidenav" aria-label="Navegación principal">
  <a href="/" class="logo-link" aria-label="Helion">
    <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="43" y="6" width="14" height="18" fill="currentColor"/><rect x="43" y="76" width="14" height="18" fill="currentColor"/>
      <rect x="6" y="43" width="18" height="14" fill="currentColor"/><rect x="76" y="43" width="18" height="14" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
      <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
      <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
    </svg>
    <span class="logo-word">HELION</span>
  </a>
  <ul class="side-links" role="list">
    <li><a href="/"><span class="n">00</span> Inicio</a></li>
    <li><a href="web-plataformas.html"><span class="n">01</span> Web &amp; Plataformas</a></li>
    <li><a href="inteligencia-artificial.html"><span class="n">02</span> Inteligencia Artificial</a></li>
    <li><a href="sensorica-iot.html" aria-current="page"><span class="n">03</span> Sensórica &amp; IoT</a></li>
  </ul>
  <a href="index.html#contacto" class="btn-pill btn-pill--solid on-dark">Hablemos →</a>
</nav>

<main>

<section class="portfolio-hero on-dark">
  <div class="eyebrow rv">Sensórica &amp; IoT</div>
  <h1 class="rv">De sensores<br>a <span class="accent">decisiones</span>.</h1>
  <p class="rv">Hardware, una plataforma para gestionarlo y la inteligencia artificial que lo hace predictivo — de punta a punta.</p>
</section>

<section class="acts-section">
  <div class="acts-layout">
    <div class="acts-progress-track"><div class="acts-progress-fill"></div></div>
    <div class="acts-copy">
      <div class="act" data-illustration="device">
        <span class="eyebrow">Acto 01 · Hardware</span>
        <h3>Sensores que capturan<br>la realidad de tu operación.</h3>
        <p>Equipos físicos diseñados o integrados a tu entorno — temperatura, movimiento, presencia, consumo, lo que tu operación necesite medir.</p>
      </div>
      <div class="act" data-illustration="dashboard">
        <span class="eyebrow">Acto 02 · Plataforma</span>
        <h3>Un panel donde todo<br>ese dato cobra sentido.</h3>
        <p>Dashboard en tiempo real, alertas, históricos — la plataforma de gestión que conecta cada sensor a una decisión.</p>
      </div>
      <div class="act" data-illustration="orbit">
        <span class="eyebrow">Acto 03 · Inteligencia Artificial</span>
        <h3>La IA que anticipa,<br>no solo reporta.</h3>
        <p>Detección de anomalías, mantenimiento predictivo, alertas inteligentes — el mismo motor de IA que usamos en <a href="inteligencia-artificial.html" style="color:var(--red-glow)">todo lo que construimos</a>.</p>
      </div>
    </div>
    <div class="acts-visual">
      <div class="ill-box" id="acts-illustration"></div>
    </div>
  </div>
</section>

<section class="portfolio-cta">
  <div><h2 class="rv">¿Qué necesitas<br>medir hoy?</h2></div>
  <div class="portfolio-cta-right rv">
    <a href="mailto:hola@helion.ec" class="btn-pill btn-pill--outline" style="border-color:var(--paper);color:var(--paper)">Escribir ahora →</a>
    <a href="index.html" class="btn-pill btn-pill--outline" style="border-color:var(--paper);color:var(--paper)">Volver al inicio</a>
  </div>
</section>

<footer>
  <div class="ft-row">
    <div class="ft-brand">
      <a href="/" class="ft-logo" aria-label="Helion">
        <svg class="logo-mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="43" y="6" width="14" height="18" fill="currentColor"/><rect x="43" y="76" width="14" height="18" fill="currentColor"/>
          <rect x="6" y="43" width="18" height="14" fill="currentColor"/><rect x="76" y="43" width="18" height="14" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,24) rotate(45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,24) rotate(-45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(76,76) rotate(-45)" fill="currentColor"/>
          <rect x="-4.5" y="-12" width="9" height="24" transform="translate(24,76) rotate(45)" fill="currentColor"/>
          <circle cx="50" cy="50" r="21" fill="#FF7A40"/>
        </svg>
        <span class="logo-word">HELION</span>
      </a>
      <p>Software a medida, IA aplicada y tecnología de hardware para empresas en Ecuador y el mundo.</p>
    </div>
    <div class="ft-col">
      <h5>Campos</h5>
      <ul>
        <li><a href="web-plataformas.html">Web &amp; Plataformas</a></li>
        <li><a href="inteligencia-artificial.html">Inteligencia Artificial</a></li>
        <li><a href="sensorica-iot.html">Sensórica &amp; IoT</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Empresa</h5>
      <ul>
        <li><a href="index.html#proceso">Cómo trabajamos</a></li>
        <li><a href="index.html#contacto">Contacto</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bottom">
    <span>© 2026 Helion Technology. Ecuador.</span>
    <span>DESARROLLADO CON PRECISIÓN.</span>
  </div>
</footer>

</main>

<script src="assets/vendor/gsap.min.js"></script>
<script src="assets/vendor/ScrollTrigger.min.js"></script>
<script type="module">
  import { bootstrapCommon } from './assets/js/main.js';
  import { initScrollytelling } from './assets/js/scrollytelling.js';

  bootstrapCommon();
  initScrollytelling();
</script>
</body>
</html>
```

- [ ] **Step 2: Verify in the browser**

Open `sensorica-iot.html` directly. Verify: dark portfolio hero, then the 3-act section — scrolling through it should swap the sticky illustration (device → dashboard → orbit) as each act's heading crosses the vertical center of the viewport, and the thin progress track on the left should fill from 0% to 100% as you scroll through the whole `.acts-section`. Confirm no horizontal overflow at 1440/1024/768/320 widths. Then toggle OS-level reduced-motion and reload: the progress track should jump straight to 100% and no ScrollTrigger-driven illustration swapping should occur (illustration stays on the first act's, `device`, statically) — this is expected per the `gsap.matchMedia()` guard in Task 11.

- [ ] **Step 3: Commit**

```bash
git add sensorica-iot.html
git commit -m "feat: add Sensorica & IoT scrollytelling portfolio page"
```

---

## Task 15: Cross-page QA pass

**Files:**
- Modify: any file, as fixes are found (no new files expected)

**Interfaces:**
- Consumes: all previous tasks' output. This task doesn't produce new interfaces — it's a verification gate before considering the turnaround done.

- [ ] **Step 1: Screenshot all 4 pages at 4 breakpoints**

Using the browser tooling, for each of `index.html`, `web-plataformas.html`, `inteligencia-artificial.html`, `sensorica-iot.html`, resize the viewport to 320, 768, 1024, and 1440 and screenshot. 16 screenshots total.
Expected: no horizontal scroll/overflow at any width, sidenav → mobile-nav switch happens cleanly at the 900px breakpoint on every page, all text remains legible (no color-contrast failures — spot-check `--red-glow` text on `--ink-dark` backgrounds, e.g. eyebrows and accent words, against WCAG AA for their font sizes).

- [ ] **Step 2: Reduced-motion pass**

Enable `prefers-reduced-motion: reduce` (OS setting or the browser tool's `colorScheme`/media emulation) and reload each of the 4 pages.
Expected: ticker marquee is static (no scroll) on Home, kinetic counters on Home's range/stats section show their final values immediately with no count-up animation, illustration pulse/rotate/wave/bar animations are frozen (all 4 illustration modules have a `prefers-reduced-motion: reduce` block per Tasks 4–7), and on `sensorica-iot.html` the acts progress bar is at 100% with no scroll-triggered illustration swapping.

- [ ] **Step 3: Cross-page link check**

Click every nav link (sidenav + mobile nav + footer link columns + in-page CTAs) on all 4 pages.
Expected: every link resolves to an existing page/section — no 404s, no dead `#` anchors. The 3 home-page field-teaser cards link to the 3 portfolio pages; each portfolio page's "Volver al inicio" link and logo link return to `index.html`; each portfolio page's integration-band cross-links (Web↔IA↔Sensórica) resolve correctly.

- [ ] **Step 4: Console error check**

Open the browser console on all 4 pages, reload each, scroll to the bottom.
Expected: zero errors. (Warnings from the Google Fonts stylesheet are acceptable; anything referencing a 404 asset, a missing export, or a thrown exception is not.)

- [ ] **Step 5: Run the counter-math unit tests one more time as a final regression check**

Run: `node --test test/counter-math.test.mjs`
Expected: PASS (5 tests, 0 failures) — confirms Task 3's pure logic wasn't broken by any later edit.

- [ ] **Step 6: Fix any issues found in Steps 1–4, then commit**

```bash
git add -A
git commit -m "fix: cross-page QA pass — breakpoints, reduced motion, links, console"
```

If Step 6 finds nothing to fix, skip the commit (no empty commits).