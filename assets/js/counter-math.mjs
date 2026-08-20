export function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function counterValueAt(elapsedMs, durationMs, target) {
  if (elapsedMs >= durationMs) return target;
  const t = Math.max(0, elapsedMs) / durationMs;
  return Math.round(easeOutExpo(t) * target);
}
