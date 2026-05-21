import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "활동 보고 | 예술해방전선",
  description: "예술해방전선의 최신 소식과 활동 내용을 담은 활동 보고를 확인하세요.",
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: "활동 보고 | 예술해방전선",
    description: "예술해방전선의 최신 소식과 활동 내용을 담은 활동 보고를 확인하세요.",
    url: 'https://alf.seoul.kr/news',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.webp',
        width: 1200,
        height: 630,
        alt: '예술해방전선 활동 보고',
        type: 'image/webp',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "활동 보고 | 예술해방전선",
    description: "예술해방전선의 최신 소식과 활동 내용을 담은 활동 보고를 확인하세요.",
    images: ['/images/social-thumbnail.webp'],
  },
};
