'use client';
import Link from 'next/link';
import { usePollTrack } from '@/lib/polling';
import type { TrackDTO } from '@/lib/api-client';

const STATUS_LABEL: Record<string, string> = {
  queued: '대기 중…',
  running: '음악 만드는 중… 🎶',
  ready: '완성! 🎉',
  failed: '실패했어요 😢',
};

interface Props {
  /** /generate 가 돌려준 초기 트랙 (서버리스에서는 이미 ready 일 수 있음) */
  track: TrackDTO;
}

export default function GenerationProgress({ track: initial }: Props) {
  const terminal = ['ready', 'failed'].includes(initial.status);
  // 이미 끝났으면 폴링하지 않는다 (서버리스 즉시완료 대응).
  const polled = usePollTrack(terminal ? null : initial.id);
  const track = polled ?? initial;
  const status = track.status;
  const busy = status === 'queued' || status === 'running';

  return (
    <div className="rounded-2xl border border-[#E8E4DE] bg-white p-5">
      <div className="flex items-center gap-3">
        {busy && (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8E4DE] border-t-[#F1643A]" />
        )}
        <span className="font-bold text-[#172033]">
          {STATUS_LABEL[status] ?? status}
        </span>
      </div>

      {busy && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#F3EDE4]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#F1643A]" />
        </div>
      )}

      {status === 'failed' && track.error && (
        <p className="mt-2 text-sm text-rose-600">{track.error}</p>
      )}

      {status === 'ready' && track.fileUrl && (
        <div className="mt-3 space-y-3">
          <audio controls src={track.fileUrl} className="w-full" />
          <div className="flex gap-2">
            <a
              href={track.fileUrl}
              download={`${track.title ?? 'logo-song'}.${track.mimeType?.includes('wav') ? 'wav' : 'mp3'}`}
              className="rounded-full bg-[#F3EDE4] px-4 py-2 text-sm font-semibold text-[#172033] hover:bg-[#E8E4DE]"
            >
              ⬇️ 다운로드
            </a>
            <Link
              href="/gallery"
              className="rounded-full bg-[#F1643A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e0562e]"
            >
              반 갤러리에서 보기 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
