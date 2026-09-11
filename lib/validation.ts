import { z } from "zod";

export const submissionTypeSchema = z.enum(["LETTER", "MEMORY", "FANMADE", "CALL"]);
export const mediaTypeSchema = z.enum(["IMAGE", "VIDEO"]);

const cloudinaryUrlSchema = z
  .string()
  .url("Đường dẫn tệp không hợp lệ")
  .max(1000)
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
    } catch {
      return false;
    }
  }, "Tệp phải là đường dẫn HTTPS từ Cloudinary");

export const submissionMediaSchema = z.object({
  url: cloudinaryUrlSchema,
  type: mediaTypeSchema,
});

export const submissionSchema = z
  .object({
    type: submissionTypeSchema,
    authorName: z.string().trim().min(1, "Hãy chọn danh tính").max(40),
    targetId: z.string().trim().max(80).optional().nullable(),
    title: z.string().trim().max(120, "Tiêu đề tối đa 120 ký tự").optional().nullable(),
    content: z
      .string()
      .trim()
      .min(3, "Nội dung cần ít nhất 3 ký tự")
      .max(3000, "Nội dung tối đa 3.000 ký tự"),
    mediaUrl: cloudinaryUrlSchema.optional().nullable(),
    mediaType: mediaTypeSchema.optional().nullable(),
    mediaItems: z.array(submissionMediaSchema).max(10, "Mỗi bài được đăng tối đa 10 ảnh hoặc video").optional().default([]),
    proofUrl: cloudinaryUrlSchema.optional().nullable(),
    proofFileName: z.string().trim().max(255).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const mediaCount = data.mediaItems.length || (data.mediaUrl && data.mediaType ? 1 : 0);
    if (["MEMORY", "FANMADE", "CALL"].includes(data.type) && mediaCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mediaItems"],
        message: "Hãy chọn ít nhất một ảnh hoặc video",
      });
    }
    if (["FANMADE", "CALL"].includes(data.type) && !data.proofUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["proofUrl"],
        message: data.type === "CALL" ? "Cần tải minh chứng cấp duyệt project" : "Cần tải minh chứng sản phẩm chính chủ",
      });
    }
    if (["FANMADE", "CALL"].includes(data.type) && !data.title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["title"],
        message: "Hãy nhập tiêu đề",
      });
    }
    if (data.type === "CALL") {
      const requiredLabels = [
        "Tên FC / nhóm tổ chức",
        "Đại diện chịu trách nhiệm",
        "Mục đích",
        "Thời hạn và target",
        "Kênh liên hệ chính thức",
      ];
      const lines = data.content.split("\n").map((line) => line.trim());
      const isComplete = requiredLabels.every((label) =>
        lines.some((line) => line.startsWith(`${label}:`) && line.slice(label.length + 1).trim().length > 0),
      );
      if (!isComplete) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["content"],
          message: "Cần điền đủ thông tin đơn vị tổ chức, đại diện, mục đích, thời hạn/target và kênh liên hệ",
        });
      }
    }
  });

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const loginSchema = z.object({
  password: z.string().min(8).max(200),
});

export const moderationSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  adminNote: z.string().trim().max(500).optional(),
});
