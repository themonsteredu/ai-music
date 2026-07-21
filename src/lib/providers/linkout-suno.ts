import type {
  GenerateRequest,
  MusicKind,
  MusicProvider,
  ProviderId,
  ProviderMode,
} from './types';

/**
 * 링크아웃 provider — v1 기본 경로. 비용 0.
 * 앱이 프롬프트를 만들어 주고, 학생은 무료 웹툴(예: Suno)에서 직접 생성한 뒤
 * 결과 오디오 파일을 앱에 업로드해 반 갤러리에 모은다.
 *
 * generate/poll/getResult 는 구현하지 않는다 (생성은 외부에서 일어난다).
 * 대신 buildLaunchUrl 로 무료 툴을 프롬프트와 함께 연다.
 */
export class LinkOutSunoProvider implements MusicProvider {
  readonly id: ProviderId = 'linkout-suno';
  readonly displayName = '무료 웹툴로 만들기 (Suno)';
  readonly mode: ProviderMode = 'link-out';
  readonly supportedKinds: MusicKind[] = ['jingle', 'bgm'];
  readonly note = '무료 · 외부 툴에서 만들고 결과만 업로드';

  isAvailable(): boolean {
    return true;
  }

  buildLaunchUrl(req: GenerateRequest): string {
    // Suno 생성 화면을 프롬프트와 함께 연다. (프롬프트는 앱에서 복사도 제공)
    const params = new URLSearchParams({ prompt: req.prompt });
    return `https://suno.com/create?${params.toString()}`;
  }
}
