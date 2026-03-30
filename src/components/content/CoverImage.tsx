/**
 * [INPUT]: cover URL string
 * [OUTPUT]: CoverImage — external image with graceful fallback
 * [POS]: components/content/ client component, consumed by EntryList
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState } from "react";

export function CoverImage({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-pink-950/20 text-[10px] font-vt323 text-gray-500 tracking-wider ${className}`}>
        IMAGE UNAVAILABLE
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={`w-full h-full object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
