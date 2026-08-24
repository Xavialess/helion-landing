const MODULES = [
  { x: 34, y: 30, w: 70, h: 45 },
  { x: 116, y: 30, w: 70, h: 45 },
  { x: 34, y: 85, w: 70, h: 45 },
  { x: 116, y: 85, w: 70, h: 45 },
];

export function mountIconErp(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 150');
  svg.setAttribute('class', 'ill ill-erp' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  const frame = document.createElementNS(ns, 'rect');
  frame.setAttribute('class', 'frame');
  frame.setAttribute('x', 20); frame.setAttribute('y', 16);
  frame.setAttribute('width', 180); frame.setAttribute('height', 118);
  frame.setAttribute('rx', 10);
  svg.appendChild(frame);

  MODULES.forEach((m, i) => {
    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('class', 'module');
    rect.setAttribute('x', m.x); rect.setAttribute('y', m.y);
    rect.setAttribute('width', m.w); rect.setAttribute('height', m.h);
    rect.setAttribute('rx', 5);
    svg.appendChild(rect);

    const led = document.createElementNS(ns, 'circle');
    led.setAttribute('class', 'led led--' + (i + 1));
    led.setAttribute('cx', m.x + 11); led.setAttribute('cy', m.y + 11); led.setAttribute('r', 3.5);
    svg.appendChild(led);
  });

  container.appendChild(svg);
  return svg;
}
