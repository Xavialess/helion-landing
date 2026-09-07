/* Motion is progressive enhancement: content remains usable without GSAP. */
(() => {
  const gsap = window.gsap;
  if (!gsap || !('IntersectionObserver' in window)) return;

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', context => {
    const observers = [];
    const cleanups = [];
    const intro = document.querySelector('.hero, .detail-hero');
    if (intro) {
      gsap.from(intro.querySelectorAll('.hero-eyebrow, h1, .hero-sub, .detail-hero > p, .arrow-button'), {
        y: 22, autoAlpha: 0, duration: 0.85, stagger: 0.11,
        ease: 'power3.out', clearProps: 'transform,opacity,visibility'
      });
    }

    // Register observer-triggered animations with matchMedia for automatic reversion.
    context.add('reveal', element => {
      gsap.from(element, {
        y: 24, autoAlpha: 0, duration: 0.75, ease: 'power3.out',
        clearProps: 'transform,opacity,visibility'
      });
    });
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        context.reveal(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.positioning, .section-intro, .capability, .connected-band, .process-grid article, .faq-grid, .contact, .detail-grid article, .detail-principle').forEach(element => revealObserver.observe(element));
    observers.push(revealObserver);

    const preview = document.querySelector('.product-preview');
    if (preview) {
      let sceneAnimation;
      let previewInView = false;
      const replay = preview.querySelector('.scene-replay');
      replay.hidden = false;
      context.add('animateScene', () => {
        // Revert interrupted scenes before rebuilding, including rapid tab changes.
        sceneAnimation?.revert();
        const scene = preview.querySelector('[data-scene]:not([hidden])');
        const index = Number(scene.dataset.scene);
        sceneAnimation = gsap.timeline({ paused: !previewInView || document.hidden });
        sceneAnimation.fromTo(scene, { y: 15, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out'
        });
        if (index === 0) {
          sceneAnimation.from(scene.querySelectorAll('.preview-metrics > div'), {
            y: 12, autoAlpha: 0, duration: 0.4, stagger: 0.12
          }, 0.2);
          sceneAnimation.from(scene.querySelectorAll('.preview-table > div:not(:first-child)'), {
            x: 18, autoAlpha: 0, duration: 0.45, stagger: 0.3, ease: 'power2.out'
          }, 0.55);
          sceneAnimation.from(scene.querySelectorAll('.state'), {
            scale: 0.75, autoAlpha: 0, duration: 0.3, stagger: 0.3
          }, 0.85);
          sceneAnimation.from(scene.querySelector('.ai-note'), { y: 8, autoAlpha: 0, duration: 0.4 }, 1.8);
        } else if (index === 1) {
          sceneAnimation.from(scene.querySelector('.customer-card'), { y: 15, autoAlpha: 0, duration: 0.45 }, 0.15);
          sceneAnimation.fromTo(scene.querySelector('circle'), { strokeDasharray: 202, strokeDashoffset: 202 }, {
            strokeDashoffset: 0, duration: 1, ease: 'power2.inOut'
          }, 0.35);
          sceneAnimation.from(scene.querySelectorAll('.journey-track i'), {
            scaleX: 0, duration: 0.5, stagger: 0.3, ease: 'power2.inOut'
          }, 0.55);
          sceneAnimation.from(scene.querySelector('.message-card'), { x: -18, autoAlpha: 0, duration: 0.5 }, 1.15);
          sceneAnimation.from(scene.querySelector('.loyalty-card'), { y: 18, autoAlpha: 0, duration: 0.5 }, 1.6);
          sceneAnimation.from(scene.querySelectorAll('.loyalty-stamps span'), {
            scale: 0, rotation: -35, duration: 0.4, stagger: 0.12, ease: 'back.out(1.5)'
          }, 1.95);
        } else {
          sceneAnimation.from(scene.querySelector('.document-card'), { y: 14, autoAlpha: 0, duration: 0.45 }, 0.15);
          sceneAnimation.fromTo(scene.querySelector('.scan-line'), { y: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.4);
          sceneAnimation.to(scene.querySelector('.scan-line'), { y: 145, duration: 1.2, ease: 'power1.inOut' }, 0.55);
          sceneAnimation.to(scene.querySelector('.scan-line'), { opacity: 0, duration: 0.2 }, 1.75);
          sceneAnimation.from(scene.querySelectorAll('.agent-node'), {
            x: 15, autoAlpha: 0, duration: 0.45, stagger: 0.4
          }, 0.8);
          sceneAnimation.from(scene.querySelector('.review-card'), { y: 16, autoAlpha: 0, duration: 0.5 }, 2.05);
          sceneAnimation.from(scene.querySelector('.ai-scene-note'), { autoAlpha: 0, duration: 0.4 }, 2.45);
        }
      });
      context.add('changeSolution', () => {
        const targets = document.querySelectorAll('.solution-copy h3, .solution-copy > p, .solution-tags > span');
        gsap.killTweensOf(targets);
        gsap.fromTo(targets, { y: 10, autoAlpha: 0.45 }, {
          y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.035,
          ease: 'power2.out', clearProps: 'transform,opacity,visibility'
        });
        context.animateScene();
      });
      const syncPreview = () => {
        if (previewInView && !document.hidden) sceneAnimation?.play();
        else sceneAnimation?.pause();
      };
      const previewObserver = new IntersectionObserver(entries => {
        previewInView = entries[0].isIntersecting;
        if (!sceneAnimation && previewInView) context.animateScene();
        else syncPreview();
      }, { threshold: 0.15 });
      previewObserver.observe(preview);
      observers.push(previewObserver);
      replay.addEventListener('click', context.animateScene);
      document.addEventListener('helion:solution-change', context.changeSolution);
      document.addEventListener('visibilitychange', syncPreview);
      cleanups.push(() => {
        replay.hidden = true;
        replay.removeEventListener('click', context.animateScene);
        document.removeEventListener('helion:solution-change', context.changeSolution);
        document.removeEventListener('visibilitychange', syncPreview);
      });
    }

    const diagram = document.querySelector('.system-visual');
    if (diagram) {
      const svg = diagram.querySelector('svg');
      const paths = [...svg.querySelectorAll('.tangled path, .ordered path')];
      const core = svg.querySelector('.core');
      const control = document.createElement('button');
      control.type = 'button';
      control.className = 'motion-toggle';
      control.textContent = 'Pausar animación';
      control.setAttribute('aria-pressed', 'false');
      diagram.append(control);
      let inView = false;
      let userPaused = false;
      const entrance = gsap.timeline({ paused: true });
      paths.forEach((path, i) => {
        const length = path.getTotalLength();
        entrance.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, {
          strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut',
          clearProps: 'strokeDasharray,strokeDashoffset'
        }, i < 9 ? i * 0.045 : 1.25 + (i - 9) * 0.07);
      });
      entrance.fromTo(core, { scale: 0.88, svgOrigin: '540 180' }, {
        scale: 1, duration: 0.7, ease: 'power2.out', clearProps: 'transform'
      }, 0.85);

      const flow = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8 });
      const particles = [];
      // Sample existing SVG geometry; no MotionPath or DrawSVG dependency is needed.
      [0, 4, 8].forEach((inputIndex, i) => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', '#fd5321');
        dot.setAttribute('opacity', '0');
        dot.setAttribute('aria-hidden', 'true');
        dot.setAttribute('class', 'flow-particle');
        svg.append(dot);
        particles.push(dot);
        const input = paths[inputIndex];
        const output = paths[9 + i * 2];
        const cursor = { progress: 0 };
        const paint = (path, progress) => {
          const point = path.getPointAtLength(path.getTotalLength() * progress);
          dot.setAttribute('cx', point.x);
          dot.setAttribute('cy', point.y);
        };
        const start = i * 0.42;
        flow.to(cursor, {
          progress: 1, duration: 2, ease: 'none',
          onStart: () => dot.setAttribute('opacity', '1'),
          onUpdate: () => paint(input, cursor.progress)
        }, start);
        // The signal disappears inside Helion, then emerges on the ordered side.
        flow.set(dot, { attr: { opacity: 0 } }, start + 2);
        flow.fromTo(cursor, { progress: 0 }, {
          progress: 1, duration: 1.65, ease: 'power1.inOut', immediateRender: false,
          onStart: () => dot.setAttribute('opacity', '1'),
          onUpdate: () => paint(output, cursor.progress)
        }, start + 2.35);
        flow.to(dot, { attr: { opacity: 0 }, duration: 0.3 }, start + 4);
      });
      const sync = () => {
        const running = inView && !document.hidden && !userPaused;
        if (running) {
          entrance.play();
          if (entrance.progress() === 1) flow.play();
        } else {
          entrance.pause();
          flow.pause();
        }
      };
      entrance.eventCallback('onComplete', sync);
      control.addEventListener('click', () => {
        userPaused = !userPaused;
        control.setAttribute('aria-pressed', String(userPaused));
        control.textContent = userPaused ? 'Reanudar animación' : 'Pausar animación';
        sync();
      });
      const diagramObserver = new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.15 });
      diagramObserver.observe(diagram);
      observers.push(diagramObserver);
      document.addEventListener('visibilitychange', sync);
      cleanups.push(() => {
        document.removeEventListener('visibilitychange', sync);
        control.remove();
        particles.forEach(dot => dot.remove());
      });
    }
    return () => {
      observers.forEach(observer => observer.disconnect());
      cleanups.forEach(cleanup => cleanup());
    };
  });
})();
