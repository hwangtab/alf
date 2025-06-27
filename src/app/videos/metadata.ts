import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "비디오 | 예술해방전선",
  description: "예술해방전선의 다양한 활동 영상과 공연 기록을 감상하세요.",
  openGraph: {
    title: "비디오 | 예술해방전선",
    description: "예술해방전선의 다양한 활동 영상과 공연 기록을 감상하세요.",
    url: 'https://alf.seoul.kr/videos',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: '예술해방전선 비디오',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "비디오 | 예술해방전선",
    description: "예술해방전선의 다양한 활동 영상과 공연 기록을 감상하세요.",
    images: ['/images/social-thumbnail.jpg'],
  },
};
