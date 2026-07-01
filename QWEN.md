# QWEN.md — 예술해방전선 (Art Liberation Front) 웹사이트

## 프로젝트 개요

예술해방전선(ALF)의 공식 웹사이트입니다. 예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대하는 사회운동 단체의 정보 전달, 활동 기록, 뉴스레터 배포를 목적으로 합니다.

## 기술 스택

- **Framework:** Next.js 14.x (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + `@tailwindcss/postcss`
- **Animations:** framer-motion
- **Lightbox:** yet-another-react-lightbox, fslightbox-react
- **Fonts:** GmarketSans (sans), SF Hambak (serif) — `next/font/local`
- **Analytics:** @vercel/analytics
- **Email:** Resend (뉴스레터 발송)
- **Image Processing:** sharp (갤러리 WebP 변환)
- **Web Scraping:** cheerio (뉴스레터 이미지 다운로드)
- **Deploy:** Vercel (`https://alf.seoul.kr`)

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router 페이지
│   ├── about/        # 단체 소개
│   ├── activities/   # 활동 기록
│   ├── albums/       # 앨범
│   ├── api/          # API routes (뉴스레터 발송 등)
│   ├── gallery/      # 갤러리
│   ├── guide/        # 가이드
│   ├── news/         # 뉴스
│   ├── support/      # 후원
│   ├── videos/       # 동영상
│   ├── globals.css   # Tailwind @theme, 폰트 토큰, 레이아웃 리셋
│   ├── layout.tsx    # 루트 레이아웃 (Header/Footer, 구조화 데이터)
│   ├── page.tsx      # 홈페이지
│   ├── robots.ts     # 동적 robots.txt
│   └── sitemap.ts    # 동적 sitemap.xml
├── components/       # 재사용 UI 컴포넌트
│   ├── home/         # 홈페이지 섹션 (HeroSection, LatestActivities)
│   ├── layout/       # Header, Footer, NoiseBackground
│   └── ui/           # 원자 UI 컴포넌트
├── data/             # 정적 JSON 데이터
│   ├── activities.json
│   ├── albums.json
│   ├── accounting.json
│   ├── gallery-alt-texts.json
│   ├── newsletters.json
│   ├── videos.json
│   ├── navigation.ts
│   ├── newsletterContent.ts
│   └── newsletters/  # 뉴스레터별 데이터
├── fonts/            # 커스텀 TTF 폰트 (GmarketSans, SF Hambak)
├── types/            # TypeScript 타입 정의
└── utils/            # 헬퍼 함수 (구조화 데이터 생성 등)

scripts/              # Node.js 자동화 스크립트
├── convert-gallery.js          # PNG → WebP 변환
├── download-newsletter-images.js # 뉴스레터 이미지 다운로드
├── fetch-newsletter.js         # 스티비 뉴스레터 페칭
├── generate-newsletter-summaries.js # 뉴스레터 요약 생성
├── send-mailing.js             # Resend로 뉴스레터 발송
├── parse-ledger.js             # 회계 장부 파싱
├── resize-logo.js              # 로고 리사이즈
└── transform-newsletters.js    # 뉴스레터 데이터 변환
```

## Build, Run, Dev Commands

```bash
npm run dev              # 개발 서버 (http://localhost:3000)
npm run build            # 프로덕션 빌드 — PR 전 필수
npm run start            # 빌드 결과 서빙 (스테이징 스모크 테스트)
npm run lint             # ESLint 검사 — 클린이어야 함
npm run analyze          # 라운드 단위 번들 크기 시각화
npm run build:prod       # 프로덕션 빌드 (next export 포함)
npm run convert:gallery  # public/images/gallery/*.png → .webp 변환
npm run generate:newsletters # 뉴스레터 요약 생성
npm run send:mailing     # 뉴스레터 이메일 발송
npm run download:news-images # 뉴스레터 이미지 다운로드
```

## Coding Conventions

- **인덴트:** 2-space
- **컴포넌트:** 함수형 컴포넌트 + early return 패턴 선호
- **파일 네이밍:**
  - 컴포넌트: PascalCase (`LatestActivities.tsx`)
  - 훅/유틸리티: camelCase
  - 라우트 폴더: kebab-case
- **스타일:** Tailwind 유틸리티 클래스 inline in JSX; `globals.css`는 토큰/레이아웃 리셋 전용
- **임포트:** `@/*` alias 사용 (`@/components/...`, `@/data/...`)
- **TypeScript:** strict mode, `noEmit`, `isolatedModules`
- **ESLint:** `next/core-web-vitals` + `next/typescript` 확장, scripts 폴더는 commonjs
- **Tailwind v4:** `@theme` 블록에서 커스텀 폰트/색상 토큰 정의; `--color-*`, `--font-*` 변수 기반 유틸 클래스

## 데이터 관리

- 정적 데이터(JSON)는 `src/data/`에 관리. 활동, 앨범, 영상, 회계, 뉴스레터 등
- 갤러리 이미지: `public/images/gallery/` — WebP 포맷 기준, 변환 스크립트로 관리
- 뉴스레터: 스티비에서 페칭 → 이미지 다운로드 → 요약 생성 → Resend 발송 파이프라인

## 이미지 설정

- `next.config.js`에서 `images.unoptimized: true` (정적 호스팅 호환)
- SVG 허용 (`dangerouslyAllowSVG: true`)
- 원격 패턴: `img.youtube.com`, `img.stibee.com`, `img2.stibee.com`

## 테스트

자동화된 테스트는 현재 미구입. 비자명한 상태 로직 추가 시 React Testing Library 스펙을 컴포넌트 옆에 `ComponentName.test.tsx`로 추가 권장.

## Commit / PR 규칙

- Conventional commits: `feat:`, `fix:`, `chore:` 접두사 + 짧은 명령법 제목
- 무관한 작업은 별도 커밋 분리
- PR: 요약, 시각 변경 시 스크린샷, 관련 이슈 링크, `npm run build` + `npm run lint` 결과 명시
