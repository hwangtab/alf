'use client';

import React, { useEffect, useRef, useState } from 'react';

const NoiseBackground = () => {
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCountRef = useRef(0);
  const noiseTexturesRef = useRef<ImageData[]>([]); // noiseTextures를 ref로 관리
  const animationFrameIdRef = useRef<number | undefined>(undefined);

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


  useEffect(() => {
    // 노이즈 효과가 비활성화되면 더 이상 진행하지 않음
    if (!isVisible) {
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

    // 페이지 전체 높이를 얻는 함수
    const getPageHeight = () => {
      return Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight,
        document.body.scrollHeight,
        document.body.offsetHeight
      );
    };

    // 캔버스 크기를 페이지 전체 크기의 1/2로 설정 (성능 최적화)
    const resizeCanvas = () => {
      const pageHeight = getPageHeight();
      
      // 캔버스 크기를 전체 페이지 크기의 1/2로 축소
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(pageHeight / 2);
      
      // CSS로 실제 페이지 크기에 맞게 확대 표시
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = pageHeight + 'px';
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
      const pageHeight = getPageHeight();
      
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(pageHeight / 2);
      
      // CSS로 실제 페이지 크기에 맞게 확대 표시
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = pageHeight + 'px';
      
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
    
    // 페이지 높이 변화 감지를 위한 주기적 체크
    let heightCheckInterval: NodeJS.Timeout;
    let lastPageHeight = getPageHeight();
    
    const checkHeightChange = () => {
      const currentHeight = getPageHeight();
      if (Math.abs(currentHeight - lastPageHeight) > 50) { // 50px 이상 변화 시에만 업데이트
        lastPageHeight = currentHeight;
        resizeCanvasAndGenerateTextures();
      }
    };
    
    window.addEventListener('resize', handleResize);
    heightCheckInterval = setInterval(checkHeightChange, 1000); // 1초마다 체크

    // 애니메이션 프레임
    let lastFrameTime = 0;
    
    // 애니메이션 루프 (성능 최적화: 프레임 제한)
    const animate = (timestamp: number) => {
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
      clearInterval(heightCheckInterval);
    };
  }, [isVisible]); // isVisible 의존성만 유지

  // 노이즈 효과가 비활성화되면 아무것도 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full pointer-events-none z-0 opacity-60"
      style={{ 
        imageRendering: 'pixelated', // 픽셀화된 렌더링으로 성능 향상
        willChange: 'contents', // GPU 가속 항상 활성화
        minHeight: '100vh' // 최소 뷰포트 높이 보장
      }}
    />
  );
};

export default NoiseBackground;
