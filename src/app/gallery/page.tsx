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
const PLACEHOLDER_TEXT = '설명이 필요한 예술해방전선 갤러리 이미지';

const createFallbackAltText = (fileName: string) => {
  const cleaned = fileName
    .replace(/\.(webp|jpg|jpeg|png)$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();

  return cleaned
    ? `예술해방전선 활동 기록 사진 ${cleaned}`
    : '예술해방전선 활동 현장 기록 사진';
};

const resolveAltText = (candidate: string | undefined, fileName: string) => {
  if (!candidate || candidate.trim().length === 0) {
    return createFallbackAltText(fileName);
  }

  if (candidate.includes(PLACEHOLDER_TEXT)) {
    return createFallbackAltText(fileName);
  }

  return candidate;
};

export default function GalleryPage() {
  // 빌드 시점에 서버에서 이미지 파일 목록 읽기
  const galleryDirectory = path.join(process.cwd(), 'public/images/gallery');
  const filenames = fs.readdirSync(galleryDirectory);

  // 파일명 기반 날짜순 정렬 함수
  const sortImagesByDate = (files: string[]) => {
    return files.sort((a, b) => {
      // DSC 파일끼리 비교 (카메라 파일)
      const isDSC_A = /^DSC\d+/.test(a);
      const isDSC_B = /^DSC\d+/.test(b);
      if (isDSC_A && isDSC_B) {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numB - numA; // 최신순 (큰 숫자가 먼저)
      }

      // IMG 파일끼리 비교 (스마트폰 파일)
      const isIMG_A = /^IMG[_-]\d+/.test(a);
      const isIMG_B = /^IMG[_-]\d+/.test(b);
      if (isIMG_A && isIMG_B) {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numB - numA; // 최신순
      }

      // 카카오톡 파일끼리 비교
      const isKakao_A = /^KakaoTalk/.test(a);
      const isKakao_B = /^KakaoTalk/.test(b);
      if (isKakao_A && isKakao_B) {
        return b.localeCompare(a); // 역순
      }

      // 나머지는 알파벳 역순
      return b.localeCompare(a);
    });
  };

  // 이미지 데이터 가공
  const images: GalleryImage[] = sortImagesByDate(
    filenames.filter(file => /\.(webp|jpg|jpeg|png)$/i.test(file)) // 이미지 파일만 필터링
  ).map(file => {
    const baseFileName = file.replace(/\.(webp|jpg|jpeg|png)$/i, '');
    const pngFileName = `${baseFileName}.png`;
    const imageSrc = `/images/gallery/${file}`;
    const altTextCandidate = altTexts[pngFileName] || altTexts[file];

    return {
      src: imageSrc,
      alt: resolveAltText(altTextCandidate, file),
    };
  });

  // 클라이언트 컴포넌트에 데이터 전달
  return <GalleryClientPage images={images} />;
}
