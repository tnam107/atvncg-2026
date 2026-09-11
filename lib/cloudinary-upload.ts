export type UploadResult = {
  secureUrl: string;
  mediaType: "IMAGE" | "VIDEO";
};

export type ProofUploadResult = {
  secureUrl: string;
  fileName: string;
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_PDF_BYTES = 15 * 1024 * 1024;

type UploadKind = "media" | "proof";

async function uploadFile(file: File, kind: UploadKind) {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isPdf = file.type === "application/pdf";
  if (!isImage && !isVideo && !(kind === "proof" && isPdf)) {
    throw new Error(kind === "proof" ? "Minh chứng chỉ hỗ trợ ảnh, video hoặc PDF." : "Chỉ hỗ trợ tệp ảnh hoặc video.");
  }

  const maximumBytes = isVideo ? MAX_VIDEO_BYTES : isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maximumBytes) {
    throw new Error(isVideo ? "Video tối đa 100 MB." : isPdf ? "PDF tối đa 15 MB." : "Ảnh tối đa 10 MB.");
  }

  let cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const form = new FormData();
  form.append("file", file);

  const signatureResponse = await fetch("/api/upload/sign", { method: "POST" });
  if (signatureResponse.ok) {
    const signed = (await signatureResponse.json()) as {
      timestamp: number;
      folder: string;
      signature: string;
      apiKey: string;
      cloudName: string;
    };
    cloudName = signed.cloudName;
    form.append("timestamp", String(signed.timestamp));
    form.append("folder", signed.folder);
    form.append("signature", signed.signature);
    form.append("api_key", signed.apiKey);
  } else {
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) {
      const result = await signatureResponse.json().catch(() => null) as { error?: string } | null;
      throw new Error(
        signatureResponse.status === 429
          ? result?.error || "Bạn thao tác quá nhanh. Vui lòng thử lại sau một phút."
          : "Chức năng tải tệp chưa được quản trị viên cấu hình trên Vercel.",
      );
    }
    form.append("upload_preset", preset);
    form.append("folder", "atvncg-2026/submissions");
  }

  if (!cloudName) throw new Error("Thiếu Cloudinary Cloud name.");
  const resourceType = isVideo ? "video" : isPdf ? "raw" : "image";
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/upload`,
    { method: "POST", body: form },
  );
  if (!response.ok) {
    const result = await response.json().catch(() => null) as { error?: { message?: string } } | null;
    throw new Error(result?.error?.message ? `Cloudinary: ${result.error.message}` : "Tải tệp thất bại. Vui lòng thử lại.");
  }

  const result = (await response.json()) as { secure_url?: string };
  if (!result.secure_url) throw new Error("Cloudinary không trả về đường dẫn hợp lệ.");
  return { secureUrl: result.secure_url, mediaType: isVideo ? "VIDEO" as const : isImage ? "IMAGE" as const : null };
}

export async function uploadMedia(file: File): Promise<UploadResult> {
  const result = await uploadFile(file, "media");
  if (!result.mediaType) throw new Error("Tệp media không hợp lệ.");
  return { secureUrl: result.secureUrl, mediaType: result.mediaType };
}

export async function uploadProof(file: File): Promise<ProofUploadResult> {
  const result = await uploadFile(file, "proof");
  return { secureUrl: result.secureUrl, fileName: file.name };
}
