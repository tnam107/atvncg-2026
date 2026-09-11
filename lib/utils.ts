import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MediaTypeValue, SubmissionMedia } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function safeMediaUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function normalizeSubmissionMedia(
  mediaItems: unknown,
  mediaUrl?: string | null,
  mediaType?: MediaTypeValue | null,
): SubmissionMedia[] {
  const normalized = Array.isArray(mediaItems)
    ? mediaItems.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const candidate = item as { url?: unknown; type?: unknown };
        const url = typeof candidate.url === "string" ? safeMediaUrl(candidate.url) : null;
        const type: MediaTypeValue | null = candidate.type === "IMAGE" || candidate.type === "VIDEO" ? candidate.type : null;
        return url && type ? [{ url, type }] : [];
      })
    : [];

  if (normalized.length > 0) return normalized.slice(0, 10);
  const legacyUrl = safeMediaUrl(mediaUrl);
  return legacyUrl && mediaType ? [{ url: legacyUrl, type: mediaType }] : [];
}
