'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationLinks, NavLink } from '@/data/navigation';
import { createPortal } from 'react-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // iOS Safari 동적 뷰포트 높이 계산
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 모바일 메뉴 컴포넌트
  const MobileMenu = () => (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="fixed bg-black bg-opacity-95 flex flex-col items-center justify-center"
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: 'calc(var(--vh, 1vh) * 100)',
            minHeight: '100vh', // fallback
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col items-center space-y-8 text-center px-8 w-full">
            {navigationLinks.map((item: NavLink, index: number) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-3xl font-bold text-white hover:text-primary-red transition-colors block py-4 px-8"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    transparent: { 
      backgroundColor: 'rgba(15, 15, 15, 0)',
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      height: '80px'
    },
    solid: { 
      backgroundColor: 'rgba(15, 15, 15, 0.85)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      height: '70px',
      backdropFilter: 'blur(10px)'
    }
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-4"
        initial="transparent"
        animate={isScrolled ? "solid" : "transparent"}
        variants={headerVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex justify-between items-center h-full overflow-hidden px-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={logoVariants}
          >
            <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/images/logo.webp"
                alt="예술해방전선 로고"
                width={100}
                height={26}
                className="h-auto w-auto max-w-full object-contain px-1"
                priority
              />
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <Navigation isScrolled={isScrolled} />
          </div>

          <motion.button
            className={`block md:hidden text-white p-2 focus:outline-none relative ${isMenuOpen ? 'z-[110]' : 'z-10'}`}
            onClick={toggleMenu}
            whileTap={{ scale: 0.95 }}
            aria-label="메뉴 열기"
          >
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <motion.span 
                className="block h-0.5 bg-white rounded-full" 
                style={{ width: '24px' }}
                animate={{ 
                  rotate: isMenuOpen ? 45 : 0, 
                  y: isMenuOpen ? 8 : 0,
                  transformOrigin: 'center'
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span 
                className="block h-0.5 bg-white rounded-full" 
                style={{ width: '18px' }}
                animate={{ opacity: isMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span 
                className="block h-0.5 bg-white rounded-full" 
                style={{ width: isMenuOpen ? '24px' : '12px' }}
                animate={{ 
                  rotate: isMenuOpen ? -45 : 0, 
                  y: isMenuOpen ? -8 : 0,
                  width: isMenuOpen ? '24px' : '12px',
                  transformOrigin: 'center'
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        </div>
      </motion.header>

      {/* 포털을 사용하여 body에 모바일 메뉴 렌더링 */}
      {mounted && typeof window !== 'undefined' && createPortal(<MobileMenu />, document.body)}
    </>
  );
};

export default Header;
