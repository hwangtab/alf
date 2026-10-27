'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Card } from '@/components/ui/Card';
import type { VideoCardData } from '@/utils/videos';

const VIDEOS_PER_PAGE = 12;

interface VideosClientProps {
  videos: VideoCardData[];
}

export default function VideosClient({ videos }: VideosClientProps) {
  const [page, setPage] = useState(1);
  const displayedVideos = videos.slice(0, page * VIDEOS_PER_PAGE);
  const hasMore = displayedVideos.length < videos.length;

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (!inView || !hasMore) {
      return;
    }

    setPage((currentPage) => currentPage + 1);
    // displayedVideos.length: 붙인 뒤에도 감시 요소가 화면 안이면 inView가 그대로라 멈추므로 다시 확인한다
  }, [hasMore, inView, displayedVideos.length]);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedVideos.map((video, index) => (
          <Card
            key={video.id}
            href={video.youtubeUrl}
            imageUrl={video.thumbnailUrl}
            title={video.title}
            imageAlt={`${video.title} 유튜브 썸네일`}
            index={index % VIDEOS_PER_PAGE}
            aspectRatio="56.25%"
            imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loadingPriority={index < 3}
            useLazyMotion={false}
          >
            <div className="text-xs text-neutral-400 mt-2">
              게시일: {video.formattedPublishDate}
            </div>
          </Card>
        ))}

        {videos.length === 0 && (
          <p className="text-center text-neutral-400 py-12 md:col-span-2 lg:col-span-3">
            등록된 비디오가 없습니다.
          </p>
        )}
      </div>

      {/* 스크롤로 자동 로드되지만, 키보드 사용자도 닿을 수 있도록 버튼으로 둔다 */}
      {hasMore && (
        <div ref={ref} className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="rounded-md border border-neutral-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-primary-red hover:text-primary-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-red"
          >
            더 보기
          </button>
        </div>
      )}
    </>
  );
}
