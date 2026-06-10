import videosData from "@/data/videos.json";

export interface Video {
  id: number;
  title: string;
  publishDate: string;
  youtubeUrl: string;
}

export interface VideoCardData extends Video {
  thumbnailUrl: string;
  formattedPublishDate: string;
}

const YOUTUBE_ID_PATTERN =
  /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

export const getYouTubeVideoId = (url: string): string | null => {
  const match = url.match(YOUTUBE_ID_PATTERN);
  return match && match[2].length === 11 ? match[2] : null;
};

export const getYouTubeThumbnailUrl = (videoId: string): string =>
  `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

export const sortedVideos: VideoCardData[] = [...videosData]
  .sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )
  .map((video) => {
    const videoId = getYouTubeVideoId(video.youtubeUrl);

    return {
      ...video,
      thumbnailUrl: videoId
        ? getYouTubeThumbnailUrl(videoId)
        : "/images/social-thumbnail.webp",
      formattedPublishDate: new Date(video.publishDate).toLocaleDateString(
        "ko-KR"
      ),
    };
  });
