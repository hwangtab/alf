"use client";

import React from "react";
import Link from "next/link";
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl md:text-8xl font-black mb-6">
          <span className="text-gradient">404</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-200">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" className="btn-revolution inline-block">
            홈으로 돌아가기
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
