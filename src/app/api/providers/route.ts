import { listProviders } from '@/lib/providers';
import { ok } from '@/lib/http';
import type { MusicKind } from '@/lib/providers/types';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get('kind') as MusicKind | null;
  return ok(listProviders(kind ?? undefined));
}
