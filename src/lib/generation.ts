import 'server-only';
import { prisma } from '@/lib/db';
import { getStorage } from '@/lib/storage';
import type { GenerationJob, MusicProvider } from '@/lib/providers/types';
import type { Track } from '@prisma/client';

/**
 * job 상태를 받아 Track 을 갱신한다.
 * - succeeded: 결과를 받아 저장하고 status='ready'
 * - failed: status='failed'
 * - 그 외: status=job.status (queued/running) 로 두고 클라이언트가 계속 폴링
 *
 * /generate 와 /tracks/[id]/status 가 공유하는 단일 라이프사이클 로직.
 */
export async function advanceTrack(
  provider: MusicProvider,
  track: Track,
  job: GenerationJob,
): Promise<Track> {
  if (job.status === 'failed') {
    return prisma.track.update({
      where: { id: track.id },
      data: { status: 'failed', error: job.error ?? '생성 실패', providerJobId: job.providerJobId },
    });
  }

  if (job.status === 'succeeded') {
    if (!provider.getResult) {
      return prisma.track.update({
        where: { id: track.id },
        data: { status: 'failed', error: 'provider가 결과를 반환하지 못했습니다.' },
      });
    }
    try {
      const result = await provider.getResult(job.providerJobId);
      const bytes = result.audioBytes;
      if (!bytes) {
        // audioUrl 만 준 경우 서버에서 내려받아 저장
        if (result.audioUrl) {
          const res = await fetch(result.audioUrl);
          const buf = Buffer.from(await res.arrayBuffer());
          const { url } = await getStorage().save(track.id, buf, result.mimeType);
          return prisma.track.update({
            where: { id: track.id },
            data: { status: 'ready', fileUrl: url, mimeType: result.mimeType, providerJobId: job.providerJobId },
          });
        }
        throw new Error('오디오 데이터가 비어 있습니다.');
      }
      const { url } = await getStorage().save(track.id, bytes, result.mimeType);
      return prisma.track.update({
        where: { id: track.id },
        data: { status: 'ready', fileUrl: url, mimeType: result.mimeType, providerJobId: job.providerJobId },
      });
    } catch (e) {
      return prisma.track.update({
        where: { id: track.id },
        data: { status: 'failed', error: e instanceof Error ? e.message : String(e) },
      });
    }
  }

  // queued | running
  return prisma.track.update({
    where: { id: track.id },
    data: { status: job.status, providerJobId: job.providerJobId },
  });
}
