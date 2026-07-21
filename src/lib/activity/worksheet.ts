/**
 * 활동지(worksheet) 문항 정의.
 * 인쇄용 활동지와 화면 안내가 이 데이터를 공유한다.
 * 나중에 "가게" 말고 다른 주제로 확장하려면 이 파일만 교체하면 된다.
 */

export interface WorksheetField {
  key: string;
  label: string;
  hint?: string;
  /** lines: 손으로 쓸 줄 수 (인쇄 시 빈 줄), box: 큰 서술 칸 */
  type: 'line' | 'lines' | 'box';
  lines?: number;
}

export interface WorksheetDef {
  title: string;
  intro: string;
  fields: WorksheetField[];
  /** 마지막 프롬프트 초안 칸 안내 */
  promptDraftLabel: string;
  promptDraftHint: string;
}

export const STORE_WORKSHEET: WorksheetDef = {
  title: '나만의 가게 로고송 만들기 — 활동지',
  intro:
    '내가 운영하고 싶은 “가상의 가게”를 상상해 보세요. 아래 칸을 손으로 채운 뒤, 그 내용을 앱에 입력해 로고송을 만들어 봅니다.',
  fields: [
    { key: 'storeName', label: '가게 이름', type: 'line', hint: '부르기 쉽고 기억에 남는 이름' },
    { key: 'category', label: '무엇을 파는 가게인가요? (업종)', type: 'line' },
    { key: 'target', label: '주로 어떤 손님이 오나요?', type: 'line' },
    { key: 'vibe', label: '가게의 분위기는 어떤가요?', type: 'line', hint: '예: 따뜻한, 신나는, 차분한' },
    {
      key: 'concept',
      label: '우리 가게를 소개해 주세요 (컨셉)',
      type: 'box',
      hint: '어떤 가게인지, 왜 이 가게를 만들고 싶은지 자유롭게',
    },
    {
      key: 'features',
      label: '우리 가게만의 특징 3가지',
      type: 'lines',
      lines: 3,
      hint: '다른 가게와 다른 점, 자랑하고 싶은 점',
    },
  ],
  promptDraftLabel: '위 내용을 모아서 로고송 프롬프트 초안 적어보기',
  promptDraftHint:
    '가게 이름 + 분위기 + 장르 + 빠르기를 한 문장으로 이어 보세요. (앱이 더 좋은 프롬프트로 다듬는 법을 알려줄 거예요!)',
};
