import type {
  GenerateRequest,
  GenerationJob,
  GenerationResult,
  MusicKind,
  MusicProvider,
  ProviderId,
  ProviderMode,
} from './types';

/**
 * 동기 API 어댑터용 얇은 베이스.
 * 한 번의 요청으로 오디오가 바로 오는 provider(예: ElevenLabs Music)에서 사용.
 * generateAndFetch() 하나만 구현하면 generate/poll/getResult 라이프사이클이 자동으로 맞춰진다.
 */
export abstract class BaseSyncProvider implements MusicProvider {
  abstract readonly id: ProviderId;
  abstract readonly displayName: string;
  readonly mode: ProviderMode = 'api';
  abstract readonly supportedKinds: MusicKind[];
  readonly note?: string;

  // 동기 결과를 job id 로 잠깐 보관 (단일 인스턴스 메모리 캐시)
  private cache = new Map<string, GenerationResult>();

  isAvailable(): boolean {
    return true;
  }
  unavailableReason(): string | undefined {
    return this.isAvailable() ? undefined : '사용할 수 없습니다.';
  }

  /** 실제 외부 호출: 요청 → 완성된 오디오 반환 */
  protected abstract generateAndFetch(
    req: GenerateRequest,
  ): Promise<GenerationResult>;

  async generate(req: GenerateRequest): Promise<GenerationJob> {
    const jobId = `${this.id}-${Date.now()}-${Math.floor(
      Math.random() * 1e6,
    )}`;
    try {
      const result = await this.generateAndFetch(req);
      this.cache.set(jobId, result);
      return { providerJobId: jobId, status: 'succeeded' };
    } catch (e) {
      return {
        providerJobId: jobId,
        status: 'failed',
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }

  async pollStatus(jobId: string): Promise<GenerationJob> {
    return {
      providerJobId: jobId,
      status: this.cache.has(jobId) ? 'succeeded' : 'failed',
      error: this.cache.has(jobId) ? undefined : '결과를 찾을 수 없습니다.',
    };
  }

  async getResult(jobId: string): Promise<GenerationResult> {
    const r = this.cache.get(jobId);
    if (!r) throw new Error('결과가 없습니다. 다시 생성해 주세요.');
    return r;
  }
}

/** 지수 백오프 재시도 헬퍼 (외부 API 일시적 오류 대비) */
export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseMs = 500,
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseMs * 2 ** i));
      }
    }
  }
  throw lastErr;
}
