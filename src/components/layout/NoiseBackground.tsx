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

    // 안전한 페이지 높이 계산 (순환 참조 방지)
    const getSafePageHeight = () => {
      // 메인 콘텐츠 컨테이너 높이만 측정 (캔버스 제외)
      const mainContent = document.querySelector('.flex.flex-col.min-h-screen');
      const contentHeight = mainContent ? mainContent.scrollHeight : document.body.scrollHeight;
      
      // 최대 높이 제한 (뷰포트 높이의 5배로 제한)
      const maxHeight = window.innerHeight * 5;
      const safeHeight = Math.min(contentHeight, maxHeight);
      
      // 최소 높이는 뷰포트 높이로 설정
      return Math.max(safeHeight, window.innerHeight);
    };

    // 캔버스 크기를 안전한 페이지 높이로 설정
    const resizeCanvas = () => {
      const pageHeight = getSafePageHeight();
      
      // 캔버스 크기를 페이지 크기의 1/2로 축소 (성능 최적화)
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(pageHeight / 2);
      
      // CSS로 페이지 크기에 맞게 확대 표시 (position: fixed이므로 문서 흐름에 영향 없음)
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
      const pageHeight = getSafePageHeight();
      
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(pageHeight / 2);
      
      // CSS로 페이지 크기에 맞게 확대 표시
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
    
    // 높이 변화 감지를 위한 안전한 체크 (순환 참조 방지)
    let heightCheckInterval: NodeJS.Timeout;
    let lastPageHeight = getSafePageHeight();
    let consecutiveChanges = 0; // 연속 변화 횟수 추적
    
    const checkHeightChange = () => {
      const currentHeight = getSafePageHeight();
      const heightDiff = Math.abs(currentHeight - lastPageHeight);
      
      // 100px 이상 변화하고, 연속 변화가 3회 미만일 때만 업데이트
      if (heightDiff > 100 && consecutiveChanges < 3) {
        lastPageHeight = currentHeight;
        consecutiveChanges++;
        resizeCanvasAndGenerateTextures();
      } else if (heightDiff <= 50) {
        // 변화가 적으면 연속 변화 카운터 리셋
        consecutiveChanges = 0;
      }
      
      // 연속 변화가 3회 이상이면 5초간 체크 중단
      if (consecutiveChanges >= 3) {
        clearInterval(heightCheckInterval);
        setTimeout(() => {
          consecutiveChanges = 0;
          lastPageHeight = getSafePageHeight();
          heightCheckInterval = setInterval(checkHeightChange, 3000);
        }, 5000);
      }
    };
    
    window.addEventListener('resize', handleResize);
    heightCheckInterval = setInterval(checkHeightChange, 3000); // 3초마다 체크

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
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60"
      style={{ 
        imageRendering: 'pixelated', // 픽셀화된 렌더링으로 성능 향상
        willChange: 'contents' // GPU 가속 항상 활성화
      }}
    />
  );
};

export default NoiseBackground;
