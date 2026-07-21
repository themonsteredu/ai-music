import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '로고송 스튜디오 — 나만의 가게 로고송 만들기',
  description: '가상의 가게를 상상하고, AI로 나만의 로고송을 만들어 보는 수업용 웹앱',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-amber-50 text-stone-800">
        <header className="no-print border-b border-amber-200 bg-white/70 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
            <Link href="/" className="text-lg font-bold text-amber-700">
              🎵 로고송 스튜디오
            </Link>
            <div className="ml-auto flex items-center gap-3 text-sm font-medium">
              <Link href="/create" className="rounded-full px-3 py-1.5 hover:bg-amber-100">
                만들기
              </Link>
              <Link href="/gallery" className="rounded-full px-3 py-1.5 hover:bg-amber-100">
                반 갤러리
              </Link>
              <Link
                href="/worksheet/print"
                className="rounded-full px-3 py-1.5 hover:bg-amber-100"
              >
                활동지
              </Link>
              <Link href="/settings" className="rounded-full px-3 py-1.5 hover:bg-amber-100">
                설정
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
