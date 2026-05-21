#!/usr/bin/env node
/**
 * 엑셀 가계부 → accounting.json 병합 스크립트
 * 대상: 2022-01 ~ 2025-06 (42개월)
 * 사용: node scripts/parse-ledger.js
 */

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const ROOT = path.join(__dirname, '..');
const EXCEL_PATH = path.join(ROOT, 'docs/예술해방전선 가계부.xlsx');
const ACCOUNTING_JSON = path.join(ROOT, 'src/data/accounting.json');

// 대상 월 범위: 2022-01 ~ 2025-06
const TARGET_MONTHS = [];
for (let y = 2022; y <= 2025; y++) {
  const endM = y === 2025 ? 6 : 12;
  for (let m = 1; m <= endM; m++) {
    TARGET_MONTHS.push({ year: y, month: m, key: `${y}-${String(m).padStart(2, '0')}` });
  }
}

// 엑셀 시트명: 2024+ 비패딩, 2023- 0패딩
function sheetName(year, month) {
  return year >= 2024 ? `${year}.${month}` : `${year}.${String(month).padStart(2, '0')}`;
}

// 2023-09: 엑셀 시트 없음, 캡처 스크린샷(news/26/09.webp) 기준 수동 입력
// 캡처에 표기된 값 그대로 사용 (발행 당시 독자가 본 숫자)
const MANUAL_OVERRIDES = {
  '2023-09': {
    income: [{ label: '09.22', amount: 132072, note: 'CMS' }],
    expense: [],
    totalIncome: 132072,
    totalExpense: 0,
    net: 132072,
    prevBalance: -64000,      // 캡처 표기값 (08월잔액 오기입이나 발행 기준 유지)
    currentBalance: 68072,    // 캡처 표기값
  },
};

function parseSheet(wb, year, month) {
  const key = `${year}-${String(month).padStart(2, '0')}`;
  if (MANUAL_OVERRIDES[key]) {
    console.log(`  수동 입력 [${key}]`);
    return MANUAL_OVERRIDES[key];
  }

  const name = sheetName(year, month);
  const ws = wb.Sheets[name];
  if (!ws) {
    console.error(`  ⚠️  시트 없음: ${name}`);
    return null;
  }

  const rows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: '' });

  const income = [];
  const expense = [];
  let totalIncomeSheet = 0, totalExpenseSheet = 0;
  let currentBalanceSheet = null;
  const prevCandidates = []; // 잔액 행들 (현재 제외)
  let section = null;
  let firstNet = null; // 차액 행 중 첫 번째만 (이후 "N월 차액"은 무시)

  for (const row of rows) {
    const col0 = String(row[0] || '').trim();
    const col1 = row[1];
    const col2 = String(row[2] || '').trim();
    const col3 = String(row[3] || '').trim();
    const isNum = typeof col1 === 'number' && !isNaN(col1);

    if (!col0 && !isNum) continue;

    if (col0 === '수입') { section = 'income'; continue; }
    if (col0 === '지출') { section = 'expense'; continue; }
    if (/총수입/.test(col0)) { if (isNum) { totalIncomeSheet = col1; section = null; } continue; }
    if (/총지출/.test(col0)) { if (isNum) { totalExpenseSheet = col1; section = null; } continue; }
    // 현재 잔액
    if (/현재/.test(col0) && /잔/.test(col0)) {
      if (isNum) currentBalanceSheet = col1;
      continue;
    }
    // 차액 행: 첫 번째만 기록 (이후는 이전 월 수치 — 무시)
    if (/차액/.test(col0)) {
      if (isNum && firstNet === null) firstNet = col1;
      continue;
    }
    // 잔액 행 (현재 제외, 차액 아님): prevBalance 후보
    if (/잔/.test(col0)) {
      if (isNum) prevCandidates.push(col1);
      continue;
    }

    if (section === 'income' && isNum) {
      // col0이 날짜형("MM.DD")이면 항목(col2) 우선, 그 외엔 col0 우선
      const isDate = /^\d{1,2}\.\d{1,2}$/.test(col0);
      const label = isDate ? (col2 || col0 || '후원금') : (col0 || col2 || '후원금');
      const entry = { label, amount: col1 };
      if (col3) entry.note = col3;
      income.push(entry);
    } else if (section === 'expense' && isNum) {
      const isDate = /^\d{1,2}\.\d{1,2}$/.test(col0);
      const label = isDate ? (col2 || col0 || '지출') : (col0 || col2 || '지출');
      const entry = { label, amount: col1 };
      if (col3) entry.note = col3;
      expense.push(entry);
    }
  }

  // totalIncome/totalExpense: 시트 합계 행 우선, 없으면 항목 합산
  const totalIncome = totalIncomeSheet || income.reduce((s, e) => s + e.amount, 0);
  const totalExpense = totalExpenseSheet || expense.reduce((s, e) => s + e.amount, 0);
  // net: 계산값 사용 (시트의 차액 행은 오기입 위험)
  const net = totalIncome - totalExpense;

  // prevBalance: 잔액 후보 중 net과 다른 값 선택
  // (일부 시트는 당월 net을 "N월잔액"으로 한 번 더 기재함 → 제외)
  let prevBalance = null;
  for (const cand of prevCandidates) {
    if (cand !== net) { prevBalance = cand; break; }
  }
  if (prevBalance === null) {
    // 후보가 모두 net과 같거나 없는 경우 — 시트 현재잔액에서 역산
    if (currentBalanceSheet !== null) {
      prevBalance = currentBalanceSheet - net;
      console.warn(`  ⚠️  [${key}] prevBalance 후보 없음, 시트 현재잔액(${currentBalanceSheet}) - net(${net}) = ${prevBalance} 사용`);
    } else {
      prevBalance = prevCandidates[0] ?? 0;
      console.warn(`  ⚠️  [${key}] prevBalance 후보 없음, ${prevBalance} 사용`);
    }
  }

  const currentBalance = prevBalance + net;

  // 검증: 항목 합 vs 시트 합계
  const sumIncome = income.reduce((s, e) => s + e.amount, 0);
  const sumExpense = expense.reduce((s, e) => s + e.amount, 0);
  if (totalIncomeSheet && Math.abs(sumIncome - totalIncomeSheet) > 1) {
    console.warn(`  ⚠️  [${key}] 수입 항목 합(${sumIncome}) ≠ 총수입(${totalIncomeSheet})`);
  }
  if (totalExpenseSheet && Math.abs(sumExpense - totalExpenseSheet) > 1) {
    console.warn(`  ⚠️  [${key}] 지출 항목 합(${sumExpense}) ≠ 총지출(${totalExpenseSheet})`);
  }
  // 검증: 시트 현재잔액 vs 계산값
  if (currentBalanceSheet !== null && Math.abs(currentBalanceSheet - currentBalance) > 1) {
    console.warn(`  ⚠️  [${key}] 시트 현재잔액(${currentBalanceSheet}) ≠ 계산값(${currentBalance}) — 계산값 사용`);
  }

  return { income, expense, totalIncome, totalExpense, net, prevBalance, currentBalance };
}

function main() {
  const wb = xlsx.readFile(EXCEL_PATH);
  const existing = JSON.parse(fs.readFileSync(ACCOUNTING_JSON, 'utf-8'));

  const parsed = {};
  let warnings = 0;

  for (const { year, month, key } of TARGET_MONTHS) {
    process.stdout.write(`  파싱 [${key}]... `);
    const data = parseSheet(wb, year, month);
    if (!data) { console.log('SKIP'); warnings++; continue; }
    parsed[key] = data;
    const amt = (n) => (n < 0 ? '-' : '') + Math.abs(n).toLocaleString();
    console.log(`수입 ${amt(data.totalIncome)} / 지출 ${amt(data.totalExpense)} / 잔액 ${amt(data.currentBalance)}`);
  }

  // 잔액 연속성 검증
  console.log('\n--- 잔액 연속성 검증 ---');
  const allKeys = TARGET_MONTHS.map(m => m.key);

  if (existing['2021-12'] && parsed['2022-01']) {
    const expected = existing['2021-12'].currentBalance;
    const actual = parsed['2022-01'].prevBalance;
    if (actual !== expected) {
      console.warn(`  ⚠️  경계 2021-12→2022-01: ${expected} ≠ ${actual}`);
      warnings++;
    } else {
      console.log(`  ✅ 2021-12→2022-01: ${expected}`);
    }
  }

  for (let i = 0; i < allKeys.length - 1; i++) {
    const k1 = allKeys[i], k2 = allKeys[i + 1];
    const d1 = parsed[k1], d2 = parsed[k2];
    if (!d1 || !d2) {
      console.warn(`  ⚠️  ${k1} 또는 ${k2} 파싱 실패, 연속성 검증 생략`);
      continue;
    }
    if (d2.prevBalance !== d1.currentBalance) {
      console.warn(`  ⚠️  ${k1}→${k2}: ${d1.currentBalance} ≠ ${d2.prevBalance}`);
      warnings++;
    }
  }

  if (existing['2025-07'] && parsed['2025-06']) {
    const expected = parsed['2025-06'].currentBalance;
    const actual = existing['2025-07'].prevBalance;
    if (actual !== expected) {
      console.warn(`  ⚠️  경계 2025-06→2025-07: ${expected} ≠ ${actual}`);
      warnings++;
    } else {
      console.log(`  ✅ 2025-06→2025-07: ${expected}`);
    }
  }

  // 병합 (신규만 추가)
  const merged = { ...existing };
  let added = 0;
  for (const key of allKeys) {
    if (!parsed[key]) continue;
    if (merged[key]) { console.log(`  ℹ️  [${key}] 기존재 — 스킵`); continue; }
    merged[key] = parsed[key];
    added++;
  }

  const sorted = {};
  for (const k of Object.keys(merged).sort()) sorted[k] = merged[k];

  fs.writeFileSync(ACCOUNTING_JSON, JSON.stringify(sorted, null, 2), 'utf-8');
  console.log(`\n완료: ${added}개월 추가, 총 ${Object.keys(sorted).length}개월, 연속성 경고 ${warnings}건`);
}

main();
