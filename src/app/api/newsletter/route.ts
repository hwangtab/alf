import { NextResponse } from 'next/server';

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: '이름과 이메일을 모두 입력해주세요.' }, { status: 400 });
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      return NextResponse.json({ error: '이메일 서비스가 올바르게 구성되지 않았습니다.' }, { status: 500 });
    }

    const emailResponse = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          name,
          email,
        },
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      return NextResponse.json({ error: '이메일 전송에 실패했습니다.', details: errorText }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ error: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
