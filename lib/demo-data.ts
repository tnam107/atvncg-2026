import type { PublicSubmission } from "@/lib/types";
import { artistCatalog } from "@/lib/guide-catalog";

export const artists = [
  { id: "all", name: "Tất cả Anh Tài" },
  ...artistCatalog.map((artist) => ({ id: artist.slug, name: artist.name })),
];

export const demoLetters: PublicSubmission[] = [
  {
    id: "demo-letter-1",
    type: "LETTER",
    authorName: "Mây Cam",
    targetId: "Tất cả Anh Tài",
    title: null,
    content: "Cảm ơn các anh vì đã cho tụi em thấy rằng bắt đầu lại lúc nào cũng đẹp. Hẹn gặp nhau ở một mùa hè thật rực rỡ!",
    mediaUrl: null,
    mediaType: null,
    likesCount: 126,
    createdAt: "2026-08-28T08:00:00.000Z",
  },
  {
    id: "demo-letter-2",
    type: "LETTER",
    authorName: "Ẩn danh",
    targetId: "Nguyễn Văn Chung",
    title: null,
    content: "Âm nhạc của anh đã ở bên mình trong một giai đoạn rất khó. Mong anh cứ bình yên, tự do và viết thật nhiều bài hát nhé.",
    mediaUrl: null,
    mediaType: null,
    likesCount: 94,
    createdAt: "2026-08-30T12:15:00.000Z",
  },
  {
    id: "demo-letter-3",
    type: "LETTER",
    authorName: "Bắp rang đây",
    targetId: "Hoàng Dũng",
    title: null,
    content: "Một chiếc thư ngắn để nói rằng sân khấu của anh luôn có sức mạnh làm ngày bình thường trở nên đáng nhớ.",
    mediaUrl: null,
    mediaType: null,
    likesCount: 211,
    createdAt: "2026-09-02T17:40:00.000Z",
  },
  {
    id: "demo-letter-4",
    type: "LETTER",
    authorName: "Gai Con Sài Gòn",
    targetId: "Tất cả Anh Tài",
    title: null,
    content: "Điều tuyệt nhất không chỉ là những sân khấu, mà là cách mọi người nâng nhau lên. Cảm ơn vì một cộng đồng thật ấm áp.",
    mediaUrl: null,
    mediaType: null,
    likesCount: 173,
    createdAt: "2026-09-05T09:25:00.000Z",
  },
];

export const demoMemories: PublicSubmission[] = [
  {
    id: "demo-memory-1",
    type: "MEMORY",
    authorName: "Linh Chi",
    targetId: null,
    title: "Một chiều đầy nắng",
    content: "Tấm vé đầu tiên và những người bạn mới quen trong hàng chờ.",
    mediaUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
    mediaType: "IMAGE",
    likesCount: 320,
    createdAt: "2026-08-20T04:30:00.000Z",
  },
  {
    id: "demo-memory-2",
    type: "MEMORY",
    authorName: "Nhà Cam",
    targetId: null,
    title: "Biển lightstick",
    content: "Khoảnh khắc cả khán đài cùng sáng lên — nổi da gà thật sự.",
    mediaUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
    mediaType: "IMAGE",
    likesCount: 486,
    createdAt: "2026-08-25T15:10:00.000Z",
  },
  {
    id: "demo-memory-3",
    type: "MEMORY",
    authorName: "Gai Con Hà Nội",
    targetId: null,
    title: "Cùng hát thật to",
    content: "Thanh xuân có một đêm chúng mình hát đến khản giọng.",
    mediaUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=85",
    mediaType: "IMAGE",
    likesCount: 278,
    createdAt: "2026-09-01T11:00:00.000Z",
  },
  {
    id: "demo-memory-4",
    type: "MEMORY",
    authorName: "An Nhiên",
    targetId: null,
    title: "Góc nhỏ của tụi mình",
    content: "Những chiếc vòng tay tự làm được trao cho người lạ rồi thành người quen.",
    mediaUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85",
    mediaType: "IMAGE",
    likesCount: 199,
    createdAt: "2026-09-04T05:00:00.000Z",
  },
];

export const demoFanmade: PublicSubmission[] = [
  {
    id: "demo-made-1",
    type: "FANMADE",
    authorName: "Cam Vẽ",
    targetId: "Tất cả Anh Tài",
    title: "Poster: Giữ lửa",
    content: "Minh họa thủ công bằng màu gouache, lấy cảm hứng từ sân khấu công diễn.",
    mediaUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85",
    mediaType: "IMAGE",
    likesCount: 401,
    createdAt: "2026-08-21T05:00:00.000Z",
  },
  {
    id: "demo-made-2",
    type: "FANMADE",
    authorName: "Tiệm Len Nhỏ",
    targetId: "Jun Phạm",
    title: "Bộ charm Nhà Cam",
    content: "Một bộ charm làm tay từ đất sét, mỗi chiếc mất khoảng hai giờ hoàn thiện.",
    mediaUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=85",
    mediaType: "IMAGE",
    likesCount: 267,
    createdAt: "2026-08-29T10:00:00.000Z",
  },
  {
    id: "demo-made-3",
    type: "FANMADE",
    authorName: "Thỏ Typography",
    targetId: "Hoàng Dũng",
    title: "Lyric cards",
    content: "Một series chữ vẽ tay cho những câu hát mình yêu thích.",
    mediaUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85",
    mediaType: "IMAGE",
    likesCount: 338,
    createdAt: "2026-09-03T07:30:00.000Z",
  },
];

export const demoCalls: PublicSubmission[] = [
  {
    id: "demo-call-1",
    type: "CALL",
    authorName: "ATVNCG Station",
    targetId: "Tất cả Anh Tài",
    title: "Trạm tiếp sức ngày ghi hình",
    content: "Tụi mình tìm thêm 12 bạn hỗ trợ đóng gói nước và banner. Không nhận quyên góp qua website.",
    mediaUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85",
    mediaType: "IMAGE",
    likesCount: 145,
    createdAt: "2026-09-06T06:30:00.000Z",
  },
  {
    id: "demo-call-2",
    type: "CALL",
    authorName: "Gai Con Đà Nẵng",
    targetId: "Nguyễn Văn Chung",
    title: "Cùng làm banner mừng sinh nhật",
    content: "Mở đăng ký tham gia workshop cắt dán banner. Chi phí tự túc và công khai tại trang dự án.",
    mediaUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=85",
    mediaType: "IMAGE",
    likesCount: 89,
    createdAt: "2026-09-07T13:15:00.000Z",
  },
];

export const demoPending: PublicSubmission[] = [
  {
    id: "demo-pending-1",
    type: "LETTER",
    authorName: "Nắng",
    targetId: "Hà An Huy",
    title: null,
    content: "Chúc anh luôn giữ được nguồn năng lượng thật rực rỡ trên sân khấu!",
    mediaUrl: null,
    mediaType: null,
    status: "PENDING",
    adminNote: null,
    likesCount: 0,
    createdAt: new Date().toISOString(),
  },
];

export function demosFor(type?: string) {
  if (type === "LETTER") return demoLetters;
  if (type === "MEMORY") return demoMemories;
  if (type === "FANMADE") return demoFanmade;
  if (type === "CALL") return demoCalls;
  return [...demoLetters, ...demoMemories, ...demoFanmade, ...demoCalls];
}
