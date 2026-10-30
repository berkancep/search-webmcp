import { products } from './search.mjs';
export function getProduct(productId) {
  const p = products.find((p) => p.id === productId);
  if (!p)
    throw Error(
      'Ürün bulunamadı. Arama sonucundaki product id değerini kullanın.',
    );
  return {
    ...p,
    description:
      'Hafif ve esnek yapısıyla günlük hareketine eşlik eden ayakkabı.',
    currency: 'TRY',
    stockPerSize: 5,
  };
}
export function addItem(cart, input) {
  if (
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input) ||
    Object.keys(input).some(
      (k) => !['productId', 'size', 'quantity'].includes(k),
    )
  )
    throw Error('Geçersiz sepet parametreleri.');
  const p = getProduct(input.productId),
    quantity = input.quantity ?? 1;
  if (typeof input.size !== 'string' || !p.sizes.includes(input.size))
    throw Error(
      'Seçilen beden stokta yok. Ürün detayındaki bedenlerden birini seçin.',
    );
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5)
    throw Error('Adet 1–5 arasında tamsayı olmalı.');
  const existing = cart.find(
    (i) => i.productId === p.id && i.size === input.size,
  );
  if ((existing?.quantity ?? 0) + quantity > 5)
    throw Error('Bu ürün ve beden için en fazla 5 adet eklenebilir.');
  return existing
    ? cart.map((i) =>
        i === existing ? { ...i, quantity: i.quantity + quantity } : i,
      )
    : [...cart, { productId: p.id, size: input.size, quantity }];
}
export function cartSummary(cart) {
  const items = cart.map((i) => {
    const p = getProduct(i.productId);
    return {
      ...i,
      name: p.name,
      brand: p.brand,
      color: p.color,
      unitPrice: p.price,
      lineTotal: p.price * i.quantity,
    };
  });
  return {
    items,
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    total: items.reduce((n, i) => n + i.lineTotal, 0),
    currency: 'TRY',
  };
}
