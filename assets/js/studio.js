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
  const cases = [
    { tag: 'SOFTWARE + AUTOMATIZACIÓN', start: 'Solicitud', end: 'Resuelto', title: 'Menos tareas repetitivas. Más espacio para crecer.', description: 'Conecta ventas, inventario y administración en una plataforma. La información fluye; tu equipo se enfoca en lo que importa.', link: 'web-plataformas.html' },
    { tag: 'INTELIGENCIA ARTIFICIAL + DATOS', start: 'Pregunta', end: 'Respuesta', title: 'El conocimiento de tu empresa, a una pregunta.', description: 'Un asistente que consulta tus documentos y ayuda a tu equipo a encontrar respuestas con fuentes, permisos y contexto.', link: 'inteligencia-artificial.html' },
    { tag: 'SENSÓRICA + PLATAFORMAS', start: 'Sensor', end: 'Decisión', title: 'Lo que ocurre en campo, en tu pantalla.', description: 'Conecta sensores, visualiza las condiciones de tu operación y recibe alertas para actuar cuando una variable sale de rango.', link: 'sensorica-iot.html' }
  ];
  const tabs = [...document.querySelectorAll('[data-case]')];
  function selectCase(index) {
    const item = cases[index];
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    for (const [id, value] of Object.entries({ 'case-tag': item.tag, 'flow-start': item.start, 'flow-end': item.end, 'case-title': item.title, 'case-description': item.description })) document.getElementById(id).textContent = value;
    document.getElementById('case-link').href = item.link;
    document.getElementById('case-panel').setAttribute('aria-labelledby', `tab-${index}`);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCase(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectCase(next); tabs[next].focus(); }
    });
  });
  document.querySelector('#contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Proyecto Helion: ${data.get('service')}`;
    const body = `Hola, equipo Helion.\n\nSoy ${data.get('name')}.\nCorreo: ${data.get('email')}\nMe interesa: ${data.get('service')}\n\n${data.get('message')}\n`;
    window.location.href = `mailto:hola@helion.ec?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.querySelector('#form-status').textContent = 'Correo preparado. Envíalo desde tu aplicación de correo. Si no se abrió, escríbenos directamente a hola@helion.ec.';
  });
})();
