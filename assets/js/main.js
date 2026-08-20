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

export function bootstrapCommon() {
  initRevealOnScroll();
  initKineticCounters();
}
