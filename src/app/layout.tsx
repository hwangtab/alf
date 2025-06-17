import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Inter로 변경
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

export const metadata: Metadata = {
  title: "예술해방전선 | 예술로 세상을 바꾸다",
  description: "예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대하며, 모두가 존엄하게 살아갈 수 있는 세상을 만드는 데 기여합니다.",
  keywords: "예술해방전선, 사회운동, 예술활동, 연대, 저항예술",
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
        <meta name="naver-site-verification" content="4ecf68d648f283081a2bbc8f9ee4a15e27c8626d" />
      </head>
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen relative bg-black text-white`} // 변수명 변경 적용
      >
        {/* 노이즈 텍스처 배경 (클라이언트 컴포넌트로 분리) */}
        <ClientNoiseBackground />
        
        {/* 메인 콘텐츠 */}
        <div className="flex flex-col min-h-screen relative z-10">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
