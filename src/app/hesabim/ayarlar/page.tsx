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

  const { data: rawProfile } = await adminSupabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

  const profile = rawProfile as any;
  if (!profile) redirect('/giris');

  const { data: rawTree } = await adminSupabase
    .from('trees')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const tree = rawTree as any;
  if (!tree) redirect('/agac-olustur');

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
