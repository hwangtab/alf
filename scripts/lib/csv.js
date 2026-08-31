/**
 * CSV 파싱·직렬화 공용 헬퍼.
 *
 * build-members-db.js와 send-mailing.js가 같은 파일(private/members.csv)을 읽으므로
 * 파서가 갈라지면 "DB에 있는데 발송에서 빠지는" 회원이 생긴다. 한 곳에서만 정의한다.
 */

'use strict';

/**
 * CSV 텍스트 전체를 행 배열로 파싱한다.
 *
 * 줄 단위로 먼저 쪼개고 행마다 파싱하는 방식과 달리 따옴표 안의 개행을 필드 값으로
 * 보존한다. 비고란에 여러 줄을 적은 회원이 하나만 있어도 그 뒤 열이 통째로 밀리기 때문에
 * 이 구분이 중요하다.
 *
 * @param {string} text
 * @returns {string[][]} 빈 줄이 제거된 행 목록
 */
function parseCsv(text) {
  const normalized = String(text).replace(/^﻿/, '').replace(/\r\n?/g, '\n');

  const rows = [];
  let row = [];
  let field = '';
  let inQuote = false;

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];

    if (inQuote) {
      if (ch === '"') {
        if (normalized[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuote = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuote = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // 전부 빈 문자열인 행(파일 끝 개행 등)은 데이터가 아니다.
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ''));
}

/** CSV 필드 하나를 항상 따옴표로 감싸 직렬화한다. */
function quoteField(value) {
  return '"' + String(value ?? '').replace(/"/g, '""') + '"';
}

/** 행 배열을 CSV 한 줄로 만든다. */
function toCsvRow(values) {
  return values.map(quoteField).join(',');
}

module.exports = { parseCsv, quoteField, toCsvRow };
