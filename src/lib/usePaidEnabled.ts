'use client';
import { useEffect, useState } from 'react';

/**
 * 유료 기능(ElevenLabs) 노출 여부를 브라우저에 저장.
 * 기본은 꺼짐 → 만들기 화면엔 무료(Suno)·체험만 보임.
 * Suno 계정 오류 등으로 필요할 때 설정에서 켜면 유료 옵션이 나타난다.
 */
const KEY = 'logosong.paidEnabled';

export function usePaidEnabled(): [boolean, (v: boolean) => void] {
  const [on, setOn] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage(외부 상태) 동기화
      setOn(localStorage.getItem(KEY) === '1');
    } catch {
      // 무시
    }
  }, []);

  const set = (v: boolean) => {
    setOn(v);
    try {
      localStorage.setItem(KEY, v ? '1' : '0');
    } catch {
      // 무시
    }
  };

  return [on, set];
}
