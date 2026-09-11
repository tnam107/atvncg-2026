import { z } from "zod";

const httpsUrl = z.string().trim().url("URL không hợp lệ").refine((value) => new URL(value).protocol === "https:", "URL phải dùng HTTPS");

export const guideMutationSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("UPSERT_ARTIST"),
    slug: z.string().trim().min(1).max(80),
    role: z.string().trim().max(120).optional().nullable(),
    content: z.string().trim().min(3, "Nội dung sổ tay cần ít nhất 3 ký tự").max(10000),
    imageUrl: httpsUrl.optional().nullable().or(z.literal("")),
  }),
  z.object({ action: z.literal("DELETE_ARTIST"), slug: z.string().trim().min(1).max(80) }),
  z.object({
    action: z.literal("CREATE_GLOSSARY"),
    term: z.string().trim().min(1, "Hãy nhập từ mới").max(80),
    definition: z.string().trim().min(3, "Định nghĩa cần ít nhất 3 ký tự").max(1000),
  }),
  z.object({
    action: z.literal("UPDATE_GLOSSARY"),
    id: z.string().min(1),
    term: z.string().trim().min(1).max(80),
    definition: z.string().trim().min(3).max(1000),
  }),
  z.object({ action: z.literal("DELETE_GLOSSARY"), id: z.string().min(1) }),
  z.object({
    action: z.literal("CREATE_EPISODE"),
    episodeNumber: z.number().int().min(1).max(99),
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().max(1000).optional().nullable(),
    imageUrl: httpsUrl,
    youtubeUrl: httpsUrl.refine((value) => ["youtube.com", "www.youtube.com", "youtu.be"].includes(new URL(value).hostname), "Cần dùng link YouTube"),
  }),
  z.object({
    action: z.literal("UPDATE_EPISODE"),
    id: z.string().min(1),
    episodeNumber: z.number().int().min(1).max(99),
    title: z.string().trim().min(2).max(160),
    description: z.string().trim().max(1000).optional().nullable(),
    imageUrl: httpsUrl,
    youtubeUrl: httpsUrl.refine((value) => ["youtube.com", "www.youtube.com", "youtu.be"].includes(new URL(value).hostname), "Cần dùng link YouTube"),
  }),
  z.object({ action: z.literal("DELETE_EPISODE"), id: z.string().min(1) }),
]);
