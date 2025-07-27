'use client';

import { motion } from 'framer-motion'; 
import GalleryLightbox from './GalleryLightbox';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryClientPageProps {
  images: GalleryImage[];
}

export default function GalleryClientPage({ images }: GalleryClientPageProps) {
  // 애니메이션 변수
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="container mx-auto px-4 pt-28 pb-20 relative"> 
      <motion.h1 
        className="text-5xl font-bold mb-16 text-center text-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        갤러리
      </motion.h1>
      {images.length > 0 ? (
        <GalleryLightbox images={images} />
      ) : (
        <p className="text-center">갤러리에 표시할 이미지가 없습니다.</p>
      )}
    </div>
  );
}