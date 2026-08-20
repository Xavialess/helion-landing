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
