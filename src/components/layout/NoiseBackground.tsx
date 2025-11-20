import type { CSSProperties } from 'react';

const noiseStyle: CSSProperties = {
  backgroundColor: '#050505',
  backgroundImage: `
    linear-gradient(125deg, rgba(255,255,255,0.03) 25%, transparent 25%),
    linear-gradient(305deg, rgba(255,255,255,0.025) 25%, transparent 25%),
    linear-gradient(0deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)),
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(255,255,255,0.03), transparent 45%)
  `,
  backgroundSize: '4px 4px, 4px 4px, 100% 100%, 220px 220px, 180px 180px',
  mixBlendMode: 'screen',
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
