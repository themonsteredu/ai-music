/**
 * 음악 생성 "경로"를 하나의 인터페이스로 추상화한다.
 * 어댑터를 파일 하나로 추가하면 새로운 외부 툴을 연결할 수 있다.
 *
 * 이 파일은 클라이언트/서버 양쪽에서 타입으로 import 될 수 있으므로
 * 여기에는 비밀키나 서버 전용 로직을 두지 않는다 (타입 + 순수 메타만).
 */

export type ProviderId = 'mock' | 'linkout-suno' | 'elevenlabs' | 'suno-api';
export type MusicKind = 'jingle' | 'bgm';

/** api: 앱 안에서 직접 생성 / link-out: 외부 무료 툴로 보냄 / mock: 데모용 */
export type ProviderMode = 'api' | 'link-out' | 'mock';

export interface GenerateRequest {
  prompt: string;
  kind: MusicKind;
  durationSec?: number;
  lyrics?: string;
  storeName?: string;
}

export type JobStatus =
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'needs_manual_import';

export interface GenerationJob {
  providerJobId: string;
  status: JobStatus;
  error?: string;
}

export interface GenerationResult {
  audioBytes?: Buffer;
  audioUrl?: string;
  mimeType: string;
}

/** UI 셀렉터가 쓰는, 키/서버 없이 안전하게 노출 가능한 메타데이터 */
export interface ProviderInfo {
  id: ProviderId;
  displayName: string;
  mode: ProviderMode;
  supportedKinds: MusicKind[];
  note?: string;
  /** 키 미설정 등으로 지금 사용할 수 없으면 false */
  available: boolean;
  /** 사용 불가일 때 이유 (UI 안내용) */
  unavailableReason?: string;
}

export interface MusicProvider {
  readonly id: ProviderId;
  readonly displayName: string;
  readonly mode: ProviderMode;
  readonly supportedKinds: MusicKind[];
  readonly note?: string;

  /** 현재 사용 가능한지 (예: API 키 존재 여부). 미구현 시 true 로 간주 */
  isAvailable?(): boolean;
  /** 사용 불가 사유 */
  unavailableReason?(): string | undefined;

  // --- api / mock 경로 ---
  generate?(req: GenerateRequest): Promise<GenerationJob>;
  pollStatus?(jobId: string): Promise<GenerationJob>;
  getResult?(jobId: string): Promise<GenerationResult>;

  // --- link-out 경로 ---
  buildLaunchUrl?(req: GenerateRequest): string;
}
