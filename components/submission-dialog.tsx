/* eslint-disable @next/next/no-img-element -- blob preview URLs are not supported by next/image */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, FileCheck2, FileImage, Flame, LoaderCircle, UploadCloud, X } from "lucide-react";
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
import { uploadMedia, uploadProof } from "@/lib/cloudinary-upload";
import { mediaTypeSchema, submissionTypeSchema } from "@/lib/validation";
import type { SubmissionTypeValue } from "@/lib/types";

const copy: Record<SubmissionTypeValue, { title: string; description: string; contentLabel: string; contentPlaceholder: string }> = {
  LETTER: { title: "Viết một lá thư", description: "Lá thư sẽ xuất hiện sau khi được đội ngũ quản trị duyệt.", contentLabel: "Lời muốn gửi", contentPlaceholder: "Có điều gì bạn luôn muốn nói với các Anh Tài?" },
  MEMORY: { title: "Gửi một khoảnh khắc", description: "Ảnh và video được tải trực tiếp lên kho lưu trữ đám mây.", contentLabel: "Chú thích", contentPlaceholder: "Kể một chút về khoảnh khắc này..." },
  FANMADE: { title: "Chia sẻ sản phẩm", description: "Tụi mình trân trọng những tác phẩm thật sự do fan sáng tạo.", contentLabel: "Câu chuyện sản phẩm", contentPlaceholder: "Chất liệu, cảm hứng và quá trình bạn thực hiện..." },
  CALL: {
    title: "Đăng dự án fandom",
    description: "Minh chứng cấp duyệt là bắt buộc để cộng đồng được an toàn.",
    contentLabel: "Thông tin dự án",
    contentPlaceholder: "Tên FC / nhóm tổ chức:\nĐại diện chịu trách nhiệm:\nMục đích:\nThời hạn và target:\nKênh liên hệ chính thức:\nLink / phương thức donate chính thức (nếu có):\nThông tin bổ sung:",
  },
};

const emptyCallDetails = {
  groupName: "",
  representative: "",
  purpose: "",
  deadlineTarget: "",
  contact: "",
  donation: "",
};

const draftSchema = z.object({
  type: submissionTypeSchema,
  authorName: z.string().min(1),
  targetId: z.string().max(80).optional().nullable(),
  title: z.string().trim().max(120, "Tiêu đề tối đa 120 ký tự").optional().nullable(),
  content: z.string().trim().max(3000, "Nội dung tối đa 3.000 ký tự"),
  mediaUrl: z.string().url().optional().nullable(),
  mediaType: mediaTypeSchema.optional().nullable(),
  mediaItems: z.array(z.object({ url: z.string().url(), type: mediaTypeSchema })).max(10).optional(),
  proofUrl: z.string().url().optional().nullable(),
  proofFileName: z.string().max(255).optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.type !== "CALL" && data.content.length < 3) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["content"], message: "Nội dung cần ít nhất 3 ký tự" });
  }
});

type SubmissionDraft = z.infer<typeof draftSchema>;

export function SubmissionDialog({ type, buttonLabel = "Gửi bài", buttonVariant = "primary", className }: { type: SubmissionTypeValue; buttonLabel?: string; buttonVariant?: ButtonProps["variant"]; className?: string }) {
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ file: File; preview: string }[]>([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [callDetails, setCallDetails] = useState(emptyCallDetails);
  const { identity, requireIdentity } = useIdentity();
  const details = copy[type];
  const needsMedia = type !== "LETTER";
  const needsProof = type === "FANMADE" || type === "CALL";

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SubmissionDraft>({
    resolver: zodResolver(draftSchema),
    defaultValues: { type, authorName: "Tạm", targetId: type === "MEMORY" ? null : "Tất cả Anh Tài", title: "", content: "", mediaUrl: null, mediaType: null, mediaItems: [], proofUrl: null, proofFileName: null },
  });

  useEffect(() => () => {
    if (proofPreview) URL.revokeObjectURL(proofPreview);
  }, [proofPreview]);

  function chooseFiles(fileList: FileList | null) {
    const incoming = fileList ? Array.from(fileList) : [];
    if (incoming.length === 0) return;
    const availableSlots = 10 - selectedMedia.length;
    if (availableSlots <= 0) {
      toast.error("Mỗi bài được đăng tối đa 10 ảnh hoặc video.");
      return;
    }
    if (incoming.length > availableSlots) {
      toast.warning(`Chỉ thêm ${availableSlots} tệp để không vượt quá giới hạn 10 tệp.`);
    }
    const additions = incoming.slice(0, availableSlots).map((file) => {
      const preview = URL.createObjectURL(file);
      return { file, preview };
    });
    setSelectedMedia((current) => [...current, ...additions]);
  }

  function removeMedia(preview: string) {
    URL.revokeObjectURL(preview);
    setSelectedMedia((current) => current.filter((item) => item.preview !== preview));
  }

  function clearMedia() {
    selectedMedia.forEach((item) => URL.revokeObjectURL(item.preview));
    setSelectedMedia([]);
  }

  function chooseProof(nextFile?: File) {
    if (proofPreview) URL.revokeObjectURL(proofPreview);
    setProofFile(nextFile ?? null);
    setProofPreview(nextFile ? URL.createObjectURL(nextFile) : null);
  }

  async function submit(values: SubmissionDraft) {
    if (!identity) return;
    if (needsMedia && selectedMedia.length === 0) { toast.error("Hãy chọn ít nhất một ảnh hoặc video."); return; }
    if (needsProof && !proofFile) { toast.error(type === "CALL" ? "Hãy tải minh chứng cấp duyệt project." : "Hãy tải minh chứng sản phẩm chính chủ."); return; }
    if (type === "FANMADE" && !confirmed) { toast.error("Hãy xác nhận tác phẩm không sử dụng AI."); return; }

    try {
      setUploadedCount(0);
      const uploadedMedia = await Promise.all(selectedMedia.map(async ({ file }) => {
        const uploaded = await uploadMedia(file);
        setUploadedCount((count) => count + 1);
        return uploaded;
      }));
      const uploadedProof = proofFile ? await uploadProof(proofFile) : null;
      const content = type === "CALL"
        ? [
            `Tên FC / nhóm tổ chức: ${callDetails.groupName.trim()}`,
            `Đại diện chịu trách nhiệm: ${callDetails.representative.trim()}`,
            `Mục đích: ${callDetails.purpose.trim()}`,
            `Thời hạn và target: ${callDetails.deadlineTarget.trim()}`,
            `Kênh liên hệ chính thức: ${callDetails.contact.trim()}`,
            `Link / phương thức donate chính thức (nếu có): ${callDetails.donation.trim() || "Không có"}`,
            `Thông tin bổ sung: ${values.content.trim() || "Không có"}`,
          ].join("\n")
        : values.content;
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          type,
          authorName: identity.mode === "anonymous" ? "Ẩn danh" : identity.nickname,
          content,
          mediaUrl: uploadedMedia[0]?.secureUrl ?? null,
          mediaType: uploadedMedia[0]?.mediaType ?? null,
          mediaItems: uploadedMedia.map((item) => ({ url: item.secureUrl, type: item.mediaType })),
          proofUrl: uploadedProof?.secureUrl ?? null,
          proofFileName: uploadedProof?.fileName ?? null,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Không thể gửi bài.");
      toast.success("Gửi thành công! Nội dung đã được lưu và đang chờ Admin duyệt…");
      reset();
      clearMedia();
      chooseProof();
      setConfirmed(false);
      setCallDetails(emptyCallDetails);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã có lỗi xảy ra.");
    } finally {
      setUploadedCount(0);
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
                <span className="mb-2 block text-sm font-bold text-stone-700">{type === "CALL" ? "Bạn thuộc FC/Fansite của Anh Tài nào?" : "Gửi đến Anh Tài"}</span>
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

            {type === "CALL" ? (
              <div className="grid gap-4 rounded-2xl border border-orange-100 bg-orange-50/40 p-4">
                <p className="text-xs font-bold leading-5 text-stone-500">Điền đầy đủ thông tin của đơn vị tổ chức. Các mục có dấu * là bắt buộc.</p>
                <label><span className="mb-2 block text-sm font-bold text-stone-700">Tên FC / nhóm tổ chức *</span><Input value={callDetails.groupName} onChange={(event) => setCallDetails({ ...callDetails, groupName: event.target.value })} maxLength={120} required /></label>
                <label><span className="mb-2 block text-sm font-bold text-stone-700">Đại diện chịu trách nhiệm *</span><Input value={callDetails.representative} onChange={(event) => setCallDetails({ ...callDetails, representative: event.target.value })} maxLength={120} required /></label>
                <label><span className="mb-2 block text-sm font-bold text-stone-700">Mục đích *</span><Textarea className="min-h-24" value={callDetails.purpose} onChange={(event) => setCallDetails({ ...callDetails, purpose: event.target.value })} maxLength={600} required /></label>
                <label><span className="mb-2 block text-sm font-bold text-stone-700">Thời hạn và target *</span><Input value={callDetails.deadlineTarget} onChange={(event) => setCallDetails({ ...callDetails, deadlineTarget: event.target.value })} maxLength={200} required /></label>
                <label><span className="mb-2 block text-sm font-bold text-stone-700">Kênh liên hệ chính thức *</span><Input value={callDetails.contact} onChange={(event) => setCallDetails({ ...callDetails, contact: event.target.value })} maxLength={300} required /></label>
                <label><span className="mb-2 block text-sm font-bold text-stone-700">Link / phương thức donate chính thức (nếu có)</span><Input value={callDetails.donation} onChange={(event) => setCallDetails({ ...callDetails, donation: event.target.value })} maxLength={300} /></label>
                <label><span className="mb-2 flex items-center justify-between text-sm font-bold text-stone-700">Thông tin bổ sung<span className="font-medium text-stone-400">Từ: {identity?.mode === "anonymous" ? "Ẩn danh" : identity?.nickname}</span></span><Textarea {...register("content")} maxLength={800} placeholder="Cách tham gia, lịch trình hoặc lưu ý khác..." /></label>
              </div>
            ) : (
              <label>
                <span className="mb-2 flex items-center justify-between text-sm font-bold text-stone-700">
                  {details.contentLabel}<span className="font-medium text-stone-400">Từ: {identity?.mode === "anonymous" ? "Ẩn danh" : identity?.nickname}</span>
                </span>
                <Textarea {...register("content")} placeholder={details.contentPlaceholder} />
                {errors.content && <span className="mt-1 block text-xs font-semibold text-red-600">{errors.content.message}</span>}
              </label>
            )}

            {needsMedia && (
              <div>
                <label className="group block cursor-pointer rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/60 p-4 transition hover:border-orange-400 hover:bg-orange-50">
                  <input type="file" accept="image/*,video/*" multiple className="sr-only" onChange={(event) => { chooseFiles(event.target.files); event.currentTarget.value = ""; }} />
                  <span className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-orange-600 shadow-sm">{selectedMedia.length > 0 ? <Check size={20} /> : <UploadCloud size={20} />}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold text-stone-800">{selectedMedia.length > 0 ? `Đã chọn ${selectedMedia.length}/10 tệp` : type === "CALL" ? "Chọn ảnh/video của project" : type === "FANMADE" ? "Chọn ảnh/video sản phẩm" : "Chọn ảnh hoặc video"}</span>
                      <span className="mt-0.5 block text-xs text-stone-500">Tối đa 10 tệp · Ảnh 10 MB/tệp · Video 100 MB/tệp</span>
                    </span>
                  </span>
                </label>
                {selectedMedia.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectedMedia.map(({ file, preview }, index) => (
                      <div key={preview} className="relative overflow-hidden rounded-xl border border-orange-100 bg-orange-50">
                        {file.type.startsWith("image/") ? (
                          <img src={preview} alt={`Xem trước tệp ${index + 1}`} className="aspect-square w-full object-cover" />
                        ) : (
                          <div className="grid aspect-square place-items-center p-3 text-center text-xs font-bold text-stone-600"><FileImage className="mb-2 text-orange-500" />{file.name}</div>
                        )}
                        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black text-orange-800 shadow-sm">{index + 1}</span>
                        <button type="button" aria-label={`Bỏ tệp ${index + 1}`} onClick={() => removeMedia(preview)} className="absolute right-2 top-2 grid size-7 cursor-pointer place-items-center rounded-full bg-white/90 text-stone-700 shadow-sm transition hover:bg-red-50 hover:text-red-600"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {needsProof && (
              <label className="group cursor-pointer rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-4 transition hover:border-orange-400 hover:bg-orange-50/40">
                <input type="file" accept="image/*,video/*,application/pdf" className="sr-only" onChange={(event) => chooseProof(event.target.files?.[0])} />
                <span className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-orange-600 shadow-sm">{proofFile ? <FileCheck2 size={20} /> : <UploadCloud size={20} />}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-stone-800">{proofFile?.name || (type === "CALL" ? "Tải minh chứng cấp duyệt project" : "Tải minh chứng sản phẩm chính chủ")}</span>
                    <span className="mt-0.5 block text-xs text-stone-500">Ảnh tối đa 10 MB · PDF tối đa 15 MB · Video tối đa 100 MB</span>
                  </span>
                </span>
                {proofPreview && proofFile?.type.startsWith("image/") && <img src={proofPreview} alt="Xem trước minh chứng" className="mt-3 max-h-44 w-full rounded-xl object-cover" />}
              </label>
            )}

            {type === "FANMADE" && (
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 size-4 accent-orange-600" />
                <span className="text-sm leading-6 text-red-800"><strong>Nghiêm cấm sử dụng AI dưới bất kỳ hình thức nào.</strong> Tôi xác nhận đây là sản phẩm do mình thực hiện và file minh chứng đính kèm là trung thực.</span>
              </label>
            )}

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : <FileImage size={18} />}
              {isSubmitting ? (selectedMedia.length > 0 ? `Đang tải ${uploadedCount}/${selectedMedia.length} tệp…` : proofFile ? "Đang tải minh chứng…" : "Đang gửi…") : "Gửi chờ duyệt"}
            </Button>
            <p className="text-center text-[11px] leading-5 text-stone-400">Bằng việc gửi bài, bạn đồng ý tuân thủ nguyên tắc cộng đồng và cho phép hiển thị nội dung sau khi duyệt.</p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
