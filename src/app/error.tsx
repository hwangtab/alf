"use client";

import React from "react";
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl md:text-8xl font-black mb-6 font-serif">
          <span className="text-gradient-art">오류</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-200 font-serif">
          문제가 발생했습니다
        </h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8">
          페이지를 로드하는 중 오류가 발생했습니다. 다시 시도해 주세요.
        </p>
        <motion.button
          onClick={() => reset()}
          className="btn-revolution inline-block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          다시 시도하기
        </motion.button>
      </motion.div>
    </div>
  );
}
