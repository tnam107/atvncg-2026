import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { ModerationRules } from "@/components/moderation-rules";
import { PageHero } from "@/components/page-hero";
import { SubmissionDialog } from "@/components/submission-dialog";
import { getPublicSubmissions } from "@/lib/data";

export const metadata: Metadata = { title: "Fan Frame" };
export const dynamic = "force-dynamic";

export default async function FanFramePage() {
  const items = await getPublicSubmissions("MEMORY");
  return (
    <>
      <PageHero eyebrow="Triển lãm hình ảnh" title="Nơi lưu giữ những tấm hình và kỷ niệm giữa các Anh Tài và fan trong các sự kiện." description="Ảnh check-in, biển lightstick, những người bạn mới - gom lại đây để ký ức không phai." icon={Camera} action={<SubmissionDialog type="MEMORY" buttonLabel="Thêm khoảnh khắc" />} />
      <ModerationRules
        approved={[
          "Hình ảnh liên quan đến chương trình, Anh Tài hoặc hoạt động fandom trong khuôn khổ chương trình ATVNCG 2026.",
          "Hình ảnh do fan tự chụp hoặc có sự cấp phép từ chủ sở hữu, đồng thời ghi nguồn đầy đủ.",
          "Caption rõ ràng, tích cực, không xúc phạm hoặc đưa thông tin sai sự thật.",
        ]}
        rejected={[
          "Hình ảnh không liên quan, chứa nội dung phản cảm hoặc xâm phạm quyền riêng tư.",
          "Tư liệu không rõ nguồn gốc hoặc chưa được cấp phép từ chủ sở hữu.",
        ]}
      />
      <section className="container-shell py-16 md:py-20"><div className="masonry">{items.map((item) => <MediaCard key={item.id} item={item} />)}</div></section>
    </>
  );
}
