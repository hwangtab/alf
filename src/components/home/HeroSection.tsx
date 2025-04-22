'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import Button from '@/components/ui/Button'; // Button 컴포넌트 임포트

type HeroSectionProps = {
  title: string;
  subtitle: string;
};

// Throttle 함수 정의 (지정된 시간 동안 최대 한 번만 함수 실행)
const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
  let inThrottle: boolean;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};


const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // 스크롤에 따른 변환 효과
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 마우스 움직임에 따른 효과를 위한 값
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    let animationFrameId: number;

    // Throttle 적용된 마우스 이동 핸들러 (16ms 간격, 약 60fps)
    const throttledHandleMouseMove = throttle((e: MouseEvent) => {
      // requestAnimationFrame은 부드러운 애니메이션을 위해 유지
      animationFrameId = requestAnimationFrame(() => {
        // 화면 중앙을 기준으로 마우스 위치 계산 (-1 ~ 1 범위)
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // 마우스 위치를 -20 ~ 20 범위로 변환
        mouseX.set((e.clientX - centerX) / centerX * 20);
        mouseY.set((e.clientY - centerY) / centerY * 20);
      });
    }, 16); // 16ms 간격으로 throttle (약 60fps)

    window.addEventListener('mousemove', throttledHandleMouseMove);
    return () => {
      window.removeEventListener('mousemove', throttledHandleMouseMove);
      // 컴포넌트 언마운트 시 마지막 프레임 요청 취소
      cancelAnimationFrame(animationFrameId);
      // throttle 정리 (필요한 경우, lodash throttle은 cancel 메서드 제공)
      // 직접 구현한 throttle은 별도 정리 로직 불필요
    };
  }, [mouseX, mouseY]); // 의존성 배열에 mouseX, mouseY 추가

  // 제목 애니메이션 변수
  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // 부제목 애니메이션 변수
  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  // 버튼 애니메이션 변수
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.6,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  // 배경 도형 애니메이션 변수
  const shapeVariants = {
    animate: {
      x: [0, 10, -10, 0],
      y: [0, -10, 10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative flex items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden" /* py-40 제거, min-h-[calc(100vh-80px)] 추가 */
      style={{ y, opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 배경 이미지 추가 */}
      <Image
        src="/images/hero/hero-background.webp"
        alt="Hero Background"
        fill
        className="object-cover z-[-1] opacity-30" // z-index와 opacity 적용
        priority // LCP 개선을 위해 priority 설정
      />

      {/* <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 z-[-2]" /> */}

      {/* 움직이는 배경 도형들 (투명도 조절) */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-primary-red to-primary-orange opacity-10 filter blur-3xl" // opacity 감소
        variants={shapeVariants}
        animate="animate"
        custom={1}
        style={{
          x: useTransform(mouseX, value => -value * 1.5),
          y: useTransform(mouseY, value => -value * 1.5),
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue opacity-05 filter blur-3xl" // opacity 감소
        variants={shapeVariants}
        animate="animate"
        custom={2}
        style={{
          x: useTransform(mouseX, value => -value * 1),
          y: useTransform(mouseY, value => -value * 1),
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-primary-yellow opacity-05 filter blur-2xl" // opacity 감소
        variants={shapeVariants}
        animate="animate"
        custom={3}
        style={{
          x: useTransform(mouseX, value => -value * 0.5),
          y: useTransform(mouseY, value => -value * 0.5),
        }}
      />

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 z-10 text-center relative">
        <motion.h1
          className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="text-gradient block">{title}</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 text-neutral-200 whitespace-normal"
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
            우리의 발자취 보기
          </Button>
        </motion.div>
      </div>

      {/* 스크롤 다운 표시 (클릭 가능) */}
      <motion.button // button으로 변경하여 클릭 가능하게 만듦
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 p-2 cursor-pointer" // bottom-10 -> bottom-16
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </motion.section>
  );
};

export default HeroSection;
