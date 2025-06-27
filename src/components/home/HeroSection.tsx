'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import Button from '@/components/ui/Button'; // Button 컴포넌트 임포트

type HeroSectionProps = {
  title: string;
  subtitle: string;
};

const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // 스크롤에 따른 변환 효과 - 성능 최적화
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]); // 200 -> 100으로 감소
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 마우스 움직임에 따른 효과를 위한 값
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastMoveTime = 0;
    const throttleDelay = 16; // 60fps로 제한

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime < throttleDelay) return;
      
      lastMoveTime = now;
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 마우스 위치를 -10 ~ 10 범위로 축소 (성능 향상)
        mouseX.set((e.clientX - centerX) / centerX * 10); // 20 -> 10
        mouseY.set((e.clientY - centerY) / centerY * 10); // 20 -> 10
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true }); // passive 옵션 추가
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY]);

  // 제목 애니메이션 변수 - 지속시간 최적화
  const titleVariants = {
    hidden: { opacity: 0, y: 30 }, // 50 -> 30
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6, // 0.8 -> 0.6
        ease: "easeOut"
      }
    }
  };

  // 부제목 애니메이션 변수
  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 }, // 30 -> 20
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6, // 0.8 -> 0.6
        delay: 0.2, // 0.3 -> 0.2
        ease: "easeOut"
      }
    }
  };

  // 버튼 애니메이션 변수
  const buttonVariants = {
    hidden: { opacity: 0, y: 15 }, // 20 -> 15
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // 0.5 -> 0.4
        delay: 0.4, // 0.6 -> 0.4
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  // 배경 도형 애니메이션 최적화
  const shapeVariants = {
    animate: {
      x: [0, 5, -5, 0], // 범위 축소
      y: [0, -5, 5, 0],
      rotate: [0, 3, -3, 0], // 5 -> 3으로 축소
      transition: {
        duration: 15, // 20 -> 15
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{ y, opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }} // 0.5 -> 0.3으로 단축
    >
      {/* 배경 이미지 추가 */}
      <Image
        src="/images/hero/hero-background.webp"
        alt="노량진수산시장 상인들과 예술가들"
        fill
        className="object-cover z-[-1] opacity-30"
        priority
        quality={85} // 90 -> 85로 최적화
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="
        sizes="100vw"
      />

      {/* <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 z-[-2]" /> */}

      {/* 배경 도형 수 감소 - 성능 최적화 */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-primary-red to-primary-orange opacity-8 filter blur-3xl" // 크기 축소, 투명도 조정
        variants={shapeVariants}
        animate="animate"
        style={{
          x: useTransform(mouseX, value => -value * 1),
          y: useTransform(mouseY, value => -value * 1),
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue opacity-6 filter blur-3xl" // 크기 축소
        variants={shapeVariants}
        animate="animate"
        style={{
          x: useTransform(mouseX, value => -value * 0.5),
          y: useTransform(mouseY, value => -value * 0.5),
        }}
      />

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 z-10 text-center relative">
        <motion.h1
          className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter" // 크기 축소, 여백 최적화
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-gradient block">{title}</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-neutral-200" // 크기 축소, 여백 최적화
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileTap="tap" // tap 효과는 Button 컴포넌트에서 처리
        >
          {/* Button 컴포넌트 사용, variant="secondary"로 빨간색 버튼 적용 */}
          <Button 
            href="/about" 
            variant="secondary" 
            size="md" 
            className="btn-revolution"
            // Button 컴포넌트의 기본 hover/tap 효과 사용
          >
            우리의 연대
          </Button>
        </motion.div>
      </div>

      {/* 스크롤 다운 표시 (클릭 가능) */}
      <motion.button // button으로 변경하여 클릭 가능하게 만듦
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 p-2 cursor-pointer" // bottom-10 -> bottom-20
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }} // 범위 축소
        transition={{ delay: 0.8, duration: 1.2, repeat: Infinity }} // 지속시간 단축
        onClick={() => {
          const targetElement = document.getElementById('latest-activities');
          if (targetElement) {
            const headerOffset = 100; // 헤더 높이 오프셋 (px)
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }}
        aria-label="Scroll down" // 접근성 레이블 추가
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> {/* 크기 축소 */}
          <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </motion.section>
  );
};

export default HeroSection;
