import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateForecast, sumVisibleCostRows } from '../src/lib/finance.ts';
import { COST_LIGNES, COST_ARRETE } from '../src/content/cheetah.ts';
const base = { initialBudget: 800, variation: 0, expenses: 420, progress: 45, remaining: 500, previousVariance: 9, mode: 'manual' };
const calc = (overrides = {}) => calculateForecast({ ...base, ...overrides });
test('manual estimate reconciles earned value, forecast, variance and drift', () => {
  const r = calc(); assert.equal(r.earned, 360); assert.equal(r.forecast, 920); assert.equal(r.variance, 120); assert.equal(r.ratio, 15); assert.equal(r.drift, 111);
});
test('negative approved variation adjusts budget before earned value', () => {
  const r = calc({ variation: -100 }); assert.equal(r.budget, 700); assert.equal(r.earned, 315);
});
test('zero budget has no relative variance', () => {
  const r = calc({ initialBudget: 0 }); assert.equal(r.ratio, null); assert.equal(r.forecast, 920);
});
test('zero spending makes performance projection unavailable, without fabricated CPI', () => {
  const r = calc({ expenses: 0, mode: 'performance' }); assert.equal(r.cpi, null); assert.equal(r.forecast, null);
});
test('zero earned value makes performance projection unavailable', () => assert.equal(calc({ progress: 0, mode: 'performance' }).remaining, null));
test('completed work has no modelled remaining cost', () => assert.equal(calc({ progress: 100, expenses: 0, mode: 'performance' }).remaining, 0));
test('budget method and performance method have distinct assumptions', () => {
  assert.equal(calc({ mode: 'budget' }).forecast, 860);
  assert.ok(Math.abs(calc({ mode: 'performance' }).forecast - 933.3333333333333) < 1e-9);
});
test('zero remaining and savings preserve signs', () => {
  assert.equal(calc({ remaining: 0 }).variance, -380); assert.equal(calc({ remaining: 0 }).ratio, -47.5);
});
test('calculation retains decimals until display', () => assert.equal(calc({ expenses: 78.5, remaining: 210 }).forecast, 288.5));
test('reject invalid, unbounded and inconsistent inputs', () => {
  for (const overrides of [{ progress: NaN }, { expenses: Infinity }, { remaining: -1 }, { progress: 101 }, { progress: -1 }, { initialBudget: -1 }, { variation: -801 }, { expenses: 1_000_001 }, { mode: 'other' }]) assert.throws(() => calc(overrides), RangeError);
});
test('reasonable extremes remain finite', () => assert.ok(Number.isFinite(calc({ initialBudget: 1_000_000, expenses: 1_000_000, remaining: 1_000_000 }).forecast)));
test('visible historical source totals stay distinct from unexplained summary', () => {
  assert.deepEqual(sumVisibleCostRows(COST_LIGNES), { budget: 795, forecast: 784, variance: -11 });
  assert.equal(COST_ARRETE.cp - COST_ARRETE.bad, -2); assert.equal(COST_ARRETE.ecart, -3);
  for (const row of COST_LIGNES) {
    assert.equal(row.bi + (row.variation ?? 0), row.bad);
    assert.equal(row.cp - row.bad, row.e);
    assert.equal(row.e - row.ePrec, row.d);
    assert.ok(Math.abs((row.depenses ?? 0) + row.raf - row.cp) <= 0.5);
    assert.equal((row.avancement ?? 0) / 100 * row.bad, row.valeurAcquise);
  }
});
