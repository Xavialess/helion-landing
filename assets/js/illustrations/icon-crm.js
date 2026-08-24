const STAGES = [
  { x: 30, y: 75, r: 16 },
  { x: 90, y: 75, r: 12 },
  { x: 150, y: 75, r: 8 },
  { x: 200, y: 75, r: 5 },
];

export function mountIconCrm(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 150');
  svg.setAttribute('class', 'ill ill-crm' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  const link = document.createElementNS(ns, 'line');
  link.setAttribute('class', 'link');
  link.setAttribute('x1', STAGES[0].x); link.setAttribute('y1', 75);
  link.setAttribute('x2', STAGES[STAGES.length - 1].x); link.setAttribute('y2', 75);
  svg.appendChild(link);

  STAGES.forEach((s, i) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('class', 'stage stage--' + (i + 1));
    c.setAttribute('cx', s.x); c.setAttribute('cy', s.y); c.setAttribute('r', s.r);
    svg.appendChild(c);
  });

  container.appendChild(svg);
  return svg;
}
