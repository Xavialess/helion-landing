const NODES = [
  { x: 40, y: 30 }, { x: 180, y: 20 }, { x: 30, y: 120 }, { x: 190, y: 110 },
];
const HUB = { x: 110, y: 75 };

export function mountNetwork(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 150');
  svg.setAttribute('class', 'ill ill-network' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  NODES.forEach((n) => {
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('class', 'link');
    line.setAttribute('x1', HUB.x); line.setAttribute('y1', HUB.y);
    line.setAttribute('x2', n.x); line.setAttribute('y2', n.y);
    svg.appendChild(line);
  });

  const hub = document.createElementNS(ns, 'circle');
  hub.setAttribute('class', 'node node--hub');
  hub.setAttribute('cx', HUB.x); hub.setAttribute('cy', HUB.y); hub.setAttribute('r', 7);
  svg.appendChild(hub);

  NODES.forEach((n) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('class', 'node node--sat');
    c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', 4);
    svg.appendChild(c);
  });

  container.appendChild(svg);
  return svg;
}
