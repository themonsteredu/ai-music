'use client';
import { useEffect, useState } from 'react';
import { fetchProviders } from '@/lib/api-client';
import type { MusicKind, ProviderInfo } from '@/lib/providers/types';

interface Props {
  kind: MusicKind;
  value: string | null;
  onChange: (id: string) => void;
}

const MODE_ICON: Record<string, string> = {
  mock: '🎈',
  'link-out': '🔗',
  api: '⚡',
};

export default function ProviderSelect({ kind, value, onChange }: Props) {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);

  useEffect(() => {
    fetchProviders(kind).then(setProviders).catch(() => setProviders([]));
  }, [kind]);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {providers.map((p) => {
        const disabled = !p.available;
        const selected = value === p.id;
        return (
          <button
            key={p.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(p.id)}
            title={p.unavailableReason}
            className={`rounded-2xl border p-4 text-left transition ${
              selected
                ? 'border-amber-500 bg-amber-100'
                : 'border-stone-200 bg-white hover:bg-stone-50'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="text-xl">{MODE_ICON[p.mode] ?? '🎵'}</div>
            <div className="mt-1 font-bold text-stone-800">{p.displayName}</div>
            {p.note && <div className="mt-0.5 text-xs text-stone-500">{p.note}</div>}
            {disabled && p.unavailableReason && (
              <div className="mt-1 text-xs text-rose-500">{p.unavailableReason}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
