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

  return (
    <div className="container mx-auto pt-28 pb-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white font-giants-inline animate-fade-in-up">
          음반 및 작품
        </h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.map((album, index) => {
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
              aspectRatio="66.67%"
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
