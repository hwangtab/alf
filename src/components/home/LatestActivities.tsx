'use client';

import React from 'react';
import Link from 'next/link';
// import Image from 'next/image'; // 사용 안 함
// import { motion } from 'framer-motion'; // 사용 안 함

import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card'; // Card 컴포넌트 임포트
import activitiesData from '@/data/activities.json';

// 변경된 활동 타입 정의 (date 제거)
type Activity = {
  id: number;
  title: string;
  // date: string;
  description: string;
  image: string;

  tags: string[];
};

const LatestActivities = () => {
  // 처음 3개 활동 유형 가져오기
  const featuredActivities = activitiesData.slice(0, 3);

  return (
    <section id="latest-activities" className="container mx-auto py-16 px-4 scroll-mt-20"> {/* ID 추가 및 스크롤 마진 */}
      <h2 className="text-3xl font-bold mb-12 text-center text-white font-test-serif">주요 활동 소개</h2> 
      <div className="grid md:grid-cols-3 gap-8">
        {featuredActivities.map((activity, index) => ( 
          <Card
            key={activity.id}
            href="/activities" // 카드 전체를 활동 페이지로 링크
            imageUrl={activity.image}
            title={activity.title}
            description={activity.description}
            imageAlt={`${activity.title} 대표 이미지`}
            tags={activity.tags}
            index={index}
            loadingPriority={index < 2} // 첫 2개 카드만 우선 로딩
            tagLimit={2} // 홈에서는 태그 2개만 표시
            imageChildren={ // 이미지 위에 제목 표시
              <h3 className="text-lg font-bold font-test-serif">{activity.title}</h3>
            }
          />
        ))}
      </div>
       <div className="text-center mt-12">
         {/* Button 컴포넌트 사용 */}
         <Button href="/activities" variant="primary" size="md">
           모든 활동 보기
         </Button>
      </div>
    </section>
  );
};

export default LatestActivities;
