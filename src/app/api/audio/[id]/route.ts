import { getStorage } from '@/lib/storage';

export const runtime = 'nodejs';

/** 저장된 오디오 파일 서빙 (로컬 드라이버). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const found = await getStorage().read(id);
  if (!found) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(new Uint8Array(found.bytes), {
    headers: {
      'Content-Type': found.mimeType,
      'Content-Length': String(found.bytes.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
