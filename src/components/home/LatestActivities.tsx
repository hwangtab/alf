// 'use client' 지시어 제거 (서버 컴포넌트로 변경)

import React from 'react';
import Link from 'next/link';
import fs from 'fs/promises'; // Node.js 파일 시스템 모듈 사용
import path from 'path'; // Node.js 경로 모듈 사용
// import Image from 'next/image'; // 사용 안 함
// import { motion } from 'framer-motion'; // 사용 안 함

import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card'; // Card 컴포넌트 임포트
// import activitiesData from '@/data/activities.json'; // 직접 import 제거

// 변경된 활동 타입 정의 (date 제거)
type Activity = {
  id: number;
  title: string;
  // date: string;
  description: string;
  image: string;

  tags: string[];
};

// 컴포넌트를 async 함수로 변경하여 파일 읽기 처리
const LatestActivities = async () => {
  // 서버 측에서 activities.json 파일 읽기
  const filePath = path.join(process.cwd(), 'src/data/activities.json');
  let featuredActivities: Activity[] = [];

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const allActivities: Activity[] = JSON.parse(fileContent);
    // 처음 3개 활동 유형 가져오기
    featuredActivities = allActivities.slice(0, 3);
  } catch (error) {
    console.error("Error reading or parsing activities.json:", error);
    // 오류 발생 시 빈 배열 사용 또는 오류 처리 컴포넌트 렌더링 등 고려
  }


  return (
    <section id="latest-activities" className="container mx-auto py-16 px-4 scroll-mt-20"> {/* ID 추가 및 스크롤 마진 */}
      <h2 className="text-3xl font-bold mb-12 text-center text-white">주요 활동 소개</h2> 
      <div className="grid md:grid-cols-3 gap-8">
        {featuredActivities.map((activity, index) => ( 
          <Card
            key={activity.id}
            href="/activities" // 카드 전체를 활동 페이지로 링크
            imageUrl={activity.image}
            title={activity.title}
            description={activity.description}
            tags={activity.tags}
            index={index}
            loadingPriority={true} // 홈페이지 첫 화면이므로 우선 로딩
            tagLimit={2} // 홈에서는 태그 2개만 표시
            imageChildren={ // 이미지 위에 제목 표시
              <h3 className="text-lg font-bold">{activity.title}</h3>
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
