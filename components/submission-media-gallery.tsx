/* eslint-disable @next/next/no-img-element -- submission media uses validated runtime Cloudinary URLs */
"use client";

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useState } from "react";
import type { SubmissionMedia } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SubmissionMediaGallery({
  items,
  alt,
  contain = false,
  className,
}: {
  items: SubmissionMedia[];
  alt: string;
  contain?: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;
  const safeIndex = index % items.length;
  const active = items[safeIndex];
  const move = (direction: number) => setIndex((current) => (current + direction + items.length) % items.length);

  return (
    <div className={cn("relative overflow-hidden bg-[#fff0d8]", className)}>
      {active.type === "VIDEO" ? (
        <video key={active.url} src={active.url} className={cn("max-h-[560px] w-full", contain ? "object-contain" : "object-cover")} controls preload="metadata" />
      ) : (
        <img key={active.url} src={active.url} alt={`${alt} - ảnh ${safeIndex + 1}`} className={cn("max-h-[620px] w-full transition duration-700", contain ? "object-contain" : "object-cover group-hover:scale-[1.02]")} loading="lazy" />
      )}

      {active.type === "VIDEO" && (
        <span className="pointer-events-none absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-orange-950/75 text-white backdrop-blur">
          <Play size={15} fill="currentColor" />
        </span>
      )}

      {items.length > 1 && (
        <>
          <button type="button" onClick={() => move(-1)} aria-label="Xem tệp trước" className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-orange-900 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white"><ChevronLeft size={19} /></button>
          <button type="button" onClick={() => move(1)} aria-label="Xem tệp tiếp theo" className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-orange-900 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white"><ChevronRight size={19} /></button>
          <span className="absolute bottom-3 right-3 rounded-full bg-orange-950/75 px-3 py-1 text-[11px] font-black text-white backdrop-blur">{safeIndex + 1}/{items.length}</span>
          <div className="absolute bottom-3 left-3 flex gap-1.5 rounded-full bg-white/85 px-2.5 py-2 shadow-sm backdrop-blur">
            {items.map((item, itemIndex) => (
              <button key={`${item.url}-${itemIndex}`} type="button" onClick={() => setIndex(itemIndex)} aria-label={`Xem tệp ${itemIndex + 1}`} className={cn("size-1.5 cursor-pointer rounded-full transition", safeIndex === itemIndex ? "w-4 bg-orange-600" : "bg-orange-300 hover:bg-orange-500")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
