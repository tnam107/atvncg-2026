import Link from "next/link";
import { Flame, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-orange-100 bg-[#fff6e7]">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 text-xl font-black tracking-tight"><Flame size={21} fill="currentColor" className="text-orange-600" />ATVNCG.26</div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-600">Một góc nhỏ do người hâm mộ xây dựng để cất giữ thư, kỷ niệm và những điều tử tế.</p>
          <p className="mt-3 text-xs text-stone-400">Website cộng đồng phi lợi nhuận, không đại diện cho nhà sản xuất.</p>
        </div>
        <div>
          <p className="text-sm font-extrabold text-stone-900">Khám phá</p>
          <div className="mt-4 grid gap-2 text-sm text-stone-600">
            <Link href="/fan-guide" className="hover:text-orange-700">Sổ tay fandom</Link>
            <Link href="/fan-dear" className="hover:text-orange-700">Góc tâm thư</Link>
            <Link href="/fan-frame" className="hover:text-orange-700">Triển lãm kỷ niệm</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-extrabold text-stone-900">Nguyên tắc cộng đồng</p>
          <p className="mt-4 text-sm leading-6 text-stone-600">Tôn trọng · Chân thành · Không gây quỹ trực tiếp · Không fan art bằng AI.</p>
          <p className="mt-4 flex items-center gap-1 text-xs font-bold text-orange-700">Làm bằng <Heart size={13} fill="currentColor" /> bởi Gai Con</p>
        </div>
      </div>
      <div className="border-t border-orange-200/70 bg-[#ffefd8]">
        <div className="container-shell flex flex-col gap-3 py-5 text-xs text-stone-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="rounded-full bg-white px-2.5 py-1 font-black text-orange-700 shadow-sm">© 2026</span>
            <span>Chủ sở hữu bản quyền website: <strong className="font-black text-stone-900">Lê Thiệp Sang</strong></span>
          </p>
        </div>
        <p className="container-shell pb-5 text-[10px] leading-4 text-stone-400">Tên chương trình, hình ảnh và tư liệu của bên thứ ba thuộc quyền sở hữu của các chủ thể tương ứng.</p>
      </div>
    </footer>
  );
}
