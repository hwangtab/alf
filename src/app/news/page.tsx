'use client';

// import { Metadata } from "next"; // 사용하지 않으므로 제거
import Link from "next/link"; // Link 임포트 유지
import { motion } from 'framer-motion';
import newslettersData from "@/data/newsletters.json";

// 클라이언트 컴포넌트에서는 metadata를 직접 export할 수 없음
// export const metadata: Metadata = {
//   title: "소식 | 예술해방전선",
//   description: "예술해방전선의 최신 소식과 뉴스레터를 확인하세요."
// };

// 변경된 데이터 구조에 맞춰 타입 업데이트 (summary 제거)
type Newsletter = {
  id: number;
  title: string; // 예: "2024년 3월호"
  publishDate: string; // 정렬을 위해 유지
  link: string;
};

export default function NewsPage() {
  // 데이터 최신순 정렬
  const sortedNewsletters: Newsletter[] = [...newslettersData].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // 애니메이션 변수 (소개 페이지와 동일하게)
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="container mx-auto pt-28 pb-20 px-4">
      <motion.h1
        className="text-5xl font-bold mb-16 text-center text-white font-test-serif"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        예술해방전선 뉴스레터
      </motion.h1>

      {/* 원래 리스트 레이아웃 */}
      <div className="space-y-8 max-w-3xl mx-auto">
        {sortedNewsletters.map((newsletter, index) => (
          <motion.div
            key={newsletter.id}
            className="border-b border-neutral-700 pb-8 group" // group 클래스 추가
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* motion.a 대신 Link 사용하고 애니메이션은 motion.div에 적용 */}
            <Link
              href={newsletter.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-neutral-800 rounded-md p-4 transition-colors duration-200"
            >
              <motion.div // 내부 컨텐츠 애니메이션
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* items-center -> items-baseline 으로 변경 */}
                <div className="flex justify-between items-baseline mb-2">
                  <h2 className="text-2xl font-semibold text-white group-hover:text-primary-red transition-colors duration-200 font-serif">{newsletter.title}</h2>
                  {/* 아이콘 스타일 */}
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary-red transition-colors duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
                {/* 발행일 제거됨 */}
              </motion.div>
            </Link>
          </motion.div>
        ))}

        {sortedNewsletters.length === 0 && (
          <motion.p
            className="text-center text-neutral-400 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            등록된 소식이 없습니다.
          </motion.p>
        )}
      </div>
    </div>
  );
}
