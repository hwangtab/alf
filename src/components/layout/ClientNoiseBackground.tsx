'use client';

import dynamic from 'next/dynamic';

// 성능 최적화: 동적 임포트로 NoiseBackground 지연 로딩
const NoiseBackground = dynamic(() => import("./NoiseBackground"), {
  ssr: false, // 서버 사이드 렌더링 비활성화
  loading: () => <div className="fixed inset-0 bg-black z-0" />, // 로딩 중 검은 배경
});

export default function ClientNoiseBackground() {
  return <NoiseBackground />;
}
