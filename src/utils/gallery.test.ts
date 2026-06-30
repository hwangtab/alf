import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGalleryImages,
  resolveGalleryAltText,
  sortGalleryFilenames,
} from './gallery.ts';

test('sorts gallery camera and phone filenames newest first within each family', () => {
  assert.deepEqual(
    sortGalleryFilenames(['DSC0001.webp', 'DSC0010.webp', 'DSC0002.webp']),
    ['DSC0010.webp', 'DSC0002.webp', 'DSC0001.webp']
  );
  assert.deepEqual(
    sortGalleryFilenames(['IMG_0001.webp', 'IMG_0012.webp', 'IMG_0002.webp']),
    ['IMG_0012.webp', 'IMG_0002.webp', 'IMG_0001.webp']
  );
});

test('resolves converted webp filenames from png alt text keys', () => {
  const images = createGalleryImages(['peace-camp.webp'], {
    'peace-camp.png': '강정 피스 캠프 현장 사진',
  });

  assert.deepEqual(images, [
    {
      src: '/images/gallery/peace-camp.webp',
      alt: '강정 피스 캠프 현장 사진',
    },
  ]);
});

test('falls back from placeholder or missing alt text to readable filename text', () => {
  assert.equal(
    resolveGalleryAltText(undefined, 'kdh-DSC07532.webp'),
    '예술해방전선 활동 기록 사진 kdh DSC07532'
  );
  assert.equal(
    resolveGalleryAltText('설명이 필요한 예술해방전선 갤러리 이미지', 'IMG_3828.webp'),
    '예술해방전선 활동 기록 사진 IMG 3828'
  );
});
