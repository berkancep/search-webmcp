# Chrome üzerinden araç keşfi ve prompt ile kullanım

Site yalnız ürün arama arayüzü gösterir. WebMCP araçları görünür panel olmadan React yaşam döngüsünde kaydedilir. Sitede sohbet kutusu, model çağrısı veya API anahtarı bulunmaz.

## 1. Siteyi çalıştır

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Terminal açık kalsın. Chrome'da http://127.0.0.1:5173/demo adresini aç.

## 2. WebMCP desteğini aç

Güncel Chrome kullan. Inspector mağaza sayfası Chrome 150.0.7861.0+ istiyor.

Adres çubuğuna `chrome://flags/#enable-webmcp-testing` yaz. Enabled seç ve Chrome'u yeniden başlat. Sonra siteye dön.

## 3. Araçlara Chrome eklentisinden eriş

Chrome'un resmi dokümanında bağlantısı verilen Model Context Tool Inspector:

https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd

Eklentiyi yükle, site sekmesindeyken aç ve sayfanın araçlarını incele:

- search_products
- get_search_state
- get_available_filters
- set_sort_order
- clear_filters

Manuel arama çağrısı için JSON:

```json
{
  "q": "koşu",
  "color": "siyah",
  "size": "42",
  "maxPrice": 2000,
  "sort": "price_asc"
}
```

Beklenen: 999 TL ve 1499 TL fiyatlı iki ürün, seçili filtreler ve güncellenmiş URL.

## 4. Prompt ile işlem yaptır

Inspector'ın Gemini/ajan özelliği için kendi Gemini API anahtarını eklentinin arayüzünden gir. Anahtarı site koduna veya bu sohbete ekleme. Bu bağlantı kullanıcı tarafından kurulmalı; bu projede anahtar yapılandırılmadı ve Chrome eklentisi kurulumu otomatik yapılmadı.

Eklentinin ajan arayüzünde sırayla şu prompt'ları dene:

1. “Bu sayfanın WebMCP araçlarını kullan. Siyah koşu ayakkabılarını ara. 42 numarası stokta olsun, fiyatı en fazla 2000 TL olsun. En ucuzdan sırala.”
2. “Sadece fiyat sınırını kaldır. Siyah renk, 42 numara ve sıralama aynı kalsın.”
3. “Aktif arama durumunu ve kullanılabilir filtre seçeneklerini oku.”
4. “Bütün filtreleri temizle, arama sorgusunu koru.”

İkinci prompt sonrasında 2499 TL'lik üçüncü ürünün eklenmesini bekle. Ajanın araç çağrılarını eklentide, kullanıcıya etkisini sayfada göster.

WebMCP desteğini açmak tek başına Chrome'a sohbet ajanı eklemez. Inspector'ın prompt özelliği veya WebMCP tüketebilen başka bir ajan gerekir. Bu eklenti Gemini in Chrome'dan ayrıdır.

## Sorun giderme

- Araçlar görünmüyor: Chrome sürümü ve flag'i kontrol et, tarayıcıyı yeniden başlat ve siteyi yenile. Bu proje document.modelContext API'sini kullanır.
- Araçlar var ama prompt çalışmıyor: eklentinin model/API anahtarı ve sağlayıcı yanıtını kontrol et; bu bölüm siteden bağımsızdır.
- Beklenmedik filtreler: mevcut URL arama durumunu saklar; temiz başlangıç için http://127.0.0.1:5173/demo aç.
- Bağımlılıklar eksikse proje kökünde `pnpm install --frozen-lockfile` çalıştır.

Kaynaklar (29 Ekim 2026):
https://developer.chrome.com/docs/ai/webmcp
https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd

## Ürün detayı ve sepet araçları

Yeni araçlarla toplam 10 WebMCP aracı vardır:

- `get_product_details({productId})`: Ürün verisi ve stokta bedenleri okur.
- `show_product_details({productId})`: Ürün detayını ekranda açar.
- `add_to_cart({productId,size,quantity})`: Seçilen bedenden sepete ekler; quantity atlanırsa 1.
- `get_cart({})`: Sepet kalemlerini, adetleri ve toplamı okur.
- `show_cart({})`: Sepeti ekranda açar.

Örnek uçtan uca prompt:

> Bu sayfanın WebMCP araçlarını kullan. 2000 TL altında siyah koşu ayakkabısı ara; 42 numarası stokta olsun. En ucuzdan sırala. En ucuz ürünün detayını göster, 42 numarasından bir adet sepete ekle ve sepeti aç.

Beklenen: SKU-106, 42 numara, 1 adet, toplam 999 TL.

Demo sepeti yalnız açık sekmenin belleğinde tutulur. Sayfayı yenilemek sıfırlar. Ayrı sekmeler ve tarayıcılar aynı sepeti paylaşmaz. Ürün/beden başına en fazla 5 adet eklenebilir; stok simüledir, backend rezervasyonu yapılmaz. Ödeme işlemi yoktur.

## Sunum ve demo adresleri

- `/presentation`: 11 slaytlık sunum.
- `/demo`: alışveriş sayfası ve 10 WebMCP aracı.
- Sunumda sağ/sol ok ile gezin. Tam ekran düğmesi ve içerik menüsü vardır. Canlı demo ayrı sekmede açılır.
