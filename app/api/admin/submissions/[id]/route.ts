import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { localDeleteSubmission, localModerateSubmission } from "@/lib/local-database";
import { databaseConfigured, isProduction, prisma } from "@/lib/prisma";
import { moderationSchema } from "@/lib/validation";

async function authorized() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  const { id } = await params;
  const parsed = moderationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Thao tác không hợp lệ." }, { status: 400 });
  if (parsed.data.action === "REJECT" && !parsed.data.adminNote) {
    return NextResponse.json({ error: "Hãy nhập lý do từ chối." }, { status: 400 });
  }
  if (!databaseConfigured && isProduction) return NextResponse.json({ error: "DATABASE_URL chưa được cấu hình." }, { status: 503 });
  if (!databaseConfigured) {
    const item = localModerateSubmission(
      id,
      parsed.data.action === "APPROVE" ? "APPROVED" : "REJECTED",
      parsed.data.action === "REJECT" ? parsed.data.adminNote || null : null,
    );
    return item
      ? NextResponse.json({ item, storage: "sqlite" })
      : NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }

  try {
    const item = await prisma.submission.update({
      where: { id },
      data: {
        status: parsed.data.action === "APPROVE" ? "APPROVED" : "REJECTED",
        adminNote: parsed.data.action === "REJECT" ? parsed.data.adminNote : null,
      },
    });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  const { id } = await params;
  if (!databaseConfigured && isProduction) return NextResponse.json({ error: "DATABASE_URL chưa được cấu hình." }, { status: 503 });
  if (!databaseConfigured) {
    return localDeleteSubmission(id)
      ? NextResponse.json({ ok: true, storage: "sqlite" })
      : NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }
  try {
    await prisma.submission.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }
}
