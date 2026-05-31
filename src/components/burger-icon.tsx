"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

export function BurgerIcon({
  className,
  preferReal = false,
}: {
  className?: string;
  preferReal?: boolean;
}) {
  const [useFallback, setUseFallback] = useState(false);

  if (preferReal && !useFallback) {
    return (
      <Image
        src="/brand/el-burguer-shack-burger-tight.png"
        alt=""
        width={240}
        height={180}
        className={clsx("burger-stamp object-contain", className)}
        onError={() => setUseFallback(true)}
        priority
      />
    );
  }

  return (
    <svg
      viewBox="0 0 120 90"
      aria-hidden="true"
      className={clsx("burger-stamp drop-shadow-[0_0.18rem_0_rgba(36,20,15,0.22)]", className)}
    >
      <path
        d="M17 43c4-24 22-34 45-34 25 0 40 12 43 34H17Z"
        fill="#e7b35f"
        stroke="#173b2c"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M35 23h3M52 16h4M69 22h3M84 30h4M48 31h3" stroke="#173b2c" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M17 44c13 8 25 8 38 0 13-8 27-8 48 0"
        fill="none"
        stroke="#b7192c"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M17 49c11-5 19-5 29 0 10 6 21 6 34 0 10-5 17-5 25 0"
        fill="none"
        stroke="#f4d06f"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M22 56c10-7 21-7 34 0 13 7 25 7 42 0"
        fill="none"
        stroke="#2f7f45"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M20 61c8 12 21 18 40 18 20 0 33-6 41-18H20Z"
        fill="#d9994b"
        stroke="#173b2c"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M24 76c21 6 48 6 73 0" stroke="#173b2c" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}
