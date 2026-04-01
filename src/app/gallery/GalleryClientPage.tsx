'use client';

import GalleryLightbox from './GalleryLightbox';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryClientPageProps {
  images: GalleryImage[];
}

export default function GalleryClientPage({ images }: GalleryClientPageProps) {
  return (
    <div className="container mx-auto px-4 pt-28 pb-20 relative">
      <h1 className="text-5xl font-bold mb-16 text-center text-white font-giants-inline">
        갤러리
      </h1>
      {images.length > 0 ? (
        <GalleryLightbox images={images} />
      ) : (
        <p className="text-center">갤러리에 표시할 이미지가 없습니다.</p>
      )}
    </div>
  );
}
