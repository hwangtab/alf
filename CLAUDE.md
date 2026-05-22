# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Art Liberation Front (예술해방전선) is a Next.js-based Korean art activism website. This is a cultural/artistic organization's website featuring galleries, albums, activities, and news content.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production 
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run analyze` - Analyze bundle size with ANALYZE=true
- `npm run build:prod` - Build and export for static hosting (Note: This command will fail as `next export` is deprecated - use `npm run build` instead)

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS 4.x 
- **Language**: TypeScript with strict mode
- **UI Libraries**: Framer Motion, FSLightbox React, React Icons
- **Analytics**: Vercel Analytics
- **Email**: Resend (`resend` npm package, `RESEND_API_KEY` in `.env.local`)

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Route groups (about, activities, albums, etc.)
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/
│   ├── home/              # Homepage components
│   ├── layout/            # Layout components (Header, Footer, etc.)
│   ├── providers/         # React providers
│   └── ui/                # Reusable UI components
├── data/                  # JSON data files
└── utils/                 # Utility functions
```

### Key Components
- **Layout**: Header with navigation, Footer, NoiseBackground for texture
- **Home**: HeroSection with Giants-Inline font, LatestActivities
- **Gallery**: Lightbox integration with hundreds of webp images
- **Providers**: FontLoader, PageTransition with Framer Motion

### Fonts & Assets
- Custom fonts: PretendardVariable.woff2, SFTTF.ttf, Giants-Inline for hero
- Images: Extensive webp gallery (~800+ images), optimized with Sharp
- Custom image loader in `utils/imageLoader.js`

### Data Management
- Static JSON files in `src/data/` for activities, albums, newsletters, videos
- Gallery alt-texts managed separately in `gallery-alt-texts.json`
- Navigation structure defined in `navigation.ts`

### Performance Optimizations
- Font preloading in layout
- Image optimization with Sharp
- Bundle analysis available
- WebP format for all images
- Custom noise background texture

### Internationalization
- Korean language (ko_KR locale)
- SEO optimized with Korean keywords
- Naver site verification included

## Development Notes

- Path alias `@/*` maps to `./src/*`
- Gallery route has API endpoint at `/api/gallery`
- Uses absolute imports with TypeScript path mapping
- Metadata templates configured for SEO
- Static export configuration with custom image loader for hosting compatibility
- TailwindCSS with custom color variables defined in globals.css

## Email System (Resend)

All outbound email uses [Resend](https://resend.com). Requires `RESEND_API_KEY` in `.env.local`. Sending domain: `noreply@alf.seoul.kr` (verified). Reply-to: `alf.seoul.kr@gmail.com`.

Email templates live in `src/app/api/newsletter/emailTemplates.ts` — exports `escapeHtml`, `renderShell`, `supporterNotifyEmail`, `supporterWelcomeEmail`, `welcomeEmail`, `notifyEmail`.

Routes:
- `POST /api/newsletter` — newsletter subscription (name + email)
- `POST /api/support` — supporter membership signup (full bank/CMS info); notifies org + sends applicant confirmation

## Supporter Membership System

`/support` page (`src/app/support/`) has a signup form (`SupportForm.tsx`) that collects name, birth date, phone, email, monthly amount, withdrawal date, bank account, and CMS consent. On submit it POSTs to `/api/support`, which emails the org with all personal info and sends the applicant a confirmation. **No data is stored on a server** — the org manages its own DB locally.

## Private Member DB & Mailing Tool

⚠️ `private/` is in `.gitignore`. This folder contains PII. **Never commit anything from `private/`.**

- `private/members.csv` — UTF-8 BOM CSV, 13 columns: 이름, 이메일, 연락처, 생년월일, 월후원금액, 출금일, 은행, 계좌번호, 예금주, CMS등록상태, CMS등록일, 가입일, 비고. Managed manually (Excel/Numbers/Google Sheets).
- `scripts/build-members-db.js` — converts Stibee export CSV (`private/stibee-source.csv`) into `private/members.csv`, extracting name + email only.

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

`scripts/send-mailing.js` renders all newsletter blocks (heading/paragraph/image/link/ledger) as branded HTML email, reads recipients from `private/members.csv`, and sends individually via Resend (600ms throttle between sends). Accounting data for `ledger` blocks comes from `src/data/accounting.json`.

## Newsletter Data Structure

- `src/data/newsletters.json` — metadata array: `{ id, title, publishDate, summary, link, highlights[], thumbnail }`
- `src/data/newsletters/{id}.json` — block array. Block types:
  - `{ type: 'heading', level: 2|3, text }`
  - `{ type: 'paragraph', text }`
  - `{ type: 'image', src, alt }` — `src` is a relative path like `/images/news/{id}/*.webp`
  - `{ type: 'link', text, href }`
  - `{ type: 'ledger', month }` — month key like `"2024-03"`, looked up in `src/data/accounting.json`
- `src/data/newsletterContent.ts` — imports all JSONs, exports `newsletterContent` record and `migratedIds`
- `src/data/accounting.json` — keyed by `"YYYY-MM"`, each entry: `{ income[], expense[], totalIncome, totalExpense, net, prevBalance, currentBalance }`

To add a new newsletter to the site: add `{id}.json`, add entry to `newsletters.json`, add import + entry to `newsletterContent.ts`.

### Newsletter Block JSON 서식 (53호 기준, 반드시 준수)

**구조 순서 및 heading level 규칙 — 어기면 안 됨:**

1. **인사말** — heading 없이 paragraph 블록들로 시작. 첫 블록은 `"존경하는 예술해방전선 회원 및 투쟁동지 여러분께"` 단독 단락. 이후 각 단락은 별도 paragraph 블록 (줄바꿈 `\n` 사용 금지, 단락마다 쪼갤 것).
2. **활동 섹션들** — **`level: 3` heading** → image(들) → paragraph(들) → link(있으면). 섹션 heading은 반드시 level 3.
3. **회계보고** — **`level: 2` heading** (`"N월 회계보고"`) → ledger 블록 → 설명 paragraph 2~3개. level 2는 회계보고에만 사용.

**금지 패턴:**
- 인사말에 heading 붙이는 것
- 여러 단락을 `\n`으로 이어붙여 하나의 paragraph 블록으로 만드는 것
- 활동 섹션에 level 2 heading 사용
- 회계보고에 ledger만 두고 설명 paragraph 생략

**예시 골격:**
```json
[
  { "type": "paragraph", "text": "존경하는 예술해방전선 회원 및 투쟁동지 여러분께" },
  { "type": "paragraph", "text": "계절 인사..." },
  { "type": "paragraph", "text": "활동 예고 및 마무리 인사. 함께 연대하며, 예술해방전선 드림" },

  { "type": "heading", "level": 3, "text": "섹션 제목" },
  { "type": "image", "src": "/images/news/{id}/01.webp", "alt": "설명" },
  { "type": "paragraph", "text": "단락 1" },
  { "type": "paragraph", "text": "단락 2" },
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

Image numbering: existing files in `public/images/news/{id}/` are not overwritten; script continues from the next number. Use `--overwrite` to reset to 01.