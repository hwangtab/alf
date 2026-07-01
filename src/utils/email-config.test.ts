import test from 'node:test';
import assert from 'node:assert/strict';
import { getOutboundEmailConfig } from './email-config.ts';

const ORIGINAL_ENV = { ...process.env };

test.afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

test('uses explicit outbound email settings when provided', () => {
  process.env.ALF_EMAIL_FROM = 'ALF <hello@example.com>';
  process.env.ALF_ORG_INBOX = 'team@example.com';

  const config = getOutboundEmailConfig();

  assert.equal(config.ok, true);
  if (!config.ok) return;
  assert.equal(config.from, 'ALF <hello@example.com>');
  assert.equal(config.orgInbox, 'team@example.com');
});

test('keeps production-safe defaults when outbound email settings are absent', () => {
  delete process.env.ALF_EMAIL_FROM;
  delete process.env.ALF_ORG_INBOX;

  const config = getOutboundEmailConfig();

  assert.equal(config.ok, true);
  if (!config.ok) return;
  assert.equal(config.from, '예술해방전선 <noreply@alf.seoul.kr>');
  assert.equal(config.orgInbox, 'alf.seoul.kr@gmail.com');
});

test('rejects blank outbound email settings instead of silently falling back', () => {
  process.env.ALF_EMAIL_FROM = '   ';
  delete process.env.ALF_ORG_INBOX;

  const config = getOutboundEmailConfig();

  assert.equal(config.ok, false);
  if (config.ok) return;
  assert.match(config.error, /ALF_EMAIL_FROM/);
});
