import React from 'react';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { PublicTreeClient } from '@/components/tree/PublicTreeClient';
import { Metadata } from 'next';

interface TreePageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: TreePageProps): Promise<Metadata> {
  const supabase = createAdminClient();
  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('display_name, username')
    .eq('username', params.username)
    .maybeSingle();

  const profile = rawProfile as { display_name: string; username: string } | null;

  if (!profile) {
    return {
      title: 'Ağaç Bulunamadı — Eternal MyTree',
    };
  }

  return {
    title: `${profile.display_name} (@${profile.username}) — Yılbaşı Ağacı | Eternal MyTree`,
    description: `${profile.display_name} kullanıcısının dijital yılbaşı ağacını ziyaret et, süs ve yeni yıl dileği bırak!`,
    openGraph: {
      title: `${profile.display_name} (@${profile.username}) Yılbaşı Ağacı`,
      description: `Ağaca tıkla, süsünü as ve sürpriz yeni yıl mesajını bırak!`,
    },
  };
}

export default async function TreePage({ params }: TreePageProps) {
  const adminSupabase = createAdminClient();

  const { data: rawProfile } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .maybeSingle();

  const profile = rawProfile as any;

  if (!profile || profile.is_suspended) {
    notFound();
  }

  const { data: rawTree } = await adminSupabase
    .from('trees')
    .select('*')
    .eq('user_id', profile.id)
    .maybeSingle();

  const tree = rawTree as any;

  if (!tree || !tree.is_public) {
    notFound();
  }

  try {
    await (adminSupabase as any).rpc('increment_tree_visit', { p_tree_id: tree.id });
  } catch {
    const today = new Date().toISOString().split('T')[0];
    const { data: existingVisit } = await (adminSupabase.from('tree_visits') as any)
      .select('*')
      .eq('tree_id', tree.id)
      .eq('visit_date', today)
      .maybeSingle();

    if (existingVisit) {
      await (adminSupabase.from('tree_visits') as any)
        .update({ visit_count: existingVisit.visit_count + 1 })
        .eq('id', existingVisit.id);
    } else {
      await (adminSupabase.from('tree_visits') as any).insert([
        { tree_id: tree.id, visit_date: today, visit_count: 1 },
      ]);
    }
  }

  const { data: rawOrnaments } = await adminSupabase
    .from('ornaments')
    .select('*')
    .eq('tree_id', tree.id)
    .order('created_at', { ascending: true });

  const ornaments = (rawOrnaments || []) as any[];

  const { data: rawSetting } = await adminSupabase
    .from('app_settings')
    .select('setting_value')
    .eq('setting_key', 'message_unlock_date')
    .maybeSingle();

  const unlockDateStr =
    (rawSetting as any)?.setting_value || '2026-12-25T00:00:00.000Z';

  return (
    <PublicTreeClient
      tree={tree}
      profile={profile}
      initialOrnaments={ornaments}
      unlockDateStr={unlockDateStr}
    />
  );
}
