#!/usr/bin/env node
/**
 * 6~47호 뉴스레터 JSON 일괄 변환
 * 1) 회계 캡처 image 블록 → {type:"ledger", month:"YYYY-MM"}
 * 2) 섹션 번호 paragraph("N. ...") → {type:"heading", level:3, text}
 *
 * 사용: node scripts/transform-newsletters.js
 */

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../src/data/newsletters');

// 호 → 보고월 (발행월-1 규칙으로 검증된 매핑)
const ID_TO_MONTH = {
  6: '2022-01', 7: '2022-02', 8: '2022-03', 9: '2022-04', 10: '2022-05',
  11: '2022-06', 12: '2022-07', 13: '2022-08', 14: '2022-09', 15: '2022-10',
  16: '2022-11', 17: '2022-12', 18: '2023-01', 19: '2023-02', 20: '2023-03',
  21: '2023-04', 22: '2023-05', 23: '2023-06', 24: '2023-07', 25: '2023-08',
  26: '2023-09', 27: '2023-10', 28: '2023-11', 29: '2023-12', 30: '2024-01',
  31: '2024-02', 32: '2024-03', 33: '2024-04', 34: '2024-05', 35: '2024-06',
  36: '2024-07', 37: '2024-08', 38: '2024-09', 39: '2024-10', 40: '2024-11',
  41: '2024-12', 42: '2025-01', 43: '2025-02', 44: '2025-03', 45: '2025-04',
  46: '2025-05', 47: '2025-06',
};

function findAccountingImageIdx(blocks) {
  // 뒤에서부터 "회계" 포함 paragraph 탐색 → 바로 다음 image 블록
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    if (b.type === 'paragraph' && /회계/.test(b.text || '')) {
      for (let j = i + 1; j < Math.min(i + 6, blocks.length); j++) {
        if (blocks[j].type === 'image') return j;
      }
    }
  }
  return -1;
}

function promoteHeadings(blocks, ledgerIdx) {
  // 단조 증가 카운터: 다음 기대 섹션번호부터 시작해 순서 맞는 numbered paragraph → H3
  let expected = 1;
  return blocks.map((b, i) => {
    if (i === ledgerIdx) return { type: 'ledger', month: null }; // placeholder, month set later
    if (b.type !== 'paragraph') return b;
    const m = (b.text || '').match(/^(\d+)\.\s+(.{1,60})$/);
    if (!m) return b;
    const num = parseInt(m[1], 10);
    if (num === expected) {
      expected++;
      return { type: 'heading', level: 3, text: b.text };
    }
    return b;
  });
}

const results = [];

for (const [idStr, month] of Object.entries(ID_TO_MONTH)) {
  const id = parseInt(idStr, 10);
  const p = path.join(DIR, `${id}.json`);
  if (!fs.existsSync(p)) { console.error(`#${id}: 파일 없음`); continue; }

  const blocks = JSON.parse(fs.readFileSync(p, 'utf-8'));

  // 1) 회계 이미지 탐지
  const ledgerIdx = findAccountingImageIdx(blocks);
  if (ledgerIdx < 0) {
    console.warn(`#${id} [${month}]: ⚠️  회계 이미지 미탐지`);
  }
  const oldImgSrc = ledgerIdx >= 0 ? blocks[ledgerIdx].src : null;

  // 2) 변환 (heading 승격 + ledger 교체)
  const newBlocks = promoteHeadings(blocks, ledgerIdx);
  if (ledgerIdx >= 0) {
    newBlocks[ledgerIdx] = { type: 'ledger', month };
  }

  // 변경 요약
  const beforeH = blocks.filter(b => b.type === 'heading').length;
  const afterH = newBlocks.filter(b => b.type === 'heading').length;
  fs.writeFileSync(p, JSON.stringify(newBlocks, null, 2), 'utf-8');

  results.push({
    id,
    month,
    oldImgSrc,
    headingsBefore: beforeH,
    headingsAfter: afterH,
    ledgerInserted: ledgerIdx >= 0,
  });

  console.log(`#${id} [${month}] H:${beforeH}→${afterH} ledger:${ledgerIdx >= 0 ? oldImgSrc : '미탐지'}`);
}

// 상세 검수용: 각 호의 H3 목록 출력
console.log('\n===== 섹션 제목 목록 =====');
for (const { id } of Object.entries(ID_TO_MONTH).map(([k]) => ({ id: parseInt(k) }))) {
  const p = path.join(DIR, `${id}.json`);
  const blocks = JSON.parse(fs.readFileSync(p, 'utf-8'));
  const heads = blocks.filter(b => b.type === 'heading').map(b => `H${b.level}:${(b.text || '').slice(0, 40)}`);
  if (heads.length > 0) console.log(`#${id}: ${heads.join(' | ')}`);
}
