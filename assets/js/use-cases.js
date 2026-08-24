import { mountIconChat } from './illustrations/icon-chat.js';
import { mountIconAgent } from './illustrations/icon-agent.js';
import { mountIconCrm } from './illustrations/icon-crm.js';
import { mountIconErp } from './illustrations/icon-erp.js';
import { mountIconCustom } from './illustrations/icon-custom.js';
import { mountIconMobile } from './illustrations/icon-mobile.js';
import { mountIconAnalyze } from './illustrations/icon-analyze.js';
import { mountIconIntegrate } from './illustrations/icon-integrate.js';

const ICONS = {
  chat: { mount: mountIconChat, page: 'inteligencia-artificial' },
  agent: { mount: mountIconAgent, page: 'inteligencia-artificial' },
  crm: { mount: mountIconCrm, page: 'web-plataformas' },
  erp: { mount: mountIconErp, page: 'web-plataformas' },
  custom: { mount: mountIconCustom, page: 'web-plataformas' },
  mobile: { mount: mountIconMobile, page: 'web-plataformas' },
  analyze: { mount: mountIconAnalyze, page: 'inteligencia-artificial' },
  integrate: { mount: mountIconIntegrate, page: 'inteligencia-artificial' },
};

const INDUSTRIES = [
  {
    id: 'restaurante',
    label: 'Restaurante',
    base: [
      { icon: 'chat', title: 'Chatbot de Reservas & Pedidos', desc: 'Atiende reservas, pedidos y preguntas del menú al instante, sin que tu equipo suelte el teléfono en hora pico.' },
      { icon: 'agent', title: 'Agente de Llamadas', desc: 'Confirma reservas, toma pedidos telefónicos y recupera clientes que no contestaron — de día y de noche.' },
      { icon: 'mobile', title: 'App de Fidelización', desc: 'Puntos, recompensas y promociones que traen de vuelta a tu cliente frecuente, en su propio celular.' },
      { icon: 'crm', title: 'CRM de Clientes Frecuentes', desc: 'Quién viene, qué pide y cada cuánto — para que cada mesa se sienta como la de un cliente habitual.' },
    ],
    noWebLead: { icon: 'mobile', title: 'Tu Menú, en Línea', desc: 'Antes de automatizar necesitas una base: una web o app de pedidos y reservas que sea tuya, no la de un tercero.' },
  },
  {
    id: 'inmobiliaria',
    label: 'Inmobiliaria',
    base: [
      { icon: 'chat', title: 'Chatbot Calificador de Leads', desc: 'Responde consultas de propiedades al instante y separa al comprador serio del curioso, 24/7.' },
      { icon: 'agent', title: 'Agente de Llamadas Outbound', desc: 'Da seguimiento a cada prospecto que dejó sus datos, sin que se enfríe en la bandeja de entrada.' },
      { icon: 'crm', title: 'CRM Inmobiliario', desc: 'Propiedades, clientes y visitas en un solo pipeline — nada se pierde entre WhatsApp, correo y hojas de cálculo.' },
      { icon: 'integrate', title: 'Integraciones IA', desc: 'Conecta portales inmobiliarios, WhatsApp y tu CRM para que la información fluya sola.' },
    ],
    noWebLead: { icon: 'mobile', title: 'Tu Catálogo, en Línea', desc: 'Un sitio o portal propio para mostrar cada propiedad — la base sobre la que corren tus leads y tu CRM.' },
  },
  {
    id: 'legal',
    label: 'Firma de Abogados',
    base: [
      { icon: 'chat', title: 'Chatbot de Primer Contacto', desc: 'Recibe consultas, agenda citas y filtra casos antes de que lleguen a un abogado.' },
      { icon: 'analyze', title: 'Analizador de Casos & Documentos', desc: 'IA que lee expedientes y contratos, y te resume lo que importa en minutos, no horas.' },
      { icon: 'crm', title: 'CRM de Casos & Clientes', desc: 'Cada caso, cliente y plazo en un solo lugar — con alertas antes de que algo se venza.' },
      { icon: 'integrate', title: 'Integraciones IA', desc: 'Automatiza la redacción de documentos repetitivos y el flujo entre tus sistemas internos.' },
    ],
    noWebLead: { icon: 'mobile', title: 'Presencia Digital de la Firma', desc: 'Un sitio propio para recibir consultas y agendar citas — el punto de entrada de todo lo demás.' },
  },
  {
    id: 'pyme',
    label: 'Negocio / PYME',
    base: [
      { icon: 'chat', title: 'Chatbot de Ventas & Soporte', desc: 'Responde preguntas frecuentes, cierra ventas simples y libera a tu equipo para lo complejo.' },
      { icon: 'erp', title: 'ERP a Medida', desc: 'Inventario, finanzas y procesos internos en un solo panel — sin hojas de cálculo sueltas.' },
      { icon: 'analyze', title: 'Análisis Financiero con IA', desc: 'Convierte tus números en decisiones — flujo de caja, márgenes y alertas, explicado en simple.' },
      { icon: 'custom', title: 'Sistema a Medida', desc: 'La herramienta exacta para tu proceso, sin pagar licencias por funciones que no usas.' },
    ],
    noWebLead: { icon: 'mobile', title: 'Tu Negocio, en Línea', desc: 'Una web o plataforma propia — el primer paso antes de automatizar ventas, soporte o pagos.' },
  },
  {
    id: 'otro',
    label: 'Otro negocio',
    base: [
      { icon: 'chat', title: 'Chatbot de Atención', desc: 'Responde a tus clientes al instante, en tu web o WhatsApp, sin que nadie espere.' },
      { icon: 'crm', title: 'CRM', desc: 'Todos tus clientes y oportunidades en un solo lugar, con el flujo que tu equipo ya sigue.' },
      { icon: 'integrate', title: 'Integraciones IA', desc: 'Conecta la inteligencia artificial a las herramientas que ya usas todos los días.' },
      { icon: 'custom', title: 'Sistema a Medida', desc: 'Software construido exactamente para cómo trabaja tu negocio — 100% tuyo.' },
    ],
    noWebLead: { icon: 'mobile', title: 'Tu Presencia Digital', desc: 'Diagnosticamos tu operación y construimos primero la base: tu web, app o plataforma.' },
  },
];

function buildResult(industry, hasWeb) {
  if (hasWeb === 'no') {
    const rest = industry.base.filter((s) => s.icon !== industry.noWebLead.icon).slice(0, 3);
    return [industry.noWebLead, ...rest].map((s, i) => ({ ...s, badge: i === 0 }));
  }
  return industry.base.map((s) => ({ ...s, badge: false }));
}

export function initUseCases(root = document.querySelector('[data-explorer]')) {
  if (!root) return;

  const industryGroup = root.querySelector('[data-industry-group]');
  const webGroup = root.querySelector('[data-web-group]');
  const resultGrid = root.querySelector('[data-result-grid]');
  const stepEls = { 1: root.querySelector('[data-step="1"]'), 2: root.querySelector('[data-step="2"]'), 3: root.querySelector('[data-step="3"]') };
  const indicators = Array.from(root.querySelectorAll('[data-step-indicator]'));
  const resetBtn = root.querySelector('[data-reset]');

  let state = { industry: null, web: null };

  industryGroup.innerHTML = INDUSTRIES.map((ind) =>
    `<button type="button" class="explorer-chip" data-industry="${ind.id}" aria-pressed="false">${ind.label}</button>`
  ).join('');

  const industryBtns = Array.from(industryGroup.querySelectorAll('[data-industry]'));
  const webBtns = Array.from(webGroup.querySelectorAll('[data-web]'));

  function setActiveStep(n) {
    indicators.forEach((el) => {
      const step = Number(el.getAttribute('data-step-indicator'));
      el.classList.toggle('is-active', step === n);
      el.classList.toggle('is-done', step < n);
    });
  }

  function showStep(n, visible) {
    if (!stepEls[n]) return;
    stepEls[n].hidden = !visible;
  }

  function renderResult() {
    const industry = INDUSTRIES.find((i) => i.id === state.industry);
    if (!industry || !state.web) return;

    const services = buildResult(industry, state.web);
    resultGrid.innerHTML = services.map((s, i) =>
      `<div class="result-card" style="transition-delay:${i * 70}ms">
        ${s.badge ? '<span class="result-badge">Empieza aquí</span>' : ''}
        <div class="ill-box" data-result-icon="${s.icon}" data-idx="${i}"></div>
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
        <a class="result-link" href="${ICONS[s.icon].page}">Ver más →</a>
      </div>`
    ).join('');

    services.forEach((s, i) => {
      const box = resultGrid.querySelector(`[data-idx="${i}"]`);
      if (box) ICONS[s.icon].mount(box, { onDark: true });
    });

    showStep(3, true);
    setActiveStep(3);
    requestAnimationFrame(() => {
      resultGrid.querySelectorAll('.result-card').forEach((c) => c.classList.add('in'));
    });
  }

  industryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.industry = btn.getAttribute('data-industry');
      state.web = null;
      industryBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      webBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      showStep(2, true);
      showStep(3, false);
      setActiveStep(2);
    });
  });

  webBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.web = btn.getAttribute('data-web');
      webBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      renderResult();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = { industry: null, web: null };
      industryBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      webBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      showStep(2, false);
      showStep(3, false);
      setActiveStep(1);
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
