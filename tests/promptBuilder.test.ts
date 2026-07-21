import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildJinglePrompt,
  buildBgmPrompt,
  buildPrompt,
} from '../src/lib/jingle/promptBuilder.ts';
import { isClean } from '../src/lib/validation.ts';

const store = {
  storeName: '달빛 분식',
  category: '분식집',
  target: '학생',
  vibe: '따뜻하고 정겨운',
  genre: 'K-pop',
  tempo: 'upbeat' as const,
  lengthSec: 15,
  language: 'ko' as const,
  features: '매일 갓 만든 떡볶이',
};

test('징글 프롬프트에 가게 이름과 핵심 정보가 들어간다', () => {
  const { prompt, lyrics, segments, kind } = buildJinglePrompt(store);
  assert.equal(kind, 'jingle');
  assert.match(prompt, /달빛 분식/);
  assert.match(prompt, /K-pop/);
  assert.match(prompt, /15초/);
  assert.match(lyrics, /달빛 분식/);
  // 가이드용 segments: 훅/분위기/특징 포함
  const labels = segments.map((s) => s.label);
  assert.ok(labels.includes('훅(후렴)'));
  assert.ok(labels.includes('가게 특징'));
});

test('BGM 프롬프트는 보컬 없이 인스트루멘털', () => {
  const { prompt, lyrics, kind } = buildBgmPrompt(store);
  assert.equal(kind, 'bgm');
  assert.equal(lyrics, '');
  assert.match(prompt, /보컬 없이|instrumental|Instrumental/);
});

test('buildPrompt 는 kind 로 분기', () => {
  assert.equal(buildPrompt(store, 'jingle').kind, 'jingle');
  assert.equal(buildPrompt(store, 'bgm').kind, 'bgm');
});

test('영어 옵션이면 영어 보컬 지시가 들어간다', () => {
  const { prompt } = buildJinglePrompt({ ...store, language: 'en' });
  assert.match(prompt, /English/);
});

test('부적절어 필터', () => {
  assert.equal(isClean('맛있는 떡볶이 가게'), true);
  assert.equal(isClean('바보 가게'), false);
});
