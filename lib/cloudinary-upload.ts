export type UploadResult = {
  secureUrl: string;
  mediaType: "IMAGE" | "VIDEO";
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export async function uploadMedia(file: File): Promise<UploadResult> {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) throw new Error("Chỉ hỗ trợ tệp ảnh hoặc video.");
  if (file.size > (isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES)) {
    throw new Error(isVideo ? "Video tối đa 100 MB." : "Ảnh tối đa 10 MB.");
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
      throw new Error("Cloudinary chưa được cấu hình. Xem .env.example để thêm khóa upload.");
    }
    form.append("upload_preset", preset);
    form.append("folder", "atvncg-2026/submissions");
  }

  const resourceType = isVideo ? "video" : "image";
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: form },
  );
  if (!response.ok) throw new Error("Tải tệp thất bại. Vui lòng thử lại.");

  const result = (await response.json()) as { secure_url?: string };
  if (!result.secure_url) throw new Error("Cloudinary không trả về đường dẫn hợp lệ.");
  return { secureUrl: result.secure_url, mediaType: isVideo ? "VIDEO" : "IMAGE" };
}
