const SITE = 'https://alf.seoul.kr';
const FB = 'https://www.facebook.com/artliberationfront';
const YT = 'https://www.youtube.com/@artliberationfront';
const FONT = "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', '맑은 고딕', sans-serif";

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function renderShell(subtitle: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f0f0f0;font-family:${FONT};">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f0f0;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#ff5a1f;background-image:linear-gradient(135deg,#ff3d3d,#ff7b00);padding:36px 40px;">
              <div style="font-family:${FONT};font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
                예술해방전선
              </div>
              <div style="font-family:${FONT};font-size:13px;color:rgba(255,255,255,0.85);margin-top:8px;letter-spacing:0.3px;">
                ${subtitle}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;color:#1f2937;font-size:16px;line-height:1.75;font-family:${FONT};">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;font-family:${FONT};">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size:13px;color:#6b7280;line-height:1.8;">
                    <a href="${FB}" style="color:#ff5a1f;text-decoration:none;font-weight:600;">Facebook</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${YT}" style="color:#ff5a1f;text-decoration:none;font-weight:600;">YouTube</a>
                    &nbsp;&middot;&nbsp;
                    <a href="mailto:alf.seoul.kr@gmail.com" style="color:#ff5a1f;text-decoration:none;font-weight:600;">alf.seoul.kr@gmail.com</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:8px;font-size:12px;color:#9ca3af;">
                    &copy; 예술해방전선 &middot; 예술로 저항하고 연대합니다
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 12px;">
    <tr>
      <td bgcolor="#ff3d3d" style="background-color:#ff3d3d;border-radius:8px;">
        <a href="${href}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-family:${FONT};font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function navLinks(): string {
  const links: [string, string][] = [
    ['활동', `${SITE}/activities`],
    ['갤러리', `${SITE}/gallery`],
    ['가이드', `${SITE}/guide`],
  ];
  return `<p style="margin:16px 0 0;font-size:14px;color:#6b7280;">
    ${links.map(([label, href]) =>
      `<a href="${href}" style="color:#ff7b00;text-decoration:none;font-weight:600;">${label}</a>`
    ).join('&nbsp;&nbsp;&middot;&nbsp;&nbsp;')}
  </p>`;
}

export function welcomeEmail(name: string): { subject: string; html: string; text: string } {
  const safeName = escapeHtml(name);
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:#111827;line-height:1.4;">
      ${safeName}님, 환영합니다 🎨
    </p>
    <p style="margin:0 0 14px;color:#374151;">
      예술해방전선 소식 구독을 신청해 주셔서 감사합니다.
    </p>
    <p style="margin:0 0 4px;color:#374151;">
      예술로 저항하고 연대하는 예술해방전선의 소식과 활동 기록을 이메일로 전해드리겠습니다.
      지금 바로 웹사이트에서 활동 기록과 갤러리를 확인해 보세요.
    </p>
    ${ctaButton(SITE, '웹사이트 둘러보기')}
    ${navLinks()}
  `;
  return {
    subject: '예술해방전선 소식 구독을 환영합니다',
    html: renderShell('예술로 저항하고 연대합니다', bodyHtml),
    text: [
      `${name}님, 예술해방전선 소식 구독을 신청해 주셔서 감사합니다.`,
      '',
      `웹사이트: ${SITE}`,
      `활동: ${SITE}/activities`,
      `갤러리: ${SITE}/gallery`,
      `가이드: ${SITE}/guide`,
      '',
      '© 예술해방전선',
    ].join('\n'),
  };
}

export type SupporterData = {
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  amount: string;
  withdrawalDate: string;
  bank: string;
  accountNumber: string;
  accountHolder: string;
  message?: string;
};

function infoRow(label: string, value: string, highlight = false): string {
  return `<tr>
    <td style="font-size:13px;color:#6b7280;padding-bottom:10px;width:110px;vertical-align:top;">${label}</td>
    <td style="font-size:${highlight ? '16' : '15'}px;color:${highlight ? '#b91c1c' : '#111827'};font-weight:${highlight ? '700' : '600'};padding-bottom:10px;">${value}</td>
  </tr>`;
}

export function supporterNotifyEmail(data: SupporterData): { subject: string; html: string; text: string } {
  const e = escapeHtml;
  const bodyHtml = `
    <p style="margin:0 0 20px;font-size:17px;font-weight:600;color:#111827;">
      새 후원 회원 가입 신청이 접수됐습니다.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f9fafb;border-radius:8px;margin:0 0 16px;">
      <tr><td style="padding:20px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          ${infoRow('이름', e(data.name))}
          ${infoRow('생년월일', e(data.birthDate))}
          ${infoRow('연락처', e(data.phone))}
          ${infoRow('이메일', e(data.email))}
        </table>
      </td></tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fff7ed;border-radius:8px;margin:0 0 16px;border:1px solid #fed7aa;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#c2410c;letter-spacing:0.5px;">CMS 자동이체 정보</p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          ${infoRow('월 후원금액', e(data.amount) + '원', true)}
          ${infoRow('출금일', '매월 ' + e(data.withdrawalDate) + '일')}
          ${infoRow('은행', e(data.bank))}
          ${infoRow('계좌번호', e(data.accountNumber), true)}
          ${infoRow('예금주', e(data.accountHolder))}
        </table>
      </td></tr>
    </table>
    ${data.message ? `<div style="background-color:#f9fafb;border-radius:8px;padding:16px 20px;margin:0 0 16px;font-size:14px;color:#374151;">${e(data.message)}</div>` : ''}
    <p style="margin:0;font-size:14px;color:#6b7280;background-color:#fff7ed;border-left:3px solid #ff7b00;padding:12px 16px;border-radius:0 6px 6px 0;">
      이 메일에 회신하면 신청자(${e(data.email)})에게 바로 답장됩니다.
    </p>
  `;
  return {
    subject: `새 후원 가입 신청: ${data.name} (${data.amount}원)`,
    html: renderShell('후원 회원 신청 알림', bodyHtml),
    text: [
      '새 후원 회원 가입 신청',
      '',
      `이름: ${data.name}`,
      `생년월일: ${data.birthDate}`,
      `연락처: ${data.phone}`,
      `이메일: ${data.email}`,
      '',
      '[CMS 자동이체]',
      `월 후원금액: ${data.amount}원`,
      `출금일: 매월 ${data.withdrawalDate}일`,
      `은행: ${data.bank}`,
      `계좌번호: ${data.accountNumber}`,
      `예금주: ${data.accountHolder}`,
      ...(data.message ? ['', `메모: ${data.message}`] : []),
      '',
      '이 메일에 회신하면 신청자에게 바로 답장됩니다.',
    ].join('\n'),
  };
}

export function supporterWelcomeEmail(name: string): { subject: string; html: string; text: string } {
  const safeName = escapeHtml(name);
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:#111827;line-height:1.4;">
      ${safeName}님, 신청해 주셔서 감사합니다
    </p>
    <p style="margin:0 0 14px;color:#374151;">
      예술해방전선 후원 회원 가입 신청이 접수됐습니다.
    </p>
    <p style="margin:0 0 14px;color:#374151;">
      단체에서 가입 내용을 확인하고 CMS 자동이체를 등록해 드리겠습니다.
      문의가 있으시면 <a href="mailto:alf.seoul.kr@gmail.com" style="color:#ff5a1f;">alf.seoul.kr@gmail.com</a>으로 연락해 주세요.
    </p>
    ${ctaButton(SITE, '웹사이트 둘러보기')}
    ${navLinks()}
  `;
  return {
    subject: '예술해방전선 후원 회원 가입 신청이 접수됐습니다',
    html: renderShell('후원해 주셔서 감사합니다', bodyHtml),
    text: [
      `${name}님, 예술해방전선 후원 회원 가입 신청이 접수됐습니다.`,
      '',
      '단체에서 가입 내용을 확인하고 CMS 자동이체를 등록해 드리겠습니다.',
      '문의: alf.seoul.kr@gmail.com',
      '',
      `웹사이트: ${SITE}`,
    ].join('\n'),
  };
}

export function notifyEmail(
  name: string,
  email: string,
): { subject: string; html: string; text: string } {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const bodyHtml = `
    <p style="margin:0 0 20px;font-size:17px;font-weight:600;color:#111827;">
      새 소식 구독 신청이 접수됐습니다.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f9fafb;border-radius:8px;margin:0 0 24px;">
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="font-size:13px;color:#6b7280;padding-bottom:10px;width:72px;vertical-align:top;">이름</td>
              <td style="font-size:15px;color:#111827;font-weight:600;padding-bottom:10px;">${safeName}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#6b7280;vertical-align:top;">이메일</td>
              <td style="font-size:15px;color:#111827;font-weight:600;">${safeEmail}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:14px;color:#6b7280;background-color:#fff7ed;border-left:3px solid #ff7b00;padding:12px 16px;border-radius:0 6px 6px 0;">
      이 메일에 회신하면 신청자(${safeEmail})에게 바로 답장됩니다.
    </p>
  `;
  return {
    subject: `새 소식 구독 신청: ${name}`,
    html: renderShell('관리자 알림', bodyHtml),
    text: [
      '새 소식 구독 신청',
      `이름: ${name}`,
      `이메일: ${email}`,
      '',
      '이 메일에 회신하면 신청자에게 바로 답장됩니다.',
    ].join('\n'),
  };
}
