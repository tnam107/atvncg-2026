import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { localListAdminSubmissions } from "@/lib/local-database";
import { databaseConfigured, isProduction, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }
  if (!databaseConfigured) {
    if (isProduction) return NextResponse.json({ error: "DATABASE_URL chưa được cấu hình." }, { status: 503 });
    return NextResponse.json({ items: localListAdminSubmissions(), storage: "sqlite" });
  }

  try {
    const items = await prisma.submission.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/admin/submissions", error);
    return NextResponse.json({ error: "Không thể tải danh sách kiểm duyệt." }, { status: 500 });
  }
}
