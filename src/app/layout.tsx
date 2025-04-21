import type { Metadata } from "next";
import { Inter, Noto_Serif_KR } from "next/font/google"; // Noto_Serif_KR 추가
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientNoiseBackground from "@/components/layout/ClientNoiseBackground";

// 성능 최적화: 필요한 폰트만 로드
// Inter로 변경
const inter = Inter({
  variable: "--font-inter", // 변수명 변경
  subsets: ["latin"],
  display: 'swap',
});

// Noto Serif KR 폰트 로드 및 변수 설정
const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "700"], // 필요한 weight 추가
  display: 'swap',
});

export const metadata: Metadata = {
  title: "예술해방전선 | 예술로, 쫓겨난 이들의 곁을 지킨다", // 태그라인 다시 변경
  description: "예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대하며, 모두가 존엄하게 살아갈 수 있는 세상을 만드는 데 기여합니다.",
  keywords: "예술해방전선, 사회운동, 예술활동, 연대, 저항예술",
  // Open Graph 메타데이터 추가
  openGraph: {
    title: "예술해방전선 | 예술로, 쫓겨난 이들의 곁을 지킨다", // 태그라인 다시 변경
    description: "예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대합니다.",
    url: "https://alf.seoul.kr", // 웹사이트 URL
    siteName: "예술해방전선 아카이브",
    images: [
      {
        url: "https://www.news-art.co.kr/data/photos/20250417/art_17452208266505_6c8c7d.jpg", // 외부 URL로 변경
        width: 1200, // 이미지 너비 (권장)
        height: 630, // 이미지 높이 (권장)
        alt: "예술해방전선 아카이브 썸네일",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        {/* 성능 최적화: 프리로드 및 프리커넥트 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 성능 최적화: 뷰포트 설정 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body
        className={`${inter.variable} ${notoSerifKR.variable} antialiased flex flex-col min-h-screen bg-black text-white`} // notoSerifKR.variable 추가
      >
        {/* 노이즈 텍스처 배경 (클라이언트 컴포넌트로 분리) */}
        <ClientNoiseBackground />

        {/* Header를 메인 래퍼 밖으로 이동 */}
        <Header />

        {/* 메인 콘텐츠 - 헤더 높이만큼 padding-top 추가 */}
        <div className="flex flex-col min-h-screen pt-[80px]"> {/* pt-[80px] 추가 */}
          {/* <Header /> */} {/* Header 이동 */}
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        {/* Portal root for mobile drawer */}
        <div id="drawer-root"></div>
      </body>
    </html>
  );
}
