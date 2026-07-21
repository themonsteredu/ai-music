import { prisma } from '@/lib/db';
import { getStorage } from '@/lib/storage';
import { ok, fail } from '@/lib/http';

export const runtime = 'nodejs';

const MAX_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-wav'];

/** 링크아웃 결과 업로드: 외부 툴에서 만든 오디오 파일을 트랙에 붙인다. */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const track = await prisma.track.findUnique({ where: { id } });
  if (!track) return fail('트랙을 찾을 수 없습니다.', 404);

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return fail('오디오 파일을 첨부해 주세요.');
  if (file.size > MAX_BYTES) return fail('파일이 너무 큽니다 (최대 20MB).');

  const mimeType = ALLOWED.includes(file.type) ? file.type : 'audio/mpeg';
  const bytes = Buffer.from(await file.arrayBuffer());
  const { url } = await getStorage().save(id, bytes, mimeType);

  const updated = await prisma.track.update({
    where: { id },
    data: { status: 'ready', fileUrl: url, mimeType },
  });
  return ok(updated);
}
