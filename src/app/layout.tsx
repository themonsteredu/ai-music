import type { Metadata } from 'next';
import { Do_Hyeon } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

// 도현체(Do Hyeon) — next/font로 빌드 시 자체 호스팅 (오프라인·배포 모두 동작)
const doHyeon = Do_Hyeon({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dohyeon',
});

export const metadata: Metadata = {
  title: '로고송 스튜디오 — 우리 가게의 이야기를 노래로',
  description:
    '가게 이름과 분위기를 알려주면 우리 가게만의 특별한 로고송이 완성되는 교육용 AI 창작 서비스',
};

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
        <path
          d="M11 6.2 20 4.4v10.3"
          stroke="#766CC2"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8.4" cy="17.4" r="3.1" fill="#766CC2" />
        <circle cx="18" cy="16.4" r="3.1" fill="#F1643A" />
      </svg>
      <span className="whitespace-nowrap text-base font-bold tracking-tight text-[#172033] sm:text-[17px]">
        로고송 스튜디오
      </span>
    </span>
  );
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.2" stroke="#172033" strokeWidth="1.7" />
      <path
        d="M12 2.8v2.4M12 18.8v2.4M4.3 7.5l2 1.2M17.7 15.3l2 1.2M4.3 16.5l2-1.2M17.7 8.7l2-1.2"
        stroke="#172033"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`h-full ${doHyeon.variable}`}>
      <body className="min-h-full flex flex-col">
        <header className="no-print border-b border-[#E8E4DE]">
          <nav className="mx-auto flex max-w-[1280px] items-center px-4 py-4 sm:px-6 lg:px-10 lg:py-5">
            <Link href="/" aria-label="홈">
              <Logo />
            </Link>
            <div className="ml-auto flex items-center gap-4 text-sm font-medium text-[#172033] sm:gap-7 sm:text-[15px]">
              <Link href="/create" className="whitespace-nowrap hover:text-[#F1643A]">
                만들기
              </Link>
              <Link href="/gallery" className="whitespace-nowrap hover:text-[#F1643A]">
                반 갤러리
              </Link>
              <Link
                href="/settings"
                aria-label="설정"
                className="opacity-80 transition hover:opacity-100"
              >
                <GearIcon />
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
