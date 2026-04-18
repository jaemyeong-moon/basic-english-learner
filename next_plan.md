# Next Plan: Cycle 3 - Vercel 배포 + UI 확장

작성일: 2026-04-18

---

## 이전 사이클 요약

### Cycle 1 (완료): Supabase 연동 코드 구현
- Supabase 클라이언트, 데이터 계층, 페이지 리팩토링, Revalidation API
- 빌드 타임 정적 생성 + ISR 캐싱 아키텍처

### Cycle 2 (완료): DB 설정 + 대량 예문 투입
- Supabase 스키마 생성 + 마이그레이션 (1013개 → 3000개)
- 신규 동사 10개 추가 (총 20개 동사)
- 퀴즈 126개 (기존 26 + 신규 100)
- 클린 빌드 성공 (29개 정적 페이지)

## 현재 DB 현황
- 동사: 20개
- 예문: 3,000개 (동사당 150개)
- 퀴즈: 126개
- 정적 페이지: 29개

## Cycle 3 목표

### Step 1: Vercel 배포
1. Vercel Dashboard에서 프로젝트 연결
2. 환경변수 3개 설정:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `REVALIDATION_SECRET`
3. 배포 후 전 라우트 확인

### Step 2: UI 개선 (선택)
- 동사 목록 페이지 텍스트 업데이트 ("9개 기초 동사" → "20개 구동사")
- verbs/page.tsx 설명 텍스트 업데이트

### Step 3: .wiki/ 최종 갱신
- service/overview.md 최신화 (20개 동사, 3000개 예문 반영)
- operations/deploy-flow.md 최신화 (Vercel 배포 절차)
