// 커스텀 이미지 로더 - 정적 내보내기용
export default function customImageLoader({ src, width, quality }) {
  // 정적 파일의 경우 그대로 반환
  if (src.startsWith('/')) {
    return src;
  }
  
  // 외부 URL의 경우 최적화 파라미터 추가
  return `${src}?w=${width}&q=${quality || 75}`;
}
