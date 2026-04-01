import VideosClient from './VideosClient';
import { sortedVideos } from '@/utils/videos';

export default function VideosPage() {
  return (
    <div className="container mx-auto pt-28 pb-20 px-4">
      <h1 className="text-5xl font-bold mb-16 text-center text-white font-giants-inline">
        비디오
      </h1>
      <VideosClient videos={sortedVideos} />
    </div>
  );
}
