'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      content.classList.remove('page-transition-enter');
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    content.classList.add('page-transition-enter');
    const frame = requestAnimationFrame(() => {
      content.classList.remove('page-transition-enter');
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div ref={contentRef} className="page-transition">
      {children}
    </div>
  );
}
