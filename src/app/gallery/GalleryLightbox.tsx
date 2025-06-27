'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import FsLightbox from 'fslightbox-react'; // 새 라이브러리 임포트
// import 'yet-another-react-lightbox/styles.css'; // 이전 라이브러리 CSS 임포트 - 제거됨

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
}

export default function GalleryLightbox({ images }: GalleryLightboxProps) {
  // fslightbox 상태 관리
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1 // fslightbox는 1부터 시작하는 인덱스 사용
  });

  // 이미지 클릭 핸들러
  function openLightboxOnSlide(number: number) {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number
    });
  }

  // fslightbox에 전달할 이미지 소스 배열
  const sources = images.map(image => image.src);

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative aspect-square overflow-hidden rounded-md group cursor-pointer"
            onClick={() => openLightboxOnSlide(idx + 1)} // 1부터 시작하는 인덱스 전달
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              priority={idx < 10}
              quality={80}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="
            />
          </div>
        ))}
      </div>

      {/* FsLightbox Component */}
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={sources}
        slide={lightboxController.slide}
        // onClose 콜백은 fslightbox-react 유료 버전 기능일 수 있음
        // 무료 버전에서는 toggler를 false로 설정하여 닫음 (이미지/배경 클릭 시 기본 동작)
      />
    </>
  );
}