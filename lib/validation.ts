import { z } from "zod";

export const submissionTypeSchema = z.enum(["LETTER", "MEMORY", "FANMADE", "CALL"]);
export const mediaTypeSchema = z.enum(["IMAGE", "VIDEO"]);

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
    mediaUrl: z
      .string()
      .url("Đường dẫn media không hợp lệ")
      .max(1000)
      .refine((value) => {
        const url = new URL(value);
        return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
      }, "Media phải là đường dẫn HTTPS từ Cloudinary")
      .optional()
      .nullable(),
    mediaType: mediaTypeSchema.optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (["MEMORY", "FANMADE", "CALL"].includes(data.type) && !data.mediaUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mediaUrl"],
        message: data.type === "CALL" ? "Cần tải lên minh chứng phê duyệt" : "Hãy chọn một ảnh hoặc video",
      });
    }
    if (["FANMADE", "CALL"].includes(data.type) && !data.title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["title"],
        message: "Hãy nhập tiêu đề",
      });
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
