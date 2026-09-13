import { NextResponse } from "next/server";
import { localGetSubmissionStatus } from "@/lib/local-database";
import { databaseConfigured, isProduction, prisma } from "@/lib/prisma";
import { allowRequest } from "@/lib/rate-limit";
import { hashSubmissionTrackingToken } from "@/lib/submission-token";

export const dynamic = "force-dynamic";

function readToken(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const token = (body as { token?: unknown }).token;
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{40,100}$/.test(token)) return null;
  return token;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!allowRequest(`submission-status:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Bạn kiểm tra quá nhiều lần. Hãy thử lại sau." }, { status: 429 });
  }
  const token = readToken(await request.json().catch(() => null));
  if (!token) return NextResponse.json({ error: "Mã theo dõi không hợp lệ." }, { status: 400 });
  const tokenHash = hashSubmissionTrackingToken(token);

  if (!databaseConfigured) {
    if (isProduction) return NextResponse.json({ error: "DATABASE_URL chưa được cấu hình." }, { status: 503 });
    const item = localGetSubmissionStatus(tokenHash);
    return item ? NextResponse.json({ item, storage: "sqlite" }) : NextResponse.json({ error: "Không tìm thấy bài gửi." }, { status: 404 });
  }

  try {
    const item = await prisma.submission.findUnique({
      where: { trackingTokenHash: tokenHash },
      select: { id: true, type: true, title: true, status: true, adminNote: true, createdAt: true, updatedAt: true },
    });
    if (!item) return NextResponse.json({ error: "Không tìm thấy bài gửi." }, { status: 404 });
    return NextResponse.json({
      item: { ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() },
    });
  } catch (error) {
    console.error("POST /api/submissions/status", error);
    return NextResponse.json({ error: "Không thể kiểm tra trạng thái lúc này." }, { status: 500 });
  }
}
