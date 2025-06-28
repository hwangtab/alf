'use client';

import { motion } from 'framer-motion';
import albumsData from "@/data/albums.json";
import { Card } from '@/components/ui/Card';

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
    website?: string;
    youtube?: string;
    tumblbug?: string;
  };
};

export default function AlbumsPage() {
  const albums: Album[] = albumsData;

  // 애니메이션 변수
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
        className="text-5xl font-bold mb-16 text-center text-white font-serif"
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
              href={firstLink}
              imageUrl={album.coverImage}
              title={album.title}
              imageAlt={`${album.title} 앨범 커버`}
              description={album.description}
              index={index}
              aspectRatio="66.67%" // 3:2 비율로 통일
              imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loadingPriority={index < 3}
              lineClamp={3}
            />
          );
        })}
      </div>
    </div>
  );
}
