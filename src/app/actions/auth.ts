'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { registerSchema, loginSchema } from '@/lib/validation/schemas';
import { redirect } from 'next/navigation';

export async function registerAction(formData: FormData) {
  const rawData = {
    username: formData.get('username'),
    displayName: formData.get('displayName'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Lütfen bilgilerinizi kontrol ediniz.',
    };
  }

  const { username, displayName, email, password } = parsed.data;

  try {
    const supabase = createClient();
    const adminSupabase = createAdminClient();

    const { data: rawRegSetting } = await adminSupabase
      .from('app_settings')
      .select('*')
      .eq('setting_key', 'allow_registration')
      .maybeSingle();

    const regSetting = rawRegSetting as { setting_value?: string } | null;
    if (regSetting && regSetting.setting_value === 'false') {
      return {
        success: false,
        error: 'Yeni kullanıcı kayıtları şu anda yönetici tarafından durdurulmuştur.',
      };
    }

    const { data: existingUser } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      return {
        success: false,
        error: 'Bu kullanıcı adı zaten kullanılıyor. Lütfen başka bir kullanıcı adı seçiniz.',
      };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName,
        },
      },
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Kayıt sırasında bir hata oluştu.',
      };
    }

    await (adminSupabase.from('profiles') as any).insert([
      {
        id: authData.user.id,
        username,
        display_name: displayName,
        is_admin: false,
        is_suspended: false,
      },
    ]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sunucu hatası oluştu.';
    return {
      success: false,
      error: message,
    };
  }

  redirect('/agac-olustur');
}

export async function loginAction(formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Lütfen bilgilerinizi kontrol ediniz.',
    };
  }

  const { email, password } = parsed.data;

  try {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: 'E-posta veya şifreniz hatalı.',
      };
    }

    const { data: rawProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    const profile = rawProfile as { is_suspended?: boolean } | null;
    if (profile?.is_suspended) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Hesabınız askıya alınmıştır. Lütfen destek ile iletişime geçin.',
      };
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
