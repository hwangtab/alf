# 웹사이트 성능 및 최적화 코드리뷰

## 핵심 요약
- 정적 데이터 위주의 페이지가 `use client`로 선언돼 불필요한 자바스크립트 번들을 양산하고 있습니다.
- 이미지/폰트 자산 최적화가 비활성화되거나 중복되어 초기 로딩 비용이 상승합니다.
- 시각 효과(노이즈 캔버스, 광범위한 framer-motion 애니메이션)와 외부 SDK(emailjs) 사용이 메인 스레드와 번들 크기를 모두 압박합니다.

## 개선 권장 사항

### 1. 불필요한 Client Component 축소 (높음)
- `src/app/about/page.tsx`, `src/app/activities/page.tsx`, `src/app/albums/page.tsx`, `src/app/news/page.tsx` 등 정적인 콘텐츠 페이지 전반에 `use client`가 선언돼 있습니다. DOM 이벤트가 거의 없으므로 서버 컴포넌트로 전환하고, 꼭 필요한 상호작용 영역만 클라이언트 컴포넌트로 분리하면 JS 전송량과 hydration 비용을 크게 줄일 수 있습니다.

### 2. 이미지 최적화 플래그 재검토 (높음)
- `next.config.js`에서 `images.unoptimized: true`를 사용하고 있어 Next Image 최적화 파이프라인이 완전히 비활성화됩니다. 정적 내보내기가 필요하다면 `next/image` 대신 `<Image priority={false}>` + 사전 변환 WebP 조합을 사용하거나, 가능하다면 `output: 'export'`를 해제해 기본 최적화를 활용하세요. 현재 설정은 큰 hero/galleries 자산을 원본 크기로 그대로 내려보내 LCP에 영향을 줍니다.

### 3. 폰트 로딩 중복 제거 (중간)
- `next/font/local`이 preload 링크를 자동 주입하는데도, `src/app/layout.tsx` `head`에 동일한 `<link rel="preload">`를 수동으로 추가하고 있습니다. 중복 요청으로 네트워크 리소스를 낭비하므로 수동 링크를 제거하고 `next/font` 옵션만 관리하세요.

### 4. ClientNoiseBackground 캔버스 비용 (중간)
- `src/components/layout/NoiseBackground.tsx`는 10fps 애니메이션, 3초 간격 높이 체크, 대량의 ImageData 생성을 수행합니다. 저사양 감지 루틴이 있지만 userAgent 기반이라 한계가 있고, 데스크톱에서도 메인 스레드를 지속적으로 사용합니다. 권장 사항: (1) 해당 배경을 pure CSS 노이즈 텍스처로 대체하거나, (2) Intersection Observer로 viewport에 있을 때만 캔버스를 가동하고, (3) requestAnimationFrame 루프를 `setInterval`/`OffscreenCanvas` 등으로 단순화하세요.

### 5. 갤러리 라이트박스 과도한 eager 로딩 (중간)
- `src/app/gallery/GalleryLightbox.tsx`는 처음 20장의 이미지를 모두 `loading="eager"`로 요청하고, 콘솔 로그까지 남겨 성능과 DX 모두 악화됩니다. 화면에 보이는 그리드만 eager 로딩하고 나머지는 lazy 처리하며, 디버그 로그는 제거하세요.

### 6. 비디오 무한스크롤 및 애니메이션 (중간)
- `src/app/videos/page.tsx`는 모든 렌더마다 `sortedVideos.slice(0, page * 6)`을 반복하고 `setTimeout`으로 로딩을 흉내냅니다. 실제 네트워크 지연이 없으므로 `setTimeout`을 제거하고, 페이지 단위 상태를 `useMemo`에 캐시하거나 react-window 같은 가상 스크롤을 도입하면 불필요한 계산과 Paint를 줄일 수 있습니다.

### 7. EmailJS SDK 번들 영향 (낮음)
- `src/components/home/NewsletterSignup.tsx`는 EmailJS 브라우저 SDK를 직접 import하여 초기 렌더에 포함합니다. 약 70KB 이상의 JS가 홈 Hero 바로 아래에 추가되므로, 이 폼을 동적 import하거나 서버 액션/API Route 로직으로 옮기면 LCP를 방해하지 않습니다.

### 8. Framer Motion 기본값 절약 (낮음)
- 헤더, HeroSection, LatestActivities, Footer 등 거의 모든 섹션에서 framer-motion이 기본 애니메이션을 담당합니다. 동일한 easing/transition을 CSS keyframe으로 대체하거나, 반복되는 motion variant를 공유 Hook으로 통합해 중복 애니메이션 객체 인스턴스를 줄이면 번들 크기를 약간 더 줄일 수 있습니다.

---
위 항목을 처리한 뒤 Lighthouse 및 WebPageTest로 Hero/Home, Gallery, Guide 페이지 각각을 측정해 LCP, CLS, JS payload 개선폭을 확인하세요. 필요하다면 Vercel Analytics의 Web Vitals 탭에서 before/after를 비교해 회귀 여부를 모니터링하면 좋습니다.
