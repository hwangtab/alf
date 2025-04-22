/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // pages 디렉토리 (혹시 있다면)
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // app 디렉토리
  ],
  theme: {
    extend: {
      // 기존 커스텀 테마 설정이 있었다면 여기에 추가
      // 예: colors, fontFamily 등
      // globals.css의 :root 변수를 참조하도록 설정할 수도 있습니다.
      colors: {
        'primary-red': 'var(--primary-red)',
        'primary-orange': 'var(--primary-orange)',
        'primary-yellow': 'var(--primary-yellow)',
        'accent-blue': 'var(--accent-blue)',
        'accent-purple': 'var(--accent-purple)',
        'accent-green': 'var(--accent-green)',
        'neutral-100': 'var(--neutral-100)',
        'neutral-200': 'var(--neutral-200)',
        'neutral-300': 'var(--neutral-300)',
        'neutral-400': 'var(--neutral-400)',
        'neutral-500': 'var(--neutral-500)',
        'neutral-600': 'var(--neutral-600)',
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
        serif: ['Noto Serif KR', 'serif'],
        // inter: ['var(--font-inter)', 'sans-serif'], // layout.tsx에서 변수로 주입
      }
    },
  },
  plugins: [],
}