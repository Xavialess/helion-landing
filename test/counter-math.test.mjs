import test from 'node:test';
import assert from 'node:assert/strict';
import { easeOutExpo, counterValueAt } from '../assets/js/counter-math.mjs';

test('easeOutExpo returns 0 at t=0 and 1 at t=1', () => {
  assert.equal(easeOutExpo(0), 0);
  assert.equal(easeOutExpo(1), 1);
});

test('easeOutExpo is monotonically increasing', () => {
  let prev = -Infinity;
  for (let t = 0; t <= 1; t += 0.1) {
    const v = easeOutExpo(t);
    assert.ok(v >= prev, `value at t=${t} (${v}) should be >= previous (${prev})`);
    prev = v;
  }
});

test('counterValueAt returns 0 at elapsed=0', () => {
  assert.equal(counterValueAt(0, 1000, 100), 0);
});

test('counterValueAt returns target once elapsed >= duration', () => {
  assert.equal(counterValueAt(1000, 1000, 100), 100);
  assert.equal(counterValueAt(5000, 1000, 100), 100);
});

test('counterValueAt is between 0 and target mid-animation', () => {
  const v = counterValueAt(500, 1000, 100);
  assert.ok(v > 0 && v < 100, `expected 0 < v < 100, got ${v}`);
});
