import TrackList from '@/components/TrackList';

export const metadata = { title: '반 갤러리 — 로고송 스튜디오' };

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-800">🎧 반 갤러리</h1>
        <p className="mt-1 text-stone-600">
          우리 반이 만든 로고송을 모아 함께 들어봐요.
        </p>
      </div>
      <TrackList />
    </div>
  );
}
