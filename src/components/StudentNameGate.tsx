'use client';

interface Props {
  studentName: string;
  classCode: string;
  onChange: (patch: { studentName?: string; classCode?: string }) => void;
}

/** 로그인 없이 표시용 이름만 받는다 (개인정보 저장 안 함). */
export default function StudentNameGate({ studentName, classCode, onChange }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-semibold text-stone-700">이름 (또는 별명)</label>
        <input
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          placeholder="예: 민준 (별명도 좋아요)"
          value={studentName}
          maxLength={40}
          onChange={(e) => onChange({ studentName: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-stone-700">
          반 <span className="font-normal text-stone-400">· 선택</span>
        </label>
        <input
          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          placeholder="예: 3반"
          value={classCode}
          maxLength={40}
          onChange={(e) => onChange({ classCode: e.target.value })}
        />
      </div>
      <p className="text-xs text-stone-400 sm:col-span-2">
        ※ 전화번호·주소 같은 개인정보는 적지 마세요. 갤러리에 이름만 보여요.
      </p>
    </div>
  );
}
