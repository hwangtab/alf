import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { welcomeEmail, notifyEmail } from './emailTemplates';
import { getOutboundEmailConfig } from '@/utils/email-config';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: '이름과 이메일을 모두 입력해주세요.' }, { status: 400 });
    }
    if (typeof name !== 'string' || typeof email !== 'string') {
      return NextResponse.json({ error: '요청 항목 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();
    if (!trimmedName || !trimmedEmail) {
      return NextResponse.json({ error: '이름과 이메일을 모두 입력해주세요.' }, { status: 400 });
    }

    if (!EMAIL_RE.test(trimmedEmail)) {
      return NextResponse.json({ error: '이메일 주소가 올바르지 않습니다.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: '이메일 서비스가 올바르게 구성되지 않았습니다.' }, { status: 500 });
    }

    const emailConfig = getOutboundEmailConfig();
    if (!emailConfig.ok) {
      console.error('Newsletter email config error:', emailConfig.error);
      return NextResponse.json({ error: '이메일 서비스가 올바르게 구성되지 않았습니다.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const notify = notifyEmail(trimmedName, trimmedEmail);

    const result = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.orgInbox,
      replyTo: trimmedEmail,
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
    });

    if (result.error) {
      console.error('Newsletter send error:', result.error);
      return NextResponse.json({ error: '이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.' }, { status: 502 });
    }

    const welcome = welcomeEmail(trimmedName);
    try {
      const welcomeResult = await resend.emails.send({
        from: emailConfig.from,
        to: trimmedEmail,
        subject: welcome.subject,
        html: welcome.html,
        text: welcome.text,
      });
      if (welcomeResult.error) {
        console.error('Welcome email failed (non-fatal):', welcomeResult.error);
      }
    } catch (welcomeError) {
      console.error('Welcome email exception (non-fatal):', welcomeError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ error: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
