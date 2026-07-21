'use client';
import { useEffect, useState } from 'react';
import { fetchProviders } from '@/lib/api-client';
import type { MusicKind, ProviderInfo } from '@/lib/providers/types';

interface Props {
  kind: MusicKind;
  value: string | null;
  onChange: (id: string) => void;
  /** 유료(API) 옵션 노출 여부 (설정에서 켬) */
  showPaid?: boolean;
}

const MODE_ICON: Record<string, string> = {
  mock: '체험',
  'link-out': '무료',
  api: '유료',
};

// 무료(Suno) → 체험 → 유료 순으로 노출
const ORDER: Record<string, number> = { 'link-out': 0, mock: 1, api: 2 };

export default function ProviderSelect({ kind, value, onChange, showPaid }: Props) {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);

  useEffect(() => {
    fetchProviders(kind).then(setProviders).catch(() => setProviders([]));
  }, [kind]);

  const visible = providers
    .filter((p) => (p.mode === 'api' ? showPaid : true))
    .sort((a, b) => (ORDER[a.mode] ?? 9) - (ORDER[b.mode] ?? 9));

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {visible.map((p) => {
        const disabled = !p.available;
        const selected = value === p.id;
        return (
          <button
            key={p.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(p.id)}
            title={p.unavailableReason}
            className={`rounded-[14px] border p-4 text-left transition ${
              selected
                ? 'border-[#F1643A] bg-[#F1643A]/5'
                : 'border-[#E8E4DE] bg-white hover:border-[#d8d2c8]'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <span className="inline-block rounded-full bg-[#F3EDE4] px-2 py-0.5 text-xs font-semibold text-[#766CC2]">
              {MODE_ICON[p.mode] ?? '음악'}
            </span>
            <div className="mt-2 font-bold text-[#172033]">{p.displayName}</div>
            {p.note && <div className="mt-0.5 text-xs text-stone-500">{p.note}</div>}
            {disabled && p.unavailableReason && (
              <div className="mt-1 text-xs text-[#F1643A]">{p.unavailableReason}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
