# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Art Liberation Front (예술해방전선) is a Next.js-based Korean art activism website. This is a cultural/artistic organization's website featuring galleries, albums, activities, and news content.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests (`src/utils/*.test.ts` + `scripts/lib/*.test.js`, node:test via tsx)
- `npm run analyze` - Analyze bundle size with ANALYZE=true
- `npm run build:prod` - Alias of `next build` (kept for older docs; just use `npm run build`)

Before committing, the useful gate is `npm test && npm run lint && npx tsc --noEmit && npm run build`.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router (React 18)
- **Styling**: TailwindCSS 4.x (config lives in `@theme` inside `globals.css`, not a JS config file)
- **Language**: TypeScript with strict mode
- **UI Libraries**: `yet-another-react-lightbox` (gallery), `react-intersection-observer` (infinite scroll)
- **Analytics**: Vercel Analytics (`<Analytics />` in `src/app/layout.tsx`)
- **Email**: Resend (`resend` npm package, `RESEND_API_KEY` in `.env.local`)
- **Scraping/부가**: `cheerio` (newsletter import scripts), `sharp` (image conversion)

There is no Framer Motion, FSLightbox, or React Icons in this project — animations are plain CSS
(`globals.css`) and icons are inline SVG.

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (newsletter, support, activities)
│   ├── error.tsx          # Route-level error boundary
│   ├── global-error.tsx   # Root-layout error boundary
│   └── globals.css        # Global styles + Tailwind @theme
├── components/
│   ├── home/              # Homepage components
│   ├── layout/            # Header, Footer, MobileMenu, NoiseBackground
│   ├── guide/             # Guide table of contents
│   ├── newsletter/        # Newsletter block renderer
│   └── ui/                # Reusable UI components (Card, Button, ...)
├── data/                  # JSON data files + navigation
├── types/                 # Shared types (newsletter)
└── utils/                 # Utility functions (+ colocated *.test.ts)

scripts/
└── lib/                   # Shared script helpers (csv.js + tests)
```

### Key Components
- **Layout**: Header with navigation, Footer, NoiseBackground for texture
- **Home**: HeroSection with Giants-Inline font, LatestActivities
- **Gallery**: `yet-another-react-lightbox` over hundreds of webp images

Navigation is defined once in `src/data/navigation.ts` and consumed by Header, MobileMenu, and Footer.
Do not re-declare link lists inline — that is how `/videos` silently went missing from the footer.

### Fonts & Assets
- `src/fonts/GmarketSansTTFLight.woff2` → body (`--font-sans`), loaded via `next/font/local`
- `src/fonts/SFTTF.woff2` (SF_HambakSnow) → headings (`--font-serif`), via `next/font/local`
- `public/fonts/Giants-Inline.woff2` → hero title, plain `@font-face` in `globals.css`

Only these three font files are kept; unreferenced TTF originals were removed to keep clones and
deployments small. `globals.css` hardcodes next/font's generated class names in `@theme` — if font
loading is changed there, update `--font-sans` / `--font-serif` to match.

- Images: Extensive webp gallery (~1,700 images), converted with Sharp

### Data Management
- Static JSON files in `src/data/` for activities, albums, newsletters, videos
- Gallery alt-texts managed separately in `gallery-alt-texts.json`
- Navigation structure defined in `navigation.ts`

### Performance Optimizations
- Fonts deliberately **not** preloaded (`preload: false`) — LCP measurements showed preloading the
  body fonts competed with the hero. `Giants-Inline` uses `font-display: optional` for the same reason.
  Re-enabling either has regressed LCP before; measure before changing.
- Image optimization with Sharp, WebP everywhere
- Bundle analysis available (`npm run analyze`)
- Custom noise background texture

### Internationalization
- Korean language (ko_KR locale)
- SEO optimized with Korean keywords
- Naver site verification included

## Development Notes

- Path alias `@/*` maps to `./src/*`
- The gallery page reads `public/images/gallery` with `fs.readdirSync` at build time — there is no
  `/api/gallery` route. API routes are only `support` and `activities`.
- Deployed on Vercel as a normal server build. There is **no** static export and no custom image
  loader; `next/image` optimization is on.
- Per-route metadata lives in each route's `layout.tsx`. (`activities` is the one exception — it
  re-exports from `activities/metadata.ts`.)
- TailwindCSS custom colors are declared in the `@theme` block of `globals.css`, which generates the
  `text-primary-red` style utilities. A few hand-written utilities (`btn-revolution`, `text-gradient`,
  `text-gradient-art`, `body.menu-open`) also live there — they are referenced from
  `error.tsx`, `not-found.tsx`, `HeroSection`, `Footer`, and `MobileMenu`, so deleting them silently
  breaks those pages' styling rather than raising an error.
- Rate limiting: `src/utils/rate-limit.ts` caps `/api/support` at 3 requests per IP per hour. It is
  in-memory (per instance), so it is a deterrent, not a hard guarantee. Any new route that sends mail
  should use it too.

## Email System (Resend)

All outbound email uses [Resend](https://resend.com). Requires `RESEND_API_KEY` in `.env.local`. Default sender is `예술해방전선 <noreply@alf.seoul.kr>` and the default organization inbox is `alf.seoul.kr@gmail.com`.

Optional overrides:
- `ALF_EMAIL_FROM` — outbound sender, for example `예술해방전선 <noreply@alf.seoul.kr>`
- `ALF_ORG_INBOX` — organization notification inbox

If either optional override is present but blank, email routes fail closed with a configuration error instead of silently falling back.

Email templates live in `src/app/api/support/emailTemplates.ts` — exports `escapeHtml`, `supporterNotifyEmail`, `supporterWelcomeEmail`.

Routes:
- `POST /api/support` — supporter membership signup (full bank/CMS info); notifies org + sends applicant confirmation

There is no newsletter subscription route. `/api/newsletter` and its `NewsletterSignup` form were both
removed: the form had already been deleted as dead code, leaving an endpoint that anyone could use to
send mail from `noreply@alf.seoul.kr` to arbitrary addresses — a risk to the sending-domain reputation
that the monthly 활동 보고 mailing depends on. To bring subscriptions back, recover the route and the
`welcomeEmail`/`notifyEmail` templates from commit `0996958` and **add a form that actually calls it**.
Note that subscribing never added anyone to `private/members.csv` — it only emailed the org inbox, so
a human still had to copy the address over by hand.

## Supporter Membership System

`/support` page (`src/app/support/`) has a signup form (`SupportForm.tsx`) that collects name, birth date, phone, email, monthly amount, bank account, and CMS consent. On submit it POSTs to `/api/support`, which emails the org with all personal info and sends the applicant a confirmation. **No data is stored on a server** — the org manages its own DB locally.

Validation is shared between client and server via `src/utils/support-validation.ts`, so the form and
the route can never disagree. A hidden `company` honeypot field short-circuits bot submissions.

⚠️ The form does **not** collect 출금일 (withdrawal date) even though `members.csv` has that column,
so CMS registration still needs a follow-up contact with the applicant.

## Private Member DB & Mailing Tool

⚠️ `private/` is in `.gitignore`. This folder contains PII. **Never commit anything from `private/`.**

- `private/members.csv` — UTF-8 BOM CSV, 13 columns: 이름, 이메일, 연락처, 생년월일, 월후원금액, 출금일, 은행, 계좌번호, 예금주, CMS등록상태, CMS등록일, 가입일, 비고. Managed manually (Excel/Numbers/Google Sheets).
- `scripts/build-members-db.js` — **최초 부트스트랩 전용.** Stibee export (`private/stibee-source.csv`)에서
  이름·이메일만 뽑아 `private/members.csv`를 만든다. 나머지 11열은 빈 칸으로 채우므로, 손으로 입력한
  계좌·CMS 정보가 있으면 전부 사라진다. 그래서 출력 파일이 이미 있으면 실행을 거부한다
  (`--force`를 주면 `.bak` 백업 후 진행). 출력 경로는 `private/` 안으로 제한된다 — 그 밖은 `.gitignore`
  보호를 받지 못해 PII가 저장소에 올라갈 수 있다. 신규 구독자는 손으로 추가하는 편이 안전하다.
- `scripts/lib/csv.js` — `build-members-db.js`와 `send-mailing.js`가 함께 쓰는 CSV 파서. 따옴표 안의
  개행·쉼표를 보존한다. 두 스크립트가 같은 파일을 읽으므로 파서를 각자 두면 "DB엔 있는데 발송에서 빠지는"
  회원이 생긴다. 반드시 여기만 고칠 것.

### Monthly Mailing Workflow

After writing a new 활동 보고 (add `src/data/newsletters/{id}.json` + entry in `src/data/newsletters.json`):

```bash
# 1. Preview (no send) — generates private/preview-{id}.html
node scripts/send-mailing.js <id>

# 2. Test send to yourself
node scripts/send-mailing.js <id> --test you@example.com

# 3. Send to all members (prompts "보내기" confirmation)
node scripts/send-mailing.js <id> --send
# or: npm run send:mailing -- <id> --send
```

`scripts/send-mailing.js` renders all newsletter blocks (heading/paragraph/image/link/ledger/video) as branded HTML email, reads recipients from `private/members.csv`, and sends individually via Resend (600ms throttle between sends). Accounting data for `ledger` blocks comes from `src/data/accounting.json`. Duplicate addresses are dropped case-insensitively.

⚠️ 발송에는 재개(resume) 기록이 없다. 중간에 중단하고 다시 `--send`하면 이미 받은 사람에게 또 간다.
중단됐다면 콘솔의 진행 로그를 보고 남은 대상만 따로 처리할 것.

## Newsletter Data Structure

- `src/data/newsletters.json` — metadata array: `{ id, title, publishDate, summary, link, highlights[], thumbnail }`
- `src/data/newsletters/{id}.json` — block array. Block types:
  - `{ type: 'heading', level: 2|3, text }`
  - `{ type: 'paragraph', text }`
  - `{ type: 'image', src, alt }` — `src` is a relative path like `/images/news/{id}/*.webp`
  - `{ type: 'link', text, href }`
  - `{ type: 'ledger', month }` — month key like `"2024-03"`, looked up in `src/data/accounting.json`
  - `{ type: 'video', url, title }` — YouTube 영상 임베드. `url`은 유튜브 전체 URL 또는 단축 URL(`youtu.be/...`)
- `src/data/newsletterContent.ts` — imports all JSONs, exports `newsletterContent` record and `migratedIds`
- `src/data/accounting.json` — keyed by `"YYYY-MM"`, each entry: `{ income[], expense[], totalIncome, totalExpense, net, prevBalance, currentBalance }`

To add a new newsletter to the site: add `{id}.json`, add entry to `newsletters.json`, add import + entry to `newsletterContent.ts`.

### Newsletter Block JSON 서식 (50호 기준, 반드시 준수)

**구조 순서 및 heading level 규칙 — 어기면 안 됨:**

1. **인사말** — heading 없이 paragraph 블록들로 시작. 첫 블록은 `"존경하는 예술해방전선 회원 및 투쟁동지 여러분께"` 단독 단락. 이후 각 단락은 별도 paragraph 블록 (줄바꿈 `\n` 사용 금지, 단락마다 쪼갤 것).
2. **활동 섹션들** — **`level: 2` heading** → image(들) → paragraph(들) → video(있으면) → link(있으면). 섹션 내 소제목이 있을 경우에만 `level: 3` 사용.
3. **회계보고** — **`level: 2` heading** (`"N월 회계보고"`) → ledger 블록 → (선택) `level: 3` 소제목 → 설명 paragraph 2~3개.

**금지 패턴:**
- 인사말에 heading 붙이는 것
- 여러 단락을 `\n`으로 이어붙여 하나의 paragraph 블록으로 만드는 것
- 활동 섹션에 level 3 heading 사용 (53호는 비표준 예외)
- 회계보고에 ledger만 두고 설명 paragraph 생략

**예시 골격:**
```json
[
  { "type": "paragraph", "text": "존경하는 예술해방전선 회원 및 투쟁동지 여러분께" },
  { "type": "paragraph", "text": "계절 인사..." },
  { "type": "paragraph", "text": "활동 예고 및 마무리 인사. 함께 연대하며, 예술해방전선 드림" },

  { "type": "heading", "level": 2, "text": "섹션 제목" },
  { "type": "image", "src": "/images/news/{id}/01.webp", "alt": "설명" },
  { "type": "paragraph", "text": "단락 1" },
  { "type": "paragraph", "text": "단락 2" },
  { "type": "video", "url": "https://youtu.be/...", "title": "영상 제목" },
  { "type": "link", "text": "링크 텍스트", "href": "https://..." },

  { "type": "heading", "level": 2, "text": "N월 회계보고" },
  { "type": "ledger", "month": "YYYY-MM" },
  { "type": "paragraph", "text": "수입 설명..." },
  { "type": "paragraph", "text": "지출 설명..." },
  { "type": "paragraph", "text": "잔액 현황 및 감사 인사." }
]
```

## Full Newsletter Publishing Workflow (Notion → Deploy → Mailing)

When the user provides a Notion page URL for a new 활동 보고:

1. **Read Notion page** — use `mcp__claude_ai_Notion__fetch` to get page content (text blocks + image URLs)
2. **Download & convert images** — Notion image URLs are temporary (S3 signed URLs, expire in ~1h); download and convert immediately:
   ```bash
   node scripts/download-newsletter-images.js <id> <url1> <url2> ...
   # saves to public/images/news/{id}/01.webp, 02.webp, ...
   # prints relative paths for use in block JSON
   ```
3. **Build block JSON** — convert Notion content to `src/data/newsletters/{id}.json` block format (heading/paragraph/image/link/ledger). Enrich text as needed.
4. **Register newsletter** — add entry to `src/data/newsletters.json` (id, title, publishDate, summary, highlights[], thumbnail=first image path). Add import + entry to `src/data/newsletterContent.ts`.
5. **Deploy** — `git add`, commit, push → Vercel deploys automatically.
6. **Send mailing** — `node scripts/send-mailing.js <id> --send`

> 🚨 **5번(배포)을 반드시 6번(발송)보다 먼저 하십시오.** 메일 본문의 `<img>`는
> `https://alf.seoul.kr/images/news/{id}/*.webp` 절대경로를 참조합니다. 배포 전에
> 발송하면 수신자에게 이미지가 깨진 채로 도착합니다(2026-07-27 57호에서 실제 발생 →
> 23명 전원 재발송). 사용자가 "발송해줘"라고 해도 배포 완료 여부를 먼저 확인하세요.
>
> `send-mailing.js`는 `--test`/`--send` 직전에 모든 이미지 URL에 HEAD 요청을 보내
> 200이 아니면 발송을 중단합니다. 이 검사를 우회하지 마십시오.

Image numbering: existing files in `public/images/news/{id}/` are not overwritten; the script continues
from the next number. `--overwrite` **deletes** the existing `NN.webp` files and restarts at 01 — it has
to, otherwise a shorter re-run leaves stale images from the previous run mixed in.

`download-newsletter-images.js` retries each URL up to 3 times with a 30s timeout, but gives up
immediately on 401/403/404 since an expired S3 signature will not recover. If any image fails, it
prints the failed URLs and exits non-zero — do not proceed to step 3 with a partial set.

## Other Scripts

These are one-off or occasional tools, not part of the monthly workflow:

- `scripts/parse-ledger.js` — rebuilt `accounting.json` from `docs/예술해방전선 가계부.xlsx`.
  One-off migration with hardcoded month ranges and manual overrides.
- `scripts/fetch-newsletter.js` — imported old Stibee newsletters (hardcoded to ids 1–47).
  Regenerates `newsletterContent.ts` and `newsletters.json` wholesale on every run.
- `scripts/transform-newsletters.js` — one-off in-place rewrite of newsletter JSONs. **Re-running is
  destructive**; it rewrites every file before its verification pass.
- `scripts/convert-gallery.js` — converts PNG → WebP and **deletes the original**. Since `*.png` is
  gitignored, deleted originals are not recoverable from git.
- `scripts/generate-newsletter-summaries.js` (`npm run generate:newsletters`) — scrapes summaries from
  each entry's `link`. Currently a no-op: every entry has `link: ""`. It preserves existing
  `highlights` and local `/images/...` thumbnails, so it will not clobber curated data.
- `scripts/resize-logo.js` — dead; its output is not referenced anywhere.

## Accounting Data (`src/data/accounting.json`)

Source of truth is `docs/예술해방전선 가계부.xlsx` (one sheet per month, e.g. `2025.11`).
Each entry must satisfy `prevBalance + net === currentBalance`, and consecutive months must chain
(`previous month's currentBalance === this month's prevBalance`).

⚠️ **Known unresolved discrepancy — 2023-09.** August 2023 closed at 127,825원, but September records
`prevBalance: -64,000`, which is August's *net* (`08 차액`), not its closing balance. The Excel has no
`2023.09` sheet, and its `2023.10` sheet already carries the wrong figure forward, so every balance
from 2023-09 on is 191,825원 lower than the arithmetic implies. Resolving this needs the bank
statement: either an unrecorded September outflow exists, or ~34 months of published balances are
understated. **Do not "fix" this by editing numbers** — it changes figures already sent to members.
