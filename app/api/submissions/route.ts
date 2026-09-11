import { NextRequest, NextResponse } from "next/server";
import { localCreateSubmission, localListPublicSubmissions } from "@/lib/local-database";
import { databaseConfigured, isProduction, prisma } from "@/lib/prisma";
import { allowRequest } from "@/lib/rate-limit";
import { submissionSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") ?? undefined;
  const target = request.nextUrl.searchParams.get("target") ?? undefined;

  if (!databaseConfigured) {
    if (isProduction) return NextResponse.json({ error: "DATABASE_URL chưa được cấu hình." }, { status: 503 });
    const items = localListPublicSubmissions(type as "LETTER" | "MEMORY" | "FANMADE" | "CALL" | undefined, target);
    return NextResponse.json({ items, storage: "sqlite" });
  }

  try {
    const items = await prisma.submission.findMany({
      where: {
        status: "APPROVED",
        ...(type ? { type: type as "LETTER" | "MEMORY" | "FANMADE" | "CALL" } : {}),
        ...(target && target !== "ALL" ? { targetId: target } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        type: true,
        authorName: true,
        targetId: true,
        title: true,
        content: true,
        mediaUrl: true,
        mediaType: true,
        likesCount: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/submissions", error);
    return NextResponse.json({ error: "Không thể tải nội dung lúc này." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!allowRequest(`submit:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Bạn đã gửi khá nhiều bài. Hãy thử lại sau ít phút." }, { status: 429 });
  }

  const parsed = submissionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu chưa hợp lệ.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (!databaseConfigured) {
    if (isProduction) return NextResponse.json({ error: "DATABASE_URL chưa được cấu hình." }, { status: 503 });
    return NextResponse.json({ item: localCreateSubmission(parsed.data), storage: "sqlite" }, { status: 201 });
  }

  try {
    const item = await prisma.submission.create({ data: parsed.data });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/submissions", error);
    return NextResponse.json({ error: "Chưa thể lưu bài viết. Vui lòng thử lại." }, { status: 500 });
  }
}
