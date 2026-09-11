import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { LetterWall } from "@/components/letter-wall";
import { PageHero } from "@/components/page-hero";
import { SubmissionDialog } from "@/components/submission-dialog";
import { getPublicSubmissions } from "@/lib/data";

export const metadata: Metadata = { title: "Fan Dear" };
export const dynamic = "force-dynamic";

export default async function FanDearPage() {
  const letters = await getPublicSubmissions("LETTER");
  return (
    <>
      <PageHero eyebrow="Góc tâm thư" title="Có những điều, viết ra mới thành kỷ niệm." description="Một bức tường đầy lời thương gửi tới các Anh Tài — chân thành, dịu dàng và luôn được nâng niu." icon={Mail} action={<SubmissionDialog type="LETTER" buttonLabel="Viết tâm thư" />} />
      <section className="container-shell py-16 md:py-20"><LetterWall items={letters} /></section>
    </>
  );
}
