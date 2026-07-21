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
      {/* Suno로 만드는 순서 요약 */}
      <div className="rounded-xl border border-[#766CC2]/30 bg-[#766CC2]/5 p-4 text-sm">
        <p className="font-bold text-[#766CC2]">Suno로 만드는 순서</p>
        <p className="mt-1 text-[#3d4453]">
          내가 쓴 <b>[가사]</b>와 <b>[노래 설명]</b>을 복사해서 Suno에 넣으면 돼요.
          아래 순서대로 따라 해요!
        </p>
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
                    (커스텀 → Styles 칸 / 간단 모드면 이것만)
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
                    <span className="text-xs text-[#8a8f99]">(커스텀 → Lyrics 칸)</span>
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
            <b>2.</b> ‘무료 웹툴 열기’로 <b>Suno에 접속</b>해요. (처음이면 무료 로그인)
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
            <b>3.</b> Suno 화면에서 <b>순서대로</b> 넣어요:
            <ol className="mt-1.5 ml-1 list-decimal space-y-1 pl-4 text-[#3d4453]">
              <li>
                <b>Custom(커스텀)</b> 켜기
              </li>
              <li>
                <b>Lyrics(가사)</b> 칸에 <b>[가사]</b> 붙여넣기
              </li>
              <li>
                <b>Styles</b>(Style of Music) 칸에 <b>[노래 설명]</b> 붙여넣기
              </li>
              <li>
                <b>Create(만들기)</b> 누르고 잠깐 기다리기
              </li>
            </ol>
            <p className="mt-1.5 text-xs text-[#8a8f99]">
              💡 가사 없이 빠르게 만들고 싶으면 Custom을 끄고 [노래 설명]만 넣어도 자동으로
              만들어져요.
            </p>
          </li>

          <li>
            <b>4.</b> 완성된 곡을 <b>다운로드</b>해서 아래에 올려요.
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
