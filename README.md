# Helion — Problem solvers

A Spanish-language website positioning Helion as a technology solutions partner. Built on `codex/helion-problem-solvers`.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` and open http://127.0.0.1:4173.

Static HTML, CSS, and JavaScript; no build step or package installation required. The existing Vercel clean URL configuration is retained.

## Structure

- `index.html`: business challenge explorer, capabilities, process, FAQ, and contact.
- `web-plataformas.html`: business systems, customer experiences, and integrations.
- `inteligencia-artificial.html`: applied AI and automation.
- `sensorica-iot.html`: software/hardware and connected systems.
- `assets/css/connect.css` and `assets/js/connect.js`: current design and behavior.
- `assets/design-system-connect/`: unmodified copies of the four new reference documents; the site loads `variables.css`.
- `assets/fonts/`: locally hosted Inter and its SIL Open Font License.
- `docs/brand/problem-solver-positioning.md`: positioning and information architecture decisions.

The previous concept is saved on `codex/helion-editorial-studio` at `e84044c`. Its assets remain available but are not loaded by the new pages. Unrelated pre-existing edits have not been included in the concept commits.

## Contact

The form validates inputs and prepares an email to `hola@helion.ec`. The visitor sends the message from their own mail application. No backend delivery is claimed. A direct email link is also available.

## Verification

The four pages were browser-tested at 1440, 1024, 768, 390, and 320 pixels with no horizontal overflow. Checks cover internal links and anchors, mobile menu and Escape, tab selection and arrow-key navigation, challenge transfer into contact, native form validation, FAQ disclosures, reduced motion, and JavaScript errors.

## Motion

`assets/js/connect-motion.js` uses the bundled GSAP 3.12.5 core without external requests or extra plugins. It adds staggered hero entrances, one-time section reveals, solution-switch transitions, and animated signals through the SVG diagram. The diagram has a pause/resume control and stops when offscreen or when the browser tab is hidden. `gsap.matchMedia()` removes motion and restores static content when reduced motion is requested, including changes made while the page is open. All content and interactions remain available if GSAP fails to load.

The “Qué resolvemos” explorer includes three distinct HTML/SVG scenes: an operations workspace, a customer journey with loyalty, and a document-to-agent workflow ending in human review. Each scene plays a finite GSAP sequence on entry or selection, with an optional replay button. Inactive scenes are hidden from assistive technology; reduced motion presents each scene in its static completed state. Animations pause offscreen and revert cleanly when switching scenes.

## Detail-page experiences

The capability pages include interactive, animated scenarios: an AI processing flow, an integrated business workspace, and a sensor map with illustrative telemetry. Each supports keyboard-operated scenario tabs, finite replayable GSAP timelines, offscreen pausing, and reduced-motion cleanup. Warm Ember surfaces add restrained color across the site.

Vercel rewrites expose `/inteligencia`, `/sistemas`, and `/conectados`; the original HTML URLs remain available. Canonical links use the clean routes. A plain Python static server supports the original HTML pages; use `vercel dev` for rewrite-aware local navigation.

AI and digital-system scenario tabs render distinct compositions rather than reusing a single diagram: Documents / Attention / Operations use a processing core, chat with human handoff, and automation queue; Operation / Clients / Integrations use a business board, customer timeline, and integration map. Each scene has its own finite animation and is hidden from assistive technology when inactive.

Digital systems distinguish internal ERP/work management, customer loyalty, online sales/self-service, and integrations between existing platforms. The loyalty scenario illustrates a member app with visits and rewards. Connected-system tabs now have distinct sensor-map, equipment-health, and alert-response compositions, each with its own replayable animation. Readings, rewards, and statuses are illustrative examples.

## Elius product

`elius.html` is the dedicated Spanish product landing page, exposed as `/elius` by Vercel's existing `cleanUrls` configuration. The homepage includes a product introduction after the challenge explorer; all main pages link to Elius in the navigation and footer. The systems and AI pages also include a contextual product link.

`assets/css/elius.css` extends the existing Helion design; `assets/js/elius.js` controls six keyboard-accessible product views (companies, people, opportunities, tasks, contextual AI, and workflows), with local search and explorable record details. These use fictitious data and make no requests to the CRM. The dark product recreation and copy are based on the authenticated workspace reviewed on October 26, 2026: company/person/opportunity records, tasks, notes, dashboards, messages, contextual AI with record mentions and skills, and workflows. The meeting-preparation and email-to-opportunity scenarios use fictional data; they are not live CRM outputs or exact screenshots. No private customer data is embedded. Demo requests use the existing email preparation flow. Each company receives its own deployed and configured Elius instance on its own domain. The public pages route visitors to product information and demo requests; there is no shared app sign-in destination.

### AI action demonstration

An optional example inside the “Conectar procesos” feature at `/elius#demo-ia` illustrates a natural-language request becoming three linked records: an opportunity for fictional Altura Digital, a note, and a task to call Ana tomorrow at 10:00. This complements the existing interactive product views. `assets/js/elius-demo.js` uses the locally bundled GSAP core for a finite 14.5-second timeline that starts once on entry, pauses offscreen or in a hidden tab, and supports pause/resume and replay. Reduced motion (including preference changes while open), JavaScript failure, or missing GSAP presents the complete static result. A static screen-reader description accompanies the visual sequence; it never accesses the CRM or creates records.

Elius positioning: “AI native” describes intelligence integrated into CRM data, relationships, skills, and business processes. Keep the main product message broader than conversational interaction; the chat animation is one specific example, not the definition of the product.

The optional product explorer, opened through `/elius#interfaz`, follows the real workspace structure: compact navigation, data tables, stage-based opportunities, and a right-hand record detail panel. Searches ignore case and accents, update result/stage counts, and operate only on fictional local records. Detail panels support Escape and restore focus when closed; covered workspace controls are inert while a record is open. AI skill examples are explicitly predefined illustrations.

The main presentation at `/elius#producto` is a compact outcome-led feature hub: understand clients, advance opportunities, and connect processes. Each pairs focused product fragments with the concrete AI contribution; no separate AI-only product category is implied. `elius-features.css` and `elius-features.js` provide three finite 4.6-second HTML/SVG scenes using the existing local GSAP core. Motion pauses offscreen, in hidden tabs, and on explicit pause. Reduced motion shows complete static graphics. The detailed interface sits behind a native disclosure, and the original chat animation remains an optional example within the third feature. The repeated manifesto was removed; the deployment section emphasizes each company’s configured instance and domain.
