import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "예술가 현장 연대 가이드 | 예술해방전선",
  description: "세상의 외침 앞에서 고뇌하는 예술가들을 위한 현장 연대 안내서입니다. 수평적 연대와 상호부조의 가치를 바탕으로, 예술과 삶의 경계를 허물며 함께 걷는 길로 당신을 초대합니다.",
  openGraph: {
    title: "예술가 현장 연대 가이드 | 예술해방전선",
    description: "세상의 외침 앞에서 고뇌하는 예술가들을 위한 현장 연대 안내서입니다. 수평적 연대와 상호부조의 가치를 바탕으로, 예술과 삶의 경계를 허물며 함께 걷는 길로 당신을 초대합니다.",
    url: 'https://alf.seoul.kr/guide',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.webp', // .jpg -> .webp로 변경
        width: 1200,
        height: 630,
        alt: '예술해방전선 현장 연대 가이드',
        type: 'image/webp', // MIME 타입 변경
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "예술가 현장 연대 가이드 | 예술해방전선",
    description: "세상의 외침 앞에서 고뇌하는 예술가들을 위한 현장 연대 안내서입니다. 수평적 연대와 상호부조의 가치를 바탕으로, 예술과 삶의 경계를 허물며 함께 걷는 길로 당신을 초대합니다.",
    images: ['/images/social-thumbnail.webp'], // .jpg -> .webp로 변경
  },
};