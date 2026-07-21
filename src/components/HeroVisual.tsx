/**
 * 메인 화면 오른쪽 비주얼 — 아이보리 원형 음악 오브젝트.
 * 오렌지 중심점 + 오렌지·보라 얇은 음파 + 작은 파형 바. 장식은 이 요소 하나뿐.
 * 순수 SVG (의존성/애니메이션 없음).
 */

const ORANGE = '#F1643A';

function lerpColor(t: number): string {
  const a = [241, 100, 58]; // orange
  const b = [118, 108, 194]; // purple
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function wavePath(width: number, yBase: number, amp: number, wavelength: number, phase: number) {
  const pts = 90;
  let d = '';
  for (let i = 0; i <= pts; i++) {
    const x = (width * i) / pts;
    const env = amp * (0.22 + 0.78 * (1 - x / width)); // 왼쪽이 크고 오른쪽으로 잦아듦
    const y = yBase + env * Math.sin((x / wavelength) * 2 * Math.PI + phase);
    d += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export default function HeroVisual({ className = '' }: { className?: string }) {
  const W = 760;
  const H = 560;
  const cx = 476;
  const cy = 280;

  const N = 26;
  const lines = Array.from({ length: N }, (_, i) => {
    const yBase = cy + (i - (N - 1) / 2) * 3.0;
    return { d: wavePath(W, yBase, 82, 208, 0.55), color: lerpColor(i / (N - 1)) };
  });

  const bars = Array.from({ length: 21 }, (_, i) => {
    const h = 8 + 34 * Math.abs(Math.sin(i * 0.9 + 1.2)) * (0.5 + 0.5 * Math.sin(i * 0.4));
    return { x: cx - 78 + i * 7.4, h: Math.max(6, h) };
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="원형 음악 오브젝트"
    >
      {/* 바닥 그림자 */}
      <ellipse cx={cx} cy={cy + 232} rx="196" ry="26" fill="#000" opacity="0.05" />

      {/* 겹쳐진 아이보리 디스크 (은은한 입체) */}
      <circle cx={cx + 12} cy={cy + 12} r="222" fill="#ECE3D5" />
      <circle cx={cx} cy={cy} r="222" fill="#F6F0E8" />
      <circle cx={cx} cy={cy} r="150" fill="#F0E7DA" />
      <circle cx={cx} cy={cy} r="150" fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2" />

      {/* 오렌지 중심점 */}
      <circle cx={cx} cy={cy} r="60" fill={ORANGE} />
      <circle cx={cx - 14} cy={cy - 16} r="30" fill="#F7855F" opacity="0.55" />

      {/* 오렌지·보라 얇은 음파 */}
      <g fill="none" strokeWidth="1.4" strokeOpacity="0.55">
        {lines.map((l, i) => (
          <path key={i} d={l.d} stroke={l.color} />
        ))}
      </g>

      {/* 작은 파형 바 */}
      <g fill={ORANGE} opacity="0.9">
        {bars.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={cy + 150 - b.h / 2}
            width="3"
            height={b.h}
            rx="1.5"
          />
        ))}
      </g>
    </svg>
  );
}
