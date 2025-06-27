'use client';

import { useState, useEffect } from "react";
import { motion } from 'framer-motion'; // LazyMotion, domAnimation 제거 (Card 내부 처리)
import activitiesData from "@/data/activities.json";
import { Card } from '@/components/ui/Card';

// 데이터 구조 변경에 맞춰 타입 업데이트 (date 제거)
type Activity = {
  id: number;
  title: string;
  // date: string; // 제거
  description: string;
  image: string;
  tags: string[];
};



export default function ActivitiesPage() {
  const [mounted, setMounted] = useState(false);

  // 성능 최적화: 클라이언트 사이드에서만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  // 애니메이션 변수
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (!mounted) {
    // 로딩 상태에서도 동일한 레이아웃 유지
    return (
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-5xl font-bold mb-16 text-center text-white">예술해방전선의 활동</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* 로딩 스켈레톤도 3열로 */}
          {[1, 2, 3, 4, 5, 6].map(i => ( // 6개 스켈레톤 표시
            <div key={i} className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-lg h-96 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // 데이터 유효성 검사
  const isValidData = Array.isArray(activitiesData) && activitiesData.length > 0;

  return (
    <div className="container mx-auto py-20 px-4">
      <motion.h1
        className="text-5xl font-bold mb-16 text-center text-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        예술해방전선의 활동
      </motion.h1>

      {/* Card 컴포넌트 사용 및 오류 처리 */}
      {isValidData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activitiesData.map((activity, index) => (
            <Card
              key={activity.id}
              imageUrl={activity.image}
              title={activity.title}
              description={activity.description}
              imageAlt={`${activity.title} 대표 이미지: ${activity.description}`}
              tags={activity.tags}
              index={index}
              loadingPriority={index < 3} // 첫 3개 카드 이미지 우선 로딩
              tagLimit={4} // 태그 4개까지 표시
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center text-neutral-400 py-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          활동 데이터를 불러오는 데 문제가 발생했거나 데이터가 없습니다.
        </motion.div>
      )}
    </div>
  );
}
