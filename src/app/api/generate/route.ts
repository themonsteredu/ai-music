import { prisma, dbReady } from '@/lib/db';
import { getProvider } from '@/lib/providers';
import { advanceTrack } from '@/lib/generation';
import { generateSchema } from '@/lib/validation';
import { ok, fail } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  await dbReady;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail('잘못된 요청 본문입니다.');
  }

  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? '입력을 확인해 주세요.');
  }
  const input = parsed.data;

  const provider = getProvider(input.providerId);
  if (!provider) return fail('알 수 없는 생성 방식입니다.');
  if (provider.isAvailable && !provider.isAvailable()) {
    return fail(provider.unavailableReason?.() ?? '지금은 사용할 수 없습니다.');
  }

  // Track 생성 (공통)
  const track = await prisma.track.create({
    data: {
      studentName: input.studentName,
      classCode: input.classCode,
      title: input.title ?? input.storeName ?? '로고송',
      kind: input.kind,
      providerId: provider.id,
      mode: provider.mode,
      status: 'queued',
      prompt: input.prompt,
      lyrics: input.lyrics,
      storeName: input.storeName,
      category: input.category,
      vibe: input.vibe,
      durationSec: input.durationSec,
    },
  });

  // 링크아웃 경로: 외부 툴에서 만들고 결과를 업로드하도록 안내
  if (provider.mode === 'link-out') {
    const launchUrl = provider.buildLaunchUrl?.({
      prompt: input.prompt,
      kind: input.kind,
      durationSec: input.durationSec,
      lyrics: input.lyrics,
      storeName: input.storeName,
    });
    const updated = await prisma.track.update({
      where: { id: track.id },
      data: { status: 'needs_manual_import' },
    });
    return ok({ track: updated, launchUrl }, 201);
  }

  // api / mock 경로: 생성 시작
  if (!provider.generate) return fail('이 방식은 생성을 지원하지 않습니다.');
  const job = await provider.generate({
    prompt: input.prompt,
    kind: input.kind,
    durationSec: input.durationSec,
    lyrics: input.lyrics,
    storeName: input.storeName,
  });
  const updated = await advanceTrack(provider, track, job);
  return ok({ track: updated }, 201);
}
