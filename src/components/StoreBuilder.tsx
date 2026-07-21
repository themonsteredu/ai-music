'use client';
import { suggestJingleLyrics, type VirtualStore } from '@/lib/jingle/promptBuilder';
import type { MusicKind } from '@/lib/providers/types';
import {
  CATEGORY_OPTIONS,
  GENRE_OPTIONS,
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
      <label className="block text-sm font-semibold text-[#172033]">
        {label} {hint && <span className="font-normal text-[#a8aab0]">· {hint}</span>}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** 여러 개 중 하나를 토글로 선택 */
function ToggleGroup<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { value: T; label: string }[];
  value: T | undefined;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSelect(o.value)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            value === o.value
              ? 'border-[#F1643A] bg-[#F3EDE4] text-[#172033]'
              : 'border-[#E8E4DE] bg-white text-[#8a8f99] hover:bg-[#FAF8F4]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-[#E8E4DE] bg-white px-3 py-2 text-[#172033] focus:border-[#F1643A] focus:outline-none focus:ring-2 focus:ring-[#E8E4DE]';

export default function StoreBuilder({ store, kind, onChange, onKindChange }: Props) {
  const vibeOpts = VIBE_OPTIONS.map((v) => ({ value: v, label: v }));
  const genreOpts = GENRE_OPTIONS.map((g) => ({ value: g, label: g }));

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
                ? 'border-[#F1643A] bg-[#F3EDE4] text-[#172033]'
                : 'border-[#E8E4DE] bg-white text-[#8a8f99] hover:bg-[#FAF8F4]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 이름 · 업종 (직접 입력) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Labeled label="가게 이름" hint="기억에 남는 이름">
          <input
            className={inputCls}
            value={store.storeName}
            placeholder="예: 달빛 분식"
            onChange={(e) => onChange({ storeName: e.target.value })}
          />
        </Labeled>

        <Labeled label="무엇을 파는 가게예요?">
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
      </div>

      {/* 분위기 · 장르 · 빠르기 (토글 선택) */}
      <Labeled label="분위기" hint="하나 골라요">
        <ToggleGroup
          options={vibeOpts}
          value={store.vibe || undefined}
          onSelect={(v) => onChange({ vibe: v })}
        />
      </Labeled>

      <Labeled label="장르" hint="하나 골라요">
        <ToggleGroup
          options={genreOpts}
          value={store.genre || undefined}
          onSelect={(v) => onChange({ genre: v })}
        />
      </Labeled>

      <Labeled label="빠르기">
        <ToggleGroup
          options={TEMPO_OPTIONS}
          value={store.tempo}
          onSelect={(v) => onChange({ tempo: v })}
        />
      </Labeled>

      {/* 특징 (직접 입력) */}
      <Labeled label="우리 가게만의 자랑거리" hint="활동지에 적은 내용을 옮겨 적어요">
        <textarea
          className={`${inputCls} min-h-20`}
          value={store.features ?? ''}
          placeholder="예: 매일 갓 만든 떡볶이, 귀여운 캐릭터 컵, 친절한 사장님"
          onChange={(e) => onChange({ features: e.target.value })}
        />
      </Labeled>

      {/* 가사 직접 쓰기 (로고송일 때만) */}
      {kind === 'jingle' && (
        <Labeled label="우리 로고송 가사 (직접 써봐요)" hint="가게 이름을 넣어 신나게!">
          <textarea
            className={`${inputCls} min-h-28 whitespace-pre-line`}
            value={store.lyrics ?? ''}
            placeholder={'예)\n[후렴]\n달빛 분식, 달빛 분식\n달빛 분식 여기 있어요!'}
            onChange={(e) => onChange({ lyrics: e.target.value })}
          />
          <button
            type="button"
            onClick={() => onChange({ lyrics: suggestJingleLyrics(store) })}
            className="mt-2 rounded-full bg-[#F3EDE4] px-3 py-1.5 text-xs font-semibold text-[#172033] hover:bg-[#E8E4DE]"
          >
            ✨ 예시로 채우기 (그다음 자유롭게 고쳐요)
          </button>
        </Labeled>
      )}

      {/* 언어 (토글) · 길이는 15초 고정 */}
      <div className="flex flex-wrap items-end gap-6">
        <Labeled label="노래 언어">
          <ToggleGroup
            options={[
              { value: 'ko', label: '한국어' },
              { value: 'en', label: '영어' },
            ]}
            value={store.language ?? 'ko'}
            onSelect={(v) => onChange({ language: v })}
          />
        </Labeled>
        <div className="text-sm text-[#8a8f99]">
          길이 <span className="font-semibold text-[#172033]">15초</span> (로고송에 딱 좋아요)
        </div>
      </div>
    </div>
  );
}
