import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/utils/structured-data';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// next/font/local을 사용한 폰트 최적화
// Light만 있던 시절 font-bold가 합성 볼드(가짜 굵기)로 뭉개지던 문제를 없애기 위해
// Medium(500)/Bold(700)을 실제 웨이트로 등록한다. 세 웨이트 모두
// `npm run subset:fonts`로 만든 서브셋(상용 한글 2,350자 + 사이트 문자)이다.

const gmarketSans = localFont({
  src: [
    { path: '../fonts/GmarketSansTTFLight.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/GmarketSansTTFMedium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/GmarketSansTTFBold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-gmarket-sans',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
  // display:swap이라 fallback으로 즉시 렌더된다. preload를 끄면 초기 대역폭을
  // LCP 요소(히어로 H1의 Giants-Inline)와 크리티컬 리소스에 양보한다.
  preload: false,
});

const sfHambak = localFont({
  // 원본 SFTTF.woff2(570KB)는 소스로만 두고, 실제 로딩은 서브셋을 쓴다
  // (`npm run subset:fonts -- sf`).
  src: '../fonts/SFTTF.subset.woff2',
  variable: '--font-sf-hambak',
  // 파일은 ExtraBold 한 종류뿐이다. 굵기 범위를 선언해 두면 h1~h6의
  // font-weight(700~900)에 브라우저가 합성 볼드를 덧입히지 않는다.
  weight: '400 900',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  // 첫 화면(히어로)에 직접 쓰이지 않고 스크롤 아래 제목에만 쓰인다. preload 불필요.
  preload: false,
});


export const metadata: Metadata = {
  // 기본 정보
  title: {
    default: "예술해방전선 | 예술로 세상을 바꾸다",
    template: "%s | 예술해방전선",
  },
  description: "예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대하며, 모두가 존엄하게 살아갈 수 있는 세상을 만드는 데 기여합니다.",
  keywords: ["예술해방전선", "ALF", "사회운동", "예술활동", "연대", "저항예술", "문화예술"],
  
  // 작성자 및 소유권
  creator: "예술해방전선",
  publisher: "예술해방전선",
  
  // URL 및 기본 경로
  metadataBase: new URL('https://alf.seoul.kr'),
  alternates: {
    canonical: '/',
  },

  // 검색엔진 제어
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
        url: '/images/social-thumbnail.webp',
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
    images: ['/images/social-thumbnail.webp'],
  },

  // 아이콘 및 테마
  icons: {
    icon: '/favicon.ico',
  },

  // 기타 최적화
  applicationName: '예술해방전선',
  referrer: 'origin-when-cross-origin',
  verification: {
    other: {
      'naver-site-verification': '4ecf68d648f283081a2bbc8f9ee4a15e27c8626d',
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`scroll-smooth ${gmarketSans.variable} ${sfHambak.variable}`}>
      <head>
        {/* 히어로 LCP 요소가 쓰는 폰트. 23KB 서브셋이라 preload 비용이 작다.
            폰트 preload는 same-origin이어도 crossOrigin이 필요하다. */}
        <link
          rel="preload"
          href="/fonts/Giants-Inline.subset.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([generateOrganizationSchema(), generateWebsiteSchema()]),
          }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen relative bg-black text-white font-sans">
        {/* 키보드 사용자가 고정 헤더의 링크 9개를 매번 지나치지 않도록 */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-primary-red focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          본문 바로가기
        </a>

        <div className="fixed inset-0 bg-black z-0" />
        
        {/* 메인 콘텐츠 */}
        <div className="flex flex-col min-h-screen relative z-[1]">
          <Header />
          <main id="main" className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
