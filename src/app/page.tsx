'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChristmasTree } from '@/components/tree/ChristmasTree';
import { OrnamentIcon, ORNAMENT_METADATA } from '@/components/tree/Ornaments';
import {
  Sparkles,
  TreePine,
  ArrowRight,
  ShieldCheck,
  Gift,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const DEMO_ORNAMENTS = [
  { id: '1', tree_id: 'demo', ornament_type: 'gold_ball', position_x: 42, position_y: 28, created_at: '' },
  { id: '2', tree_id: 'demo', ornament_type: 'red_ball', position_x: 58, position_y: 36, created_at: '' },
  { id: '3', tree_id: 'demo', ornament_type: 'snowflake', position_x: 35, position_y: 48, created_at: '' },
  { id: '4', tree_id: 'demo', ornament_type: 'bell', position_x: 65, position_y: 52, created_at: '' },
  { id: '5', tree_id: 'demo', ornament_type: 'heart', position_x: 50, position_y: 62, created_at: '' },
  { id: '6', tree_id: 'demo', ornament_type: 'silver_ball', position_x: 28, position_y: 68, created_at: '' },
  { id: '7', tree_id: 'demo', ornament_type: 'gift_box', position_x: 72, position_y: 72, created_at: '' },
];

export default function HomePage() {
  const [selectedTheme, setSelectedTheme] = useState<'classic' | 'snowy' | 'golden' | 'midnight'>('golden');
  const [activeOrnamentNote, setActiveOrnamentNote] = useState<string | null>(
    'Bu ağaç sana özel. Arkadaşların dallara kendi sevgilerini bırakacak!'
  );

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <section className="relative px-4 pt-12 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-forest/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-gold/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-gold/30 text-gold text-xs font-semibold tracking-wide uppercase shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Yeni Yıl Geleneğinizi Dijitale Taşıyın
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-snow tracking-tight leading-[1.15]">
              Kendi Dijital <br />
              <span className="gold-gradient-text">Yılbaşı Ağacını</span> Yarat
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Özel bağlantını sevdiklerinle paylaş. Sana özel süsler ve gizli dilekler bıraksınlar.
              Tüm mesajlar 25 Aralık&apos;ta sürpriz bir şekilde açılsın!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/kayit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-base transition-all duration-200 shadow-lg shadow-gold/15 hover:shadow-gold/30 flex items-center justify-center gap-2 group"
              >
                <span>Ağacını Hemen Oluştur</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/giris"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-surface hover:bg-surface/80 border border-forest text-snow font-medium text-base transition-colors flex items-center justify-center gap-2"
              >
                Giriş Yap
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                <span>Tamamen Ücretsiz</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                <span>Mobil Uyumlu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                <span>Uçtan Uca Gizlilik</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center z-10">
            <div className="w-full max-w-sm rounded-3xl glass-panel-gold p-6 relative overflow-hidden flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-forest/50 mb-3 text-xs">
                <span className="font-serif font-bold text-snow flex items-center gap-1.5">
                  <TreePine className="h-3.5 w-3.5 text-gold" />
                  Önizleme: @seninagacin
                </span>
                <span className="text-gold bg-forest/50 px-2 py-0.5 rounded border border-gold/20">
                  {selectedTheme === 'classic' && 'Klasik Çam'}
                  {selectedTheme === 'snowy' && 'Karlı Orman'}
                  {selectedTheme === 'golden' && 'Altın Işıltı'}
                  {selectedTheme === 'midnight' && 'Gece Safiri'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 w-full mb-4">
                {(['classic', 'snowy', 'golden', 'midnight'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTheme(t)}
                    className={`py-1 text-[11px] font-medium rounded-lg capitalize transition-all ${
                      selectedTheme === t
                        ? 'bg-gold text-background font-bold shadow'
                        : 'bg-forest/30 text-muted hover:text-snow border border-forest/60'
                    }`}
                  >
                    {t === 'classic' ? 'Klasik' : t === 'snowy' ? 'Karlı' : t === 'golden' ? 'Altın' : 'Gece'}
                  </button>
                ))}
              </div>

              <ChristmasTree
                theme={selectedTheme}
                ornaments={DEMO_ORNAMENTS}
                interactive={true}
                onOrnamentClick={(ornament) => {
                  const meta = ORNAMENT_METADATA[ornament.ornament_type];
                  setActiveOrnamentNote(
                    `${meta?.label || 'Süs'}: "${meta?.description || 'Yeni yıl dileği'}"`
                  );
                }}
              />

              <div className="mt-4 w-full bg-forest/40 border border-gold/20 rounded-xl p-3 text-center">
                <p className="text-xs text-snow/90 italic">{activeOrnamentNote}</p>
                <span className="text-[10px] text-muted block mt-1">
                  (Süslere tıklayarak keşfedebilirsiniz)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="nasil-calisir" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/50 border-y border-forest/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">
              Kolay ve Büyüleyici
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-snow">
              Nasıl Çalışır?
            </h2>
            <p className="text-muted text-sm sm:text-base">
              Yalnızca 1 dakikada kendi ağacını kur, sevdiklerinden gelen sıcak sürprizlerle süsle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center relative group hover:border-gold/40 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-forest border border-gold/30 flex items-center justify-center text-gold mb-5 shadow-lg group-hover:scale-105 transition-transform">
                <TreePine className="h-7 w-7" />
              </div>
              <span className="text-xs font-bold text-gold tracking-widest uppercase mb-1">1. Adım</span>
              <h3 className="text-xl font-serif font-bold text-snow mb-2">Ağacını Yarat</h3>
              <p className="text-sm text-muted leading-relaxed">
                Kullanıcı adını seç, beğendiğin ağaç temasını belirle ve saniyeler içinde kişisel ağacını hazırla.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center relative group hover:border-gold/40 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-forest border border-gold/30 flex items-center justify-center text-gold mb-5 shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles className="h-7 w-7" />
              </div>
              <span className="text-xs font-bold text-gold tracking-widest uppercase mb-1">2. Adım</span>
              <h3 className="text-xl font-serif font-bold text-snow mb-2">Bağlantını Paylaş</h3>
              <p className="text-sm text-muted leading-relaxed">
                Ağaç linkini Instagram, WhatsApp, Twitter veya arkadaş grubunda paylaş. Ziyaretçiler ağacına süs assın.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center relative group hover:border-gold/40 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-forest border border-gold/30 flex items-center justify-center text-gold mb-5 shadow-lg group-hover:scale-105 transition-transform">
                <Lock className="h-7 w-7" />
              </div>
              <span className="text-xs font-bold text-gold tracking-widest uppercase mb-1">3. Adım</span>
              <h3 className="text-xl font-serif font-bold text-snow mb-2">Kilit Açılışını Bekle</h3>
              <p className="text-sm text-muted leading-relaxed">
                Gelen mesajların gizemi 25 Aralık&apos;a kadar saklanır. Yılbaşı sabahı bütün iyi dilekleri tek tek oku!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">
            Kişiselleştirilmiş Süslemeler
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-snow">
            8 Özel Tasarım Süs
          </h2>
          <p className="text-muted text-sm sm:text-base">
            Her süs, farklı bir duygu ve yeni yıl dileğini temsil eder.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(ORNAMENT_METADATA).map(([key, item]) => (
            <div
              key={key}
              className="glass-panel rounded-xl p-4 flex flex-col items-center text-center space-y-2 hover:border-gold/30 transition-all"
            >
              <div className="h-12 w-12 flex items-center justify-center">
                <OrnamentIcon type={key} size={36} />
              </div>
              <h4 className="text-sm font-semibold text-snow">{item.label}</h4>
              <p className="text-xs text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/30 border-t border-forest/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-forest/20 border border-forest/50 space-y-3">
            <Lock className="h-6 w-6 text-gold" />
            <h3 className="text-lg font-serif font-bold text-snow">Sürpriz Mesaj Kilidi</h3>
            <p className="text-xs text-muted leading-relaxed">
              Kimse mesajını erkenden okuyamaz. Gerçek yılbaşı heyecanı sunucu taraflı güvenlikle korunur.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-forest/20 border border-forest/50 space-y-3">
            <ShieldCheck className="h-6 w-6 text-gold" />
            <h3 className="text-lg font-serif font-bold text-snow">Gizlilik ve Anonimlik</h3>
            <p className="text-xs text-muted leading-relaxed">
              Ziyaretçiler dilerse anonim mesaj bırakabilir. Özel mesajları sadece ağaç sahibi okuyabilir.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-forest/20 border border-forest/50 space-y-3">
            <Gift className="h-6 w-6 text-gold" />
            <h3 className="text-lg font-serif font-bold text-snow">Sıfır Yükleme, Sonsuz Hız</h3>
            <p className="text-xs text-muted leading-relaxed">
              Ağaç ve süsler tamamen SVG/CSS ile render edilir. Ağır fotoğraflar yüklenmez, sayfa anında açılır.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center w-full">
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-14 relative overflow-hidden space-y-6">
          <div className="h-16 w-16 mx-auto rounded-full bg-forest border border-gold/40 flex items-center justify-center text-gold">
            <TreePine className="h-8 w-8" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-snow">
            Bu Yılbaşı Ağacın Boş Kalmasın
          </h2>

          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto">
            Hemen ücretsiz kaydol, kendine özgü ağacını tasarla ve arkadaşlarına gönder.
          </p>

          <div className="pt-2">
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-base transition-all duration-200 shadow-xl shadow-gold/20"
            >
              <span>Ağacını Oluştur</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
