# 🎄 Eternal MyTree — Digital Christmas Tree & Message Platform

> **Live Domain:** [https://mytree.eternalproduction.net](https://mytree.eternalproduction.net)
> **Type:** Full Stack Web Application (Next.js 14 App Router, Supabase PostgreSQL & Auth, Tailwind CSS, TypeScript, Zod)

Eternal MyTree, kullanıcıların kendilerine ait özel tasarlanmış dijital yılbaşı ağaçları oluşturabildiği, bu ağaçları benzersiz bağlantılarla arkadaşlarıyla paylaşabildiği ve ziyaretçilerden kişiselleştirilmiş süslerle birlikte gizli yeni yıl mesajları toplayabildiği lüks, modern ve yüksek performanslı bir web platformudur.

---

## ✨ Özellikler

- **Lüks & Minimal Tasarım Dili:**
  - Özel renk paleti: Ana Arka Plan (`#080D0B`), İkincil (`#111A15`), Orman Yeşili (`#183C2B`), Altın (`#D6B66B`), Kar Beyazı (`#F5F3EC`), İkincil Metin (`#A4ADA5`).
  - Ultra hafif ve akıcı kar yağışı animasyonu.
  - Canlı ışık pırıltıları ve cam (glassmorphism) efektleri.
- **Sıfır Medya Yükü & Yüksek Performans:**
  - Tüm ağaç ve süsler doğrudan SVG ve CSS ile render edilir.
  - Harici resim/video yükleme gerektirmez, sayfa yükleme süreleri anlıktır.
  - Ziyaret istatistikleri günlük toplu sayaç ile optimize edilmiştir.
- **8 Özel Tasarım SVG Süs:**
  - Altın Küre, Gümüş Küre, Kırmızı Küre, Kuzey Yıldızı, Kar Tanesi, Yılbaşı Çanı, Hediye Kutusu ve Altın Kalp.
- **Sunucu Taraflı Sürpriz Mesaj Kilidi:**
  - Mesajlar varsayılan olarak **25 Aralık 2026** tarihine kadar kilitlidir.
  - Ağaç sahibi açılış tarihine kadar süsü ve gönderen ismini görebilir fakat mesaj içeriği sunucu seviyesinde kilitli kalır.
  - Yönetici panelinden açılış tarihi istendiğinde anlık olarak güncellenebilir.
- **Güvenlik & Gizlilik:**
  - Supabase Row Level Security (RLS) ile veritabanı düzeyinde erişim kısıtlaması.
  - Zod ile sıkı girdi doğrulama.
  - Süs bırakma işlemlerinde spam koruması için IP bazlı rate limiting.
  - Şikâyet (raporlama) ve spam mesaj silme mekanizması.
- **Kapsamlı Yönetici (Admin) Paneli:**
  - Toplam kullanıcı, ağaç, mesaj ve günlük ziyaret istatistikleri.
  - Kullanıcı arama ve hesap askıya alma / aktifleştirme.
  - Mesaj açılış tarihi yönetimi.
  - Kayıt sistemini açma/kapatma ve bakım modu anahtarları.
  - Detaylı yönetici işlem logları (audit logs).

---

## 📁 Sayfa Yapısı

- `/` — Landing Page (Hero, Ağaç Önizleme, Nasıl Çalışır?, Süs Vitrini, CTA)
- `/kayit` — Kullanıcı Kaydı (Benzersiz kullanıcı adı belirleme)
- `/giris` — Kullanıcı Girişi
- `/agac-olustur` — Ağaç Tasarım Ekranı (Başlık, 4 Tema Seçeneği, Mesaj İzni)
- `/tree/[username]` — Herkese Açık Kişisel Ağaç (Süs bırakma, paylaşım, ziyaret sayacı)
- `/hesabim` — Kullanıcı Dashboard'u (Özet metrikler, ağaç görünümü, paylaşım kartı)
- `/hesabim/mesajlar` — Gelen Mesajlar Kasası (Kilit durumuna göre içerik gösterimi)
- `/hesabim/ayarlar` — Ağaç ve Hesap Ayarları (Tema değiştirme, mesaj kabul anahtarı)
- `/admin` — Yönetici Kontrol Paneli
- `/admin/giris` — Yönetici Giriş Sayfası

---

## 🛠️ Kurulum ve Yerel Geliştirme

### 1. Depoyu Klonlayın ve Bağımlılıkları Yükleyin

```bash
git clone https://github.com/yusacoder/mytree.git
cd mytree
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

Kök dizinde bulunan `.env.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.example .env.local
```

`.env.local` dosyasını Supabase proje bilgilerinizle doldurun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://mytree.eternalproduction.net
NEXT_PUBLIC_DEFAULT_UNLOCK_DATE=2026-12-25T00:00:00.000Z
```

### 3. Supabase Veritabanı Şemasını Yükleyin

Supabase dashboard'unuzda **SQL Editor** sekmesini açın ve projedeki `supabase/schema.sql` dosyasının içeriğini yapıştırarak çalıştırın. Bu komut:
- `profiles`, `trees`, `ornaments`, `messages`, `tree_visits`, `app_settings`, `admin_logs`, `reports` tablolarını,
- İndeksleri,
- Row Level Security (RLS) politikalarını,
- Ziyaret artırma PL/pgSQL fonksiyonunu (`increment_tree_visit`),
- Varsayılan platform ayarlarını otomatik olarak kurar.

#### İlk Yöneticiyi Yetkilendirme
Kayıt olduktan sonra ilgili profilinizi yönetici yapmak için Supabase SQL Editor'de:
```sql
UPDATE public.profiles SET is_admin = true WHERE username = 'kullanici_adiniz';
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

---

## 🧪 Testleri Çalıştırma

Vitest ile yazılan şema ve kilit mantığı testlerini çalıştırmak için:

```bash
npx vitest run
```

---

## 🚀 Vercel Deployment

1. Projeyi GitHub deponuza gönderin.
2. [Vercel Dashboard](https://vercel.com) üzerinden projeyi içe aktarın (Import).
3. **Environment Variables** bölümüne `.env.example` dosyasındaki değişkenleri ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (`https://mytree.eternalproduction.net`)
4. **Deploy** butonuna tıklayın.

---

## 📄 Lisans
Bu proje Eternal Production bünyesinde geliştirilmiştir.
