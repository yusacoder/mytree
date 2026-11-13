'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { addOrnamentSchema, reportSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { getOrnamentTreePosition } from '@/lib/tree-ornament-layout';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function addOrnamentAction(formData: FormData) {
  const headerList = headers();
  const forwardedFor = headerList.get('x-forwarded-for') || '127.0.0.1';
  const ip = forwardedFor.split(',')[0].trim();

  if (!checkRateLimit(ip, 5, 60000)) {
    return {
      success: false,
      error: 'Çok fazla istek gönderdiniz. Lütfen bir dakika bekledikten sonra tekrar deneyiniz.',
    };
  }

  const rawData = {
    treeId: formData.get('treeId'),
    ornamentType: formData.get('ornamentType'),
    positionX: Number(formData.get('positionX')),
    positionY: Number(formData.get('positionY')),
    senderName: formData.get('senderName') || 'Gizli Dost',
    messageContent: formData.get('messageContent'),
    isAnonymous: formData.get('isAnonymous') === 'true' || formData.get('isAnonymous') === 'on',
  };

  const parsed = addOrnamentSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Lütfen bilgileri eksiksiz doldurunuz.',
    };
  }

  const {
    treeId,
    ornamentType,
    senderName,
    messageContent,
    isAnonymous,
  } = parsed.data;

  try {
    const adminSupabase = createAdminClient();

    const { data: rawTree } = await adminSupabase
      .from('trees')
      .select('id, accept_messages, is_public')
      .eq('id', treeId)
      .maybeSingle();

    const tree = rawTree as { id: string; accept_messages: boolean; is_public: boolean } | null;

    if (!tree) {
      return { success: false, error: 'Ağaç bulunamadı.' };
    }

    if (!tree.accept_messages) {
      return {
        success: false,
        error: 'Bu ağacın sahibi şu anda yeni mesaj ve süs kabul etmemektedir.',
      };
    }

    const { count: ornamentCount, error: countError } = await adminSupabase
      .from('ornaments')
      .select('id', { count: 'exact', head: true })
      .eq('tree_id', treeId);

    if (countError) {
      return { success: false, error: 'Ağacın süs sırası belirlenemedi.' };
    }

    const position = getOrnamentTreePosition(ornamentCount ?? 0);
    const { data: rawOrnament, error: ornamentError } = await (adminSupabase
      .from('ornaments') as any)
      .insert([
        {
          tree_id: treeId,
          ornament_type: ornamentType,
          position_x: position.x,
          position_y: position.y,
        },
      ])
      .select()
      .single();

    if (ornamentError || !rawOrnament) {
      return {
        success: false,
        error: 'Süs eklenirken bir hata meydana geldi.',
      };
    }

    const ornament = rawOrnament as { id: string };

    const { error: messageError } = await (adminSupabase.from('messages') as any).insert([
      {
        tree_id: treeId,
        ornament_id: ornament.id,
        sender_name: isAnonymous ? 'Anonim Dost' : senderName,
        message_content: messageContent,
        is_anonymous: isAnonymous,
        ip_hash: ip,
      },
    ]);

    if (messageError) {
      await adminSupabase.from('ornaments').delete().eq('id', ornament.id);
      return {
        success: false,
        error: 'Mesaj kaydedilemedi.',
      };
    }

    revalidatePath(`/tree`);
    return {
      success: true,
      ornament: {
        ...(rawOrnament as any),
        sender_name: isAnonymous ? 'Anonim Dost' : senderName,
        is_anonymous: isAnonymous,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'İşlem gerçekleştirilemedi.';
    return { success: false, error: message };
  }
}

export async function reportMessageAction(formData: FormData) {
  const rawData = {
    treeId: formData.get('treeId'),
    messageId: formData.get('messageId'),
    reason: formData.get('reason'),
  };

  const parsed = reportSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Lütfen şikâyet nedeninizi belirtiniz.',
    };
  }

  try {
    const adminSupabase = createAdminClient();
    const { error } = await (adminSupabase.from('reports') as any).insert([
      {
        tree_id: parsed.data.treeId,
        message_id: parsed.data.messageId,
        reason: parsed.data.reason,
        status: 'pending',
      },
    ]);

    if (error) {
      return { success: false, error: 'Şikâyet iletilemedi.' };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Hata oluştu.';
    return { success: false, error: message };
  }
}
