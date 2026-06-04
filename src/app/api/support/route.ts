import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supporterNotifyEmail, supporterWelcomeEmail, type SupporterData } from '../newsletter/emailTemplates';

const FROM = '예술해방전선 <noreply@alf.seoul.kr>';
const ORG_INBOX = 'alf.seoul.kr@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}$/;
const BIRTHDATE_RE = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
const AMOUNT_RE = /^\d+$/;

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

function areStrings(values: unknown[]) {
  return values.every((value) => typeof value === 'string');
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '요청 본문이 올바른 JSON 형식이 아닙니다.' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: '요청 본문이 올바른 JSON 객체가 아닙니다.' }, { status: 400 });
    }

    const {
      name, birthDate, phone, email,
      amount, bank, accountNumber,
      holderSameAsApplicant, accountHolder, accountHolderPhone,
      message,
      company, // honeypot
    } = body;

    if (company) {
      return NextResponse.json({ success: true });
    }

    const required = { name, birthDate, phone, email, amount, bank, accountNumber };
    if (Object.values(required).some((v) => !String(v ?? '').trim())) {
      return NextResponse.json({ error: '모든 필수 항목을 입력해주세요.' }, { status: 400 });
    }
    if (!areStrings(Object.values(required))) {
      return NextResponse.json({ error: '요청 항목 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    const trimmedEmail = String(email).trim();
    if (!EMAIL_RE.test(trimmedEmail)) {
      return NextResponse.json({ error: '이메일 주소가 올바르지 않습니다.' }, { status: 400 });
    }

    if (!PHONE_RE.test(String(phone).replace(/\s/g, ''))) {
      return NextResponse.json({ error: '전화번호 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    if (!isValidBirthDate(String(birthDate))) {
      return NextResponse.json({ error: '생년월일을 YYYY-MM-DD 형식으로 입력해주세요.' }, { status: 400 });
    }

    const trimmedAmount = amount.trim();
    const monthlyAmount = Number(trimmedAmount);
    if (!AMOUNT_RE.test(trimmedAmount) || !Number.isFinite(monthlyAmount) || monthlyAmount < 10000) {
      return NextResponse.json({ error: '월 후원금액은 10,000원 이상이어야 합니다.' }, { status: 400 });
    }

    if (holderSameAsApplicant !== undefined && typeof holderSameAsApplicant !== 'boolean') {
      return NextResponse.json({ error: '예금주 동일 여부 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    if (message !== undefined && message !== null && typeof message !== 'string') {
      return NextResponse.json({ error: '남기고 싶은 말 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    const sameHolder = holderSameAsApplicant !== false;
    if (!sameHolder) {
      if (!String(accountHolder ?? '').trim() || !String(accountHolderPhone ?? '').trim()) {
        return NextResponse.json({ error: '예금주 이름과 연락처를 입력해주세요.' }, { status: 400 });
      }
      if (!areStrings([accountHolder, accountHolderPhone])) {
        return NextResponse.json({ error: '예금주 항목 형식이 올바르지 않습니다.' }, { status: 400 });
      }
      if (!PHONE_RE.test(String(accountHolderPhone).replace(/\s/g, ''))) {
        return NextResponse.json({ error: '예금주 연락처 형식이 올바르지 않습니다.' }, { status: 400 });
      }
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: '이메일 서비스가 올바르게 구성되지 않았습니다.' }, { status: 500 });
    }

    const data: SupporterData = {
      name: String(name).trim(),
      birthDate: String(birthDate).trim(),
      phone: String(phone).trim(),
      email: trimmedEmail,
      amount: trimmedAmount,
      bank: String(bank).trim(),
      accountNumber: String(accountNumber).trim(),
      accountHolder: sameHolder ? String(name).trim() : String(accountHolder).trim(),
      accountHolderPhone: sameHolder ? String(phone).trim() : String(accountHolderPhone).trim(),
      message: message ? String(message).trim() : undefined,
    };

    const resend = new Resend(apiKey);
    const notify = supporterNotifyEmail(data);

    const { error } = await resend.emails.send({
      from: FROM,
      to: ORG_INBOX,
      replyTo: data.email,
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
    });

    if (error) {
      console.error('Support send error:', error);
      return NextResponse.json({ error: '이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.' }, { status: 502 });
    }

    const welcome = supporterWelcomeEmail(data.name);
    try {
      const welcomeResult = await resend.emails.send({
        from: FROM,
        to: data.email,
        subject: welcome.subject,
        html: welcome.html,
        text: welcome.text,
      });
      if (welcomeResult.error) {
        console.error('Supporter welcome email failed (non-fatal):', welcomeResult.error);
      }
    } catch (welcomeError) {
      console.error('Supporter welcome email exception (non-fatal):', welcomeError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Support API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
