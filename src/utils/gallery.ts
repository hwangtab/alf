export interface GalleryImage {
  src: string;
  alt: string;
}

export type GalleryAltTexts = Record<string, string>;

const PLACEHOLDER_TEXT = '설명이 필요한 예술해방전선 갤러리 이미지';
const IMAGE_EXT_RE = /\.(webp|jpg|jpeg|png)$/i;

export function isGalleryImageFile(fileName: string) {
  return IMAGE_EXT_RE.test(fileName);
}

export function createFallbackAltText(fileName: string) {
  const cleaned = fileName
    .replace(IMAGE_EXT_RE, '')
    .replace(/[_-]+/g, ' ')
    .trim();

  return cleaned
    ? `예술해방전선 활동 기록 사진 ${cleaned}`
    : '예술해방전선 활동 현장 기록 사진';
}

export function resolveGalleryAltText(candidate: string | undefined, fileName: string) {
  if (!candidate || candidate.trim().length === 0) {
    return createFallbackAltText(fileName);
  }

  if (candidate.includes(PLACEHOLDER_TEXT)) {
    return createFallbackAltText(fileName);
  }

  return candidate;
}

export function sortGalleryFilenames(files: string[]) {
  return [...files].sort((a, b) => {
    const isDSC_A = /^DSC\d+/.test(a);
    const isDSC_B = /^DSC\d+/.test(b);
    if (isDSC_A && isDSC_B) {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numB - numA;
    }

    const isIMG_A = /^IMG[_-]\d+/.test(a);
    const isIMG_B = /^IMG[_-]\d+/.test(b);
    if (isIMG_A && isIMG_B) {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numB - numA;
    }

    const isKakao_A = /^KakaoTalk/.test(a);
    const isKakao_B = /^KakaoTalk/.test(b);
    if (isKakao_A && isKakao_B) {
      return b.localeCompare(a);
    }

    return b.localeCompare(a);
  });
}

function lookupAltText(altTexts: GalleryAltTexts, fileName: string) {
  const baseFileName = fileName.replace(IMAGE_EXT_RE, '');
  const pngFileName = `${baseFileName}.png`;
  return altTexts[pngFileName] || altTexts[fileName];
}

export function createGalleryImages(files: string[], altTexts: GalleryAltTexts): GalleryImage[] {
  return sortGalleryFilenames(files.filter(isGalleryImageFile)).map((fileName) => ({
    src: `/images/gallery/${fileName}`,
    alt: resolveGalleryAltText(lookupAltText(altTexts, fileName), fileName),
  }));
}
