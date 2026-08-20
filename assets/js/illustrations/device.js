export function mountDevice(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 160 150');
  svg.setAttribute('class', 'ill ill-device' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  const body = document.createElementNS(ns, 'rect');
  body.setAttribute('class', 'body');
  body.setAttribute('x', 55); body.setAttribute('y', 55);
  body.setAttribute('width', 50); body.setAttribute('height', 40);
  body.setAttribute('rx', 6);
  svg.appendChild(body);

  const led = document.createElementNS(ns, 'circle');
  led.setAttribute('class', 'led');
  led.setAttribute('cx', 80); led.setAttribute('cy', 75); led.setAttribute('r', 4);
  svg.appendChild(led);

  [18, 30, 42].forEach((r) => {
    const arc = document.createElementNS(ns, 'circle');
    arc.setAttribute('class', 'wave');
    arc.setAttribute('cx', 80); arc.setAttribute('cy', 75); arc.setAttribute('r', r);
    svg.appendChild(arc);
  });

  container.appendChild(svg);
  return svg;
}
