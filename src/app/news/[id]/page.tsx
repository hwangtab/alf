import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NewsletterBlocks from '@/components/newsletter/NewsletterBlocks';
import newslettersData from '@/data/newsletters.json';
import { newsletterContent, migratedIds } from '@/data/newsletterContent';
import {
  absoluteSiteImageUrl,
  formatNewsletterDate,
  getNewsletterMeta,
  getNewsletterNavigation,
  getNewsletterOgImage,
  type NewsletterMeta,
} from '@/utils/newsletters';

const baseUrl = 'https://alf.seoul.kr';
const newsletters = newslettersData as NewsletterMeta[];

// 활동 보고 상세 페이지 최상단 히어로 이미지 — 모든 호 공통 브랜드 로고
const HERO_IMAGE = '/images/gallery/예술해방전선로고정사각.webp';

export async function generateStaticParams() {
  return migratedIds.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  const meta = getNewsletterMeta(newsletters, id);
  const blocks = newsletterContent[id];
  if (!meta || !blocks) return {};

  const ogImage = getNewsletterOgImage(meta, blocks);
  const absoluteOgImage = absoluteSiteImageUrl(baseUrl, ogImage);

  return {
    title: `${meta.title} | 예술해방전선 활동 보고`,
    description: meta.summary || `예술해방전선 ${meta.title} 소식지를 확인하세요.`,
    alternates: { canonical: `/news/${id}` },
    openGraph: {
      title: `${meta.title} | 예술해방전선 활동 보고`,
      description: meta.summary || `예술해방전선 ${meta.title} 소식지`,
      url: `${baseUrl}/news/${id}`,
      siteName: '예술해방전선',
      locale: 'ko_KR',
      type: 'article',
      publishedTime: meta.publishDate,
      images: [{ url: absoluteOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} | 예술해방전선 활동 보고`,
      description: meta.summary || `예술해방전선 ${meta.title} 소식지`,
      images: [absoluteOgImage],
    },
  };
}

export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  const blocks = newsletterContent[id];

  if (isNaN(id) || !blocks) {
    notFound();
  }

  const meta = getNewsletterMeta(newsletters, id);
  if (!meta) notFound();

  const { prevId, nextId, prevMeta, nextMeta } = getNewsletterNavigation(newsletters, migratedIds, id);

  return (
    <div className="container mx-auto pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm mb-8 transition-colors duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          활동 보고 목록
        </Link>

        <header className="mb-10 border-b border-neutral-700 pb-8">
          <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden border border-neutral-800 mb-6 bg-black">
            <Image
              src={HERO_IMAGE}
              alt="예술해방전선"
              fill
              priority
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
              quality={90}
            />
          </div>
          <h1 className="text-4xl font-bold text-white font-giants-inline mb-3 animate-fade-in-up">
            {meta.title}
          </h1>
          <time
            dateTime={meta.publishDate}
            className="text-sm text-neutral-400"
          >
            {formatNewsletterDate(meta.publishDate)}
          </time>
        </header>

        <NewsletterBlocks blocks={blocks} />

        <nav
          className="mt-16 pt-8 border-t border-neutral-700 flex flex-col sm:flex-row justify-between gap-4"
          aria-label="이전/다음 활동 보고"
        >
          {prevMeta ? (
            <Link
              href={`/news/${prevId}`}
              className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-150"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">
                <span className="block text-xs text-neutral-500 mb-0.5">이전 호</span>
                {prevMeta.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextMeta ? (
            <Link
              href={`/news/${nextId}`}
              className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-150 sm:text-right"
            >
              <span className="text-sm">
                <span className="block text-xs text-neutral-500 mb-0.5">다음 호</span>
                {nextMeta.title}
              </span>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}
