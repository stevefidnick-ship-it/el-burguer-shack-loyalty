/** Custom vintage Baja palm tree silhouette */
export function PalmIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 80"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {/* Trunk — slight curve */}
      <path
        d="M 30 75 Q 28 55, 32 40 Q 34 28, 30 18"
        stroke="#1a3a2f"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Trunk grain */}
      <path d="M 29 65 Q 30 62, 31 65" stroke="#2d5a52" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M 29 55 Q 30 52, 31 55" stroke="#2d5a52" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

      {/* Frond 1 — up left */}
      <path d="M 30 18 Q 12 10, 4 20" stroke="#1a3a2f" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 16 12 Q 14 8, 6 10" stroke="#1a3a2f" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Frond 2 — up right */}
      <path d="M 30 18 Q 48 10, 56 20" stroke="#1a3a2f" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 44 12 Q 46 8, 54 10" stroke="#1a3a2f" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Frond 3 — left droop */}
      <path d="M 30 18 Q 10 20, 6 34" stroke="#1a3a2f" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 18 22 Q 10 28, 8 36" stroke="#1a3a2f" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Frond 4 — right droop */}
      <path d="M 30 18 Q 50 20, 54 34" stroke="#1a3a2f" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 42 22 Q 50 28, 52 36" stroke="#1a3a2f" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Frond 5 — straight up */}
      <path d="M 30 18 Q 26 6, 28 2" stroke="#1a3a2f" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Coconuts */}
      <circle cx="27" cy="20" r="2.5" fill="#8b4513" opacity="0.8" />
      <circle cx="33" cy="21" r="2" fill="#8b4513" opacity="0.8" />

      {/* Ground roots */}
      <path d="M 26 75 Q 20 74, 16 78" stroke="#1a3a2f" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M 34 75 Q 40 74, 44 78" stroke="#1a3a2f" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}
