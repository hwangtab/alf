import path from 'path';
import sharp from 'sharp';

export type ImageSize = { width: number; height: number };

// 실제 크기를 못 읽었을 때만 쓴다. 이 비율로 자리를 잡으면 로드 후 레이아웃이 밀린다.
const FALLBACK_SIZE: ImageSize = { width: 800, height: 500 };

/**
 * public/ 아래 이미지의 실제 크기. next/image의 width/height가 실제 비율과 다르면
 * 브라우저가 잘못된 높이로 자리를 잡았다가 로드 후 밀어내므로(CLS) 빌드 시점에 읽는다.
 */
export async function getPublicImageSize(src: string): Promise<ImageSize> {
  if (!src.startsWith('/')) return FALLBACK_SIZE;

  try {
    const filePath = path.join(process.cwd(), 'public', decodeURI(src));
    const { width, height, orientation } = await sharp(filePath).metadata();
    if (!width || !height) return FALLBACK_SIZE;
    // EXIF 5~8은 90도 회전 — 표시되는 가로세로가 뒤바뀐다
    return orientation && orientation >= 5 ? { width: height, height: width } : { width, height };
  } catch {
    return FALLBACK_SIZE;
  }
}
