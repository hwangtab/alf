'use client';

import Script from 'next/script';

export default function FontLoader() {
  return (
    <Script
      id="font-loader"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // 폰트 로딩 상태 추적
            const fontLoadStatus = {
              pretendard: false,
              sfHambak: false,
              timeout: false
            };
            
            // 디버깅 로그 함수
            function logFontStatus(message, details) {
              if (typeof window !== 'undefined' && window.console) {
                console.log('[FontLoader]', message, details || '');
              }
            }
            
            // 폰트 로딩 완료 처리
            function markFontsLoaded() {
              if (!fontLoadStatus.timeout) {
                document.documentElement.classList.add('fonts-loaded');
                logFontStatus('All fonts loaded successfully');
              }
            }
            
            // 타임아웃 처리 (5초 후 강제 완료)
            const timeoutId = setTimeout(() => {
              fontLoadStatus.timeout = true;
              document.documentElement.classList.add('fonts-loaded');
              logFontStatus('Font loading timeout - falling back to system fonts');
            }, 5000);
            
            if ('fonts' in document) {
              // 개선된 폰트 로딩 로직
              const fontPromises = [
                document.fonts.load('400 1rem PretendardVariable').then(() => {
                  fontLoadStatus.pretendard = true;
                  logFontStatus('PretendardVariable loaded');
                }).catch(() => {
                  logFontStatus('PretendardVariable failed, trying static version');
                  return document.fonts.load('400 1rem PretendardStatic');
                }),
                
                document.fonts.load('400 1rem SF_HambakSnow').then(() => {
                  fontLoadStatus.sfHambak = true;
                  logFontStatus('SF_HambakSnow loaded');
                }).catch(() => {
                  logFontStatus('SF_HambakSnow failed - using fallback');
                }),
                
                // Giants-Inline 폰트도 확인
                document.fonts.load('400 1rem Giants-Inline').catch(() => {
                  logFontStatus('Giants-Inline failed - using fallback');
                })
              ];
              
              Promise.allSettled(fontPromises).then((results) => {
                clearTimeout(timeoutId);
                
                // 최소 하나의 커스텀 폰트라도 로드되면 완료 처리
                const hasAnyFont = results.some(result => result.status === 'fulfilled');
                
                if (hasAnyFont) {
                  markFontsLoaded();
                  logFontStatus('Font loading completed', {
                    pretendard: fontLoadStatus.pretendard,
                    sfHambak: fontLoadStatus.sfHambak
                  });
                } else {
                  // 모든 폰트 로딩 실패 시에도 완료 처리 (시스템 폰트 사용)
                  markFontsLoaded();
                  logFontStatus('All fonts failed - using system fallbacks');
                }
              });
            } else {
              // document.fonts API 지원하지 않는 구형 브라우저
              clearTimeout(timeoutId);
              markFontsLoaded();
              logFontStatus('document.fonts not supported - using system fonts');
            }
          })();
        `,
      }}
    />
  );
}