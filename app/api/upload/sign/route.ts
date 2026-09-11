import { NextResponse } from "next/server";
import { createUploadSignature } from "@/lib/cloudinary";
import { allowRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!allowRequest(`upload:${ip}`, 12, 60_000)) {
    return NextResponse.json({ error: "Bạn thao tác quá nhanh." }, { status: 429 });
  }
  const signature = createUploadSignature();
  if (!signature) {
    return NextResponse.json({ error: "Signed upload chưa được cấu hình." }, { status: 503 });
  }
  return NextResponse.json(signature);
}
