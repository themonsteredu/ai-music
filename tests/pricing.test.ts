import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  estimateCostUsd,
  usdToKrw,
  EXAMPLE,
} from '../src/lib/pricing.ts';

test('무료 경로는 0원', () => {
  assert.equal(estimateCostUsd('mock', 15), 0);
  assert.equal(estimateCostUsd('linkout-suno', 15), 0);
});

test('ElevenLabs 15초 ≈ $0.0375', () => {
  const c = estimateCostUsd('elevenlabs', 15);
  assert.ok(Math.abs(c - 0.0375) < 1e-9);
});

test('예시: 30명 × 3번 × 15초 ≈ 약 5,000원', () => {
  assert.equal(EXAMPLE.totalSeconds, 30 * 3 * 15);
  // $3.38 근처
  assert.ok(EXAMPLE.costUsd > 3.3 && EXAMPLE.costUsd < 3.5);
  // 약 4,700~4,800원 (5천 원 안팎)
  assert.ok(EXAMPLE.costKrw > 4000 && EXAMPLE.costKrw < 5500);
});

test('usdToKrw 반올림', () => {
  assert.equal(usdToKrw(1), 1400);
});
