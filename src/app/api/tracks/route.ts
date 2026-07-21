import { prisma } from '@/lib/db';
import { ok } from '@/lib/http';

export const runtime = 'nodejs';

/** 반 갤러리 목록. classCode 로 반 필터 가능. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classCode = searchParams.get('classCode');
  const tracks = await prisma.track.findMany({
    where: classCode ? { classCode } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  return ok(tracks);
}
