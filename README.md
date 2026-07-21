# 🎵 로고송 스튜디오 (AI 로고송 만들기 수업용 웹앱)

학생이 **가상의 가게**를 상상하고, AI 음악 도구를 연결해 **우리 가게만의 로고송(징글)**을
만들어 보는 **수업용** 웹앱입니다. 종이 활동지로 아이디어를 정리하는 아날로그 과정과,
앱에서 프롬프트 쓰는 법을 배우는 디지털 과정을 연결합니다.

> 실제 상업용 도구가 아니라 **교육용**입니다. 무료·저비용, 안전, 개인정보 미수집을 우선합니다.

## 수업 흐름

1. **활동지 인쇄** — 교사가 `/worksheet/print`에서 활동지를 인쇄/ PDF 저장해 배포
2. **손으로 상상** — 학생이 가상 가게의 컨셉·특징을 종이에 직접 작성
3. **프롬프트 배우기** — 적은 내용을 앱에 입력하면, 특징을 어떻게 조합해 좋은
   프롬프트를 쓰는지 안내(가이드)
4. **로고송 생성** — 완성된 프롬프트로 음악을 만들어 반 갤러리에 모음

## 3가지 생성 경로 (하이브리드)

| 경로 | 비용 | 설명 |
| --- | --- | --- |
| 🎈 체험용(mock) | 0원 | 키·비용 없이 전체 흐름 데모 (샘플 음원) |
| 🔗 무료 웹툴(link-out) | 0원 | 무료 툴(Suno 등)에서 만들고 결과 파일만 업로드 |
| ⚡ API 직접 생성 | 유료 | 선생님이 `.env`에 API 키를 넣으면 앱 안에서 바로 생성 |

키가 없으면 API 경로는 자동으로 "사용 불가"로 표시되고, 앱은 mock/무료 링크로 정상 동작합니다.

## 빠른 시작

```bash
npm install
cp .env.example .env        # 기본값(mock)으로 바로 동작
npm run db:migrate          # SQLite DB 생성 (init 마이그레이션)
npm run gen:sample          # 목업용 샘플 음원 생성 (public/samples/mock-jingle.wav)
npm run dev                 # http://localhost:3000
```

### API 키로 앱 내 생성(선택)

`.env`에 키를 넣으면 해당 경로가 활성화됩니다.

```
ELEVENLABS_API_KEY=...      # ElevenLabs Music (상업 이용 가능)
```

## 스크립트

- `npm run dev` / `build` / `start` — Next.js
- `npm run lint` — ESLint
- `npm test` — 프롬프트 빌더·검증 유닛 테스트 (Node 내장 러너)
- `npm run db:migrate` — Prisma 마이그레이션
- `npm run gen:sample` — 목업 샘플 음원 재생성

## 아키텍처

- **Next.js(App Router) 풀스택** — 프론트(React) + Route Handlers(백엔드). 외부 API 키는 서버에만.
- **Provider 추상화** (`src/lib/providers`) — mock / link-out / api 를 하나의 인터페이스로.
  새 툴 연결 = 어댑터 파일 1개 + 레지스트리 한 줄.
- **Prisma + SQLite** (`prisma/schema.prisma`) — 트랙 메타데이터. 학생은 로그인 없이 이름만.
- **저장 드라이버** (`src/lib/storage`) — 개발은 로컬 디스크, 배포 시 Blob로 교체.
- **활동지/프롬프트** (`src/lib/activity`, `src/lib/jingle`) — 활동지 문항·프롬프트 조합 로직.

## 개인정보 안내

로그인이 없으며, 학생은 표시용 이름만 입력합니다. 전화번호·주소 등 민감정보는
입력하지 않도록 UI에서 안내합니다. 생성물과 이름만 반 갤러리에 저장됩니다.
