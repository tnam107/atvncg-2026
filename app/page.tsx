import Link from "next/link";
import { ArrowRight, BookOpenText, Camera, Flame, FolderHeart, Mail, Megaphone, Sparkles } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { SitePrinciples } from "@/components/site-principles";

const spaces = [
  { href: "/fan-guide", icon: BookOpenText, number: "01", title: "Fan Guide", vi: "Sổ tay Gai Con", text: "Hồ sơ Anh Tài, lịch phát sóng và từ điển fandom.", className: "bg-[#ffe4bd] md:col-span-2" },
  { href: "/fan-dear", icon: Mail, number: "02", title: "Fan Dear", vi: "Góc tâm thư", text: "Gửi những lời thật lòng đến người bạn yêu quý.", className: "bg-[#ffd1bf]" },
  { href: "/fan-frame", icon: Camera, number: "03", title: "Fan Frame", vi: "Khung hình kỷ niệm", text: "Triển lãm những khoảnh khắc đẹp nhất của chúng mình.", className: "bg-[#ffedcc]" },
  { href: "/fan-made", icon: FolderHeart, number: "04", title: "Fan Made", vi: "Sản phẩm nhà làm", text: "Nơi sáng tạo thủ công được kể bằng câu chuyện tử tế.", className: "bg-[#f9d5c9]" },
  { href: "/fan-calls", icon: Megaphone, number: "05", title: "Fan Calls", vi: "Dự án cộng đồng", text: "Kết nối dự án đã được xác minh, minh bạch và an toàn.", className: "bg-[#ffe0a6] md:col-span-2" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#fff4df]">
        <div className="absolute left-[8%] top-[14%] size-2 rounded-full bg-orange-400 animate-ember" />
        <div className="absolute right-[12%] top-[22%] size-3 rounded-full bg-amber-400 animate-ember [animation-delay:.8s]" />
        <div className="absolute bottom-[20%] left-[48%] size-2 rounded-full bg-red-400 animate-ember [animation-delay:1.4s]" />
        <div className="container-shell grid min-h-[calc(100svh-4.5rem)] items-center gap-10 py-16 lg:grid-cols-[1.2fr_.8fr] lg:py-20">
          <div className="relative z-10">
            <span className="eyebrow"><Sparkles size={14} /> Fandom hub · 2026</span>
            <h1 className="display-title mt-6 text-stone-950">Gai Con<br />ở <span className="text-orange-600">đây.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-stone-600">Website ATVNCG 2026 Fandom là một không gian trực tuyến dành cho những người yêu thích và hâm mộ chương trình <strong className="text-stone-900">Anh Trai Vượt Ngàn Chông Gai 2026.</strong></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#kham-pha" className="inline-flex h-13 items-center gap-2 rounded-full bg-orange-600 px-7 text-base font-extrabold text-white shadow-[0_12px_30px_rgba(234,88,12,.28)] transition hover:-translate-y-0.5 hover:bg-orange-700">Khám phá ngay <ArrowRight size={18} /></Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[470px]">
            <div className="absolute -inset-10 rounded-full bg-orange-300/25 blur-3xl" />
            <div className="animate-float relative rotate-2 overflow-hidden rounded-[36px] bg-stone-950 p-7 text-white shadow-[0_35px_100px_rgba(120,53,15,.25)] md:p-9">
              <div className="absolute -right-12 -top-12 size-40 rounded-full bg-orange-500/30 blur-2xl" />
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em]">Tập tiếp theo</span>
                <Flame className="text-orange-400" size={25} fill="currentColor" />
              </div>
              <p className="mt-14 text-sm font-semibold text-stone-400">Thứ Bảy · 20:00</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-.05em] md:text-4xl">Lửa đã sẵn sàng.</h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">Cùng đếm từng khoảnh khắc đến giờ gặp lại các Anh Tài.</p>
              <div className="mt-8"><Countdown /></div>
              <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-stone-400"><span className="size-2 animate-pulse rounded-full bg-orange-400" /> Đồng hồ theo múi giờ Việt Nam</div>
            </div>
          </div>
        </div>
      </section>

      <section id="kham-pha" className="container-shell scroll-mt-24 py-24">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><span className="eyebrow">Năm góc nhỏ</span><h2 className="section-title mt-4">Chọn nơi bạn muốn ghé.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-stone-500">Không cần đăng nhập. Chỉ cần một biệt danh - hoặc cứ là Ẩn danh nếu bạn muốn.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {spaces.map(({ href, icon: Icon, number, title, vi, text, className }) => (
            <Link key={href} href={href} className={`group relative min-h-[270px] overflow-hidden rounded-[28px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}>
              <span className="absolute right-5 top-4 text-5xl font-black tracking-[-.08em] text-stone-900/8">{number}</span>
              <span className="grid size-12 place-items-center rounded-2xl bg-white/80 text-orange-700 shadow-sm"><Icon size={22} /></span>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs font-black uppercase tracking-[.16em] text-orange-800">{vi}</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-stone-950">{title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-stone-700">{text}</p>
                <ArrowRight className="mt-4 transition group-hover:translate-x-1" size={18} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SitePrinciples />
    </>
  );
}
