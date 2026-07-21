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
  title: '나만의 가게 로고송 만들기 🎵',
  intro:
    '내가 사장님이라면 어떤 가게를 열고 싶나요? 아래를 채우면서 나만의 가게를 상상해 봐요. 다 적으면, 적은 내용으로 우리 가게 로고송을 만들 거예요!',
  fields: [
    { key: 'storeName', label: '① 우리 가게 이름은?', type: 'line', hint: '입에 착 붙는 이름이면 더 좋아요' },
    { key: 'category', label: '② 무엇을 파는 가게예요?', type: 'line', hint: '예: 떡볶이, 책, 꽃, 아이스크림…' },
    { key: 'vibe', label: '③ 우리 가게는 어떤 느낌?', type: 'line', hint: '예: 따뜻한, 신나는, 아늑한' },
    {
      key: 'concept',
      label: '④ 우리 가게를 자랑해 주세요!',
      type: 'box',
      hint: '어떤 가게인지, 왜 오고 싶은지 마음껏 소개해요',
    },
    {
      key: 'features',
      label: '⑤ 우리 가게만의 자랑거리 3가지',
      type: 'lines',
      lines: 3,
      hint: '다른 가게엔 없는, 우리만의 특별한 점',
    },
  ],
  promptDraftLabel: '⑥ 로고송에 꼭 넣고 싶은 말을 한 줄로!',
  promptDraftHint:
    '가게 이름을 넣어서, 어떤 느낌의 노래였으면 좋겠는지 자유롭게 적어 봐요. (앱이 멋진 프롬프트로 다듬는 법을 알려줄 거예요!)',
};
