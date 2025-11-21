import type { CSSProperties } from 'react';

const noiseStyle: CSSProperties = {
  backgroundColor: '#050505',
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0)),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")
  `,
  backgroundSize: 'cover, 200px 200px',
  mixBlendMode: 'overlay',
};

export default function NoiseBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 opacity-50"
      aria-hidden="true"
      style={noiseStyle}
    >
      <div className="w-full h-full animate-pulse" style={{ opacity: 0.7 }} />
    </div>
  );
}
