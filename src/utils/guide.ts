import type { GuideSection } from '@/data/guide-navigation';

export function flattenGuideSectionIds(sections: GuideSection[]) {
  return sections.flatMap((section) => [
    section.id,
    ...(section.subSections?.map((subSection) => subSection.id) ?? []),
  ]);
}
