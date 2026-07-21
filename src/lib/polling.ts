'use client';
import { useEffect, useRef, useState } from 'react';
import { fetchTrackStatus, type TrackDTO } from './api-client';

const DONE = ['ready', 'failed', 'needs_manual_import'];

/**
 * 트랙 생성 상태를 주기적으로 폴링하는 훅.
 * queued → running → ready 진행을 UI가 그대로 보여줄 수 있다.
 */
export function usePollTrack(trackId: string | null, intervalMs = 2000) {
  const [track, setTrack] = useState<TrackDTO | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!trackId) return;
    let cancelled = false;

    const tick = async () => {
      try {
        const t = await fetchTrackStatus(trackId);
        if (cancelled) return;
        setTrack(t); // await 이후이므로 동기 setState 아님
        if (DONE.includes(t.status) && timer.current) {
          clearInterval(timer.current);
          timer.current = null;
        }
      } catch {
        // 일시적 오류는 다음 폴링에서 재시도
      }
    };

    tick();
    timer.current = setInterval(tick, intervalMs);
    return () => {
      cancelled = true;
      if (timer.current) clearInterval(timer.current);
    };
  }, [trackId, intervalMs]);

  return track;
}
