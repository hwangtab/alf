'use client';

// useState 제거 (hoveredAlbum 제거)
import { motion } from 'framer-motion';
// import { useState } from 'react'; // 사용하지 않으므로 제거
import albumsData from "@/data/albums.json";
import { Card } from '@/components/ui/Card'; // Card 컴포넌트 임포트

// 음반 타입 정의
type Album = {
  id: number;
  title: string;
  releaseDate: string;
  description: string;
  coverImage: string;
  tracks: string[];
  links: {
    spotify?: string;
    appleMusic?: string;
    youtubeMusic?: string;
    website?: string; // 추가
    youtube?: string; // 추가
    tumblbug?: string; // 추가
    // 기타 링크 타입
  };
};

// 플랫폼 아이콘 컴포넌트 (Card 컴포넌트 외부 또는 별도 파일로 분리 가능)
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'spotify':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      );
    case 'appleMusic':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.664.113 1.322.255 1.966.28 1.262.985 2.233 1.99 2.978.48.355 1.01.6 1.575.738.804.2 1.536.273 2.31.273l.42.007h11.03c.454-.058.91-.103 1.354-.22.602-.154 1.164-.383 1.68-.705 1.193-.75 1.996-1.756 2.395-3.084.093-.292.156-.593.21-.9.067-.392.124-.792.135-1.2.032-1.02.013-2.04.014-3.062v-8.116c-.002-.94.01-1.88-.026-2.82zm-12.898 3.55c-.357-.16-.75-.277-1.143-.28-.737-.01-1.404.19-1.99.64-.402.31-.74.693-.963 1.152-.362.742-.45 1.53-.36 2.338.054.465.194.915.42 1.332.284.53.662.97 1.147 1.306.673.47 1.424.644 2.23.624.922-.023 1.745-.35 2.42-1.01.618-.61.97-1.37 1.032-2.254.07-.965-.132-1.858-.65-2.67-.336-.53-.778-.93-1.302-1.25-.347-.208-.71-.35-1.09-.467l.048-.045z"/>
        </svg>
      );
    case 'youtubeMusic':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L16.2 12l-6.516 3.54z"/>
        </svg>
      );
    case 'website': // 추가
    case 'youtube': // 추가 (YouTube Music과 구분)
    case 'tumblbug': // 추가
    default: // 기본 외부 링크 아이콘
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/>
        </svg>
      );
  }
};

import type { Metadata } from 'next';
import { metadata } from './metadata';

export default function AlbumsPage() {
  const albums: Album[] = albumsData;
  // const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null); // 사용하지 않으므로 제거

  // getActualUrl 함수 제거됨

  // 애니메이션 변수 (소개 페이지와 동일하게)
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="container mx-auto py-20 px-4">
      <motion.h1 
        className="text-5xl font-bold mb-16 text-center text-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        음반 및 작품
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.map((album, index) => {
          // links 객체에서 첫 번째 유효한 URL 찾기
          const firstLink = Object.values(album.links).find(url => url && url !== '#');

          return (
            <Card
              key={album.id}
              href={firstLink} // 찾은 첫 번째 링크를 href로 전달
              imageUrl={album.coverImage}
              title={album.title} // alt text용 title
              imageAlt={`${album.title} 앨범 커버`}
              description={album.description} // 카드 본문에 표시될 설명
              index={index}
              aspectRatio="66.67%" // 3:2 비율로 통일
              imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 필요시 조정
              loadingPriority={index < 3}
              lineClamp={3} // 설명 줄 수 제한
              // imageChildren 제거 -> 제목은 카드 본문에서 표시
              // 발매일, 트랙리스트는 description 아래에 추가
              footerContent={ // 카드 하단에 링크 버튼 표시 (링크가 아닌 정보성으로 남겨둠)
              <div className="flex space-x-3">
                {Object.entries(album.links).map(([platform, url]) => (
                  url && url !== '#' ? (
                    <motion.a
                      key={platform}
                      href={url} // 실제 URL 직접 사용
                      // target="_blank" // 제거
                      rel="noopener noreferrer"
                      className="text-neutral-300 hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-700" // 배경색 약간 변경
                      whileHover={{ scale: 1.15, rotate: 5 }} // 애니메이션 약간 변경
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Listen on ${platform}`}
                    >
                      <PlatformIcon platform={platform} />
                    </motion.a>
                  ) : null
                ))}
              </div>
            }
          >
           {/* 카드 본문에 발매일 및 트랙리스트 추가 */}
           <div className="text-xs text-neutral-400 mt-2 mb-4"> {/* 설명 아래, 태그/링크 위에 위치 */}
             {album.releaseDate && <p>발매일: {new Date(album.releaseDate).toLocaleDateString('ko-KR')}</p>}
             {album.tracks && album.tracks.length > 0 && (
               <div className="mt-2">
                 <h4 className="font-semibold text-neutral-300 mb-1">수록곡:</h4>
                 <ul className="space-y-0.5">
                   {album.tracks.slice(0, 3).map((track, i) => (
                     <li key={i} className="line-clamp-1">{track}</li>
                   ))}
                   {album.tracks.length > 3 && <li className="line-clamp-1">...</li>}
                 </ul>
               </div>
             )}
           </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
