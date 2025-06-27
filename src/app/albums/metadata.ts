import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "음반/작품 | 예술해방전선",
  description: "사회적 메시지를 담은 예술해방전선의 음반과 작품들을 만나보세요.",
  openGraph: {
    title: "음반/작품 | 예술해방전선",
    description: "사회적 메시지를 담은 예술해방전선의 음반과 작품들을 만나보세요.",
    url: 'https://alf.seoul.kr/albums',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: '예술해방전선 음반/작품',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "음반/작품 | 예술해방전선",
    description: "사회적 메시지를 담은 예술해방전선의 음반과 작품들을 만나보세요.",
    images: ['/images/social-thumbnail.jpg'],
  },
};
