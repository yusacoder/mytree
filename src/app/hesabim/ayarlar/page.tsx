import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DashboardNav } from '@/components/tree/DashboardNav';
import { TreeSettingsClient } from '@/components/tree/TreeSettingsClient';

export default async function SettingsPage() {
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
      .select('*')
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
      .select('*')
      .single();

    if (createTreeError || !createdTree) redirect('/agac-olustur');
    rawTree = createdTree;
  }

  const tree = rawTree as any;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
      <DashboardNav username={profile.username} />
      <TreeSettingsClient
        initialTree={{
          tree_name: tree.tree_name,
          theme: tree.theme,
          accept_messages: tree.accept_messages,
          is_public: tree.is_public,
        }}
      />
    </div>
  );
}
