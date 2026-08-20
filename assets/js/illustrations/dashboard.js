const BARS = [
  { x: 40, h: 30 }, { x: 65, h: 50 }, { x: 90, h: 22 }, { x: 115, h: 40 },
];

export function mountDashboard(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 200 150');
  svg.setAttribute('class', 'ill ill-dashboard' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  const frame = document.createElementNS(ns, 'rect');
  frame.setAttribute('class', 'frame');
  frame.setAttribute('x', 20); frame.setAttribute('y', 20);
  frame.setAttribute('width', 160); frame.setAttribute('height', 110);
  frame.setAttribute('rx', 4);
  svg.appendChild(frame);

  const floor = 115;
  BARS.forEach((b) => {
    const bar = document.createElementNS(ns, 'rect');
    bar.setAttribute('class', 'bar');
    bar.setAttribute('x', b.x); bar.setAttribute('width', 14);
    bar.setAttribute('y', floor - b.h); bar.setAttribute('height', b.h);
    svg.appendChild(bar);
  });

  const line = document.createElementNS(ns, 'path');
  line.setAttribute('class', 'line');
  line.setAttribute('d', 'M35,50 L65,65 L90,40 L115,55 L145,35');
  svg.appendChild(line);

  container.appendChild(svg);
  return svg;
}
