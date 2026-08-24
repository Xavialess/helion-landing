export function mountIconMobile(container, { onDark = false } = {}) {
  container.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 220 150');
  svg.setAttribute('class', 'ill ill-mobile' + (onDark ? ' ill--on-dark' : ''));
  svg.setAttribute('aria-hidden', 'true');

  const phone = document.createElementNS(ns, 'rect');
  phone.setAttribute('class', 'body');
  phone.setAttribute('x', 25); phone.setAttribute('y', 18);
  phone.setAttribute('width', 55); phone.setAttribute('height', 112);
  phone.setAttribute('rx', 10);
  svg.appendChild(phone);

  const homeIndicator = document.createElementNS(ns, 'line');
  homeIndicator.setAttribute('class', 'chrome');
  homeIndicator.setAttribute('x1', 42); homeIndicator.setAttribute('y1', 120);
  homeIndicator.setAttribute('x2', 63); homeIndicator.setAttribute('y2', 120);
  svg.appendChild(homeIndicator);

  const phoneScreen = document.createElementNS(ns, 'circle');
  phoneScreen.setAttribute('class', 'screen screen--a');
  phoneScreen.setAttribute('cx', 52); phoneScreen.setAttribute('cy', 66); phoneScreen.setAttribute('r', 6);
  svg.appendChild(phoneScreen);

  const browser = document.createElementNS(ns, 'rect');
  browser.setAttribute('class', 'body');
  browser.setAttribute('x', 95); browser.setAttribute('y', 35);
  browser.setAttribute('width', 100); browser.setAttribute('height', 75);
  browser.setAttribute('rx', 6);
  svg.appendChild(browser);

  const chromeDivider = document.createElementNS(ns, 'line');
  chromeDivider.setAttribute('class', 'chrome');
  chromeDivider.setAttribute('x1', 95); chromeDivider.setAttribute('y1', 52);
  chromeDivider.setAttribute('x2', 195); chromeDivider.setAttribute('y2', 52);
  svg.appendChild(chromeDivider);

  [105, 113, 121].forEach((cx) => {
    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('class', 'dot');
    dot.setAttribute('cx', cx); dot.setAttribute('cy', 43.5); dot.setAttribute('r', 2);
    svg.appendChild(dot);
  });

  const browserScreen = document.createElementNS(ns, 'circle');
  browserScreen.setAttribute('class', 'screen screen--b');
  browserScreen.setAttribute('cx', 145); browserScreen.setAttribute('cy', 75); browserScreen.setAttribute('r', 7);
  svg.appendChild(browserScreen);

  container.appendChild(svg);
  return svg;
}
