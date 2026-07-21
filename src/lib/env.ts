import 'server-only';

/**
 * 서버 전용 환경변수 접근. 외부 API 키는 절대 클라이언트로 노출하지 않는다.
 * (NEXT_PUBLIC_ 접두사 금지)
 */
/** Vercel 등 서버리스(읽기 전용 파일시스템) 환경 여부 */
export const isServerless = Boolean(process.env.VERCEL);

export const env = {
  databaseUrl: process.env.DATABASE_URL ?? 'file:./dev.db',
  defaultProvider: process.env.DEFAULT_PROVIDER ?? 'mock',
  // 서버리스에서는 로컬 디스크가 불가하므로, blob 을 명시하지 않는 한 항상 inline(data URL).
  storageDriver: (isServerless
    ? process.env.STORAGE_DRIVER === 'blob'
      ? 'blob'
      : 'inline'
    : (process.env.STORAGE_DRIVER ?? 'local')) as 'local' | 'blob' | 'inline',
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY ?? '',
  sunoApiKey: process.env.SUNO_API_KEY ?? '',
  blobToken: process.env.BLOB_READ_WRITE_TOKEN ?? '',
};

export function hasElevenLabs(): boolean {
  return env.elevenLabsApiKey.trim().length > 0;
}

export function hasSuno(): boolean {
  return env.sunoApiKey.trim().length > 0;
}
