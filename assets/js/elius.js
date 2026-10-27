/* Isolated product demo: fictional local records, no CRM requests. */
(() => {
  const records = {"altura": {"type": "Empresa", "title": "Altura Digital", "fields": [["Nombre de dominio", "altura.example"], ["Propietario de la cuenta", "Ana Mora"], ["Oportunidades", "1"], ["Estado de la relación", "En seguimiento"]], "note": "Interés en ordenar el proceso comercial y centralizar la información del equipo."}, "norte": {"type": "Empresa", "title": "Norte Estudio", "fields": [["Nombre de dominio", "norte.example"], ["Propietario de la cuenta", "Julián León"], ["Oportunidades", "1"], ["Estado de la relación", "En seguimiento"]], "note": "Interés en ordenar el proceso comercial y centralizar la información del equipo."}, "marea": {"type": "Empresa", "title": "Marea Diseño", "fields": [["Nombre de dominio", "marea.example"], ["Propietario de la cuenta", "Ana Mora"], ["Oportunidades", "1"], ["Estado de la relación", "En seguimiento"]], "note": "Interés en ordenar el proceso comercial y centralizar la información del equipo."}, "sur": {"type": "Empresa", "title": "Sur & Co.", "fields": [["Nombre de dominio", "sur.example"], ["Propietario de la cuenta", "Julián León"], ["Oportunidades", "1"], ["Estado de la relación", "En seguimiento"]], "note": "Interés en ordenar el proceso comercial y centralizar la información del equipo."}, "ana": {"type": "Persona", "title": "Ana Mora", "fields": [["Empresa", "Altura Digital"], ["Correo electrónico", "ana@altura.example"], ["Cargo", "Dirección comercial"]], "note": "Persona de contacto para coordinar el alcance y los siguientes pasos."}, "julian": {"type": "Persona", "title": "Julián León", "fields": [["Empresa", "Norte Estudio"], ["Correo electrónico", "julian@norte.example"], ["Cargo", "Dirección general"]], "note": "Persona de contacto para coordinar el alcance y los siguientes pasos."}, "maria": {"type": "Persona", "title": "María Costa", "fields": [["Empresa", "Marea Diseño"], ["Correo electrónico", "maria@marea.example"], ["Cargo", "Operaciones"]], "note": "Persona de contacto para coordinar el alcance y los siguientes pasos."}, "sofia": {"type": "Persona", "title": "Sofía Ruiz", "fields": [["Empresa", "Sur & Co."], ["Correo electrónico", "sofia@sur.example"], ["Cargo", "Desarrollo de negocio"]], "note": "Persona de contacto para coordinar el alcance y los siguientes pasos."}, "deal-altura": {"type": "Oportunidad", "title": "Elius CRM", "fields": [["Importe", "$ 2.500"], ["Etapa", "1. Prospección"], ["Fecha de cierre", "12 nov."], ["Empresa", "Altura Digital"], ["Propietario", "Ana Mora"]], "note": "Definir prioridades y coordinar una conversación con el equipo. La nota y la tarea permanecen en el contexto del cliente."}, "deal-norte": {"type": "Oportunidad", "title": "Plataforma comercial", "fields": [["Importe", "$ 4.800"], ["Etapa", "1. Prospección"], ["Fecha de cierre", "18 nov."], ["Empresa", "Norte Estudio"], ["Propietario", "Julián León"]], "note": "Definir prioridades y coordinar una conversación con el equipo. La nota y la tarea permanecen en el contexto del cliente."}, "deal-marea": {"type": "Oportunidad", "title": "Elius CRM", "fields": [["Importe", "$ 1.800"], ["Etapa", "2. Conexión"], ["Fecha de cierre", "20 nov."], ["Empresa", "Marea Diseño"], ["Propietario", "Ana Mora"]], "note": "Definir prioridades y coordinar una conversación con el equipo. La nota y la tarea permanecen en el contexto del cliente."}, "deal-sur": {"type": "Oportunidad", "title": "Integración de sistemas", "fields": [["Importe", "$ 3.200"], ["Etapa", "3. Calificación"], ["Fecha de cierre", "25 nov."], ["Empresa", "Sur & Co."], ["Propietario", "Julián León"]], "note": "Definir prioridades y coordinar una conversación con el equipo. La nota y la tarea permanecen en el contexto del cliente."}, "task-ana": {"type": "Tarea", "title": "Llamar a Ana · primer contacto", "fields": [["Empresa", "Altura Digital"], ["Fecha de vencimiento", "Mañana, 10:00"], ["Estado", "Por hacer"]], "note": "Coordinar la conversación inicial, confirmar las necesidades y acordar el siguiente paso."}, "task-propuesta": {"type": "Tarea", "title": "Revisar propuesta comercial", "fields": [["Empresa", "Marea Diseño"], ["Fecha de vencimiento", "Mañana, 15:00"], ["Estado", "En curso"]], "note": "Coordinar la conversación inicial, confirmar las necesidades y acordar el siguiente paso."}, "task-norte": {"type": "Tarea", "title": "Preparar reunión de seguimiento", "fields": [["Empresa", "Norte Estudio"], ["Fecha de vencimiento", "Jueves, 09:30"], ["Estado", "Por hacer"]], "note": "Coordinar la conversación inicial, confirmar las necesidades y acordar el siguiente paso."}, "flow-email": {"type": "Flujo de trabajo", "title": "Crear oportunidades desde correos comerciales", "fields": [["Estado", "Activo"], ["Visibilidad", "Espacio de trabajo"], ["Disparador", "Correo recibido"], ["Acción", "Crear oportunidad"]], "note": "Configuración ilustrativa. Los disparadores y las acciones se adaptan al proceso de cada empresa."}, "flow-company": {"type": "Flujo de trabajo", "title": "Crear empresa al añadir una persona", "fields": [["Estado", "Activo"], ["Visibilidad", "Espacio de trabajo"], ["Disparador", "Persona creada"], ["Acción", "Crear empresa"]], "note": "Configuración ilustrativa. Los disparadores y las acciones se adaptan al proceso de cada empresa."}, "flow-lead": {"type": "Flujo de trabajo", "title": "Registrar un nuevo contacto comercial", "fields": [["Estado", "Activo"], ["Visibilidad", "Espacio de trabajo"], ["Disparador", "Activación manual"], ["Acción", "Crear persona"]], "note": "Configuración ilustrativa. Los disparadores y las acciones se adaptan al proceso de cada empresa."}};
  const app = document.querySelector('.rp-app');
  if (!app) return;
  const tabs = [...app.querySelectorAll('[data-elius-tab]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const tablist = app.querySelector('.rp-tabs');
  const search = app.querySelector('[data-product-search]');
  const searchLabel = search.closest('label');
  const title = app.querySelector('[data-product-title]');
  const headerIcon = app.querySelector('.rp-header-icon');
  const viewLabel = app.querySelector('[data-product-view]');
  const count = app.querySelector('[data-product-count]');
  const empty = app.querySelector('.rp-empty');
  const status = document.querySelector('[data-product-status]');
  const detail = app.querySelector('.rp-detail');
  const closeButton = app.querySelector('[data-close-detail]');
  const aiButton = app.querySelector('[data-open-ai]');
  const mobile = window.matchMedia('(max-width: 700px)');
  const views = ['Todas las empresas', 'Todas las personas', 'Por etapa', 'Todas las tareas', 'Habilidades con contexto', 'Flujos de trabajo'];
  let selected = 0;
  let detailTrigger;

  const updateOrientation = () => tablist.setAttribute('aria-orientation', mobile.matches ? 'horizontal' : 'vertical');
  updateOrientation();
  mobile.addEventListener('change', updateOrientation);

  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  function filter(announce = false) {
    const query = normalize(search.value.trim());
    const items = [...panels[selected].querySelectorAll('[data-search]')];
    let matches = 0;
    items.forEach(item => {
      item.hidden = !normalize(item.dataset.search).includes(query);
      if (!item.hidden) matches++;
    });
    panels[selected].querySelectorAll('.rp-board-column').forEach(column => {
      column.querySelector('.rp-column-title > span').textContent = String(column.querySelectorAll('.rp-deal:not([hidden])').length);
    });
    count.textContent = selected === 4 ? '3' : String(matches);
    empty.hidden = selected === 4 || matches > 0;
    if (announce) status.textContent = matches + ' resultados en ' + tabs[selected].dataset.title + '.';
  }

  const coveredContent = [...app.querySelector('.rp-main').children].filter(element => element !== detail);
  function closeDetail(restoreFocus = true) {
    if (detail.hidden) return;
    detail.hidden = true;
    coveredContent.forEach(element => { element.inert = false; });
    if (restoreFocus && detailTrigger?.isConnected && !detailTrigger.closest('[hidden]')) detailTrigger.focus({ preventScroll: true });
  }

  function select(index) {
    closeDetail(false);
    selected = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    title.textContent = tabs[index].dataset.title;
    headerIcon.replaceChildren(tabs[index].querySelector('svg').cloneNode(true));
    headerIcon.style.color = getComputedStyle(tabs[index].querySelector('svg')).color;
    viewLabel.textContent = views[index];
    search.value = '';
    searchLabel.hidden = index === 4;
    aiButton.hidden = index === 4;
    filter();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const forward = mobile.matches ? 'ArrowRight' : 'ArrowDown';
      const backward = mobile.matches ? 'ArrowLeft' : 'ArrowUp';
      let next;
      if (event.key === forward) next = (index + 1) % tabs.length;
      if (event.key === backward) next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        select(next);
        tabs[next].focus();
      }
    });
  });
  search.addEventListener('input', () => { closeDetail(false); filter(true); });
  aiButton.addEventListener('click', () => { select(4); tabs[4].focus(); });

  app.addEventListener('click', event => {
    const trigger = event.target.closest('[data-detail]');
    if (!trigger) return;
    const record = records[trigger.dataset.detail];
    if (!record) return;
    detailTrigger = trigger;
    app.querySelector('[data-detail-label]').textContent = record.type;
    app.querySelector('[data-detail-title]').textContent = record.title;
    app.querySelector('[data-detail-note]').textContent = record.note;
    const fields = record.fields.map(([label, value]) => {
      const row = document.createElement('div');
      row.className = 'rp-detail-field';
      const fieldLabel = document.createElement('span');
      const fieldValue = document.createElement('span');
      fieldLabel.textContent = label;
      fieldValue.textContent = value;
      row.append(fieldLabel, fieldValue);
      return row;
    });
    app.querySelector('[data-detail-fields]').replaceChildren(...fields);
    detail.hidden = false;
    coveredContent.forEach(element => { element.inert = true; });
    detail.scrollTop = 0;
    closeButton.focus({ preventScroll: true });
  });
  closeButton.addEventListener('click', () => closeDetail());
  app.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !detail.hidden) {
      event.preventDefault();
      event.stopPropagation();
      closeDetail();
    }
  });

  const examples = {
    meeting: {
      question: 'Prepárame para mi reunión con Altura Digital.',
      skill: 'Preparación de reuniones',
      title: 'El contexto antes de la llamada.',
      body: 'Hay una oportunidad de Elius CRM en prospección. La tarea de primer contacto está prevista para mañana a las 10:00. Confirma el alcance y acuerda el siguiente paso.'
    },
    review: {
      question: 'Ayúdame a revisar la oportunidad de Altura Digital.',
      skill: 'Revisión de negocios',
      title: 'Una oportunidad con un siguiente paso.',
      body: 'Elius CRM está en prospección, con un importe de ejemplo de $ 2.500. Antes de avanzar, confirma las prioridades y el alcance con la persona de contacto. El primer contacto está previsto para mañana a las 10:00.'
    },
    quality: {
      question: 'Ayúdame a revisar la información de Altura Digital.',
      skill: 'Higiene de CRM',
      title: 'Información útil para dar seguimiento.',
      body: 'La empresa tiene un dominio registrado y una persona responsable de la cuenta. Revisa la información de contacto con el cliente y mantén actualizadas las relaciones con sus oportunidades y tareas.'
    }
  };
  app.querySelectorAll('[data-ai-example]').forEach(button => {
    button.addEventListener('click', () => {
      const example = examples[button.dataset.aiExample];
      app.querySelector('[data-ai-question]').textContent = example.question;
      app.querySelector('[data-ai-skill]').textContent = example.skill;
      app.querySelector('[data-ai-title]').textContent = example.title;
      app.querySelector('[data-ai-body]').textContent = example.body;
      app.querySelectorAll('[data-ai-example]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      status.textContent = 'Ejemplo seleccionado: ' + example.skill + '.';
    });
  });
  select(0);
})();
