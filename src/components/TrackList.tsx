'use client';
import { useEffect, useState } from 'react';
import { fetchTracks, type TrackDTO } from '@/lib/api-client';
import TrackCard from './TrackCard';

export default function TrackList() {
  const [tracks, setTracks] = useState<TrackDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [classCode, setClassCode] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // 마운트/반 필터/새로고침 시 서버에서 목록을 가져온다 (setState 는 await 이후).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchTracks(classCode.trim() || undefined);
        if (!cancelled) setTracks(data);
      } catch {
        // 무시하고 다음 새로고침에서 재시도
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [classCode, reloadKey]);

  function onDeleted(id: string) {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
          placeholder="반으로 필터 (예: 3반)"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
        />
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-200"
        >
          🔄 새로고침
        </button>
        <span className="ml-auto text-sm text-stone-500">{tracks.length}개</span>
      </div>

      {loading ? (
        <p className="py-10 text-center text-stone-400">불러오는 중…</p>
      ) : tracks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 py-12 text-center">
          <p className="text-stone-500">아직 만든 로고송이 없어요.</p>
          <a
            href="/create"
            className="mt-3 inline-block rounded-full bg-amber-600 px-5 py-2.5 font-bold text-white hover:bg-amber-700"
          >
            🎤 첫 로고송 만들러 가기
          </a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <TrackCard key={t.id} track={t} onDeleted={onDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
