'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import 'yet-another-react-lightbox/styles.css';
import './lightbox-custom.css';

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), {
  ssr: false,
});

const INITIAL_VISIBLE_IMAGES = 80;
const LOAD_MORE_IMAGES = 80;

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
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_IMAGES);
  const visibleImages = useMemo(
    () => images.slice(0, visibleCount),
    [images, visibleCount]
  );
  const hasMore = visibleImages.length < images.length;

  function openLightbox(index: number) {
    setCurrentIndex(index);
    setIsOpen(true);
  }

  // yet-another-react-lightbox용 슬라이드 배열
  const slides = useMemo(
    () =>
      visibleImages.map((image) => ({
        src: image.src,
        alt: image.alt,
      })),
    [visibleImages]
  );

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visibleImages.map((image, idx) => (
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

      {hasMore && (
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-sm text-neutral-400">
            {visibleImages.length.toLocaleString('ko-KR')} / {images.length.toLocaleString('ko-KR')}
          </p>
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + LOAD_MORE_IMAGES, images.length))}
            className="rounded-md border border-neutral-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-primary-red hover:text-primary-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-red"
          >
            더 보기
          </button>
        </div>
      )}

      {/* yet-another-react-lightbox Component */}
      {isOpen && (
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
              zIndex: 9999,
            },
          }}
        />
      )}
    </>
  );
}
