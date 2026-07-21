import { prisma } from '@/lib/db';
import { getStorage } from '@/lib/storage';
import { ok, fail } from '@/lib/http';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const track = await prisma.track.findUnique({ where: { id } });
  if (!track) return fail('트랙을 찾을 수 없습니다.', 404);
  return ok(track);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const track = await prisma.track.findUnique({ where: { id } });
  if (!track) return fail('트랙을 찾을 수 없습니다.', 404);
  await getStorage().remove(id).catch(() => {});
  await prisma.track.delete({ where: { id } });
  return ok({ id });
}
