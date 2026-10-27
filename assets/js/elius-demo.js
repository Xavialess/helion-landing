/* A self-contained illustration: no requests, CRM access, or record creation. */
(() => {
  const section = document.querySelector('.elius-demo');
  if (!section || !window.gsap || !('IntersectionObserver' in window)) return;

  const gsap = window.gsap;
  const theater = section.querySelector('.ed-theater');
  const prompt = section.querySelector('.ed-prompt-text');
  const fullPrompt = prompt.textContent;
  const play = section.querySelector('.ed-play');
  const replay = section.querySelector('.ed-replay');
  const playLabel = section.querySelector('[data-demo-play-label]');
  const playIcon = play.querySelector('[aria-hidden]');
  const phase = section.querySelector('[data-demo-phase]');
  const count = section.querySelector('[data-demo-count]');
  const announcement = section.querySelector('[data-demo-announcement]');
  const records = [...section.querySelectorAll('[data-demo-record]')];
  const paths = [...section.querySelectorAll('.ed-connections path')];
  const media = gsap.matchMedia();
  const playback = { progress: 0, started: false, userPaused: false, manuallyStarted: false };

  media.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 700px)' }, context => {
    if (!context.conditions.motion) return;
    const isMobile = context.conditions.mobile;
    theater.setAttribute('data-demo-enhanced', '');
    let inView = false;
    const restoreProgress = playback.progress;
    const typing = { characters: 0 };
    const beats = { context: 4.3, opportunity: 6.5, note: 8.4, task: 10.3, done: 12.5 };
    const phaseAt = time => {
      if (time >= beats.done) return 'Todo conectado. Listo para continuar.';
      if (time >= beats.task) return '03 / Programando la tarea · Mañana, 10:00';
      if (time >= beats.note) return '02 / Guardando el contexto en una nota';
      if (time >= beats.opportunity) return '01 / Creando la oportunidad';
      if (time >= beats.context) return 'Identificando el cliente y conectando el contexto';
      return 'Una petición, en tus propias palabras';
    };
    const updateControls = () => {
      const paused = timeline.paused();
      playLabel.textContent = paused ? 'Continuar' : 'Pausar';
      playIcon.textContent = paused ? '▷' : 'Ⅱ';
      play.setAttribute('aria-label', paused ? 'Continuar demostración' : 'Pausar demostración');
    };
    const timeline = gsap.timeline({
      paused: true,
      defaults: { duration: 0.65, ease: 'power3.out' },
      onUpdate: () => {
        playback.progress = timeline.progress();
        const time = timeline.time();
        phase.textContent = phaseAt(time);
        count.textContent = String([beats.opportunity, beats.note, beats.task].filter(beat => time >= beat + 0.5).length);
        theater.toggleAttribute('data-demo-active', time < 3.9);
      },
      onComplete: () => {
        playback.progress = 1;
        if (document.activeElement === play) replay.focus({ preventScroll: true });
        play.hidden = true;
        if (playback.manuallyStarted) announcement.textContent = 'Demostración completada: oportunidad creada, nota guardada y tarea para llamar a Ana mañana a las 10:00. Los tres registros están vinculados a Altura Digital.';
      }
    });

    gsap.set([section.querySelector('.ed-understood'), section.querySelector('.ed-response'), section.querySelector('.ed-resolution')], { autoAlpha: 0, y: 15 });
    gsap.set(records, { autoAlpha: isMobile ? 0 : 0.12, y: 15 });
    if (isMobile) gsap.set(section.querySelector('.ed-records'), { autoAlpha: 0 });
    paths.forEach(path => gsap.set(path, { strokeDasharray: path.getTotalLength(), strokeDashoffset: path.getTotalLength() }));
    gsap.set('.elius-demo .ed-progress > span', { scaleX: 0 });
    prompt.textContent = '';
    phase.textContent = phaseAt(0);
    count.textContent = '0';
    play.hidden = false;
    replay.hidden = false;

    timeline.addLabel('request', 0)
      .to(typing, {
        characters: fullPrompt.length, duration: 3.5, ease: 'none',
        snap: { characters: 1 },
        onUpdate: () => { prompt.textContent = fullPrompt.slice(0, typing.characters); }
      }, 0.3)
      .fromTo(section.querySelector('.ed-send-icon'), { scale: 0.8 }, { scale: 1, duration: 0.35 }, 3.8)
      .addLabel('context', beats.context)
      .to(section.querySelector('.ed-understood'), { autoAlpha: 1, y: 0 }, 'context')
      .fromTo(section.querySelector('.ed-engine-core'), { scale: 0.95 }, { scale: 1.08, repeat: 5, yoyo: true, duration: 0.55, ease: 'sine.inOut' }, 4.6);
    if (isMobile) {
      timeline.to(section.querySelector('.ed-conversation'), { autoAlpha: 0, y: -12, duration: 0.5 }, 5.8)
        .to(section.querySelector('.ed-records'), { autoAlpha: 1, duration: 0.3 }, 6.3);
    }
    records.forEach((record, index) => {
      const beat = [beats.opportunity, beats.note, beats.task][index];
      timeline.addLabel(['opportunity', 'note', 'task'][index], beat)
        .to(paths[index], { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, beat - 0.55)
        .to(record, { autoAlpha: 1, y: 0 }, beat)
        .fromTo(record.querySelector('.ed-saved'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, beat + 0.45);
    });
    timeline.addLabel('connected', beats.done)
      .to(section.querySelector('.ed-response'), { autoAlpha: isMobile ? 0 : 1, y: 0 }, 11.5)
      .to(section.querySelector('.ed-resolution'), { autoAlpha: 1, y: 0 }, 'connected')
      .to(section.querySelector('.ed-progress > span'), { scaleX: 1, duration: 14.5, ease: 'none' }, 0);

    // Breakpoint changes rebuild the composition without restarting the story.
    timeline.progress(restoreProgress, true).pause();
    prompt.textContent = fullPrompt.slice(0, Math.round(typing.characters));
    phase.textContent = phaseAt(timeline.time());
    count.textContent = String([beats.opportunity, beats.note, beats.task].filter(beat => timeline.time() >= beat + 0.5).length);
    theater.toggleAttribute('data-demo-active', timeline.time() < 3.9);
    play.hidden = restoreProgress >= 1;

    function syncPlayback() {
      if (inView && !document.hidden && !playback.userPaused && timeline.progress() < 1) {
        playback.started = true;
        timeline.play();
      } else timeline.pause();
      updateControls();
    }
    function togglePlayback() {
      playback.userPaused = !timeline.paused();
      playback.manuallyStarted = true;
      syncPlayback();
    }
    function restart() {
      announcement.textContent = '';
      playback.userPaused = false;
      playback.manuallyStarted = true;
      play.hidden = false;
      playback.progress = 0;
      timeline.restart(true).pause();
      syncPlayback();
    }
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (inView || playback.started) syncPlayback();
    }, { threshold: 0.15 });
    observer.observe(section);
    play.addEventListener('click', togglePlayback);
    replay.addEventListener('click', restart);
    document.addEventListener('visibilitychange', syncPlayback);
    updateControls();

    return () => {
      observer.disconnect();
      play.removeEventListener('click', togglePlayback);
      replay.removeEventListener('click', restart);
      document.removeEventListener('visibilitychange', syncPlayback);
      if (document.activeElement === play || document.activeElement === replay) section.focus({ preventScroll: true });
      play.hidden = true;
      replay.hidden = true;
      prompt.textContent = fullPrompt;
      theater.removeAttribute('data-demo-active');
      theater.removeAttribute('data-demo-enhanced');
      phase.textContent = 'Todo conectado. Listo para continuar.';
      count.textContent = '3';
      announcement.textContent = '';
    };
  });
})();
