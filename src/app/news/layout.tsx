import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "뉴스레터 | 예술해방전선",
  description: "예술해방전선의 소식과 활동 소식을 담은 뉴스레터를 확인하세요. 최신 활동 소식과 연대 현장의 이야기들을 전해드립니다.",
  keywords: ["예술해방전선", "뉴스레터", "소식", "활동소식", "연대현장", "이야기"],
  openGraph: {
    title: "뉴스레터 | 예술해방전선",
    description: "예술해방전선의 소식과 활동 소식을 담은 뉴스레터를 확인하세요. 최신 활동 소식과 연대 현장의 이야기들을 전해드립니다.",
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
    description: "예술해방전선의 소식과 활동 소식을 담은 뉴스레터를 확인하세요. 최신 활동 소식과 연대 현장의 이야기들을 전해드립니다.",
    images: ['/images/social-thumbnail.jpg'],
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
