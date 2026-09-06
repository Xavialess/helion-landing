# Helion — Editorial studio

A Spanish-language technology company website with a homepage and dedicated software, artificial intelligence, and IoT service pages.

## Preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then open http://127.0.0.1:4173.

No build step or package installation is required. Vercel's existing clean URL configuration is retained.

## Design and implementation

- `assets/design-system/` preserves the four supplied design reference files. The site imports `variables.css`; `theme.css` is the supplied Tailwind reference, not a runtime dependency.
- `assets/css/studio.css` contains the responsive layout and component styles.
- `assets/js/studio.js` handles the mobile menu, accessible solution tabs, and email composition.
- `assets/fonts/` contains locally hosted Inter fonts and the SIL Open Font License. Inter is the substitute suggested by the supplied reference; Haffer was not supplied.
- Product interfaces are explicitly illustrative, not claimed customer results. No invented testimonials or performance statistics are presented as company evidence.

The contact form validates input and opens an email draft addressed to `hola@helion.ec`. It does not submit to a backend or claim delivery. Visitors can also use the direct email link. A production form endpoint can be integrated separately if required.

The previous styles and scripts remain for reference; the new pages load only the new studio styles and script. A snapshot of pre-existing page edits was saved at `/private/tmp/helion-before-redesign` before implementation.

## Browser verification

Check the homepage and service pages at 1440, 768, 390, and 320 pixels. Exercise menu opening/closing (including Escape), solution tabs by pointer and arrow keys, native FAQ disclosures, required/email form validation, and internal links. Respect reduced-motion preferences.
