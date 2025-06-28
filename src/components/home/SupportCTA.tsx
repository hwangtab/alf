'use client'; // 클라이언트 컴포넌트로 지정

import React from 'react';
import Link from 'next/link'; // Link는 Button 컴포넌트 내부에서 처리되므로 제거 가능
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button'; // Button 컴포넌트 임포트

const SupportCTA = () => {
  return (
    <section className="bg-neutral-800 py-20 px-4"> {/* 배경색 및 패딩 조정 */}
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-white font-serif">우리가 함께한 시간들</h2> {/* 제목 변경 및 텍스트 색상 변경 */}
        <p className="text-lg mb-8 mx-auto text-neutral-300 whitespace-normal font-sans"> {/* 텍스트 색상 변경 */}
          예술해방전선의 여정은 수많은 분들의 관심과 연대 덕분에 가능합니다. 그 뜨거운 순간들을 이곳에 기록하고 있습니다.
        </p>
        {/* Button 컴포넌트 사용, 링크 및 텍스트 변경 */}
         <Button href="/activities" variant="secondary" size="md"> {/* variant 및 href 변경 */}
           활동 기록 보기
         </Button>
         {/* </motion.div> 제거 - Button 컴포넌트가 motion 포함 */}
      </div>
    </section>
  );
};

export default SupportCTA;
