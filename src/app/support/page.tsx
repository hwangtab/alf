import type { Metadata } from 'next';
import SupportForm from './SupportForm';

export const metadata: Metadata = {
  title: '후원하기 | 예술해방전선',
  description: '예술해방전선 후원 회원이 되어 예술로 저항하고 연대하는 활동을 함께 만들어 가세요. 매월 정기 후원과 함께 활동 보고를 받으실 수 있습니다.',
  alternates: { canonical: '/support' },
  openGraph: {
    title: '후원하기 | 예술해방전선',
    description: '예술해방전선 후원 회원이 되어 예술로 저항하고 연대하는 활동을 함께 만들어 가세요.',
    url: 'https://alf.seoul.kr/support',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/images/social-thumbnail.webp', width: 1200, height: 630, alt: '예술해방전선 후원하기' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '후원하기 | 예술해방전선',
    description: '예술해방전선 후원 회원이 되어 예술로 저항하고 연대하는 활동을 함께 만들어 가세요.',
    images: ['/images/social-thumbnail.webp'],
  },
};

export default function SupportPage() {
  return (
    <div className="container mx-auto pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white font-giants-inline animate-fade-in-up mb-6">
            후원하기
          </h1>
          <p className="text-neutral-300 leading-relaxed text-lg">
            예술해방전선은 후원 회원의 정기 후원으로 운영됩니다.
          </p>
        </div>

        {/* 안내 */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: '💳', title: '정기 자동이체', desc: '매월 지정한 날짜에 CMS 자동이체로 후원금이 출금됩니다.' },
            { icon: '📬', title: '활동 보고 수신', desc: '매달 예술해방전선의 활동 보고 뉴스레터를 받으실 수 있습니다.' },
            { icon: '✊', title: '연대', desc: '후원 회원이 되어 예술로 저항하고 소외된 이들과 연대하는 활동의 일원이 됩니다.' },
          ].map((item) => (
            <div key={item.title} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 폼 */}
        <div className="bg-neutral-900/60 border border-neutral-700 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-1">후원 회원 가입 신청</h2>
          <p className="text-sm text-neutral-400 mb-6">아래 양식을 작성해 주시면 단체에서 확인 후 연락드리겠습니다.</p>
          <SupportForm />
        </div>

        {/* 문의 */}
        <p className="text-center text-sm text-neutral-500 mt-8">
          문의사항은{' '}
          <a href="mailto:alf.seoul.kr@gmail.com" className="text-primary-red hover:underline">
            alf.seoul.kr@gmail.com
          </a>
          {' '}또는{' '}
          <a href="https://open.kakao.com/me/Alfseoul" target="_blank" rel="noopener noreferrer" className="text-primary-red hover:underline">
            카카오톡 오픈채팅
          </a>
          으로 연락해 주세요.
        </p>
      </div>
    </div>
  );
}
