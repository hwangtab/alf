'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { navigationLinks } from '@/data/navigation';

type NavigationProps = {
  isScrolled: boolean;
};

const Navigation = ({ isScrolled }: NavigationProps) => {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  const navigationItems = useMemo(() => 
    navigationLinks.map((link, index) => {
      const isActive = pathname === link.href;
      const isHovered = hoveredIndex === index;
      
      return (
        <li key={link.href} className="relative">
          <Link
            href={link.href}
            className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActive ? 'text-white' : 'text-neutral-300 hover:text-white'
            }`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {/* 배경 효과 */}
            {(isHovered || isActive) && (
              <motion.span
                className="absolute inset-0 rounded-md bg-neutral-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 0.8 : 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                layoutId={isActive ? "activeNavBackground" : undefined}
              />
            )}
            
            {/* 활성화 표시기 */}
            {isActive && (
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-red"
                layoutId="activeIndicator"
                transition={{ duration: 0.2 }}
              />
            )}
            
            {/* 텍스트 */}
            <span className="relative z-10">{link.label}</span>
          </Link>
        </li>
      );
    }), [pathname, hoveredIndex, handleMouseEnter, handleMouseLeave]
  );

  return (
    <nav className="py-2">
      <ul className="flex items-center space-x-1 md:space-x-2">
        {navigationItems}
      </ul>
    </nav>
  );
};

export default Navigation;
