import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { MediaCard } from "@/components/media-card";
import { PageHero } from "@/components/page-hero";
import { SubmissionDialog } from "@/components/submission-dialog";
import { getPublicSubmissions } from "@/lib/data";

export const metadata: Metadata = { title: "Fan Frame" };
export const dynamic = "force-dynamic";

export default async function FanFramePage() {
  const items = await getPublicSubmissions("MEMORY");
  return (
    <>
      <PageHero eyebrow="Triển lãm hình ảnh" title="Mỗi khung hình giữ lại một chút thanh xuân." description="Ảnh check-in, biển lightstick, những người bạn mới — gom lại đây để ký ức không phai." icon={Camera} action={<SubmissionDialog type="MEMORY" buttonLabel="Thêm khoảnh khắc" />} />
      <section className="container-shell py-16 md:py-20"><div className="masonry">{items.map((item) => <MediaCard key={item.id} item={item} />)}</div></section>
    </>
  );
}
