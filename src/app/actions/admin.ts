'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

async function checkAdminAuth() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Yetkisiz erişim. Lütfen giriş yapınız.');
  }

  const adminSupabase = createAdminClient();
  const { data: rawProfile } = await adminSupabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  const profile = rawProfile as { is_admin?: boolean } | null;
  if (!profile || !profile.is_admin) {
    throw new Error('Bu alana erişmek için yönetici yetkisi gereklidir.');
  }

  return { adminId: user.id };
}

export async function updateAppSettingAction(settingKey: string, settingValue: string) {
  try {
    const { adminId } = await checkAdminAuth();
    const adminSupabase = createAdminClient();

    const { error } = await (adminSupabase.from('app_settings') as any).upsert({
      setting_key: settingKey,
      setting_value: settingValue,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'setting_key' });

    if (error) {
      return { success: false, error: error.message };
    }

    await (adminSupabase.from('admin_logs') as any).insert([
      {
        admin_id: adminId,
        action: `update_setting_${settingKey}`,
        details: { value: settingValue },
      },
    ]);

    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'İşlem başarısız.';
    return { success: false, error: message };
  }
}

export async function toggleUserSuspensionAction(userId: string, isSuspended: boolean) {
  try {
    const { adminId } = await checkAdminAuth();
    const adminSupabase = createAdminClient();

    const { error } = await (adminSupabase.from('profiles') as any)
      .update({ is_suspended: isSuspended, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    await (adminSupabase.from('admin_logs') as any).insert([
      {
        admin_id: adminId,
        action: isSuspended ? 'suspend_user' : 'unsuspend_user',
        details: { target_user_id: userId },
      },
    ]);

    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'İşlem başarısız.';
    return { success: false, error: message };
  }
}

export async function deleteUserAccountAction(targetUserId: string) {
  try {
    const { adminId } = await checkAdminAuth();
    if (typeof targetUserId !== 'string' || !/^[0-9a-f-]{36}$/i.test(targetUserId)) {
      return { success: false, error: 'Kullanıcı bilgisi geçersiz.' };
    }
    if (targetUserId === adminId) {
      return { success: false, error: 'Kendi yönetici hesabınızı bu panelden silemezsiniz.' };
    }

    const adminSupabase = createAdminClient();
    const { data: rawTarget, error: targetError } = await adminSupabase
      .from('profiles')
      .select('id, username, is_admin')
      .eq('id', targetUserId)
      .maybeSingle();

    const target = rawTarget as { id: string; username: string; is_admin?: boolean } | null;
    if (targetError || !target) {
      return { success: false, error: 'Kullanıcı bulunamadı.' };
    }
    if (target.is_admin) {
      return { success: false, error: 'Yönetici hesapları bu ekrandan silinemez.' };
    }

    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(target.id);
    if (deleteError) {
      return { success: false, error: 'Kullanıcı silinemedi. Lütfen tekrar deneyin.' };
    }

    await (adminSupabase.from('admin_logs') as any).insert({
      admin_id: adminId,
      action: 'delete_user',
      details: { target_user_id: target.id, username: target.username },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Kullanıcı silinemedi.',
    };
  }
}

export async function updateReportStatusAction(reportId: string, status: 'resolved' | 'dismissed') {
  try {
    const { adminId } = await checkAdminAuth();
    const adminSupabase = createAdminClient();

    const { error } = await (adminSupabase.from('reports') as any)
      .update({ status })
      .eq('id', reportId);

    if (error) {
      return { success: false, error: error.message };
    }

    await (adminSupabase.from('admin_logs') as any).insert([
      {
        admin_id: adminId,
        action: `report_${status}`,
        details: { report_id: reportId },
      },
    ]);

    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'İşlem başarısız.';
    return { success: false, error: message };
  }
}

export async function deleteSpamMessageAction(messageId: string) {
  try {
    const { adminId } = await checkAdminAuth();
    const adminSupabase = createAdminClient();

    const { data: rawMsg } = await adminSupabase
      .from('messages')
      .select('ornament_id')
      .eq('id', messageId)
      .maybeSingle();

    const msg = rawMsg as { ornament_id?: string } | null;

    const { error } = await adminSupabase.from('messages').delete().eq('id', messageId);

    if (error) {
      return { success: false, error: error.message };
    }

    if (msg?.ornament_id) {
      await adminSupabase.from('ornaments').delete().eq('id', msg.ornament_id);
    }

    await (adminSupabase.from('admin_logs') as any).insert([
      {
        admin_id: adminId,
        action: 'delete_spam_message',
        details: { message_id: messageId },
      },
    ]);

    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'İşlem başarısız.';
    return { success: false, error: message };
  }
}

export async function updateAdminPasswordAction(newPassword: string) {
  try {
    const { adminId } = await checkAdminAuth();
    if (typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 128) {
      return { success: false, error: 'Yeni şifre en az 8 karakter olmalıdır.' };
    }

    const adminSupabase = createAdminClient();
    const { data: admins, error: adminsError } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('is_admin', true)
      .order('created_at', { ascending: true })
      .limit(1);

    const primaryAdmin = (admins as unknown as { id: string }[] | null)?.[0];
    if (adminsError || !primaryAdmin || primaryAdmin.id !== adminId) {
      return { success: false, error: 'Bu yönetici hesabının şifresini değiştirme yetkiniz yok.' };
    }

    const { error } = await adminSupabase.auth.admin.updateUserById(adminId, {
      password: newPassword,
    });
    if (error) {
      return { success: false, error: error.message };
    }

    await (adminSupabase.from('admin_logs') as any).insert({
      admin_id: adminId,
      action: 'update_admin_password',
      details: {},
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Şifre değiştirilemedi.',
    };
  }
}
