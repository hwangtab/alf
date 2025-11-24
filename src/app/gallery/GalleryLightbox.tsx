'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
          <button
            key={`${image.src}-${idx}`}
            type="button"
            className="relative aspect-square overflow-hidden rounded-md group cursor-pointer bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-red"
            onClick={() => openLightbox(idx)}
            aria-label={`이미지 확대 보기: ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              priority={idx < 10}
            />
          </button>
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
