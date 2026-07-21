import { BaseSyncProvider, withRetry } from './base';
import { env, hasElevenLabs } from '@/lib/env';
import type {
  GenerateRequest,
  GenerationResult,
  MusicKind,
  ProviderId,
} from './types';

/**
 * ElevenLabs Music — 선택적 API 경로 (선생님 키 필요).
 * 상업 라이선스가 깨끗하고, 보컬 로고송/BGM 모두 가능. 한 번의 요청으로 오디오가 온다(동기).
 *
 * NOTE: 엔드포인트/파라미터는 현재 ElevenLabs 문서 기준으로 필요 시 조정.
 * 키가 없으면 provider 레지스트리에서 자동으로 "사용 불가" 처리되어 앱은 정상 동작한다.
 */
const MUSIC_ENDPOINT = 'https://api.elevenlabs.io/v1/music';

export class ElevenLabsProvider extends BaseSyncProvider {
  readonly id: ProviderId = 'elevenlabs';
  readonly displayName = 'ElevenLabs Music';
  readonly supportedKinds: MusicKind[] = ['jingle', 'bgm'];
  readonly note = '선생님 키 필요 · 상업 이용 가능';

  isAvailable(): boolean {
    return hasElevenLabs();
  }

  unavailableReason(): string | undefined {
    return this.isAvailable()
      ? undefined
      : 'ELEVENLABS_API_KEY가 설정되지 않았습니다.';
  }

  protected async generateAndFetch(
    req: GenerateRequest,
  ): Promise<GenerationResult> {
    if (!hasElevenLabs()) {
      throw new Error('ELEVENLABS_API_KEY가 없습니다.');
    }
    const lengthMs = Math.round((req.durationSec ?? 15) * 1000);

    const res = await withRetry(() =>
      fetch(MUSIC_ENDPOINT, {
        method: 'POST',
        headers: {
          'xi-api-key': env.elevenLabsApiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          prompt: req.prompt,
          music_length_ms: lengthMs,
        }),
      }).then(async (r) => {
        if (!r.ok) {
          const detail = await r.text().catch(() => '');
          throw new Error(`ElevenLabs 오류 ${r.status}: ${detail.slice(0, 200)}`);
        }
        return r;
      }),
    );

    const audioBytes = Buffer.from(await res.arrayBuffer());
    return { audioBytes, mimeType: 'audio/mpeg' };
  }
}
