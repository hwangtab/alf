import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "갤러리 | 예술해방전선",
  description: "예술해방전선의 활동 모습을 담은 사진들을 감상하세요.",
  openGraph: {
    title: "갤러리 | 예술해방전선",
    description: "예술해방전선의 활동 모습을 담은 사진들을 감상하세요.",
    url: 'https://alf.seoul.kr/gallery',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: '예술해방전선 갤러리',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "갤러리 | 예술해방전선",
    description: "예술해방전선의 활동 모습을 담은 사진들을 감상하세요.",
    images: ['/images/social-thumbnail.jpg'],
  },
};
