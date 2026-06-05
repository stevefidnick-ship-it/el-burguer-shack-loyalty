/** Custom vintage Baja palapa (thatched-roof open hut) */
export function PalapaIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {/* Thatched roof — layered frond strokes */}
      <path d="M 40 8 L 6 40 L 74 40 Z" fill="#8b4513" opacity="0.9" />
      {/* Roof texture strokes */}
      <path d="M 40 8 L 10 36" stroke="#d9472b" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M 40 8 L 18 38" stroke="#d9472b" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M 40 8 L 26 40" stroke="#d9472b" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M 40 8 L 54 40" stroke="#d9472b" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M 40 8 L 62 38" stroke="#d9472b" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M 40 8 L 70 36" stroke="#d9472b" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      {/* Roof overhang line */}
      <path d="M 4 41 L 76 41" stroke="#1a3a2f" strokeWidth="2" strokeLinecap="round" />
      {/* Left post */}
      <rect x="15" y="41" width="4" height="30" rx="1" fill="#1a3a2f" />
      {/* Right post */}
      <rect x="61" y="41" width="4" height="30" rx="1" fill="#1a3a2f" />
      {/* Floor / base */}
      <path d="M 10 71 L 70 71" stroke="#1a3a2f" strokeWidth="2.5" strokeLinecap="round" />
      {/* Counter / bar surface */}
      <rect x="14" y="56" width="52" height="5" rx="1" fill="#1a3a2f" opacity="0.7" />
      {/* Small sign on bar */}
      <rect x="30" y="46" width="20" height="9" rx="1.5" fill="#d9472b" opacity="0.8" />
    </svg>
  );
}
