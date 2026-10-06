"use client";

import { useState } from "react";

export function coverAlt(title: string, author: string) {
  return `Cover of ${title} by ${author}`;
}

export function BookCover({
  title,
  author,
  coverUrl,
  className = "",
}: {
  title: string;
  author: string;
  coverUrl: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const box = `aspect-[2/3] w-full overflow-hidden rounded bg-stone-200 ${className}`;

  if (!coverUrl || failed) {
    return (
      <div
        role="img"
        aria-label={coverAlt(title, author)}
        data-placeholder="cover"
        className={`${box} flex flex-col justify-between border border-stone-300 bg-stone-200 p-3 text-stone-800`}
      >
        <span className="text-sm font-semibold leading-snug">{title}</span>
        <span className="text-xs text-stone-600">{author}</span>
      </div>
    );
  }

  return (
    <div className={box}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverUrl}
        alt={coverAlt(title, author)}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
