import { z } from 'zod';

/** 교실 적합성: 길이 제한 + 아주 단순한 부적절어 필터 */
const BANNED = ['미친', '바보', '멍청', 'stupid', 'idiot', 'damn'];

export function isClean(text: string): boolean {
  const lower = text.toLowerCase();
  return !BANNED.some((w) => lower.includes(w.toLowerCase()));
}

const safeText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(isClean, { message: '적절하지 않은 표현이 포함되어 있어요.' });

export const generateSchema = z.object({
  providerId: z.string().min(1),
  kind: z.enum(['jingle', 'bgm']),
  prompt: safeText(2000).min(1),
  lyrics: z.string().max(2000).optional(),
  title: safeText(120).optional(),
  storeName: safeText(120).optional(),
  category: safeText(120).optional(),
  vibe: safeText(120).optional(),
  durationSec: z.number().int().min(5).max(120).optional(),
  studentName: safeText(40).optional(),
  classCode: safeText(40).optional(),
});

export type GenerateInput = z.infer<typeof generateSchema>;
