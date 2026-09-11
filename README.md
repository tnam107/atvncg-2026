# ATVNCG 2026 Fandom Hub

Website UGC cộng đồng cho **Anh Trai Vượt Ngàn Chông Gai 2026**, xây bằng Next.js App Router, TypeScript, Tailwind CSS, Prisma/PostgreSQL và Cloudinary.

## Chạy local với database lưu thật

```bash
pnpm install
copy .env.example .env
pnpm db:generate
pnpm dev
```

Trên Windows PowerShell có execution policy chặn `pnpm.ps1`, dùng `pnpm.cmd` thay cho `pnpm`.

Khi chưa có `DATABASE_URL`, local dùng SQLite tại `data/atvncg-local.sqlite`; bài gửi và mọi thay đổi trong admin vẫn còn sau khi khởi động lại server. Khi deploy, ứng dụng bắt buộc dùng PostgreSQL qua `DATABASE_URL`. Form có media cần cấu hình Cloudinary.

Hướng dẫn đầy đủ từ GitHub đến link website công khai: [DEPLOYMENT.md](./DEPLOYMENT.md).

## Cấu hình production

1. Tạo PostgreSQL miễn phí trên Neon hoặc Supabase và điền `DATABASE_URL`.
2. Chạy `pnpm db:deploy` để áp dụng migration PostgreSQL đã commit.
3. Tạo Cloudinary account, điền `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` và `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`. Upload signed sẽ đi thẳng từ trình duyệt lên Cloudinary.
4. Đặt `ADMIN_PASSWORD` dài, duy nhất và `ADMIN_SESSION_SECRET` ngẫu nhiên tối thiểu 32 ký tự.
5. Đặt `NEXT_PUBLIC_NEXT_EPISODE_AT` thành thời gian phát sóng ISO-8601.
6. Deploy lên Vercel/Render và thêm toàn bộ biến môi trường ở dashboard của nền tảng.

Local development có mật khẩu quản trị dự phòng `ATVNCG2026!admin`; production không chấp nhận mật khẩu dự phòng nếu thiếu biến môi trường.

## Luồng nội dung

- Khách chọn biệt danh hoặc Ẩn danh, được lưu trong `localStorage`.
- Mọi bài mới luôn có trạng thái `PENDING`.
- Admin đăng nhập tại `/admin` qua cookie HttpOnly có chữ ký, sau đó duyệt, từ chối kèm lý do hoặc xóa.
- Admin quản lý đồng bộ Sổ tay Anh Tài, Từ điển Gai Con và Series phát sóng ngay trong `/admin`.
- API công khai chỉ trả nội dung `APPROVED`.
- Media không ghi vào filesystem; trình duyệt upload trực tiếp lên Cloudinary.

## Lưu ý trước khi public

- Thêm tập phát sóng mới trong `/admin`; website chỉ hiển thị ảnh đại diện và mở video ngoài YouTube.
- Thêm CAPTCHA hoặc rate limiter dùng Redis/Upstash nếu lưu lượng lớn; limiter hiện tại là lớp bảo vệ nhẹ trong từng process.
- Cấu hình giới hạn file, định dạng và moderation trong Cloudinary upload preset/account.
- Chỉ sử dụng hình ảnh và liên kết video có quyền khai thác phù hợp.
