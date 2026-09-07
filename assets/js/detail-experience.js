(() => {
  const lab = document.querySelector('[data-lab]');
  if (!lab) return;
  const tabs = [...lab.querySelectorAll('[data-lab-tab]')];
  function select(index) {
    lab.querySelectorAll('[data-detail-scene]').forEach(scene => {
      scene.hidden = Number(scene.dataset.detailScene) !== index;
    });
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    lab.querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', `lab-tab-${index}`);
    lab.dispatchEvent(new CustomEvent('helion:lab-change'));
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next); tabs[next].focus(); }
    });
  });
  const gsap = window.gsap;
  if (!gsap || !('IntersectionObserver' in window)) return;
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', context => {
    let timeline;
    let visible = false;
    const replay = lab.querySelector('.lab-replay');
    replay.hidden = false;
    context.add('animate', () => {
      timeline?.revert();
      timeline = gsap.timeline({ paused: !visible || document.hidden });
      const kind = lab.dataset.lab;
      const scene = lab.querySelector('[data-detail-scene]:not([hidden])') || lab;
      const variant = Number(scene.dataset.detailScene || 0);
      if (variant > 0) {
        timeline.from(scene.querySelector('.unique-canvas'), { y: 12, autoAlpha: 0, duration: 0.4, ease: 'power2.out' });
        if (kind === 'ai' && variant === 1) {
          timeline.from(scene.querySelectorAll('.chat-message, .context-lookup'), { y: 12, autoAlpha: 0, duration: 0.45, stagger: 0.45 }, 0.3);
          timeline.from(scene.querySelectorAll('.context-tile'), { x: 14, autoAlpha: 0, duration: 0.45, stagger: 0.5 }, 0.8);
          timeline.from(scene.querySelector('.handoff-result'), { y: 10, autoAlpha: 0, duration: 0.5 }, 2.2);
        } else if (kind === 'ai') {
          timeline.from(scene.querySelectorAll('.inbox-item'), { x: -12, autoAlpha: 0, duration: 0.4, stagger: 0.18 }, 0.3);
          timeline.from(scene.querySelectorAll('.agent-task'), { y: 10, autoAlpha: 0, duration: 0.45, stagger: 0.3 }, 0.9);
          timeline.from(scene.querySelector('.approval-ticket'), { y: 14, autoAlpha: 0, duration: 0.5 }, 2);
          timeline.from(scene.querySelectorAll('.automation-footer i'), { scaleX: 0, duration: 0.6, stagger: 0.4 }, 0.7);
        } else if (kind === 'iot' && variant === 1) {
          timeline.from(scene.querySelector('.machine-outline'), { autoAlpha: 0, duration: 0.6 }, 0.2);
          timeline.from(scene.querySelector('.machine-rotor'), { rotation: -150, svgOrigin: '348 138', duration: 1.8, ease: 'power2.out' }, 0.3);
          const wave = scene.querySelector('.vibration-wave path');
          timeline.fromTo(wave, { strokeDasharray: wave.getTotalLength(), strokeDashoffset: wave.getTotalLength() }, { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' }, 0.5);
          timeline.from(scene.querySelectorAll('.equipment-fact'), { y: 10, autoAlpha: 0, duration: 0.4, stagger: 0.25 }, 1);
          timeline.from(scene.querySelector('.maintenance-note'), { y: 12, autoAlpha: 0, duration: 0.5 }, 2);
        } else if (kind === 'iot') {
          const signal = scene.querySelector('.threshold-signal');
          timeline.fromTo(signal, { strokeDasharray: signal.getTotalLength(), strokeDashoffset: signal.getTotalLength() }, { strokeDashoffset: 0, duration: 1.2, ease: 'none' }, 0.2);
          timeline.from(scene.querySelector('.threshold-point'), { autoAlpha: 0, duration: 0.3 }, 0.95);
          timeline.from(scene.querySelector('.notification-card'), { x: 15, autoAlpha: 0, duration: 0.5 }, 1.2);
          timeline.from(scene.querySelectorAll('.response-step'), { y: 10, autoAlpha: 0, duration: 0.4, stagger: 0.3 }, 1.7);
        } else if (variant === 1) {
          timeline.from(scene.querySelector('.loyalty-phone'), { y: 16, autoAlpha: 0, duration: 0.5 }, 0.15);
          timeline.from(scene.querySelectorAll('.visit-stamps i'), { scale: 0, rotation: -30, duration: 0.4, stagger: 0.2, ease: 'back.out(1.3)' }, 0.55);
          timeline.from(scene.querySelector('.reward-coupon'), { y: 15, autoAlpha: 0, duration: 0.5 }, 1.6);
          timeline.from(scene.querySelectorAll('.loyalty-event'), { x: 12, autoAlpha: 0, duration: 0.4, stagger: 0.4 }, 0.6);
        } else {
          timeline.from(scene.querySelectorAll('.integration-node'), { autoAlpha: 0, duration: 0.45, stagger: 0.2 }, 0.2);
          scene.querySelectorAll('.integration-wires path').forEach((path, i) => {
            const length = path.getTotalLength();
            timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut' }, 0.45 + i * 0.2);
          });
          timeline.from(scene.querySelectorAll('.integration-log > div'), { y: 10, autoAlpha: 0, duration: 0.45, stagger: 0.35 }, 1);
        }
        return;
      }
      timeline.from(scene.querySelectorAll('.lab-step'), {
        y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out'
      });
      if (kind === 'ai') {
        timeline.from(scene.querySelectorAll('.lab-orbit'), { scale: 0.75, autoAlpha: 0, svgOrigin: '130 130', duration: 1, stagger: 0.15, ease: 'power2.out' }, 0.25);
        timeline.fromTo(scene.querySelector('.lab-scan'), { y: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.45);
        timeline.to(scene.querySelector('.lab-scan'), { y: 60, duration: 1.2, ease: 'power1.inOut' }, 0.6);
        timeline.to(scene.querySelector('.lab-scan'), { opacity: 0, duration: 0.2 }, 1.8);
        timeline.from(scene.querySelectorAll('.engine-steps span'), { y: 8, autoAlpha: 0, duration: 0.4, stagger: 0.25 }, 1);
        timeline.from(scene.querySelector('.output-check'), { scale: 0.5, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.2)' }, 1.7);
        timeline.from(scene.querySelector('.review-line'), { autoAlpha: 0, duration: 0.5 }, 2.2);
      } else if (kind === 'systems') {
        timeline.from(scene.querySelector('.operations-summary'), { y: 8, autoAlpha: 0, duration: 0.45 }, 1.6);
        timeline.from(scene.querySelectorAll('.task-bottom'), { y: 6, autoAlpha: 0, duration: 0.5, stagger: 0.3 }, 1);
      } else {
        const wires = scene.querySelectorAll('.sensor-wires path');
        wires.forEach((path, i) => {
          const length = path.getTotalLength();
          timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 0.3 + i * 0.2);
        });
        timeline.from(scene.querySelectorAll('.sensor-points circle'), { scale: 0, transformOrigin: '50% 50%', duration: 0.45, stagger: 0.2 }, 0.15);
        const chart = scene.querySelector('.signal-chart path');
        timeline.fromTo(chart, { strokeDasharray: chart.getTotalLength(), strokeDashoffset: chart.getTotalLength() }, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' }, 1);
        timeline.from(scene.querySelector('.telemetry-result'), { y: 8, autoAlpha: 0, duration: 0.5 }, 1.9);
      }
    });
    const sync = () => {
      if (visible && !document.hidden) timeline?.play();
      else timeline?.pause();
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && !timeline) context.animate();
      else sync();
    }, { threshold: 0.1 });
    observer.observe(lab);
    replay.addEventListener('click', context.animate);
    lab.addEventListener('helion:lab-change', context.animate);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      replay.hidden = true;
      replay.removeEventListener('click', context.animate);
      lab.removeEventListener('helion:lab-change', context.animate);
      document.removeEventListener('visibilitychange', sync);
    };
  });
})();
