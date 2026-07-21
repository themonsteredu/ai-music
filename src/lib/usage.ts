import 'server-only';
import { prisma } from '@/lib/db';
import { estimateCostUsd } from '@/lib/pricing';

/**
 * 생성 1건의 API 사용량/요금을 날짜별로 기록한다.
 * 무료 경로(mock, linkout)는 costUsd=0 으로 기록되어 활동 로그로도 쓰인다.
 */
export async function recordUsage(
  providerId: string,
  seconds: number,
): Promise<void> {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const costUsd = estimateCostUsd(providerId, seconds);
  try {
    await prisma.usageEvent.create({
      data: { day, providerId, seconds, costUsd },
    });
  } catch (e) {
    // 요금 기록 실패가 생성 자체를 막지 않도록 삼킨다.
    console.error('recordUsage failed', e);
  }
}
