'use client';
import type { BuiltPrompt } from '@/lib/jingle/promptBuilder';

interface Props {
  built: BuiltPrompt;
  /** 사용자가 직접 편집한 최종 프롬프트 */
  editedPrompt: string;
  onEditPrompt: (v: string) => void;
}

/**
 * 프롬프트 가이드 — 자동생성 결과를 그냥 주지 않고,
 * "각 특징이 프롬프트의 어느 부분이 되는지 + 왜 그렇게 쓰는지"를 보여준다(교육 목적).
 */
export default function PromptGuide({ built, editedPrompt, onEditPrompt }: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#E8E4DE] bg-[#FAF8F4] p-4">
        <h3 className="text-sm font-bold text-[#172033]">
          💡 좋은 프롬프트는 이렇게 조합해요
        </h3>
        <ul className="mt-3 space-y-2">
          {built.segments.map((s, i) => (
            <li key={i} className="flex flex-col gap-0.5 rounded-lg bg-white p-3 sm:flex-row sm:items-baseline sm:gap-3">
              <span className="shrink-0 rounded-md bg-[#E8E4DE] px-2 py-0.5 text-xs font-bold text-[#172033]">
                {s.label}
              </span>
              <span className="font-semibold text-[#172033]">
                {s.value || <em className="text-[#a8aab0]">아직 안 적음</em>}
              </span>
              <span className="text-sm text-[#8a8f99] sm:ml-auto">{s.tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#172033]">
          ✍️ 완성된 프롬프트 (직접 고쳐도 돼요)
        </label>
        <textarea
          className="mt-1 min-h-28 w-full rounded-lg border border-[#E8E4DE] bg-white px-3 py-2 text-[#172033] focus:border-[#F1643A] focus:outline-none focus:ring-2 focus:ring-[#E8E4DE]"
          value={editedPrompt}
          onChange={(e) => onEditPrompt(e.target.value)}
        />
        <p className="mt-1 text-xs text-[#a8aab0]">
          위 표의 요소들이 이 문장으로 합쳐졌어요. 마음에 안 들면 자유롭게 바꿔
          보세요.
        </p>
      </div>
    </div>
  );
}
