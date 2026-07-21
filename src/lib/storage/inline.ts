import 'server-only';
import type { AudioStorage } from './index';

/**
 * 인라인 저장 드라이버 — 서버리스(Vercel)용.
 * 파일서버/공유 스토리지 없이, 오디오를 data: URL 로 돌려준다.
 * 클라이언트는 이 URL 을 그대로 <audio src> 로 재생하고 다운로드한다.
 * (읽기 전용 파일시스템·인스턴스 간 파일 미공유 문제를 원천 회피)
 */
export class InlineStorage implements AudioStorage {
  async save(_id: string, bytes: Buffer, mimeType: string) {
    const url = `data:${mimeType};base64,${bytes.toString('base64')}`;
    return { url };
  }

  async read() {
    // 데이터 URL 은 트랙에 직접 담기므로 별도 서빙이 필요 없다.
    return null;
  }

  async remove() {
    // no-op
  }
}
