# WebMCP · Sunum akışı

11 slayt. `/presentation` üzerinden açılır; demo `/demo` üzerindedir.

## 1 · Bir istekten uygulamadaki işleme

Bir kullanıcıya yanıt vermek ile onun adına uygulamada işlem yapmak arasındaki fark.

Konuşmacı notu: Chatbot örneği: “En çok satılan siyah koşu ayakkabıları nelerdir?” → ürün önerileri ve açıklama. Ajan örneği: “Siyah koşu ayakkabısı bul ve filtrele.” → uygulamada güncellenen sonuçlar. Bu bir davranış karşılaştırmasıdır; aynı asistan hem yanıt üretebilir hem araç kullanabilir. Satış sıralaması bu demoda uygulanmıyor; örnek soru en çok satan ürünlerin verisini ölçtüğümüz anlamına gelmez.

## 2 · WebMCP nedir?

Web sayfasının mevcut işlemlerini, ajanların keşfedip çağırabileceği yapılandırılmış araçlara açan deneysel tarayıcı API’si.

Konuşmacı notu: WebMCP’nin genişletilmiş adı Web Model Context Protocol. Sayfa araç üreticisidir; uyumlu tarayıcı ajanı tüketicidir. Araçlar normal arayüzün yanında bulunur. WebMCP kendi başına bir model veya sohbet ekranı sağlamaz. Kaynak: https://developer.chrome.com/docs/ai/webmcp ve https://github.com/webmachinelearning/webmcp. Microsoft ve Google katkıcılarının başlattığı öneri, W3C Web Machine Learning Community Group içinde geliştiriliyor. İlk yayın 13 Ağustos 2025. W3C standardı değildir. Kaynaklar: https://github.com/webmachinelearning/webmcp#acknowledgments ve https://webmachinelearning.github.io/webmcp/. İki API aynı amaca hizmet eder: Declarative yaklaşım yalnız HTML formları içindir. Destek talebi örneğinde HTML formundaki toolname ve tooldescription araç tanımını, name/required gibi alan özellikleri girdiyi oluşturur. Örnek standart form gönderimini kullanır; otomatik gönderim istenirse toolautosubmit ayrıca tanımlanır. Imperative yaklaşımda registerTool ile şema ve execute kodda verilir; örnekte searchSchema ve search önceden tanımlanmış varsayılır. Bu demo imperative yaklaşımı useWebMCP ile kullanır. Kaynak: https://developer.chrome.com/docs/ai/webmcp/declarative-api ve https://developer.chrome.com/docs/ai/webmcp/imperative-api.

## 3 · MCP ile WebMCP arasındaki fark

İkisi de araç kullanımını kolaylaştırır; araca eriştikleri yer farklıdır.

Konuşmacı notu: MCP, yerel veya uzak sunucuya bağlanabilir; açık web sayfasından bağımsız işleyebilir. WebMCP açık sayfanın işlevlerine odaklanır. Node.js API’miz normal HTTP search API; bu demo bir backend MCP server kurmuyor. Bunları aynı protokolün iki transport seçeneği gibi anlatmayın. Kaynak: https://developer.chrome.com/docs/ai/webmcp/compare-mcp. Somut MCP örneği: Atlassian Rovo MCP ile Jira görevlerini aramak, Jira sekmesi açmayı gerektirmez; kullanıcının izinleriyle çalışır. Kaynak: https://support.atlassian.com/atlassian-ai-gateway/docs/use-rovo-search-and-fetch-in-the-atlassian-remote-mcp-server/. WebMCP örneği bu projenin demo sekmesinde ürün filtreleyip görünür sonucu güncellemektir; Jira’nın WebMCP sunduğu iddia edilmez.

## 4 · Aynı arama, iki etkileşim yolu

“2.000 TL altında, 42 numarası olan siyah koşu ayakkabılarını en ucuzdan sırala.”

Konuşmacı notu: Cümleyi beş parçaya ayırın: sorgu, renk, beden, fiyat ve sıralama. Bilgisi eksik bir istekte ajan tahmin etmek yerine kullanıcıya sorabilir. Demo kataloğu sentetik; gerçek Trendyol verisi kullanmıyoruz. DOM, sayfanın öğe ağacıdır. Ajan erişilebilirlik ağacından, DOM’dan veya ekran görüntüsünden yararlanabilir. Bu yöntem genel amaçlıdır ve çalışır; ancak değişen menüler, etiketler ve yüklenme durumlarıyla baş etmesi gerekir. Buradaki adımlar açıklama amaçlıdır; ölçülmüş performans verisi değildir. WebMCP ekranı kaldırmaz; insan ve ajan aynı durumu paylaşır. Soldaki yol bazen çok kısa olabilir. Sağdaki yol araç keşfi, model kararı ve kontroller gibi ek işler de içerir. Ekranda iki yolu aynı anda gösterin. Arayüz yolunda öğeler bulunur ve kullanılır; WebMCP yolunda isimli işlem parametrelerle çağrılır. İkisi de aynı sonuçları hedefler.

## 5 · Tarayıcıdan WebMCP’ye erişim

Giriş noktası document.modelContext; window üzerinden tam yol window.document.modelContext.

Konuşmacı notu: Güncel Chrome imperative API rehberi ve 27 Ekim 2026 taslağı document.modelContext kullanır. registerTool kaydeder, getTools yetkili araçları keşfeder; kayıt AbortSignal ile kaldırılır. window.modelContext örneği verilmemelidir. Bazı eski sürümlerdeki provideContext, clearContext ve unregisterTool güncel API gibi anlatılmamalıdır. getTools tarayıcı sürümüne göre bulunmayabilir; optional chaining ile destek kontrolü gösterilir. Kaynak: https://developer.chrome.com/docs/ai/webmcp/imperative-api ve https://webmachinelearning.github.io/webmcp/. Bu slayttaki kod DevTools konsolu içindir; React bileşeninde kayıt hook ile yapılır.

## 6 · Chrome’da WebMCP’yi etkinleştirme

Yerel demo için tarayıcı desteğini aç, demo sekmesine dön ve araç kaydını kontrol et.

Konuşmacı notu: Resmi Chrome rehberindeki yerel geliştirme adımları: chrome://flags/#enable-webmcp-testing → Enabled → Relaunch. Ardından http://127.0.0.1:5173/demo açılır. document.modelContext varlığı konsolda kontrol edilir. API yoksa sürüm/flag kontrol edilir. Güncel getTools metodu mevcutsa listeleme yapılabilir; aksi halde Inspector ile araçlar incelenir. Flag tek başına sohbet ajanı sağlamaz. Origin trial dağıtım seçeneği yerel flag’den ayrıdır ve bu demo için gerekli değildir. Kaynak: https://developer.chrome.com/docs/ai/webmcp. Kullanıcının tarayıcı ayarını bu düzenleme sırasında değiştirmiyoruz.

## 7 · React’te bir işlemi WebMCP’ye açmak

useWebMCP araç tanımını kaydeder; ajan çağırdığında execute çalışır.

Konuşmacı notu: JSON Schema, girdinin biçimini tanımlar: sayı mı, metin mi, hangi değerler geçerli? Şema, gerçek doğrulamanın yerini tutmaz. execute, mevcut iş mantığına bağlanır. Uygulama kendi yetkilerini ve doğrulamasını korur. Kaynak: https://github.com/GoogleChromeLabs/use-webmcp-tool. Projede use-webmcp-tool 0.2.0 var; davranış node_modules/use-webmcp-tool/useWebMCP.js üzerinden kontrol edildi. Mount sırasında kayıt, unmount sırasında AbortController ile kaldırma yapılır. execute için güncel callback ref içinde tutulur; yalnız callback değişti diye tekrar kayıt yapılmaz. supported tarayıcı desteğini, registered kayıt durumunu, error kayıt hatasını bildirir. Hook model çağırmaz; execute ancak bir tüketici aracı çağırdığında çalışır. App.tsx her araç için ayrı ToolRegistration bileşeni render eder; hook koşullu bir döngünün içinde çağrılmaz. Örnek tools.ts içindeki search_products tanımının yalnız q alanına indirgenmiş sürümüdür; tam araç renk, beden, fiyat, sıralama ve sayfa da alır. inputSchema geçerli JSON Schema biçimindedir. required boş olduğu için q opsiyoneldir ve atlanınca korunur. additionalProperties false bilinmeyen alanları sözleşmede reddeder; validatePatch uygulamada yeniden doğrular. execute sonucu hook tarafından MCP içerik yanıtına dönüştürülür. Bu projede createTools hata sonucunu isError olarak sarar. readOnlyHint yalnız bir ipucudur, yetki denetimi değildir. Kaynak: https://github.com/GoogleChromeLabs/use-webmcp-tool ve src/tools.ts. Ekrandaki kod bir SearchTool bileşeni için sadeleştirilmiş eşdeğerdir; projede tanım createTools, kayıt ToolRegistration üzerinden ayrılır. patch prop olarak ortak uygulama metodudur; execute bağımsız bir arama uygulamaz.

## 8 · Örnek component: ürünleri getir ve göster

Buton ve ajan aynı getProducts metodunu çağırır; aynı ürün listesi güncellenir.

Konuşmacı notu: Örnek JavaScript/JSX biçimindedir. Products bir React fonksiyon component’idir. getProducts ortak işlemi yürütür: validatePatch girdiyi kontrol eder, patch aramayı yapar, hata sonucu varsa Error fırlatılır; başarılı sonuç döndürülür. useWebMCP aynı metodu execute olarak kaydeder. searchSchema, önceki slayttaki şema değişkenidir; import’lar ve butonun yükleme/hata görünümü kısalık için gösterilmez. JSX return parantez içindedir; section açılışı ve kapanışı aynı görünür bloktadır. Sonuç sayısı p etiketiyle doğrudan gösterilir; varsayımsal bir alt component yoktur. Gerçek projede tool adı search_products, kayıt ve tanım App.tsx/tools.ts dosyalarındadır.

## 9 · Ne zaman WebMCP tool tanımlamalıyız?

Net bir görevi, açık girdilerle ve mevcut uygulama mantığıyla ajana sunabiliyorsak.

Konuşmacı notu: Tool seçimi üç ölçüte dayanır: net bir işlem, açık girdi/sonuç/hata sözleşmesi ve mevcut uygulama metotlarıyla ortak çalışma. Her DOM butonu için bir tool gerekmez. Örtüşen araçlar yerine anlamlı kullanıcı işlemlerini tanımlayın. Statik bilgi sunan sayfada ek araç gerekmeyebilir. Yetkiler ve doğrulama korunmalı; ekrandaki durum işlem tamamlanınca güncellenmelidir. Kaynak: https://developer.chrome.com/docs/ai/webmcp/best-practices.

## 10 · Ara → incele → sepete ekle

Aynı alışveriş sayfasını önce arayüzle, sonra WebMCP araçlarıyla kullanalım.

Konuşmacı notu: Demo yeni sekmede açılır. Her karşılaştırmadan önce sayfayı yenileyerek boş sepetten başlayın; bu demoda sepet bellektedir. Aynı prompt’u iki kez kullanın; ikinci kez WebMCP kullanma diye belirtin. Bu sunum sayfası alışveriş araçlarını kaydetmez; ajan demo sekmesinde olmalı.

## 11 · Kaynaklar ve sorular

Uygulamamızdaki hangi işlemi bu ortak akışa bağlamak isterdik?

Konuşmacı notu: Belgeler ve tarayıcı desteği değişebilir. Sunumdan önce hedef Chrome sürümünü ve ajan entegrasyonunu tekrar kontrol edin. Kaynaklar 29 Ekim 2026’da incelendi. Demo dışında gerçek müşteri verisi veya üretim erişimi kullanılmadı.
