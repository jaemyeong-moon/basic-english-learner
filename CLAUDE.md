# basic-english-learner

## 프로젝트 개요
한국인을 위한 기초 영어 동사 학습 웹앱입니다.
make, get, give, have, go, keep, take, let, work 등 기초 동사를 활용한 다양한 표현을 예문을 통해 학습합니다.

## 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **패키지 매니저**: npm

## 팀 구성 (에이전트 역할)
| 역할 | ID | 담당 |
|------|-----|------|
| PM | `pm` | 요구사항 분석, Plans.md 작성, 태스크 관리 |
| 디자이너 | `designer` | UI/UX 설계, 컴포넌트 구조 정의 |
| 개발자 | `developer` | 코드 구현, 기능 개발 |
| QA | `qa` | 코드 검토, 버그 리포트, REVIEW.md 작성 |
| DevOps | `devops` | Docker, CI/CD, 배포 환경 구성 |

## 실행 순서
PM → Designer → Developer → QA → DevOps

## 공통 규칙
1. **한국어 출력**: 모든 문서 및 코멘트는 한국어로 작성
2. **자율 판단**: 모든 판단과 선택은 에이전트가 직접 수행 (사용자에게 질문하지 않음)
3. **.md 파일 기록**: 모든 결과물은 .md 파일로 저장 (Plans.md, REVIEW.md 등)
4. **작업 완료 기록**: 작업 완료 후 반드시 결과 요약을 .md 파일에 기록

## 오케스트레이터 지시사항
- 각 에이전트는 자신의 역할 범위 내에서 자율적으로 판단하고 실행합니다.
- 태스크 상태는 Plans.md에서 일원화하여 관리합니다.
- 태스크 완료 시 Plans.md의 상태를 `DONE`으로 업데이트합니다.
- 에이전트 간 의존성이 있는 태스크는 선행 태스크 완료 후 순차 실행합니다.
- 코드 리뷰 결과는 REVIEW.md에 기록합니다.

## 프로젝트 구조
```
src/
├── app/                  # Next.js App Router 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   ├── page.tsx          # 홈페이지
│   ├── verbs/            # 동사 학습 페이지
│   │   ├── page.tsx      # 동사 목록
│   │   └── [verb]/       # 개별 동사 학습
│   │       └── page.tsx
│   └── quiz/             # 퀴즈 페이지
│       └── page.tsx
├── components/           # 재사용 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── VerbCard.tsx      # 동사 카드
│   ├── ExampleSentence.tsx # 예문 컴포넌트
│   └── QuizQuestion.tsx  # 퀴즈 문제
├── data/                 # 동사 & 예문 데이터
│   └── verbs.ts          # 동사 데이터 (JSON 형태)
├── types/                # TypeScript 타입 정의
│   └── index.ts
└── lib/                  # 유틸리티 함수
    └── utils.ts
```
