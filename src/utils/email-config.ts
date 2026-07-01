const DEFAULT_EMAIL_FROM = '예술해방전선 <noreply@alf.seoul.kr>';
const DEFAULT_ORG_INBOX = 'alf.seoul.kr@gmail.com';

type EmailSettingResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

export type OutboundEmailConfig =
  | { ok: true; from: string; orgInbox: string }
  | { ok: false; error: string };

function resolveEmailSetting(envName: string, fallback: string): EmailSettingResult {
  const configured = process.env[envName];
  if (configured === undefined) {
    return { ok: true, value: fallback };
  }

  const value = configured.trim();
  if (!value) {
    return { ok: false, error: `${envName} 환경변수가 비어 있습니다.` };
  }

  return { ok: true, value };
}

export function getOutboundEmailConfig(): OutboundEmailConfig {
  const from = resolveEmailSetting('ALF_EMAIL_FROM', DEFAULT_EMAIL_FROM);
  if (!from.ok) return from;

  const orgInbox = resolveEmailSetting('ALF_ORG_INBOX', DEFAULT_ORG_INBOX);
  if (!orgInbox.ok) return orgInbox;

  return {
    ok: true,
    from: from.value,
    orgInbox: orgInbox.value,
  };
}
