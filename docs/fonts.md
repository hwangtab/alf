# 폰트 운영 노트

## 사용 중인 폰트

| 용도 | 패밀리 | 파일 | 등록 위치 | 비고 |
| --- | --- | --- | --- | --- |
| 본문 | Gmarket Sans | `src/fonts/GmarketSansTTFLight.woff2` (400), `GmarketSansTTFMedium.woff2` (500), `GmarketSansTTFBold.woff2` (700) | `src/app/layout.tsx`의 `localFont` | 모두 서브셋 (~115~128KB) |
| 제목(h1~h6 기본) | SF_HambakSnow | `src/fonts/SFTTF.subset.woff2` (로딩용), `src/fonts/SFTTF.woff2` (원본) | `src/app/layout.tsx` | ExtraBold 1종, `weight: '400 900'`, 서브셋 ~170KB |
| 히어로/페이지 대제목 | Giants Inline | `public/fonts/Giants-Inline.subset.woff2` (로딩용), `public/fonts/Giants-Inline.woff2` (원본) | `src/app/globals.css` `@font-face` | `font-display: swap`, preload, 서브셋 ~23KB |

홈 첫 방문 기준 폰트 전송량은 약 **428KB**입니다(수정 전 1.65MB).

## next/font 패밀리 이름을 직접 쓰지 말 것

`next/font/local`이 만드는 CSS 패밀리 이름은 개발 서버와 프로덕션 빌드에서 다릅니다.
(개발: `__gmarketSans_a0970f` 같은 해시, 프로덕션: `gmarketSans`)

`globals.css`에서 이름을 하드코딩하면 한쪽 환경에서만 폰트가 적용되고, 나머지 환경에서는
조용히 시스템 폰트로 떨어집니다. 항상 `layout.tsx`가 주입하는 변수를 사용하세요.

```css
--font-sans: var(--font-gmarket-sans), system-ui, ...;
--font-serif: var(--font-sf-hambak), Georgia, serif;
```

변수는 반드시 `<html>`에 붙입니다(`<body>`가 아님). `@theme`이 만든 `--font-sans`는
`:root`(=html)에 선언되는데, 커스텀 프로퍼티 안의 `var()`는 **선언된 요소에서** 치환됩니다.
`--font-gmarket-sans`를 `<body>`에만 두면 `:root`의 `--font-sans`가 무효가 되어
`font-sans` 유틸리티가 통째로 시스템 폰트로 떨어집니다.

## 웨이트

- Gmarket Sans는 Light(400) / Medium(500) / Bold(700)을 실제 파일로 등록했습니다.
  이전에는 Light 하나뿐이라 `font-bold`가 브라우저 합성 볼드로 그려져 모바일에서 뭉개졌습니다.
- SF_HambakSnow와 Giants Inline은 파일이 1종뿐이므로 `font-weight` 범위를 넓게 선언해
  합성 볼드를 막았습니다. 새 굵기가 필요하면 해당 굵기 파일을 추가하고 범위를 좁히세요.

## 서브셋 재생성

모든 웹폰트는 용량 때문에 서브셋입니다.

- **Gmarket Sans / SF Hambak**: 아래 문자의 합집합
  1. `src/` 안의 모든 텍스트 파일에 등장하는 문자
  2. KS X 1001 상용 한글 2,350자
  3. ASCII 출력 가능 문자

  일반적인 한국어 콘텐츠는 모두 커버하지만, 아주 드문 음절(옛한글, 신조어 등)은 시스템 폰트로
  폴백될 수 있습니다. 그런 글을 추가했다면 재생성하세요.

- **Giants Inline**: `.font-giants-inline`이 실제로 렌더하는 문자열만. 빌드 HTML에서 뽑으므로
  **`npm run build`를 먼저** 실행해야 합니다.

```bash
python3 -m pip install --user fonttools brotli   # 최초 1회
npm run build            # Giants 서브셋이 빌드 HTML에서 문자열을 뽑으므로 먼저 실행
npm run subset:fonts     # 전부
npm run subset:fonts -- gmarket  # Gmarket 3웨이트만 (네트워크 필요)
npm run subset:fonts -- sf       # SF Hambak만
npm run subset:fonts -- giants   # Giants만 (빌드 필요)
```

### Giants 서브셋의 동작

Giants는 대제목에만 쓰이고 실제 문자열은 68개(133자)뿐입니다. 서브셋에 없는 글자가 제목에
들어오면 **SF Hambak으로 폴백**되므로 깨지지는 않지만 모양이 달라집니다. 새 대제목을 추가한
뒤에는 `npm run build && npm run subset:fonts -- giants`를 다시 돌리세요.

- 원본 `Giants-Inline.woff2`, `SFTTF.woff2`는 재생성용 소스로만 남겨두며 실제로 로딩되지 않습니다.
- Gmarket Sans 원본은 눈누 미러(`cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1`)에서
  스크립트가 내려받으며 저장소에 커밋하지 않습니다. Gmarket이 무료 배포하는 폰트입니다.

## 폰트가 적용됐는지 확인하는 방법

빌드 후 실제 렌더링에 쓰인 폰트는 Chrome DevTools Protocol로 확인할 수 있습니다.

```js
// CDP: DOM.querySelector → CSS.getPlatformFontsForNode
// h1 → Giants-Inline, h2/h3 → SF_HambakSnow, body/strong → GmarketSansLight/Bold
// isCustomFont: false 인 항목이 glyphCount > 1 이면 서브셋에 빠진 글자가 있다는 뜻
```
