# Helion Website — Multi-Page Brand Turnaround

## Context

The current site is a single-file `index.html` landing page: cream/ink/orange-red palette, hard 2px borders, Space Grotesk/Mono/Archivo type, a flat 6-row services table, and a separate dark "AI" section. It reads as competent but soft and template-y, and it tries to cram everything Helion does into one flat list.

Helion's actual offering is broader than the current page communicates: business software (ERPs, CRMs, custom systems, mobile apps, web/SaaS), AI automation (dedicated role agents, chatbots, internal analyzers, integrations), and hardware-adjacent work (sensors, IoT, embedded systems) with AI layered on top of all of it.

This redesign turns the site into a small multi-page site: an abstract "fields of work" home page, and three dedicated, image-heavy, scrollytelling portfolio pages — one per field. Visual direction is inspired by modern SaaS marketing sites (e.g. Superside.com) as a *style reference* — dark-first sections, one bold accent color, pill buttons, kinetic stats, serif-italic accent words — reimplemented as an original Helion design, not a clone of any specific site's layout or copy.

## Goals

- Home page becomes abstract: three "fields of work" teasers, not full portfolios.
- Three dedicated routes, each a big/wide/graphic scrollytelling portfolio page: Web & Plataformas, Inteligencia Artificial, Sensórica & IoT.
- AI is a through-line on every route (each portfolio page has its own AI-integration angle), not confined to one page.
- Real "live" animation: kinetic stat counters, scroll-linked reveals, a scrollytelling pipeline narrative on the Sensórica page, animated original SVG illustrations (network/orbit/device motifs).
- Visual identity turnaround: dark-first alternating sections, one loud orange-red accent, pill-shaped buttons, Fraunces italic accent words mixed into bold Space Grotesk headlines.
- No fabricated content: no invented performance stats, no fake "case study" screenshots. Original illustrative graphics stand in for real project photography until the user has real work to show.

## Non-Goals

- Not building a CMS or making content editable outside the HTML/CSS/JS source.
- Not introducing a build step, bundler, or framework (no Astro/Vite/React). Stays static HTML/CSS/JS, deployable anywhere with zero build.
- Not fabricating client logos, testimonials, or "trusted by" claims — none exist yet.
- Not writing final, agency-polished Spanish copy for every microcopy string — section structure and representative copy are specified; exact wording can be refined during implementation without changing structure.
- Not redesigning email/other marketing collateral, only this site.

## Information Architecture

```
/                         Home — abstract, fields-of-work only
/web-plataformas.html     Portfolio: ERPs, CRMs, custom systems, mobile apps, web/SaaS (+ AI angle)
/inteligencia-artificial.html   Portfolio: catalog of AI solutions (+ integration angle)
/sensorica-iot.html       Portfolio: 3-act pipeline — Hardware → Plataforma → IA
```

Nav (present on every page): logo → `/`, then `Web & Plataformas`, `Inteligencia Artificial`, `Sensórica & IoT`, plus a `Hablemos →` CTA pill. Anchor links to Proceso/Contacto live only on the home page (they're home-page sections); the other pages get their own bottom CTA block instead of anchoring back to home.

## Design System

### Color tokens (extends existing `:root` tokens, does not replace brand colors)

| Token | Value | Use |
|---|---|---|
| `--cream` | `#F2EDE3` | existing — light section background, unchanged |
| `--ink` | `#111111` | existing — text on light sections, unchanged |
| `--ink-dark` | `#0C0D0B` | **new** — near-black base for dark sections (replaces flat `--ink` as a *background*) |
| `--paper` | `#F5F3EC` | **new** — near-white text on dark sections |
| `--red` | `#E8560C` | existing — accent on light sections, buttons |
| `--red-glow` | `#FF7A40` | **new** — brighter accent tint for text/strokes on dark backgrounds (contrast-safe on `#0C0D0B`) |
| `--gray` | `#767676` | existing — secondary text on light |
| `--gray-on-dark` | `rgba(245,243,236,.55)` | **new** — secondary text on dark |

No existing tokens are removed; `--cream`/`--ink`/`--red` keep working exactly as today for light sections. Dark sections are new, not a recolor of the whole site.

### Typography

Keep all three existing families — Space Grotesk (headings/body), Space Mono (labels/nav/tags/buttons/mono UI), Archivo 900 (logo wordmark only). **Add Fraunces** (variable serif, Google Fonts, italic) for a specific accent-word treatment inside headlines — one or two words per headline set in Fraunces italic + `--red-glow`/`--red`, e.g. "Sistemas que se *ajustan* a tu operación." This is the same device used in the approved mockups.

### Buttons

Replace the current sharp-cornered `.btn-fill`/`.btn-outline`/`.btn-white`/`.btn-ghost-w` with pill-shaped equivalents (`border-radius: 999px`), keeping the existing uppercase Space Mono label style (this is core Helion voice — unchanged). Solid pill: `--red` or `--red-glow` background depending on section. Outline pill: 1.5px border, transparent background. Hover: soft scale (1.02) + shadow/glow transition, not the current hard color-swap-only hover.

### Illustration system

Original hand-built inline SVG, not stock icons or generated/AI images, and not photography (none exists yet — see Content Honesty Policy below). One consistent visual vocabulary across the whole site:

- **Nodes** = circles (agents, entities, sensors)
- **Connections** = thin 1–1.5px stroke lines (data flow, integration)
- **Orbits** = ellipses (AI "thinking"/processing motifs)
- Stroke/fill color: `--red-glow` on dark sections, `--red` on light sections, at varying opacity for depth (0.4–1.0)
- Four illustration "characters" reused across pages: **network** (business systems/ERP-CRM), **orbit** (AI agents), **device** (hardware/sensor), **dashboard** (management platform) — each its own small JS module (see File Structure) so they're reusable across Home teasers and the portfolio pages without duplication.

During implementation, use the `frontend-design` skill to keep execution quality high and avoid generic-template output, and the `gsap-skills` skills (`gsap-core`, `gsap-scrolltrigger`, `gsap-performance`) for the scroll-linked animation work described below.

### Motion principles

- Kinetic stat counters: count up from 0 on scroll-into-view (IntersectionObserver-gated), respecting `prefers-reduced-motion` (skip straight to final value, no animation).
- Section reveal-on-scroll: extend the existing `.rv`/IntersectionObserver pattern already in the codebase to all new sections.
- Illustrations animate continuously but subtly (traveling pulse dot along network lines, slow orbit rotation, gentle glow drift) — all CSS `transform`/`opacity` keyframes or GSAP, never layout-triggering properties, per the animation-only-properties rule.
- Scrollytelling (portfolio pages only): GSAP ScrollTrigger pins a sticky illustration panel while act-copy scrolls past it, morphing the illustration per act; a thin connecting progress line fills as the user scrolls. Self-hosted GSAP + ScrollTrigger (downloaded into `assets/vendor/`, not a CDN dependency), loaded via plain `<script>` tags — no build step required.
- Everything above degrades gracefully under `prefers-reduced-motion: reduce`: ScrollTrigger pinning is disabled (GSAP's `matchMedia` handles this cleanly), ticker marquee stops, counters resolve instantly.

## Technical Approach

### File structure

```
/
  index.html
  web-plataformas.html
  inteligencia-artificial.html
  sensorica-iot.html
  favicon.svg
  assets/
    css/
      tokens.css        — design tokens (colors, type, spacing), shared
      base.css           — reset, nav, footer, buttons, ticker; shared across all 4 pages
      home.css            — home-only section styles
      portfolio.css        — shared portfolio-page layout (acts, sticky visual, chips, stat grid)
    js/
      main.js             — shared: reveal-on-scroll, nav, ticker, kinetic counters
      scrollytelling.js     — GSAP ScrollTrigger setup, used by the 3 portfolio pages
      illustrations/
        network.js
        orbit.js
        device.js
        dashboard.js
    vendor/
      gsap.min.js
      ScrollTrigger.min.js
```

This replaces the single 750-line `index.html` file with multiple small, focused files — justified now because there are 4 pages sharing a design system, not one static page. This is a deliberate departure from the prior single-file approach, made because the project's shape changed (multi-page site), not a speculative refactor.

### Multi-page without a build step — the trade-off

No framework or static-site generator is introduced (Astro, 11ty, etc. were considered and rejected — see Non-Goals). That means the shared `<nav>` and `<footer>` markup is **duplicated** across the 4 HTML files rather than templated from one partial. For a 4-page site this is a reasonable, honest trade-off: editing nav copy means editing 4 files, but there's no build step, no Node dependency, and the site stays deployable by dragging the folder onto any static host. If the site grows well past 4 pages, revisit introducing a lightweight generator then — not now.

### Content Honesty Policy

No fabricated client logos, testimonials, "trusted by N companies" claims, invented performance metrics (e.g. "40% faster", "94% ROI"), or fake case-study screenshots anywhere on the site. Stats used are either: (a) true by definition (e.g. "0 plantillas genéricas", "100% código tuyo"), or (b) real numbers the user supplies. Portfolio pages use original illustrative graphics, clearly presented as capability/concept illustrations, not as photos of delivered client work — the user can replace these with real project photography later once available.

## Page 1: Home (`index.html`)

Sections, dark/cream alternating rhythm:

1. **Hero** (dark `--ink-dark`) — existing content pattern, restyled: tag, H1 with one Fraunces-italic accent word, subtext, pill CTA row.
2. **Ticker** (cream) — existing marquee mechanic kept, restyled to cream background, copy updated to reflect the full capability breadth (ERP, CRM, Apps, Agentes IA, Chatbots, Sensórica, IoT, Web, Consultoría...) as ambient texture.
3. **Fields of work** (dark) — **three abstract teasers**, not portfolios: Business Tech & Web, Inteligencia Artificial, Sensórica & IoT. Each teaser: label, short headline (with the Fraunces accent word), 1–2 line abstract description, small animated illustration (network/orbit/device respectively), "Explorar →" linking to its dedicated route. No sub-item grids or detailed feature lists here — that detail lives on the routes.
4. **Range + Stats** (cream) — the "más allá de los dos pilares" chip row (Consultoría Tecnológica folded in as a chip here since it's cross-cutting, not a fourth field) + the definitional stat grid, per the approved mockup.
5. **Process** (dark) — existing 4-step content, restyled with pill step badges.
6. **CTA** (red, unchanged bold treatment) — pill buttons.
7. **Footer** (near-black, matches hero) — existing content, restyled.

## Page 2: Web & Plataformas (`web-plataformas.html`)

Portfolio-style, big/wide, image-heavy (illustration-heavy, per Content Honesty Policy). Structure:

1. Header hero: label "Web & Plataformas", headline, short intro.
2. Capability showcase grid: ERP, CRM, Sistemas a Medida, Apps Móviles, SaaS/E-commerce/Portales — each a large card with its own network-illustration variant, name, description.
3. **AI-integration section** (this route's through-line moment): how AI layers onto business systems — copilots inside ERPs/CRMs, embedded analytics, automation hooks. Uses the `orbit` illustration to visually tie back to the AI motif.
4. Closing CTA block (pill buttons, same as home CTA pattern).

## Page 3: Inteligencia Artificial (`inteligencia-artificial.html`)

Portfolio-style catalog of AI solutions. Structure:

1. Header hero: label "Inteligencia Artificial", headline, short intro.
2. Solution catalog grid: Agentes Dedicados (por rol), Chatbots / Atención al Cliente, Analizadores Internos, Integraciones IA (ERP/CRM/Apps) — each a large illustrated card using the `orbit` motif with per-card variation.
3. **Integration-everywhere section**: explicit statement + visual that AI isn't a bolt-on, it threads through Web/Plataformas and Sensórica work too, with links to those two routes.
4. Closing CTA block.

## Page 4: Sensórica & IoT (`sensorica-iot.html`)

The scrollytelling flagship page. Structure (per approved wireframe):

1. Header hero: label "Sensórica & IoT", headline, short intro.
2. **3-act pinned scrollytelling sequence**, GSAP ScrollTrigger:
   - **Acto 01 · Hardware** — sensor/device copy, `device` illustration
   - **Acto 02 · Plataforma** — management/monitoring dashboard copy, `dashboard` illustration
   - **Acto 03 · Inteligencia Artificial** — predictive/anomaly-detection copy, `orbit` illustration
   - A thin vertical progress line fills as the user scrolls through the three acts; the sticky illustration panel morphs between the three illustration modules as each act enters view.
3. Closing CTA block.

## Shared Components

- **Nav**: sidenav on desktop (existing pattern) restyled dark, mobile nav unchanged in behavior, both get the 3 new route links plus logo→home.
- **Footer**: restyled to `--ink-dark`, content structure unchanged (brand blurb + link columns), pill-styled where buttons appear.
- **Ticker**: existing marquee JS/CSS mechanic reused as-is, only visual restyle + copy update.

## Testing

Per the project's web testing rules: screenshot all 4 pages at 320/768/1024/1440 in the browser, verify:
- Reduced-motion fallback disables ScrollTrigger pinning, counters, and marquee animation on all 4 pages
- Nav routes correctly between all 4 pages at each breakpoint (sidenav → mobile nav switch at 900px, unchanged threshold)
- Kinetic counters count up once and don't re-trigger on re-scroll
- Sensórica page's pinned scrollytelling doesn't break layout or cause horizontal overflow at any breakpoint
- Color contrast of `--red-glow` text/labels against `--ink-dark` backgrounds meets AA for the sizes used
- No console errors, no broken links between the 4 pages
