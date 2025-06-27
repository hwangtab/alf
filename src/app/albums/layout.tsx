import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "음반/작품 | 예술해방전선",
  description: "예술해방전선에서 발매한 음반과 다양한 예술 작품들을 만나보세요. 사회적 메시지를 담은 음악과 저항 예술 작품들을 소개합니다.",
  keywords: ["예술해방전선", "음반", "앨범", "작품", "음악", "저항예술", "사회적메시지"],
  openGraph: {
    title: "음반/작품 | 예술해방전선",
    description: "예술해방전선에서 발매한 음반과 다양한 예술 작품들을 만나보세요. 사회적 메시지를 담은 음악과 저항 예술 작품들을 소개합니다.",
    url: 'https://alf.seoul.kr/albums',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: '예술해방전선 음반 및 작품',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "음반/작품 | 예술해방전선",
    description: "예술해방전선에서 발매한 음반과 다양한 예술 작품들을 만나보세요. 사회적 메시지를 담은 음악과 저항 예술 작품들을 소개합니다.",
    images: ['/images/social-thumbnail.jpg'],
  },
};

export default function AlbumsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
