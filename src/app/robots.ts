import type { MetadataRoute } from 'next';

const baseUrl = 'https://alf.seoul.kr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      // AI 언어모델 크롤러 명시적 허용
      {
        // OpenAI (ChatGPT)
        userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot'],
        allow: '/',
      },
      {
        // Anthropic (Claude)
        userAgent: ['ClaudeBot', 'Claude-User', 'Claude-SearchBot'],
        allow: '/',
      },
      {
        // Perplexity
        userAgent: ['PerplexityBot', 'Perplexity-User'],
        allow: '/',
      },
      {
        // Google Gemini / AI Overviews
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        // Common Crawl (AI 학습 데이터셋)
        userAgent: 'CCBot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
