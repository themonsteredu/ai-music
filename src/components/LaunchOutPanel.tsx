'use client';
import { useState } from 'react';
import Link from 'next/link';
import { importAudio, type TrackDTO } from '@/lib/api-client';

interface Props {
  track: TrackDTO;
  launchUrl?: string;
  prompt: string;
}

export default function LaunchOutPanel({ track, launchUrl, prompt }: Props) {
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState<TrackDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('복사에 실패했어요. 프롬프트를 직접 선택해 복사해 주세요.');
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

  return (
    <div className="space-y-4 rounded-2xl border border-[#E8E4DE] bg-white p-5">
      <ol className="space-y-3 text-sm text-[#172033]">
        <li>
          <b>1.</b> 아래 프롬프트를 복사해요.
          <div className="mt-2 rounded-lg bg-[#F3EDE4] p-3 text-[#172033]">{prompt}</div>
          <button
            onClick={copy}
            className="mt-2 rounded-full bg-[#F3EDE4] px-4 py-2 text-sm font-semibold text-[#172033] hover:bg-[#E8E4DE]"
          >
            {copied ? '복사됨 ✓' : '📋 프롬프트 복사'}
          </button>
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
                🔗 무료 웹툴 열기
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
  );
}
