'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import videosData from "@/data/videos.json";
import { Card } from '@/components/ui/Card';

// 비디오 타입 정의
type Video = {
  id: number;
  title: string;
  publishDate: string;
  youtubeUrl: string;
};

// YouTube URL에서 비디오 ID 추출 함수
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// YouTube 썸네일 URL 생성 함수 (sddefault: 640x480)
const getYouTubeThumbnailUrl = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
};

const VIDEOS_PER_PAGE = 12;

export default function VideosPage() {
  // 데이터 최신순 정렬
  const sortedVideos: Video[] = [...videosData].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  const [displayedVideos, setDisplayedVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const loadMoreVideos = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    setTimeout(() => {
      const nextVideos = sortedVideos.slice(0, page * VIDEOS_PER_PAGE);
      if (nextVideos.length >= sortedVideos.length) {
        setHasMore(false);
      }
      setDisplayedVideos(nextVideos);
      setPage(prev => prev + 1);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    loadMoreVideos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreVideos();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);


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
    <div className="container mx-auto pt-28 pb-20 px-4">
      <motion.h1 
        className="text-5xl font-bold mb-16 text-center text-white font-giants-inline"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        비디오
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedVideos.map((video, index) => {
          const videoId = getYouTubeVideoId(video.youtubeUrl);
          const thumbnailUrl = videoId ? getYouTubeThumbnailUrl(videoId) : '/images/placeholder.jpg'; // ID 추출 실패 시 플레이스홀더

          return (
            <Card
              key={video.id}
              href={video.youtubeUrl} // 카드 클릭 시 유튜브 링크로 이동
              imageUrl={thumbnailUrl}
              title={video.title} // Alt text 및 카드 제목
              imageAlt={`${video.title} 유튜브 썸네일`}
              index={index}
              aspectRatio="56.25%" // 16:9 비율 (유튜브 썸네일)
              imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
              loadingPriority={index < VIDEOS_PER_PAGE} // 첫 페이지 이미지 우선 로딩
            >
              {/* 카드 본문에 게시일 표시 */}
              <div className="text-xs text-neutral-400 mt-2">
                게시일: {new Date(video.publishDate).toLocaleDateString('ko-KR')}
              </div>
            </Card>
          );
        })}
      </div>

      {loading && (
        <div className="text-center text-white py-12">
          <p>로딩 중...</p>
        </div>
      )}

      {!hasMore && displayedVideos.length > 0 && (
        <div className="text-center text-neutral-400 py-12">
          <p>모든 비디오를 불러왔습니다.</p>
        </div>
      )}

      {/* 스크롤 감지를 위한 요소 */}
      {hasMore && <div ref={ref} className="h-10" />}

      {sortedVideos.length === 0 && (
        <motion.p 
          className="text-center text-neutral-400 py-12 md:col-span-2 lg:col-span-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          등록된 비디오가 없습니다.
        </motion.p>
      )}
    </div>
  );
}