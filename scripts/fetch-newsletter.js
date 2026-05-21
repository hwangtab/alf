#!/usr/bin/env node
/**
 * 스티비 뉴스레터 콘텐츠 추출 + 이미지 다운로드 + WebP 변환 스크립트
 *
 * 사용법:
 *   node scripts/fetch-newsletter.js 47           # 단일 id
 *   node scripts/fetch-newsletter.js 44 45 46 47  # 여러 id
 *   node scripts/fetch-newsletter.js all          # 미마이그레이션 전체 (1~47)
 *
 * 출력:
 *   src/data/newsletters/{id}.json  — 본문 블록 (초안, 검수 권장)
 *   public/images/news/{id}/*.webp  — WebP 변환된 이미지
 *   src/data/newsletters.json       — thumbnail 로컬 경로로 갱신
 *   src/data/newsletterContent.ts   — migratedIds 자동 갱신
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const NEWSLETTERS_JSON = path.join(projectRoot, 'src/data/newsletters.json');
const CONTENT_DIR = path.join(projectRoot, 'src/data/newsletters');
const IMAGES_DIR = path.join(projectRoot, 'public/images/news');
const CONTENT_TS = path.join(projectRoot, 'src/data/newsletterContent.ts');

const ALREADY_MIGRATED = [48, 49, 50, 51, 52, 53];
const ALL_REMAINING = Array.from({ length: 47 }, (_, i) => i + 1);

const BOILERPLATE_PATTERNS = [
  /수신거부/,
  /Unsubscribe/i,
  /스티비로 만들었습니다/,
  /후원회원 가입/,
  /이 메일이 잘 안보이시나요/,
  /이전 뉴스레터/,
  /다음 뉴스레터/,
  /구독하기/,
  /를 구독하고 이메일로 받아보세요/,
  /alf\.seoul\.kr.*웹사이트/,
  /sns/i,
  /facebook.*youtube/i,
];

function isBoilerplate(text) {
  return BOILERPLATE_PATTERNS.some((p) => p.test(text));
}

async function resolveUrl(link) {
  const res = await fetch(link, {
    method: 'GET',
    redirect: 'follow',
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ALF-archiver/1.0)' },
  });
  return res.url;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ALF-archiver/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function decodeEntities(str) {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/ /g, ' ');
}

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '');
}

function cellToText(cellHtml) {
  return decodeEntities(stripTags(cellHtml))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractBodyImages(html) {
  const SKIP_PATTERNS = [
    'logo_stibee', 'icon_alert', 'icon_', 'sponsor',
    '53555_1630137126',
    'facebook', 'youtube',
  ];
  const images = [];
  const seen = new Set();
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    const src = m[1];
    if (!src.includes('stibee.com')) continue;
    if (SKIP_PATTERNS.some((p) => src.includes(p))) continue;
    if (!seen.has(src)) { seen.add(src); images.push(src); }
  }
  return images;
}

function extractCells(html) {
  const cells = [];
  for (const m of html.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)) {
    cells.push(m[1]);
  }
  return cells;
}

function isHeading(cellHtml, text) {
  if (/<h2[^>]*>/i.test(cellHtml)) return 2;
  if (/<h3[^>]*>/i.test(cellHtml)) return 3;
  if (text.length < 70 && /<strong[^>]*>[^<]{5,60}<\/strong>/i.test(cellHtml) && !text.includes('\n')) return 3;
  return 0;
}

function parseEmailHtml(html) {
  const blocks = [];
  const bodyImages = extractBodyImages(html);
  const cells = extractCells(html);
  let inFooter = false;

  for (const cell of cells) {
    if (/후원회원 가입/i.test(cell)) { inFooter = true; }
    if (inFooter) continue;

    const rawText = cellToText(cell);

    const imgMatch = cell.match(/<img[^>]+src=["']([^"']+)["'][^>]*/i);
    if (imgMatch) {
      const src = imgMatch[1];
      const SKIP = ['logo_stibee', 'icon_', 'sponsor', '53555_1630137126', 'facebook', 'youtube'];
      if (src.includes('stibee.com') && !SKIP.some((p) => src.includes(p))) {
        blocks.push({ type: 'image', src, alt: '' });
        continue;
      }
    }

    if (!rawText || rawText.length < 3) continue;
    if (isBoilerplate(rawText)) continue;

    const hLevel = isHeading(cell, rawText);
    if (hLevel === 2) {
      blocks.push({ type: 'heading', level: 2, text: rawText.replace(/\n/g, ' ') });
    } else if (hLevel === 3) {
      blocks.push({ type: 'heading', level: 3, text: rawText.replace(/\n/g, ' ') });
    } else {
      const paras = rawText
        .split(/\n{2,}/)
        .map((p) => p.replace(/\n/g, ' ').trim())
        .filter((p) => p.length > 5 && !isBoilerplate(p));
      for (const para of paras) {
        blocks.push({ type: 'paragraph', text: para });
      }
    }
  }

  return { blocks, bodyImages };
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ALF-archiver/1.0)' },
  });
  if (!res.ok) {
    console.warn(`  이미지 다운로드 실패 (${res.status}): ${url}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return true;
}

async function toWebp(srcPath, destPath) {
  try {
    await sharp(srcPath).webp({ quality: 82 }).toFile(destPath);
    fs.unlinkSync(srcPath);
    return true;
  } catch (e) {
    console.warn(`  WebP 변환 실패: ${path.basename(srcPath)} — ${e.message}`);
    return false;
  }
}

function getExtension(url) {
  const clean = url.split('?')[0];
  const ext = path.extname(clean).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
}

async function processNewsletter(id, newslettersData) {
  const meta = newslettersData.find((n) => n.id === id);
  if (!meta) {
    console.error(`id ${id}를 newsletters.json에서 찾을 수 없음`);
    return null;
  }

  if (!meta.link) {
    console.warn(`id ${id}: 링크 없음, 건너뜀`);
    return null;
  }

  const jsonPath = path.join(CONTENT_DIR, `${id}.json`);
  if (fs.existsSync(jsonPath)) {
    console.log(`id ${id}: 이미 존재(건너뜀) — ${meta.title}`);
    // thumbnail이 stibee CDN이면 여전히 로컬 경로 반환 시도
    const localCover = meta.thumbnail && !meta.thumbnail.startsWith('/')
      ? null : meta.thumbnail;
    return { id, localCover: localCover && localCover.startsWith('/') ? localCover : null };
  }

  console.log(`\n=== id ${id}: ${meta.title} ===`);
  console.log(`  링크: ${meta.link}`);

  const shareUrl = await resolveUrl(meta.link);
  console.log(`  URL: ${shareUrl}`);

  const html = await fetchHtml(shareUrl);
  console.log(`  HTML: ${html.length} bytes`);

  const { blocks, bodyImages } = parseEmailHtml(html);
  console.log(`  이미지: ${bodyImages.length}개  블록: ${blocks.length}개`);

  const imgDir = path.join(IMAGES_DIR, String(id));
  fs.mkdirSync(imgDir, { recursive: true });

  const urlToLocal = new Map();

  // 커버 이미지
  if (meta.thumbnail && !meta.thumbnail.startsWith('/')) {
    const rawExt = getExtension(meta.thumbnail);
    const rawDest = path.join(imgDir, `cover${rawExt}`);
    const webpDest = path.join(imgDir, 'cover.webp');
    const ok = await downloadImage(meta.thumbnail, rawDest);
    if (ok) {
      const converted = await toWebp(rawDest, webpDest);
      const localPath = `/images/news/${id}/${converted ? 'cover.webp' : `cover${rawExt}`}`;
      urlToLocal.set(meta.thumbnail, localPath);
      console.log(`  커버 → ${path.basename(localPath)}`);
    }
  }

  // 본문 이미지
  for (let i = 0; i < bodyImages.length; i++) {
    const url = bodyImages[i];
    const rawExt = getExtension(url);
    const filename = `${String(i + 1).padStart(2, '0')}`;
    const rawDest = path.join(imgDir, `${filename}${rawExt}`);
    const webpDest = path.join(imgDir, `${filename}.webp`);
    const ok = await downloadImage(url, rawDest);
    if (ok) {
      const converted = await toWebp(rawDest, webpDest);
      const localPath = `/images/news/${id}/${converted ? `${filename}.webp` : `${filename}${rawExt}`}`;
      urlToLocal.set(url, localPath);
    }
    process.stdout.write(`  이미지 [${i + 1}/${bodyImages.length}]\r`);
  }
  if (bodyImages.length > 0) console.log(`  이미지 ${bodyImages.length}개 완료`);

  const localizedBlocks = blocks.map((b) => {
    if (b.type === 'image') {
      const local = urlToLocal.get(b.src);
      return local ? { ...b, src: local } : b;
    }
    return b;
  });

  fs.writeFileSync(jsonPath, JSON.stringify(localizedBlocks, null, 2), 'utf-8');
  console.log(`  저장: ${id}.json (${localizedBlocks.length}블록)`);

  const localCover = meta.thumbnail ? urlToLocal.get(meta.thumbnail) : null;
  return { id, localCover };
}

function updateContentTs(allMigratedIds) {
  const sorted = [...allMigratedIds].sort((a, b) => a - b);

  const imports = sorted
    .map((id) => `import n${id} from './newsletters/${id}.json';`)
    .join('\n');

  const entries = sorted.map((id) => `  ${id}: n${id} as NewsletterBlock[],`).join('\n');

  const content = `import type { NewsletterBlock } from '@/types/newsletter';
${imports}

export const newsletterContent: Record<number, NewsletterBlock[]> = {
${entries}
};

export const migratedIds = Object.keys(newsletterContent).map(Number);
`;

  fs.writeFileSync(CONTENT_TS, content, 'utf-8');
  console.log(`\nnewsletterContent.ts 갱신 (${sorted.length}개 호)`);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('사용법: node scripts/fetch-newsletter.js <id|all> [id2 ...]');
    process.exit(1);
  }

  const ids =
    args[0] === 'all'
      ? ALL_REMAINING
      : args.map((a) => parseInt(a, 10)).filter((n) => !isNaN(n));

  const newslettersData = JSON.parse(fs.readFileSync(NEWSLETTERS_JSON, 'utf-8'));
  const coverUpdates = [];

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    try {
      const result = await processNewsletter(id, newslettersData);
      if (result && result.localCover) coverUpdates.push(result);
    } catch (e) {
      console.error(`\nid ${id} 실패: ${e.message}`);
    }
    if (i < ids.length - 1) await sleep(400); // 요청 간 딜레이
  }

  if (coverUpdates.length > 0) {
    const updateMap = new Map(coverUpdates.map((r) => [r.id, r.localCover]));
    const updated = newslettersData.map((n) =>
      updateMap.has(n.id) ? { ...n, thumbnail: updateMap.get(n.id) } : n
    );
    fs.writeFileSync(NEWSLETTERS_JSON, JSON.stringify(updated, null, 2), 'utf-8');
    console.log(`\nnewsletters.json thumbnail ${coverUpdates.length}개 갱신`);
  }

  // newsletterContent.ts 갱신
  const existingJsons = fs.readdirSync(CONTENT_DIR)
    .filter((f) => /^\d+\.json$/.test(f))
    .map((f) => parseInt(f, 10))
    .filter((n) => !isNaN(n));
  updateContentTs(existingJsons);

  console.log('\n=== 추출 완료 ===');
  console.log('다음: src/data/newsletters/{id}.json 파일을 검수하세요.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
