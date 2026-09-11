import { NextResponse } from "next/server";
import { localFireSubmission } from "@/lib/local-database";
import { databaseConfigured, isProduction, prisma } from "@/lib/prisma";
import { allowRequest } from "@/lib/rate-limit";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!allowRequest(`fire:${ip}:${id}`, 1, 24 * 60 * 60_000)) {
    return NextResponse.json({ error: "Bạn đã thả lửa cho bài này rồi." }, { status: 429 });
  }
  if (!databaseConfigured && isProduction) return NextResponse.json({ error: "DATABASE_URL chưa được cấu hình." }, { status: 503 });
  if (!databaseConfigured) {
    const item = localFireSubmission(id);
    return item
      ? NextResponse.json(item)
      : NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }
  try {
    const item = await prisma.submission.update({
      where: { id, status: "APPROVED" },
      data: { likesCount: { increment: 1 } },
      select: { likesCount: true },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }
}
