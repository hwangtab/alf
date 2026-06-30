import type { NewsletterBlock } from '@/types/newsletter';

export type NewsletterMeta = {
  id: number;
  title: string;
  publishDate: string;
  link: string;
  summary?: string;
  thumbnail?: string;
};

export type NewsletterNavigation = {
  prevId: number | null;
  nextId: number | null;
  prevMeta: NewsletterMeta | null;
  nextMeta: NewsletterMeta | null;
};

export function getNewsletterMeta(
  newsletters: NewsletterMeta[],
  id: number
): NewsletterMeta | undefined {
  return newsletters.find((newsletter) => newsletter.id === id);
}

export function formatNewsletterDate(iso: string) {
  const [datePart] = iso.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

export function getNewsletterOgImage(
  meta: Pick<NewsletterMeta, 'thumbnail'>,
  blocks: NewsletterBlock[]
) {
  const firstImage = blocks.find((block) => block.type === 'image') as
    | { type: 'image'; src: string; alt: string }
    | undefined;

  return meta.thumbnail || firstImage?.src || '/images/social-thumbnail.webp';
}

export function getNewsletterNavigation(
  newsletters: NewsletterMeta[],
  migratedIds: number[],
  currentId: number
): NewsletterNavigation {
  const sortedIds = migratedIds
    .filter((id) => getNewsletterMeta(newsletters, id))
    .sort((a, b) => {
      const metaA = getNewsletterMeta(newsletters, a);
      const metaB = getNewsletterMeta(newsletters, b);
      return new Date(metaA!.publishDate).getTime() - new Date(metaB!.publishDate).getTime();
    });
  const currentIndex = sortedIds.indexOf(currentId);
  const prevId = currentIndex > 0 ? sortedIds[currentIndex - 1] : null;
  const nextId = currentIndex >= 0 && currentIndex < sortedIds.length - 1 ? sortedIds[currentIndex + 1] : null;

  return {
    prevId,
    nextId,
    prevMeta: prevId ? getNewsletterMeta(newsletters, prevId) ?? null : null,
    nextMeta: nextId ? getNewsletterMeta(newsletters, nextId) ?? null : null,
  };
}

export function absoluteSiteImageUrl(baseUrl: string, imageUrl: string) {
  return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : imageUrl;
}
