import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "비디오 | 예술해방전선",
  description: "예술해방전선의 활동과 메시지를 담은 영상들을 시청하세요. 현장의 목소리와 예술을 통한 연대의 순간들을 영상으로 만나보세요.",
  keywords: ["예술해방전선", "비디오", "영상", "다큐멘터리", "현장", "메시지", "연대"],
  openGraph: {
    title: "비디오 | 예술해방전선",
    description: "예술해방전선의 활동과 메시지를 담은 영상들을 시청하세요. 현장의 목소리와 예술을 통한 연대의 순간들을 영상으로 만나보세요.",
    url: 'https://alf.seoul.kr/videos',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.jpg',
        width: 1200,
        height: 630,
        alt: '예술해방전선 비디오 - 활동 영상',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "비디오 | 예술해방전선",
    description: "예술해방전선의 활동과 메시지를 담은 영상들을 시청하세요. 현장의 목소리와 예술을 통한 연대의 순간들을 영상으로 만나보세요.",
    images: ['/images/social-thumbnail.jpg'],
  },
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
