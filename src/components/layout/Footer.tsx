'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { navigationLinks, NavLink } from '@/data/navigation'; // 네비게이션 데이터 및 타입 임포트

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
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* 로고 및 소개 */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gradient text-2xl font-bold mb-4">예술해방전선 아카이브</h3>
            <p className="text-neutral-400 mb-6">
              우리가 함께 걸어온 예술 해방의 여정을 기록합니다. 이곳에서 지난 활동의 발자취를 돌아볼 수 있습니다.
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
            <h3 className="text-xl font-bold mb-4 text-white">바로가기</h3>
            <ul className="space-y-2">
              {/* navigationLinks 데이터 사용, 홈 링크 제외 */}
              {navigationLinks.filter(link => link.href !== '/').map((link: NavLink) => ( // 타입 명시
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-primary-red transition-colors inline-block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* 연락처 */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4 text-white">연락처</h3>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>hwangtab@gmail.com</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>서울특별시 은평구 대조동 84-3 3층</span>
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
          &copy; {new Date().getFullYear()} 예술해방전선 아카이브. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
