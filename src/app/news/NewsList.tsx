'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';

const NEWS_PER_PAGE = 10;

export type NewsListItem = {
  id: number;
  title: string;
  publishDate: string;
  summary?: string;
  highlights?: string[];
  thumbnail?: string;
  href: string;
  isMigrated: boolean;
};

export default function NewsList({ items }: { items: NewsListItem[] }) {
  const [page, setPage] = useState(1);
  const displayed = items.slice(0, page * NEWS_PER_PAGE);
  const hasMore = displayed.length < items.length;

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (!inView || !hasMore) return;
    setPage((p) => p + 1);
  }, [hasMore, inView]);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {displayed.map((newsletter) => {
        const summary = newsletter.summary?.trim() || "이 활동 보고의 요약은 준비 중입니다.";
        const highlights = newsletter.highlights?.filter(Boolean) ?? [];

        return (
          <article
            key={newsletter.id}
            className="border-b border-neutral-700 pb-8 group animate-fade-in-up"
          >
            <Link
              href={newsletter.href}
              {...(!newsletter.isMigrated && { target: "_blank", rel: "noopener noreferrer" })}
              prefetch={false}
              aria-label={`${newsletter.title} 활동 보고 ${newsletter.isMigrated ? "읽기" : "새 창에서 열기"}`}
              className="block hover:bg-neutral-800 rounded-md p-5 transition-colors duration-200"
            >
              <div className="flex flex-col md:flex-row gap-5">
                {newsletter.thumbnail && (
                  <div className="w-full md:w-48 flex-shrink-0">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
                      <Image
                        src={newsletter.thumbnail}
                        alt={`${newsletter.title} 썸네일`}
                        fill
                        sizes="(min-width: 768px) 12rem, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-white group-hover:text-primary-red transition-colors duration-200 font-serif">
                      {newsletter.title}
                    </h2>
                    {!newsletter.isMigrated && (
                      <svg
                        className="w-5 h-5 text-neutral-400 group-hover:text-primary-red transition-colors duration-200 flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    )}
                  </div>

                  <p className="text-base text-neutral-200 leading-relaxed line-clamp-3">
                    {summary}
                  </p>

                  {highlights.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-neutral-200">
                      {highlights.map((item, index) => (
                        <li key={`${newsletter.id}-highlight-${index}`}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Link>
          </article>
        );
      })}

      {items.length === 0 && (
        <p className="text-center text-neutral-400 py-12">
          등록된 소식이 없습니다.
        </p>
      )}

      {hasMore && <div ref={ref} className="h-10" />}
    </div>
  );
}
