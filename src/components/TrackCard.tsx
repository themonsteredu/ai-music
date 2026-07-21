'use client';
import { useState } from 'react';
import { deleteTrack, type TrackDTO } from '@/lib/api-client';

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  ready: { label: '완성', cls: 'bg-emerald-100 text-emerald-700' },
  running: { label: '생성 중', cls: 'bg-[#F3EDE4] text-[#e0562e]' },
  queued: { label: '대기', cls: 'bg-[#F3EDE4] text-[#8a8f99]' },
  failed: { label: '실패', cls: 'bg-rose-100 text-rose-600' },
  needs_manual_import: { label: '업로드 대기', cls: 'bg-sky-100 text-sky-700' },
};

export default function TrackCard({
  track,
  onDeleted,
}: {
  track: TrackDTO;
  onDeleted: (id: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const badge = STATUS_BADGE[track.status] ?? { label: track.status, cls: 'bg-[#F3EDE4]' };

  async function remove() {
    if (!confirm('이 로고송을 삭제할까요?')) return;
    setBusy(true);
    try {
      await deleteTrack(track.id);
      onDeleted(track.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[#E8E4DE] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-[#172033]">{track.title ?? '로고송'}</h3>
          <p className="text-xs text-[#8a8f99]">
            {track.kind === 'bgm' ? '배경음악' : '로고송'}
            {track.studentName ? ` · ${track.studentName}` : ''}
            {track.classCode ? ` · ${track.classCode}` : ''}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      {track.storeName && (
        <p className="mt-1 text-sm text-[#5b6270]">🏪 {track.storeName}</p>
      )}

      {track.status === 'ready' && track.fileUrl ? (
        <audio controls src={track.fileUrl} className="mt-3 w-full" />
      ) : track.status === 'failed' ? (
        <p className="mt-3 text-sm text-rose-600">{track.error ?? '생성 실패'}</p>
      ) : (
        <p className="mt-3 text-sm text-[#a8aab0]">
          {track.status === 'needs_manual_import'
            ? '외부 툴 결과 업로드 대기 중'
            : '아직 생성 중이에요…'}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        {track.status === 'ready' && track.fileUrl && (
          <a
            href={track.fileUrl}
            download={`${track.title ?? 'logo-song'}.${track.mimeType?.includes('wav') ? 'wav' : 'mp3'}`}
            className="rounded-full bg-[#F3EDE4] px-3 py-1.5 text-xs font-semibold text-[#172033] hover:bg-[#E8E4DE]"
          >
            ⬇️ 다운로드
          </a>
        )}
        <button
          onClick={remove}
          disabled={busy}
          className="ml-auto rounded-full px-3 py-1.5 text-xs font-semibold text-[#a8aab0] hover:bg-rose-50 hover:text-rose-500"
        >
          🗑️ 삭제
        </button>
      </div>
    </div>
  );
}
