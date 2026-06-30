import Link from 'next/link';
import type { GuideSection } from '@/data/guide-navigation';

export default function GuideTableOfContents({ sections }: { sections: GuideSection[] }) {
  return (
    <aside className="w-full lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-24 self-start lg:pr-8 lg:mr-8 lg:border-r border-neutral-700 lg:h-[calc(100vh-10rem)] lg:overflow-y-auto mb-12 lg:mb-0">
      <nav aria-label="가이드 목차">
        <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 hidden lg:block">목차</p>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <Link
                href={`#${section.id}`}
                className="block text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
