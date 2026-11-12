import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DashboardNav } from '@/components/tree/DashboardNav';
import { OrnamentIcon } from '@/components/tree/Ornaments';
import { ORNAMENT_METADATA } from '@/components/tree/ornament-metadata';
import { Mail, Lock, Sparkles, Clock } from 'lucide-react';

export default async function UserMessagesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/giris');
  }

  const adminSupabase = createAdminClient();

  const [{ data: rawProfile }, { data: initialTree }] = await Promise.all([
    adminSupabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle(),
    adminSupabase
      .from('trees')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  const profile = rawProfile as any;
  if (!profile) redirect('/giris');

  let rawTree = initialTree;

  if (!rawTree) {
    const { data: createdTree, error: createTreeError } = await (adminSupabase.from('trees') as any)
      .insert({
        user_id: user.id,
        tree_name: `${profile.username}'in Ağacı`,
        theme: 'classic',
        accept_messages: true,
        is_public: true,
        settings: {},
      })
      .select('id')
      .single();

    if (createTreeError || !createdTree) redirect('/agac-olustur');
    rawTree = createdTree;
  }

  const tree = rawTree as any;

  const [{ data: rawSetting }, { data: rawMessages }, { data: rawOrnaments }] =
    await Promise.all([
      adminSupabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'message_unlock_date')
        .maybeSingle(),
      adminSupabase
        .from('messages')
        .select('id, ornament_id, sender_name, message_content, is_anonymous, created_at')
        .eq('tree_id', tree.id)
        .order('created_at', { ascending: false }),
      adminSupabase
        .from('ornaments')
        .select('id, ornament_type')
        .eq('tree_id', tree.id),
    ]);

  const unlockDateStr =
    (rawSetting as any)?.setting_value || '2026-12-25T00:00:00.000Z';
  const unlockDate = new Date(unlockDateStr);
  const isUnlocked = new Date() >= unlockDate;
  const messages = (rawMessages || []) as any[];

  const ornamentMap = new Map<string, string>();
  ((rawOrnaments || []) as any[]).forEach((orn) => {
    ornamentMap.set(orn.id, orn.ornament_type);
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <DashboardNav username={profile.username} />

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-snow flex items-center gap-2">
              <Mail className="h-6 w-6 text-gold" />
              Gelen Mesaj Kutusu
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Ağacına asılan tüm süsler ve sevdiklerinin bıraktığı dilekler.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest/50 border border-gold/30 text-xs text-snow">
            <Sparkles className="h-4 w-4 text-gold" />
            <span>
              Toplam Mesaj: <strong>{messages.length}</strong>
            </span>
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            isUnlocked
              ? 'bg-forest/40 border-gold/40 text-gold-light'
              : 'bg-surface border-gold/30 text-snow/90'
          }`}
        >
          {isUnlocked ? (
            <Sparkles className="h-6 w-6 text-gold shrink-0" />
          ) : (
            <Lock className="h-6 w-6 text-gold shrink-0" />
          )}
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-snow">
              {isUnlocked
                ? 'Kilit Açıldı! Mesajlarınızı keyifle okuyabilirsiniz.'
                : `Sürpriz Kilit Aktif (${unlockDate.toLocaleDateString('tr-TR')})`}
            </p>
            <p className="text-muted">
              {isUnlocked
                ? 'Tüm gizli yeni yıl mesajları sunucu tarafından çözümlendi ve görüntülenmeye hazır.'
                : 'Yılbaşı coşkusunu korumak amacıyla mesaj içerikleri kilit açılış tarihine kadar gizli tutulmaktadır.'}
            </p>
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-forest border border-gold/30 flex items-center justify-center text-gold">
            <Mail className="h-7 w-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-snow">
            Henüz Mesaj Yok
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Ağaç bağlantını arkadaşlarınla paylaşarak ilk süs ve yeni yıl mesajını alabilirsin!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {messages.map((msg) => {
            const ornType = ornamentMap.get(msg.ornament_id) || 'gold_ball';
            const meta = ORNAMENT_METADATA[ornType];
            const date = new Date(msg.created_at).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg.id}
                className="glass-panel-gold rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-gold/50 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-forest rounded-xl border border-forest-light">
                      <OrnamentIcon type={ornType} size={28} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-snow">
                        {msg.is_anonymous ? 'Anonim Dost' : msg.sender_name}
                      </h4>
                      <span className="text-[10px] text-gold font-medium">
                        {meta?.label || 'Süs'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-muted flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" />
                    {date}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-forest-dark border border-forest/80 min-h-[90px] flex items-center justify-center">
                  {isUnlocked ? (
                    <p className="text-xs text-snow/90 leading-relaxed break-words w-full">
                      {msg.message_content}
                    </p>
                  ) : (
                    <div className="text-center space-y-1">
                      <Lock className="h-5 w-5 text-gold/80 mx-auto" />
                      <span className="text-[11px] font-semibold text-gold block">
                        Gizli Mesaj
                      </span>
                      <span className="text-[10px] text-muted block">
                        25 Aralık&apos;ta açılacak
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
