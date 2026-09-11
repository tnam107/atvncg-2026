import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { LetterWall } from "@/components/letter-wall";
import { ModerationRules } from "@/components/moderation-rules";
import { PageHero } from "@/components/page-hero";
import { SubmissionDialog } from "@/components/submission-dialog";
import { getPublicSubmissions } from "@/lib/data";

export const metadata: Metadata = { title: "Fan Dear" };
export const dynamic = "force-dynamic";

export default async function FanDearPage() {
  const letters = await getPublicSubmissions("LETTER");
  return (
    <>
      <PageHero eyebrow="Góc tâm thư" title="Những bức tâm thư, những lời động viên mà người hâm mộ gửi đến các Anh Tài." description="Mỗi lời nhắn được đội ngũ quản trị xem trước để giữ không gian fandom tích cực và tôn trọng." icon={Mail} action={<SubmissionDialog type="LETTER" buttonLabel="Viết tâm thư" />} />
      <ModerationRules
        approved={[
          "Tâm thư, lời chúc, lời động viên gửi Anh Tài.",
          "Chia sẻ cảm nhận và kỷ niệm với Anh Tài.",
          "Góp ý chân thành, mang tính xây dựng.",
        ]}
        rejected={[
          "Công kích, xúc phạm hoặc miệt thị, kích động fanwar.",
          "So sánh nhằm hạ thấp Anh Tài khác.",
          "Thông tin sai sự thật hoặc chưa kiểm chứng, không phù hợp với thuần phong mỹ tục, trái đạo đức hoặc vi phạm pháp luật.",
        ]}
      />
      <section className="container-shell py-16 md:py-20"><LetterWall items={letters} /></section>
    </>
  );
}
