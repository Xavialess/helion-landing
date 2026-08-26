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
    services: [
      { icon: 'chat', title: 'Chatbot de Reservas & Pedidos', desc: 'Atiende reservas, pedidos y preguntas del menú al instante, sin que tu equipo suelte el teléfono en hora pico.' },
      { icon: 'agent', title: 'Agente de Llamadas', desc: 'Confirma reservas, toma pedidos telefónicos y recupera clientes que no contestaron — de día y de noche.' },
      { icon: 'mobile', title: 'Web & App de Pedidos', desc: 'Tu propio sitio de reservas y pedidos, o una app de fidelización — la puerta digital de tu restaurante.' },
      { icon: 'crm', title: 'CRM de Clientes Frecuentes', desc: 'Quién viene, qué pide y cada cuánto — para que cada mesa se sienta como la de un cliente habitual.' },
    ],
  },
  {
    id: 'inmobiliaria',
    label: 'Inmobiliaria',
    services: [
      { icon: 'chat', title: 'Chatbot Calificador de Leads', desc: 'Responde consultas de propiedades al instante y separa al comprador serio del curioso, 24/7.' },
      { icon: 'agent', title: 'Agente de Llamadas Outbound', desc: 'Da seguimiento a cada prospecto que dejó sus datos, sin que se enfríe en la bandeja de entrada.' },
      { icon: 'mobile', title: 'Sitio o Portal Inmobiliario', desc: 'Tu catálogo de propiedades en línea — la base sobre la que corren tus leads y tu CRM.' },
      { icon: 'crm', title: 'CRM Inmobiliario', desc: 'Propiedades, clientes y visitas en un solo pipeline — nada se pierde entre WhatsApp, correo y hojas de cálculo.' },
    ],
  },
  {
    id: 'legal',
    label: 'Firma de Abogados',
    services: [
      { icon: 'chat', title: 'Chatbot de Primer Contacto', desc: 'Recibe consultas, agenda citas y filtra casos antes de que lleguen a un abogado.' },
      { icon: 'analyze', title: 'Analizador de Casos & Documentos', desc: 'IA que lee expedientes y contratos, y te resume lo que importa en minutos, no horas.' },
      { icon: 'mobile', title: 'Sitio Web de la Firma', desc: 'Un sitio propio para recibir consultas y agendar citas — el punto de entrada de todo lo demás.' },
      { icon: 'crm', title: 'CRM de Casos & Clientes', desc: 'Cada caso, cliente y plazo en un solo lugar — con alertas antes de que algo se venza.' },
    ],
  },
  {
    id: 'pyme',
    label: 'Negocio / PYME',
    services: [
      { icon: 'chat', title: 'Chatbot de Ventas & Soporte', desc: 'Responde preguntas frecuentes, cierra ventas simples y libera a tu equipo para lo complejo.' },
      { icon: 'mobile', title: 'Web o Plataforma a Medida', desc: 'Tu negocio en línea — la base antes de automatizar ventas, soporte o pagos.' },
      { icon: 'erp', title: 'ERP a Medida', desc: 'Inventario, finanzas y procesos internos en un solo panel — sin hojas de cálculo sueltas.' },
      { icon: 'analyze', title: 'Análisis Financiero con IA', desc: 'Convierte tus números en decisiones — flujo de caja, márgenes y alertas, explicado en simple.' },
    ],
  },
  {
    id: 'otro',
    label: 'Otro negocio',
    services: [
      { icon: 'chat', title: 'Chatbot de Atención', desc: 'Responde a tus clientes al instante, en tu web o WhatsApp, sin que nadie espere.' },
      { icon: 'mobile', title: 'Tu Presencia Digital', desc: 'Diagnosticamos tu operación y construimos tu web, app o plataforma propia.' },
      { icon: 'crm', title: 'CRM', desc: 'Todos tus clientes y oportunidades en un solo lugar, con el flujo que tu equipo ya sigue.' },
      { icon: 'integrate', title: 'Integraciones IA', desc: 'Conecta la inteligencia artificial a las herramientas que ya usas todos los días.' },
    ],
  },
];

export function initUseCases(root = document.querySelector('[data-explorer]')) {
  if (!root) return;

  const industryGroup = root.querySelector('[data-industry-group]');
  const resultGrid = root.querySelector('[data-result-grid]');
  const stepEls = { 1: root.querySelector('[data-step="1"]'), 2: root.querySelector('[data-step="2"]') };
  const indicators = Array.from(root.querySelectorAll('[data-step-indicator]'));
  const resetBtn = root.querySelector('[data-reset]');

  industryGroup.innerHTML = INDUSTRIES.map((ind) =>
    `<button type="button" class="explorer-chip" data-industry="${ind.id}" aria-pressed="false">${ind.label}</button>`
  ).join('');

  const industryBtns = Array.from(industryGroup.querySelectorAll('[data-industry]'));

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

  function renderResult(industry) {
    resultGrid.innerHTML = industry.services.map((s, i) =>
      `<div class="result-card" style="transition-delay:${i * 70}ms">
        <div class="ill-box" data-idx="${i}"></div>
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
        <a class="result-link" href="${ICONS[s.icon].page}">Ver más →</a>
      </div>`
    ).join('');

    industry.services.forEach((s, i) => {
      const box = resultGrid.querySelector(`[data-idx="${i}"]`);
      if (box) ICONS[s.icon].mount(box, { onDark: true });
    });

    showStep(2, true);
    setActiveStep(2);
    requestAnimationFrame(() => {
      resultGrid.querySelectorAll('.result-card').forEach((c) => c.classList.add('in'));
    });
  }

  industryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const industry = INDUSTRIES.find((i) => i.id === btn.getAttribute('data-industry'));
      industryBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      renderResult(industry);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      industryBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      showStep(2, false);
      setActiveStep(1);
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
