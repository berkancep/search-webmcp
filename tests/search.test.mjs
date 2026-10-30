import { test } from 'node:test';
import assert from 'node:assert/strict';
import { search, validatePatch } from '../server/search.mjs';
test('search scenario and sort', () => {
  const r = search({
    q: 'koşu',
    color: 'siyah',
    size: '42',
    maxPrice: 2000,
    sort: 'price_asc',
  });
  assert.ok(r.total > 0);
  assert.ok(
    r.products.every(
      (p) => p.price <= 2000 && p.color === 'siyah' && p.sizes.includes('42'),
    ),
  );
  assert.deepEqual(
    r.products.map((p) => p.price),
    r.products.map((p) => p.price).sort((a, b) => a - b),
  );
});
test('zero results and invalid input', () => {
  assert.equal(search({ q: 'olmayan ürün' }).total, 0);
  for (const p of [
    { maxPrice: -1 },
    { size: '99' },
    { page: 0 },
    { sort: 'foo' },
    { unknown: 1 },
  ])
    assert.throws(() => validatePatch(p));
});
test('self excluding facets and pagination', () => {
  const r = search({ color: 'siyah' });
  assert.ok(r.facets.colors.find((f) => f.value === 'beyaz').count > 0);
  const a = search({}),
    b = search({ page: 2 });
  assert.equal(a.products.length, 6);
  assert.equal(b.products.length, 6);
  assert.ok(!a.products.some((p) => b.products.some((q) => p.id === q.id)));
});
test('removing only price expands results and keeps filters', () => {
  const state = {
    q: 'koşu',
    color: 'siyah',
    size: '42',
    maxPrice: 2000,
    sort: 'price_asc',
  };
  assert.equal(search(state).total, 2);
  const result = search({ ...state, maxPrice: null });
  assert.equal(result.total, 3);
  assert.deepEqual(
    result.products.map((p) => p.price),
    [999, 1499, 2499],
  );
  assert.equal(result.state.size, '42');
  assert.equal(result.state.color, 'siyah');
});
