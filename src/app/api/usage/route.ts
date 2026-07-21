import { prisma, dbReady } from '@/lib/db';
import { usdToKrw } from '@/lib/pricing';
import { ok } from '@/lib/http';

export const runtime = 'nodejs';

/** 날짜별 API 사용량/요금 집계 + 총합 */
export async function GET() {
  await dbReady;

  const grouped = await prisma.usageEvent.groupBy({
    by: ['day'],
    _sum: { costUsd: true, seconds: true },
    _count: { _all: true },
    orderBy: { day: 'desc' },
    take: 90,
  });

  const days = grouped.map((g) => {
    const costUsd = g._sum.costUsd ?? 0;
    return {
      day: g.day,
      count: g._count._all,
      seconds: g._sum.seconds ?? 0,
      costUsd: Number(costUsd.toFixed(4)),
      costKrw: usdToKrw(costUsd),
    };
  });

  const totalUsd = days.reduce((s, d) => s + d.costUsd, 0);
  const totalCount = days.reduce((s, d) => s + d.count, 0);

  return ok({
    days,
    totalUsd: Number(totalUsd.toFixed(4)),
    totalKrw: usdToKrw(totalUsd),
    totalCount,
  });
}
