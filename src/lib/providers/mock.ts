import { readFile } from 'node:fs/promises';
import path from 'node:path';
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
 * 목업 provider — 키/비용 없이 전체 흐름을 시연하기 위한 데모용.
 * queued → running(~3초) → ready 를 실제처럼 보여주고, 번들된 샘플 오디오를 돌려준다.
 * 다른 어댑터가 따라 만들 수 있는 "계약 기준" 구현이기도 하다.
 *
 * 상태는 job id 에 시작 시각을 인코딩해 요청 간(stateless) 유지한다.
 */
const SIMULATED_MS = 3000;
const SAMPLE_FILE = path.join(process.cwd(), 'public', 'samples', 'mock-jingle.wav');

export class MockProvider implements MusicProvider {
  readonly id: ProviderId = 'mock';
  readonly displayName = '체험용 (목업)';
  readonly mode: ProviderMode = 'mock';
  readonly supportedKinds: MusicKind[] = ['jingle', 'bgm'];
  readonly note = '키·비용 없이 바로 체험 (샘플 음원)';

  isAvailable(): boolean {
    return true;
  }

  async generate(_req: GenerateRequest): Promise<GenerationJob> {
    const jobId = `mock-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    return { providerJobId: jobId, status: 'queued' };
  }

  async pollStatus(jobId: string): Promise<GenerationJob> {
    const startedAt = Number(jobId.split('-')[1]) || 0;
    const elapsed = Date.now() - startedAt;
    if (elapsed < 1000) return { providerJobId: jobId, status: 'queued' };
    if (elapsed < SIMULATED_MS) return { providerJobId: jobId, status: 'running' };
    return { providerJobId: jobId, status: 'succeeded' };
  }

  async getResult(_jobId: string): Promise<GenerationResult> {
    const audioBytes = await readFile(SAMPLE_FILE);
    return { audioBytes, mimeType: 'audio/wav' };
  }
}
