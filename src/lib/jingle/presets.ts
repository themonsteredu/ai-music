import type { Tempo } from './promptBuilder';

/** UI 드롭다운 옵션 (StoreBuilder / PromptGuide 공용) */

export const CATEGORY_OPTIONS = [
  '분식집',
  '카페',
  '서점',
  '꽃집',
  '문구점',
  '빵집',
  '아이스크림 가게',
  '옷가게',
  '반려동물 용품점',
  '떡볶이집',
];

export const VIBE_OPTIONS = [
  '따뜻하고 정겨운',
  '신나고 밝은',
  '차분하고 편안한',
  '귀엽고 발랄한',
  '세련되고 트렌디한',
  '레트로 감성의',
];

export const GENRE_OPTIONS = [
  'K-pop',
  '어쿠스틱',
  '재즈',
  '동요풍',
  '일렉트로닉',
  '발라드',
  '트로트',
];

export const TEMPO_OPTIONS: { value: Tempo; label: string }[] = [
  { value: 'slow', label: '느긋하게' },
  { value: 'medium', label: '보통' },
  { value: 'upbeat', label: '경쾌하게' },
];
