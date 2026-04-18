# Plan: Supabase 연동 + 캐싱 아키텍처 적용

작성일: 2026-04-18
사이클: 1 (신규)

---

## 목표

- 하드코딩된 예문 데이터(`src/data/verbs.ts`)를 Supabase PostgreSQL로 이관
- 빌드 타임 정적 생성 + On-Demand Revalidation으로 DB 부하 제로화
- PM이 Supabase Dashboard에서 예문을 대량 추가 가능한 구조 확보
- 기존 localStorage 학습 진도 호환성 유지

## 아키텍처 결정

| 항목 | 결정 | 이유 |
|------|------|------|
| DB | Supabase PostgreSQL | 프로젝트 요구사항 |
| 캐싱 전략 | 빌드 타임 정적 생성 + ISR fallback | DB 부하 0, CDN 서빙, 장애 내성 |
| Revalidation | ISR revalidate: 3600 (1시간) + `/api/revalidate` 엔드포인트 | 무료 티어 호환, PM 수동 갱신 가능 |
| Supabase 클라이언트 | 서버 전용 (service_role key) | 브라우저 노출 없음, RLS 우회 |
| 퀴즈/진도 페이지 | Server/Client 분리 패턴 | 정적 생성 + 클라이언트 인터랙션 공존 |

## 데이터 흐름

```
[빌드 타임]
Supabase → src/lib/data.ts → Server Component → 정적 HTML → Vercel CDN

[사용자 요청]
브라우저 → Vercel CDN → 정적 HTML (DB 접속 0회)

[데이터 갱신]
PM → Supabase Dashboard → POST /api/revalidate → 페이지 재생성
```

## Supabase 스키마

```sql
CREATE TABLE verbs (
  id TEXT PRIMARY KEY,
  verb TEXT NOT NULL,
  meaning TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE examples (
  id TEXT PRIMARY KEY,
  verb_id TEXT NOT NULL REFERENCES verbs(id) ON DELETE CASCADE,
  english TEXT NOT NULL,
  korean TEXT NOT NULL,
  pattern TEXT NOT NULL,
  highlight TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quiz_questions (
  id TEXT PRIMARY KEY,
  verb_id TEXT NOT NULL REFERENCES verbs(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('fill-in-the-blank', 'multiple-choice')),
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  options JSONB,
  hint TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_examples_verb_id ON examples(verb_id);
CREATE INDEX idx_examples_verb_sort ON examples(verb_id, sort_order);
CREATE INDEX idx_quiz_verb_id ON quiz_questions(verb_id);
```

---

## Phase 11: Supabase 연동 (DB 이관 + 캐싱)

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 11.1 | Supabase 스키마 생성 | developer | verbs, examples, quiz_questions 테이블 + 인덱스 생성 SQL | 테이블 생성 완료 | - | TODO |
| 11.2 | Supabase 클라이언트 설정 | developer | `src/lib/supabase/server.ts` + 환경변수 설정 | 클라이언트 연결 성공 | - | TODO |
| 11.3 | 데이터 마이그레이션 스크립트 | developer | `scripts/migrate.ts` — verbs.ts 파싱 → Supabase INSERT | 기존 1013개 예문 + 26개 퀴즈 이관 완료 | 11.1, 11.2 | TODO |
| 11.4 | 데이터 접근 계층 구현 | developer | `src/lib/data.ts` — getAllVerbs(), getVerbWithExamples() 등 (unstable_cache + tags) | 빌드 타임 데이터 fetch 성공 | 11.2 | TODO |
| 11.5 | 페이지 리팩토링 (Server Component) | developer | page.tsx, verbs/page.tsx, verbs/[verb]/page.tsx → async + data.ts 호출 | 정적 생성 + 데이터 표시 정상 | 11.4 | TODO |
| 11.6 | 퀴즈 페이지 Server/Client 분리 | developer | quiz/page.tsx → Server 래퍼 + QuizClient.tsx | 퀴즈 정상 동작 | 11.4 | TODO |
| 11.7 | 진도 페이지 Server/Client 분리 | developer | progress/page.tsx → Server 래퍼 + ProgressClient.tsx | 진도 표시 정상 | 11.4 | TODO |
| 11.8 | utils.ts 리팩토링 | developer | verbs import 제거, 인자 기반 순수 함수로 변경 | import 순환 없음, 기존 기능 유지 | 11.4 | TODO |
| 11.9 | Revalidation API 구현 | developer | `/api/revalidate/route.ts` — secret 검증 + revalidateTag | API 호출 시 캐시 무효화 성공 | 11.4 | TODO |
| 11.10 | 빌드 검증 | qa | 전체 빌드 + 모든 라우트 정상 동작 확인 | next build 성공, 전 페이지 정적 생성 | 11.5~11.9 | TODO |
| 11.11 | verbs.ts 정리 | developer | `src/data/verbs.ts` 삭제, 미사용 import 정리 | 빌드 성공, 데이터 소스 단일화(Supabase) | 11.10 | TODO |

## Phase 12: 대량 예문 투입 (PM 역할)

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 12.1 | 예문 카테고리 확장 설계 | pm | 트렌디한 구문 카테고리 선정 (일상, 비즈니스, SNS, 여행, 감정 등) | 카테고리 목록 확정 | 11.10 | TODO |
| 12.2 | 대량 예문 생성 및 DB 적재 | pm | 카테고리별 예문 생성 → Supabase INSERT (목표: 3000개+) | 예문 3000개 이상 DB 적재 | 12.1 | TODO |
| 12.3 | 퀴즈 문항 확장 | pm | 새 예문 기반 퀴즈 문항 추가 (목표: 100개+) | 퀴즈 100개 이상 DB 적재 | 12.2 | TODO |

## Phase 13: .wiki/ 최신화

| # | Task | 담당 | 내용 | 완료 기준 | Depends | Status |
|---|------|------|------|-----------|---------|--------|
| 13.1 | wiki 갱신 | pm | data-model.md, system-design.md, tech-stack.md, config.md, dependencies.md 최신화 | TODO 항목 제거, 실제 내용 반영 | 11.10 | TODO |

---

## 환경변수

```
SUPABASE_URL=https://gxlnkysojprdqibmkmoi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<Supabase Dashboard에서 확인>
REVALIDATION_SECRET=<랜덤 생성>
```

## 파일 변경 요약

| 파일 | 변경 |
|------|------|
| `src/lib/supabase/server.ts` | 신규 |
| `src/lib/supabase/types.ts` | 신규 |
| `src/lib/data.ts` | 신규 |
| `src/app/api/revalidate/route.ts` | 신규 |
| `src/app/quiz/QuizClient.tsx` | 신규 |
| `src/app/progress/ProgressClient.tsx` | 신규 |
| `scripts/migrate.ts` | 신규 |
| `src/lib/utils.ts` | 수정 |
| `src/app/page.tsx` | 수정 |
| `src/app/verbs/page.tsx` | 수정 |
| `src/app/verbs/[verb]/page.tsx` | 수정 |
| `src/app/quiz/page.tsx` | 수정 |
| `src/app/progress/page.tsx` | 수정 |
| `src/types/index.ts` | 수정 (최소) |
| `src/data/verbs.ts` | 삭제 (최종) |
| `.env.local` | 신규 |
