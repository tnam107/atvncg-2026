/* eslint-disable @next/next/no-img-element -- blob preview URLs are not supported by next/image */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, FileImage, Flame, LoaderCircle, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useIdentity } from "@/components/identity-provider";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { artists } from "@/lib/demo-data";
import { uploadMedia } from "@/lib/cloudinary-upload";
import { mediaTypeSchema, submissionTypeSchema, type SubmissionInput } from "@/lib/validation";
import type { SubmissionTypeValue } from "@/lib/types";

const copy: Record<SubmissionTypeValue, { title: string; description: string; contentLabel: string; contentPlaceholder: string }> = {
  LETTER: { title: "Viết một lá thư", description: "Lá thư sẽ xuất hiện sau khi được đội ngũ quản trị duyệt.", contentLabel: "Lời muốn gửi", contentPlaceholder: "Có điều gì bạn luôn muốn nói với các Anh Tài?" },
  MEMORY: { title: "Gửi một khoảnh khắc", description: "Ảnh và video được tải trực tiếp lên kho lưu trữ đám mây.", contentLabel: "Chú thích", contentPlaceholder: "Kể một chút về khoảnh khắc này..." },
  FANMADE: { title: "Chia sẻ sản phẩm", description: "Tụi mình trân trọng những tác phẩm thật sự do fan sáng tạo.", contentLabel: "Câu chuyện sản phẩm", contentPlaceholder: "Chất liệu, cảm hứng và quá trình bạn thực hiện..." },
  CALL: { title: "Đăng dự án fandom", description: "Minh chứng phê duyệt là bắt buộc để cộng đồng được an toàn.", contentLabel: "Thông tin dự án", contentPlaceholder: "Mục tiêu, thời gian, cách tham gia và đầu mối liên hệ..." },
};

const draftSchema = z.object({
  type: submissionTypeSchema,
  authorName: z.string().min(1),
  targetId: z.string().max(80).optional().nullable(),
  title: z.string().trim().max(120, "Tiêu đề tối đa 120 ký tự").optional().nullable(),
  content: z.string().trim().min(3, "Nội dung cần ít nhất 3 ký tự").max(3000, "Nội dung tối đa 3.000 ký tự"),
  mediaUrl: z.string().url().optional().nullable(),
  mediaType: mediaTypeSchema.optional().nullable(),
});

export function SubmissionDialog({ type, buttonLabel = "Gửi bài", buttonVariant = "primary", className }: { type: SubmissionTypeValue; buttonLabel?: string; buttonVariant?: ButtonProps["variant"]; className?: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const { identity, requireIdentity } = useIdentity();
  const details = copy[type];
  const needsMedia = type !== "LETTER";

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SubmissionInput>({
    resolver: zodResolver(draftSchema),
    defaultValues: { type, authorName: "Tạm", targetId: type === "MEMORY" ? null : "Tất cả Anh Tài", title: "", content: "", mediaUrl: null, mediaType: null },
  });

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function chooseFile(nextFile?: File) {
    if (preview) URL.revokeObjectURL(preview);
    setFile(nextFile ?? null);
    setPreview(nextFile ? URL.createObjectURL(nextFile) : null);
  }

  async function submit(values: SubmissionInput) {
    if (!identity) return;
    if (needsMedia && !file) { toast.error(type === "CALL" ? "Hãy tải lên minh chứng phê duyệt." : "Hãy chọn một ảnh hoặc video."); return; }
    if (type === "FANMADE" && !confirmed) { toast.error("Hãy xác nhận tác phẩm không sử dụng AI."); return; }

    try {
      const uploaded = file ? await uploadMedia(file) : null;
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          type,
          authorName: identity.mode === "anonymous" ? "Ẩn danh" : identity.nickname,
          mediaUrl: uploaded?.secureUrl ?? null,
          mediaType: uploaded?.mediaType ?? null,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Không thể gửi bài.");
      toast.success("Gửi thành công! Nội dung đã được lưu và đang chờ Admin duyệt…");
      reset();
      chooseFile();
      setConfirmed(false);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    }
  }

  return (
    <>
      <Button variant={buttonVariant} size="lg" className={className} onClick={() => requireIdentity(() => setOpen(true))}>
        <Flame size={18} fill="currentColor" /> {buttonLabel}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogTitle>{details.title}</DialogTitle>
          <DialogDescription>{details.description}</DialogDescription>

          <form onSubmit={handleSubmit(submit)} className="mt-6 grid gap-4">
            {type !== "MEMORY" && (
              <label>
                <span className="mb-2 block text-sm font-bold text-stone-700">Gửi đến</span>
                <select className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm font-semibold outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" {...register("targetId")}>
                  {artists.map((artist) => <option key={artist.id} value={artist.name}>{artist.name}</option>)}
                </select>
              </label>
            )}

            {(type === "FANMADE" || type === "CALL") && (
              <label>
                <span className="mb-2 block text-sm font-bold text-stone-700">Tiêu đề</span>
                <Input {...register("title")} placeholder={type === "CALL" ? "Tên dự án fandom" : "Tên sản phẩm của bạn"} />
                {errors.title && <span className="mt-1 block text-xs font-semibold text-red-600">{errors.title.message}</span>}
              </label>
            )}

            <label>
              <span className="mb-2 flex items-center justify-between text-sm font-bold text-stone-700">
                {details.contentLabel}<span className="font-medium text-stone-400">Từ: {identity?.mode === "anonymous" ? "Ẩn danh" : identity?.nickname}</span>
              </span>
              <Textarea {...register("content")} placeholder={details.contentPlaceholder} />
              {errors.content && <span className="mt-1 block text-xs font-semibold text-red-600">{errors.content.message}</span>}
            </label>

            {needsMedia && (
              <label className="group cursor-pointer rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/60 p-4 transition hover:border-orange-400 hover:bg-orange-50">
                <input type="file" accept="image/*,video/*" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0])} />
                <span className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-orange-600 shadow-sm">{preview ? <Check size={20} /> : <UploadCloud size={20} />}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-stone-800">{file?.name || (type === "CALL" ? "Tải minh chứng phê duyệt" : "Chọn ảnh hoặc video")}</span>
                    <span className="mt-0.5 block text-xs text-stone-500">Ảnh tối đa 10 MB · Video tối đa 100 MB</span>
                  </span>
                </span>
                {preview && file?.type.startsWith("image/") && <img src={preview} alt="Xem trước tệp đã chọn" className="mt-3 max-h-44 w-full rounded-xl object-cover" />}
              </label>
            )}

            {type === "FANMADE" && (
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 size-4 accent-orange-600" />
                <span className="text-sm leading-6 text-red-800"><strong>Nghiêm cấm sử dụng AI cho Fan Art.</strong> Tôi xác nhận đây là sản phẩm do mình thực hiện và có thể cung cấp minh chứng chính chủ khi được yêu cầu.</span>
              </label>
            )}

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : <FileImage size={18} />}
              {isSubmitting ? (file ? "Đang tải lên…" : "Đang gửi…") : "Gửi chờ duyệt"}
            </Button>
            <p className="text-center text-[11px] leading-5 text-stone-400">Bằng việc gửi bài, bạn đồng ý tuân thủ nguyên tắc cộng đồng và cho phép hiển thị nội dung sau khi duyệt.</p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
