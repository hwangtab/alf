import type { MetadataRoute } from 'next';
import newslettersData from '@/data/newsletters.json';
import { migratedIds } from '@/data/newsletterContent';

const baseUrl = 'https://alf.seoul.kr';

const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: MetadataRoute.Sitemap[number]['priority'];
}> = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/activities', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/albums', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/gallery', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/guide', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/news', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/support', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/videos', changeFrequency: 'weekly', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const newsletterRoutes = migratedIds.map((id) => {
    const meta = (newslettersData as { id: number; publishDate: string }[]).find((n) => n.id === id);
    return {
      url: `${baseUrl}/news/${id}`,
      lastModified: meta ? new Date(meta.publishDate) : lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...newsletterRoutes];
}
