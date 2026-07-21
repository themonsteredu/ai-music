import 'server-only';

/**
 * 서버 전용 환경변수 접근. 외부 API 키는 절대 클라이언트로 노출하지 않는다.
 * (NEXT_PUBLIC_ 접두사 금지)
 */
export const env = {
  databaseUrl: process.env.DATABASE_URL ?? 'file:./dev.db',
  defaultProvider: process.env.DEFAULT_PROVIDER ?? 'mock',
  storageDriver: (process.env.STORAGE_DRIVER ?? 'local') as 'local' | 'blob',
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
