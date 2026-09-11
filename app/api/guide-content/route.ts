import { NextResponse } from "next/server";
import { getGuideContent } from "@/lib/guide-content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getGuideContent(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GET /api/guide-content", error);
    return NextResponse.json({ error: "Không thể tải Fan Guide lúc này." }, { status: 500 });
  }
}
