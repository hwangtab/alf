#!/usr/bin/env node
/**
 * 스티비 뉴스레터 콘텐츠 추출 + 이미지 다운로드 스크립트
 *
 * 사용법:
 *   node scripts/fetch-newsletter.js 53         # 단일 id
 *   node scripts/fetch-newsletter.js 48 49 50   # 여러 id
 *   node scripts/fetch-newsletter.js all        # 대상 id 전체 (48~53)
 *
 * 출력:
 *   src/data/newsletters/{id}.json  — 본문 블록 (초안, 검수 필요)
 *   public/images/news/{id}/        — 다운로드된 이미지
 *   src/data/newsletters.json       — thumbnail 로컬 경로로 갱신
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const NEWSLETTERS_JSON = path.join(projectRoot, 'src/data/newsletters.json');
const CONTENT_DIR = path.join(projectRoot, 'src/data/newsletters');
const IMAGES_DIR = path.join(projectRoot, 'public/images/news');

const TARGET_IDS = [48, 49, 50, 51, 52, 53];

// 스티비 보일러플레이트 패턴 — 해당 텍스트 포함 셀은 건너뜀
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

async function resolveShareUrl(stibeeLink) {
  const res = await fetch(stibeeLink, {
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
    'logo_stibee',
    'icon_alert',
    'icon_',
    'sponsor',
    '53555_1630137126', // ALF 로고
    'facebook',
    'youtube',
  ];
  const images = [];
  const seen = new Set();
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    const src = m[1];
    if (!src.includes('stibee.com')) continue;
    if (SKIP_PATTERNS.some((p) => src.includes(p))) continue;
    if (!seen.has(src)) {
      seen.add(src);
      images.push(src);
    }
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

  // 푸터 시작점: 후원회원 가입 링크부터 끝 처리
  let inFooter = false;

  for (const cell of cells) {
    if (/후원회원 가입/i.test(cell)) {
      inFooter = true;
    }
    if (inFooter) continue;

    const rawText = cellToText(cell);

    // 이미지 처리 (텍스트 없거나 있어도 이미지가 있는 경우)
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
      // 긴 텍스트는 빈 줄 단위로 문단 분리
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

function getExtension(url) {
  const clean = url.split('?')[0];
  const ext = path.extname(clean).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
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

async function processNewsletter(id, newslettersData) {
  const meta = newslettersData.find((n) => n.id === id);
  if (!meta) {
    console.error(`id ${id}를 newsletters.json에서 찾을 수 없음`);
    return null;
  }

  console.log(`\n=== id ${id}: ${meta.title} ===`);
  console.log(`  링크: ${meta.link}`);

  const shareUrl = await resolveShareUrl(meta.link);
  console.log(`  share URL: ${shareUrl}`);

  const html = await fetchHtml(shareUrl);
  console.log(`  HTML 크기: ${html.length} bytes`);

  const { blocks, bodyImages } = parseEmailHtml(html);
  console.log(`  발견된 이미지: ${bodyImages.length}개, 파싱된 블록: ${blocks.length}개`);

  const imgDir = path.join(IMAGES_DIR, String(id));
  fs.mkdirSync(imgDir, { recursive: true });

  const urlToLocal = new Map();

  // 커버 이미지 다운로드
  if (meta.thumbnail && meta.thumbnail.includes('stibee.com')) {
    const coverExt = getExtension(meta.thumbnail);
    const coverDest = path.join(imgDir, `cover${coverExt}`);
    const localCover = `/images/news/${id}/cover${coverExt}`;
    console.log(`  커버 다운로드: cover${coverExt}`);
    await downloadImage(meta.thumbnail, coverDest);
    urlToLocal.set(meta.thumbnail, localCover);
  }

  // 본문 이미지 다운로드
  for (let i = 0; i < bodyImages.length; i++) {
    const url = bodyImages[i];
    const ext = getExtension(url);
    const filename = `${String(i + 1).padStart(2, '0')}${ext}`;
    const destPath = path.join(imgDir, filename);
    const localPath = `/images/news/${id}/${filename}`;
    console.log(`  이미지 [${i + 1}/${bodyImages.length}]: ${filename}`);
    const ok = await downloadImage(url, destPath);
    if (ok) urlToLocal.set(url, localPath);
  }

  // 블록의 이미지 src를 로컬 경로로 치환
  const localizedBlocks = blocks.map((b) => {
    if (b.type === 'image') {
      const local = urlToLocal.get(b.src);
      return local ? { ...b, src: local } : b;
    }
    return b;
  });

  const contentPath = path.join(CONTENT_DIR, `${id}.json`);
  fs.writeFileSync(contentPath, JSON.stringify(localizedBlocks, null, 2), 'utf-8');
  console.log(`  저장: src/data/newsletters/${id}.json (${localizedBlocks.length}개 블록)`);

  const localCover = meta.thumbnail ? urlToLocal.get(meta.thumbnail) : null;
  return { id, localCover };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('사용법: node scripts/fetch-newsletter.js <id|all> [id2 ...]');
    process.exit(1);
  }

  const ids =
    args[0] === 'all'
      ? TARGET_IDS
      : args.map((a) => parseInt(a, 10)).filter((n) => !isNaN(n));

  const newslettersData = JSON.parse(fs.readFileSync(NEWSLETTERS_JSON, 'utf-8'));

  const coverUpdates = [];
  for (const id of ids) {
    const result = await processNewsletter(id, newslettersData);
    if (result && result.localCover) coverUpdates.push(result);
  }

  if (coverUpdates.length > 0) {
    const updateMap = new Map(coverUpdates.map((r) => [r.id, r.localCover]));
    const updated = newslettersData.map((n) =>
      updateMap.has(n.id) ? { ...n, thumbnail: updateMap.get(n.id) } : n
    );
    fs.writeFileSync(NEWSLETTERS_JSON, JSON.stringify(updated, null, 2), 'utf-8');
    console.log(`\nnewsletters.json thumbnail ${coverUpdates.length}개 갱신`);
  }

  console.log('\n=== 추출 완료 ===');
  console.log('다음: src/data/newsletters/{id}.json 파일을 열어 본문 블록을 검수·정리하세요.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
