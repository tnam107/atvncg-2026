import type { Metadata } from "next";
import { Brush, ShieldCheck } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { ModerationRules } from "@/components/moderation-rules";
import { PageHero } from "@/components/page-hero";
import { SubmissionDialog } from "@/components/submission-dialog";
import { getPublicSubmissions } from "@/lib/data";

export const metadata: Metadata = { title: "Fan Made" };
export const dynamic = "force-dynamic";

export default async function FanMadePage() {
  const items = await getPublicSubmissions("FANMADE");
  return (
    <>
      <PageHero eyebrow="Sản phẩm nhà làm" title="Đồ vật/sản phẩm/fibi có liên quan đến chương trình do fan sáng tạo." description="Hãy cùng chia sẻ những tác phẩm/sản phẩm đầy ắp yêu thương của chính bạn cho mọi người cùng xem nhé." icon={Brush} action={<SubmissionDialog type="FANMADE" buttonLabel="Chia sẻ tác phẩm" />} />
      <ModerationRules
        approved={[
          "Các tác phẩm chính chủ do fan tạo ra như fan art, design, đồ thủ công và các sản phẩm liên quan đến Anh Tài hoặc chương trình; bắt buộc có minh chứng kèm theo.",
        ]}
        rejected={[
          "Các sản phẩm đạo nhái hoặc không chứng minh được nguồn gốc.",
          "Các sản phẩm không liên quan.",
          "Các nội dung quảng cáo trá hình.",
          "Các sản phẩm có sử dụng AI dưới bất kỳ hình thức nào.",
        ]}
      />
      <section className="container-shell py-16 md:py-20">
        <div className="mb-10 flex items-start gap-4 rounded-[24px] border border-red-200 bg-red-50 p-5 text-red-900 md:p-6"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white"><ShieldCheck size={21} /></span><div><h2 className="font-black">Không sử dụng AI cho Fan Art</h2><p className="mt-1 text-sm leading-6 text-red-800/80">Form gửi bài đã có ô tải file minh chứng riêng. File này chỉ hiển thị trong trang quản trị để admin kiểm tra.</p></div></div>
        <div className="masonry">{items.map((item) => <MediaCard key={item.id} item={item} />)}</div>
      </section>
    </>
  );
}
