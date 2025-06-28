'use client';

import Script from 'next/script';

export default function FontLoader() {
  return (
    <Script
      id="font-loader"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          if ('fonts' in document) {
            Promise.all([
              document.fonts.load('400 1rem PretendardVariable'),
              document.fonts.load('400 1rem SF_HambakSnow')
            ]).then(() => {
              document.documentElement.classList.add('fonts-loaded');
            });
          }
        `,
      }}
    />
  );
}