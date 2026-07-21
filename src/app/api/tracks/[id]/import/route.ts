import { prisma, dbReady } from '@/lib/db';
import { getStorage } from '@/lib/storage';
import { recordUsage } from '@/lib/usage';
import { ok, fail } from '@/lib/http';

export const runtime = 'nodejs';

const MAX_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-wav'];

/** 링크아웃 결과 업로드: 외부 툴에서 만든 오디오 파일을 트랙에 붙인다. */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbReady;
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

  // 링크아웃(무료)은 요금 0으로 활동 로그에 기록
  await recordUsage(track.providerId, track.durationSec ?? (track.kind === 'bgm' ? 60 : 15));

  const updated = await prisma.track.update({
    where: { id },
    data: { status: 'ready', fileUrl: url, mimeType },
  });
  return ok(updated);
}
