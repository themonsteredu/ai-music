import SettingsControls from '@/components/SettingsControls';
import UsageDashboard from '@/components/UsageDashboard';

export const metadata = { title: '설정 · 요금 — 로고송 스튜디오' };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-6 px-6 py-10 lg:px-10">
      <div>
        <h1 className="text-2xl font-extrabold text-[#172033]">설정 · 요금</h1>
        <p className="mt-1 text-[#5b6270]">
          유료 기능, 활동지, API 요금 기록을 여기서 관리해요.
        </p>
      </div>
      <SettingsControls />
      <UsageDashboard />
    </div>
  );
}
