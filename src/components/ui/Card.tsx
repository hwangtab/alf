'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { motion, m, LazyMotion, domAnimation } from 'framer-motion'; // m, LazyMotion, domAnimation 추가

interface CardProps {
  imageUrl: string;
  title: string;
  description?: string; // 설명은 선택적
  tags?: string[]; // 태그도 선택적
  imageChildren?: React.ReactNode; // 이미지 위에 표시될 추가 요소 (예: 날짜, 앨범 제목 등)
  footerContent?: React.ReactNode;
  index?: number;
  aspectRatio?: string;
  imageSizes?: string;
  loadingPriority?: boolean;
  tagLimit?: number;
  lineClamp?: number;
  children?: React.ReactNode;
  href?: string; // 카드 전체 링크를 위한 href prop 추가
}

const CardComponent: React.FC<CardProps> = ({
  imageUrl,
  title,
  description,
  tags,
  imageChildren,
  footerContent,
  index = 0,
  aspectRatio = '66.67%', // 기본 3:2 비율
  imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", // 기본 sizes
  loadingPriority = false,
  tagLimit = 3, // 기본 최대 3개 태그
  lineClamp = 2, // 기본 최대 2줄 설명
  href, // href prop 추가
  children, // children prop 추가
}) => {
  const cardContent = (
    <>
      {/* 이미지 컨테이너 */}
      <div className="relative w-full" style={{ paddingTop: aspectRatio }}>
        <Image
          src={imageUrl || "/images/placeholder.jpg"}
          alt={title}
          fill
          sizes={imageSizes}
          loading={loadingPriority ? "eager" : "lazy"}
          className="object-cover"
        />
        {/* 이미지 위에 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>

        {/* 이미지 위에 표시될 추가 요소 */}
        {imageChildren && (
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
            {imageChildren}
          </div>
        )}
      </div>

      {/* 텍스트 및 태그 컨텐츠 */}
      <div className="p-4 md:p-6 flex flex-col flex-grow bg-neutral-800 text-white">
        {/* 제목 (imageChildren에 포함되지 않은 경우 표시) */}
        {!imageChildren && <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>}

        {/* 설명 */}
        {description && (
          <p className={`text-neutral-300 mb-4 text-sm flex-grow whitespace-normal line-clamp-${lineClamp}`}>
            {description}
          </p>
        )}

        {/* children 렌더링 추가 */}
        {children}

        {/* 태그 및 하단 컨텐츠 */}
        <div className="mt-auto pt-2 flex flex-col sm:flex-row justify-between sm:items-center">
          {/* 태그 */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap mb-2 sm:mb-0">
              {tags.slice(0, tagLimit).map(tag => (
                <span key={tag} className="inline-block bg-neutral-700 text-yellow-500 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {/* 하단 추가 컨텐츠 (오른쪽 정렬) */}
          {footerContent && <div className="sm:ml-auto">{footerContent}</div>}
        </div>
      </div>
    </>
  );

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
      >
        {href ? (
          <a
            href={href}
            target={href?.startsWith('http') ? '_blank' : '_self'} // 외부 링크일 경우에만 target="_blank" 적용
            rel="noopener noreferrer"
            className="flex flex-col h-full"
          >
            {cardContent}
          </a>
        ) : (
          cardContent
        )}
      </m.div>
    </LazyMotion>
  );
};

// memo 적용
export const Card = memo(CardComponent);
Card.displayName = 'Card'; // displayName 설정
