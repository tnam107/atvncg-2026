import type { GuideArtist, GuideEpisode, GuideGlossaryTerm } from "@/lib/types";

type ArtistCatalogItem = Pick<GuideArtist, "slug" | "name" | "imageUrl">;
type GuidePersonCatalogItem = ArtistCatalogItem & {
  category: GuideArtist["category"];
  defaultRole?: string;
};
export type ArtistProfileValue = { role: string | null; content: string; imageUrl: string | null };

const thumbnail = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

const unsortedArtistCatalog: ArtistCatalogItem[] = [
  { slug: "14-casper", name: "14 Casper", imageUrl: thumbnail("VoEyBLQFAjc") },
  { slug: "bb-tran", name: "BB Trần", imageUrl: thumbnail("vaMwZaIomL0") },
  { slug: "cheng", name: "Cheng", imageUrl: thumbnail("Y_lYcYjLuDo") },
  { slug: "dai-nghia", name: "Đại Nghĩa", imageUrl: thumbnail("EQ6ifh-cFLI") },
  { slug: "dinh-manh-ninh", name: "Đinh Mạnh Ninh", imageUrl: thumbnail("hBu_NDazCpU") },
  { slug: "dong-hung", name: "Đông Hùng", imageUrl: thumbnail("bbgtcLzMFVE") },
  { slug: "dung-dt", name: "Dũng DT", imageUrl: thumbnail("hBu_NDazCpU") },
  { slug: "duy-khanh", name: "Duy Khánh", imageUrl: thumbnail("A582UOxVzS8") },
  { slug: "ha-an-huy", name: "Hà An Huy", imageUrl: thumbnail("vd5u3HB1M8c") },
  { slug: "ho-dong-quan", name: "Hồ Đông Quan", imageUrl: thumbnail("sN4KnhGErDo") },
  { slug: "hoang-dung", name: "Hoàng Dũng", imageUrl: thumbnail("HrGahDaAQGA") },
  { slug: "hoang-rob", name: "Hoàng Rob", imageUrl: thumbnail("MefOOqlg3-k") },
  { slug: "hoang-ton", name: "Hoàng Tôn", imageUrl: thumbnail("Bq3XICXUnsc") },
  { slug: "huynh-lap", name: "Huỳnh Lập", imageUrl: thumbnail("qfsT50xdL54") },
  { slug: "its-charles", name: "It's Charles.", imageUrl: thumbnail("am7nKU_oe20") },
  { slug: "jun-pham", name: "Jun Phạm", imageUrl: thumbnail("2JCZ-4Pe1OE") },
  { slug: "ko", name: "K.O", imageUrl: thumbnail("BxXvOQ-QRZ8") },
  { slug: "le-xuan-tien", name: "Lê Xuân Tiền", imageUrl: thumbnail("FOtLd3iPXHo") },
  { slug: "mew-amazing", name: "Mew Amazing", imageUrl: thumbnail("h6PZyXkwOBA") },
  { slug: "neko-le", name: "Neko Lê", imageUrl: thumbnail("OLkUCPVfOGM") },
  { slug: "nguyen-van-chung", name: "Nguyễn Văn Chung", imageUrl: thumbnail("ht_vuV_pwzg") },
  { slug: "osad", name: "OSAD", imageUrl: thumbnail("hmbTtqZahBE") },
  { slug: "phung-minh-cuong", name: "Phùng Minh Cương", imageUrl: thumbnail("ZDKD-GRSebs") },
  { slug: "thai-le-minh-hieu", name: "Thái Lê Minh Hiếu", imageUrl: thumbnail("hmbTtqZahBE") },
  { slug: "thai-vg", name: "Thái VG", imageUrl: thumbnail("Y_lYcYjLuDo") },
  { slug: "thanh-duy", name: "Thanh Duy", imageUrl: thumbnail("rtW_ZLcWAuM") },
  { slug: "tho-da-lab", name: "Thỏ (Da LAB)", imageUrl: thumbnail("hWURkvQrYf0") },
  { slug: "thom-da-lab", name: "Thơm (Da LAB)", imageUrl: thumbnail("h5T0G5qJqD8") },
  { slug: "thuan-nguyen", name: "Thuận Nguyễn", imageUrl: thumbnail("-g30VMzxUOI") },
  { slug: "toki-thanh-tho", name: "Toki Thành Thỏ", imageUrl: thumbnail("PoLKnITsmRg") },
  { slug: "trinh-thang-binh", name: "Trịnh Thăng Bình", imageUrl: thumbnail("8OC1ymaMDso") },
  { slug: "tung-mint", name: "Tùng Mint", imageUrl: thumbnail("dntl-_LXI4k") },
  { slug: "vuong-anh-tu", name: "Vương Anh Tú", imageUrl: thumbnail("W4fovV6KXPU") },
  { slug: "will", name: "Will", imageUrl: thumbnail("e5YzcF-c22M") },
];

export const artistCatalog: GuidePersonCatalogItem[] = [...unsortedArtistCatalog]
  .sort((a, b) => a.name.localeCompare(b.name, "vi"))
  .map((artist) => ({ ...artist, category: "ARTIST" }));

export const crewCatalog: GuidePersonCatalogItem[] = [
  {
    slug: "mc-anh-tuan",
    name: "Anh Tuấn",
    imageUrl: thumbnail("8gPXKl3BpMc"),
    category: "CREW" as const,
    defaultRole: "MC",
  },
  {
    slug: "dao-dien-dinh-ha-uyen-thu",
    name: "Đinh Hà Uyên Thư",
    imageUrl: thumbnail("AXCczcyNCoQ"),
    category: "CREW" as const,
    defaultRole: "Đạo diễn sân khấu",
  },
  {
    slug: "giam-doc-am-nhac-slimv",
    name: "SlimV",
    imageUrl: thumbnail("JHz8XPUO8Bk"),
    category: "CREW" as const,
    defaultRole: "Giám đốc âm nhạc",
  },
  {
    slug: "mc-tran-ngoc",
    name: "Trần Ngọc",
    imageUrl: thumbnail("dXkw0uMUBYs"),
    category: "CREW" as const,
    defaultRole: "MC",
  },
].sort((a, b) => a.name.localeCompare(b.name, "vi"));

export const guidePeopleCatalog = [...artistCatalog, ...crewCatalog];

export const seedArtistProfiles: Record<string, ArtistProfileValue> = {
  "ha-an-huy": {
    role: "Ca sĩ · Nhạc sĩ",
    imageUrl: null,
    content:
      "Giọng ca trẻ mang màu sắc tự sự, bước vào hành trình 2026 với tinh thần khám phá và làm mới chính mình.",
  },
  "hoang-dung": {
    role: "Ca sĩ · Nhạc sĩ",
    imageUrl: null,
    content:
      "Một nghệ sĩ kể chuyện bằng âm nhạc, được yêu mến qua những sáng tác giàu cảm xúc và cách trình diễn gần gũi.",
  },
  "jun-pham": {
    role: "Ca sĩ · Diễn viên",
    imageUrl: null,
    content:
      "Trở lại hành trình Chông Gai với tâm thế nhẹ nhàng hơn, Jun Phạm tiếp tục mang đến năng lượng kết nối và sự chỉn chu trên sân khấu.",
  },
  "nguyen-van-chung": {
    role: "Nhạc sĩ · Ca sĩ",
    imageUrl: null,
    content:
      "Người đứng sau nhiều ca khúc quen thuộc của V-Pop, đến với chương trình để bước ra khỏi vùng an toàn và thử sức ở một vai trò mới.",
  },
};

export const seedGlossary: GuideGlossaryTerm[] = [
  {
    id: "seed-gai-con",
    term: "Gai Con",
    definition: "Tên gọi thân thương của cộng đồng người hâm mộ chương trình.",
    sortOrder: 1,
  },
  {
    id: "seed-tha-lua",
    term: "Thả lửa",
    definition: "Cách tụi mình gửi một chút nhiệt thành đến bài viết yêu thích.",
    sortOrder: 2,
  },
  {
    id: "seed-nha",
    term: "Nhà",
    definition: "Nhóm đồng hành của các Anh Tài qua từng công diễn.",
    sortOrder: 3,
  },
  {
    id: "seed-chong-gai",
    term: "Chông gai",
    definition: "Thử thách để cùng nhau trưởng thành - và cũng là nơi kỷ niệm bắt đầu.",
    sortOrder: 4,
  },
];

const episodeSeed = [
  [1, "dXkw0uMUBYs", "34 Anh Tài · Hành trình bắt đầu", "Hành trình cổ tích của những người hùng chính thức mở màn."],
  [2, "8gPXKl3BpMc", "Cuộc chiến của 6 nhóm Anh Tài", "Công diễn hội ngộ khép lại với những màn so tài đầu tiên."],
  [3, "AXCczcyNCoQ", "Công diễn 1 mở màn", "Bảng đấu đầu tiên bắt đầu định đoạt số phận các Nhà."],
  [4, "snc1rgD5W1M", "Ẩn số bảng đấu Hắc Mã", "Những ẩn số được khán giả chờ đợi bước lên sân khấu."],
  [5, "ESz__7Pdyf8", "Chuyến ngoại khóa", "Một khoảng nghỉ sung sướng và thoải mái của các Anh Tài."],
  [6, "qP0PAjdfH0s", "Mã phi nước đại", "Các Anh Tài vươn mình trong chặng thử thách mới."],
  [7, "pA3Orr6rrAM", "Khởi tranh đối kháng 2", "Những màn đấu đối kháng bùng nổ chính thức bắt đầu."],
  [8, "5UWUMDjtpMM", "Công diễn 3 · Sáu X-Song", "Sáu ca khúc hoàn toàn mới được trình diễn tại Công diễn 3."],
  [9, "exR2qh0zFCA", "Công diễn 3 · Chặng cuối", "Năm tiết mục còn lại hoàn thiện một đêm Công diễn bùng nổ."],
  [10, "WS453nhIJ7g", "Ba Anh Tài K24 tái ngộ", "Công diễn 4 chính thức khai màn với một cuộc hội ngộ đặc biệt."],
] as const;

export const seedEpisodes: GuideEpisode[] = episodeSeed.map(
  ([episodeNumber, videoId, title, description]) => ({
    id: `seed-episode-${episodeNumber}`,
    episodeNumber,
    title,
    description,
    imageUrl: thumbnail(videoId),
    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
  }),
);
