const BARS = [
  { x: 25, h: 25 },
  { x: 50, h: 40 },
  { x: 75, h: 55 },
  { x: 100, h: 70 },
];
const FLOOR = 120;

export function mountIconAnalyze(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 150');
  svg.setAttribute('class', 'ill ill-analyze' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  BARS.forEach((b, i) => {
    const bar = document.createElementNS(ns, 'rect');
    bar.setAttribute('class', 'bar bar--' + (i + 1));
    bar.setAttribute('x', b.x); bar.setAttribute('width', 17);
    bar.setAttribute('y', FLOOR - b.h); bar.setAttribute('height', b.h);
    svg.appendChild(bar);
  });

  const lens = document.createElementNS(ns, 'circle');
  lens.setAttribute('class', 'lens');
  lens.setAttribute('cx', 155); lens.setAttribute('cy', 58); lens.setAttribute('r', 22);
  svg.appendChild(lens);

  const handle = document.createElementNS(ns, 'line');
  handle.setAttribute('class', 'handle');
  handle.setAttribute('x1', 171); handle.setAttribute('y1', 75);
  handle.setAttribute('x2', 186); handle.setAttribute('y2', 90);
  svg.appendChild(handle);

  container.appendChild(svg);
  return svg;
}
