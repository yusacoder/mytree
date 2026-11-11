import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DashboardNav } from '@/components/tree/DashboardNav';
import { ChristmasTree } from '@/components/tree/ChristmasTree';
import Link from 'next/link';
import {
  TreePine,
  Eye,
  Sparkles,
  Mail,
  Share2,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/giris');
  }

  const adminSupabase = createAdminClient();

  const { data: rawProfile } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const profile = rawProfile as any;

  if (!profile) {
    redirect('/kayit');
  }

  const { data: rawTree } = await adminSupabase
    .from('trees')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const tree = rawTree as any;

  if (!tree) {
    redirect('/agac-olustur');
  }

  const { data: rawOrnaments } = await adminSupabase
    .from('ornaments')
    .select('*')
    .eq('tree_id', tree.id)
    .order('created_at', { ascending: true });

  const ornaments = (rawOrnaments || []) as any[];

  const { data: rawVisits } = await adminSupabase
    .from('tree_visits')
    .select('visit_count')
    .eq('tree_id', tree.id);

  const totalVisits = (rawVisits || []).reduce(
    (acc: number, curr: any) => acc + (curr.visit_count || 0),
    0
  );

  const { data: rawSetting } = await adminSupabase
    .from('app_settings')
    .select('setting_value')
    .eq('setting_key', 'message_unlock_date')
    .maybeSingle();

  const unlockDateStr =
    (rawSetting as any)?.setting_value || '2026-12-25T00:00:00.000Z';
  const unlockDate = new Date(unlockDateStr);
  const isUnlocked = new Date() >= unlockDate;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <DashboardNav username={profile.username} />

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-snow">
            Hoş geldin, {profile.display_name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Ağacının güncel durumunu incele ve gelen dilekleri takip et.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-forest/40 border border-gold/30 text-xs text-snow">
          <Calendar className="h-4 w-4 text-gold shrink-0" />
          <span>
            {isUnlocked ? (
              <strong className="text-gold">Tüm mesajlar açıldı!</strong>
            ) : (
              <>
                Kilit Açılış Tarihi:{' '}
                <strong className="text-gold">
                  {unlockDate.toLocaleDateString('tr-TR')}
                </strong>
              </>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-forest border border-gold/30 flex items-center justify-center text-gold shadow-md">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted block">Toplam Ziyaret</span>
            <span className="text-2xl font-serif font-bold text-snow">
              {totalVisits}
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-forest border border-gold/30 flex items-center justify-center text-gold shadow-md">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted block">Ağaçtaki Süsler</span>
            <span className="text-2xl font-serif font-bold text-snow">
              {ornaments.length}
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-forest border border-gold/30 flex items-center justify-center text-gold shadow-md">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-muted block">Gelen Mesajlar</span>
            <span className="text-2xl font-serif font-bold text-snow">
              {ornaments.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 glass-panel-gold rounded-3xl p-6 sm:p-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-4 border-b border-forest/60 mb-4">
            <span className="font-serif font-bold text-snow flex items-center gap-2">
              <TreePine className="h-4 w-4 text-gold" />
              {tree.tree_name}
            </span>
            <Link
              href="/hesabim/ayarlar"
              className="text-xs text-gold hover:underline"
            >
              Düzenle
            </Link>
          </div>

          <div className="w-full flex items-center justify-center py-2">
            <ChristmasTree
              theme={tree.theme}
              ornaments={ornaments}
              interactive={false}
              className="w-full max-h-[460px]"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-snow flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                Gelen Mesajlar
              </h3>
              <span className="text-xs text-muted">{ornaments.length} adet</span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {isUnlocked
                ? 'Sürpriz kilit kalktı! Sevdiklerinin sana bıraktığı tüm mesajları şimdi okuyabilirsin.'
                : `Mesajların içeriği yılbaşı heyecanını korumak için ${unlockDate.toLocaleDateString(
                    'tr-TR'
                  )} tarihine kadar saklanmaktadır.`}
            </p>

            <Link
              href="/hesabim/mesajlar"
              className="w-full py-3 rounded-xl bg-forest hover:bg-forest-light border border-gold/30 text-snow font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Mesajlar Kutusuna Git</span>
              <ArrowRight className="h-4 w-4 text-gold" />
            </Link>
          </div>

          <div className="glass-panel-gold rounded-3xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-snow flex items-center gap-2">
              <Share2 className="h-4 w-4 text-gold" />
              Ağacını Arkadaşlarınla Paylaş
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Aşağıdaki bağlantıyı sosyal medya profiline veya mesajlaşma gruplarına gönder:
            </p>

            <div className="p-3 rounded-xl bg-forest-dark border border-forest break-all text-xs text-gold font-mono">
              https://mytree.eternalproduction.net/tree/{profile.username}
            </div>

            <Link
              href={`/tree/${profile.username}`}
              target="_blank"
              className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Ağacımı Ziyaretçi Gözüyle Gör</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
