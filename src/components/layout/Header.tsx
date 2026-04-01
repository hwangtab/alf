import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from './MobileMenu';
import { navigationLinks } from '@/data/navigation';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 h-20 bg-[rgba(15,15,15,0.85)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-[10px]">
      <div className="container mx-auto flex justify-between items-center h-full px-2">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.webp"
            alt="예술해방전선 로고"
            width={80}
            height={21}
            className="h-6 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:block py-2">
          <ul className="flex items-center space-x-1 md:space-x-2">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-300 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileMenu links={navigationLinks} />
      </div>
    </header>
  );
}
