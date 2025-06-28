'use client'; // 클라이언트 컴포넌트 지시문 유지

import { useState, useEffect } from 'react'; // useState, useEffect 임포트 추가
import { motion } from 'framer-motion'; 
import GalleryLightbox from './GalleryLightbox';
import altTextsData from '@/data/gallery-alt-texts.json'; 

// 타입 정의
interface AltTexts {
  [key: string]: string;
}
interface GalleryImage { // GalleryLightbox에서 사용하는 타입
  src: string;
  alt: string;
}

const altTexts: AltTexts = altTextsData;

import type { Metadata } from 'next';
import { metadata } from './metadata';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]); // 이미지 목록 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 오류 상태

  // 애니메이션 변수
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        // API 응답과 altTexts를 조합하여 images 상태 업데이트
        const fetchedImages = data.images.map((file: string) => ({
          src: `/images/gallery/${file}`, 
          alt: altTexts[file.replace('.webp', '.png')] || // .webp 제거 후 .png로 altTexts 조회
               altTexts[file.replace('.webp', '.jpg')] || // .jpg로도 조회
               altTexts[file.replace('.webp', '.jpeg')] || // .jpeg로도 조회
               '설명이 필요한 예술해방전선 갤러리 이미지', 
        }));
        setImages(fetchedImages);
      } catch (err) {
        console.error("Error fetching gallery images:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.h1 
          className="text-5xl font-bold mb-16 text-center text-white font-serif"
          initial="hidden" animate="visible" variants={fadeIn}
        >
          갤러리
        </motion.h1>
        <p>이미지를 불러오는 중...</p> 
      </div>
    );
  }

  // 오류 발생 시 표시
  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-red-500">
        <motion.h1 
          className="text-5xl font-bold mb-16 text-center text-white font-serif"
          initial="hidden" animate="visible" variants={fadeIn}
        >
          갤러리
        </motion.h1>
        <p>오류: {error}</p>
      </div>
    );
  }

  // 이미지가 없을 경우 표시 (API 호출 후)
  if (images.length === 0) {
    return (
       <div className="container mx-auto px-4 py-20 text-center">
         <motion.h1 
           className="text-5xl font-bold mb-16 text-center text-white font-serif"
           initial="hidden" animate="visible" variants={fadeIn}
         >
           갤러리
         </motion.h1>
         <p>갤러리에 표시할 이미지가 없습니다.</p>
       </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20"> 
      <motion.h1 
        className="text-5xl font-bold mb-16 text-center text-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        갤러리
      </motion.h1>
      <GalleryLightbox images={images} />
    </div>
  );
}