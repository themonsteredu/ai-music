'use client';
import { STORE_WORKSHEET, type WorksheetField } from '@/lib/activity/worksheet';

function WriteLines({ n }: { n: number }) {
  return (
    <div className="mt-2 space-y-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="border-b border-dashed border-stone-400" />
      ))}
    </div>
  );
}

function Field({ f }: { f: WorksheetField }) {
  return (
    <div className="print-box rounded-xl border border-stone-300 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <label className="font-bold text-stone-800">{f.label}</label>
        {f.hint && <span className="text-xs text-stone-500">{f.hint}</span>}
      </div>
      {f.type === 'line' && <WriteLines n={1} />}
      {f.type === 'lines' && <WriteLines n={f.lines ?? 3} />}
      {f.type === 'box' && <div className="mt-2 h-24 rounded-lg border border-dashed border-stone-400" />}
    </div>
  );
}

export default function WorksheetPrint() {
  const w = STORE_WORKSHEET;
  return (
    <div className="print-page mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="no-print flex flex-wrap items-center gap-3 rounded-2xl bg-amber-100 p-4">
        <p className="flex-1 text-sm text-stone-700">
          아래 활동지를 <b>인쇄</b>하거나 <b>PDF로 저장</b>해서 학생에게
          나눠주세요. (인쇄 창에서 “PDF로 저장”을 선택하면 파일로 받을 수 있어요)
        </p>
        <button
          onClick={() => window.print()}
          className="rounded-full bg-amber-600 px-5 py-2.5 font-bold text-white shadow hover:bg-amber-700"
        >
          🖨️ 인쇄 / PDF 저장
        </button>
      </div>

      <article className="mx-auto max-w-3xl rounded-2xl border border-stone-300 bg-white p-8">
        <header className="border-b-2 border-stone-800 pb-3">
          <h1 className="font-title text-2xl font-extrabold text-stone-900">{w.title}</h1>
          <p className="mt-2 text-sm text-stone-600">{w.intro}</p>
          <div className="mt-3 flex gap-6 text-sm text-stone-700">
            <span>이름: ____________________</span>
            <span>반: __________</span>
          </div>
        </header>

        <div className="mt-5 grid gap-4">
          {w.fields.map((f) => (
            <Field key={f.key} f={f} />
          ))}

          <div className="print-box rounded-xl border-2 border-amber-500 p-4">
            <div className="flex items-baseline justify-between gap-2">
              <label className="font-bold text-amber-800">
                ⭐ {w.promptDraftLabel}
              </label>
            </div>
            <p className="mt-1 text-xs text-stone-500">{w.promptDraftHint}</p>
            <WriteLines n={3} />
          </div>
        </div>

        <footer className="mt-6 text-center text-xs text-stone-400">
          🎵 로고송 스튜디오 — 활동지를 다 적었다면, 앱에서 “만들기 시작”을 눌러
          보세요!
        </footer>
      </article>
    </div>
  );
}
