/**
 * 노션 등 외부 URL 이미지 → public/images/news/{id}/ WebP 변환 스크립트
 *
 * 사용법:
 *   node scripts/download-newsletter-images.js <id> <url1> [url2] ...
 *
 * 예시:
 *   node scripts/download-newsletter-images.js 54 https://... https://...
 *
 * 출력:
 *   public/images/news/{id}/01.webp, 02.webp, ...
 *   완료 후 각 파일의 상대 경로를 출력 → newsletters/{id}.json image 블록에 바로 사용
 *
 * 기존 파일 처리:
 *   이미 01.webp 등이 있으면 그 다음 번호부터 이어서 저장 (덮어쓰지 않음)
 *   --overwrite 플래그를 주면 01부터 새로 시작
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');

// ── 인자 파싱 ─────────────────────────────────────────────────────────
const args = process.argv.slice(2).filter(a => a !== '--overwrite');
const overwrite = process.argv.includes('--overwrite');

if (args.length < 2) {
  process.stdout.write([
    '사용법:',
    '  node scripts/download-newsletter-images.js <id> <url1> [url2] ...',
    '',
    '옵션:',
    '  --overwrite   기존 이미지 무시하고 01부터 새로 번호 매기기',
    '',
    '예시:',
    '  node scripts/download-newsletter-images.js 54 https://example.com/img1.jpg https://example.com/img2.png',
    '',
  ].join('\n'));
  process.exit(0);
}

const id   = parseInt(args[0], 10);
const urls = args.slice(1);

if (isNaN(id) || id <= 0) {
  console.error('오류: 유효한 뉴스레터 ID(양의 정수)를 입력하세요');
  process.exit(1);
}
if (urls.length === 0) {
  console.error('오류: 다운로드할 URL을 하나 이상 입력하세요');
  process.exit(1);
}

// ── 출력 디렉터리 ─────────────────────────────────────────────────────
const outDir = path.join(ROOT, 'public', 'images', 'news', String(id));
fs.mkdirSync(outDir, { recursive: true });

// ── 시작 번호 결정 ────────────────────────────────────────────────────
function nextIndex() {
  if (overwrite) return 1;
  const existing = fs.readdirSync(outDir)
    .map(f => parseInt(f, 10))
    .filter(n => !isNaN(n));
  return existing.length > 0 ? Math.max(...existing) + 1 : 1;
}

// ── URL에서 버퍼 다운로드 (리다이렉트 처리 포함) ───────────────────────
async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// ── 메인 ─────────────────────────────────────────────────────────────
async function main() {
  let idx = nextIndex();
  const results = [];

  console.log(`\n뉴스레터 #${id} 이미지 다운로드 · WebP 변환`);
  console.log(`저장 경로: ${outDir}`);
  console.log(`시작 번호: ${String(idx).padStart(2, '0')}\n`);

  for (let i = 0; i < urls.length; i++) {
    const url  = urls[i];
    const num  = String(idx).padStart(2, '0');
    const dest = path.join(outDir, `${num}.webp`);
    const rel  = `/images/news/${id}/${num}.webp`;

    process.stdout.write(`  [${i + 1}/${urls.length}] ${num}.webp ... `);
    try {
      const buf = await downloadBuffer(url);
      await sharp(buf)
        .webp({ quality: 85, effort: 6 })
        .toFile(dest);
      process.stdout.write(`완료 ✓\n`);
      results.push(rel);
      idx++;
    } catch (err) {
      process.stdout.write(`실패 ✗ (${err.message})\n`);
    }
  }

  if (results.length === 0) {
    console.error('\n저장된 이미지가 없습니다.');
    process.exit(1);
  }

  console.log('\n저장된 이미지 경로 (블록 JSON에 그대로 사용):');
  results.forEach(r => console.log(`  ${r}`));
  console.log(`\n썸네일 후보 (첫 번째 이미지): ${results[0]}`);
  console.log('→ newsletters.json의 thumbnail 값으로 사용하세요.\n');
}

main().catch(err => {
  console.error('오류:', err.message);
  process.exit(1);
});
