'use client';
import type { VirtualStore } from '@/lib/jingle/promptBuilder';
import type { MusicKind } from '@/lib/providers/types';
import {
  CATEGORY_OPTIONS,
  GENRE_OPTIONS,
  TARGET_OPTIONS,
  TEMPO_OPTIONS,
  VIBE_OPTIONS,
} from '@/lib/jingle/presets';

interface Props {
  store: VirtualStore;
  kind: MusicKind;
  onChange: (patch: Partial<VirtualStore>) => void;
  onKindChange: (kind: MusicKind) => void;
}

function Labeled({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700">
        {label} {hint && <span className="font-normal text-stone-400">· {hint}</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200';

export default function StoreBuilder({ store, kind, onChange, onKindChange }: Props) {
  return (
    <div className="space-y-5">
      {/* 종류 토글 */}
      <div className="flex gap-2">
        {(
          [
            { k: 'jingle', label: '🎤 로고송 (노래)' },
            { k: 'bgm', label: '🎹 매장 배경음악' },
          ] as const
        ).map(({ k, label }) => (
          <button
            key={k}
            type="button"
            onClick={() => onKindChange(k)}
            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-bold transition ${
              kind === k
                ? 'border-amber-500 bg-amber-100 text-amber-800'
                : 'border-stone-200 bg-white text-stone-500 hover:bg-stone-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Labeled label="가게 이름" hint="기억에 남는 이름">
          <input
            className={inputCls}
            value={store.storeName}
            placeholder="예: 달빛 분식"
            onChange={(e) => onChange({ storeName: e.target.value })}
          />
        </Labeled>

        <Labeled label="업종 (무엇을 파나요)">
          <input
            className={inputCls}
            list="cat-list"
            value={store.category}
            placeholder="예: 분식집"
            onChange={(e) => onChange({ category: e.target.value })}
          />
          <datalist id="cat-list">
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Labeled>

        <Labeled label="주 손님">
          <input
            className={inputCls}
            list="target-list"
            value={store.target ?? ''}
            placeholder="예: 학생"
            onChange={(e) => onChange({ target: e.target.value })}
          />
          <datalist id="target-list">
            {TARGET_OPTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Labeled>

        <Labeled label="분위기">
          <input
            className={inputCls}
            list="vibe-list"
            value={store.vibe}
            placeholder="예: 따뜻하고 정겨운"
            onChange={(e) => onChange({ vibe: e.target.value })}
          />
          <datalist id="vibe-list">
            {VIBE_OPTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Labeled>

        <Labeled label="장르">
          <select
            className={inputCls}
            value={store.genre ?? ''}
            onChange={(e) => onChange({ genre: e.target.value })}
          >
            <option value="">골라주세요</option>
            {GENRE_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Labeled>

        <Labeled label="빠르기">
          <div className="flex gap-2">
            {TEMPO_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => onChange({ tempo: t.value })}
                className={`flex-1 rounded-lg border px-2 py-2 text-sm font-medium ${
                  store.tempo === t.value
                    ? 'border-amber-500 bg-amber-100 text-amber-800'
                    : 'border-stone-200 bg-white text-stone-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Labeled>
      </div>

      <Labeled label="우리 가게만의 특징" hint="활동지에 적은 내용을 옮겨 적어요">
        <textarea
          className={`${inputCls} min-h-20`}
          value={store.features ?? ''}
          placeholder="예: 매일 갓 만든 떡볶이, 학생 할인, 귀여운 캐릭터 컵"
          onChange={(e) => onChange({ features: e.target.value })}
        />
      </Labeled>

      <div className="flex items-center gap-3">
        <Labeled label="언어">
          <select
            className={inputCls}
            value={store.language ?? 'ko'}
            onChange={(e) => onChange({ language: e.target.value as 'ko' | 'en' })}
          >
            <option value="ko">한국어 보컬</option>
            <option value="en">영어 보컬</option>
          </select>
        </Labeled>
        <Labeled label={`길이: ${store.lengthSec ?? (kind === 'bgm' ? 60 : 15)}초`}>
          <input
            type="range"
            min={kind === 'bgm' ? 30 : 10}
            max={kind === 'bgm' ? 120 : 30}
            step={5}
            value={store.lengthSec ?? (kind === 'bgm' ? 60 : 15)}
            onChange={(e) => onChange({ lengthSec: Number(e.target.value) })}
            className="w-40 accent-amber-600"
          />
        </Labeled>
      </div>
    </div>
  );
}
