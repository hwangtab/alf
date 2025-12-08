import type { Metadata } from "next";
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/utils/structured-data";

export const metadata: Metadata = {
  title: "예술가 현장 연대 가이드 | 예술해방전선",
  description: "세상의 외침 앞에서 고뇌하는 예술가들을 위한 현장 연대 안내서입니다. 수평적 연대와 상호부조의 가치를 바탕으로, 예술과 삶의 경계를 허물며 함께 걷는 길로 당신을 초대합니다.",
  keywords: ["예술해방전선", "가이드", "참여방법", "활동안내", "연대", "사회참여", "예술활동", "현장연대"],
  alternates: {
    canonical: '/guide',
  },
  openGraph: {
    title: "예술가 현장 연대 가이드 | 예술해방전선",
    description: "세상의 외침 앞에서 고뇌하는 예술가들을 위한 현장 연대 안내서입니다. 수평적 연대와 상호부조의 가치를 바탕으로, 예술과 삶의 경계를 허물며 함께 걷는 길로 당신을 초대합니다.",
    url: 'https://alf.seoul.kr/guide',
    siteName: '예술해방전선',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/social-thumbnail.webp',
        width: 1200,
        height: 630,
        alt: '예술해방전선 현장 연대 가이드',
        type: 'image/webp',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "예술가 현장 연대 가이드 | 예술해방전선",
    description: "세상의 외침 앞에서 고뇌하는 예술가들을 위한 현장 연대 안내서입니다. 수평적 연대와 상호부조의 가치를 바탕으로, 예술과 삶의 경계를 허물며 함께 걷는 길로 당신을 초대합니다.",
    images: ['/images/social-thumbnail.webp'],
  },
};

// 구조화 데이터 생성
const articleSchema = generateArticleSchema(
  "현장 연대를 위한 예술가 가이드",
  "세상의 외침 앞에서 고뇌하는 예술가들을 위한 현장 연대 안내서입니다. 수평적 연대와 상호부조의 가치를 바탕으로, 예술과 삶의 경계를 허물며 함께 걷는 길로 당신을 초대합니다.",
  "2024-01-01",
  new Date().toISOString(),
  ["현장연대", "예술가", "사회운동", "아나키즘", "상호부조"],
  "가이드"
);

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "홈", url: "https://alf.seoul.kr" },
  { name: "가이드", url: "https://alf.seoul.kr/guide" },
]);

const faqSchema = generateFAQSchema([
  {
    question: "현장 연대란 무엇인가요?",
    answer: "현장 연대는 예술가로서 세상과 관계 맺는 방식으로, 예술의 본질적인 힘을 가장 절실한 삶의 현장에서 발견하고 발휘하는 과정입니다.",
  },
  {
    question: "누구나 참여할 수 있나요?",
    answer: "네, 예술가라면 누구나 예술해방전선의 현장 연대 활동에 참여할 수 있습니다. 예술 장르나 경력 수준에 관계없이 환영합니다.",
  },
  {
    question: "어떻게 시작할 수 있나요?",
    answer: "먼저 현장의 맥락을 이해하고, 지역 주민들과 관계를 맺으며, 함께 예술 활동을 계획하는 과정을 통해 연대를 시작할 수 있습니다.",
  },
  {
    question: "어떻게 연락할 수 있나요?",
    answer: "이메일(alf.seoul.kr@gmail.com) 또는 카카오톡 오픈채팅(https://open.kakao.com/me/Alfseoul)으로 연락할 수 있습니다.",
  },
]);

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleSchema, breadcrumbSchema, faqSchema]),
        }}
      />
      {children}
    </>
  );
}
