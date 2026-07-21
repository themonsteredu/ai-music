'use client';
import { useEffect, useState } from 'react';
import { fetchUsage, type UsageSummary } from '@/lib/api-client';
import { EXAMPLE, USD_PER_MIN, KRW_PER_USD, usdToKrw } from '@/lib/pricing';

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;

export default function UsageDashboard() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const u = await fetchUsage();
        if (!cancelled) setUsage(u);
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <div className="space-y-6">
      {/* 요금 안내 + 예시 */}
      <section className="rounded-2xl border border-amber-200 bg-white p-6">
        <h2 className="text-lg font-bold text-stone-800">💰 API 요금 안내</h2>
        <p className="mt-2 text-sm text-stone-600">
          <b>체험용(목업)</b>과 <b>무료 웹툴 링크</b>는 <b>요금이 없습니다(0원)</b>. 앱
          안에서 바로 생성하는 <b>ElevenLabs</b>만 요금이 발생해요.
        </p>
        <ul className="mt-3 space-y-1 text-sm text-stone-700">
          <li>• ElevenLabs Music: 분당 <b>${USD_PER_MIN.elevenlabs.toFixed(2)}</b> (약 {won(usdToKrw(USD_PER_MIN.elevenlabs))}/분)</li>
          <li>• 로고송 15초 1곡 ≈ <b>${(USD_PER_MIN.elevenlabs * (15 / 60)).toFixed(3)}</b> (약 {won(usdToKrw(USD_PER_MIN.elevenlabs * (15 / 60)))})</li>
          <li className="text-stone-400">※ 환율 대략 {KRW_PER_USD.toLocaleString('ko-KR')}원/$ 기준</li>
        </ul>

        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-800">📌 예시</p>
          <p className="mt-1 text-sm text-amber-900">
            <b>30명</b> 기준, <b>1명당 3번씩</b> 로고송(15초)을 만들면 →{' '}
            <b>총 약 5,000원</b> 요금 발생
          </p>
          <p className="mt-1 text-xs text-amber-700">
            (계산: 30명 × 3번 × 15초 = {Math.round(EXAMPLE.totalSeconds / 60)}분 × $
            {USD_PER_MIN.elevenlabs.toFixed(2)} ≈ ${EXAMPLE.costUsd.toFixed(2)} ≈ 약{' '}
            {won(EXAMPLE.costKrw)})
          </p>
        </div>

        <p className="mt-4 text-xs text-stone-500">
          앱 안에서 ElevenLabs 생성을 켜려면, 배포 환경변수(또는 <code>.env</code>)에{' '}
          <code>ELEVENLABS_API_KEY</code>를 넣으면 돼요. 키가 없으면 자동으로 “사용
          불가”로 표시되고 요금도 발생하지 않아요.
        </p>
      </section>

      {/* 날짜별 요금 기록 */}
      <section className="rounded-2xl border border-amber-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-stone-800">📅 날짜별 요금 기록</h2>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="ml-auto rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-200"
          >
            🔄 새로고침
          </button>
        </div>

        {usage && (
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span className="rounded-lg bg-stone-100 px-3 py-1.5">
              총 생성 <b>{usage.totalCount}</b>건
            </span>
            <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-emerald-800">
              누적 요금 <b>{won(usage.totalKrw)}</b> (${usage.totalUsd.toFixed(2)})
            </span>
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <p className="py-8 text-center text-stone-400">불러오는 중…</p>
          ) : !usage || usage.days.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-300 py-10 text-center text-sm text-stone-500">
              아직 기록이 없어요. 로고송을 만들면 날짜별로 요금이 기록돼요.
              <br />
              (무료 경로는 0원으로 기록됩니다)
            </div>
          ) : (
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left text-stone-500">
                  <th className="py-2">날짜</th>
                  <th className="py-2 text-right">생성 건수</th>
                  <th className="py-2 text-right">길이(분)</th>
                  <th className="py-2 text-right">요금(USD)</th>
                  <th className="py-2 text-right">요금(원)</th>
                </tr>
              </thead>
              <tbody>
                {usage.days.map((d) => (
                  <tr key={d.day} className="border-b border-stone-100">
                    <td className="py-2 font-medium text-stone-700">{d.day}</td>
                    <td className="py-2 text-right">{d.count}</td>
                    <td className="py-2 text-right">{(d.seconds / 60).toFixed(1)}</td>
                    <td className="py-2 text-right">${d.costUsd.toFixed(2)}</td>
                    <td className="py-2 text-right font-semibold text-stone-800">
                      {won(d.costKrw)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
