import type { Metadata } from "next";
import { BookOpenText } from "lucide-react";
import { FanGuideContent } from "@/components/fan-guide-content";
import { PageHero } from "@/components/page-hero";
import { getGuideContent } from "@/lib/guide-content";

export const metadata: Metadata = { title: "Fan Guide" };
export const dynamic = "force-dynamic";

export default async function FanGuidePage() {
  const content = await getGuideContent();

  return (
    <>
      <PageHero
        eyebrow="Sổ tay hướng dẫn"
        title="Bắt nhịp hành trình, từ những điều nhỏ nhất."
        description="Làm quen với đủ 34 Anh Tài, theo dõi từng tập và giải mã ngôn ngữ riêng của Gai Con."
        icon={BookOpenText}
      />
      <FanGuideContent content={content} />
    </>
  );
}
