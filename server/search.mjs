export const initialState = {
  q: '',
  color: '',
  size: '',
  maxPrice: null,
  sort: 'relevance',
  page: 1,
};
const names = [
  'Stride Koşu Ayakkabısı',
  'Aero Koşu Ayakkabısı',
  'Urban Günlük Ayakkabı',
  'Pace Koşu Ayakkabısı',
  'Cloud Koşu Ayakkabısı',
  'Trail Outdoor Ayakkabı',
  'Flex Koşu Ayakkabısı',
  'Motion Koşu Ayakkabısı',
  'Studio Günlük Ayakkabı',
  'Sprint Koşu Ayakkabısı',
  'Peak Outdoor Ayakkabı',
  'Flow Koşu Ayakkabısı',
];
export const products = names.map((name, i) => ({
  id: `SKU-${100 + i}`,
  name,
  brand: ['NOVA', 'PACE', 'FORM'][i % 3],
  color: ['siyah', 'beyaz', 'siyah', 'mavi'][i % 4],
  price: [
    1499, 2299, 1199, 1799, 2499, 3499, 999, 1599, 2499, 1999, 2899, 1299,
  ][i],
  sizes:
    i === 4
      ? ['42', '43']
      : i % 3 === 0
        ? ['40', '41', '42']
        : i % 3 === 1
          ? ['41', '43']
          : ['42', '43', '44'],
  rating: (4.2 + (i % 8) / 10).toFixed(1),
  reviews: 87 + i * 31,
}));
export function validatePatch(patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch))
    throw Error('Parametreler bir nesne olmalı.');
  for (const [k, v] of Object.entries(patch)) {
    if (!(k in initialState)) throw Error(`Bilinmeyen parametre: ${k}`);
    if (k === 'q' && (typeof v !== 'string' || v.length > 150))
      throw Error('Sorgu en fazla 150 karakter olmalı.');
    if (k === 'color' && !['', 'siyah', 'beyaz', 'mavi'].includes(v))
      throw Error('Renk: siyah, beyaz, mavi veya boş olmalı.');
    if (k === 'size' && !['', '40', '41', '42', '43', '44'].includes(v))
      throw Error('Beden 40–44 arasında veya boş olmalı.');
    if (
      k === 'maxPrice' &&
      v !== null &&
      (typeof v !== 'number' || !Number.isFinite(v) || v < 0)
    )
      throw Error('Fiyat pozitif sayı veya null olmalı.');
    if (k === 'sort' && !['relevance', 'price_asc', 'price_desc'].includes(v))
      throw Error('Geçersiz sıralama.');
    if (k === 'page' && (!Number.isInteger(v) || v < 1))
      throw Error('Sayfa pozitif tamsayı olmalı.');
  }
  return patch;
}
const norm = (s) => s.toLocaleLowerCase('tr').replaceAll('ı', 'i');
export function search(input) {
  const state = { ...initialState, ...validatePatch(input) };
  const words = norm(state.q).trim().split(/\s+/).filter(Boolean);
  const matching = products.filter((p) =>
    words.every((w) => norm(`${p.name} ${p.brand}`).includes(w)),
  );
  const filter = (p, except) =>
    (except === 'color' || !state.color || p.color === state.color) &&
    (except === 'size' || !state.size || p.sizes.includes(state.size)) &&
    (except === 'maxPrice' ||
      state.maxPrice === null ||
      p.price <= state.maxPrice);
  const result = matching.filter((p) => filter(p));
  if (state.sort !== 'relevance')
    result.sort((a, b) =>
      state.sort === 'price_asc' ? a.price - b.price : b.price - a.price,
    );
  const facets = {
    colors: ['siyah', 'beyaz', 'mavi'].map((value) => ({
      value,
      count: matching.filter((p) => filter(p, 'color') && p.color === value)
        .length,
    })),
    sizes: ['40', '41', '42', '43', '44'].map((value) => ({
      value,
      count: matching.filter(
        (p) => filter(p, 'size') && p.sizes.includes(value),
      ).length,
    })),
  };
  return {
    state,
    total: result.length,
    products: result.slice((state.page - 1) * 6, state.page * 6),
    facets,
    pageSize: 6,
  };
}
