import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminDashboard, AdminLogin } from "@/components/admin-panel";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const signedIn = verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
  return signedIn ? <AdminDashboard /> : <AdminLogin showDevHint={process.env.NODE_ENV !== "production"} />;
}
