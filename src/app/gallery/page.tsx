import fs from 'fs';
import path from 'path';
import GalleryClientPage from './GalleryClientPage';
import altTextsData from '@/data/gallery-alt-texts.json';
import { createGalleryImages, type GalleryAltTexts } from '@/utils/gallery';

const altTexts: GalleryAltTexts = altTextsData;

export default function GalleryPage() {
  // 빌드 시점에 서버에서 이미지 파일 목록 읽기
  const galleryDirectory = path.join(process.cwd(), 'public/images/gallery');
  const filenames = fs.readdirSync(galleryDirectory);
  const images = createGalleryImages(filenames, altTexts);

  // 클라이언트 컴포넌트에 데이터 전달
  return <GalleryClientPage images={images} />;
}
