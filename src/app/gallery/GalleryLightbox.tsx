'use client';

import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import './lightbox-custom.css';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
}

export default function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  function openLightbox(index: number) {
    setCurrentIndex(index);
    setIsOpen(true);
  }

  // yet-another-react-lightbox용 슬라이드 배열
  const slides = images.map(image => ({
    src: image.src,
    alt: image.alt
  }));

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, idx) => (
          <div
            key={idx}
            className="aspect-square overflow-hidden rounded-md group cursor-pointer bg-gray-800"
            onClick={() => openLightbox(idx)} // 0부터 시작하는 인덱스 전달
          >
            {/* 더 간단한 접근 - absolute 제거, 일반 block 요소로 변경 */}
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 block"
              loading={idx < 20 ? "eager" : "lazy"}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>

      {/* yet-another-react-lightbox Component */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={currentIndex}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          root: { 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
          }
        }}
      />
    </>
  );
}