'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseCsv, quoteField, toCsvRow } = require('./csv.js');

test('parses a plain header and data rows', () => {
  const rows = parseCsv('이름,이메일\n홍길동,hong@example.com\n');

  assert.deepEqual(rows, [
    ['이름', '이메일'],
    ['홍길동', 'hong@example.com'],
  ]);
});

test('keeps newlines inside quoted fields instead of splitting the row', () => {
  const rows = parseCsv('이름,비고\n홍길동,"첫 줄\n둘째 줄"\n김철수,단일행\n');

  assert.equal(rows.length, 3);
  assert.deepEqual(rows[1], ['홍길동', '첫 줄\n둘째 줄']);
  assert.deepEqual(rows[2], ['김철수', '단일행']);
});

test('keeps commas inside quoted fields', () => {
  const rows = parseCsv('이름,비고\n홍길동,"서울, 대한민국"\n');

  assert.deepEqual(rows[1], ['홍길동', '서울, 대한민국']);
});

test('unescapes doubled quotes', () => {
  const rows = parseCsv('비고\n"그가 ""안녕""이라 했다"\n');

  assert.deepEqual(rows[1], ['그가 "안녕"이라 했다']);
});

test('strips a UTF-8 BOM and normalizes CRLF line endings', () => {
  const rows = parseCsv('﻿이름,이메일\r\n홍길동,hong@example.com\r\n');

  assert.deepEqual(rows[0], ['이름', '이메일']);
  assert.deepEqual(rows[1], ['홍길동', 'hong@example.com']);
});

test('drops blank rows but keeps rows that only have some empty cells', () => {
  const rows = parseCsv('이름,이메일\n\n홍길동,\n,\n');

  assert.deepEqual(rows, [
    ['이름', '이메일'],
    ['홍길동', ''],
  ]);
});

test('handles a final row without a trailing newline', () => {
  const rows = parseCsv('이름,이메일\n홍길동,hong@example.com');

  assert.equal(rows.length, 2);
  assert.deepEqual(rows[1], ['홍길동', 'hong@example.com']);
});

test('round-trips values that contain quotes, commas and newlines', () => {
  const original = ['홍길동', '서울, 대한민국', '줄1\n줄2', '따옴표 "테스트"'];

  const rows = parseCsv(toCsvRow(original) + '\n');

  assert.deepEqual(rows[0], original);
});

test('quoteField renders null and undefined as empty quoted fields', () => {
  assert.equal(quoteField(null), '""');
  assert.equal(quoteField(undefined), '""');
});
