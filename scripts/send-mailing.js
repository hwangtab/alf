/**
 * 활동 보고 메일링 스크립트
 *
 * 사용법:
 *   node scripts/send-mailing.js <id>                  # 드라이런(미리보기)
 *   node scripts/send-mailing.js <id> --test <email>   # 1통 테스트 발송
 *   node scripts/send-mailing.js <id> --send           # 전체 발송
 *
 * 수신자: private/members.csv의 전체 유효 이메일
 * 데이터: src/data/newsletters/{id}.json + newsletters.json + accounting.json
 */

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ── 상수 ─────────────────────────────────────────────────────────────
const ROOT       = path.join(__dirname, '..');
const SITE       = 'https://alf.seoul.kr';
const FB         = 'https://www.facebook.com/artliberationfront';
const YT         = 'https://www.youtube.com/@artliberationfront';
const FROM       = '예술해방전선 <noreply@alf.seoul.kr>';
const REPLY_TO   = 'alf.seoul.kr@gmail.com';
const FONT       = "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', '맑은 고딕', sans-serif";
const DELAY_MS   = 600; // Resend 레이트리밋 안전 마진 (~2 req/s)
const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── 인자 파싱 ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
  process.stdout.write([
    '사용법:',
    '  node scripts/send-mailing.js <id>                  # 드라이런(프리뷰 저장)',
    '  node scripts/send-mailing.js <id> --test <email>   # 1통 테스트 발송',
    '  node scripts/send-mailing.js <id> --send           # 전체 발송',
    '',
  ].join('\n'));
  process.exit(0);
}

const id = parseInt(args[0], 10);
if (isNaN(id) || id <= 0) {
  console.error('오류: 유효한 뉴스레터 ID(양의 정수)를 입력하세요');
  process.exit(1);
}

let mode      = 'preview'; // 'preview' | 'test' | 'send'
let testEmail = '';
if (args.includes('--send')) {
  mode = 'send';
} else if (args.includes('--test')) {
  const idx = args.indexOf('--test');
  testEmail = args[idx + 1] || '';
  if (!testEmail || testEmail.startsWith('--')) {
    console.error('오류: --test 다음에 이메일 주소를 입력하세요');
    process.exit(1);
  }
  mode = 'test';
}

// ── .env.local 로드 ───────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('오류: .env.local 파일을 찾을 수 없습니다');
    process.exit(1);
  }
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      const raw = m[2];
      const quoted = raw.match(/^(['"])(.*)\1$/s);
      process.env[m[1]] = quoted ? quoted[2] : raw.replace(/\s+#.*$/, '').trim();
    }
  }
}

// ── CSV 파서 (따옴표 처리) ─────────────────────────────────────────────
function parseRow(line) {
  const fields = [];
  let field = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '"') {
        if (line[i + 1] === '"') { field += '"'; i++; }
        else inQuote = false;
      } else { field += ch; }
    } else {
      if (ch === '"') { inQuote = true; }
      else if (ch === ',') { fields.push(field); field = ''; }
      else { field += ch; }
    }
  }
  fields.push(field);
  return fields;
}

// ── HTML 헬퍼 ─────────────────────────────────────────────────────────
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function ctaButton(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 12px;">
  <tr>
    <td bgcolor="#ff3d3d" style="background-color:#ff3d3d;border-radius:8px;">
      <a href="${href}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-family:${FONT};font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">${label}</a>
    </td>
  </tr>
</table>`;
}

function renderShell(subtitle, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f0f0f0;font-family:${FONT};">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f0f0;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#ff5a1f;background-image:linear-gradient(135deg,#ff3d3d,#ff7b00);padding:36px 40px;">
              <div style="font-family:${FONT};font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">예술해방전선</div>
              <div style="font-family:${FONT};font-size:13px;color:rgba(255,255,255,0.85);margin-top:8px;letter-spacing:0.3px;">${subtitle}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;color:#1f2937;font-size:16px;line-height:1.75;font-family:${FONT};">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;font-family:${FONT};">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size:13px;color:#6b7280;line-height:1.8;">
                    <a href="${FB}" style="color:#ff5a1f;text-decoration:none;font-weight:600;">Facebook</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${YT}" style="color:#ff5a1f;text-decoration:none;font-weight:600;">YouTube</a>
                    &nbsp;&middot;&nbsp;
                    <a href="mailto:alf.seoul.kr@gmail.com" style="color:#ff5a1f;text-decoration:none;font-weight:600;">alf.seoul.kr@gmail.com</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:8px;font-size:12px;color:#9ca3af;">
                    &copy; 예술해방전선 &middot; 수신을 원치 않으시면 이 메일에 회신해 주세요.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── 날짜 포맷 ─────────────────────────────────────────────────────────
function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// ── 금액 포맷 ─────────────────────────────────────────────────────────
function fmtKRW(n) {
  return (n < 0 ? '-' : '') + Math.abs(n).toLocaleString('ko-KR') + '원';
}

// ── 블록 → 이메일 HTML ────────────────────────────────────────────────
function renderBlock(block, accounting) {
  switch (block.type) {
    case 'heading':
      if (block.level === 2) {
        return `<h2 style="font-family:${FONT};font-size:20px;font-weight:800;color:#111827;margin:32px 0 12px;padding-bottom:10px;border-bottom:2px solid #e5e7eb;">${esc(block.text)}</h2>`;
      }
      return `<h3 style="font-family:${FONT};font-size:17px;font-weight:700;color:#1f2937;margin:24px 0 8px;">${esc(block.text)}</h3>`;

    case 'paragraph':
      return `<p style="font-family:${FONT};font-size:15px;color:#374151;line-height:1.8;margin:0 0 14px;">${esc(block.text).replace(/\n/g, '<br>')}</p>`;

    case 'image': {
      const src = block.src.startsWith('http') ? block.src : `${SITE}${block.src}`;
      return `<div style="margin:20px 0;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;"><img src="${esc(src)}" alt="${esc(block.alt)}" style="display:block;width:100%;max-width:100%;height:auto;"></div>`;
    }

    case 'link':
      return `<p style="margin:12px 0;"><a href="${esc(block.href)}" target="_blank" rel="noopener noreferrer" style="color:#ff5a1f;font-weight:600;font-size:14px;font-family:${FONT};">${esc(block.text)}</a></p>`;

    case 'ledger': {
      const data = accounting[block.month];
      if (!data) return `<p style="color:#9ca3af;font-size:13px;">[회계: ${esc(block.month)} 데이터 없음]</p>`;

      const incomeRows = data.income.map(r =>
        `<tr>
          <td style="padding:8px 12px;font-size:14px;color:#374151;border-top:1px solid #f3f4f6;">${esc(r.label)}${r.note ? ` <span style="color:#9ca3af;font-size:12px;">(${esc(r.note)})</span>` : ''}</td>
          <td style="padding:8px 12px;font-size:14px;color:#374151;text-align:right;border-top:1px solid #f3f4f6;">${Math.abs(r.amount).toLocaleString('ko-KR')}원</td>
        </tr>`
      ).join('');

      const expenseRows = data.expense.length === 0
        ? `<tr><td colspan="2" style="padding:8px 12px;font-size:14px;color:#9ca3af;text-align:center;border-top:1px solid #f3f4f6;">지출 없음</td></tr>`
        : data.expense.map(r =>
          `<tr>
            <td style="padding:8px 12px;font-size:14px;color:#374151;border-top:1px solid #f3f4f6;">${esc(r.label)}${r.note ? ` <span style="color:#9ca3af;font-size:12px;">(${esc(r.note)})</span>` : ''}</td>
            <td style="padding:8px 12px;font-size:14px;color:#374151;text-align:right;border-top:1px solid #f3f4f6;">${Math.abs(r.amount).toLocaleString('ko-KR')}원</td>
          </tr>`
        ).join('');

      const netColor  = data.net < 0 ? '#dc2626' : '#374151';
      const prevColor = data.prevBalance < 0 ? '#dc2626' : '#374151';
      const balColor  = data.currentBalance < 0 ? '#dc2626' : '#111827';

      return `<div style="margin:20px 0;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
    <thead><tr style="background-color:#f9fafb;">
      <th style="padding:10px 12px;font-size:13px;font-weight:600;color:#6b7280;text-align:left;">수입 항목</th>
      <th style="padding:10px 12px;font-size:13px;font-weight:600;color:#6b7280;text-align:right;">금액</th>
    </tr></thead>
    <tbody>
      ${incomeRows}
      <tr style="background-color:#f9fafb;">
        <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#111827;border-top:1px solid #e5e7eb;">총수입</td>
        <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#111827;text-align:right;border-top:1px solid #e5e7eb;">${data.totalIncome.toLocaleString('ko-KR')}원</td>
      </tr>
    </tbody>
  </table>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-top:1px solid #e5e7eb;">
    <thead><tr style="background-color:#f9fafb;">
      <th style="padding:10px 12px;font-size:13px;font-weight:600;color:#6b7280;text-align:left;">지출 항목</th>
      <th style="padding:10px 12px;font-size:13px;font-weight:600;color:#6b7280;text-align:right;">금액</th>
    </tr></thead>
    <tbody>
      ${expenseRows}
      <tr style="background-color:#f9fafb;">
        <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#111827;border-top:1px solid #e5e7eb;">총지출</td>
        <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#111827;text-align:right;border-top:1px solid #e5e7eb;">${data.totalExpense.toLocaleString('ko-KR')}원</td>
      </tr>
    </tbody>
  </table>
  <div style="padding:12px 16px;background-color:#fff7ed;border-top:1px solid #fed7aa;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="font-size:13px;color:#6b7280;padding-bottom:6px;">당월 차액</td>
        <td style="font-size:13px;font-weight:600;color:${netColor};text-align:right;padding-bottom:6px;">${fmtKRW(data.net)}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#6b7280;padding-bottom:6px;">전월 잔액</td>
        <td style="font-size:13px;font-weight:600;color:${prevColor};text-align:right;padding-bottom:6px;">${fmtKRW(data.prevBalance)}</td>
      </tr>
      <tr style="border-top:1px solid #fed7aa;">
        <td style="font-size:14px;font-weight:700;color:#111827;padding-top:8px;">현재 잔액</td>
        <td style="font-size:15px;font-weight:700;color:${balColor};text-align:right;padding-top:8px;">${fmtKRW(data.currentBalance)}</td>
      </tr>
    </table>
  </div>
</div>`;
    }

    default:
      return '';
  }
}

// ── 메인 ─────────────────────────────────────────────────────────────
async function main() {
  loadEnv();

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('오류: RESEND_API_KEY가 .env.local에 없습니다');
    process.exit(1);
  }

  // 뉴스레터 메타
  const newsletters = require(path.join(ROOT, 'src/data/newsletters.json'));
  const meta = newsletters.find(n => n.id === id);
  if (!meta) {
    console.error(`오류: newsletters.json에 id=${id} 항목이 없습니다`);
    process.exit(1);
  }

  // 블록
  const blocksPath = path.join(ROOT, 'src/data/newsletters', `${id}.json`);
  if (!fs.existsSync(blocksPath)) {
    console.error(`오류: src/data/newsletters/${id}.json 파일이 없습니다`);
    process.exit(1);
  }
  const blocks = require(blocksPath);
  const accounting = require(path.join(ROOT, 'src/data/accounting.json'));

  // 이메일 렌더
  const publishedDate = formatDate(meta.publishDate);
  const parts = [
    `<h1 style="font-family:${FONT};font-size:24px;font-weight:900;color:#111827;margin:0 0 8px;line-height:1.3;">${esc(meta.title)}</h1>`,
    `<p style="font-size:13px;color:#9ca3af;margin:0 0 28px;font-family:${FONT};">${publishedDate}</p>`,
    ...blocks.map(b => renderBlock(b, accounting)),
    ctaButton(`${SITE}/news/${id}`, '웹사이트에서 보기'),
  ];
  const html    = renderShell(`활동 보고 · ${publishedDate}`, parts.join('\n'));
  const subject = `예술해방전선 ${meta.title}`;

  // 수신자
  const csvPath = path.join(ROOT, 'private/members.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('오류: private/members.csv 파일이 없습니다');
    process.exit(1);
  }
  const csvLines = fs.readFileSync(csvPath, 'utf8')
    .replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    .split('\n').filter(Boolean);
  const headers = parseRow(csvLines[0]);
  const emailCol = headers.indexOf('이메일');
  if (emailCol < 0) {
    console.error('오류: members.csv에서 이메일 열을 찾을 수 없습니다');
    process.exit(1);
  }
  const recipients = [...new Set(
    csvLines.slice(1)
      .map(line => (parseRow(line)[emailCol] || '').trim())
      .filter(e => EMAIL_RE.test(e))
  )];

  // ── 드라이런 ────────────────────────────────────────────────────────
  if (mode === 'preview') {
    const privateDir = path.join(ROOT, 'private');
    if (!fs.existsSync(privateDir)) fs.mkdirSync(privateDir, { recursive: true });
    const previewPath = path.join(ROOT, `private/preview-${id}.html`);
    fs.writeFileSync(previewPath, html, 'utf8');
    console.log(`\n[드라이런] 발송 안 함`);
    console.log(`  뉴스레터 : #${id} — ${meta.title}`);
    console.log(`  발행일   : ${publishedDate}`);
    console.log(`  수신자   : ${recipients.length}명`);
    recipients.forEach((e, i) => console.log(`    ${i + 1}. ${e}`));
    console.log(`\n  HTML 프리뷰 → ${previewPath}`);
    console.log('  브라우저에서 열어 레이아웃을 확인하세요.\n');
    console.log('실제 발송:');
    console.log(`  --test <이메일>  : 1통 테스트 발송`);
    console.log(`  --send           : 전체 발송\n`);
    return;
  }

  // Resend (ESM 호환 동적 import)
  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);

  // ── 테스트 발송 ─────────────────────────────────────────────────────
  if (mode === 'test') {
    console.log(`\n[테스트 발송] → ${testEmail}`);
    const result = await resend.emails.send({
      from: FROM, to: testEmail, replyTo: REPLY_TO,
      subject: `[테스트] ${subject}`, html,
    });
    if (result.error) {
      console.error('  실패:', result.error.message);
      process.exit(1);
    }
    console.log('  완료 ✓  id:', result.data?.id);
    return;
  }

  // ── 전체 발송 ───────────────────────────────────────────────────────
  console.log(`\n[전체 발송 준비]`);
  console.log(`  뉴스레터 : #${id} — ${meta.title}`);
  console.log(`  수신자   : ${recipients.length}명`);
  recipients.forEach((e, i) => console.log(`    ${i + 1}. ${e}`));
  console.log('\n발송하려면 "보내기"를 입력하세요 (취소: 그냥 Enter):');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise(resolve => {
    rl.question('> ', answer => {
      rl.close();
      if (answer.trim() !== '보내기') {
        console.log('취소됐습니다.');
        process.exit(0);
      }
      resolve();
    });
  });

  let ok = 0, fail = 0;
  console.log('\n발송 중...');
  for (let i = 0; i < recipients.length; i++) {
    const to = recipients[i];
    process.stdout.write(`  [${i + 1}/${recipients.length}] ${to} ... `);
    try {
      const result = await resend.emails.send({
        from: FROM, to, replyTo: REPLY_TO, subject, html,
      });
      if (result.error) {
        console.log(`실패 (${result.error.message})`);
        fail++;
      } else {
        console.log('완료 ✓');
        ok++;
      }
    } catch (err) {
      console.log(`오류 (${err.message})`);
      fail++;
    }
    if (i < recipients.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n완료: 성공 ${ok}건, 실패 ${fail}건`);
  if (fail > 0) process.exit(1);
}

main().catch(err => {
  console.error('오류:', err.message);
  process.exit(1);
});
