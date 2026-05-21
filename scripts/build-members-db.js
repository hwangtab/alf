/**
 * Stibee 구독자 CSV → 후원 회원 DB CSV 변환 스크립트
 *
 * 사용법:
 *   node scripts/build-members-db.js [입력경로] [출력경로]
 *
 * 기본값:
 *   입력: private/stibee-source.csv
 *   출력: private/members.csv
 *
 * 열 구성 (출력):
 *   이름, 이메일, 연락처, 생년월일, 월후원금액, 출금일,
 *   은행, 계좌번호, 예금주, CMS등록상태, CMS등록일, 가입일, 비고
 *
 * ⚠ 출력 파일은 개인정보를 포함합니다. private/ 폴더는 .gitignore 처리되어 있습니다.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const INPUT  = process.argv[2] || path.join(__dirname, '..', 'private', 'stibee-source.csv');
const OUTPUT = process.argv[3] || path.join(__dirname, '..', 'private', 'members.csv');

const HEADERS = [
  '이름', '이메일', '연락처', '생년월일', '월후원금액', '출금일',
  '은행', '계좌번호', '예금주', 'CMS등록상태', 'CMS등록일', '가입일', '비고',
];

/** 한 줄짜리 CSV 행을 필드 배열로 파싱 (따옴표 처리 포함) */
function parseRow(line) {
  const fields = [];
  let field = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '"') {
        if (line[i + 1] === '"') { field += '"'; i++; } // escaped quote
        else inQuote = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') { inQuote = true; }
      else if (ch === ',') { fields.push(field); field = ''; }
      else { field += ch; }
    }
  }
  fields.push(field);
  return fields;
}

/** CSV 필드 하나를 안전하게 따옴표로 감싸기 */
function q(val) {
  return '"' + String(val ?? '').replace(/"/g, '""') + '"';
}

const raw = fs.readFileSync(INPUT, 'utf8')
  .replace(/^﻿/, '')   // BOM 제거
  .replace(/\r\n/g, '\n')
  .replace(/\r/g, '\n');

const lines = raw.split('\n').filter(Boolean);
const headerLine = lines[0];
const dataLines = lines.slice(1);

// 헤더 확인
const srcHeaders = parseRow(headerLine);
const emailIdx = srcHeaders.indexOf('이메일 주소');
const nameIdx  = srcHeaders.indexOf('이름');

if (emailIdx < 0 || nameIdx < 0) {
  console.error('헤더에서 이메일 주소 / 이름 열을 찾을 수 없습니다.');
  console.error('감지된 헤더:', srcHeaders);
  process.exit(1);
}

const BOM = '﻿';
const rows = [HEADERS.map(q).join(',')];
let emptyNameCount = 0;

for (const line of dataLines) {
  if (!line.trim()) continue;
  const fields = parseRow(line);
  const name  = (fields[nameIdx]  || '').trim();
  const email = (fields[emailIdx] || '').trim();
  if (!email) continue;
  if (!name) emptyNameCount++;
  // 이름·이메일만 채우고 나머지 11열 빈 칸
  const row = [name, email, '', '', '', '', '', '', '', '', '', '', ''];
  rows.push(row.map(q).join(','));
}

fs.writeFileSync(OUTPUT, BOM + rows.join('\n') + '\n', 'utf8');

console.log(`✓ ${OUTPUT} 생성 완료`);
console.log(`  총 ${rows.length - 1}행 (이름 빈 행: ${emptyNameCount}개)`);
if (emptyNameCount > 0) {
  console.log('  → 이름이 없는 행은 이메일만 입력됩니다. 수동으로 이름을 채워주세요.');
}
