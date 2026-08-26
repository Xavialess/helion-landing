# Fields Section — Business-Question Reframe

## Context

User feedback (in Spanish, paraphrased): the homepage reads as a company describing what it builds, not what business problem it solves. The suggestion was to lead with questions like "¿Tu negocio requiere fidelizar a tus clientes?" or "¿Quieres evaluar qué procesos de tu negocio puedes optimizar con IA?" instead of naming technology categories.

Scope: the "Campos de trabajo" section on the homepage (`index.html`, `#campos`), which currently presents three field cards (Web & Plataformas, Inteligencia Artificial, Sensórica & IoT) with category names as headlines. No other section, and no other page, is in scope for this change.

## Goal

Reframe the three field cards so each leads with a business-problem question, while keeping the field name visible (for navigation clarity and consistency with the sidenav/footer) as a small label rather than the headline.

## Design

**Card structure change** — each `.field-card` gets a small kicker label above the headline using the existing `.eyebrow` class (already used elsewhere in the page for identical small-caps labeled text; no new CSS needed). The current `h3` (field name) becomes this kicker; the question becomes the new `h3`. The description `<p>` and "Explorar →" link are unchanged.

Markup shape per card:
```html
<a href="..." class="field-card rv">
  <div class="ill-box" id="..."></div>
  <span class="eyebrow">Field Name</span>
  <h3>Business question?</h3>
  <p>Existing capability description — unchanged.</p>
  <span class="go">Explorar →</span>
</a>
```

**Copy — three cards:**

1. **Web & Plataformas**
   - Eyebrow: `Web & Plataformas`
   - H3: `¿Tu negocio necesita fidelizar clientes y ordenar su operación?`
   - P: unchanged — `ERPs, CRMs, sistemas a medida, apps móviles y plataformas web — con IA integrada.`

2. **Inteligencia Artificial**
   - Eyebrow: `Inteligencia Artificial`
   - H3: `¿Quieres habilitar IA en tus aplicaciones de negocio?`
   - P: unchanged — `Agentes dedicados, chatbots, analizadores internos e integraciones IA.`

3. **Sensórica & IoT**
   - Eyebrow: `Sensórica & IoT`
   - H3: `¿Necesitas monitorear y controlar tus equipos en tiempo real?`
   - P: unchanged — `Hardware, plataforma de gestión e IA predictiva, de punta a punta.`

**Section header copy** (`.fields-head`, above the cards) — reframed to match:
- Eyebrow: `Campos de trabajo` → `¿Qué problema quieres resolver?`
- H2: `Tres formas de construir<br>tu ventaja.` → `Empieza por el problema,<br>no por la tecnología.`
- Intro paragraph: `Elige el campo que más se acerca a lo que necesitas — cada uno tiene su propio espacio con todo el detalle.` → `Elige la pregunta que más se parece a la tuya — cada campo tiene su propio espacio con todo el detalle.`

## Out of scope

- The hero section, ticker, "range" (stats/consultoría) section, process section, and CTA are untouched.
- The three destination pages (`web-plataformas.html`, `inteligencia-artificial.html`, `sensorica-iot.html`) are untouched — this is a homepage-entry-point reframe only.
- No new CSS classes or files; `.eyebrow` is reused as-is.

## Testing

Visual check only (copy + minor markup change, no layout/CSS changes): reload the homepage in the browser preview, confirm the three cards render eyebrow → question → description → link in the existing card style at desktop and mobile widths, and confirm no layout shift or overflow from the added eyebrow line.
