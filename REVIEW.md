# 코드 리뷰 결과

작성일: 2026-04-13
담당: QA
검토 범위: 서버 기동 검증 (dev 서버 + 프로덕션 빌드)

---

## 리뷰 대상

| 파일 | 역할 |
|------|------|
| `src/types/index.ts` | 타입 정의 |
| `src/data/verbs.ts` | 동사/퀴즈 데이터 |
| `src/lib/utils.ts` | 유틸리티 함수 |
| `src/components/ui/Header.tsx` | 헤더 네비게이션 |
| `src/components/ui/Footer.tsx` | 푸터 |
| `src/components/VerbCard.tsx` | 동사 카드 |
| `src/components/ExampleSentence.tsx` | 예문 표시 |
| `src/components/QuizQuestion.tsx` | 퀴즈 문제 |
| `src/app/layout.tsx` | 루트 레이아웃 |
| `src/app/page.tsx` | 홈페이지 |
| `src/app/verbs/page.tsx` | 동사 목록 |
| `src/app/verbs/[verb]/page.tsx` | 동사 상세 |
| `src/app/quiz/page.tsx` | 퀴즈 페이지 |
| `src/app/error.tsx` | 에러 페이지 |
| `src/app/not-found.tsx` | 404 페이지 |
| `package.json` | 의존성 설정 |
| `next.config.ts` | Next.js 설정 |
| `tsconfig.json` | TypeScript 설정 |

## 리뷰 결과 요약

### 전체 평가: FAIL (서버 기동 불가)

**모든 라우트에서 500 에러 발생. 프로덕션 빌드도 실패.**

---

## 1. 기능 요구사항 충족 여부

| 항목 | 상태 | 비고 |
|------|------|------|
| dev 서버 기동 | FAIL | 서버 시작은 되나 모든 요청에 500 에러 |
| 프로덕션 빌드 | FAIL | `npm run build` 실패 (`<Html>` import 에러) |
| 홈페이지 (`/`) | FAIL | 500 에러 |
| 동사 목록 (`/verbs`) | FAIL | 500 에러 |
| 동사 상세 (`/verbs/make`) | FAIL | 500 에러 |
| 퀴즈 (`/quiz`) | FAIL | 500 에러 |
| ESLint | PASS | 경고/에러 없음 |

## 2. 치명적 버그

### BUG-001: Node.js v25 localStorage 호환성 문제 (CRITICAL)

- **증상**: 모든 라우트에서 `TypeError: localStorage.getItem is not a function` → 500 에러
- **환경**: Node.js v25.9.0
- **원인**: Node.js v25에서 `localStorage`가 글로벌 객체로 노출되지만, `--localstorage-file` 플래그 없이는 `getItem`/`setItem` 등 메서드가 동작하지 않음. Next.js SSR 과정에서 이 글로벌 `localStorage`에 접근 시 충돌 발생
- **소스 코드 책임**: 소스 코드 내에 `localStorage` 직접 호출 없음 — Next.js 프레임워크 또는 의존성 내부에서 발생
- **해결 방안**:
  1. **(권장)** Node.js LTS 버전(v20 또는 v22)으로 다운그레이드
  2. `package.json`에 `engines` 필드 추가: `"engines": { "node": ">=18 <25" }`
  3. 또는 `.nvmrc` 파일로 Node.js 버전 고정: `22`

### BUG-002: 프로덕션 빌드 실패 (CRITICAL)

- **증상**: `npm run build` 시 `<Html> should not be imported outside of pages/_document` 에러
- **원인**: Node.js v25의 localStorage 문제와 연관. 404 페이지 prerender 시 SSR 에러 발생 → 빌드 중단
- **해결 방안**: BUG-001 해결 시 함께 해결될 것으로 예상

## 3. 타입 안전성 및 에러 처리

| 항목 | 상태 | 비고 |
|------|------|------|
| TypeScript strict 모드 | PASS | `tsconfig.json`에 `"strict": true` 설정됨 |
| Props 인터페이스 정의 | PASS | 모든 컴포넌트에 Props 타입 정의됨 |
| Next.js 15 params 비동기 처리 | PASS | `params: Promise<>` 패턴 사용, `await params` 처리 |
| 에러 바운더리 | PASS | `error.tsx`, `not-found.tsx` 구현됨 |
| notFound() 처리 | PASS | `[verb]/page.tsx`에서 존재하지 않는 동사 ID에 대해 `notFound()` 호출 |

## 4. 엣지 케이스 및 잠재적 이슈

### WARN-001: ExampleSentence 정규식 이스케이프 누락

- **파일**: `src/components/ExampleSentence.tsx:9`
- **내용**: `example.highlight` 값을 그대로 `RegExp` 생성자에 전달하고 있음
- **위험**: `highlight` 문자열에 정규식 특수문자(`.`, `(`, `)` 등)가 포함될 경우 예상치 못한 매칭 발생 가능
- **현재 데이터**: `verbs.ts`의 highlight 값에는 특수문자가 없으므로 당장은 문제 없음
- **권장**: 향후 데이터 추가 시 `escapeRegExp` 유틸리티 함수 적용 고려

### WARN-002: 퀴즈 결과 화면 scorePercent NaN 가능성

- **파일**: `src/app/quiz/page.tsx:57-59`
- **내용**: `scorePercent`가 `result.totalQuestions`가 0일 때 `NaN` 반환
- **실제 영향**: `finished`가 `true`일 때만 표시되므로 `totalQuestions`는 최소 1 → 현재 코드에서는 발생하지 않음
- **권장**: 방어적 코드로 `|| 0` 추가 고려

### WARN-003: handleAnswer 의존성 배열에 result 포함

- **파일**: `src/app/quiz/page.tsx:24-48`
- **내용**: `useCallback` 의존성에 `result` 객체가 포함되어 매 답변마다 콜백 재생성
- **영향**: 성능상 큰 문제는 아니나, 불필요한 리렌더링 발생 가능
- **권장**: `useReducer` 패턴으로 전환하면 의존성 단순화 가능

### WARN-004: quizQuestion q16 정답 불명확

- **파일**: `src/data/verbs.ts:159`
- **내용**: `"She ___ the truth from her parents."` — 정답이 `"kept"`인데, 패턴은 `"keep from (숨기다)"`. 객관식 선택지가 `["kept", "kept on", "kept off", "kept up"]`
- **문제**: "kept"은 구동사가 아닌 단순 과거형. 이 퀴즈는 `"kept ... from"` 패턴을 테스트하지만 빈칸이 `"kept"` 자체를 묻고 있어 구동사 학습 목적과 다소 불일치

## 5. 코드 품질 및 아키텍처

| 항목 | 평가 | 비고 |
|------|------|------|
| Server/Client 컴포넌트 분리 | 양호 | `"use client"` 필요한 곳에만 적용 |
| 데이터 구조 | 양호 | 9개 동사 × 6개 예문 = 54개 예문, 26개 퀴즈 문제 |
| SSG 지원 | 양호 | `generateStaticParams` + `generateMetadata` 적절히 활용 |
| Tailwind 스타일링 | 양호 | 다크 모드, 반응형 일관성 있게 적용 |
| 접근성 | 양호 | `lang="ko"`, semantic HTML, `autoFocus` 사용 |
| 코드 중복 | 양호 | 공통 컴포넌트 적절히 분리됨 |

## 6. 개선 권장 사항 (우선순위)

| 우선순위 | 항목 | 설명 |
|----------|------|------|
| P0 | Node.js 버전 고정 | `.nvmrc` 또는 `engines` 필드로 호환 버전 명시 (v20 또는 v22 LTS) |
| P1 | 정규식 이스케이프 | `ExampleSentence.tsx`에서 highlight 값 이스케이프 처리 |
| P2 | 퀴즈 q16 수정 | 구동사 패턴에 맞는 문제로 재설계 |
| P3 | 퀴즈 문제 수 확대 | 현재 26문제 → 40문제 이상으로 확대하여 학습 효과 향상 |

## 결론

코드 품질 자체는 양호하나, **Node.js v25 환경에서 서버가 전혀 기동되지 않는 치명적 문제**가 있습니다. 소스 코드의 결함이 아닌 런타임 호환성 문제이므로, `.nvmrc` 파일을 추가하여 Node.js 22 LTS를 명시하거나, `package.json`의 `engines` 필드에 호환 범위를 지정하는 것이 필수입니다.

Node.js 22 LTS 환경에서 재검증이 필요합니다.

---

# 코드 리뷰 결과 (2차)

작성일: 2026-04-15
담당: harness-review
검토 범위: 전체 소스 코드 (5관점 리뷰)

## 판정: REQUEST_CHANGES

---

## Major Issues（1건）

### MAJOR-001: ESLint 설정에서 `.next/` 빌드 산출물이 제외되지 않음

- **파일**: `eslint.config.mjs`
- **원인**: 이전 config에는 `globalIgnores([".next/**", ...])` 가 명시되어 있었으나, `FlatCompat` 방식으로 전환하면서 삭제됨. `compat.extends("next/core-web-vitals")` 의 `ignorePatterns`는 flat config로 변환되지 않음
- **영향**: `npm run lint` が多数의 에러로 종료됨 → CI 실패
- **수정안**:
  ```js
  const eslintConfig = [
    { ignores: [".next/**", "out/**", "build/**"] },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
  ];
  ```

---

## Minor Issues（3건）

### MINOR-001: `useLocalStorage` — `setValue` 미메모이제이션

- **파일**: `src/lib/useLocalStorage.ts:21-32`
- **내용**: `setValue` 함수가 `useCallback` 없이 정의되어 매 렌더마다 새 함수가 생성됨. `LearningContext`의 `useCallback` 의존 배열에 `setCompletedExampleIds` / `setQuizHistory`가 포함되어 있어 불필요한 재렌더를 유발 가능

### MINOR-002: `LearningContext` — `isHydrated` 미활용

- **파일**: `src/lib/LearningContext.tsx:24,28`
- **내용**: `useLocalStorage`의 제3반환값 `isHydrated`를 무시하고 있음. SSR 초기 렌더링 시 빈 배열로 표시되다가 hydration 후 실제 데이터로 교체되는 플래시 현상이 발생할 수 있음

### MINOR-003: `error.tsx` — `error` 파라미터 미사용

- **파일**: `src/app/error.tsx:3-8`
- **내용**: 타입 선언에 `error: Error & { digest?: string }` 가 있지만 컴포넌트 내부에서 사용되지 않음. `_error`로 리네임하거나 에러 메시지 표시에 활용 권장

---

## Recommendations（2건）

| # | 파일 | 내용 |
|---|------|------|
| 1 | `src/components/ExampleSentence.tsx:18` | `example.highlight`를 RegExp에 직접 사용. 특수문자 포함 시 오동작. `escapeRegExp` 적용 권장 (1차 리뷰 WARN-001과 동일) |
| 2 | `src/app/quiz/page.tsx:12` / `src/app/progress/page.tsx:7` | `formatDate` 함수가 포맷도 다르게 2곳에 중복 정의. `src/lib/utils.ts`로 통합 권장 |

---

## 양호한 항목

- **Security**: XSS/Injection 위험 없음. 외부 링크에 `rel="noopener noreferrer"` 적절히 적용
- **Performance**: `generateStaticParams` 활용으로 정적 생성 최적화, `useCallback` 일관 사용
- **Quality**: TypeScript strict 모드, Props 타입 정의, `notFound()` 처리 모두 양호
- **Accessibility**: `lang="ko"`, `aria-label` 적용, semantic HTML
- **AI Residuals**: TODO/FIXME/localhost/mockData 등 잔재 없음
