import Link from 'next/link';
import HeroVisual from '@/components/HeroVisual';

export default function Home() {
  return (
    <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 py-14 lg:grid-cols-2 lg:gap-8 lg:px-10 lg:py-24">
      {/* 왼쪽: 문구 + 버튼 */}
      <div className="order-1 max-w-xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#766CC2]">
          AI LOGO SONG MAKER
        </p>
        <h1 className="mt-6 text-[2.75rem] font-extrabold leading-[1.15] tracking-tight text-[#172033] sm:text-[3.25rem]">
          우리 가게의 이야기를
          <br />
          <span className="text-[#F1643A]">노래로</span> 만들어요
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[#5b6270]">
          가게 이름과 분위기를 알려주면
          <br />
          우리 가게만의 특별한 로고송이 완성돼요.
        </p>

        <div className="mt-10 flex flex-col items-start gap-5">
          <Link
            href="/create"
            className="rounded-[15px] bg-[#F1643A] px-9 py-4 text-base font-bold text-white transition hover:bg-[#e0562e]"
          >
            로고송 만들기
          </Link>
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#766CC2]"
          >
            반 갤러리 보기
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* 오른쪽: 음악 오브젝트 */}
      <div className="order-2 flex justify-center lg:justify-end">
        <HeroVisual className="w-full max-w-[560px]" />
      </div>
    </div>
  );
}
