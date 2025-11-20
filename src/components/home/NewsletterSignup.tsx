'use client';

import { useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button'; // Button 컴포넌트 임포트

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      setStatus('error');
      setErrorMessage('이름과 이메일을 모두 입력해주세요.');
      return;
    }

    setStatus('submitting');

    // 환경 변수에서 EmailJS 설정 읽기
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    // 환경 변수 검증
    if (!serviceId || !templateId || !publicKey) {
      setStatus('error');
      setErrorMessage('EmailJS 설정이 올바르지 않습니다. 관리자에게 문의하세요.');
      console.error('EmailJS environment variables are not set');
      return;
    }

    try {
      // 직접 할당된 값 사용, 키 이름을 EmailJS 템플릿 변수와 일치시킴
      await emailjs.send(
        serviceId, 
        templateId,
        {
          name: name, // user_name -> name
          email: email, // user_email -> email
          // subscription_type은 템플릿에 없으므로 제거하거나, 
          // 템플릿에 맞는 변수(예: service)로 변경. 여기서는 제거.
          // service: 'newsletter' // 만약 템플릿에 {{service}}가 있다면 이렇게 사용
        },
        publicKey
      );

      setStatus('success');
      setEmail('');
      setName('');
    } catch (error) {
      setStatus('error');
      setErrorMessage('구독 신청 중 오류가 발생하고 있습니다. 다시 시도해주세요.');
      console.error('EmailJS error:', error);
    }
  };

  return (
    <section className="bg-orange-100 py-16 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-orange-900 font-serif">예술해방전선 소식 받기</h2> {/* Added text-orange-900 */}
        <p className="text-lg mb-8 text-orange-800 whitespace-normal font-sans"> {/* Added text-orange-800 and whitespace-normal */}
          예술해방전선의 최신 활동과 소식을 이메일로 받아보세요.
        </p>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 text-green-800 p-4 rounded-lg mb-6"
          >
            구독 신청이 완료됐습니다. 감사합니다!
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg">
                {errorMessage}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                className="px-4 py-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition placeholder-gray-500 text-gray-800" // text-gray-800 추가
                disabled={status === 'submitting'}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                className="px-4 py-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition placeholder-gray-500 text-gray-800" // text-gray-800 추가
                disabled={status === 'submitting'}
              />
            </div>

            {/* Button 컴포넌트 사용 */}
            <Button 
              type="submit" 
              variant="primary" 
              size="md" 
              disabled={status === 'submitting'}
              // motion props 직접 전달 가능 (기본 hover/tap 효과 사용)
            >
              {status === 'submitting' ? '처리 중...' : '구독하기'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
