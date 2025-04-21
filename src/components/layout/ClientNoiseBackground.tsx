'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// 성능 최적화: 동적 임포트로 NoiseBackground 지연 로딩
const NoiseBackground = dynamic(() => import("./NoiseBackground"), {
  ssr: false, // 서버 사이드 렌더링 비활성화
  loading: () => null, // 로딩 중에는 아무것도 표시하지 않음
});

export default function ClientNoiseBackground() {
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 렌더링
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <NoiseBackground />;
}
