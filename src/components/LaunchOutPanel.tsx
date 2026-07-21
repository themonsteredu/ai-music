'use client';
import { useState } from 'react';
import Link from 'next/link';
import { importAudio, type TrackDTO } from '@/lib/api-client';

interface Props {
  track: TrackDTO;
  launchUrl?: string;
  prompt: string;
  lyrics?: string;
}

export default function LaunchOutPanel({ track, launchUrl, prompt, lyrics }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState<TrackDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    } catch {
      setError('복사에 실패했어요. 아래 내용을 직접 선택해 복사해 주세요.');
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const updated = await importAudio(track.id, file);
      setDone(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 실패');
    } finally {
      setUploading(false);
    }
  }

  if (done?.fileUrl) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-bold text-emerald-800">업로드 완료! 🎉</p>
        <audio controls src={done.fileUrl} className="mt-3 w-full" />
        <Link
          href="/gallery"
          className="mt-3 inline-block rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          반 갤러리에서 보기 →
        </Link>
      </div>
    );
  }

  const hasLyrics = Boolean(lyrics && lyrics.trim());

  const copyBtn = (k: string, text: string) => (
    <button
      onClick={() => copy(k, text)}
      className="mt-2 rounded-full bg-[#F3EDE4] px-4 py-2 text-sm font-semibold text-[#172033] hover:bg-[#E8E4DE]"
    >
      {copiedKey === k ? '복사됨 ✓' : '📋 복사하기'}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Suno 사용법 안내 */}
      <div className="rounded-xl border border-[#766CC2]/30 bg-[#766CC2]/5 p-4 text-sm text-[#172033]">
        <p className="font-bold text-[#766CC2]">Suno에서 가사 칸을 못 찾겠다면?</p>
        <ul className="mt-2 space-y-1.5 text-[#3d4453]">
          <li>
            <b>· 간단 모드(추천)</b> — Suno 만들기 화면의 <b>“노래 설명(Song
            description)”</b> 한 칸에 아래 <b>[노래 설명]</b>만 붙여넣으면 가사·멜로디를
            <b> 자동으로</b> 만들어줘요. 가사 칸을 따로 찾을 필요 없어요!
          </li>
          <li>
            <b>· 커스텀 모드</b> — 가사를 직접 넣고 싶으면 <b>Custom</b>을 켜고,{' '}
            <b>Lyrics</b> 칸에 아래 <b>[가사]</b>, <b>Styles</b> 칸에 <b>[노래 설명]</b>을
            넣어요.
          </li>
        </ul>
      </div>

      <div className="space-y-4 rounded-2xl border border-[#E8E4DE] bg-white p-5">
        <ol className="space-y-4 text-sm text-[#172033]">
          <li>
            <b>1.</b> 아래 내용을 복사해요.
            <div className="mt-2 space-y-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-md bg-[#F1643A]/10 px-2 py-0.5 text-xs font-bold text-[#F1643A]">
                    노래 설명
                  </span>
                  <span className="text-xs text-[#8a8f99]">
                    (간단 모드면 이것만! / 커스텀은 Styles 칸)
                  </span>
                </div>
                <div className="rounded-lg bg-[#F3EDE4] p-3 text-[#172033]">{prompt}</div>
                {copyBtn('prompt', prompt)}
              </div>

              {hasLyrics && (
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded-md bg-[#766CC2]/10 px-2 py-0.5 text-xs font-bold text-[#766CC2]">
                      가사
                    </span>
                    <span className="text-xs text-[#8a8f99]">
                      (직접 넣고 싶을 때만 · 커스텀 Lyrics 칸)
                    </span>
                  </div>
                  <div className="rounded-lg bg-[#F3EDE4] p-3 whitespace-pre-line text-[#172033]">
                    {lyrics}
                  </div>
                  {copyBtn('lyrics', lyrics as string)}
                </div>
              )}
            </div>
          </li>

          <li>
            <b>2.</b> 무료 웹툴을 열어 붙여넣고 음악을 만들어요.
            {launchUrl && (
              <div className="mt-2">
                <a
                  href={launchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-[#F1643A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e0562e]"
                >
                  🔗 무료 웹툴 열기 (Suno)
                </a>
              </div>
            )}
          </li>

          <li>
            <b>3.</b> 만든 음악 파일을 내려받아 여기로 올려요.
            <div className="mt-2">
              <label className="inline-block cursor-pointer rounded-full border border-[#E8E4DE] bg-white px-4 py-2 text-sm font-semibold text-[#e0562e] hover:bg-[#FAF8F4]">
                {uploading ? '업로드 중…' : '⬆️ 결과 파일 올리기'}
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={onFile}
                />
              </label>
            </div>
          </li>
        </ol>
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>
    </div>
  );
}
