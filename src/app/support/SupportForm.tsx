'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

type FormData = {
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  amount: string;
  bank: string;
  accountNumber: string;
  holderSameAsApplicant: boolean;
  accountHolder: string;
  accountHolderPhone: string;
  message: string;
  privacyConsent: boolean;
  cmsConsent: boolean;
  company: string; // honeypot
};

const INITIAL: FormData = {
  name: '', birthDate: '', phone: '', email: '',
  amount: '', bank: '',
  accountNumber: '', holderSameAsApplicant: true,
  accountHolder: '', accountHolderPhone: '', message: '',
  privacyConsent: false, cmsConsent: false, company: '',
};

const inputCls = 'bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition';
const labelCls = 'block text-sm font-medium text-neutral-300 mb-1';
const sectionTitleCls = 'text-base font-bold text-white mb-4 mt-8 pt-6 border-t border-neutral-700';

export default function SupportForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    if (!form.privacyConsent || !form.cmsConsent) {
      setStatus('error');
      setErrorMessage('개인정보 수집·이용 동의 및 CMS 자동이체 동의가 필요합니다.');
      return;
    }

    const required: (keyof FormData)[] = ['name', 'birthDate', 'phone', 'email', 'amount', 'bank', 'accountNumber'];
    for (const key of required) {
      if (!String(form[key]).trim()) {
        setStatus('error');
        setErrorMessage('모든 필수 항목(*)을 입력해주세요.');
        return;
      }
    }

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_RE.test(form.email)) {
      setStatus('error');
      setErrorMessage('이메일 주소 형식이 올바르지 않습니다.');
      return;
    }

    const PHONE_RE = /^0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}$/;
    if (!PHONE_RE.test(form.phone.replace(/\s/g, ''))) {
      setStatus('error');
      setErrorMessage('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
      return;
    }

    const BIRTHDATE_RE = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
    if (!BIRTHDATE_RE.test(form.birthDate)) {
      setStatus('error');
      setErrorMessage('생년월일을 YYYY-MM-DD 형식으로 입력해주세요. (예: 1990-01-01)');
      return;
    }

    if (Number(form.amount) < 10000) {
      setStatus('error');
      setErrorMessage('월 후원금액은 10,000원 이상이어야 합니다.');
      return;
    }

    if (!form.holderSameAsApplicant) {
      if (!form.accountHolder.trim() || !form.accountHolderPhone.trim()) {
        setStatus('error');
        setErrorMessage('예금주 이름과 연락처를 입력해주세요.');
        return;
      }
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          accountHolder: form.holderSameAsApplicant ? form.name.trim() : form.accountHolder.trim(),
          accountHolderPhone: form.holderSameAsApplicant ? form.phone.trim() : form.accountHolderPhone.trim(),
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || '신청에 실패했습니다.');
      }

      setStatus('success');
      setForm(INITIAL);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : '신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">❤</div>
        <h2 className="text-2xl font-bold text-white mb-3">신청이 완료됐습니다</h2>
        <p className="text-neutral-300 leading-relaxed">
          가입 내용을 검토 후 CMS 자동이체를 등록해 드리겠습니다.<br />
          접수 확인 메일을 발송했으니 확인해 주세요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-1">
      {/* honeypot */}
      <input
        name="company"
        value={form.company}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {status === 'error' && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 p-4 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* 개인정보 */}
      <p className={sectionTitleCls}>개인정보</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelCls}>이름 *</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
            placeholder="홍길동" className={inputCls} disabled={status === 'submitting'} />
        </div>
        <div>
          <label htmlFor="birthDate" className={labelCls}>생년월일 * <span className="text-neutral-500 font-normal">(CMS 본인확인)</span></label>
          <input id="birthDate" name="birthDate" type="text" value={form.birthDate} onChange={handleChange}
            placeholder="YYYY-MM-DD" className={inputCls} disabled={status === 'submitting'} />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>연락처 *</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
            placeholder="010-0000-0000" className={inputCls} disabled={status === 'submitting'} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>이메일 *</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="example@email.com" className={inputCls} disabled={status === 'submitting'} />
        </div>
      </div>

      {/* 회비 정보 */}
      <p className={sectionTitleCls}>회비 정보</p>
      <div>
        <label htmlFor="amount" className={labelCls}>월 회비 * <span className="text-neutral-500 font-normal">(원, 최소 10,000원)</span></label>
        <input id="amount" name="amount" type="text" inputMode="numeric" value={form.amount} onChange={handleChange}
          placeholder="10000" className={inputCls} disabled={status === 'submitting'} />
      </div>

      {/* 계좌 정보 */}
      <p className={sectionTitleCls}>CMS 자동이체 계좌 정보</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bank" className={labelCls}>은행명 *</label>
          <input id="bank" name="bank" type="text" value={form.bank} onChange={handleChange}
            placeholder="국민은행" className={inputCls} disabled={status === 'submitting'} />
        </div>
        <div>
          <label htmlFor="accountNumber" className={labelCls}>계좌번호 *</label>
          <input id="accountNumber" name="accountNumber" type="text" inputMode="numeric"
            value={form.accountNumber} onChange={handleChange}
            placeholder="000000-00-000000" className={inputCls} disabled={status === 'submitting'} />
        </div>
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="holderSameAsApplicant"
              checked={form.holderSameAsApplicant}
              onChange={handleChange}
              className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 accent-primary-red flex-shrink-0"
              disabled={status === 'submitting'}
            />
            <span className="text-sm text-neutral-300">예금주가 신청자 본인과 동일합니다</span>
          </label>
        </div>

        {!form.holderSameAsApplicant && (
          <>
            <div>
              <label htmlFor="accountHolder" className={labelCls}>예금주 이름 *</label>
              <input id="accountHolder" name="accountHolder" type="text" value={form.accountHolder} onChange={handleChange}
                placeholder="예금주 이름" className={inputCls} disabled={status === 'submitting'} />
            </div>
            <div>
              <label htmlFor="accountHolderPhone" className={labelCls}>예금주 연락처 * <span className="text-neutral-500 font-normal">(CMS 본인확인)</span></label>
              <input id="accountHolderPhone" name="accountHolderPhone" type="tel" value={form.accountHolderPhone} onChange={handleChange}
                placeholder="010-0000-0000" className={inputCls} disabled={status === 'submitting'} />
            </div>
          </>
        )}
      </div>

      {/* 메시지 */}
      <p className={sectionTitleCls}>남기고 싶은 말 <span className="text-neutral-500 font-normal text-sm">(선택)</span></p>
      <textarea name="message" value={form.message} onChange={handleChange} rows={3}
        placeholder="단체에 전하고 싶은 말을 자유롭게 남겨주세요."
        className={`${inputCls} resize-none`} disabled={status === 'submitting'} />

      {/* 개인정보 고지 */}
      <div className="bg-neutral-800/60 border border-neutral-700 rounded-lg p-4 text-xs text-neutral-400 leading-relaxed mt-6">
        <p className="font-semibold text-neutral-300 mb-2">개인정보 수집·이용 고지</p>
        <ul className="space-y-1 list-disc pl-4">
          <li><span className="text-neutral-300">수집 항목:</span> 이름, 생년월일, 연락처, 이메일, 은행명, 계좌번호, 예금주, 예금주 연락처(예금주가 다를 경우)</li>
          <li><span className="text-neutral-300">수집·이용 목적:</span> 정기 회원 관리, CMS 자동이체 신청, 활동 보고 발송</li>
          <li><span className="text-neutral-300">보유·이용 기간:</span> 회원 탈퇴 후 즉시 파기</li>
          <li>동의를 거부하실 수 있으나, 거부 시 정기 회원 가입이 불가합니다.</li>
        </ul>
      </div>

      {/* 동의 */}
      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" name="privacyConsent" checked={form.privacyConsent} onChange={handleChange}
            className="mt-0.5 w-4 h-4 rounded border-neutral-600 bg-neutral-800 accent-primary-red flex-shrink-0" />
          <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
            <span className="text-primary-red font-semibold">[필수]</span> 개인정보 수집·이용에 동의합니다.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" name="cmsConsent" checked={form.cmsConsent} onChange={handleChange}
            className="mt-0.5 w-4 h-4 rounded border-neutral-600 bg-neutral-800 accent-primary-red flex-shrink-0" />
          <span className="text-sm text-neutral-300 group-hover:text-white transition-colors">
            <span className="text-primary-red font-semibold">[필수]</span> 위 계좌에서 매월 회비가 자동이체(CMS 출금)되는 것에 동의합니다.
          </span>
        </label>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-primary-red hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-base"
        >
          {status === 'submitting' ? '처리 중...' : '정기 회원 가입 신청'}
        </button>
      </div>
    </form>
  );
}
