import test from 'node:test';
import assert from 'node:assert/strict';
import { consumeRateLimit, getClientKey, resetRateLimitStore } from './rate-limit.ts';

const HOUR = 60 * 60 * 1000;

test.beforeEach(() => {
  resetRateLimitStore();
});

test('allows requests up to the limit and blocks the next one', () => {
  const start = 1_000_000;

  for (let attempt = 1; attempt <= 3; attempt++) {
    assert.equal(consumeRateLimit('ip-a', 3, HOUR, start).ok, true, `attempt ${attempt}`);
  }

  const blocked = consumeRateLimit('ip-a', 3, HOUR, start);
  assert.equal(blocked.ok, false);
  if (blocked.ok) return;
  assert.equal(blocked.retryAfterSeconds, 3600);
});

test('keeps separate counters per key', () => {
  const start = 1_000_000;

  assert.equal(consumeRateLimit('ip-a', 1, HOUR, start).ok, true);
  assert.equal(consumeRateLimit('ip-a', 1, HOUR, start).ok, false);
  assert.equal(consumeRateLimit('ip-b', 1, HOUR, start).ok, true);
});

test('frees the slot once the window has slid past the earliest hit', () => {
  const start = 1_000_000;

  assert.equal(consumeRateLimit('ip-a', 1, HOUR, start).ok, true);
  assert.equal(consumeRateLimit('ip-a', 1, HOUR, start + HOUR - 1).ok, false);
  assert.equal(consumeRateLimit('ip-a', 1, HOUR, start + HOUR + 1).ok, true);
});

test('reports shrinking retry-after as the window slides', () => {
  const start = 1_000_000;
  consumeRateLimit('ip-a', 1, HOUR, start);

  const halfway = consumeRateLimit('ip-a', 1, HOUR, start + HOUR / 2);
  assert.equal(halfway.ok, false);
  if (halfway.ok) return;
  assert.equal(halfway.retryAfterSeconds, 1800);
});

test('a blocked attempt does not extend the window', () => {
  const start = 1_000_000;
  consumeRateLimit('ip-a', 1, HOUR, start);
  consumeRateLimit('ip-a', 1, HOUR, start + 1000);

  assert.equal(consumeRateLimit('ip-a', 1, HOUR, start + HOUR + 1).ok, true);
});

test('derives the client key from the first x-forwarded-for hop', () => {
  const request = new Request('https://alf.seoul.kr/api/support', {
    headers: { 'x-forwarded-for': '203.0.113.7, 70.41.3.18' },
  });

  assert.equal(getClientKey(request), '203.0.113.7');
});

test('falls back to x-real-ip and then to a shared unknown key', () => {
  const realIp = new Request('https://alf.seoul.kr/api/support', {
    headers: { 'x-real-ip': '198.51.100.4' },
  });
  assert.equal(getClientKey(realIp), '198.51.100.4');

  const bare = new Request('https://alf.seoul.kr/api/support');
  assert.equal(getClientKey(bare), 'unknown');
});
