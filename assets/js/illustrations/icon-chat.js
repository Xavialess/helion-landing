export function mountIconChat(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 150');
  svg.setAttribute('class', 'ill ill-chat' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  const bubbleA = document.createElementNS(ns, 'rect');
  bubbleA.setAttribute('class', 'bubble');
  bubbleA.setAttribute('x', 25); bubbleA.setAttribute('y', 28);
  bubbleA.setAttribute('width', 95); bubbleA.setAttribute('height', 44); bubbleA.setAttribute('rx', 14);
  svg.appendChild(bubbleA);

  const tailA = document.createElementNS(ns, 'polygon');
  tailA.setAttribute('class', 'bubble');
  tailA.setAttribute('points', '38,72 30,86 52,72');
  svg.appendChild(tailA);

  const bubbleB = document.createElementNS(ns, 'rect');
  bubbleB.setAttribute('class', 'bubble bubble--b');
  bubbleB.setAttribute('x', 100); bubbleB.setAttribute('y', 78);
  bubbleB.setAttribute('width', 95); bubbleB.setAttribute('height', 44); bubbleB.setAttribute('rx', 14);
  svg.appendChild(bubbleB);

  const tailB = document.createElementNS(ns, 'polygon');
  tailB.setAttribute('class', 'bubble bubble--b');
  tailB.setAttribute('points', '182,122 190,136 168,122');
  svg.appendChild(tailB);

  [125, 140, 155].forEach((cx, i) => {
    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('class', 'dot dot--' + (i + 1));
    dot.setAttribute('cx', cx); dot.setAttribute('cy', 100); dot.setAttribute('r', 3.5);
    svg.appendChild(dot);
  });

  container.appendChild(svg);
  return svg;
}
