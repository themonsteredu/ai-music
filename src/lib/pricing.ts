/**
 * API 요금 산정용 상수 & 계산 (클라이언트/서버 공용).
 * 무료 경로(mock, linkout)는 0원. 유료 API(ElevenLabs 등)만 과금.
 */

/** 제공자별 분당 단가(USD) */
export const USD_PER_MIN: Record<string, number> = {
  elevenlabs: 0.15, // ElevenLabs Music: $0.15 / 분
  'suno-api': 0.15, // (Phase 2 예정) 대략치
};

/** USD → KRW 환산 (대략치, 필요 시 조정) */
export const KRW_PER_USD = 1400;

/** 생성 1건의 예상 요금(USD). 무료 경로는 0 */
export function estimateCostUsd(providerId: string, seconds: number): number {
  const perMin = USD_PER_MIN[providerId];
  if (!perMin) return 0;
  return (seconds / 60) * perMin;
}

export function usdToKrw(usd: number): number {
  return Math.round(usd * KRW_PER_USD);
}

/** 예시 계산: 30명 × 1인당 3번, 로고송 15초 기준 */
export const EXAMPLE = {
  students: 30,
  perStudent: 3,
  secondsEach: 15,
  get totalSeconds() {
    return this.students * this.perStudent * this.secondsEach;
  },
  get costUsd() {
    return estimateCostUsd('elevenlabs', this.totalSeconds);
  },
  get costKrw() {
    return usdToKrw(this.costUsd);
  },
};
