import { Sparkles } from "lucide-react";
import { FireButton } from "@/components/fire-button";
import { SubmissionMediaGallery } from "@/components/submission-media-gallery";
import type { PublicSubmission } from "@/lib/types";
import { formatDate, normalizeSubmissionMedia } from "@/lib/utils";

export function MediaCard({ item }: { item: PublicSubmission }) {
  const mediaItems = normalizeSubmissionMedia(item.mediaItems, item.mediaUrl, item.mediaType);
  return (
    <article className="group reveal-on-scroll overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-[0_12px_40px_rgba(120,53,15,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(120,53,15,.13)]">
      <SubmissionMediaGallery items={mediaItems} alt={item.title || item.content} />
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
