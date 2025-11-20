'use client';

import { useState, FormEvent } from 'react';
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

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || '구독 신청에 실패했습니다.');
      }

      setStatus('success');
      setEmail('');
      setName('');
    } catch (error) {
      setStatus('error');
      setErrorMessage('구독 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Newsletter signup error:', error);
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
