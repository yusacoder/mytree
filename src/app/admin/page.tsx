import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/giris');
  }

  const adminSupabase = createAdminClient();

  const { data: rawProfile } = await adminSupabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  const profile = rawProfile as { is_admin?: boolean } | null;

  if (!profile || !profile.is_admin) {
    redirect('/hesabim');
  }

  const { count: totalUsers } = await adminSupabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalTrees } = await adminSupabase
    .from('trees')
    .select('*', { count: 'exact', head: true });

  const { count: totalMessages } = await adminSupabase
    .from('messages')
    .select('*', { count: 'exact', head: true });

  const today = new Date().toISOString().split('T')[0];
  const { data: rawVisits } = await adminSupabase
    .from('tree_visits')
    .select('visit_count')
    .eq('visit_date', today);

  const dailyVisits = ((rawVisits || []) as any[]).reduce(
    (acc, curr) => acc + (curr.visit_count || 0),
    0
  );

  const { data: rawUsers } = await adminSupabase
    .from('profiles')
    .select('id, username, display_name, is_admin, is_suspended, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const userIds = ((rawUsers || []) as any[]).map((profile) => profile.id);
  const { data: rawUserTrees } = userIds.length
    ? await adminSupabase.from('trees').select('user_id, settings').in('user_id', userIds)
    : { data: [] };

  const treeByUser = new Map(
    ((rawUserTrees || []) as any[]).map((tree) => [tree.user_id, tree])
  );
  const users = ((rawUsers || []) as any[]).map((profile) => {
    const tree = treeByUser.get(profile.id);
    const signature = tree?.settings?.admin_signature;
    return {
      ...profile,
      admin_signature:
        signature && typeof signature.note === 'string'
          ? {
              note: signature.note,
              signed_at: typeof signature.signed_at === 'string' ? signature.signed_at : '',
            }
          : null,
    };
  });

  const { data: rawSettings } = await adminSupabase
    .from('app_settings')
    .select('setting_key, setting_value');

  const settingsMap: Record<string, string> = {};
  ((rawSettings || []) as any[]).forEach((s) => {
    settingsMap[s.setting_key] = s.setting_value;
  });

  const { data: rawReports } = await adminSupabase
    .from('reports')
    .select('id, tree_id, message_id, reason, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  const { data: rawLogs } = await adminSupabase
    .from('admin_logs')
    .select('id, action, details, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <AdminDashboardClient
      stats={{
        totalUsers: totalUsers || 0,
        totalTrees: totalTrees || 0,
        totalMessages: totalMessages || 0,
        dailyVisits: dailyVisits || 0,
      }}
      users={users}
      settings={settingsMap}
      reports={(rawReports || []) as any}
      logs={(rawLogs || []) as any}
    />
  );
}
