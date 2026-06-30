import Image from 'next/image';
import accountingData from '@/data/accounting.json';
import type { AccountingMonth, NewsletterBlock } from '@/types/newsletter';
import { getYouTubeVideoId } from '@/utils/videos';

function Amount({ value }: { value: number }) {
  const amountClass = value < 0 ? 'text-primary-red' : 'text-neutral-200';
  const text = `${value < 0 ? '-' : ''}${Math.abs(value).toLocaleString('ko-KR')}원`;

  return <span className={`font-medium ${amountClass}`}>{text}</span>;
}

function LedgerBlock({ month }: { month: string }) {
  const data = (accountingData as Record<string, AccountingMonth>)[month];
  if (!data) return null;

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-neutral-700 text-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-neutral-800/60">
            <th className="text-left px-4 py-2 text-neutral-400 font-medium w-2/3">수입 항목</th>
            <th className="text-right px-4 py-2 text-neutral-400 font-medium">금액</th>
          </tr>
        </thead>
        <tbody>
          {data.income.map((row, index) => (
            <tr key={index} className="border-t border-neutral-800">
              <td className="px-4 py-2 text-neutral-200">
                {row.label}
                {row.note && <span className="ml-2 text-neutral-500 text-xs">({row.note})</span>}
              </td>
              <td className="px-4 py-2 text-right text-neutral-200">
                {Math.abs(row.amount).toLocaleString('ko-KR')}원
              </td>
            </tr>
          ))}
          <tr className="border-t border-neutral-600 bg-neutral-800/30">
            <td className="px-4 py-2 font-semibold text-white">총수입</td>
            <td className="px-4 py-2 text-right font-semibold text-white">
              {data.totalIncome.toLocaleString('ko-KR')}원
            </td>
          </tr>
        </tbody>
      </table>

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
            data.expense.map((row, index) => (
              <tr key={index} className="border-t border-neutral-800">
                <td className="px-4 py-2 text-neutral-200">
                  {row.label}
                  {row.note && <span className="ml-2 text-neutral-500 text-xs">({row.note})</span>}
                </td>
                <td className="px-4 py-2 text-right text-neutral-200">
                  {Math.abs(row.amount).toLocaleString('ko-KR')}원
                </td>
              </tr>
            ))
          )}
          <tr className="border-t border-neutral-600 bg-neutral-800/30">
            <td className="px-4 py-2 font-semibold text-white">총지출</td>
            <td className="px-4 py-2 text-right font-semibold text-white">
              {data.totalExpense.toLocaleString('ko-KR')}원
            </td>
          </tr>
        </tbody>
      </table>

      <div className="border-t border-neutral-700 bg-neutral-900/50 px-4 py-3 space-y-1">
        <div className="flex justify-between">
          <span className="text-neutral-400">당월 차액</span>
          <Amount value={data.net} />
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">전월 잔액</span>
          <Amount value={data.prevBalance} />
        </div>
        <div className="flex justify-between border-t border-neutral-700 mt-2 pt-2">
          <span className="text-neutral-300 font-semibold">현재 잔액</span>
          <span className={`font-semibold text-base ${data.currentBalance < 0 ? 'text-primary-red' : 'text-neutral-200'}`}>
            {`${data.currentBalance < 0 ? '-' : ''}${Math.abs(data.currentBalance).toLocaleString('ko-KR')}원`}
          </span>
        </div>
      </div>
    </div>
  );
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

  if (block.type === 'video') {
    const videoId = getYouTubeVideoId(block.url);
    if (!videoId) return null;

    return (
      <figure className="my-6">
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-neutral-800 bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={block.title || '예술해방전선 연대공연 영상'}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        {block.title && (
          <figcaption className="mt-2 text-center text-sm text-neutral-400">
            {block.title}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === 'ledger') {
    return <LedgerBlock month={block.month} />;
  }

  return null;
}

export default function NewsletterBlocks({ blocks }: { blocks: NewsletterBlock[] }) {
  return (
    <article className="space-y-0">
      {blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </article>
  );
}
