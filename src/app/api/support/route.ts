import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supporterNotifyEmail, supporterWelcomeEmail, type SupporterData } from '../newsletter/emailTemplates';
import { validateSupportPayload } from '@/utils/support-validation';

const FROM = '예술해방전선 <noreply@alf.seoul.kr>';
const ORG_INBOX = 'alf.seoul.kr@gmail.com';

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

    const { company } = body as { company?: unknown };

    if (company) {
      return NextResponse.json({ success: true });
    }

    const validation = validateSupportPayload(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: '이메일 서비스가 올바르게 구성되지 않았습니다.' }, { status: 500 });
    }

    const data: SupporterData = validation.data;

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
