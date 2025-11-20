# 개선 작업 제안서

아래 항목은 최근 코드리뷰에서 발견된 개선 포인트와 제안하는 해결 방법입니다. 우선순위는 영향도를 기준으로 높음/중간/낮음으로 표기했습니다.

## 1. Videos 페이지 무한스크롤 오류 (높음)
- 위치: `src/app/videos/page.tsx` 47-59라인
- 문제: `setTimeout(() => { ... }` 블록이 닫히지 않아 구문 오류가 발생하고, `npm run lint` 및 `npm run build`가 실패합니다.
- 조치: `setTimeout` 호출을 적절히 닫고 지연 시간을 명시합니다. 예)
  ```ts
  setTimeout(() => {
    // 데이터 슬라이스 로직
  }, 300);
  ```
  이후 ESLint와 빌드를 재실행해 정상 동작을 확인하세요.

## 2. Next.js Export와 API Route 충돌 (높음)
- 위치: `next.config.js` 및 `src/app/api/gallery/route.ts`
- 문제: `output: 'export'` 상태에서는 App Router API Route가 지원되지 않아 `npm run build:prod`가 실패합니다.
- 조치 옵션:
  1. API가 필요 없다면 갤러리 데이터 로딩을 서버/정적 코드에서 처리하고 API Route를 제거합니다.
  2. API를 유지해야 한다면 `output: 'export'` 설정을 해제하거나 Vercel Functions로 이전합니다.

## 3. 중복 폰트 Preload 제거 (중간)
- 위치: `src/app/layout.tsx` 105-127라인
- 문제: `next/font/local`에서 `preload: true`로 설정한 폰트를 `<head>`에서 다시 `rel="preload"`로 로드하며 동일 리소스를 두 번 다운로드합니다.
- 조치: 수동 `<link rel="preload">` 세 개를 제거하거나 `next/font` 옵션에서 `preload: false`로 전환하여 중복을 없애세요.

## 4. Card 컴포넌트 line-clamp 동작 불가 (중간)
- 위치: `src/components/ui/Card.tsx` 70-95라인
- 문제: `className="... line-clamp-${lineClamp} ..."`처럼 동적 클래스를 사용하면 Tailwind 4 JIT가 해당 클래스를 생성하지 않아 줄수 제한이 적용되지 않습니다.
- 조치: 허용된 값 목록을 미리 정의해 클래스 문자열을 정적으로 구성하거나, `style={{ WebkitLineClamp: lineClamp }}` 방식으로 직접 CSS를 적용합니다.

## 5. 내부 링크에서 Next 링크 미사용 (중간)
- 위치: `src/components/ui/Card.tsx` 112-123라인
- 문제: 내부 경로(`href="/activities"` 등)를 `<a>` 태그로 렌더링해 페이지 전체가 새로고침되며 prefetch/접근성 이점을 잃습니다.
- 조치: `href`가 `/`로 시작하면 `next/link`를 사용하도록 분기하거나, 상위에서 `Card`에 `asChild` 패턴을 적용해 라우팅을 위임하세요.

## 6. NewsletterSignup 환경변수 주석 (중간)
- 위치: `src/components/home/NewsletterSignup.tsx` 24-59라인
- 문제: EmailJS Service/Template/Public 키가 코드에 하드코딩돼 있어 회피가 어렵고 노출 위험이 있습니다. (Vercel 환경변수는 이미 등록되어 있다고 파악됨)
- 조치: 주석 처리된 환경변수 로직을 복원하거나 `process.env.NEXT_PUBLIC_*` 값을 읽도록 수정합니다. 필요 시 서버 액션(API Route)으로 분리해 민감한 값 노출을 막습니다.

## 7. 갤러리 라이트박스 디버그 로그 (낮음)
- 위치: `src/app/gallery/GalleryLightbox.tsx` 21-60라인
- 문제: 콘솔 로그와 대량 eager 로딩 설정이 배포 환경에서 불필요한 출력과 초기 다운로드 부담을 만듭니다.
- 조치: 로그를 제거하고 첫 화면 가시 영역의 소수 이미지만 `loading="eager"`로 유지하거나 전부 `lazy`로 전환합니다.

---
각 항목을 수정한 뒤 `npm run lint`와 `npm run build`를 통과시키고, `npm run build:prod`가 필요한 경우 2번 이슈 해결 이후 다시 시도하세요. EmailJS 환경변수는 이미 Vercel에 등록되어 있으므로, 코드에서 해당 변수들을 참조하도록만 조정하면 됩니다.
