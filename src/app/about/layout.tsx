import type { Metadata } from "next";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/utils/structured-data";

export const metadata: Metadata = {
  title: "소개 | 예술해방전선",
  description: "예술해방전선의 창립 배경과 가치관을 소개합니다. 2019년 노량진수산시장에서 시작된 예술을 통한 연대와 저항의 여정을 확인하세요.",
  keywords: ["예술해방전선", "소개", "창립배경", "가치관", "노량진수산시장", "예술연대", "저항예술"],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "소개 | 예술해방전선",
    description: "예술해방전선의 창립 배경과 가치관을 소개합니다. 2019년 노량진수산시장에서 시작된 예술을 통한 연대와 저항의 여정을 확인하세요.",
    url: 'https://alf.seoul.kr/about',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.webp',
        width: 1200,
        height: 630,
        alt: '예술해방전선 소개 - 예술을 통한 연대와 저항',
        type: 'image/webp',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "소개 | 예술해방전선",
    description: "예술해방전선의 창립 배경과 가치관을 소개합니다. 2019년 노량진수산시장에서 시작된 예술을 통한 연대와 저항의 여정을 확인하세요.",
    images: ['/images/social-thumbnail.webp'],
  },
};

// 구조화 데이터 생성
const articleSchema = generateArticleSchema(
  "예술해방전선 소개",
  "예술해방전선의 창립 배경과 가치관을 소개합니다. 2019년 노량진수산시장에서 시작된 예술을 통한 연대와 저항의 여정을 확인하세요.",
  "2019-01-01",
  new Date().toISOString(),
  ["창립배경", "가치관", "예술연대", "저항예술", "수평적 관계"],
  "소개"
);

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "홈", url: "https://alf.seoul.kr" },
  { name: "소개", url: "https://alf.seoul.kr/about" },
]);

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleSchema, breadcrumbSchema]),
        }}
      />
      {children}
    </>
  );
}
