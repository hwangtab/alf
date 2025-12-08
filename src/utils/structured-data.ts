/**
 * Schema.org 구조화 데이터 생성 함수
 */

export const generateArticleSchema = (
  title: string,
  description: string,
  datePublished: string,
  dateModified: string = new Date().toISOString(),
  keywords: string[] = [],
  section: string = "문화예술"
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description: description,
  author: {
    "@type": "Organization",
    name: "예술해방전선",
  },
  publisher: {
    "@type": "Organization",
    name: "예술해방전선",
    logo: {
      "@type": "ImageObject",
      url: "https://alf.seoul.kr/images/logo.webp",
    },
  },
  datePublished: datePublished,
  dateModified: dateModified,
  image: "https://alf.seoul.kr/images/social-thumbnail.webp",
  articleSection: section,
  ...(keywords.length > 0 && { keywords: keywords }),
});

export const generateBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export interface FAQItem {
  question: string;
  answer: string;
}

export const generateFAQSchema = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const generateEventSchema = (
  name: string,
  startDate: string,
  endDate?: string,
  location: string = "서울",
  description?: string
) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: name,
  startDate: startDate,
  ...(endDate && { endDate: endDate }),
  location: {
    "@type": "Place",
    name: location,
    address: location === "서울" ? "서울특별시" : location,
  },
  organizer: {
    "@type": "Organization",
    name: "예술해방전선",
    url: "https://alf.seoul.kr",
  },
  ...(description && { description: description }),
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "예술해방전선",
  alternateName: "Art Liberation Front",
  url: "https://alf.seoul.kr",
  logo: "https://alf.seoul.kr/images/logo.webp",
  sameAs: [
    "https://www.facebook.com/artliberationfront",
    "https://www.youtube.com/@artliberationfront",
    "https://open.kakao.com/me/Alfseoul",
  ],
  foundingDate: "2019",
  foundingLocation: {
    "@type": "Place",
    name: "서울, 대한민국",
  },
  areaServed: "대한민국",
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: "alf.seoul.kr@gmail.com",
      contactType: "customer service",
      availableLanguage: ["ko"],
    },
  ],
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "예술해방전선",
  url: "https://alf.seoul.kr",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.google.com/search?q=site:alf.seoul.kr+{search_term_string}",
    "query-input": "required name=search_term_string",
  },
});
