'use client';

import React, { useEffect, useRef, useState } from 'react';

const NoiseBackground = () => {
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCountRef = useRef(0);
  const noiseTexturesRef = useRef<ImageData[]>([]); // noiseTextures를 ref로 관리

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
    if (!isVisible) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // 캔버스 크기를 화면 크기에 맞게 설정 (성능 최적화: 크기 축소)
    const resizeCanvas = () => {
      // 캔버스 크기를 화면 전체 크기로 설정 (최적화 제거)
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    
    // 성능 최적화: 디바운스된 리사이즈 이벤트 (아래에서 처리)
    // let resizeTimeout: NodeJS.Timeout;
    // const handleResize = () => {
    //   clearTimeout(resizeTimeout);
    //   resizeTimeout = setTimeout(resizeCanvas, 200);
    // };
    //
    // window.addEventListener('resize', handleResize);

    // 노이즈 텍스처 생성 함수 (useEffect 밖으로 이동)
    const generateNoiseTexture = (width: number, height: number) => {
      if (!ctx) return null; // ctx 확인 추가
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

    const noiseFrames = 10; // 10개의 프레임만 사용

    // 캔버스 크기 조절 및 텍스처 재생성 함수
    const resizeCanvasAndGenerateTextures = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // 새로운 크기로 노이즈 텍스처 재생성
      const newTextures = Array.from({ length: noiseFrames }, () =>
        generateNoiseTexture(canvas.width, canvas.height)
      ).filter((texture): texture is ImageData => texture !== null); // null 필터링 및 타입 가드
      
      noiseTexturesRef.current = newTextures; // ref 업데이트
    };

    resizeCanvasAndGenerateTextures(); // 초기 실행
    
    // 성능 최적화: 디바운스된 리사이즈 이벤트
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      // 리사이즈 시 텍스처 재생성 함수 호출
      resizeTimeout = setTimeout(resizeCanvasAndGenerateTextures, 200);
    };
    
    window.addEventListener('resize', handleResize);

    // 애니메이션 프레임
    let animationFrameId: number;
    let lastFrameTime = 0;
    
    // 애니메이션 루프 (성능 최적화: 프레임 제한)
    const animate = (timestamp: number) => {
      // 초당 10프레임으로 제한 (성능 최적화)
      if (timestamp - lastFrameTime > 100) { // 100ms = 10fps
        lastFrameTime = timestamp;
        
        // ref에서 노이즈 텍스처 가져오기
        const currentTextures = noiseTexturesRef.current;
        if (currentTextures.length === 0) return; // 텍스처 없으면 중단

        const frameIndex = frameCountRef.current % currentTextures.length;
        ctx.putImageData(currentTextures[frameIndex], 0, 0);
        
        frameCountRef.current++;
      }
      
      animationFrameId = requestAnimationFrame(animate); // 애니메이션 반복 다시 시작
    };
    
    // 애니메이션 시작
    animationFrameId = requestAnimationFrame(animate);
    
    // 클린업 함수
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, [isVisible]);

  // 노이즈 효과가 비활성화되면 아무것도 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60" // 전체 투명도 60%로 복구
      // style={{ mixBlendMode: 'overlay' }} // 블렌드 모드 제거 상태 유지
    />
  );
};

export default NoiseBackground;
