import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions, createAdminToken, verifyAdminPassword } from "@/lib/admin-auth";
import { allowRequest } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!allowRequest(`admin-login:${ip}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "Quá nhiều lần thử. Vui lòng quay lại sau." }, { status: 429 });
  }
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !verifyAdminPassword(parsed.data.password)) {
    return NextResponse.json({ error: "Mật khẩu không đúng." }, { status: 401 });
  }
  try {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, createAdminToken(), adminCookieOptions);
    return response;
  } catch {
    return NextResponse.json({ error: "Admin session chưa được cấu hình an toàn." }, { status: 503 });
  }
}
