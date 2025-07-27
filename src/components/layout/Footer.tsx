'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  // 애니메이션 변수
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="relative bg-neutral-900 text-neutral-200 py-16 px-4 border-t border-neutral-800 overflow-hidden">
      {/* 배경 그라디언트 효과 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary-red to-transparent opacity-20"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-purple to-transparent opacity-10"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 motion-element"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* 로고 및 소개 */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gradient text-2xl font-bold mb-4 font-test-serif">예술해방전선</h3>
            <p className="text-neutral-400 mb-6 font-test-sans">
              예술을 통해 사회적 불평등에 저항하고, 소외된 이들과 연대하며, 모두가 존엄하게 살아갈 수 있는 세상을 만들어갑니다.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/artliberationfront"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-blue-600 transition-colors" // hover 색상 변경
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
                className="text-neutral-400 hover:text-red-600 transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </motion.div>
          
          {/* 빠른 링크 */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4 text-white font-test-serif">바로가기</h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: '소개' },
                { href: '/activities', label: '활동' },
                { href: '/albums', label: '음반/작품' },
                { href: '/gallery', label: '갤러리' },
                { href: '/guide', label: '가이드' }, // 가이드 메뉴 추가
                { href: '/news', label: '뉴스레터' },
                // { href: '/support', label: '후원하기' }, // 활동 종료로 제거
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-neutral-400 hover:text-primary-red transition-colors inline-block py-1 font-test-sans"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* 연락처 */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4 text-white font-test-serif">연락처</h3>
            <ul className="space-y-2 text-neutral-400 font-test-sans">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <a href="mailto:alf.seoul.kr@gmail.com" className="hover:text-primary-red transition-colors font-test-sans">
                  alf.seoul.kr@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-primary-red" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.5c-5.247 0-9.5 3.533-9.5 7.892 0 2.847 2.082 5.348 5.195 6.864l-1.387 4.744a.4.4 0 0 0 .61.443l5.582-4.32a10.6 10.6 0 0 0 1.5.107c5.247 0 9.5-3.533 9.5-7.893C21.5 6.033 17.247 2.5 12 2.5z"/>
                </svg>
                <a href="https://open.kakao.com/me/Alfseoul" target="_blank" rel="noopener noreferrer" className="hover:text-primary-red transition-colors">
                  카카오톡 오픈채팅
                </a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <a href="https://naver.me/5dA3yzsC" target="_blank" rel="noopener noreferrer" className="hover:text-primary-red transition-colors">
                  서울특별시 은평구 대조동 84-3 3층
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        {/* 구분선 */}
        <div className="divider-art opacity-30 my-8"></div>
        
        {/* 저작권 */}
        <motion.div 
          className="text-center text-neutral-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          &copy; {new Date().getFullYear()} 예술해방전선. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
