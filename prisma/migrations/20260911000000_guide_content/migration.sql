-- CreateTable
CREATE TABLE "ArtistGuide" (
    "id" TEXT NOT NULL,
    "artistSlug" TEXT NOT NULL,
    "role" TEXT,
    "imageUrl" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ArtistGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpisodeGuide" (
    "id" TEXT NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EpisodeGuide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistGuide_artistSlug_key" ON "ArtistGuide"("artistSlug");
CREATE UNIQUE INDEX "GlossaryTerm_term_key" ON "GlossaryTerm"("term");
CREATE INDEX "GlossaryTerm_sortOrder_idx" ON "GlossaryTerm"("sortOrder");
CREATE UNIQUE INDEX "EpisodeGuide_episodeNumber_key" ON "EpisodeGuide"("episodeNumber");
CREATE INDEX "EpisodeGuide_episodeNumber_idx" ON "EpisodeGuide"("episodeNumber");

-- Seed a few existing handbook entries. The remaining artists intentionally open with an empty state.
INSERT INTO "ArtistGuide" ("id", "artistSlug", "role", "imageUrl", "content", "createdAt", "updatedAt") VALUES
('seed-guide-ha-an-huy', 'ha-an-huy', 'Ca sĩ · Nhạc sĩ', NULL, 'Giọng ca trẻ mang màu sắc tự sự, bước vào hành trình 2026 với tinh thần khám phá và làm mới chính mình.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-guide-hoang-dung', 'hoang-dung', 'Ca sĩ · Nhạc sĩ', NULL, 'Một nghệ sĩ kể chuyện bằng âm nhạc, được yêu mến qua những sáng tác giàu cảm xúc và cách trình diễn gần gũi.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-guide-jun-pham', 'jun-pham', 'Ca sĩ · Diễn viên', NULL, 'Trở lại hành trình Chông Gai với tâm thế nhẹ nhàng hơn, Jun Phạm tiếp tục mang đến năng lượng kết nối và sự chỉn chu trên sân khấu.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-guide-nguyen-van-chung', 'nguyen-van-chung', 'Nhạc sĩ · Ca sĩ', NULL, 'Người đứng sau nhiều ca khúc quen thuộc của V-Pop, đến với chương trình để bước ra khỏi vùng an toàn và thử sức ở một vai trò mới.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "GlossaryTerm" ("id", "term", "definition", "sortOrder", "createdAt", "updatedAt") VALUES
('seed-gai-con', 'Gai Con', 'Tên gọi thân thương của cộng đồng người hâm mộ chương trình.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-tha-lua', 'Thả lửa', 'Cách tụi mình gửi một chút nhiệt thành đến bài viết yêu thích.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-nha', 'Nhà', 'Nhóm đồng hành của các Anh Tài qua từng công diễn.', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-chong-gai', 'Chông gai', 'Thử thách để cùng nhau trưởng thành — và cũng là nơi kỷ niệm bắt đầu.', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "EpisodeGuide" ("id", "episodeNumber", "title", "description", "imageUrl", "youtubeUrl", "createdAt", "updatedAt") VALUES
('seed-episode-1', 1, '34 Anh Tài · Hành trình bắt đầu', 'Hành trình cổ tích của những người hùng chính thức mở màn.', 'https://i.ytimg.com/vi/dXkw0uMUBYs/hqdefault.jpg', 'https://www.youtube.com/watch?v=dXkw0uMUBYs', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-episode-2', 2, 'Cuộc chiến của 6 nhóm Anh Tài', 'Công diễn hội ngộ khép lại với những màn so tài đầu tiên.', 'https://i.ytimg.com/vi/8gPXKl3BpMc/hqdefault.jpg', 'https://www.youtube.com/watch?v=8gPXKl3BpMc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-episode-3', 3, 'Công diễn 1 mở màn', 'Bảng đấu đầu tiên bắt đầu định đoạt số phận các Nhà.', 'https://i.ytimg.com/vi/AXCczcyNCoQ/hqdefault.jpg', 'https://www.youtube.com/watch?v=AXCczcyNCoQ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-episode-4', 4, 'Ẩn số bảng đấu Hắc Mã', 'Những ẩn số được khán giả chờ đợi bước lên sân khấu.', 'https://i.ytimg.com/vi/snc1rgD5W1M/hqdefault.jpg', 'https://www.youtube.com/watch?v=snc1rgD5W1M', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-episode-5', 5, 'Chuyến ngoại khóa', 'Một khoảng nghỉ sung sướng và thoải mái của các Anh Tài.', 'https://i.ytimg.com/vi/ESz__7Pdyf8/hqdefault.jpg', 'https://www.youtube.com/watch?v=ESz__7Pdyf8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-episode-6', 6, 'Mã phi nước đại', 'Các Anh Tài vươn mình trong chặng thử thách mới.', 'https://i.ytimg.com/vi/qP0PAjdfH0s/hqdefault.jpg', 'https://www.youtube.com/watch?v=qP0PAjdfH0s', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-episode-7', 7, 'Khởi tranh đối kháng 2', 'Những màn đấu đối kháng bùng nổ chính thức bắt đầu.', 'https://i.ytimg.com/vi/pA3Orr6rrAM/hqdefault.jpg', 'https://www.youtube.com/watch?v=pA3Orr6rrAM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-episode-8', 8, 'Công diễn 3 · Sáu X-Song', 'Sáu ca khúc hoàn toàn mới được trình diễn tại Công diễn 3.', 'https://i.ytimg.com/vi/5UWUMDjtpMM/hqdefault.jpg', 'https://www.youtube.com/watch?v=5UWUMDjtpMM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-episode-9', 9, 'Công diễn 3 · Chặng cuối', 'Năm tiết mục còn lại hoàn thiện một đêm Công diễn bùng nổ.', 'https://i.ytimg.com/vi/exR2qh0zFCA/hqdefault.jpg', 'https://www.youtube.com/watch?v=exR2qh0zFCA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('seed-episode-10', 10, 'Ba Anh Tài K24 tái ngộ', 'Công diễn 4 chính thức khai màn với một cuộc hội ngộ đặc biệt.', 'https://i.ytimg.com/vi/WS453nhIJ7g/hqdefault.jpg', 'https://www.youtube.com/watch?v=WS453nhIJ7g', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
