import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatNewsletterDate,
  getNewsletterMeta,
  getNewsletterNavigation,
  getNewsletterOgImage,
  type NewsletterMeta,
} from './newsletters.ts';

const metas: NewsletterMeta[] = [
  { id: 1, title: '첫 호', publishDate: '2024-01-01', link: 'https://example.com/1' },
  { id: 2, title: '둘째 호', publishDate: '2024-02-01', link: 'https://example.com/2', thumbnail: '/thumb.webp' },
  { id: 3, title: '셋째 호', publishDate: '2024-03-01', link: 'https://example.com/3' },
];

test('formats newsletter publish date in Korean display format', () => {
  assert.equal(formatNewsletterDate('2024-02-03'), '2024년 2월 3일');
});

test('finds newsletter metadata by id', () => {
  assert.equal(getNewsletterMeta(metas, 2)?.title, '둘째 호');
  assert.equal(getNewsletterMeta(metas, 999), undefined);
});

test('computes previous and next newsletter within migrated ids by publish date', () => {
  const navigation = getNewsletterNavigation(metas, [3, 1, 2], 2);

  assert.equal(navigation.prevId, 1);
  assert.equal(navigation.nextId, 3);
  assert.equal(navigation.prevMeta?.title, '첫 호');
  assert.equal(navigation.nextMeta?.title, '셋째 호');
});

test('ignores migrated ids without metadata when computing navigation', () => {
  const navigation = getNewsletterNavigation(metas, [999, 3, 1, 2], 2);

  assert.equal(navigation.prevId, 1);
  assert.equal(navigation.nextId, 3);
});

test('uses thumbnail, first content image, then site fallback for newsletter OG image', () => {
  assert.equal(
    getNewsletterOgImage(metas[1], [{ type: 'paragraph', text: '본문' }]),
    '/thumb.webp'
  );
  assert.equal(
    getNewsletterOgImage(metas[0], [{ type: 'image', src: '/first.webp', alt: '첫 이미지' }]),
    '/first.webp'
  );
  assert.equal(
    getNewsletterOgImage(metas[2], [{ type: 'paragraph', text: '본문' }]),
    '/images/social-thumbnail.webp'
  );
});
