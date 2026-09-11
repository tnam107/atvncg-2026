import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { getGuideContent, mutateGuideContent } from "@/lib/guide-content";
import { guideMutationSchema } from "@/lib/guide-validation";

export const dynamic = "force-dynamic";

async function authorized() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  try {
    return NextResponse.json(await getGuideContent(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET /api/admin/guide-content", error);
    return NextResponse.json({ error: "Không thể tải dữ liệu Fan Guide." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  const parsed = guideMutationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Dữ liệu chưa hợp lệ." }, { status: 400 });
  }
  try {
    const content = await mutateGuideContent(parsed.data);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error("POST /api/admin/guide-content", error);
    return NextResponse.json({ error: "Không thể lưu thay đổi. Tên hoặc số tập có thể đã tồn tại." }, { status: 500 });
  }
}
