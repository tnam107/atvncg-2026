import { BadgeInfo, Scale, ShieldCheck, Users } from "lucide-react";

const generalRules = [
  "Tôn trọng Anh Tài, ekip chương trình, fandom và các cá nhân, tổ chức liên quan.",
  "Đúng chủ đề và có liên quan đến ATVNCG 2026.",
  "Không gây fanwar hoặc kích động tranh cãi.",
  "Không sử dụng website cho mục đích thương mại cá nhân.",
  "Không đăng tải thông tin cá nhân hoặc nội dung có thể gây ảnh hưởng tiêu cực đến người khác khi chưa có sự cho phép.",
  "Tôn trọng các nội dung có bản quyền.",
  "Ưu tiên những nội dung mang tính chia sẻ, kết nối và xây dựng cộng đồng.",
];

const notes = [
  {
    icon: BadgeInfo,
    title: "Website không phải kênh thông tin chính thức của chương trình ATVNCG 2026.",
    paragraphs: [
      "Website được xây dựng và vận hành bởi cộng đồng Fandom, nhằm phục vụ và xây dựng một môi trường phù hợp cho người hâm mộ Anh Trai Vượt Ngàn Chông Gai 2026.",
      "Website không trực thuộc, không đại diện và không phải kênh truyền thông chính thức của chương trình, đơn vị sản xuất, các Anh Tài hoặc các FC.",
    ],
  },
  {
    icon: Users,
    title: "Website không đại diện cho bất kỳ cá nhân hoặc FC cụ thể nào.",
    paragraphs: [
      "Website phục vụ toàn bộ cộng đồng fan ATVNCG 2026, không được xây dựng để đại diện cho một Anh Tài, FC hay fandom riêng biệt.",
      "Các project, bài đăng hoặc nội dung được đăng tải từ một FC chỉ đại diện cho đơn vị đăng tải, không đại diện cho toàn bộ website hoặc cộng đồng fan.",
    ],
  },
  {
    icon: Scale,
    title: "Quyền hạn và nghĩa vụ.",
    paragraphs: [
      "Người dùng cần tuân thủ các nguyên tắc chung và nguyên tắc cụ thể được nêu trong phần Quy tắc xét duyệt khi hoạt động trên website.",
      "Khi gửi nội dung, người dùng cho phép website hiển thị nội dung đó công khai sau khi được duyệt. Người dùng vẫn giữ quyền sở hữu đối với nội dung do mình tự tạo.",
      "Đội ngũ sáng lập không được bán, chuyển nhượng hoặc sử dụng website cũng như nội dung của fan cho mục đích thương mại hoặc mục đích khác.",
      "Đội ngũ quản trị có quyền từ chối hoặc gỡ nội dung nếu phát hiện dấu hiệu vi phạm các nguyên tắc của website.",
      "Đội ngũ sáng lập có quyền cập nhật, thay đổi hoặc ngừng một tính năng, điều chỉnh cấu trúc, cách hiển thị hoặc sắp xếp nội dung theo nhu cầu thực tế.",
      "Khi có vấn đề xảy ra, đội ngũ quản trị có nhiệm vụ tiếp nhận thông tin và xử lý kịp thời.",
    ],
  },
];

export function SitePrinciples() {
  return (
    <section className="container-shell pb-20 pt-4 md:pb-24">
      <div className="overflow-hidden rounded-[36px] bg-stone-950 text-white">
        <div className="border-b border-white/10 px-7 py-10 md:px-12 md:py-12">
          <span className="eyebrow !text-orange-400"><ShieldCheck size={13} /> Quy tắc cộng đồng</span>
          <h2 className="mt-4 text-3xl font-black tracking-[-.04em] md:text-5xl">Nguyên tắc chung</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">Website là không gian dành cho fandom nên mọi nội dung được đăng tải cần đảm bảo:</p>
          <ul className="mt-7 grid gap-3 md:grid-cols-2">
            {generalRules.map((rule) => (
              <li key={rule} className="flex gap-3 rounded-2xl bg-white/[.06] px-4 py-3 text-sm leading-6 text-stone-200">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-400" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-7 py-10 md:px-12 md:py-12">
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">Các lưu ý khác</h2>
          <div className="mt-7 grid gap-5">
            {notes.map(({ icon: Icon, title, paragraphs }, index) => (
              <article key={title} className="rounded-[24px] border border-white/10 bg-white/[.04] p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-500 text-white"><Icon size={20} /></span>
                  <div>
                    <h3 className="font-black leading-6"><span className="mr-2 text-orange-400">{index + 1}.</span>{title}</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-400">
                      {paragraphs.map((paragraph) => <li key={paragraph} className="flex gap-3"><span className="mt-2 size-1 shrink-0 rounded-full bg-stone-500" /><span>{paragraph}</span></li>)}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
