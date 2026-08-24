const CORE = { x: 110, y: 78 };
const TARGETS = [
  { kind: 'rect', x: 25, y: 25, w: 26, h: 20 },
  { kind: 'circle', cx: 188, cy: 32, r: 11 },
  { kind: 'pill', x: 148, y: 108, w: 42, h: 22 },
];

export function mountIconIntegrate(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 150');
  svg.setAttribute('class', 'ill ill-integrate' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  const targetCenter = (t) => (t.kind === 'circle' ? { x: t.cx, y: t.cy } : { x: t.x + t.w / 2, y: t.y + t.h / 2 });

  TARGETS.forEach((t) => {
    const c = targetCenter(t);
    const link = document.createElementNS(ns, 'line');
    link.setAttribute('class', 'link');
    link.setAttribute('x1', CORE.x); link.setAttribute('y1', CORE.y);
    link.setAttribute('x2', c.x); link.setAttribute('y2', c.y);
    svg.appendChild(link);
  });

  TARGETS.forEach((t, i) => {
    let el;
    if (t.kind === 'circle') {
      el = document.createElementNS(ns, 'circle');
      el.setAttribute('cx', t.cx); el.setAttribute('cy', t.cy); el.setAttribute('r', t.r);
    } else {
      el = document.createElementNS(ns, 'rect');
      el.setAttribute('x', t.x); el.setAttribute('y', t.y);
      el.setAttribute('width', t.w); el.setAttribute('height', t.h);
      el.setAttribute('rx', t.kind === 'pill' ? t.h / 2 : 4);
    }
    el.setAttribute('class', 'target target--' + (i + 1));
    svg.appendChild(el);
  });

  const core = document.createElementNS(ns, 'circle');
  core.setAttribute('class', 'core');
  core.setAttribute('cx', CORE.x); core.setAttribute('cy', CORE.y); core.setAttribute('r', 10);
  svg.appendChild(core);

  container.appendChild(svg);
  return svg;
}
