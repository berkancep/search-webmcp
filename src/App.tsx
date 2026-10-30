import { useEffect, useRef, useState } from 'react';
import { useWebMCP } from 'use-webmcp-tool';
import { getProduct, addItem, cartSummary } from '../server/commerce.mjs';
import type { Tool } from './types';
import { useSearch } from './useSearch';
import { createTools } from './tools';
import ProductCard from './ProductCard';
import { money } from './format';
function ToolRegistration({ tool }: { tool: Tool }) {
  useWebMCP(tool);
  return null;
}
export default function App() {
  const {
    state,
    data,
    busy,
    error,
    query,
    setQuery,
    price,
    setPrice,
    current,
    latest,
    run,
    patch,
    clearFilters,
  } = useSearch();
  const [cart, setCart] = useState<
    { productId: string; size: string; quantity: number }[]
  >([]);
  const cartRef = useRef(cart);
  const [view, setView] = useState<'product' | 'cart' | null>(null);
  const [product, setProduct] = useState<ReturnType<typeof getProduct> | null>(
    null,
  );
  const [selectedSize, setSelectedSize] = useState('');
  const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (view && !dialog.current?.open) dialog.current?.showModal();
    else if (!view) dialog.current?.close();
  }, [view]);
  function details(id: unknown) {
    const p = getProduct(id);
    setProduct(p);
    setSelectedSize('');
    setNotice('');
    setView('product');
    return p;
  }
  function add(input: Record<string, unknown>) {
    const next = addItem(cartRef.current, input);
    cartRef.current = next;
    setCart(next);
    setNotice('Ürün sepetine eklendi.');
    return cartSummary(next);
  }
  const basket = cartSummary(cart);
  const tools = createTools({
    current,
    latest,
    cartRef,
    patch,
    details,
    add,
    showCart: () => setView('cart'),
  });
  return (
    <>
      <header>
        <a className="logo" href="/demo">
          search<span>lab</span>
        </a>
        <div className="header-right">
          YENİ SEZON <span className="tag">AYAKKABI KOLEKSİYONU</span>
        </div>
        <button className="cart-button" onClick={() => setView('cart')}>
          Sepetim ({basket.itemCount})
        </button>
      </header>
      <main>
        <section className="intro">
          <div>
            <div className="eyebrow">HER ADIMDA SENİNLE</div>
            <h1>Bir sonraki adımını keşfet.</h1>
            <p>Koşuda, şehirde, her gün. Tarzına uygun ayakkabıyı bul.</p>
          </div>
        </section>
        <div className="workspace wide">
          <section className="search-area">
            <form
              className="searchbox"
              onSubmit={(e) => {
                e.preventDefault();
                void patch({ q: query });
              }}
            >
              <span>⌕</span>
              <input
                aria-label="Ürün ara"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ürün veya marka ara…"
              />
              <button>Ara →</button>
            </form>
            <div className="results-heading">
              <div>
                <h2>
                  {state.q ? `“${state.q}” sonuçları` : 'Ürünleri keşfet'}
                </h2>
                <span role="status">
                  {busy ? 'Aranıyor…' : `${data?.total ?? 0} ürün bulundu`}
                </span>
              </div>
              <select
                aria-label="Sıralama"
                value={state.sort}
                onChange={(e) => void patch({ sort: e.target.value })}
              >
                <option value="relevance">Önerilen sıralama</option>
                <option value="price_asc">En düşük fiyat</option>
                <option value="price_desc">En yüksek fiyat</option>
              </select>
            </div>
            <div className="catalog">
              <aside className="filters">
                <h3>
                  Filtreler{' '}
                  <button onClick={() => void clearFilters()}>Temizle</button>
                </h3>
                <h4>Renk</h4>
                {(data?.facets.colors ?? []).map((f) => (
                  <label key={f.value}>
                    <input
                      type="checkbox"
                      checked={state.color === f.value}
                      onChange={() =>
                        void patch({
                          color: state.color === f.value ? '' : f.value,
                        })
                      }
                    />
                    <i className={'swatch ' + f.value} />
                    {f.value}
                    <em>{f.count}</em>
                  </label>
                ))}
                <h4>Beden</h4>
                <div className="sizes">
                  {(data?.facets.sizes ?? []).map((f) => (
                    <button
                      title={`${f.count} ürün`}
                      className={state.size === f.value ? 'selected' : ''}
                      key={f.value}
                      onClick={() =>
                        void patch({
                          size: state.size === f.value ? '' : f.value,
                        })
                      }
                    >
                      {f.value}
                      <small>{f.count}</small>
                    </button>
                  ))}
                </div>
                <h4>Üst fiyat sınırı</h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void patch({
                      maxPrice: price === '' ? null : Number(price),
                    });
                  }}
                >
                  <input
                    aria-label="Üst fiyat sınırı"
                    type="number"
                    min="0"
                    placeholder="Sınır yok"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <button className="apply">Uygula</button>
                </form>
              </aside>
              <div>
                <div className="chips">
                  {(['color', 'size', 'maxPrice'] as const)
                    .filter((k) => state[k] !== '' && state[k] !== null)
                    .map((k) => (
                      <button key={k} onClick={() => void clearFilters([k])}>
                        {k === 'maxPrice'
                          ? `${money(state[k] as number)} altı`
                          : k === 'size'
                            ? `${state[k]} numara`
                            : state[k]}{' '}
                        ×
                      </button>
                    ))}
                </div>
                {error ? (
                  <div className="empty" role="alert">
                    {error}
                    <button onClick={() => void run(current.current, false)}>
                      Tekrar dene
                    </button>
                  </div>
                ) : !busy && data?.total === 0 ? (
                  <div className="empty">
                    <h2>Bu aramaya uygun ürün yok.</h2>
                    <p>Filtreleri genişletmeyi deneyebilirsin.</p>
                    <button onClick={() => void clearFilters()}>
                      Filtreleri temizle
                    </button>
                  </div>
                ) : (
                  <div className={'products ' + (busy ? 'loading' : '')}>
                    {data?.products.map((p, i) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        index={i}
                        onDetails={details}
                      />
                    ))}
                  </div>
                )}
                {data && data.total > data.pageSize && (
                  <div className="pagination">
                    <button
                      disabled={state.page === 1}
                      onClick={() => void patch({ page: state.page - 1 })}
                    >
                      ← Önceki
                    </button>
                    <span>
                      {state.page} / {Math.ceil(data.total / data.pageSize)}
                    </span>
                    <button
                      disabled={
                        state.page >= Math.ceil(data.total / data.pageSize)
                      }
                      onClick={() => void patch({ page: state.page + 1 })}
                    >
                      Sonraki →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
        <footer>
          <span>SEARCHLAB · AYAKKABI KOLEKSİYONU</span>
          <span>Her adımda seninle.</span>
        </footer>
      </main>
      <dialog
        ref={dialog}
        onCancel={() => setView(null)}
        onClose={() => setView(null)}
        aria-label={view === 'cart' ? 'Sepetim' : 'Ürün detayı'}
      >
        <button
          className="dialog-close"
          aria-label="Kapat"
          onClick={() => setView(null)}
        >
          ×
        </button>
        {view === 'product' && product ? (
          <section className="detail">
            <div className="eyebrow">{product.brand}</div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>
              {product.color} · ★ {product.rating}
            </p>
            <div className="price">{money(product.price)}</div>
            <label>
              Beden{' '}
              <select
                aria-label="Ürün bedeni"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Beden seç</option>
                {product.sizes.map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </label>
            <p>Her beden için en fazla {product.stockPerSize} adet.</p>
            <button
              className="primary"
              disabled={!selectedSize}
              onClick={() => {
                try {
                  add({ productId: product.id, size: selectedSize });
                } catch (e) {
                  setNotice(e instanceof Error ? e.message : String(e));
                }
              }}
            >
              Sepete ekle
            </button>
            <p role="status">{notice}</p>
            <button className="detail-button" onClick={() => setView('cart')}>
              Sepetime git →
            </button>
          </section>
        ) : view === 'cart' ? (
          <section>
            <h2>Sepetim ({basket.itemCount})</h2>
            {basket.items.length === 0 ? (
              <p>Sepetin henüz boş.</p>
            ) : (
              basket.items.map(
                (item: {
                  productId: string;
                  size: string;
                  quantity: number;
                  brand: string;
                  name: string;
                  color: string;
                  unitPrice: number;
                  lineTotal: number;
                }) => (
                  <article
                    className="cart-item"
                    key={item.productId + item.size}
                  >
                    <strong>
                      {item.brand} {item.name}
                    </strong>
                    <p>
                      {item.color} · {item.size} numara · {item.quantity} adet
                    </p>
                    <span>{money(item.unitPrice)} / adet</span>
                    <b>{money(item.lineTotal)}</b>
                  </article>
                ),
              )
            )}
            <div className="cart-total">
              <span>Toplam</span>
              <strong>{money(basket.total)}</strong>
            </div>
            <button className="primary" onClick={() => setView(null)}>
              Alışverişe devam et
            </button>
          </section>
        ) : null}
      </dialog>
      {tools.map((tool) => (
        <ToolRegistration key={tool.name} tool={tool} />
      ))}
    </>
  );
}
