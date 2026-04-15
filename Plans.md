# basic-english-learner Plans.md

작성일: 2026-04-11

---

## Phase 1: 프로젝트 기초 설정

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 1.1 | 프로젝트 scaffolding | devops | Next.js + TypeScript + Tailwind 프로젝트 초기화 | 빌드 성공, dev 서버 실행 가능 | - | DONE |
| 1.2 | CLAUDE.md 작성 | pm | 프로젝트 목표, 에이전트 역할, 실행 순서, 공통 규칙 정의 | CLAUDE.md 파일 완성 | - | DONE |
| 1.3 | Plans.md 작성 | pm | 초기 태스크 목록 및 로드맵 작성 | Plans.md 파일 완성 | - | DONE |

## Phase 2: 데이터 설계 및 UI 설계

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 2.1 | 타입 정의 | developer | Verb, Example, Quiz 등 핵심 타입 정의 | `src/types/index.ts` 작성 완료 | 1.1 | DONE |
| 2.2 | 동사 데이터 설계 | developer | 9개 기초 동사(make, get, give, have, go, keep, take, let, work)와 예문 데이터 구조 설계 및 초기 데이터 작성 | `src/data/verbs.ts` 작성 완료, 동사당 최소 5개 예문 | 2.1 | DONE |
| 2.3 | UI/UX 설계 | designer | 페이지 구성, 컴포넌트 구조, 화면 흐름 정의 | DESIGN.md 작성 완료 | 1.2 | DONE |

## Phase 3: 핵심 기능 개발

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 3.1 | 공통 레이아웃 구현 | developer | 루트 레이아웃, 네비게이션, 헤더/푸터 | 페이지 간 네비게이션 동작 | 2.3 | DONE |
| 3.2 | 홈페이지 구현 | developer | 서비스 소개, 동사 목록 카드 표시 | 홈페이지에서 동사 목록 확인 가능 | 3.1 | DONE |
| 3.3 | 동사 목록 페이지 | developer | 9개 동사 카드 그리드, 각 동사별 간단한 설명 표시 | `/verbs` 페이지 렌더링 | 3.1, 2.2 | DONE |
| 3.4 | 동사 상세 학습 페이지 | developer | 선택한 동사의 예문 목록, 한국어 해석, 표현 패턴 표시 | `/verbs/[verb]` 페이지 동작 | 3.3 | DONE |
| 3.5 | 예문 컴포넌트 구현 | developer | 영어 예문 + 한국어 해석 + 핵심 표현 하이라이트 | ExampleSentence 컴포넌트 동작 | 2.2 | DONE |

## Phase 4: 퀴즈 기능

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 4.1 | 퀴즈 로직 구현 | developer | 빈칸 채우기/선택형 퀴즈 로직 | 퀴즈 정답 판정 동작 | 2.2 | DONE |
| 4.2 | 퀴즈 UI 구현 | developer | 퀴즈 페이지 UI, 결과 표시 | `/quiz` 페이지 동작, 점수 표시 | 4.1, 2.3 | DONE |

## Phase 5: 품질 보증 및 배포

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 5.1 | 코드 리뷰 | qa | 전체 코드 리뷰, 버그 리포트 | REVIEW.md 작성 완료 | 3.4, 4.2 | DONE |
| 5.2 | 반응형 디자인 검증 | qa | 모바일/태블릿/데스크톱 대응 확인 | 반응형 이슈 없음 확인 | 5.1 | DONE |
| 5.3 | Docker 설정 | devops | Dockerfile, docker-compose.yml 작성 | `docker compose up`으로 서비스 실행 가능 | 5.1 | DONE |
| 5.4 | CI/CD 설정 | devops | GitHub Actions 워크플로우 작성 | PR 생성 시 자동 빌드/테스트 실행 | 5.3 | DONE |

## Phase 6: 콘텐츠 개선 - 구동사(Phrasal Verb) 중심 학습

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 6.1 | 구동사 데이터 전면 개편 | pm | make out, let off, work off 등 전치사 활용 구동사 중심으로 동사 데이터 및 퀴즈 전면 재설계 | verbs.ts 구동사 데이터 완성, 퀴즈 문항 갱신 | 5.4 | DONE |
| 6.2 | UI 텍스트 업데이트 | developer | 페이지 제목·설명 등을 구동사 학습에 맞게 수정 | 홈·동사목록·상세페이지 텍스트 반영 | 6.1 | DONE |
| 6.3 | 빌드 검증 | qa | 변경 후 빌드 및 기능 정상 동작 확인 | 빌드 성공(NODE_ENV=production), 타입체크 통과, 전 페이지 정적 생성 확인 | 6.2 | DONE |

## Phase 7: 서버 기동 검증 (2026-04-13)

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 7.1 | 서버 기동 검증 | qa | dev 서버 + 프로덕션 빌드 기동 테스트, 전 라우트 응답 확인 | REVIEW.md 작성 완료 | 6.3 | DONE |
| 7.2 | Node.js 호환성 수정 | devops | .nvmrc 추가 또는 engines 필드 설정으로 Node.js 22 LTS 고정 | Node.js 22에서 빌드 성공 + 전 라우트 200 응답 | 7.1 | DONE |
| U.8795 | 예문의 갯수를 늘리자. | developer | U.1615에 통합 | - | U.1615 | DONE |
| U.1615 | 예문의 갯수를 1000개이상으로  | developer | 예문의 갯수를 1000개이상으로 익숙해질만큼 쓰자. (1013개 달성, put 동사 추가) | 총 Example 개수 1000개 이상 | - | DONE |
| U.3130 | 이미지 빌드 및 도커컴포즈 실행 | devops | 현재 도커컴포즈가 실행되어있다면, 지우고 빌드후 재실행 | 컨테이너 실행 + 전 라우트 200 응답 | - | DONE |

## Phase 8: Vercel 배포 환경 구성

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 8.1 | next.config.ts 수정 | developer | `output: "standalone"` 제거 (Vercel 빌드 시스템과 충돌), Vercel 환경 최적화 설정 | Vercel 빌드 성공 | - | DONE |
| 8.2 | vercel.json 작성 | devops | `vercel.json` 추가 — 빌드 명령, 출력 디렉토리, Node.js 버전(22) 지정 | Vercel 프로젝트 연결 후 배포 성공 | 8.1 | TODO |
| 8.3 | 환경변수 가이드 문서화 | devops | `VERCEL_DEPLOY.md` 작성 — Vercel 프로젝트 연결 절차, 환경변수, 커스텀 도메인 설정 가이드 | 문서 작성 완료 | 8.2 | TODO |

## Phase 9: 개인별 학습 진도 관리

> **설계 결정**: 로그인 불필요. localStorage 기반으로 브라우저에 학습 상태 저장 (서버리스 친화적).

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 9.1 | 학습 진도 타입 정의 | developer | `src/types/index.ts`에 `LearningProgress`, `VerbProgress` 타입 추가 (학습한 예문 ID 목록, 퀴즈 점수 히스토리) | 타입 정의 완료 | - | DONE |
| 9.2 | useLocalStorage 훅 구현 | developer | `src/lib/useLocalStorage.ts` — localStorage 읽기/쓰기를 React state와 동기화하는 범용 훅 | 훅 구현 + hydration mismatch 방지 처리 | 9.1 | DONE |
| 9.3 | LearningContext 구현 | developer | `src/lib/LearningContext.tsx` — 예문 완료 마킹, 진도 조회 등 전역 상태 Context + Provider | Context 구현, `src/app/layout.tsx`에 Provider 등록 | 9.2 | DONE |
| 9.4 | 예문 완료 마킹 UI | developer | `ExampleSentence` 컴포넌트를 Client Component로 전환, 체크버튼(완료/미완료 토글) 추가 | 예문 카드에서 완료 체크 가능, 새로고침 후에도 유지 | 9.3 | DONE |
| 9.5 | 동사 목록 진도 표시 | developer | `VerbCard`에 "X / Y 완료" 진도 바 표시 | 동사 목록에서 각 동사의 학습 완료율 확인 가능 | 9.4 | DONE |
| 9.6 | 퀴즈 결과 히스토리 저장 | developer | 퀴즈 완료 시 점수 + 날짜를 localStorage에 누적 저장 | 퀴즈 페이지에 최근 3회 결과 표시 | 9.3 | DONE |
| 9.7 | 학습 현황 페이지 구현 | developer | `src/app/progress/page.tsx` — 전체 학습률, 동사별 진도, 퀴즈 히스토리 대시보드 | `/progress` 페이지 접근 가능, 진도 시각화 | 9.5, 9.6 | DONE |
| 9.8 | 헤더 내비게이션 업데이트 | developer | Header 컴포넌트에 "내 학습" 링크(`/progress`) 추가 | 모든 페이지에서 진도 페이지 접근 가능 | 9.7 | DONE |

## Phase 10: 단어 뜻 보기 / Naver 사전 연동

> **설계 결정**: 예문의 각 단어를 클릭하면 Naver 영어사전 검색 결과를 새 탭에서 열기. 별도 팝업 없이 링크 방식으로 구현(외부 API 의존성 없음, 서버리스 호환).
> **Naver 사전 URL**: `https://dict.naver.com/nsvendict/#/search?query={word}`

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 10.1 | 단어 분리 유틸리티 | developer | `src/lib/utils.ts`에 `tokenizeEnglish(sentence)` 함수 추가 — 구두점 분리, 공백 토큰화 | 함수 구현, 예문을 단어+구두점 토큰 배열로 반환 | - | DONE |
| 10.2 | ClickableWord 컴포넌트 | developer | `src/components/ClickableWord.tsx` — 단어를 클릭하면 Naver 사전으로 이동하는 인라인 컴포넌트 (구두점은 클릭 불가, 하이라이트 단어는 스타일 유지) | 컴포넌트 구현, 단어 클릭 시 새 탭 오픈 | 10.1 | DONE |
| 10.3 | ExampleSentence 단어 클릭 통합 | developer | `ExampleSentence`에서 영어 예문 렌더링 시 `ClickableWord` 사용 (hover 시 밑줄 힌트, 커서 포인터) | 예문의 모든 단어 클릭 가능, Naver 사전 연결 확인 | 10.2, 9.4 | DONE |
