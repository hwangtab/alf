'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { NavLink } from '@/data/navigation';

interface MobileMenuProps {
  links: NavLink[];
}

export default function MobileMenu({ links }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.classList.remove('menu-open');
      return;
    }

    document.body.classList.add('menu-open');

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      <button
        className="hamburger-button block md:hidden text-white p-2 focus:outline-none relative z-[110]"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        type="button"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-in-out origin-center ${
              isMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-in-out origin-center ${
              isMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </div>
      </button>

      {isMenuOpen && (
        <div
          className="mobile-menu-overlay fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
        >
          <nav className="flex flex-col items-center gap-8 text-center">
            {links.map((item, index) => (
              <div key={item.href} style={{ transitionDelay: `${index * 50}ms` }}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="text-white text-2xl font-bold py-3 px-6 block hover:text-red-400 transition-colors duration-200"
                  style={{
                    fontFamily:
                      'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
