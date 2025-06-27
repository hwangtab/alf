'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { motion, m, LazyMotion, domAnimation } from 'framer-motion';

interface CardProps {
  imageUrl: string;
  title: string;
  imageAlt?: string;
  description?: string;
  tags?: string[];
  imageChildren?: React.ReactNode;
  footerContent?: React.ReactNode;
  index?: number;
  aspectRatio?: string;
  imageSizes?: string;
  loadingPriority?: boolean;
  tagLimit?: number;
  lineClamp?: number;
  children?: React.ReactNode;
  href?: string;
}

const CardComponent: React.FC<CardProps> = ({
  imageUrl,
  title,
  imageAlt,
  description,
  tags,
  imageChildren,
  footerContent,
  index = 0,
  aspectRatio = '66.67%',
  imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  loadingPriority = false,
  tagLimit = 3,
  lineClamp = 2,
  href,
  children,
}) => {
  const cardContent = (
    <>
      <div className="relative w-full" style={{ paddingTop: aspectRatio }}>
        <Image
          src={imageUrl || "/images/placeholder.jpg"}
          alt={imageAlt || title} // imageAlt 우선 사용, 없으면 title
          fill
          sizes={imageSizes}
          loading={loadingPriority ? "eager" : "lazy"}
          className="object-cover"
          quality={loadingPriority ? 90 : 80}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>

        {imageChildren && (
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
            {imageChildren}
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 flex flex-col flex-grow bg-neutral-800 text-white">
        {!imageChildren && <h3 className="text-lg md:text-xl font-bold mb-2 font-sans">{title}</h3>}

        {description && (
          <p className={`text-neutral-300 mb-4 text-sm flex-grow whitespace-normal line-clamp-${lineClamp} font-sans`}>
            {description}
          </p>
        )}

        {children}

        <div className="mt-auto pt-2 flex flex-col sm:flex-row justify-between sm:items-center">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap mb-2 sm:mb-0">
              {tags.slice(0, tagLimit).map(tag => (
                <span key={tag} className="inline-block bg-neutral-700 text-yellow-500 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2 font-sans">
                  #{tag}
                </span>
              ))}
            </div>
          )}
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
            target={href?.startsWith('http') ? '_blank' : '_self'}
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

export const Card = memo(CardComponent);
Card.displayName = 'Card';
