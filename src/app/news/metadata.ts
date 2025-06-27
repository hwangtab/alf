import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "뉴스레터 | 예술해방전선",
  description: "예술해방전선의 최신 소식과 활동 내용을 담은 뉴스레터를 확인하세요.",
  openGraph: {
    title: "뉴스레터 | 예술해방전선",
    description: "예술해방전선의 최신 소식과 활동 내용을 담은 뉴스레터를 확인하세요.",
    url: 'https://alf.seoul.kr/news',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: '예술해방전선 뉴스레터',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "뉴스레터 | 예술해방전선",
    description: "예술해방전선의 최신 소식과 활동 내용을 담은 뉴스레터를 확인하세요.",
    images: ['/images/social-thumbnail.jpg'],
  },
};
