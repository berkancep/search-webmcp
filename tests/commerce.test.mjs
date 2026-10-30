import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getProduct, addItem, cartSummary } from '../server/commerce.mjs';
test('product lookup and stock validation', () => {
  assert.equal(getProduct('SKU-106').price, 999);
  assert.throws(() => getProduct('missing'));
  assert.throws(() => addItem([], { productId: 'SKU-106', size: '44' }));
  for (const quantity of [0, -1, 1.5, 6])
    assert.throws(() =>
      addItem([], { productId: 'SKU-106', size: '42', quantity }),
    );
});
test('cart merges variants and computes totals without modifying original', () => {
  const original = [];
  let c = addItem(original, { productId: 'SKU-106', size: '42' });
  c = addItem(c, { productId: 'SKU-106', size: '42', quantity: 2 });
  c = addItem(c, { productId: 'SKU-100', size: '42' });
  assert.equal(original.length, 0);
  const s = cartSummary(c);
  assert.equal(s.items.length, 2);
  assert.equal(s.itemCount, 4);
  assert.equal(s.total, 4496);
  assert.throws(() =>
    addItem(c, { productId: 'SKU-106', size: '42', quantity: 3 }),
  );
});
