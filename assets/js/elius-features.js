/* Local, illustrative feature stories. No CRM access or external animation assets. */
(() => {
  const hub = document.querySelector('.ef-hub');
  if (!hub) return;
  const tabs = [...hub.querySelectorAll('[data-feature-tab]')];
  const panels = [...hub.querySelectorAll('[data-feature-panel]')];
  let selected = 0;
  const tablist = hub.querySelector('.ef-tabs');
  const mobile = window.matchMedia('(max-width: 700px)');
  const updateOrientation = () => tablist.setAttribute('aria-orientation', mobile.matches ? 'vertical' : 'horizontal');
  updateOrientation();
  mobile.addEventListener('change', updateOrientation);

  function select(index, focus = false) {
    selected = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
    hub.dispatchEvent(new Event('elius:feature-change'));
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === (mobile.matches ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
      if (event.key === (mobile.matches ? 'ArrowUp' : 'ArrowLeft')) next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next, true); }
    });
  });

  function followHash() {
    const hash = window.location.hash;
    if (hash === '#demo-ia') {
      select(2);
      hub.querySelector('.ef-chat-example').open = true;
      requestAnimationFrame(() => document.getElementById('demo-ia').scrollIntoView({ block: 'start', behavior: 'instant' }));
    }
    if (hash === '#interfaz' || hash === '#explorador') {
      hub.querySelector('.ef-explorer').open = true;
      requestAnimationFrame(() => hub.querySelector('.ef-explorer').scrollIntoView({ block: 'start', behavior: 'instant' }));
    }
  }
  followHash();
  window.addEventListener('hashchange', followHash);

  if (!window.gsap || !('IntersectionObserver' in window)) return;
  const gsap = window.gsap;
  const states = panels.map(() => ({ progress: 0, userPaused: false, visible: false }));
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const cleanups = [];
    panels.forEach((panel, index) => {
      const figure = panel.querySelector('.ef-figure');
      const scene = panel.querySelector('.ef-scene');
      const button = panel.querySelector('[data-feature-play]');
      const state = states[index];
      const savedProgress = state.progress;
      const reveals = [...scene.querySelectorAll('.ef-reveal')];
      const lines = [...scene.querySelectorAll('.ef-line')];
      let timeline;
      const updateLabel = () => {
        const label = timeline.progress() >= 1 ? 'Repetir animación' : timeline.paused() ? 'Continuar animación' : 'Pausar animación';
        button.textContent = label;
      };
      timeline = gsap.timeline({
        paused: true,
        defaults: { duration: 0.6, ease: 'power3.out' },
        onUpdate: () => { state.progress = timeline.progress(); },
        onComplete: updateLabel
      });
      timeline.fromTo(reveals, { autoAlpha: 0, y: 13 }, { autoAlpha: 1, y: 0, stagger: 0.65 }, 0.25);
      if (lines.length) {
        lines.forEach(line => {
          const length = line.getTotalLength();
          timeline.fromTo(line, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 0.6);
        });
      }
      const enriched = scene.querySelectorAll('.ef-enriched');
      if (enriched.length) timeline.fromTo(enriched, { backgroundColor: '#dceacb' }, { backgroundColor: 'transparent', duration: 1.1, stagger: 0.4 }, 1);
      const tracks = scene.querySelectorAll('.ef-travel-line');
      if (tracks.length) timeline.fromTo(tracks, { scaleY: 0 }, { scaleY: 1, duration: 0.7, stagger: 0.9, ease: 'power2.inOut' }, 0.7);
      timeline.fromTo(scene, { '--ef-progress': 0 }, { '--ef-progress': 1, duration: 4.6, ease: 'none' }, 0);
      timeline.progress(savedProgress, true).pause();
      button.hidden = false;
      updateLabel();

      function sync() {
        if (selected === index && state.visible && !document.hidden && !state.userPaused && timeline.progress() < 1) timeline.play();
        else timeline.pause();
        updateLabel();
      }
      function toggle() {
        if (timeline.progress() >= 1) {
          state.progress = 0;
          state.userPaused = false;
          timeline.restart(true).pause();
        } else state.userPaused = !timeline.paused();
        if (!state.visible) figure.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        sync();
      }
      const observer = new IntersectionObserver(entries => {
        state.visible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.25 });
      observer.observe(figure);
      button.addEventListener('click', toggle);
      hub.addEventListener('elius:feature-change', sync);
      document.addEventListener('visibilitychange', sync);
      cleanups.push(() => {
        observer.disconnect();
        button.removeEventListener('click', toggle);
        hub.removeEventListener('elius:feature-change', sync);
        document.removeEventListener('visibilitychange', sync);
        if (document.activeElement === button) tabs[selected].focus({ preventScroll: true });
        button.hidden = true;
      });
    });
    return () => cleanups.forEach(cleanup => cleanup());
  });
})();
