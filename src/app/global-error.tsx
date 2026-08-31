'use client';

import { useEffect } from 'react';

/**
 * 루트 레이아웃 자체가 렌더에 실패하면 error.tsx는 뜨지 않는다(그 경계가 레이아웃 안에 있으므로).
 * 이 컴포넌트가 최후의 방어선이라 html·body를 직접 그리고, 전역 CSS도 기대하지 않는다.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('루트 레이아웃 오류:', error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          color: '#ffffff',
          fontFamily: "system-ui, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
          padding: '1rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '32rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 1rem' }}>
            문제가 발생했습니다
          </h1>
          <p style={{ color: '#a3a3a3', lineHeight: 1.7, margin: '0 0 2rem' }}>
            페이지를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              backgroundColor: '#ff3d3d',
              color: '#ffffff',
              fontWeight: 600,
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            다시 시도하기
          </button>
          {error.digest && (
            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#737373' }}>
              문의 시 알려주세요 — 오류 번호 {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
