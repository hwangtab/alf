import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import newslettersData from '@/data/newsletters.json';
import { newsletterContent, migratedIds } from '@/data/newsletterContent';
import type { NewsletterBlock, AccountingMonth } from '@/types/newsletter';
import accountingData from '@/data/accounting.json';

const baseUrl = 'https://alf.seoul.kr';

type NewsletterMeta = {
  id: number;
  title: string;
  publishDate: string;
  link: string;
  summary?: string;
  thumbnail?: string;
};

function getMeta(id: number): NewsletterMeta | undefined {
  return (newslettersData as NewsletterMeta[]).find((n) => n.id === id);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

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
  const meta = getMeta(id);
  if (!meta || !newsletterContent[id]) return {};

  const firstImage = newsletterContent[id].find((b) => b.type === 'image') as
    | { type: 'image'; src: string; alt: string }
    | undefined;
  const ogImage = meta.thumbnail || firstImage?.src || '/images/social-thumbnail.webp';

  return {
    title: `${meta.title} | 예술해방전선 뉴스레터`,
    description: meta.summary || `예술해방전선 ${meta.title} 소식지를 확인하세요.`,
    alternates: { canonical: `/news/${id}` },
    openGraph: {
      title: `${meta.title} | 예술해방전선 뉴스레터`,
      description: meta.summary || `예술해방전선 ${meta.title} 소식지`,
      url: `${baseUrl}/news/${id}`,
      siteName: '예술해방전선',
      locale: 'ko_KR',
      type: 'article',
      publishedTime: meta.publishDate,
      images: [{ url: ogImage.startsWith('/') ? `${baseUrl}${ogImage}` : ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} | 예술해방전선 뉴스레터`,
      description: meta.summary || `예술해방전선 ${meta.title} 소식지`,
      images: [ogImage.startsWith('/') ? `${baseUrl}${ogImage}` : ogImage],
    },
  };
}

function BlockRenderer({ block }: { block: NewsletterBlock }) {
  if (block.type === 'heading') {
    if (block.level === 2) {
      return (
        <h2 className="text-2xl font-bold text-white mt-10 mb-4 font-serif border-b border-neutral-700 pb-3">
          {block.text}
        </h2>
      );
    }
    return (
      <h3 className="text-xl font-semibold text-white mt-8 mb-3">
        {block.text}
      </h3>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <p className="text-base text-neutral-200 leading-relaxed mb-4">
        {block.text}
      </p>
    );
  }

  if (block.type === 'image') {
    return (
      <div className="my-6 rounded-lg overflow-hidden border border-neutral-800">
        <Image
          src={block.src}
          alt={block.alt}
          width={800}
          height={500}
          sizes="(min-width: 768px) 720px, 100vw"
          className="w-full h-auto object-contain"
          quality={85}
        />
      </div>
    );
  }

  if (block.type === 'link') {
    return (
      <p className="my-4">
        <a
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary-red hover:underline text-sm font-medium"
        >
          {block.text}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </p>
    );
  }

  if (block.type === 'ledger') {
    const data = (accountingData as Record<string, AccountingMonth>)[block.month];
    if (!data) return null;

    const fmt = (n: number) =>
      (n < 0 ? '-' : '') + Math.abs(n).toLocaleString('ko-KR') + '원';
    const amtClass = (n: number) =>
      n < 0 ? 'text-primary-red' : 'text-neutral-200';

    return (
      <div className="my-6 rounded-lg overflow-hidden border border-neutral-700 text-sm">
        {/* 수입 */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-800/60">
              <th className="text-left px-4 py-2 text-neutral-400 font-medium w-2/3">수입 항목</th>
              <th className="text-right px-4 py-2 text-neutral-400 font-medium">금액</th>
            </tr>
          </thead>
          <tbody>
            {data.income.map((row, i) => (
              <tr key={i} className="border-t border-neutral-800">
                <td className="px-4 py-2 text-neutral-200">
                  {row.label}
                  {row.note && <span className="ml-2 text-neutral-500 text-xs">({row.note})</span>}
                </td>
                <td className="px-4 py-2 text-right text-neutral-200">{Math.abs(row.amount).toLocaleString('ko-KR')}원</td>
              </tr>
            ))}
            <tr className="border-t border-neutral-600 bg-neutral-800/30">
              <td className="px-4 py-2 font-semibold text-white">총수입</td>
              <td className="px-4 py-2 text-right font-semibold text-white">{data.totalIncome.toLocaleString('ko-KR')}원</td>
            </tr>
          </tbody>
        </table>

        {/* 지출 */}
        <table className="w-full border-collapse border-t border-neutral-700">
          <thead>
            <tr className="bg-neutral-800/60">
              <th className="text-left px-4 py-2 text-neutral-400 font-medium w-2/3">지출 항목</th>
              <th className="text-right px-4 py-2 text-neutral-400 font-medium">금액</th>
            </tr>
          </thead>
          <tbody>
            {data.expense.length === 0 ? (
              <tr className="border-t border-neutral-800">
                <td colSpan={2} className="px-4 py-2 text-neutral-500 text-center">지출 없음</td>
              </tr>
            ) : (
              data.expense.map((row, i) => (
                <tr key={i} className="border-t border-neutral-800">
                  <td className="px-4 py-2 text-neutral-200">
                    {row.label}
                    {row.note && <span className="ml-2 text-neutral-500 text-xs">({row.note})</span>}
                  </td>
                  <td className="px-4 py-2 text-right text-neutral-200">{Math.abs(row.amount).toLocaleString('ko-KR')}원</td>
                </tr>
              ))
            )}
            <tr className="border-t border-neutral-600 bg-neutral-800/30">
              <td className="px-4 py-2 font-semibold text-white">총지출</td>
              <td className="px-4 py-2 text-right font-semibold text-white">{data.totalExpense.toLocaleString('ko-KR')}원</td>
            </tr>
          </tbody>
        </table>

        {/* 요약 */}
        <div className="border-t border-neutral-700 bg-neutral-900/50 px-4 py-3 space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-400">당월 차액</span>
            <span className={`font-medium ${amtClass(data.net)}`}>{fmt(data.net)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">전월 잔액</span>
            <span className={`font-medium ${amtClass(data.prevBalance)}`}>{fmt(data.prevBalance)}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-700 mt-2 pt-2">
            <span className="text-neutral-300 font-semibold">현재 잔액</span>
            <span className={`font-semibold text-base ${amtClass(data.currentBalance)}`}>{fmt(data.currentBalance)}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id) || !newsletterContent[id]) {
    notFound();
  }

  const meta = getMeta(id);
  if (!meta) notFound();

  const blocks = newsletterContent[id];

  // 이전/다음 호 (발행일 순 기준, 마이그레이션된 호 내에서)
  const sortedIds = migratedIds.slice().sort((a, b) => {
    const ma = getMeta(a);
    const mb = getMeta(b);
    return new Date(ma!.publishDate).getTime() - new Date(mb!.publishDate).getTime();
  });
  const currentIdx = sortedIds.indexOf(id);
  const prevId = currentIdx > 0 ? sortedIds[currentIdx - 1] : null;
  const nextId = currentIdx < sortedIds.length - 1 ? sortedIds[currentIdx + 1] : null;
  const prevMeta = prevId ? getMeta(prevId) : null;
  const nextMeta = nextId ? getMeta(nextId) : null;

  return (
    <div className="container mx-auto pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 뒤로 가기 */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm mb-8 transition-colors duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          뉴스레터 목록
        </Link>

        {/* 헤더 */}
        <header className="mb-10 border-b border-neutral-700 pb-8">
          {meta.thumbnail && (
            <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden border border-neutral-800 mb-6 bg-neutral-900">
              <Image
                src={meta.thumbnail}
                alt={`${meta.title} 썸네일`}
                fill
                priority
                sizes="(min-width: 768px) 720px, 100vw"
                className="object-cover"
                quality={90}
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-white font-giants-inline mb-3 animate-fade-in-up">
            {meta.title}
          </h1>
          <time
            dateTime={meta.publishDate}
            className="text-sm text-neutral-400"
          >
            {formatDate(meta.publishDate)}
          </time>
        </header>

        {/* 본문 블록 */}
        <article className="space-y-0">
          {blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </article>

        {/* 이전/다음 네비게이션 */}
        <nav
          className="mt-16 pt-8 border-t border-neutral-700 flex flex-col sm:flex-row justify-between gap-4"
          aria-label="이전/다음 뉴스레터"
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
