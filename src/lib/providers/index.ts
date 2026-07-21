import 'server-only';
import type { MusicKind, MusicProvider, ProviderId, ProviderInfo } from './types';
import { MockProvider } from './mock';
import { LinkOutSunoProvider } from './linkout-suno';
import { ElevenLabsProvider } from './elevenlabs';

/**
 * Provider 레지스트리 — 새 외부 툴을 추가하려면
 * 어댑터 파일 1개 + 이 맵에 한 줄만 추가하면 된다.
 */
const registry: Partial<Record<ProviderId, MusicProvider>> = {
  mock: new MockProvider(),
  'linkout-suno': new LinkOutSunoProvider(),
  elevenlabs: new ElevenLabsProvider(),
  // 'suno-api': new SunoApiProvider(),  // Phase 2
};

export function getProvider(id: string): MusicProvider | undefined {
  return registry[id as ProviderId];
}

function toInfo(p: MusicProvider): ProviderInfo {
  const available = p.isAvailable ? p.isAvailable() : true;
  return {
    id: p.id,
    displayName: p.displayName,
    mode: p.mode,
    supportedKinds: p.supportedKinds,
    note: p.note,
    available,
    unavailableReason:
      !available && p.unavailableReason ? p.unavailableReason() : undefined,
  };
}

/** UI 셀렉터용 메타데이터. kind 로 필터 가능. */
export function listProviders(kind?: MusicKind): ProviderInfo[] {
  return Object.values(registry)
    .filter((p): p is MusicProvider => Boolean(p))
    .filter((p) => (kind ? p.supportedKinds.includes(kind) : true))
    .map(toInfo);
}
