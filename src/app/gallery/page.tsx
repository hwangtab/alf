import fs from 'fs';
import path from 'path';
import GalleryClientPage from './GalleryClientPage';
import altTextsData from '@/data/gallery-alt-texts.json';

// 타입 정의
interface AltTexts {
  [key: string]: string;
}
interface GalleryImage {
  src: string;
  alt: string;
}

const altTexts: AltTexts = altTextsData;

export default function GalleryPage() {
  // 빌드 시점에 서버에서 이미지 파일 목록 읽기
  const galleryDirectory = path.join(process.cwd(), 'public/images/gallery');
  const filenames = fs.readdirSync(galleryDirectory);

  // 이미지 데이터 가공
  const images: GalleryImage[] = filenames
    .filter(file => /\.(webp|jpg|jpeg|png)$/i.test(file)) // 이미지 파일만 필터링
    .map(file => {
      const baseFileName = file.replace(/\.(webp|jpg|jpeg|png)$/i, '');
      const pngFileName = `${baseFileName}.png`;
      const imageSrc = `/images/gallery/${file}`;

      return {
        src: imageSrc,
        alt:
          altTexts[pngFileName] ||
          altTexts[file] ||
          '설명이 필요한 예술해방전선 갤러리 이미지',
      };
    });

  // 클라이언트 컴포넌트에 데이터 전달
  return <GalleryClientPage images={images} />;
}