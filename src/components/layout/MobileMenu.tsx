'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import type { NavLink } from '@/data/navigation';

interface MobileMenuProps {
  links: NavLink[];
}

export default function MobileMenu({ links }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const triggerButton = buttonRef.current;

    if (!isMenuOpen) {
      document.body.classList.remove('menu-open');
      return;
    }

    document.body.classList.add('menu-open');

    const focusables = overlayRef.current
      ? Array.from(overlayRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      : [];
    focusables[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        return;
      }
      if (event.key === 'Tab' && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // 메뉴를 연 채 데스크톱 폭으로 넓히면 토글 버튼(md:hidden)이 사라져 오버레이에 갇힌다.
    // 숨기기만 하면 body 스크롤이 잠긴 채로 남으므로 실제로 닫는다.
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };
    desktopQuery.addEventListener('change', handleBreakpointChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleBreakpointChange);
      document.body.classList.remove('menu-open');
      triggerButton?.focus();
    };
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        className="block md:hidden text-white p-2 focus:outline-none relative z-[110]"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={isMenuOpen}
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

      {mounted &&
        isMenuOpen &&
        createPortal(
          <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] bg-black overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="메뉴"
          >
            {/* min-h-full + 부모 스크롤: 링크가 화면보다 길어지는 작은 기기에서도
                위쪽 항목이 잘리지 않고 닿는다. */}
            <nav className="min-h-full flex flex-col items-center justify-center gap-8 text-center py-24 px-4">
              {links.map((item, index) => (
                <div key={item.href} style={{ transitionDelay: `${index * 50}ms` }}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="text-white text-2xl font-bold py-3 px-6 block hover:text-red-400 transition-colors duration-200 font-sans"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>,
          document.body
        )}
    </>
  );
}
