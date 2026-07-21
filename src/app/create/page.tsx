'use client';
import { useMemo, useState } from 'react';
import StudentNameGate from '@/components/StudentNameGate';
import StoreBuilder from '@/components/StoreBuilder';
import PromptGuide from '@/components/PromptGuide';
import ProviderSelect from '@/components/ProviderSelect';
import GenerationProgress from '@/components/GenerationProgress';
import LaunchOutPanel from '@/components/LaunchOutPanel';
import { buildPrompt, type VirtualStore } from '@/lib/jingle/promptBuilder';
import { startGeneration, type TrackDTO } from '@/lib/api-client';
import type { MusicKind } from '@/lib/providers/types';

const EMPTY_STORE: VirtualStore = {
  storeName: '',
  category: '',
  target: '',
  vibe: '',
  genre: '',
  tempo: 'upbeat',
  language: 'ko',
  features: '',
};

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-stone-800">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-sm text-white">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CreatePage() {
  const [studentName, setStudentName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [kind, setKind] = useState<MusicKind>('jingle');
  const [store, setStore] = useState<VirtualStore>(EMPTY_STORE);
  const [dirtyPrompt, setDirtyPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [providerId, setProviderId] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [track, setTrack] = useState<TrackDTO | null>(null);
  const [launchUrl, setLaunchUrl] = useState<string | undefined>();

  const built = useMemo(() => buildPrompt(store, kind), [store, kind]);
  const finalPrompt = dirtyPrompt ? editedPrompt : built.prompt;
  const canSubmit = store.storeName.trim() && store.vibe.trim() && providerId && !submitting;

  function patchStore(patch: Partial<VirtualStore>) {
    setStore((s) => ({ ...s, ...patch }));
  }

  async function onGenerate() {
    if (!providerId) return;
    setSubmitting(true);
    setError(null);
    setTrack(null);
    setLaunchUrl(undefined);
    try {
      const res = await startGeneration({
        providerId,
        kind,
        prompt: finalPrompt,
        lyrics: built.lyrics || undefined,
        title: store.storeName || '로고송',
        storeName: store.storeName || undefined,
        category: store.category || undefined,
        vibe: store.vibe || undefined,
        durationSec: store.lengthSec,
        studentName: studentName.trim() || undefined,
        classCode: classCode.trim() || undefined,
      });
      setTrack(res.track);
      setLaunchUrl(res.launchUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : '생성 요청 실패');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-800">🎤 로고송 만들기</h1>
        <p className="mt-1 text-stone-600">
          활동지에 적은 내 가상 가게를 앱에 옮겨 적고, 로고송을 만들어 봐요.
        </p>
      </div>

      <Section n={1} title="내 이름 적기">
        <StudentNameGate
          studentName={studentName}
          classCode={classCode}
          onChange={(p) => {
            if (p.studentName !== undefined) setStudentName(p.studentName);
            if (p.classCode !== undefined) setClassCode(p.classCode);
          }}
        />
      </Section>

      <Section n={2} title="내 가상 가게 정하기">
        <StoreBuilder
          store={store}
          kind={kind}
          onChange={patchStore}
          onKindChange={setKind}
        />
      </Section>

      <Section n={3} title="프롬프트 배우기">
        <PromptGuide
          built={built}
          editedPrompt={finalPrompt}
          onEditPrompt={(v) => {
            setDirtyPrompt(true);
            setEditedPrompt(v);
          }}
        />
        {dirtyPrompt && (
          <button
            onClick={() => setDirtyPrompt(false)}
            className="mt-2 text-xs font-semibold text-amber-600 hover:underline"
          >
            ↩︎ 가이드가 만든 프롬프트로 되돌리기
          </button>
        )}
      </Section>

      <Section n={4} title="어떻게 만들까요?">
        <ProviderSelect kind={kind} value={providerId} onChange={setProviderId} />
      </Section>

      <div className="sticky bottom-4 z-10">
        <button
          onClick={onGenerate}
          disabled={!canSubmit}
          className="w-full rounded-2xl bg-amber-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {submitting ? '준비 중…' : '🎵 로고송 만들기'}
        </button>
        {!canSubmit && !submitting && (
          <p className="mt-2 text-center text-sm text-stone-500">
            가게 이름·분위기를 적고, 만드는 방법을 골라 주세요.
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {track && (
        <Section n={5} title="결과">
          {track.mode === 'link-out' ? (
            <LaunchOutPanel
              key={track.id}
              track={track}
              launchUrl={launchUrl}
              prompt={finalPrompt}
            />
          ) : (
            <GenerationProgress key={track.id} track={track} />
          )}
        </Section>
      )}
    </div>
  );
}
