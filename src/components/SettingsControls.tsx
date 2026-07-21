'use client';
import Link from 'next/link';
import { usePaidEnabled } from '@/lib/usePaidEnabled';

export default function SettingsControls() {
  const [paid, setPaid] = usePaidEnabled();

  return (
    <div className="space-y-6">
      {/* 유료 기능 토글 */}
      <section className="rounded-2xl border border-[#E8E4DE] bg-white p-6">
        <h2 className="font-title text-lg font-bold text-[#172033]">유료 기능 (ElevenLabs)</h2>
        <p className="mt-2 text-sm text-[#5b6270]">
          평소에는 <b>무료 Suno</b>로 만들어요. Suno 계정 오류 등으로 만들기가 안 될
          때, 아래를 켜면 <b>앱 안에서 바로 생성되는 유료 기능(ElevenLabs)</b>이 만들기
          화면에 나타나요.
        </p>

        <label className="mt-4 flex cursor-pointer items-center gap-3">
          <span className="text-sm font-semibold text-[#172033]">유료 기능 사용</span>
          <button
            type="button"
            role="switch"
            aria-checked={paid}
            onClick={() => setPaid(!paid)}
            className={`relative h-7 w-12 rounded-full transition ${
              paid ? 'bg-[#F1643A]' : 'bg-[#E8E4DE]'
            }`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                paid ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
          <span className="text-sm text-stone-500">{paid ? '켜짐' : '꺼짐'}</span>
        </label>

        <p className="mt-3 text-xs text-stone-500">
          ※ 실제 생성이 되려면 배포 환경변수(또는 <code>.env</code>)에{' '}
          <code>ELEVENLABS_API_KEY</code>가 필요해요. 키가 없으면 “선생님 키 필요”로
          표시되고 요금은 발생하지 않아요. 예상 요금은 아래에서 확인하세요.
        </p>
      </section>

      {/* 활동지 (설정 안에서만 접근) */}
      <section className="rounded-2xl border border-[#E8E4DE] bg-white p-6">
        <h2 className="font-title text-lg font-bold text-[#172033]">수업 활동지</h2>
        <p className="mt-2 text-sm text-[#5b6270]">
          학생이 가상 가게를 손으로 정리하는 인쇄용 활동지예요. 열어서 인쇄하거나 PDF로
          저장해 나눠줄 수 있어요.
        </p>
        <Link
          href="/worksheet/print"
          className="mt-4 inline-block rounded-[14px] border border-[#E8E4DE] bg-white px-5 py-2.5 text-sm font-semibold text-[#172033] transition hover:border-[#d8d2c8]"
        >
          활동지 열기
        </Link>
      </section>
    </div>
  );
}
