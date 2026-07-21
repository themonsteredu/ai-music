import type { MusicKind } from '@/lib/providers/types';

/**
 * 가상 가게 정보 → 로고송/BGM 프롬프트.
 * segments 로 "각 요소를 왜 그렇게 조합했는지"를 함께 반환해
 * PromptGuide 가 교육용으로 그대로 보여줄 수 있게 한다.
 * (클라이언트/서버 공용, 순수 함수)
 */

export type Tempo = 'slow' | 'medium' | 'upbeat';
export type Lang = 'ko' | 'en';

export interface VirtualStore {
  storeName: string;
  category: string; // 업종
  vibe: string; // 분위기
  genre?: string; // 장르
  tempo?: Tempo;
  lengthSec?: number;
  language?: Lang;
  hook?: string; // 후렴에 부를 문구(기본: 가게 이름)
  features?: string; // 활동지에 쓴 특징 서술(자유 텍스트)
}

/** 가이드 UI가 렌더할 "구성요소별 설명" */
export interface PromptSegment {
  label: string; // 예: '훅(후렴)'
  value: string; // 예: '달빛 분식'
  tip: string; // 왜 이렇게 쓰는지
}

export interface BuiltPrompt {
  prompt: string;
  lyrics: string;
  segments: PromptSegment[];
  kind: MusicKind;
}

const TEMPO_KO: Record<Tempo, string> = {
  slow: '느긋한',
  medium: '보통 빠르기의',
  upbeat: '경쾌하고 빠른',
};

const TEMPO_EN: Record<Tempo, string> = {
  slow: 'slow',
  medium: 'mid-tempo',
  upbeat: 'upbeat',
};

function base(store: VirtualStore) {
  return {
    hook: (store.hook?.trim() || store.storeName).trim(),
    tempo: store.tempo ?? 'upbeat',
    genre: store.genre?.trim() || 'pop',
    lengthSec: store.lengthSec ?? 15,
    lang: store.language ?? 'ko',
  };
}

/** 로고송(보컬 징글) 프롬프트 */
export function buildJinglePrompt(store: VirtualStore): BuiltPrompt {
  const { hook, tempo, genre, lengthSec, lang } = base(store);

  const segments: PromptSegment[] = [
    {
      label: '훅(후렴)',
      value: hook,
      tip: '가게 이름을 후렴에서 반복하면 귀에 콕 박혀요. 로고송의 핵심!',
    },
    {
      label: '분위기',
      value: store.vibe,
      tip: '가게의 느낌(따뜻한, 신나는 등)을 정하면 멜로디 색깔이 정해져요.',
    },
    {
      label: '장르',
      value: genre,
      tip: '업종과 손님에 어울리는 장르를 고르면 자연스러워요.',
    },
    {
      label: '빠르기',
      value: TEMPO_KO[tempo],
      tip: '경쾌하면 신나고, 느긋하면 편안해요. 가게 이미지에 맞춰요.',
    },
    {
      label: '길이',
      value: `${lengthSec}초`,
      tip: '로고송은 10~20초가 적당해요. 짧아야 기억에 남아요.',
    },
  ];
  if (store.features?.trim()) {
    segments.push({
      label: '가게 특징',
      value: store.features.trim(),
      tip: '활동지에 적은 특징을 넣으면 우리 가게만의 개성이 살아나요.',
    });
  }

  const featureLine = store.features?.trim()
    ? lang === 'ko'
      ? ` 가게 특징: ${store.features.trim()}.`
      : ` Store features: ${store.features.trim()}.`
    : '';

  const prompt =
    lang === 'ko'
      ? [
          `"${store.storeName}"(${store.category}) 가게의 ${lengthSec}초짜리 ${genre} 로고송을 만들어 주세요.`,
          `분위기는 ${store.vibe}, ${TEMPO_KO[tempo]} 느낌.`,
          `후렴에서 가게 이름 "${hook}"를 또렷하게 노래로 반복해 주세요.`,
          featureLine,
          '깔끔하게 끝나는 기억하기 쉬운 멜로디로. 한국어 보컬.',
        ]
          .filter(Boolean)
          .join(' ')
      : [
          `Create a ${lengthSec}-second ${genre} logo jingle for a store called "${store.storeName}" (${store.category}).`,
          `Mood: ${store.vibe}, ${TEMPO_EN[tempo]}.`,
          `Clearly sing the store name "${hook}" as a repeated, catchy chorus hook.`,
          featureLine,
          'Memorable, radio-ready, ends on a resolved note. Vocals in English.',
        ]
          .filter(Boolean)
          .join(' ');

  // Suno 커스텀 모드의 Lyrics 칸에 바로 넣을 수 있는 짧은 후렴 (학생이 고쳐 써도 됨)
  const lyrics =
    lang === 'ko'
      ? `[후렴]\n${hook}, ${hook}\n${store.storeName} 여기 있어요\n${hook}, 함께 가요!`
      : `[Chorus]\n${hook}, ${hook}\nCome on down to ${store.storeName}\n${hook}, let's go!`;

  return { prompt, lyrics, segments, kind: 'jingle' };
}

/** 매장 배경음악(보컬 없는 인스트루멘털) 프롬프트 */
export function buildBgmPrompt(store: VirtualStore): BuiltPrompt {
  const { tempo, genre, lang } = base(store);
  const bgmLen = store.lengthSec ?? 60;

  const segments: PromptSegment[] = [
    {
      label: '분위기',
      value: store.vibe,
      tip: '매장에 흐를 때 손님이 느낄 기분을 정해요.',
    },
    {
      label: '장르',
      value: genre,
      tip: '업종에 어울리는 장르로 공간의 색을 만들어요.',
    },
    {
      label: '빠르기',
      value: TEMPO_KO[tempo],
      tip: '오래 틀어도 편한 빠르기를 골라요.',
    },
    {
      label: '길이',
      value: `${bgmLen}초`,
      tip: 'BGM은 길게, 반복해도 자연스럽게(loop-friendly).',
    },
  ];

  const prompt =
    lang === 'ko'
      ? `"${store.storeName}"(${store.category}) 매장에서 틀 ${bgmLen}초짜리 ${genre} 배경음악. 분위기는 ${store.vibe}, ${TEMPO_KO[tempo]} 느낌. 보컬 없이 편안하게 반복되는 인스트루멘털.`
      : `A ${bgmLen}-second ${genre} background music track for "${store.storeName}" (${store.category}). Mood: ${store.vibe}, ${TEMPO_EN[tempo]}. Instrumental only, loop-friendly, no vocals.`;

  return { prompt, lyrics: '', segments, kind: 'bgm' };
}

export function buildPrompt(store: VirtualStore, kind: MusicKind): BuiltPrompt {
  return kind === 'bgm' ? buildBgmPrompt(store) : buildJinglePrompt(store);
}
