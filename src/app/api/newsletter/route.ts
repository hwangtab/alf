import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { welcomeEmail, notifyEmail } from './emailTemplates';

const FROM = '예술해방전선 <noreply@alf.seoul.kr>';
const ORG_INBOX = 'alf.seoul.kr@gmail.com';

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: '이름과 이메일을 모두 입력해주세요.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: '이메일 서비스가 올바르게 구성되지 않았습니다.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const notify = notifyEmail(name, email);

    const result = await resend.emails.send({
      from: FROM,
      to: ORG_INBOX,
      replyTo: email,
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
    });

    if (result.error) {
      return NextResponse.json({ error: '이메일 전송에 실패했습니다.', details: result.error.message }, { status: 502 });
    }

    const welcome = welcomeEmail(name);
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: welcome.subject,
      html: welcome.html,
      text: welcome.text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ error: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
