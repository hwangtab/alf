import Image from "next/image";
import Link from "next/link";
import newslettersData from "@/data/newsletters.json";

type Newsletter = {
  id: number;
  title: string;
  publishDate: string;
  link: string;
  summary?: string;
  highlights?: string[];
  thumbnail?: string;
};

export default function NewsPage() {
  const sortedNewsletters: Newsletter[] = [...newslettersData].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return (
    <div className="container mx-auto pt-28 pb-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white font-giants-inline animate-fade-in-up">
          예술해방전선 뉴스레터
        </h1>
      </div>

      <div className="space-y-8 max-w-3xl mx-auto">
        {sortedNewsletters.map((newsletter) => {
          const summary =
            newsletter.summary?.trim() || "이 뉴스레터의 요약은 준비 중입니다.";
          const highlights = newsletter.highlights?.filter(Boolean) ?? [];

          return (
            <article
              key={newsletter.id}
              className="border-b border-neutral-700 pb-8 group animate-fade-in-up"
            >
              <Link
                href={newsletter.link}
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
                aria-label={`${newsletter.title} 뉴스레터 새 창에서 열기`}
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
                        ></path>
                      </svg>
                    </div>

                    {highlights.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 text-neutral-200">
                        {highlights.map((item, index) => (
                          <li key={`${newsletter.id}-highlight-${index}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-base text-neutral-200 leading-relaxed line-clamp-3">
                        {summary}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}

        {sortedNewsletters.length === 0 && (
          <p className="text-center text-neutral-400 py-12">
            등록된 소식이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
