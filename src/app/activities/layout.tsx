import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "활동 | 예술해방전선",
  description: "음반 발매, 공연, 현장 연대, 네트워크 활동, 아티스트 지원, 전시회 개최 등 예술해방전선의 다양한 활동들을 소개합니다.",
  keywords: ["예술해방전선", "활동", "음반발매", "공연", "현장연대", "네트워크", "아티스트지원", "전시회"],
  openGraph: {
    title: "활동 | 예술해방전선",
    description: "음반 발매, 공연, 현장 연대, 네트워크 활동, 아티스트 지원, 전시회 개최 등 예술해방전선의 다양한 활동들을 소개합니다.",
    url: 'https://alf.seoul.kr/activities',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: '예술해방전선 활동',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "활동 | 예술해방전선",
    description: "음반 발매, 공연, 현장 연대, 네트워크 활동, 아티스트 지원, 전시회 개최 등 예술해방전선의 다양한 활동들을 소개합니다.",
    images: ['/images/social-thumbnail.jpg'],
  },
};

export default function ActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
