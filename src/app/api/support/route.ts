import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supporterNotifyEmail, supporterWelcomeEmail, type SupporterData } from '../newsletter/emailTemplates';

const FROM = '예술해방전선 <noreply@alf.seoul.kr>';
const ORG_INBOX = 'alf.seoul.kr@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: '이메일 주소가 올바르지 않습니다.' }, { status: 400 });
    }

    if (Number(amount) < 10000) {
      return NextResponse.json({ error: '월 후원금액은 10,000원 이상이어야 합니다.' }, { status: 400 });
    }

    const sameHolder = holderSameAsApplicant !== false;
    if (!sameHolder) {
      if (!String(accountHolder ?? '').trim() || !String(accountHolderPhone ?? '').trim()) {
        return NextResponse.json({ error: '예금주 이름과 연락처를 입력해주세요.' }, { status: 400 });
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
      email: String(email).trim(),
      amount: String(amount).trim(),
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
