'use client';

interface ScrollToButtonProps {
  targetId: string;
  ariaLabel: string;
  className?: string;
}

export default function ScrollToButton({
  targetId,
  ariaLabel,
  className = "relative mt-8 mb-16 flex justify-center mx-auto p-3 cursor-pointer text-white hover:text-yellow-400 transition-colors",
}: ScrollToButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          targetElement.scrollIntoView({ behavior: prefersReduced ? 'instant' : 'smooth', block: 'start' });
        }
      }}
      aria-label={ariaLabel}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
