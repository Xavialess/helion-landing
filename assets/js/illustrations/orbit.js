const RING_ROTATIONS = [0, 60, 120];

export function mountOrbit(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 180 150');
  svg.setAttribute('class', 'ill ill-orbit' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  RING_ROTATIONS.forEach((deg) => {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('class', 'ring-group');
    const ellipse = document.createElementNS(ns, 'ellipse');
    ellipse.setAttribute('class', 'ring');
    ellipse.setAttribute('cx', 90); ellipse.setAttribute('cy', 75);
    ellipse.setAttribute('rx', 70); ellipse.setAttribute('ry', 26);
    ellipse.setAttribute('transform', `rotate(${deg} 90 75)`);
    g.appendChild(ellipse);
    const particle = document.createElementNS(ns, 'circle');
    particle.setAttribute('class', 'particle');
    particle.setAttribute('r', 3.5);
    const rad = (deg * Math.PI) / 180;
    particle.setAttribute('cx', 90 + 70 * Math.cos(rad));
    particle.setAttribute('cy', 75 + 26 * Math.sin(rad));
    g.appendChild(particle);
    svg.appendChild(g);
  });

  const core = document.createElementNS(ns, 'circle');
  core.setAttribute('class', 'core');
  core.setAttribute('cx', 90); core.setAttribute('cy', 75); core.setAttribute('r', 9);
  svg.appendChild(core);

  container.appendChild(svg);
  return svg;
}
