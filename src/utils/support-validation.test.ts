import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUPPORT_MIN_AMOUNT,
  validateSupportPayload,
  type SupportValidationInput,
} from './support-validation.ts';

const validPayload: SupportValidationInput = {
  name: ' 홍길동 ',
  birthDate: '1990-01-01',
  phone: '010-1234-5678',
  email: ' user@example.com ',
  amount: '10000',
  bank: '국민은행',
  accountNumber: '123456-00-123456',
  holderSameAsApplicant: true,
  accountHolder: '',
  accountHolderPhone: '',
  message: ' 함께하겠습니다 ',
  privacyConsent: true,
  cmsConsent: true,
  company: '',
};

test('normalizes a valid support payload for the same account holder', () => {
  const result = validateSupportPayload(validPayload);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.data.name, '홍길동');
  assert.equal(result.data.email, 'user@example.com');
  assert.equal(result.data.accountHolder, '홍길동');
  assert.equal(result.data.accountHolderPhone, '010-1234-5678');
  assert.equal(result.data.amount, String(SUPPORT_MIN_AMOUNT));
  assert.equal(result.data.message, '함께하겠습니다');
});

test('rejects direct API submissions without required consent', () => {
  const result = validateSupportPayload({
    ...validPayload,
    privacyConsent: false,
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.match(result.error, /동의/);
});

test('rejects invalid calendar dates and amounts below the minimum', () => {
  const invalidDate = validateSupportPayload({
    ...validPayload,
    birthDate: '2024-02-31',
  });
  const invalidAmount = validateSupportPayload({
    ...validPayload,
    amount: String(SUPPORT_MIN_AMOUNT - 1),
  });

  assert.equal(invalidDate.ok, false);
  assert.equal(invalidAmount.ok, false);
});

test('requires account holder details when the holder differs from applicant', () => {
  const result = validateSupportPayload({
    ...validPayload,
    holderSameAsApplicant: false,
    accountHolder: '',
    accountHolderPhone: '',
  });

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.match(result.error, /예금주/);
});
