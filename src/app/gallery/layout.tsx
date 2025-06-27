import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "갤러리 | 예술해방전선",
  description: "예술해방전선의 활동 현장과 작품들을 사진으로 만나보세요. 연대와 저항의 현장에서 기록한 소중한 순간들을 공유합니다.",
  keywords: ["예술해방전선", "갤러리", "사진", "현장", "활동", "연대", "저항", "기록"],
  openGraph: {
    title: "갤러리 | 예술해방전선",
    description: "예술해방전선의 활동 현장과 작품들을 사진으로 만나보세요. 연대와 저항의 현장에서 기록한 소중한 순간들을 공유합니다.",
    url: 'https://alf.seoul.kr/gallery',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: '예술해방전선 갤러리 - 활동 현장 사진',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "갤러리 | 예술해방전선",
    description: "예술해방전선의 활동 현장과 작품들을 사진으로 만나보세요. 연대와 저항의 현장에서 기록한 소중한 순간들을 공유합니다.",
    images: ['/images/social-thumbnail.jpg'],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
