import type { Metadata } from "next";
import { BadgeCheck, CircleDollarSign, Megaphone } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { PageHero } from "@/components/page-hero";
import { SubmissionDialog } from "@/components/submission-dialog";
import { getPublicSubmissions } from "@/lib/data";

export const metadata: Metadata = { title: "Fan Calls" };
export const dynamic = "force-dynamic";

export default async function FanCallsPage() {
  const items = await getPublicSubmissions("CALL");
  return (
    <>
      <PageHero eyebrow="Dự án fandom" title="Gọi nhau một tiếng, làm nên điều thật đẹp." description="Kết nối những dự án cộng đồng có mục tiêu rõ ràng, đầu mối minh bạch và minh chứng phê duyệt." icon={Megaphone} action={<SubmissionDialog type="CALL" buttonLabel="Đăng dự án" />} />
      <section className="container-shell py-16 md:py-20">
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-[24px] bg-stone-950 p-6 text-white"><CircleDollarSign className="mt-0.5 shrink-0 text-orange-400" /><div><h2 className="font-black">Không nhận donate tại đây</h2><p className="mt-2 text-sm leading-6 text-stone-400">Website chỉ kết nối thông tin, không trực tiếp nhận donate hoặc đứng ra bảo chứng giao dịch.</p></div></div>
          <div className="flex items-start gap-4 rounded-[24px] border border-orange-200 bg-white p-6"><BadgeCheck className="mt-0.5 shrink-0 text-orange-600" /><div><h2 className="font-black">Dự án có kiểm duyệt</h2><p className="mt-2 text-sm leading-6 text-stone-500">Mỗi lời kêu gọi cần tải minh chứng phê duyệt và được quản trị viên xem trước khi xuất hiện.</p></div></div>
        </div>
        <div className="masonry">{items.map((item) => <MediaCard key={item.id} item={item} />)}</div>
      </section>
    </>
  );
}
