'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 80,
  sizes = '100vw',
  placeholder = 'blur',
  blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // 에러 발생 시 fallback 이미지
  if (imageError) {
    return (
      <div className={`bg-neutral-800 flex items-center justify-center ${className}`}>
        <svg
          className="w-8 h-8 text-neutral-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: imageLoaded ? 1 : 0.7 }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`transition-all duration-300 ${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : `object-${objectFit}`} ${className}`}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* 로딩 인디케이터 */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-neutral-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-neutral-600 border-t-neutral-400 rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

export default OptimizedImage;
