import { prisma } from '@/lib/db';
import { getProvider } from '@/lib/providers';
import { advanceTrack } from '@/lib/generation';
import { ok, fail } from '@/lib/http';

export const runtime = 'nodejs';

/** 폴링 엔드포인트: provider 상태를 확인하고 필요하면 결과를 저장한 뒤 최신 Track 반환 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const track = await prisma.track.findUnique({ where: { id } });
  if (!track) return fail('트랙을 찾을 수 없습니다.', 404);

  // 이미 끝난 상태면 그대로 반환
  if (['ready', 'failed', 'needs_manual_import'].includes(track.status)) {
    return ok(track);
  }

  const provider = getProvider(track.providerId);
  if (!provider?.pollStatus || !track.providerJobId) {
    return ok(track);
  }

  const job = await provider.pollStatus(track.providerJobId);
  const updated = await advanceTrack(provider, track, job);
  return ok(updated);
}
