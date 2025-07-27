'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // 페이지 전환 시작
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';

    // 짧은 지연 후 페이드 인
    const timer = setTimeout(() => {
      content.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div ref={contentRef} style={{ opacity: 0, position: 'relative' }}>
      {children}
    </div>
  );
}