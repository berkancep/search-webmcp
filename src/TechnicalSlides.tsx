/** Simplified excerpts retain the demo's shared handlers and lifecycle. */
export default function TechnicalSlides({ kind }: { kind: string }) {
  if (kind === 'registration') {
    return (
      <div className="technical-grid">
        <div>
          <pre>{`// SearchTool bileşeninin içinde
useWebMCP({
  name: 'search_products',
  description: 'Ürünleri ara ve ekranda göster.',
  inputSchema: {
    type: 'object',
    properties: { q: { type: 'string' } },
    additionalProperties: false,
  },
  execute: async input =>
    patch(validatePatch(input)),
});`}</pre>
        </div>
        <div className="technical-explain">
          <h3>Tanımın üç sorusu</h3>
          <p>
            <code>name + description</code>
            <br />
            Hangi işlem, ne zaman kullanılır?
          </p>
          <p>
            <code>inputSchema</code>
            <br />
            Hangi girdiyi kabul eder?
          </p>
          <p>
            <code>execute</code>
            <br />
            Uygulamada hangi metodu çağırır?
          </p>
          <p className="fine">
            Bileşen açılır → kayıt yapılır.
            <br />
            Ajan çağırır → execute çalışır.
            <br />
            Bileşen kaldırılır → kayıt temizlenir.
          </p>
        </div>
      </div>
    );
  }
  if (kind === 'shared') {
    return (
      <div className="technical-grid component-example">
        <div>
          <pre>{`function Products() {
  const { data, patch } = useSearch();

  async function getProducts(input) {
    const result = await patch(validatePatch(input));
    if ('error' in result) throw new Error(result.error);
    return result;
  }

  useWebMCP({
    name: 'get_products',
    description: 'Ürünleri getir ve göster.',
    inputSchema: searchSchema,
    execute: getProducts,
  });

  return (
    <section>
      <button onClick={() => getProducts({ q: 'koşu' })}>Ara</button>
      <p>{data?.total ?? 0} ürün bulundu.</p>
    </section>
  );
}`}</pre>
        </div>
        <div className="technical-explain">
          <h3>Tek component, iki giriş</h3>
          <ol>
            <li>
              Buton veya ajan aynı <code>getProducts(input)</code> metodunu
              çağırır.
            </li>
            <li>
              <code>patch → run → /api/search</code> ürünleri getirir.
            </li>
            <li>
              <code>data</code> güncellenir; sonuç sayısı ekranda güncellenir.
            </li>
            <li>
              Aynı sonuç <code>return</code> ile ajana da döner.
            </li>
          </ol>
          <p className="fine">
            Örnek kısaltılmıştır: searchSchema önceki slayttaki şemadır;
            useSearch ve validatePatch projeden gelir.
          </p>
        </div>
      </div>
    );
  }
  return null;
}
