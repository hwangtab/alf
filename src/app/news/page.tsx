import Link from "next/link";
import newslettersData from "@/data/newsletters.json";

type Newsletter = {
  id: number;
  title: string;
  publishDate: string;
  link: string;
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
        {sortedNewsletters.map((newsletter) => (
          <div
            key={newsletter.id}
            className="border-b border-neutral-700 pb-8 group animate-fade-in-up"
          >
            <Link
              href={newsletter.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-neutral-800 rounded-md p-4 transition-colors duration-200"
            >
              <div className="flex justify-between items-baseline mb-2">
                <h2 className="text-2xl font-semibold text-white group-hover:text-primary-red transition-colors duration-200 font-serif">
                  {newsletter.title}
                </h2>
                <svg
                  className="w-5 h-5 text-neutral-400 group-hover:text-primary-red transition-colors duration-200 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </div>
            </Link>
          </div>
        ))}

        {sortedNewsletters.length === 0 && (
          <p className="text-center text-neutral-400 py-12">
            등록된 소식이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
