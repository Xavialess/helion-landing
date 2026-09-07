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
