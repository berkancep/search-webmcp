import { useEffect, useState } from 'react';
import './presentation.css';
import { slides } from './slides';
import TechnicalSlides from './TechnicalSlides';
function indexFromHash() {
  const n = Number(location.hash.slice(1));
  return Number.isInteger(n) && n >= 1 && n <= slides.length ? n - 1 : 0;
}
export default function Presentation() {
  const [index, setIndex] = useState(indexFromHash),
    [menu, setMenu] = useState(false),
    [copied, setCopied] = useState(false);
  const slide = slides[index];
  function go(n: number) {
    const i = Math.max(0, Math.min(slides.length - 1, n));
    setIndex(i);
    history.replaceState(null, '', location.pathname + '#' + (i + 1));
    setCopied(false);
  }
  useEffect(() => {
    document.title = 'WebMCP · Sunum';
    const hash = () => setIndex(indexFromHash());
    addEventListener('hashchange', hash);
    return () => removeEventListener('hashchange', hash);
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input,textarea,select')) return;
      if (e.key === ' ' && (e.target as HTMLElement)?.closest('button,a'))
        return;
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        go(index + 1);
      }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        go(index - 1);
      }
      if (e.key === 'Home') go(0);
      if (e.key === 'End') go(slides.length - 1);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [index]);
  const prompt =
    'WebMCP araçlarıyla 2000 TL altında, 42 numarası stokta olan siyah koşu ayakkabılarını en ucuzdan sırala. En ucuzunun detayını göster, bir adet sepete ekle ve sepeti aç.';
  async function fullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  }
  function content() {
    switch (slide.kind) {
      case 'registration':
      case 'shared':
        return <TechnicalSlides kind={slide.kind} />;
      case 'cover':
        return (
          <>
            <div className="two opening-paths">
              <article>
                <h3>Chatbot: yanıt üretir</h3>
                <div className="opening-flow">
                  Kullanıcı sorar → Model yanıtlar
                </div>
                <blockquote>
                  “En çok satılan siyah koşu ayakkabıları nelerdir?”
                </blockquote>
                <p>Sonuç: ürün önerileri ve açıklama metni.</p>
              </article>
              <article>
                <h3>Ajan: işlemi tamamlar</h3>
                <div className="opening-flow">
                  Kullanıcı hedef verir → Ajan adım seçer → Site işlemi uygular
                </div>
                <blockquote>
                  “Siyah koşu ayakkabısı bul ve filtrele.”
                </blockquote>
                <p>Sonuç: ekranda filtrelenmiş ürünler.</p>
              </article>
            </div>
            <p className="fine">
              Aynı asistan hem yanıt üretebilir hem işlem yapabilir.
            </p>
          </>
        );
      case 'definition':
        return (
          <>
            <div className="two api-approaches">
              <article>
                <h3>Declarative · Yalnız HTML formu</h3>
                <p>
                  Yalnızca HTML formları için kullanılır. Araç tanımı form
                  özelliklerinden, girdiler form alanlarından oluşur.
                </p>
                <pre>{`<form action="/support" method="post"
  toolname="create_support_request"
  tooldescription="Destek talebi gönder">
  <textarea name="message" required></textarea>
  <button type="submit">Talebi gönder</button>
</form>`}</pre>
                <small>
                  Örnek: destek talebi formunu doldurma ve gönderme.
                </small>
              </article>
              <article>
                <h3>Imperative · JavaScript ile</h3>
                <p>Şema ve çalıştırılacak fonksiyon kodda tanımlanır.</p>
                <pre>{`document.modelContext.registerTool({
  name: 'search_products',
  description: 'Ürünleri ara',
  inputSchema: searchSchema,
  execute: input => search(input),
});`}</pre>
                <small>
                  Özel işlemler ve dinamik state için. Bu demoda React useWebMCP
                  kullanılıyor.
                </small>
              </article>
            </div>
            <p className="callout">
              Microsoft ve Google katkıcılarının başlattığı öneri; W3C Web
              Machine Learning Community Group içinde geliştiriliyor.
            </p>
            <p className="fine">Henüz bir W3C standardı değil.</p>
          </>
        );
      case 'mcp':
        return (
          <>
            <div className="two">
              <article>
                <span className="pill">MCP</span>
                <h3>MCP örneği: Jira</h3>
                <p>
                  Bir AI uygulaması yerel veya uzak bir sunucunun araçlarına
                  bağlanır.
                </p>
                <div className="inline-flow">
                  AI uygulaması → MCP sunucusu → Servis
                </div>
                <small>
                  “Bu hafta bana atanan Jira görevlerini bul.” → Atlassian Rovo
                  MCP → görev listesi. Jira sekmesinin açık olması gerekmez.
                </small>
              </article>
              <article>
                <span className="pill orange">WebMCP</span>
                <h3>WebMCP örneği: alışveriş</h3>
                <p>Ajan, ziyaret ettiği sayfanın sunduğu işlemleri keşfeder.</p>
                <div className="inline-flow">
                  Ajan → Açık web sayfası → Uygulama
                </div>
                <small>
                  “Bu sayfada 42 numara siyah ayakkabıları filtrele.” →
                  search_products → aynı sekmede güncellenen ürünler.
                </small>
              </article>
            </div>
            <p className="fine">
              MCP ve WebMCP birbirinin yerine geçmez; birlikte kullanılabilir.
            </p>
          </>
        );
      case 'journey':
        return (
          <>
            <div className="two journey-paths">
              <article>
                <h3>Arayüz üzerinden</h3>
                <p>
                  Arama alanını bul → sorguyu yaz → renk, beden ve fiyatı seç →
                  sıralamayı değiştir.
                </p>
                <small>
                  Ajan DOM, erişilebilirlik ağacı veya ekran görüntüsünden
                  yararlanabilir.
                </small>
              </article>
              <article>
                <h3>WebMCP üzerinden</h3>
                <pre>{`search_products({
  q: 'koşu', color: 'siyah',
  size: '42', maxPrice: 2000,
  sort: 'price_asc'
})`}</pre>
                <small>
                  İşlem keşfedilir ve yapılandırılmış parametrelerle çağrılır.
                </small>
              </article>
            </div>
            <p className="callout">
              Beklenen sonuç: aynı filtreler, aynı sıralama, aynı iki ürün.
            </p>
          </>
        );
      case 'browser-api':
        return (
          <div className="technical-grid">
            <div>
              <pre>{`// DevTools konsolunda
const context = window.document.modelContext;
Boolean(context); // API var mı?

// Bu sürüm keşif metodunu destekliyor mu?
if (typeof context?.getTools === 'function') {
  const tools = await context.getTools();
  console.table(tools);
}`}</pre>
              <p className="technical-caption">
                API desteği tarayıcı sürümüne bağlıdır.
              </p>
            </div>
            <div className="technical-explain">
              <h3>Temel işlemler</h3>
              <p>
                <code>registerTool(tool, options)</code>
                <br />
                Sayfanın işlemini kaydeder.
              </p>
              <p>
                <code>getTools()</code>
                <br />
                Erişime izin verilen araçları listeler.
              </p>
              <p>
                <code>executeTool(tool, input)</code>
                <br />
                Keşfedilen aracı çağırır.
              </p>
              <p>
                <code>controller.abort()</code>
                <br />
                Kayıtta verilen AbortSignal ile aracı kaldırır.
              </p>
            </div>
          </div>
        );
      case 'setup':
        return (
          <>
            <ol className="setup-steps">
              <li>
                <strong>Flag’i aç</strong>
                <code>chrome://flags/#enable-webmcp-testing</code>
              </li>
              <li>
                <strong>Enabled seç → Relaunch</strong>
                <span>Chrome’u yeniden başlat.</span>
              </li>
              <li>
                <strong>Demo sekmesini aç</strong>
                <code>http://127.0.0.1:5173/demo</code>
              </li>
            </ol>
            <pre className="setup-check">{`// Demo sayfasının DevTools konsolunda
Boolean(document.modelContext) // true beklenir`}</pre>
            <p className="fine">
              Araçları Inspector ile inceleyebilirsin. Doğal dille kullanım için
              WebMCP destekli ajan gerekir.
            </p>
          </>
        );
      case 'evaluation':
        return (
          <>
            <div className="three tool-criteria">
              <article>
                <h3>Net bir işlem</h3>
                <p>
                  Ürün ara, detay aç, sepete ekle: tek amacı olan ve ajanların
                  kullandığı bir görev.
                </p>
              </article>
              <article>
                <h3>Açık bir sözleşme</h3>
                <p>
                  Girdi, sonuç, hata ve yan etkiler anlaşılır biçimde
                  tanımlanabiliyor.
                </p>
              </article>
              <article>
                <h3>Ortak uygulama mantığı</h3>
                <p>
                  Araç, mevcut metodu ve kullanıcı yetkilerini kullanıyor;
                  ekrandaki durumu güncelliyor.
                </p>
              </article>
            </div>
            <p className="callout">
              Her butona bir tool yerine, anlamlı kullanıcı işlemlerini aç:
              “menüye tıkla” yerine “ürünleri filtrele”.
            </p>
          </>
        );
      case 'demo':
        return (
          <>
            <div className="demo-prompt">{prompt}</div>
            <div className="demo-actions">
              <a
                href="/demo"
                target="_blank"
                rel="noreferrer"
                className="demo-link"
              >
                Canlı demoyu aç ↗
              </a>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(prompt);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {copied ? 'Prompt kopyalandı ✓' : 'Prompt’u kopyala'}
              </button>
            </div>
            <div className="demo-sequence">
              <span>search_products</span>
              <i>→</i>
              <span>show_product_details</span>
              <i>→</i>
              <span>add_to_cart</span>
              <i>→</i>
              <span>show_cart</span>
            </div>
          </>
        );
      case 'sources':
        return (
          <>
            <div className="source-list">
              <a
                href="https://developer.chrome.com/docs/ai/webmcp"
                target="_blank"
                rel="noreferrer"
              >
                <span>01</span>WebMCP · Resmi rehber ve kurulum ↗
              </a>
              <a
                href="https://developer.chrome.com/docs/ai/webmcp/imperative-api"
                target="_blank"
                rel="noreferrer"
              >
                <span>02</span>JavaScript API · Kayıt ve araç çağrıları ↗
              </a>
              <a
                href="https://github.com/GoogleChromeLabs/use-webmcp-tool"
                target="_blank"
                rel="noreferrer"
              >
                <span>03</span>React · useWebMCP hook’u ↗
              </a>
            </div>
          </>
        );
      default:
        return null;
    }
  }
  return (
    <div className="presentation">
      <div className="deck-top">
        <a className="deck-brand" href="/presentation">
          WebMCP
        </a>
        <div className="deck-controls">
          <button onClick={() => setMenu(!menu)} aria-expanded={menu}>
            İçindekiler
          </button>
          <button onClick={() => void fullscreen().catch(() => {})}>
            Tam ekran
          </button>
          <a href="/demo" target="_blank" rel="noreferrer">
            Demo ↗
          </a>
        </div>
      </div>
      {menu && (
        <nav className="deck-menu" aria-label="Sunum içindekiler">
          {slides.map((s, i) => (
            <button
              key={s.title}
              className={i === index ? 'current' : ''}
              onClick={() => {
                go(i);
                setMenu(false);
              }}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </button>
          ))}
        </nav>
      )}
      <main className={'slide slide-' + slide.kind} key={index}>
        <div className="slide-section">{slide.section}</div>
        <h1>{slide.title}</h1>
        <p className="slide-lead">{slide.lead}</p>
        <div className="slide-body">{content()}</div>
      </main>
      <div className="deck-bottom">
        <span className="keyboard-hint">← → Gezin</span>
        <div
          className="deck-progress"
          aria-label={`Slayt ${index + 1} / ${slides.length}`}
        >
          <span style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
        </div>
        <div className="deck-nav">
          <button
            aria-label="Önceki slayt"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            ←
          </button>
          <span>
            {String(index + 1).padStart(2, '0')} <i>/ {slides.length}</i>
          </span>
          <button
            aria-label="Sonraki slayt"
            disabled={index === slides.length - 1}
            onClick={() => go(index + 1)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
