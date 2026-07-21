import Link from 'next/link';

const STEPS = [
  {
    n: '1',
    title: '활동지 인쇄',
    body: '선생님이 활동지를 인쇄해 나눠줘요.',
    icon: '🖨️',
    href: '/worksheet/print',
    cta: '활동지 열기',
  },
  {
    n: '2',
    title: '손으로 상상하기',
    body: '내 가상의 가게 이름·특징을 종이에 적어봐요.',
    icon: '✏️',
  },
  {
    n: '3',
    title: '프롬프트 배우기',
    body: '적은 내용을 앱에 넣으면, 좋은 프롬프트 쓰는 법을 알려줘요.',
    icon: '💡',
    href: '/create',
    cta: '만들기 시작',
  },
  {
    n: '4',
    title: '로고송 완성',
    body: '만든 로고송을 반 갤러리에 모아 함께 들어요.',
    icon: '🎧',
    href: '/gallery',
    cta: '반 갤러리',
  },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 p-8 text-center shadow-sm">
        <h1 className="text-3xl font-extrabold text-stone-800 sm:text-4xl">
          나만의 가게 로고송 만들기 🎵
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-stone-600">
          내가 운영하고 싶은 <b>가상의 가게</b>를 상상하고, AI 음악 도구로{' '}
          <b>우리 가게만의 로고송(징글)</b>을 만들어 보는 수업 활동이에요.
          종이 활동지로 아이디어를 정리하고, 앱에서 프롬프트 쓰는 법을 배워요.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/create"
            className="rounded-full bg-amber-600 px-6 py-3 font-bold text-white shadow hover:bg-amber-700"
          >
            🎤 로고송 만들기 시작
          </Link>
          <Link
            href="/worksheet/print"
            className="rounded-full border border-amber-300 bg-white px-6 py-3 font-bold text-amber-700 hover:bg-amber-50"
          >
            🖨️ 활동지 인쇄
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-stone-700">수업 흐름</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col rounded-2xl border border-amber-200 bg-white p-5 shadow-sm"
            >
              <div className="text-3xl">{s.icon}</div>
              <div className="mt-2 text-sm font-semibold text-amber-600">
                STEP {s.n}
              </div>
              <h3 className="text-lg font-bold text-stone-800">{s.title}</h3>
              <p className="mt-1 flex-1 text-sm text-stone-600">{s.body}</p>
              {s.href && (
                <Link
                  href={s.href}
                  className="mt-3 inline-block rounded-full bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-800 hover:bg-amber-200"
                >
                  {s.cta} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-white p-6 text-sm text-stone-600">
        <h2 className="mb-2 text-base font-bold text-stone-700">👩‍🏫 선생님께</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <b>비용 걱정 없이</b> 체험할 수 있어요. 기본은 <b>체험용(목업)</b>과{' '}
            <b>무료 웹툴 링크</b>라서 API 키가 없어도 전체 흐름이 돌아가요.
          </li>
          <li>
            학생은 <b>로그인 없이 이름만</b> 입력해요. 개인정보는 저장하지 않아요.
          </li>
          <li>
            앱 안에서 바로 생성하고 싶으면 <code>.env</code>에 API 키를 넣으면
            돼요(선택).
          </li>
        </ul>
      </section>
    </div>
  );
}
