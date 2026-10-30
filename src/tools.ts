import type { RefObject } from 'react';
import { validatePatch } from '../server/search.mjs';
import { getProduct, cartSummary } from '../server/commerce.mjs';
import type { State, Result, Tool } from './types';

type ToolContext = {
  current: RefObject<State>;
  latest: RefObject<Result | null>;
  cartRef: RefObject<{ productId: string; size: string; quantity: number }[]>;
  patch: (patch: Partial<State>) => Promise<unknown>;
  details: (id: unknown) => unknown;
  add: (input: Record<string, unknown>) => unknown;
  showCart: () => void;
};

export function createTools({
  current,
  latest,
  cartRef,
  patch,
  details,
  add,
  showCart,
}: ToolContext): Tool[] {
  const properties = {
    q: {
      type: 'string',
      description:
        'Ürün adı veya marka sorgusu; mevcut sorguyu korumak için atlayın.',
    },
    color: {
      type: 'string',
      enum: ['', 'siyah', 'beyaz', 'mavi'],
      description: 'Renk filtresi; boş değer filtreyi kaldırır.',
    },
    size: {
      type: 'string',
      enum: ['', '40', '41', '42', '43', '44'],
      description: 'Stokta bulunması gereken beden; boş değer kaldırır.',
    },
    maxPrice: {
      type: ['number', 'null'],
      minimum: 0,
      description: 'TL cinsinden üst fiyat sınırı; null filtreyi kaldırır.',
    },
    sort: {
      type: 'string',
      enum: ['relevance', 'price_asc', 'price_desc'],
      description: 'Sonuç sıralaması.',
    },
    page: {
      type: 'integer',
      minimum: 1,
      description: 'Bir tabanlı sonuç sayfası.',
    },
  };
  const schema = (p: Record<string, unknown>, required: string[] = []) => ({
    type: 'object',
    properties: p,
    required,
    additionalProperties: false,
  });
  const productSchema = {
    productId: {
      type: 'string',
      description: 'Arama sonucundaki SKU ürün kimliği.',
    },
  };
  const onlyProduct = (p: Record<string, unknown>) => {
    if (
      Object.keys(p).some((k) => k !== 'productId') ||
      typeof p.productId !== 'string'
    )
      throw Error('productId gerekli.');
    return p.productId;
  };
  const noArgs = (p: Record<string, unknown>) => {
    if (Object.keys(p).length) throw Error('Parametre beklenmiyor.');
  };
  return [
    {
      name: 'search_products',
      description:
        'Search products and update the visible results. Omitted parameters preserve current search state. Filter changes reset pagination.',
      inputSchema: schema(properties),
      execute: async (p: Record<string, unknown>) => patch(validatePatch(p)),
    },
    {
      name: 'get_search_state',
      description: 'Read the active search query, filters, sorting and page.',
      inputSchema: schema({}),
      annotations: { readOnlyHint: true },
      execute: async (p: Record<string, unknown>) => {
        if (Object.keys(p).length) throw Error('Parametre beklenmiyor.');
        return current.current;
      },
    },
    {
      name: 'get_available_filters',
      description:
        'Read contextual facet counts for the current results. Counts exclude the facet’s own selection.',
      inputSchema: schema({}),
      annotations: { readOnlyHint: true },
      execute: async (p: Record<string, unknown>) => {
        if (Object.keys(p).length) throw Error('Parametre beklenmiyor.');
        if (
          !latest.current ||
          JSON.stringify(latest.current.state) !==
            JSON.stringify(current.current)
        )
          throw Error('Sonuçlar yükleniyor; tekrar deneyin.');
        return latest.current.facets;
      },
    },
    {
      name: 'set_sort_order',
      description:
        'Change search result ordering while preserving query and filters.',
      inputSchema: schema({ sort: properties.sort }, ['sort']),
      execute: async (p: Record<string, unknown>) => {
        if (
          Object.keys(p).some((k) => k !== 'sort') ||
          typeof p.sort !== 'string'
        )
          throw Error('Yalnızca sort gerekli.');
        validatePatch(p);
        return patch({ sort: p.sort });
      },
    },
    {
      name: 'clear_filters',
      description:
        'Clear color, size and price filters while preserving the query and sorting. Optionally clear selected filters.',
      inputSchema: schema({
        fields: {
          type: 'array',
          items: { type: 'string', enum: ['color', 'size', 'maxPrice'] },
          description: 'Kaldırılacak filtreler; atlanırsa tüm filtreler.',
        },
      }),
      execute: async (p: Record<string, unknown>) => {
        if (Object.keys(p).some((k) => k !== 'fields'))
          throw Error('Bilinmeyen parametre.');
        const fields = p.fields ?? ['color', 'size', 'maxPrice'];
        if (
          !Array.isArray(fields) ||
          fields.some((k) => !['color', 'size', 'maxPrice'].includes(k))
        )
          throw Error('Geçersiz filtre listesi.');
        return patch(
          Object.fromEntries(
            fields.map((k) => [k, k === 'maxPrice' ? null : '']),
          ),
        );
      },
    },
    {
      name: 'get_product_details',
      description:
        'Read product details, available sizes and stock limit without opening a view.',
      inputSchema: schema(productSchema, ['productId']),
      annotations: { readOnlyHint: true },
      execute: async (p: Record<string, unknown>) => getProduct(onlyProduct(p)),
    },
    {
      name: 'show_product_details',
      description:
        'Open the product detail dialog visibly and return its details.',
      inputSchema: schema(productSchema, ['productId']),
      execute: async (p: Record<string, unknown>) => details(onlyProduct(p)),
    },
    {
      name: 'add_to_cart',
      description:
        'Add a product in a selected in-stock size to the demo cart. Updates the visible cart count. Repeated calls add more units.',
      inputSchema: schema(
        {
          ...productSchema,
          size: {
            type: 'string',
            description: 'Ürün detayında stokta bulunan beden.',
          },
          quantity: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            default: 1,
            description: 'Eklenecek adet.',
          },
        },
        ['productId', 'size'],
      ),
      execute: async (p: Record<string, unknown>) => add(p),
    },
    {
      name: 'get_cart',
      description: 'Read demo cart items, quantities and total in TRY.',
      inputSchema: schema({}),
      annotations: { readOnlyHint: true },
      execute: async (p: Record<string, unknown>) => {
        noArgs(p);
        return cartSummary(cartRef.current);
      },
    },
    {
      name: 'show_cart',
      description:
        'Open the cart dialog visibly and return its items and total.',
      inputSchema: schema({}),
      execute: async (p: Record<string, unknown>) => {
        noArgs(p);
        showCart();
        return cartSummary(cartRef.current);
      },
    },
  ].map((t) => ({
    ...t,
    execute: async (input: Record<string, unknown>) => {
      let result;
      try {
        result = await t.execute(input);
      } catch (e) {
        result = { error: e instanceof Error ? e.message : String(e) };
      }
      return result && typeof result === 'object' && 'error' in result
        ? {
            isError: true,
            content: [{ type: 'text', text: JSON.stringify(result) }],
          }
        : result;
    },
  }));
}
