import UsageDashboard from '@/components/UsageDashboard';

export const metadata = { title: '설정 · 요금 — 로고송 스튜디오' };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-800">⚙️ 설정 · 요금</h1>
        <p className="mt-1 text-stone-600">
          API 요금 안내와 날짜별 사용 요금 기록을 볼 수 있어요.
        </p>
      </div>
      <UsageDashboard />
    </div>
  );
}
