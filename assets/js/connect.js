(() => {
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu() {
    navigation.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }
  toggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); toggle.focus(); }
  });
  const solutions = [
    { kicker: 'DE INFORMACIÓN DISPERSA A CONTROL', title: 'Toda tu operación. En la misma página.', description: 'Si dependes de hojas de cálculo, mensajes y sistemas que no se hablan, conectamos tus procesos para que la información fluya.', tags: ['ERP a medida', 'Integraciones', 'Tableros de control'], eyebrow: 'OPERACIÓN CONECTADA', previewTitle: 'Cada pieza, en su lugar.', metricA: 'Información', metricAValue: 'Unificada', metricB: 'Procesos', metricBValue: 'Conectados', table: 'Flujo de pedidos', rows: ['Solicitud recibida', 'Inventario consultado', 'Equipo notificado'], states: ['Registrada', 'Verificado', 'Completado'], note: 'Los datos se actualizan entre tus herramientas.' },
    { kicker: 'DE CONTACTOS SUELTOS A RELACIONES', title: 'Cada cliente cuenta. Cada contacto también.', description: 'Si pierdes oportunidades entre canales o te cuesta dar seguimiento, conectamos la experiencia de tus clientes desde el primer contacto hasta su próxima compra.', tags: ['CRM', 'Apps de fidelización', 'Webs & portales', 'Asistentes de atención'], eyebrow: 'RELACIONES CON CONTINUIDAD', previewTitle: 'El siguiente paso, claro.', metricA: 'Clientes', metricAValue: 'Con contexto', metricB: 'Seguimiento', metricBValue: 'Coordinado', table: 'Recorrido del cliente', rows: ['Nuevo contacto', 'Conversación asignada', 'Seguimiento preparado'], states: ['Recibido', 'Asignada', 'Listo'], note: 'Tu equipo tiene el contexto de cada conversación.' },
    { kicker: 'DE TAREAS REPETITIVAS A TIEMPO ÚTIL', title: 'Que el trabajo avance. Sin hacerlo todo a mano.', description: 'Si tu equipo dedica horas a copiar datos, revisar documentos o responder lo mismo, diseñamos automatizaciones e IA con reglas claras y revisión humana cuando hace falta.', tags: ['Automatización con IA', 'Chatbots', 'Agentes', 'Integraciones'], eyebrow: 'INTELIGENCIA EN EL FLUJO', previewTitle: 'De la entrada a la acción.', metricA: 'Tareas', metricAValue: 'Orquestadas', metricB: 'Control', metricBValue: 'Humano', table: 'Flujo de documentos', rows: ['Documento recibido', 'Información extraída', 'Validación del equipo'], states: ['Recibido', 'Preparada', 'Por revisar'], note: 'La IA prepara; tu equipo valida las decisiones clave.' }
  ];
  const tabs = [...document.querySelectorAll('[data-problem]')];
  let selected = 0;
  function selectSolution(index) {
    selected = index;
    const solution = solutions[index];
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    const fields = { 'solution-kicker': solution.kicker, 'solution-title': solution.title, 'solution-description': solution.description, 'preview-eyebrow': solution.eyebrow, 'preview-title': solution.previewTitle, 'metric-a': solution.metricA, 'metric-a-value': solution.metricAValue, 'metric-b': solution.metricB, 'metric-b-value': solution.metricBValue, 'table-title': solution.table, 'row-a': solution.rows[0], 'row-b': solution.rows[1], 'row-c': solution.rows[2], 'preview-note': solution.note };
    Object.entries(fields).forEach(([id, text]) => { document.getElementById(id).textContent = text; });
    document.querySelectorAll('.state').forEach((state, i) => { state.textContent = solution.states[i]; });
    const tags = document.getElementById('solution-tags');
    tags.replaceChildren(...solution.tags.map(text => { const span = document.createElement('span'); span.textContent = text; return span; }));
    document.getElementById('solution-panel').setAttribute('aria-labelledby', `problem-${index}`);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectSolution(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % tabs.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectSolution(next); tabs[next].focus(); }
    });
  });
  document.getElementById('discuss-solution')?.addEventListener('click', () => {
    document.getElementById('challenge').selectedIndex = selected;
    document.getElementById('contacto').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.getElementById('name').focus({ preventScroll: true });
  });
  document.getElementById('contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Hola, Helion.\n\nSoy ${data.get('name')}.\nMi correo: ${data.get('email')}\nMi reto: ${data.get('challenge')}\n\n${data.get('message')}\n`;
    window.location.href = `mailto:hola@helion.ec?subject=${encodeURIComponent(`Un reto para Helion: ${data.get('challenge')}`)}&body=${encodeURIComponent(body)}`;
    document.getElementById('form-status').textContent = 'Mensaje preparado. Envíalo desde tu aplicación de correo. Si no se abrió, puedes escribirnos a hola@helion.ec.';
  });
})();
