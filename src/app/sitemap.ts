import type { MetadataRoute } from 'next';

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
  { path: '/guide', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/news', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/videos', changeFrequency: 'weekly', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
