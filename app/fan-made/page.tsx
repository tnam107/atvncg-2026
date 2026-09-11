import type { Metadata } from "next";
import { Brush, ShieldCheck } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { PageHero } from "@/components/page-hero";
import { SubmissionDialog } from "@/components/submission-dialog";
import { getPublicSubmissions } from "@/lib/data";

export const metadata: Metadata = { title: "Fan Made" };
export const dynamic = "force-dynamic";

export default async function FanMadePage() {
  const items = await getPublicSubmissions("FANMADE");
  return (
    <>
      <PageHero eyebrow="Sản phẩm nhà làm" title="Đôi tay thật. Cảm xúc thật. Sáng tạo thật." description="Từ nét vẽ, đường kim đến từng khung hình edit — đây là nơi công sức của fan được nhìn thấy." icon={Brush} action={<SubmissionDialog type="FANMADE" buttonLabel="Chia sẻ tác phẩm" />} />
      <section className="container-shell py-16 md:py-20">
        <div className="mb-10 flex items-start gap-4 rounded-[24px] border border-red-200 bg-red-50 p-5 text-red-900 md:p-6"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white"><ShieldCheck size={21} /></span><div><h2 className="font-black">Không sử dụng AI cho Fan Art</h2><p className="mt-1 text-sm leading-6 text-red-800/80">Tác giả cần lưu minh chứng quá trình sáng tạo chính chủ. Bài có dấu hiệu vi phạm sẽ bị từ chối hoặc gỡ khỏi triển lãm.</p></div></div>
        <div className="masonry">{items.map((item) => <MediaCard key={item.id} item={item} />)}</div>
      </section>
    </>
  );
}
