export const SUPPORT_MIN_AMOUNT = 10000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}$/;
const BIRTHDATE_RE = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
const AMOUNT_RE = /^\d+$/;

export type SupportValidationInput = {
  name?: unknown;
  birthDate?: unknown;
  phone?: unknown;
  email?: unknown;
  amount?: unknown;
  bank?: unknown;
  accountNumber?: unknown;
  holderSameAsApplicant?: unknown;
  accountHolder?: unknown;
  accountHolderPhone?: unknown;
  message?: unknown;
  privacyConsent?: unknown;
  cmsConsent?: unknown;
  company?: unknown;
};

export type NormalizedSupporterData = {
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  amount: string;
  bank: string;
  accountNumber: string;
  accountHolder: string;
  accountHolderPhone: string;
  message?: string;
};

export type SupportValidationResult =
  | { ok: true; data: NormalizedSupporterData }
  | { ok: false; error: string };

function isValidBirthDate(value: string) {
  if (!BIRTHDATE_RE.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getTime() <= todayUtc
  );
}

function asRequiredString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isStringOrEmpty(value: unknown) {
  return value === undefined || value === null || typeof value === 'string';
}

export function validateSupportPayload(input: unknown): SupportValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: '요청 본문이 올바른 JSON 객체가 아닙니다.' };
  }

  const body = input as SupportValidationInput;

  if (body.privacyConsent !== true || body.cmsConsent !== true) {
    return { ok: false, error: '개인정보 수집·이용 동의 및 CMS 자동이체 동의가 필요합니다.' };
  }

  const name = asRequiredString(body.name);
  const birthDate = asRequiredString(body.birthDate);
  const phone = asRequiredString(body.phone);
  const email = asRequiredString(body.email);
  const amount = asRequiredString(body.amount);
  const bank = asRequiredString(body.bank);
  const accountNumber = asRequiredString(body.accountNumber);

  // asRequiredString은 비-문자열을 ''로 만들므로, 아래 필수값 검사를 통과하면
  // 각 값은 이미 비어 있지 않은 문자열임이 보장된다(별도 타입 재검증 불필요).
  if (!name || !birthDate || !phone || !email || !amount || !bank || !accountNumber) {
    return { ok: false, error: '모든 필수 항목을 입력해주세요.' };
  }

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: '이메일 주소가 올바르지 않습니다.' };
  }

  if (!PHONE_RE.test(phone.replace(/\s/g, ''))) {
    return { ok: false, error: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)' };
  }

  if (!isValidBirthDate(birthDate)) {
    return { ok: false, error: '생년월일을 YYYY-MM-DD 형식으로 입력해주세요.' };
  }

  const monthlyAmount = Number(amount);
  if (!AMOUNT_RE.test(amount) || !Number.isFinite(monthlyAmount) || monthlyAmount < SUPPORT_MIN_AMOUNT) {
    return { ok: false, error: '월 후원금액은 10,000원 이상이어야 합니다.' };
  }

  if (body.holderSameAsApplicant !== undefined && typeof body.holderSameAsApplicant !== 'boolean') {
    return { ok: false, error: '예금주 동일 여부 형식이 올바르지 않습니다.' };
  }

  if (!isStringOrEmpty(body.message)) {
    return { ok: false, error: '남기고 싶은 말 형식이 올바르지 않습니다.' };
  }

  const sameHolder = body.holderSameAsApplicant !== false;
  const accountHolder = sameHolder ? name : asRequiredString(body.accountHolder);
  const accountHolderPhone = sameHolder ? phone : asRequiredString(body.accountHolderPhone);

  if (!sameHolder) {
    if (!accountHolder || !accountHolderPhone) {
      return { ok: false, error: '예금주 이름과 연락처를 입력해주세요.' };
    }
    if (typeof body.accountHolder !== 'string' || typeof body.accountHolderPhone !== 'string') {
      return { ok: false, error: '예금주 항목 형식이 올바르지 않습니다.' };
    }
    if (!PHONE_RE.test(accountHolderPhone.replace(/\s/g, ''))) {
      return { ok: false, error: '예금주 연락처 형식이 올바르지 않습니다. (예: 010-1234-5678)' };
    }
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';

  return {
    ok: true,
    data: {
      name,
      birthDate,
      phone,
      email,
      amount,
      bank,
      accountNumber,
      accountHolder,
      accountHolderPhone,
      ...(message ? { message } : {}),
    },
  };
}
