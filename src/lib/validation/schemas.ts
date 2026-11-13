import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
    .max(24, 'Kullanıcı adı en fazla 24 karakter olabilir')
    .regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı yalnızca harf, rakam ve alt çizgi içerebilir')
    .transform((val) => val.toLowerCase().trim()),
  displayName: z
    .string()
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .max(40, 'İsim en fazla 40 karakter olabilir')
    .trim(),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export const loginSchema = z.object({
  username: z.string().min(3, 'Kullanıcı adınızı giriniz').max(24).trim().toLowerCase(),
  password: z.string().min(1, 'Lütfen şifrenizi giriniz'),
});

export const createTreeSchema = z.object({
  treeName: z
    .string()
    .min(2, 'Ağaç adı en az 2 karakter olmalıdır')
    .max(50, 'Ağaç adı en fazla 50 karakter olabilir')
    .trim(),
  theme: z.enum(['classic', 'snowy', 'golden', 'midnight']),
  acceptMessages: z.boolean().default(true),
});

export const updateTreeSchema = z.object({
  treeName: z
    .string()
    .min(2, 'Ağaç adı en az 2 karakter olmalıdır')
    .max(50, 'Ağaç adı en fazla 50 karakter olabilir')
    .trim(),
  theme: z.enum(['classic', 'snowy', 'golden', 'midnight']),
  acceptMessages: z.boolean(),
  isPublic: z.boolean(),
});

export const addOrnamentSchema = z.object({
  treeId: z.string().uuid('Geçersiz ağaç kimliği'),
  ornamentType: z.enum([
    'gold_ball',
    'silver_ball',
    'red_ball',
    'star',
    'snowflake',
    'bell',
    'gift_box',
    'heart',
  ]),
  positionX: z.number().min(10).max(90),
  positionY: z.number().min(10).max(85),
  senderName: z
    .string()
    .min(3, 'İsim en az 3 karakter olmalıdır')
    .max(12, 'İsim en fazla 12 karakter olabilir')
    .trim()
    .default('Gizli Dost'),
  messageContent: z
    .string()
    .min(2, 'Mesaj en az 2 karakter olmalıdır')
    .max(300, 'Mesaj en fazla 300 karakter olabilir')
    .trim(),
  isAnonymous: z.boolean().default(false),
});

export const reportSchema = z.object({
  treeId: z.string().uuid('Geçersiz ağaç kimliği'),
  messageId: z.string().uuid('Geçersiz mesaj kimliği'),
  reason: z.string().min(5, 'Şikâyet gerekçesi en az 5 karakter olmalıdır').max(300),
});
