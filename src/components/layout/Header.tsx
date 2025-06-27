'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationLinks, NavLink } from '@/data/navigation';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 스크롤 이벤트 최적화
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 50);
      }, 10); // 디바운싱
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // 메뉴 상태에 따른 body 스크롤 제어
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // 애니메이션 변수들을 useMemo로 최적화
  const logoVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }), []);

  const headerVariants = useMemo(() => ({
    transparent: { 
      backgroundColor: 'rgba(15, 15, 15, 0)',
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    },
    solid: { 
      backgroundColor: 'rgba(15, 15, 15, 0.85)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)'
    }
  }), []);

  const mobileMenuVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }), []);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-4 h-20"
        initial="transparent"
        animate={isScrolled ? "solid" : "transparent"}
        variants={headerVariants}
        transition={{ duration: 0.2 }}
      >
        <div className="container mx-auto flex justify-between items-center h-full px-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={logoVariants}
          >
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <Image
                src="/images/logo.webp"
                alt="예술해방전선 로고"
                width={80}
                height={21}
                className="h-6 w-auto object-contain"
                priority
              />
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <Navigation isScrolled={isScrolled} />
          </div>

          <button
            className="block md:hidden text-white p-2 focus:outline-none relative z-10"
            onClick={toggleMenu}
            aria-label="메뉴 열기"
            type="button"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span 
                className={`block h-0.5 w-full bg-white rounded-full transition-all duration-200 ease-in-out ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span 
                className={`block h-0.5 w-4 bg-white rounded-full transition-all duration-200 ease-in-out ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span 
                className={`block h-0.5 w-3 bg-white rounded-full transition-all duration-200 ease-in-out ${
                  isMenuOpen ? '-rotate-45 -translate-y-2 w-full' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* 모바일 메뉴 */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <nav className="flex flex-col items-center space-y-6 text-center">
              {navigationLinks.map((item: NavLink, index: number) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="text-2xl font-bold text-white hover:text-primary-red transition-colors duration-200 block py-3 px-6 font-sans"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
