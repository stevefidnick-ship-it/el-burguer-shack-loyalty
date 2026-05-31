"use client";

import clsx from "clsx";
import { BurgerIcon } from "./burger-icon";

export function BrandMark({
  compact = false,
  tone = "green",
  className,
}: {
  compact?: boolean;
  tone?: "green" | "white";
  className?: string;
}) {
  // Always use the SVG — the PNGs have background issues (white box or invisible on dark).
  const ink = tone === "white" ? "#f8f4ea" : "#12331f";
  const accent = tone === "white" ? "#f8f4ea" : "#b7192c";

  return (
    <div className={clsx(compact ? "brand-mark-compact" : "brand-mark-full", className)}>
      <div className="relative mx-auto grid place-items-center">
        <svg
          viewBox="0 0 320 128"
          aria-label="El Burguer Shack"
          className="h-auto w-full overflow-visible"
        >
          <path
            d="M43 71C58 25 95 7 160 7s102 18 117 64"
            fill="none"
            stroke={ink}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M60 69c17-34 49-48 100-48s83 14 100 48"
            fill="none"
            stroke={accent}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M13 72h55M252 72h55" stroke={ink} strokeWidth="6" strokeLinecap="round" />
          <path
            d="M24 66c9-17 25-17 17 1 8-10 17-6 15 5M296 66c-9-17-25-17-17 1-8-10-17-6-15 5"
            fill="none"
            stroke={ink}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <foreignObject x="107" y="20" width="106" height="62">
            <BurgerIcon className="h-[62px] w-[106px]" preferReal />
          </foreignObject>
          <text
            x="17"
            y="104"
            fill="#b7192c"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="21"
            fontStyle="italic"
            letterSpacing="-1"
          >
            el
          </text>
          <text
            x="51"
            y="104"
            fill={ink}
            stroke={accent}
            strokeWidth="1.6"
            paintOrder="stroke"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="28"
            letterSpacing="1.5"
          >
            BURGUER SHACK
          </text>
          <path d="M61 119h77M182 119h77" stroke={ink} strokeWidth="5" strokeLinecap="round" />
          <text x="145" y="123" fill={ink} fontFamily="Arial Black, Arial, sans-serif" fontSize="9">
            ESTD
          </text>
          <text x="171" y="123" fill={ink} fontFamily="Arial Black, Arial, sans-serif" fontSize="9">
            2019
          </text>
          <text x="160" y="123" textAnchor="middle" fill={accent} fontFamily="Arial Black, Arial, sans-serif" fontSize="20">
            H
          </text>
        </svg>
      </div>
      <div className="sr-only">
        El Burguer Shack
      </div>
    </div>
  );
}
