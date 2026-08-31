/**
 * Stibee 구독자 CSV → 후원 회원 DB CSV 변환 스크립트
 *
 * 사용법:
 *   node scripts/build-members-db.js [입력경로] [출력경로] [--force]
 *
 * 기본값:
 *   입력: private/stibee-source.csv
 *   출력: private/members.csv
 *
 * 열 구성 (출력):
 *   이름, 이메일, 연락처, 생년월일, 월후원금액, 출금일,
 *   은행, 계좌번호, 예금주, CMS등록상태, CMS등록일, 가입일, 비고
 *
 * ⚠ 이 스크립트는 이름·이메일 두 열만 채우고 나머지 11열은 빈 칸으로 만든다.
 *   members.csv는 계좌·CMS 정보를 손으로 관리하는 파일이므로, 덮어쓰면 그 입력이
 *   전부 사라진다. 그래서 기본 동작은 "출력 파일이 이미 있으면 중단"이다.
 *   최초 1회 부트스트랩 용도로 쓰고, 이후 신규 구독자는 손으로 추가하는 편이 안전하다.
 *   그래도 덮어써야 한다면 --force를 쓴다 (자동으로 .bak 백업을 남긴다).
 *
 * ⚠ 출력에는 개인정보가 들어간다. private/ 밖으로는 쓸 수 없게 막아두었다.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { parseCsv, toCsvRow } = require('./lib/csv.js');

const PRIVATE_DIR = path.join(__dirname, '..', 'private');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HEADERS = [
  '이름', '이메일', '연락처', '생년월일', '월후원금액', '출금일',
  '은행', '계좌번호', '예금주', 'CMS등록상태', 'CMS등록일', '가입일', '비고',
];

const args = process.argv.slice(2);
const force = args.includes('--force');
const positional = args.filter((arg) => !arg.startsWith('--'));

const INPUT = positional[0] || path.join(PRIVATE_DIR, 'stibee-source.csv');
const OUTPUT = positional[1] || path.join(PRIVATE_DIR, 'members.csv');

function fail(message) {
  console.error(`오류: ${message}`);
  process.exit(1);
}

/**
 * 출력 경로를 private/ 안으로 제한한다.
 * 이 파일은 회원 이름·이메일을 담으므로, 커밋 가능한 경로로 새어나가면
 * .gitignore 보호(private/ 만 대상)를 벗어나 그대로 저장소에 올라갈 수 있다.
 */
function assertInsidePrivate(target) {
  const resolved = path.resolve(target);
  const relative = path.relative(path.resolve(PRIVATE_DIR), resolved);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    fail(
      `출력 경로는 private/ 안이어야 합니다 (받은 값: ${target}).\n` +
      '  이 파일에는 회원 개인정보가 들어가며, private/ 밖은 .gitignore 보호를 받지 못합니다.'
    );
  }
  return resolved;
}

const outputPath = assertInsidePrivate(OUTPUT);

if (!fs.existsSync(INPUT)) {
  fail(`입력 파일을 찾을 수 없습니다: ${INPUT}`);
}

if (fs.existsSync(outputPath) && !force) {
  fail(
    `${outputPath} 파일이 이미 있습니다.\n` +
    '  이 스크립트는 이름·이메일만 채우고 나머지 11열(연락처·계좌번호·CMS등록상태 등)을\n' +
    '  빈 칸으로 덮어씁니다. 손으로 입력한 내용이 있다면 사라집니다.\n' +
    '  그래도 진행하려면 --force를 붙이세요 (실행 전 .bak 백업을 만듭니다).'
  );
}

const rawInput = fs.readFileSync(INPUT, 'utf8');
const sourceRows = parseCsv(rawInput);

if (sourceRows.length === 0) {
  fail(`입력 파일이 비어 있습니다: ${INPUT}`);
}

const [srcHeaders, ...dataRows] = sourceRows;
const emailIdx = srcHeaders.indexOf('이메일 주소');
const nameIdx = srcHeaders.indexOf('이름');

if (emailIdx < 0 || nameIdx < 0) {
  // 헤더 행 자체를 찍으면, 헤더가 없는 파일일 때 실제 구독자 한 명의
  // 이름·이메일이 터미널과 CI 로그에 그대로 남는다. 형태 정보만 알린다.
  console.error('오류: 헤더에서 "이메일 주소" / "이름" 열을 찾을 수 없습니다.');
  console.error(`  첫 행의 열 개수: ${srcHeaders.length}`);
  console.error('  Stibee 내보내기 원본이 맞는지, 첫 행이 헤더인지 확인하세요.');
  process.exit(1);
}

const rows = [toCsvRow(HEADERS)];
const seenEmails = new Set();
let emptyNameCount = 0;
let invalidEmailCount = 0;
let duplicateCount = 0;

for (const fields of dataRows) {
  const name = (fields[nameIdx] || '').trim();
  const email = (fields[emailIdx] || '').trim();

  if (!email) continue;

  if (!EMAIL_RE.test(email)) {
    invalidEmailCount++;
    continue;
  }

  // 같은 주소로 두 번 발송되지 않도록 대소문자 구분 없이 중복을 제거한다.
  const key = email.toLowerCase();
  if (seenEmails.has(key)) {
    duplicateCount++;
    continue;
  }
  seenEmails.add(key);

  if (!name) emptyNameCount++;

  // 이름·이메일만 채우고 나머지 11열은 빈 칸 — 이후 손으로 관리한다.
  rows.push(toCsvRow([name, email, '', '', '', '', '', '', '', '', '', '', '']));
}

if (fs.existsSync(outputPath)) {
  const backupPath = `${outputPath}.${new Date().toISOString().replace(/[:.]/g, '-')}.bak`;
  fs.copyFileSync(outputPath, backupPath);
  console.log(`백업 생성: ${backupPath}`);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
// Excel이 한글을 깨뜨리지 않도록 UTF-8 BOM을 붙인다.
fs.writeFileSync(outputPath, '﻿' + rows.join('\n') + '\n', 'utf8');

console.log(`✓ ${outputPath} 생성 완료`);
console.log(`  총 ${rows.length - 1}행`);
if (emptyNameCount > 0) {
  console.log(`  이름 빈 행: ${emptyNameCount}개 → 수동으로 이름을 채워주세요.`);
}
if (duplicateCount > 0) {
  console.log(`  중복 이메일 ${duplicateCount}건 제외 (중복 발송 방지)`);
}
if (invalidEmailCount > 0) {
  console.log(`  형식이 올바르지 않은 이메일 ${invalidEmailCount}건 제외`);
}
