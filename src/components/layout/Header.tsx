'use client';

import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import { createPortal } from 'react-dom'; // createPortal 임포트
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // useRouter 임포트 제거
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationLinks, NavLink } from '@/data/navigation'; // 네비게이션 데이터 및 타입 임포트

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null); // Portal 대상 노드 상태
  // const router = useRouter(); // useRouter 훅 사용 제거

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 스크롤 잠금 효과
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

  // Portal 대상 노드 설정 (클라이언트 측에서만 실행)
  useEffect(() => {
    const node = document.getElementById('drawer-root');
    if (node) {
      setPortalNode(node);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 로고 애니메이션 변수
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

  // 헤더 배경 애니메이션 변수
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
    <motion.header
      className="fixed top-0 left-0 right-0 z-[999] px-4" // z-index 증가
      initial="transparent"
      animate={isScrolled ? "solid" : "transparent"}
      variants={headerVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center h-full">
        {/* 로고 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={logoVariants}
        >
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setIsMenuOpen(false)} // 메뉴 닫기만 수행
          >
            <span className="text-gradient text-2xl font-bold tracking-tighter">예술해방전선 아카이브</span>
          </Link>
        </motion.div>

        {/* 데스크톱 네비게이션 */}
        <div className="hidden md:block">
          <Navigation isScrolled={isScrolled} />
        </div>

        {/* 모바일 메뉴 토글 버튼 */}
        <motion.button
          className="block md:hidden text-white p-2 focus:outline-none"
          onClick={toggleMenu}
          whileTap={{ scale: 0.95 }}
          aria-label="메뉴 열기"
        >
          <div className="w-6 flex flex-col items-end space-y-1.5">
            <motion.span 
              className="block h-0.5 bg-white rounded-full" 
              style={{ width: isMenuOpen ? '24px' : '24px' }}
              animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 8 : 0 }}
            />
            <motion.span 
              className="block h-0.5 bg-white rounded-full" 
              style={{ width: '18px' }}
              animate={{ opacity: isMenuOpen ? 0 : 1 }}
            />
            <motion.span 
              className="block h-0.5 bg-white rounded-full" 
              style={{ width: isMenuOpen ? '24px' : '12px' }}
              animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -8 : 0 }}
            />
          </div>
        </motion.button>
      </div>

      {/* 모바일 드로어 메뉴 (Portal 사용 및 AnimatePresence 위치 수정) */}
      {portalNode && createPortal( // portalNode가 설정되면 항상 Portal 생성
        <AnimatePresence>
          {isMenuOpen && ( // isMenuOpen 상태에 따라 내부 요소 렌더링
            <>
              {/* 오버레이 */}
              <motion.div
              className="fixed inset-0 bg-black/50 z-40" // 오버레이 z-index
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleMenu} // 오버레이 클릭 시 메뉴 닫기
            />

            {/* 드로어 메뉴 */}
            <motion.div
              className="fixed top-0 right-0 h-full w-64 sm:w-80 bg-neutral-900 shadow-xl z-50 flex flex-col p-8" // 드로어 스타일 및 z-index
              initial={{ x: "100%" }} // 오른쪽 밖에서 시작
              animate={{ x: 0 }} // 오른쪽으로 슬라이드 인
              exit={{ x: "100%" }} // 오른쪽 밖으로 슬라이드 아웃
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            >
              {/* 닫기 버튼 (선택 사항, 오버레이로도 닫힘) */}
              <button onClick={toggleMenu} className="self-end mb-8 text-neutral-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <nav className="flex flex-col items-start space-y-6"> {/* items-start로 변경 */}
                {navigationLinks.map((item: NavLink, index: number) => ( // 타입 명시
                  <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  {/* 홈 링크와 다른 링크 렌더링 통합 */}
                  <Link
                    href={item.href}
                    className="text-xl font-medium text-neutral-200 hover:text-primary-red transition-colors" // 텍스트 크기 및 스타일 조정
                    onClick={() => setIsMenuOpen(false)} // 메뉴 닫기만 수행
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            {/* 소셜 미디어 링크 (드로어 하단으로 이동) */}
            <motion.div
              className="mt-auto pt-8 flex space-x-6" // mt-auto로 하단 정렬, pt-8 추가
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {/* 소셜 미디어 아이콘들 */}
              <a
                href="https://www.facebook.com/artliberationfront"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-600 transition-colors" // hover 색상 변경
              >
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@artliberationfront"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-600 transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </motion.div>
            {/* </motion.div> */} {/* 소셜 링크 div 닫기 */}
            </motion.div> {/* 드로어 div 닫기 */}
            </>
          )}
        </AnimatePresence>,
        portalNode // Portal 대상 노드 전달
      )}
    </motion.header>
  );
};

export default Header;
