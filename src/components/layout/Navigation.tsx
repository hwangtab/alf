'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { navigationLinks } from '@/data/navigation'; // 네비게이션 데이터 임포트

type NavigationProps = {
  isScrolled: boolean;
};

const Navigation = ({ isScrolled }: NavigationProps) => {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


  return (
    <nav className="py-2">
      <ul className="flex items-center space-x-1 md:space-x-2">
        {navigationLinks.map((link, index) => { // 중앙 데이터 사용
          const isActive = pathname === link.href;
          
          return (
            <li key={link.href} className="relative">
              {/* 홈 링크와 다른 링크 렌더링 통합 */}
              <Link
                href={link.href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
                  isActive
                    ? 'text-white'
                    : 'text-neutral-300 hover:text-white'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* 배경 효과 (호버) */}
                {hoveredIndex === index && (
                  <motion.span
                    className="absolute inset-0 rounded-md z-0 bg-neutral-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* 배경 효과 (활성) */}
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-md z-0 bg-neutral-800"
                    layoutId="activeNavBackground"
                    transition={{ duration: 0.2 }}
                  />
                )}
                
                {/* 활성화 표시기 */}
                {isActive && (
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-red"
                    layoutId={`activeIndicator-${link.href}`} // layoutId 고유성 보장
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                {/* 텍스트 */}
                <span className="relative z-10">
                  {link.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
