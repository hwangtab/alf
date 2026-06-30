import test from 'node:test';
import assert from 'node:assert/strict';
import { guideSections } from '../data/guide-navigation.ts';
import { flattenGuideSectionIds } from './guide.ts';

test('guide navigation ids are unique across sections and subsections', () => {
  const ids = flattenGuideSectionIds(guideSections);
  assert.equal(new Set(ids).size, ids.length);
});

test('guide navigation preserves top-level section order', () => {
  assert.deepEqual(
    flattenGuideSectionIds(guideSections).slice(0, 5),
    ['intro', 'meeting', 'meeting-prep', 'meeting-visit', 'deepening']
  );
});
