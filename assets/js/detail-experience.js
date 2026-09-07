(() => {
  const lab = document.querySelector('[data-lab]');
  if (!lab) return;
  const scenarios = {
    ai: [
      ['Documento recibido', 'Solicitud de compra', 'Leer y comprender', 'Información preparada', 'Tu equipo decide'],
      ['Pregunta del cliente', 'Una consulta sobre su pedido', 'Consultar el contexto', 'Respuesta sugerida', 'Derivar cuando hace falta'],
      ['Tarea recurrente', 'Clasificar solicitudes entrantes', 'Coordinar las herramientas', 'Acción preparada', 'Validar antes de ejecutar']
    ],
    systems: [
      ['Nueva solicitud', 'Pedido del cliente', 'Conectar procesos', 'Equipo coordinado', 'Información en sincronía'],
      ['Un nuevo contacto', 'Una oportunidad por acompañar', 'Dar continuidad', 'Seguimiento preparado', 'Cada conversación, con contexto'],
      ['Dato actualizado', 'Un cambio en tu inventario', 'Sincronizar herramientas', 'Sistemas alineados', 'La información llega donde hace falta']
    ],
    iot: [
      ['Sensor conectado', 'Temperatura ambiente', 'Interpretar señales', 'Lectura disponible', 'Tu operación, visible', '24.8', '°C'],
      ['Estado del equipo', 'Lectura de vibración', 'Observar tendencias', 'Equipo monitoreado', 'Información para mantenimiento', '2.4', 'mm/s'],
      ['Umbral detectado', 'Temperatura fuera del rango de ejemplo', 'Activar el flujo', 'Aviso al equipo', 'Una señal se convierte en acción', '32.6', '°C']
    ]
  };
  const fields = ['input-title', 'input', 'engine', 'output-title', 'output', 'reading', 'unit'];
  const tabs = [...lab.querySelectorAll('[data-lab-tab]')];
  function select(index) {
    scenarios[lab.dataset.lab][index].forEach((text, i) => {
      lab.querySelector(`[data-lab-${fields[i]}]`).textContent = text;
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
      timeline.from(lab.querySelectorAll('.lab-step'), {
        y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out'
      });
      if (kind === 'ai') {
        timeline.from(lab.querySelectorAll('.lab-orbit'), { scale: 0.75, autoAlpha: 0, svgOrigin: '130 130', duration: 1, stagger: 0.15, ease: 'power2.out' }, 0.25);
        timeline.fromTo(lab.querySelector('.lab-scan'), { y: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.45);
        timeline.to(lab.querySelector('.lab-scan'), { y: 60, duration: 1.2, ease: 'power1.inOut' }, 0.6);
        timeline.to(lab.querySelector('.lab-scan'), { opacity: 0, duration: 0.2 }, 1.8);
        timeline.from(lab.querySelectorAll('.engine-steps span'), { y: 8, autoAlpha: 0, duration: 0.4, stagger: 0.25 }, 1);
        timeline.from(lab.querySelector('.output-check'), { scale: 0.5, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.2)' }, 1.7);
        timeline.from(lab.querySelector('.review-line'), { autoAlpha: 0, duration: 0.5 }, 2.2);
      } else if (kind === 'systems') {
        timeline.from(lab.querySelectorAll('.sync-line'), { scaleX: 0, duration: 0.6, stagger: 0.25, ease: 'power2.inOut' }, 0.5);
        timeline.from(lab.querySelectorAll('.sync-node'), { y: 8, autoAlpha: 0, duration: 0.45, stagger: 0.2 }, 0.5);
        timeline.from(lab.querySelectorAll('.task-bottom'), { y: 6, autoAlpha: 0, duration: 0.5, stagger: 0.3 }, 1);
      } else {
        const wires = lab.querySelectorAll('.sensor-wires path');
        wires.forEach((path, i) => {
          const length = path.getTotalLength();
          timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 0.3 + i * 0.2);
        });
        timeline.from(lab.querySelectorAll('.sensor-points circle'), { scale: 0, transformOrigin: '50% 50%', duration: 0.45, stagger: 0.2 }, 0.15);
        const chart = lab.querySelector('.signal-chart path');
        timeline.fromTo(chart, { strokeDasharray: chart.getTotalLength(), strokeDashoffset: chart.getTotalLength() }, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' }, 1);
        timeline.from(lab.querySelector('.telemetry-result'), { y: 8, autoAlpha: 0, duration: 0.5 }, 1.9);
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
