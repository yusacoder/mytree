'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { registerSchema, loginSchema } from '@/lib/validation/schemas';
import { redirect } from 'next/navigation';

export async function registerAction(formData: FormData) {
  const rawData = {
    username: formData.get('username'),
    displayName: formData.get('displayName'),
    password: formData.get('password'),
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Lütfen bilgilerinizi kontrol ediniz.',
    };
  }

  const { username, displayName, password } = parsed.data;

  try {
    const adminSupabase = createAdminClient();

    const { data: rawRegSetting } = await adminSupabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'allow_registration')
      .maybeSingle();

    const regSetting = rawRegSetting as { setting_value?: string } | null;
    if (regSetting?.setting_value === 'false') {
      return {
        success: false,
        error: 'Yeni kullanıcı kayıtları şu anda yönetici tarafından durdurulmuştur.',
      };
    }

    const { data: existingUser } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      return {
        success: false,
        error: 'Bu kullanıcı adı zaten kullanılıyor. Lütfen başka bir kullanıcı adı seçiniz.',
      };
    }

    // Supabase Auth requires an email identifier; this reserved address is never shown or emailed.
    const internalEmail = `user-${username}@users.mytree.invalid`;
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email: internalEmail,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        display_name: displayName,
      },
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Kayıt sırasında bir hata oluştu.',
      };
    }

    const { error: profileError } = await (adminSupabase.from('profiles') as any).insert({
      id: authData.user.id,
      username,
      display_name: displayName,
      is_admin: false,
      is_suspended: false,
    });

    if (profileError) {
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      return {
        success: false,
        error: profileError.message || 'Kullanıcı profili oluşturulamadı.',
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası oluştu.';
    return {
      success: false,
      error: message,
    };
  }

  redirect('/giris?registered=1');
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Lütfen bilgilerinizi kontrol ediniz.',
    };
  }

  const { username, password } = parsed.data;

  try {
    const adminSupabase = createAdminClient();
    const { data: rawProfile } = await adminSupabase
      .from('profiles')
      .select('id, is_suspended')
      .eq('username', username)
      .maybeSingle();

    const profile = rawProfile as { id: string; is_suspended?: boolean } | null;
    if (!profile) {
      return { success: false, error: 'Kullanıcı adı veya şifreniz hatalı.' };
    }
    if (profile.is_suspended) {
      return {
        success: false,
        error: 'Hesabınız askıya alınmıştır. Lütfen destek ile iletişime geçin.',
      };
    }

    // Resolve the Auth email internally so accounts created before username-only signup still work.
    const { data: authUserData, error: authUserError } =
      await adminSupabase.auth.admin.getUserById(profile.id);
    const authEmail = authUserData.user?.email;
    if (authUserError || !authEmail) {
      return { success: false, error: 'Kullanıcı adı veya şifreniz hatalı.' };
    }

    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    });

    if (authError || !authData.user) {
      return { success: false, error: 'Kullanıcı adı veya şifreniz hatalı.' };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Giriş yapılamadı.';
    return {
      success: false,
      error: message,
    };
  }

  redirect('/hesabim');
}

export async function logoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/giris');
}
