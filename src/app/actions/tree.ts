'use server';

import { createClient } from '@/lib/supabase/server';
import { createTreeSchema, updateTreeSchema } from '@/lib/validation/schemas';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createTreeAction(formData: FormData) {
  const rawData = {
    treeName: formData.get('treeName'),
    theme: formData.get('theme'),
    acceptMessages: formData.get('acceptMessages') === 'on' || formData.get('acceptMessages') === 'true',
  };

  const parsed = createTreeSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Ağaç bilgileri geçersiz.',
    };
  }

  const { treeName, theme, acceptMessages } = parsed.data;

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Ağaç oluşturmak için lütfen giriş yapınız.',
      };
    }

    const { data: rawExistingTree } = await supabase
      .from('trees')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const existingTree = rawExistingTree as { id: string } | null;

    if (existingTree) {
      await (supabase.from('trees') as any)
        .update({
          tree_name: treeName,
          theme,
          accept_messages: acceptMessages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingTree.id);

      redirect('/hesabim');
    }

    const { error: insertError } = await (supabase.from('trees') as any).insert([
      {
        user_id: user.id,
        tree_name: treeName,
        theme,
        accept_messages: acceptMessages,
        is_public: true,
        settings: {},
      },
    ]);

    if (insertError) {
      return {
        success: false,
        error: 'Ağaç kaydedilirken bir sorun oluştu: ' + insertError.message,
      };
    }
  } catch (err: unknown) {
    if ((err as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'Sunucu hatası oluştu.';
    return {
      success: false,
      error: message,
    };
  }

  redirect('/hesabim');
}

export async function updateTreeSettingsAction(formData: FormData) {
  const rawData = {
    treeName: formData.get('treeName'),
    theme: formData.get('theme'),
    acceptMessages: formData.get('acceptMessages') === 'on' || formData.get('acceptMessages') === 'true',
    isPublic: formData.get('isPublic') === 'on' || formData.get('isPublic') === 'true',
  };

  const parsed = updateTreeSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Ağaç ayarları geçersiz.',
    };
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Yetkisiz erişim.',
      };
    }

    const { error } = await (supabase.from('trees') as any)
      .update({
        tree_name: parsed.data.treeName,
        theme: parsed.data.theme,
        accept_messages: parsed.data.acceptMessages,
        is_public: parsed.data.isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/hesabim');
    revalidatePath('/hesabim/ayarlar');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Güncelleme yapılamadı.';
    return { success: false, error: message };
  }
}
