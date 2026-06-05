/**
 * BajaSunset — custom vintage sunset SVG
 * Works at any size; designed to feel like an old Baja surf-club seal.
 */
export function BajaSunset({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      {/* Sky gradient background */}
      <defs>
        <radialGradient id="skyGrad" cx="50%" cy="75%" r="75%">
          <stop offset="0%"  stopColor="#f5a623" />
          <stop offset="45%" stopColor="#e8622a" />
          <stop offset="100%" stopColor="#2d5a52" />
        </radialGradient>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#ffe066" />
          <stop offset="60%" stopColor="#f5a623" />
          <stop offset="100%" stopColor="#e8622a" />
        </radialGradient>
        <clipPath id="circleClip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>

      {/* Outer ring */}
      <circle cx="50" cy="50" r="48" fill="url(#skyGrad)" />

      {/* Sun rays — radiating lines behind the sun */}
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((angle, i) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        const x1 = 50 + Math.cos(rad) * 24;
        const y1 = 58 + Math.sin(rad) * 24;
        const x2 = 50 + Math.cos(rad) * 46;
        const y2 = 58 + Math.sin(rad) * 46;
        return (
          <line
            key={i}
            x1={x1} y1={y1}
            x2={x2} y2={y2}
            stroke="#ffe066"
            strokeWidth={i % 2 === 0 ? "2.5" : "1.5"}
            strokeOpacity="0.7"
            strokeLinecap="round"
            clipPath="url(#circleClip)"
          />
        );
      })}

      {/* Ocean — lower half */}
      <path d="M 2 62 L 98 62 L 98 98 L 2 98 Z" fill="#1a3a2f" clipPath="url(#circleClip)" />
      {/* Ocean shimmer lines */}
      <path d="M 15 67 Q 30 65, 45 67 T 75 67" fill="none" stroke="#2d5a52" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 20 73 Q 38 71, 55 73 T 85 73" fill="none" stroke="#2d5a52" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 10 79 Q 32 77, 50 79 T 90 79" fill="none" stroke="#2d5a52" strokeWidth="1" strokeLinecap="round" />
      {/* Sun reflection on water */}
      <path d="M 42 63 L 44 72 L 56 72 L 58 63 Z" fill="#f5a623" fillOpacity="0.25" clipPath="url(#circleClip)" />

      {/* Horizon line */}
      <line x1="2" y1="62" x2="98" y2="62" stroke="#e8622a" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* Sun semicircle */}
      <path d="M 26 62 A 24 24 0 0 1 74 62 Z" fill="url(#sunGrad)" />
      {/* Sun inner glow ring */}
      <path d="M 32 62 A 18 18 0 0 1 68 62 Z" fill="#ffe066" fillOpacity="0.3" />

      {/* Vintage border ring */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="#e8622a" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#1a3a2f" strokeWidth="2.5" />
    </svg>
  );
}
