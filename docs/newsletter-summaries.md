# Newsletter 요약 자동화

`scripts/generate-newsletter-summaries.js` 스크립트는 `src/data/newsletters.json`에 정의된 링크를 열람해 요약문과 뱃지 필드를 자동으로 채워 줍니다. 기본적으로 `summary`가 비어 있는 항목만 처리하며, 결과는 같은 JSON 파일에 곧바로 반영됩니다.

## 실행 방법

```bash
# 요약이 없는 항목만 처리 (기본)
npm run generate:newsletters

# 실제 파일을 건드리지 않고 확인만
npm run generate:newsletters -- --dry-run --limit 3

# 모든 항목을 강제로 다시 생성
npm run generate:newsletters -- --all
```

### 주요 옵션

| 옵션 | 설명 |
| --- | --- |
| `--dry-run` | 결과를 출력만 하고 파일은 수정하지 않습니다. |
| `--all` | summary 유무와 관계없이 모든 항목을 다시 생성합니다. |
| `--limit <N>` | 앞에서부터 N개 항목만 처리합니다. |
| `--wait <ms>` | 각 요청 사이 대기 시간을 조절합니다. (기본 400ms) |
| `--output <path>` | 수정본을 다른 경로로 내보냅니다. |

## 요약/뱃지 생성 규칙

1. 뉴스레터 HTML에서 `<div class="email-content">` 블록을 읽어 옵니다.
2. `<meta name="description">` → `<meta name="twitter:description">` → 첫 번째 `<p>` → `<title>` 순으로 텍스트를 찾아 최대 140자로 자릅니다.
3. `<h1>`, `<h2>`, `<h3>`, `<strong>`, `<p>` 텍스트에 `특집`, `인터뷰`, `캠페인`, `공지`, `행사` 등 키워드가 포함되어 있으면 `badges` 배열을 채웁니다.

오류나 비어 있는 요약이 발생하면 콘솔에 해당 항목이 표시되므로 편집자가 수동으로 정리한 뒤 다시 실행하면 됩니다. Stibee 구조가 변경되면 선택자(`div.email-content`)만 조정하면 됩니다.

## 자동 실행

`.github/workflows/update-newsletters.yml` 워크플로가 매주 월요일 오전 6시(KST)마다 `npm run generate:newsletters -- --wait 200`을 실행합니다. 변경분이 있을 때만 `chore: update newsletter summaries (auto)` 커밋을 만들고 `main` 브랜치에 푸시합니다. 필요 시 `workflow_dispatch`로 수동 실행도 가능합니다.
