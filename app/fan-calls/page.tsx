import type { Metadata } from "next";
import { BadgeCheck, CircleDollarSign, Megaphone } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { ModerationRules } from "@/components/moderation-rules";
import { PageHero } from "@/components/page-hero";
import { SubmissionDialog } from "@/components/submission-dialog";
import { getPublicSubmissions } from "@/lib/data";

export const metadata: Metadata = { title: "Fan Calls" };
export const dynamic = "force-dynamic";

export default async function FanCallsPage() {
  const items = await getPublicSubmissions("CALL");
  return (
    <>
      <PageHero eyebrow="Dự án fandom" title="Kêu gọi cho các project cổ vũ / support cho Anh Tài và chương trình." description="Kết nối FAN và những dự án cộng đồng liên quan đến các Anh Tài, có mục tiêu rõ ràng và cam kết minh bạch." icon={Megaphone} action={<SubmissionDialog type="CALL" buttonLabel="Đăng dự án" />} />
      <ModerationRules
        approvedTitle="Được duyệt"
        approved={[
          "Các bài kêu gọi cho fan project như Food truck, Birthday project, Billboard, LED và các hình thức support phù hợp khác.",
          "Các hoạt động kêu gọi fan tham gia hoặc đóng góp.",
          "Người đăng cung cấp đầy đủ và chính xác: tên FC / nhóm tổ chức; đại diện chịu trách nhiệm; mục đích; thời hạn và target; các kênh liên hệ chính thức; link / phương thức donate chính thức nếu có.",
          "Bắt buộc tải minh chứng cấp duyệt project từ ekip chương trình hoặc ekip Anh Tài.",
        ]}
      />
      <section className="container-shell py-16 md:py-20">
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-[24px] bg-stone-950 p-6 text-white"><CircleDollarSign className="mt-0.5 shrink-0 text-orange-400" /><div><h2 className="font-black">Không nhận donate tại đây</h2><p className="mt-2 text-sm leading-6 text-stone-400">Website chỉ kết nối thông tin, không trực tiếp nhận donate hoặc đứng ra bảo chứng giao dịch.</p></div></div>
          <div className="flex items-start gap-4 rounded-[24px] border border-orange-200 bg-white p-6"><BadgeCheck className="mt-0.5 shrink-0 text-orange-600" /><div><h2 className="font-black">Dự án có kiểm duyệt</h2><p className="mt-2 text-sm leading-6 text-stone-500">Mỗi lời kêu gọi cần tải minh chứng cấp duyệt và được quản trị viên xem trước khi xuất hiện.</p></div></div>
        </div>
        <div className="masonry">{items.map((item) => <MediaCard key={item.id} item={item} />)}</div>
      </section>
    </>
  );
}
