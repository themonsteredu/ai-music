import 'server-only';
import { env } from '@/lib/env';
import { LocalStorage } from './local';

/** 생성된 오디오 파일 저장 추상화. 드라이버를 바꿔 로컬/클라우드 전환. */
export interface AudioStorage {
  save(id: string, bytes: Buffer, mimeType: string): Promise<{ url: string }>;
  read(id: string): Promise<{ bytes: Buffer; mimeType: string } | null>;
  remove(id: string): Promise<void>;
}

let instance: AudioStorage | null = null;

export function getStorage(): AudioStorage {
  if (instance) return instance;
  if (env.storageDriver === 'blob') {
    // 배포용: @vercel/blob 설치 후 연결. v1 은 로컬 드라이버를 기본으로 둔다.
    throw new Error(
      'STORAGE_DRIVER=blob 은 배포 단계에서 @vercel/blob 연동이 필요합니다. 개발은 STORAGE_DRIVER=local 을 사용하세요.',
    );
  }
  instance = new LocalStorage();
  return instance;
}

/** 저장 id(트랙 id)로 확장자 추정 */
export function extFor(mimeType: string): string {
  if (mimeType.includes('mpeg') || mimeType.includes('mp3')) return 'mp3';
  if (mimeType.includes('wav')) return 'wav';
  if (mimeType.includes('ogg')) return 'ogg';
  return 'bin';
}
