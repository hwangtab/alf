import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "소개 | 예술해방전선",
  description: "예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대하며, 모두가 존엄하게 살아갈 수 있는 세상을 만드는 예술해방전선을 소개합니다.",
  openGraph: {
    title: "소개 | 예술해방전선",
    description: "예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대하며, 모두가 존엄하게 살아갈 수 있는 세상을 만드는 예술해방전선을 소개합니다.",
    url: 'https://alf.seoul.kr/about',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: '예술해방전선 소개',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "소개 | 예술해방전선",
    description: "예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대하며, 모두가 존엄하게 살아갈 수 있는 세상을 만드는 예술해방전선을 소개합니다.",
    images: ['/images/social-thumbnail.jpg'],
  },
};