export function mountIconAgent(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 150');
  svg.setAttribute('class', 'ill ill-agent' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  [24, 34].forEach((r, i) => {
    const ring = document.createElementNS(ns, 'circle');
    ring.setAttribute('class', 'ring ring--' + (i + 1));
    ring.setAttribute('cx', 90); ring.setAttribute('cy', 68); ring.setAttribute('r', r);
    svg.appendChild(ring);
  });

  const core = document.createElementNS(ns, 'circle');
  core.setAttribute('class', 'core');
  core.setAttribute('cx', 90); core.setAttribute('cy', 68); core.setAttribute('r', 14);
  svg.appendChild(core);

  const badge = document.createElementNS(ns, 'rect');
  badge.setAttribute('class', 'badge');
  badge.setAttribute('x', 108); badge.setAttribute('y', 92);
  badge.setAttribute('width', 46); badge.setAttribute('height', 20); badge.setAttribute('rx', 10);
  svg.appendChild(badge);

  const badgeDot = document.createElementNS(ns, 'circle');
  badgeDot.setAttribute('class', 'badge-dot');
  badgeDot.setAttribute('cx', 118); badgeDot.setAttribute('cy', 102); badgeDot.setAttribute('r', 3);
  svg.appendChild(badgeDot);

  container.appendChild(svg);
  return svg;
}
