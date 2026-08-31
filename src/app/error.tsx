"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 이 경계에서 삼켜버리면 프로덕션 오류의 흔적이 아무 데도 남지 않는다.
    // digest는 Vercel 서버 로그의 같은 오류를 찾는 열쇠라 함께 남긴다.
    console.error("페이지 렌더링 오류:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-6 font-serif">
          <span className="text-gradient-art">오류</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-200 font-serif">
          문제가 발생했습니다
        </h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8">
          페이지를 로드하는 중 오류가 발생했습니다. 다시 시도해 주세요.
        </p>
        <button
          onClick={() => reset()}
          className="btn-revolution inline-block transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          다시 시도하기
        </button>
        {error.digest && (
          <p className="mt-6 text-xs text-neutral-500">
            문의 시 알려주세요 — 오류 번호 {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
