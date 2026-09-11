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
        title="Kho lưu trữ."
        description="Cung cấp những thông tin cơ bản về chương trình và các Anh Tài, giải mã những ngôn ngữ fandom của Gai Con."
        icon={BookOpenText}
      />
      <FanGuideContent content={content} />
    </>
  );
}
