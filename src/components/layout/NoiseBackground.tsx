'use client';

import React, { useEffect, useRef, useState } from 'react';

const NoiseBackground = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isInView, setIsInView] = useState(true); // IntersectionObserver 상태
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCountRef = useRef(0);
  const noiseTexturesRef = useRef<ImageData[]>([]); // noiseTextures를 ref로 관리
  const animationFrameIdRef = useRef<number>();

  // 성능 최적화: 저사양 기기 감지
  useEffect(() => {
    // 모바일 기기 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // 저사양 기기에서는 노이즈 효과 비활성화
    if (isMobile) {
      setIsVisible(false);
      return;
    }
    
    // 성능 테스트
    const testPerformance = () => {
      const startTime = performance.now();
      let count = 0;
      
      // 간단한 성능 테스트 루프
      for (let i = 0; i < 1000000; i++) {
        count += i;
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // 100ms 이상 걸리면 저사양으로 간주
      if (duration > 100) {
        setIsVisible(false);
      }
    };
    
    testPerformance();
  }, []);

  // IntersectionObserver로 뷰포트 감지
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // 10% 이상 보일 때만 활성화
        rootMargin: '50px' // 50px 여유를 두고 미리 감지
      }
    );

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    // 노이즈 효과가 비활성화되거나 뷰포트 밖에 있으면 더 이상 진행하지 않음
    if (!isVisible || !isInView) {
      // 애니메이션 중지
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // 캔버스 크기를 화면 크기의 1/2로 설정 (성능 최적화)
    const resizeCanvas = () => {
      // 캔버스 크기를 화면 크기의 1/2로 축소
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(window.innerHeight / 2);
      
      // CSS로 실제 화면 크기에 맞게 확대 표시
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };

    resizeCanvas();

    // 노이즈 텍스처 생성 함수
    const generateNoiseTexture = (width: number, height: number) => {
      if (!ctx) return null;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const value = Math.random() > 0.5 ? Math.random() * 150 : 0;
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
          data[i + 3] = 60;
        }
      }
      return imageData;
    };

    const noiseFrames = 5; // 10개에서 5개로 감소

    // 캔버스 크기 조절 및 텍스처 재생성 함수
    const resizeCanvasAndGenerateTextures = () => {
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(window.innerHeight / 2);
      
      // CSS로 실제 화면 크기에 맞게 확대 표시
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      
      // 새로운 크기로 노이즈 텍스처 재생성
      const newTextures = Array.from({ length: noiseFrames }, () =>
        generateNoiseTexture(canvas.width, canvas.height)
      ).filter((texture): texture is ImageData => texture !== null);
      
      noiseTexturesRef.current = newTextures;
    };

    resizeCanvasAndGenerateTextures();
    
    // 성능 최적화: 디바운스된 리사이즈 이벤트
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvasAndGenerateTextures, 200);
    };
    
    window.addEventListener('resize', handleResize);

    // 애니메이션 프레임
    let lastFrameTime = 0;
    
    // 애니메이션 루프 (성능 최적화: 프레임 제한)
    const animate = (timestamp: number) => {
      // 뷰포트 밖에 있으면 애니메이션 중지
      if (!isInView) {
        return;
      }

      // 초당 10프레임으로 제한 (성능 최적화)
      if (timestamp - lastFrameTime > 100) { // 100ms = 10fps
        lastFrameTime = timestamp;
        
        // ref에서 노이즈 텍스처 가져오기
        const currentTextures = noiseTexturesRef.current;
        if (currentTextures.length === 0) return;

        const frameIndex = frameCountRef.current % currentTextures.length;
        ctx.putImageData(currentTextures[frameIndex], 0, 0);
        
        frameCountRef.current++;
      }
      
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };
    
    // 애니메이션 시작
    animationFrameIdRef.current = requestAnimationFrame(animate);
    
    // 클린업 함수
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      clearTimeout(resizeTimeout);
    };
  }, [isVisible, isInView]); // isInView 의존성 추가

  // 노이즈 효과가 비활성화되면 아무것도 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60"
      style={{ 
        imageRendering: 'pixelated', // 픽셀화된 렌더링으로 성능 향상
        willChange: isInView ? 'contents' : 'auto' // 뷰포트에 있을 때만 GPU 가속
      }}
    />
  );
};

export default NoiseBackground;
