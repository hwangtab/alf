import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientNoiseBackground from "@/components/layout/ClientNoiseBackground";

// 성능 최적화: Noto Sans KR과 Noto Serif KR 폰트 로드 - 필요한 웨이트만
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // 300, 900 제거로 번들 크기 감소
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr", 
  subsets: ["latin"],
  weight: ["400", "700"], // 900 제거
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const metadata: Metadata = {
  // 기본 정보
  title: {
    default: "예술해방전선 | 예술로 세상을 바꾸다", // 기본 타이틀
    template: "%s | 예술해방전선", // 하위 페이지 타이틀 형식
  },
  description: "예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대하며, 모두가 존엄하게 살아갈 수 있는 세상을 만드는 데 기여합니다.",
  keywords: ["예술해방전선", "ALF", "사회운동", "예술활동", "연대", "저항예술", "문화예술"],
  
  // 작성자 및 소유권
  creator: "예술해방전선",
  publisher: "예술해방전선",
  
  // URL 및 기본 경로
  metadataBase: new URL('https://alf.seoul.kr'),
  alternates: {
    canonical: 'https://alf.seoul.kr',
  },

  // 검색엔진 제어
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // 소셜 공유 (Open Graph)
  openGraph: {
    title: "예술해방전선 | 예술로 세상을 바꾸다",
    description: "예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대합니다.",
    url: 'https://alf.seoul.kr',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.webp', // .jpg -> .webp로 변경 예정
        width: 1200,
        height: 630,
        alt: '예술해방전선 - 예술로 세상을 바꾸다',
        type: 'image/webp',
      }
    ],
  },

  // 트위터 공유
  twitter: {
    card: 'summary_large_image',
    title: "예술해방전선 | 예술로 세상을 바꾸다",
    description: "예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대합니다.",
    images: ['/images/social-thumbnail.webp'], // .jpg -> .webp
  },

  // 아이콘 및 테마
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#000000',

  // 기타
  applicationName: '예술해방전선',
  referrer: 'origin-when-cross-origin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        {/* 성능 최적화: DNS 프리커넥트 및 리소스 힌트 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://alf.seoul.kr" />
        
        {/* 뷰포트 최적화 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        
        {/* 성능 힌트 */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        <meta name="naver-site-verification" content="4ecf68d648f283081a2bbc8f9ee4a15e27c8626d" />
      </head>
      <body
        className={`${notoSansKR.variable} ${notoSerifKR.variable} antialiased flex flex-col min-h-screen relative bg-black text-white`}
        style={{ fontFamily: `var(--font-noto-sans-kr), 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, sans-serif` }}
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
