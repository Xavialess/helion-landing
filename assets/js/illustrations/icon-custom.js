const BLOCKS = [
  { x: 30, y: 70, w: 68, h: 50 },
  { x: 88, y: 28, w: 58, h: 56 },
  { x: 138, y: 76, w: 54, h: 44 },
];

export function mountIconCustom(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 150');
  svg.setAttribute('class', 'ill ill-custom' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  BLOCKS.forEach((b, i) => {
    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('class', 'block block--' + (i + 1));
    rect.setAttribute('x', b.x); rect.setAttribute('y', b.y);
    rect.setAttribute('width', b.w); rect.setAttribute('height', b.h);
    rect.setAttribute('rx', 8);
    svg.appendChild(rect);

    const pin = document.createElementNS(ns, 'circle');
    pin.setAttribute('class', 'pin');
    pin.setAttribute('cx', b.x + 12); pin.setAttribute('cy', b.y + 12); pin.setAttribute('r', 2.5);
    svg.appendChild(pin);
  });

  container.appendChild(svg);
  return svg;
}
