export interface NavLink {
  href: string;
  label: string;
}

export const navigationLinks: NavLink[] = [
  { href: '/', label: '홈' },
  { href: '/about', label: '소개' },
  { href: '/activities', label: '활동' },
  { href: '/albums', label: '음반/작품' },
  { href: '/videos', label: '비디오' }, // 비디오 메뉴 추가 (갤러리 앞으로 이동)
  { href: '/gallery', label: '갤러리' },
  { href: '/guide', label: '가이드' },
  { href: '/news', label: '뉴스레터' },
  // { href: '/support', label: '후원하기' },
];