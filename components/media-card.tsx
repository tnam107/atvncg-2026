/* eslint-disable @next/next/no-img-element -- user media has runtime URLs and unknown dimensions */
import { Play, Sparkles } from "lucide-react";
import { FireButton } from "@/components/fire-button";
import type { PublicSubmission } from "@/lib/types";
import { formatDate, safeMediaUrl } from "@/lib/utils";

export function MediaCard({ item }: { item: PublicSubmission }) {
  const mediaUrl = safeMediaUrl(item.mediaUrl);
  return (
    <article className="group overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-[0_12px_40px_rgba(120,53,15,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(120,53,15,.13)]">
      {mediaUrl && (
        <div className="relative overflow-hidden bg-orange-100">
          {item.mediaType === "VIDEO" ? <video src={mediaUrl} className="max-h-[560px] w-full object-cover" controls preload="metadata" /> : <img src={mediaUrl} alt={item.title || item.content} className="max-h-[620px] w-full object-cover transition duration-700 group-hover:scale-[1.03]" loading="lazy" />}
          {item.mediaType === "VIDEO" && <span className="pointer-events-none absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-stone-950/70 text-white backdrop-blur"><Play size={15} fill="currentColor" /></span>}
        </div>
      )}
      <div className="p-5">
        {item.title && <h2 className="text-lg font-black tracking-tight text-stone-950">{item.title}</h2>}
        <p className="mt-2 text-sm leading-6 text-stone-600">{item.content}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-xs font-extrabold text-stone-800"><Sparkles size={12} className="text-orange-500" />{item.authorName}</p>
            <p className="mt-1 text-[11px] text-stone-400">{formatDate(item.createdAt)}</p>
          </div>
          <FireButton id={item.id} initialCount={item.likesCount} compact />
        </div>
      </div>
    </article>
  );
}
